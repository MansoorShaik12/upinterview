// index.js
const express = require('express');
const connectDB = require('./db.js');
const Candidate = require('./models/candidate.js');
const Position = require('./models/position.js');
const Team = require('./models/team.js');
const Assessment = require('./models/assessment.js');
const HigherQualification = require('./models/higherqualification.js');
const University_CollegeName = require('./models/college.js')
const Skills = require('./models/skills.js');
const Company = require('./models/company.js');
const Location = require('./models/locations.js');
const Industry = require('./models/industries.js');
const { Interview, InterviewHistory } = require('./models/Interview.js');
const ScheduleRounds = require('./models/ScheduleRounds');
const { NewQuestion, QuestionOption } = require('./models/NewQuestion.js');
const Notifications = require('./models/notification.js');
const { MockInterview, MockInterviewHistory } = require('./models/mockinterview.js');
const TeamAvailability = require('./models/teamsavailability.js');
const bodyParser = require('body-parser');
const LoginBasicDetails1 = require('./models/LoginBasicDetails1.js');
const LoginAdditionalDetails = require('./models/LoginAdditionalDetails.js');
const LoginBasicDetails2 = require('./models/LoginBasicDetails2.js');
const LoginAvailability = require('./models/LoginAvailability.js');
const LinkedInDetails = require('./models/LinkedInDetails');
const { Contacts, ContactHistory } = require('./models/Contacts.js')
const { Users, UserHistory } = require("./models/Users.js")
const nodemailer = require('nodemailer');
const multer = require('multer');
const { SuggestedQuestion } = require('./models/SuggestedQuestion.js');
const TechnologyMaster = require('./models/TechnologyMaster.js');
const RoleMaster = require('./models/RoleMaster.js');
const LocationMaster = require('./models/LocationMaster.js');
const path = require('path');
const fs = require('fs');

const jwt = require('jsonwebtoken');
const { exec } = require('child_process');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(bodyParser.json());
// app.use(cors());
app.use(cors({
  origin: 'http://localhost:3002'
}));
connectDB();
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const SECRET_KEY = 'vpaas-magic-cookie-019af5b8e9c74f42a44947ee0c08572d';
const TOKEN_EXPIRATION = '1h';
app.get('/generate-token', (req, res) => {
  const payload = {
    // Add your payload data here
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });
  res.json({ token });
});

// Add this route to handle the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Interview App API');
});

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
    } catch (error) {
      console.error('Error handling message:', error);
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
    }
  });
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
  ws.on('close', () => {
    
  });
});

const broadcastImageData = async (type, id) => {
  let updatedDocument;
  switch (type) {
    case 'candidate':
      updatedDocument = await Candidate.findById(id);
      break;
    case 'team':
      updatedDocument = await Team.findById(id);
      break;
    case 'user':
      updatedDocument = await Users.findById(id);
      break;
    case 'contact':
      updatedDocument = await Contacts.findById(id);
      break;
    default:
      return;
  }
  if (updatedDocument) {
    broadcastData('image', { type, data: updatedDocument });
  }
};

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Routes
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { file, body } = req;
    if (!file && !body.imageUrl) {
      return res.status(400).send('No file uploaded.');
    }

    let updatedDocument;
    const imageData = file ? {
      filename: file.filename,
      path: file.path,
      contentType: file.mimetype,
    } : {
      filename: 'linkedin_image',
      path: body.imageUrl,
      contentType: 'image/jpeg',
    };

    if (body.type === 'candidate') {
      updatedDocument = await Candidate.findByIdAndUpdate(body.id, { ImageData: imageData }, { new: true });
    } else if (body.type === 'team') {
      updatedDocument = await Team.findByIdAndUpdate(body.id, { ImageData: imageData }, { new: true });
    } else if (body.type === 'user') {
      updatedDocument = await Users.findByIdAndUpdate(body.id, { ImageData: imageData }, { new: true });
    } else if (body.type === 'contact') {
      updatedDocument = await Contacts.findByIdAndUpdate(body.id, { ImageData: imageData }, { new: true });
    } else {
      return res.status(400).send('Invalid type.');
    }

    if (!updatedDocument) {
      return res.status(404).send('Document not found.');
    }

    res.json({
      ...updatedDocument.toObject(),
      imageUrl: `http://localhost:3000/${updatedDocument.ImageData.path.replace(/\\/g, '/')}`
    });

    broadcastImageData(body.type, body.id); // Broadcast image data update
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).send('Server error');
  }
});

app.delete('/candidate/:id/image', async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).send('Candidate not found.');
    }

    candidate.ImageData = undefined;
    await candidate.save();

    if (candidate.ImageData && candidate.ImageData.path) {
      fs.unlink(candidate.ImageData.path, (err) => {
        if (err) {
          console.error('Error deleting image file:', err);
        }
      });
    }

    res.status(200).send('Image deleted successfully.');
    broadcastImageData('candidate', id); // Broadcast image data update
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).send('Server error');
  }
});

app.delete('/team/:id/image', async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).send('Team not found.');
    }

    const imagePath = team.ImageData?.path;
    team.ImageData = undefined;
    await team.save();

    if (imagePath) {
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error deleting image file:', err);
        }
      });
    }

    res.status(200).send('Image deleted successfully.');
    broadcastImageData('team', id); // Broadcast image data update
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).send('Server error');
  }
});
app.get('/images/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findById(id);
    const team = await Team.findById(id);
    const user = await Users.findById(id);
    const contact = await Contacts.findById(id);

    const image = candidate?.ImageData || team?.ImageData || user?.ImageData || contact?.ImageData;

    if (image) {
      res.sendFile(path.resolve(__dirname, image.path));
    } else {
      res.status(404).send('Image not found');
    }
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send('Server error');
  }
});

// ------------------------------  video call start ------------------------------
const http = require('http');

const socketIo = require('socket.io');

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const io = require('socket.io')(3001, { cors: true });

const rooms = {};

io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId, userName) => {
    const isAdmin = !rooms[roomId];
    if (!rooms[roomId]) {
      rooms[roomId] = { admin: userId, participants: [] };
    }
    rooms[roomId].participants.push({ userId, userName, muted: false, videoOn: false });
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('user-connected', { userId, userName, isAdmin: false });
    socket.emit('admin-status', { userId, isAdmin });
    io.to(roomId).emit('participant-list', rooms[roomId].participants);
    socket.on('toggle-mic', (userId, muted) => {
      if (rooms[roomId]) {
        const participant = rooms[roomId].participants.find(p => p.userId === userId);
        if (participant) {
          participant.muted = muted;
          io.to(roomId).emit('participant-list', rooms[roomId].participants);
        }
      }
    });
    socket.on('toggle-video', (userId, videoOn) => {
      if (rooms[roomId]) {
        const participant = rooms[roomId].participants.find(p => p.userId === userId);
        if (participant) {
          participant.videoOn = videoOn;
          io.to(roomId).emit('participant-list', rooms[roomId].participants);
        }
      }
    });

    socket.on('send-message', ({ roomId, userName, message }) => {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const msg = { sender: userName, text: message, time };
      io.to(roomId).emit('receive-message', msg);
    });

    socket.on('disconnect', () => {
      if (rooms[roomId] && rooms[roomId].admin === userId) {
        io.to(roomId).emit('end-call');
        delete rooms[roomId];
      } else {
        socket.broadcast.to(roomId).emit('user-disconnected', userId);
        if (rooms[roomId]) {
          rooms[roomId].participants = rooms[roomId].participants.filter(participant => participant.userId !== userId);
          io.to(roomId).emit('participant-list', rooms[roomId].participants);
        }
      }
    });

    socket.on('sending-signal', (payload) => {
      io.to(payload.userToSignal).emit('receiving-signal', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on('returning-signal', (payload) => {
      io.to(payload.callerID).emit('receiving-returned-signal', { signal: payload.signal, id: socket.id });
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// ------------------------------  video call end ------------------------------

// locations data
app.get('/locations', async (req, res) => {
  try {
    const LocationNames = await LocationMaster.find({}, 'LocationName TimeZone');
    res.json(LocationNames);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// reaload
const broadcastData = (type, data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type, data }));
    }
  });
};

app.get('/loginavailability/:userId', async (req, res) => {
  try {
    const availability = await LoginAvailability.find({ contact: req.params.userId });
    if (!availability) {
      return res.status(404).json({ message: 'Availability not found' });
    }
    res.json(availability);
  } catch (err) {
    console.error('Error fetching availability:', err);
    res.status(500).json({ message: err.message });
  }
});

app.post('/loginavailability', async (req, res) => {
  const { day, timeSlots, contact } = req.body;
   // Log the received data

  const availability = new LoginAvailability({ day, timeSlots, contact });
  try {
    const newAvailability = await availability.save();
    res.status(201).json(newAvailability);
    broadcastData('loginavailability', await LoginAvailability.find());
  } catch (err) {
    console.error("Error saving availability:", err);
    res.status(400).json({ message: err.message });
  }
});

app.put('/loginavailability/:id', async (req, res) => {
  try {
    const { day, timeSlots } = req.body;
    const availability = await LoginAvailability.findByIdAndUpdate(
      req.params.id,
      { day, timeSlots },
      { new: true }
    );
    if (!availability) {
      return res.status(404).json({ message: 'Availability not found' });
    }
    res.json(availability);
    broadcastData('loginavailability', await LoginAvailability.find());
  } catch (err) {
    console.error("Error updating availability:", err);
    res.status(400).json({ message: err.message });
  }
});


// candidate
app.get('/candidate', async (req, res) => {
  const { createdBy } = req.query;
  try {
    const candidates = await Candidate.find({ createdBy });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching candidates', error });
  }
});

app.post('/candidate', async (req, res) => {
  try {
    const { FirstName, LastName, Email, Phone, Date_Of_Birth, Gender, HigherQualification, UniversityCollege, CurrentExperience, skills, Position, PositionId, createdBy } = req.body;

    if (!createdBy) {
      return res.status(400).json({ error: "createdBy field is required" });
    }

    const newCandidate = new Candidate({
      FirstName,
      LastName,
      Email,
      Phone,
      Date_Of_Birth,
      Gender,
      HigherQualification,
      UniversityCollege,
      CurrentExperience,
      skills,
      Position,
      PositionId,
      createdBy,
    });

    await newCandidate.save();
    res.status(201).json(newCandidate);
    const candidates = await Candidate.find({ createdBy });
    broadcastData('candidate', candidates);
  } catch (error) {
    console.error('Error creating candidate:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/candidate/:id', async (req, res) => {
  const candidateId = req.params.id;
  const { FirstName, LastName, Email, Phone, Date_Of_Birth, Gender, HigherQualification, UniversityCollege, CurrentExperience, skills, Position, PositionId, createdBy } = req.body;
  try {
    const updatedCandidate = await Candidate.findByIdAndUpdate(candidateId, {
      FirstName,
      LastName,
      Email,
      Phone,
      Date_Of_Birth,
      Gender,
      HigherQualification,
      UniversityCollege,
      CurrentExperience,
      skills,
      Position,
      PositionId
    }, { new: true });
    if (!updatedCandidate) {
      return res.status(404).json({ message: "Candidate not found." });
    }
    res.status(200).json(updatedCandidate);
    const candidates = await Candidate.find({ createdBy });
    broadcastData('candidate', candidates);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// position
app.get('/position', async (req, res) => {
  const { CreatedBy } = req.query;
  try {
    const positions = await Position.find({ CreatedBy });
    res.json(positions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/position/:id', async (req, res) => {
  try {
    const position = await Position.findById(req.params.id);
    if (!position) {
      return res.status(404).json({ message: 'Position not found' });
    }
    res.json(position);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/position', async (req, res) => {
  const { title, companyname, jobdescription, minexperience, maxexperience, date, skills, additionalnotes, rounds, CreatedBy } = req.body;
  if (!CreatedBy) {
    return res.status(400).json({ error: "createdBy field is required" });
  }
  const position = new Position({
    title,
    companyname,
    jobdescription,
    minexperience,
    maxexperience,
    date,
    skills,
    additionalnotes,
    rounds,
    CreatedBy
  });

  try {
    const newPosition = await position.save();
    res.status(201).json(newPosition);
    const positions = await Position.find({ CreatedBy });
    broadcastData('position', positions);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/position/:id', async (req, res) => {
  const positionId = req.params.id;
  const { title, companyname, jobdescription, minexperience, maxexperience, skills, additionalnotes, rounds, CreatedBy } = req.body;

  try {
    const updatedPosition = await Position.findByIdAndUpdate(positionId, {
      title,
      companyname,
      jobdescription,
      minexperience,
      maxexperience,
      skills,
      additionalnotes,
      rounds
    }, { new: true });

    if (!updatedPosition) {
      return res.status(404).json({ message: "Position not found." });
    }

    res.status(200).json(updatedPosition);
    const positions = await Position.find({ CreatedBy });
    broadcastData('position', positions);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post('/position/check', async (req, res) => {
  const { title, companyname, experience } = req.body;

  try {
    const existingPosition = await Position.findOne({
      title,
      companyname,
      experience,
    });

    if (existingPosition) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking position:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/team', async (req, res) => {
  const { CreatedBy } = req.query;
  try {
    const teams = await Team.find({ CreatedBy });
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/team', async (req, res) => {
  try {
    const team = new Team({ ...req.body, CreatedBy: req.body.CreatedBy });
    const savedTeam = await team.save();
    res.status(201).json(savedTeam);
    const teams = await Team.find({ CreatedBy: req.body.CreatedBy });
    broadcastData('team', teams);
  } catch (error) {
    console.error("Error creating team or availability:", error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message, errors: error.errors });
    }

    res.status(500).json({ message: "Internal server error" });
  }
});

app.put('/team/:id', async (req, res) => {
  const { _id, FirstName, LastName, Email, Phone, CompanyName, Technology, Location, CurrentRole, skills, CreatedBy } = req.body;
  if (_id) {
    try {
      const updatedTeam = await Team.findByIdAndUpdate(_id, {
        FirstName,
        LastName,
        Email,
        Phone,
        CompanyName,
        Technology,
        Location,
        CurrentRole,
        skills
      }, { new: true });
      if (!updatedTeam) {
        return res.status(404).json({ message: "Team not found." });
      }
      res.status(200).json(updatedTeam);
      const teams = await Team.find({ CreatedBy });
      broadcastData('team', teams);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } else {
    const team = new Team({
      FirstName,
      LastName,
      Email,
      Phone,
      CompanyName,
      Technology,
      Location,
      CurrentRole,
      skills
    });

    try {
      const newTeam = await team.save();
      res.status(201).json(newTeam);
      const teams = await Team.find({ CreatedBy });
      broadcastData('team', teams);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
});

app.get('/teamavailability', async (req, res) => {
  try {
    const teamAvailabilities = await TeamAvailability.find();
    res.json(teamAvailabilities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/teamavailability', async (req, res) => {
  const { TeamId, Availability } = req.body;
  if (!TeamId || !Availability) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const teamAvailability = new TeamAvailability({
    TeamId,
    Availability,
  });

  try {
    const savedAvailability = await teamAvailability.save();
    res.status(201).json(savedAvailability);
  } catch (err) {
    console.error("Error saving availability:", err);
    res.status(400).json({ message: err.message });
  }
});

app.put('/teamavailability', async (req, res) => {
  const { TeamId, Availability } = req.body;

  if (!TeamId || !Availability) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const updatedAvailability = await TeamAvailability.findOneAndUpdate(
      { TeamId },
      { Availability },
      { new: true, upsert: true }
    );

    res.status(200).json(updatedAvailability);
  } catch (err) {
    console.error("Error updating availability:", err);
    res.status(500).json({ message: err.message });
  }
});

app.get('/team/:id/availability', async (req, res) => {
  try {
    const { id } = req.params;
    const availability = await TeamAvailability.findOne({ TeamId: id });
    if (!availability) {
      return res.status(404).json({ message: "Availability not found." });
    }
    res.json(availability);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// app.get('/assessment/:id?', async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (id) {
//       const assessment = await Assessment.findById(id);
//       if (!assessment) {
//         return res.status(404).json({ message: 'Assessment not found' });
//       }
//       res.json(assessment);
//     } else {
//       const assessments = await Assessment.find();
//       res.json(assessments);
//     }
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

app.get('/assessment', async (req, res) => {
  try {
    const { createdBy } = req.query;
    const query = createdBy ? { CreatedBy: createdBy } : {};
    const assessments = await Assessment.find(query);
    res.json(assessments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/assessment', async (req, res) => {
  try {
    const assessment = new Assessment(req.body);
    await assessment.save();
    res.status(201).json(assessment);
    const assessments = await Assessment.find({ CreatedBy: req.body.CreatedBy });
    broadcastData('assessment', assessments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/assessment/:assessmentId/section', async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    const section = req.body;
    assessment.Sections.push(section);
    await assessment.save();
    res.status(201).json(section);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/assessment/:assessmentId/section/:sectionId/question', async (req, res) => {
  try {
    const { assessmentId, sectionId } = req.params;
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    const section = assessment.Sections.id(sectionId);
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }
    const question = req.body;
    section.Questions.push({
      ...question,
      Options: question.Options || [], // Ensure Options is an array
      ProgrammingDetails: question.ProgrammingDetails || null // Ensure ProgrammingDetails is handled
    });
    await assessment.save();
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/assessment/:id', async (req, res) => {
  const { id } = req.params;
  const { AssessmentTitle, AssessmentType, Position, Duration, DifficultyLevel, NumberOfQuestions, ExpiryDate, Sections, ModifiedBy, ModifiedDate, CreatedBy } = req.body;

  try {
    const updatedAssessment = await Assessment.findByIdAndUpdate(
      id,
      {
        AssessmentTitle,
        AssessmentType,
        Position,
        Duration,
        DifficultyLevel,
        NumberOfQuestions,
        ExpiryDate,
        Sections,
        ModifiedBy,
        ModifiedDate,
      },
      { new: true }
    );

    if (!updatedAssessment) {
      return res.status(404).json({ message: "Assessment not found." });
    }

    res.status(200).json(updatedAssessment);
    const assessments = await Assessment.find({ CreatedBy });
    broadcastData('assessment', assessments);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
app.post('/update-candidates', async (req, res) => {
  const { assessmentId, candidateIds } = req.body;
  try {
    const assessment = await Assessment.findByIdAndUpdate(
      assessmentId,
      { $addToSet: { CandidateIds: { $each: candidateIds } } },
      { new: true }
    );
    res.status(200).json(assessment);

  } catch (error) {
    res.status(500).json({ error: 'Error updating candidate IDs' });
  }
});
app.get('/candidate/:candidateId', async (req, res) => {
  const { candidateId } = req.params;
  try {
    const candidate = await Candidate.findById(candidateId);
    res.status(200).json(candidate);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching candidate data' });
  }
});

// for assessment test
app.get('/assessment/:assessmentId/sections', async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const assessment = await Assessment.findById(assessmentId).populate('Sections');
    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    res.status(200).json(assessment.Sections);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/assessment/:assessmentId/questions', async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const assessment = await Assessment.findById(assessmentId).populate('Sections.Questions');
    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    const questions = assessment.Sections.flatMap(section => section.Questions);
    res.status(200).json(questions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// qualitfication
app.get('/qualification', async (req, res) => {
  try {
    const higherqualifications = await HigherQualification.find({}, 'QualificationName');
    res.json(higherqualifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// universitycollege
app.get('/universitycollege', async (req, res) => {
  try {
    const universityCollegeNames = await University_CollegeName.find({}, 'University_CollegeName');
    res.json(universityCollegeNames);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/skills', async (req, res) => {
  try {
    const skills = await Skills.find({});
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// company data
app.get('/company', async (req, res) => {
  try {
    const CompanyNames = await Company.find({});
    res.json(CompanyNames);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// locations data
app.get('/locations', async (req, res) => {
  try {
    const LocationNames = await LocationMaster.find({});
    res.json(LocationNames);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Industry data
app.get('/industries', async (req, res) => {
  try {
    const IndustryNames = await Industry.find({});
    res.json(IndustryNames);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//role
app.get('/roles', async (req, res) => {
  try {
    const roles = await RoleMaster.find({});
    res.json(roles);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/technology', async (req, res) => {
  try {
    const technology = await TechnologyMaster.find({});
    res.json(technology);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// interview

app.post('/interview', async (req, res) => {
  const { Candidate, Position, Status, ScheduleType, rounds, candidateImageUrl, Interviewstype, CreatedBy } = req.body;
  try {
    const roundIds = await Promise.all(rounds.map(async (round) => {
      const newRound = new ScheduleRounds({
        round: round.round,
        mode: round.mode,
        dateTime: round.dateTime,
        duration: round.duration,
        interviewers: round.interviewers,
        instructions: round.instructions,
        status: round.status
      });
      const savedRound = await newRound.save();
      return savedRound._id;
    }));

    const newInterview = new Interview({
      Candidate,
      Position,
      Status,
      ScheduleType,
      Interviewstype,
      CreatedBy,
      rounds: roundIds,
      candidateImageUrl
    });
    const savedInterview = await newInterview.save();
     const interviews = await Interview.find({ CreatedBy });
    broadcastData('interview', interviews); 
    res.status(201).json(savedInterview);
  } catch (error) {
    console.error('Error saving interview:', error);
    res.status(400).json({ message: error.message });
  }
});

app.get('/interview', async (req, res) => {
  const { CreatedBy, Interviewstype } = req.query;
  try {
    const query = { CreatedBy };
    if (Interviewstype) {
      query.Interviewstype = Interviewstype;
    }

    const interviews = await Interview.find(query).populate('rounds');
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/updateinterview', async (req, res) => {
  const { _id, rounds, ...newInterviewData } = req.body;

  try {
    const existingInterview = await Interview.findById(_id);
    if (!existingInterview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    const updatedRounds = await Promise.all(rounds.map(async (round) => {
      if (round._id) {
        return await ScheduleRounds.findByIdAndUpdate(round._id, round, { new: true });
      } else {
        const newRound = new ScheduleRounds(round);
        const savedRound = await newRound.save();
        return savedRound._id;
      }
    }));

    const interviewHistory = new InterviewHistory({
      interviewId: existingInterview._id,
      Candidate: existingInterview.Candidate,
      Position: existingInterview.Position,
      ScheduleType: existingInterview.ScheduleType,
      rounds: existingInterview.rounds,
      CreatedDate: existingInterview.CreatedDate,
      CreatedBy: existingInterview.CreatedBy,
      ModifiedDate: existingInterview.ModifiedDate,
      ModifiedBy: existingInterview.ModifiedBy,
      Category: existingInterview.Category,
      Status: existingInterview.Status,
      createdAt: existingInterview.createdAt,
      Action: 'Update',
      ActionDate: new Date()
    });

    await interviewHistory.save();

    const updatedInterview = await Interview.findByIdAndUpdate(
      existingInterview._id,
      { ...newInterviewData, rounds: updatedRounds, ModifiedDate: new Date() },
      { new: true }
    );

    broadcastData('updateInterview', updatedInterview);

    res.json(updatedInterview);
  } catch (err) {
    console.error('Error updating interview:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/updateinterview/:id', async (req, res) => {
  const { id } = req.params;
  const { rounds, ...newInterviewData } = req.body;

  try {
    const existingInterview = await Interview.findById(id);
    if (!existingInterview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    const updatedRounds = await Promise.all(rounds.map(async (round) => {
      if (round._id) {
        return await ScheduleRounds.findByIdAndUpdate(round._id, round, { new: true });
      } else {
        const newRound = new ScheduleRounds(round);
        const savedRound = await newRound.save();
        return savedRound._id;
      }
    }));

    const interviewHistory = new InterviewHistory({
      interviewId: existingInterview._id,
      Candidate: existingInterview.Candidate,
      Position: existingInterview.Position,
      ScheduleType: existingInterview.ScheduleType,
      rounds: existingInterview.rounds,
      CreatedDate: existingInterview.CreatedDate,
      CreatedBy: existingInterview.CreatedBy,
      ModifiedDate: existingInterview.ModifiedDate,
      ModifiedBy: existingInterview.ModifiedBy,
      Category: existingInterview.Category,
      Status: existingInterview.Status,
      createdAt: existingInterview.createdAt,
      Action: 'Update',
      ActionDate: new Date()
    });

    await interviewHistory.save();
    const updatedInterview = await Interview.findByIdAndUpdate(
      existingInterview._id,
      { ...newInterviewData, rounds: updatedRounds, ModifiedDate: new Date() },
      { new: true }
    );

    const interviews = await Interview.find({ CreatedBy: existingInterview.CreatedBy });
    broadcastData('interview', interviews);

    res.json(updatedInterview);
  } catch (err) {
    console.error('Error updating interview:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/interview/check', async (req, res) => {
  try {
    const interviews = await Interview.find({ Category: 'Outsource' });
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/interview/:id', async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id).populate('rounds');
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    res.json(interview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/interview/:id', async (req, res) => {
  const interviewId = req.params.id;
  const { Status } = req.body;

  try {
    const updatedInterview = await Interview.findByIdAndUpdate(
      interviewId,
      { Status },
      { new: true }
    );

    if (!updatedInterview) {
      return res.status(404).json({ message: "Interview not found." });
    }

    const notification = new Notifications({
      Title: 'Interview Cancelled',
      Body: 'Interview has been cancelled successfully.',
      InterviewType: 'MockInterview',
      Status: 'ScheduleCancel',
    });

    await notification.save();

    res.status(200).json(updatedInterview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// newquestion
app.post('/newquestion', async (req, res) => {
  const { Question, QuestionType, Skill, DifficultyLevel, Score, Answer, Options, createdBy } = req.body;

  const newquestion = new NewQuestion({
    Question,
    QuestionType,
    Skill,
    DifficultyLevel,
    Score,
    Answer,
    Options,
    createdBy
  });
  try {
    const question = await newquestion.save();
    const questions = await NewQuestion.find({ createdBy });
    broadcastData('question', questions);
    res.status(201).json(question);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/newquestion/:skillName', async (req, res) => {
  const { skillName } = req.params;
  const { createdBy } = req.query;

  try {
    const questions = await NewQuestion.find({ Skill: skillName, createdBy });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/newquestion/:id', async (req, res) => {
  const questionId = req.params.id;
  const { Question, QuestionType, Skill, DifficultyLevel, Score, Answer, Options, createdBy } = req.body;

  if (questionId) {
    try {
      const updatedQuestion = await NewQuestion.findByIdAndUpdate(questionId, {
        Question,
        QuestionType,
        Skill,
        DifficultyLevel,
        Score,
        Answer,
        Options
      }, { new: true });
      if (!updatedQuestion) {
        return res.status(404).json({ message: "Question not found." });
      }
      res.status(200).json(updatedQuestion);
      const questions = await NewQuestion.find({ createdBy });
      broadcastData('question', questions);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } else {
    res.status(400).json({ message: "Question ID is required." });
  }
});

app.delete('/newquestion/:id', async (req, res) => {
  const questionId = req.params.id;
  try {
    const deletedQuestion = await NewQuestion.findByIdAndDelete(questionId);
    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found." });
    }
    // const questions = await NewQuestion.find({ createdBy });
    // broadcastData('question', questions);
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/questions-count', async (req, res) => {
  try {
    const questions = await NewQuestion.aggregate([
      {
        $group: {
          _id: "$Skill",
          totalQuestions: { $sum: 1 }
        }
      }
    ]);
    res.json(questions);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.get('/questions/:skill/:questionType', async (req, res) => {
  const { skill, questionType } = req.params;
  try {
    const questions = await NewQuestion.find({ Skill: skill, QuestionType: questionType });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/notification', async (req, res) => {
  const { Title, Body, InterviewType, Status } = req.body;
  const notification = new Notifications({
    Title,
    Body,
    InterviewType,
    Status,
  });
  try {
    const savedNotification = await notification.save();
    res.status(201).json(savedNotification);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/notification', async (req, res) => {
  try {
    const notification = await Notifications.find();
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/mockinterview', async (req, res) => {
  try {
    const mockinterview = await MockInterview.find();
    res.json(mockinterview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/mockinterview', async (req, res) => {
  
  const { Title, Skills, DateTime, Interviewer, Duration, Description, Status, CreatedBy } = req.body;
  const mockInterview = new MockInterview({
    Title,
    Skills,
    DateTime,
    Interviewer,
    Duration,
    Description,
    Status
  });
  try {
    const newMockInterview = await mockInterview.save();
    const mockInterviews = await MockInterview.find({ CreatedBy });
    broadcastData('mockinterview', mockInterviews);
    res.status(201).json(newMockInterview);
  } catch (err) {
    console.error("Error creating mockinterview:", err);
    res.status(400).json({ message: err.message });
  }
});
app.put('/updateMockInterview', async (req, res) => {
  const { _id, ...newMockinterviewData } = req.body;

  try {
    const existingmockinterview = await MockInterview.findById(_id);

    if (!existingmockinterview) {
      return res.status(404).json({ message: 'MockInterview not found' });
    }

    const historyEntry = new MockInterviewHistory({
      MockInterviewId: existingmockinterview._id,
      Title: existingmockinterview.Title,
      Skills: existingmockinterview.Skills,
      DateTime: existingmockinterview.DateTime,
      Interviewer: existingmockinterview.Interviewer,
      Duration: existingmockinterview.Duration,
      CreatedDate: existingmockinterview.CreatedDate,
      CreatedBy: existingmockinterview.CreatedBy,
      ModifiedDate: existingmockinterview.ModifiedDate,
      ModifiedBy: existingmockinterview.ModifiedBy,
      Category: existingmockinterview.Category,
      Description: existingmockinterview.Description,
      Status: existingmockinterview.Status,
      Action: 'Updated',
    });

    await historyEntry.save();

    const updatedMockInterview = await MockInterview.findByIdAndUpdate(
      _id,
      { ...newMockinterviewData, ModifiedDate: new Date() },
      { new: true }
    );

    res.json(updatedMockInterview);
  } catch (err) {
    console.error('Error updating MockInterview:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/mockinterview/:id', async (req, res) => {
  const interviewId = req.params.id;
  const { Status } = req.body;

  try {
    const updatedInterview = await MockInterview.findByIdAndUpdate(
      interviewId,
      { Status },
      { new: true }
    );

    if (!updatedInterview) {
      return res.status(404).json({ message: "Interview not found." });
    }

    const notification = new Notifications({
      Title: 'Interview Cancelled',
      Body: 'Interview has been cancelled successfully.',
      InterviewType: 'MockInterview',
      Status: 'ScheduleCancel',
    });

    await notification.save();
    // const mockInterviews = await MockInterview.find({ CreatedBy });
    // broadcastData('mockinterview', mockInterviews);

    res.status(200).json(updatedInterview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



app.put('/mockinterview/:id', async (req, res) => {
  const interviewId = req.params.id;
  const { Status } = req.body;

  try {
    const updatedInterview = await MockInterview.findByIdAndUpdate(
      interviewId,
      { Status },
      { new: true }
    );

    if (!updatedInterview) {
      return res.status(404).json({ message: "Interview not found." });
    }

    const notification = new Notifications({
      Title: 'Interview Cancelled',
      Body: 'Interview has been cancelled successfully.',
      InterviewType: 'MockInterview',
      Status: 'ScheduleCancel',
    });

    await notification.save();

    res.status(200).json(updatedInterview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post('/fetch-content', (req, res) => {
  const { sections } = req.body;
  const content = sections.map(section => ({
    title: `Content for ${section}`,
    body: `This is the body content for section ${section}.`
  }));
  res.json(content);
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ashrafshaik250@gmail.com',
    pass: 'rang qano pkdc ilxg'
  }
});

app.post('/send-assessment-link', async (req, res) => {
  const { candidateEmails, assessmentId, notes, sections, questions } = req.body;
  try {
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    const link = `http://localhost:3002/assessmenttest?assessmentId=${assessmentId}`;
    const mailOptions = {
      from: 'ashrafshaik250@gmail.com',
      to: candidateEmails,
      subject: 'Assessment Invitation',
      text: `You have been invited to participate in an assessment. Please follow this link: ${link}\n\nNotes: ${notes}\n\nSections: ${JSON.stringify(sections)}\n\nQuestions: ${JSON.stringify(questions)}`
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email' });
  }
});

app.get('/assessment-details/:assessmentId', async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const assessment = await Assessment.findById(assessmentId).populate('Sections.Questions');
    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    res.status(200).json(assessment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/check-userid/:userid', async (req, res) => {
  const { userid } = req.params;
  const existingContact = await Contacts.findOne({ UserId: userid });
  res.json({ exists: !!existingContact });
});

app.get('/check-email/:email', async (req, res) => {
  const { email } = req.params;
  const existingContact = await Contacts.findOne({ Email: email });
  res.json({ exists: !!existingContact });
});


app.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contacts.find().populate('availability');
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Error fetching contacts', error: error.message });
  }
});

app.get('/contacts/:userId', async (req, res) => {
  try {
    const contact = await Contacts.findOne({ user: req.params.userId });
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (err) {
    console.error('Error fetching contact:', err);
    res.status(500).json({ message: err.message });
  }
});

app.get('/contacts/:userId/details', async (req, res) => {
  try {
    const contact = await Contacts.findOne({ user: req.params.userId }).populate('availability');
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (err) {
    console.error('Error fetching contact details:', err);
    res.status(500).json({ message: err.message });
  }
});

app.post('/contacts', async (req, res) => {
  req.body.CreatedBy = 'Admin';
  const contact = new Contacts(req.body);
  try {
    const savedContact = await contact.save();
    res.status(201).json(savedContact);
  } catch (error) {
    if (error.name === 'ValidationError') {
      console.error('Validation error saving contact:', error.errors);
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error('Error saving contact:', error);
    res.status(400).send('Error saving contact: ' + error.message);
  }
});

app.put('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const updatedContact = await Contacts.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(updatedContact);
  } catch (err) {
    console.error('Error updating contact:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/contacts/:userId/availability', async (req, res) => {
  const { userId } = req.params;
  const { availability, TimeZone, PreferredDuration } = req.body;

  try {
    const contact = await Contacts.findOne({ user: userId }).populate('availability');
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    let availabilityDoc;
    if (contact.availability) {
      // Update existing availability document
      availabilityDoc = await LoginAvailability.findById(contact.availability);
      if (!availabilityDoc) {
        return res.status(404).json({ message: 'Availability not found' });
      }
    } else {
      // Create new availability document
      availabilityDoc = new LoginAvailability({ contact: contact._id });
      contact.availability = availabilityDoc._id;
    }

    // Update or add days and time slots
    for (const updatedAvail of availability) {
      const existingDay = availabilityDoc.days.find(day => day.day === updatedAvail.day);
      if (existingDay) {
        existingDay.timeSlots = updatedAvail.timeSlots;
      } else {
        availabilityDoc.days.push({
          day: updatedAvail.day,
          timeSlots: updatedAvail.timeSlots,
        });
      }
    }

    await availabilityDoc.save();

    // Update TimeZone and PreferredDuration in the Contacts model
    contact.TimeZone = TimeZone;
    contact.PreferredDuration = PreferredDuration;

    await contact.save();

    res.status(200).json(contact);
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/updateuser', async (req, res) => {
  const { _id, UserId, ...newUserData } = req.body;

  try {
    const existingUser = await Users.findOne({ $or: [{ _id }, { UserId }] });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userHistory = new UserHistory({
      user: existingUser._id,
      Name: existingUser.Name,
      Firstname: existingUser.Firstname,
      CountryCode: existingUser.CountryCode,
      UserId: existingUser.UserId,
      Email: existingUser.Email,
      Phone: existingUser.Phone,
      LinkedinUrl: existingUser.LinkedinUrl,
      Gender: existingUser.Gender,
      ImageData: existingUser.ImageData,
      CreatedDate: existingUser.CreatedDate,
      CreatedBy: existingUser.CreatedBy,
      ModifiedDate: existingUser.ModifiedDate,
      ModifiedBy: existingUser.ModifiedBy,
      updatedAt: new Date()
    });

    await userHistory.save();

    const updatedUser = await Users.findByIdAndUpdate(
      existingUser._id,
      { ...newUserData, ModifiedDate: new Date() },
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/users', async (req, res) => {
  try {
    const users = await Users.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});
app.get('/users/:sub', async (req, res) => {
  const { sub } = req.params;
  try {
    const user = await Users.findOne({ sub });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error checking user existence:', error);
    res.status(500).json({ message: 'Error checking user existence' });
  }
});

app.post('/users', async (req, res) => {
  const { Email, UserId, ...otherData } = req.body;
  try {
    const existingUser = await Users.findOne({ $or: [{ Email }, { UserId }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this Email or UserId already exists' });
    }

    const newUser = new Users({ Email, UserId, ...otherData });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: err.message });
  }
});

app.put('/updateuser', async (req, res) => {
  const { _id, UserId, ...newUserData } = req.body;

  try {
    const existingUser = await Users.findOne({ $or: [{ _id }, { UserId }] });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userHistory = new UserHistory({
      user: existingUser._id,
      Name: existingUser.Name,
      Firstname: existingUser.Firstname,
      CountryCode: existingUser.CountryCode,
      UserId: existingUser.UserId,
      Email: existingUser.Email,
      Phone: existingUser.Phone,
      LinkedinUrl: existingUser.LinkedinUrl,
      Gender: existingUser.Gender,
      ImageData: existingUser.ImageData,
      CreatedDate: existingUser.CreatedDate,
      CreatedBy: existingUser.CreatedBy,
      ModifiedDate: existingUser.ModifiedDate,
      ModifiedBy: existingUser.ModifiedBy,
      updatedAt: new Date()
    });

    await userHistory.save();

    const updatedUser = await Users.findByIdAndUpdate(
      existingUser._id,
      { ...newUserData, ModifiedDate: new Date() },
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// GET User by ID
app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT User by ID
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { ...newUserData } = req.body;

  try {
    const existingUser = await Users.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userHistory = new UserHistory({
      user: existingUser._id,
      Name: existingUser.Name,
      Firstname: existingUser.Firstname,
      CountryCode: existingUser.CountryCode,
      UserId: existingUser.UserId,
      Email: existingUser.Email,
      Phone: existingUser.Phone,
      LinkedinUrl: existingUser.LinkedinUrl,
      Gender: existingUser.Gender,
      ImageData: existingUser.ImageData,
      CreatedDate: existingUser.CreatedDate,
      CreatedBy: existingUser.CreatedBy,
      ModifiedDate: existingUser.ModifiedDate,
      ModifiedBy: existingUser.ModifiedBy,
      updatedAt: new Date()
    });

    await userHistory.save();

    const updatedUser = await Users.findByIdAndUpdate(
      id,
      { ...newUserData, ModifiedDate: new Date() },
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/users/:id/image', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findById(id);
    if (!user) {
      return res.status(404).send('User not found.');
    }

    const imagePath = user.ImageData?.path;
    user.ImageData = undefined;
    await user.save();

    if (imagePath) {
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error deleting image file:', err);
        }
      });
    }

    res.status(200).send('Image deleted successfully.');
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).send('Server error');
  }
});


// locations master data
app.get('/locations', async (req, res) => {
  try {
    const LocationNames = await LocationMaster.find({}, 'LocationName');
    res.json(LocationNames);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Industry data
app.get('/industries', async (req, res) => {
  try {
    const IndustryNames = await Industry.find({}, 'IndustryName');
    res.json(IndustryNames);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//role master
app.get('/roles', async (req, res) => {
  try {
    const roles = await RoleMaster.find({}, 'RoleName');
    res.json(roles);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// technology master
app.get('/technology', async (req, res) => {
  try {
    const technology = await TechnologyMaster.find({}, 'TechnologyMasterName');
    res.json(technology);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.get('/suggestedquestions-count', async (req, res) => {
  try {
    const questions = await SuggestedQuestion.aggregate([
      {
        $group: {
          _id: "$Skill",
          totalQuestions: { $sum: 1 }
        }
      }
    ]);
    const countMap = {};
    questions.forEach(q => {
      countMap[q._id] = q.totalQuestions;
    });
    res.json(countMap);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/suggestedquestions/:skill', async (req, res) => {
  const { skill } = req.params;
  const { userId } = req.query;
  try {
    const questions = await SuggestedQuestion.find({ Skill: skill });
    const questionsWithFavorites = questions.map(question => {
      const userFavorite = question.favorites.find(fav => fav.userId === userId);
      return {
        ...question.toObject(),
        favorite: userFavorite ? userFavorite.favorite : false
      };
    });
    res.json(questionsWithFavorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.get('/favoritequestions/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const questions = await SuggestedQuestion.find({ 'favorites.userId': userId });
    const favoriteQuestions = questions.filter(question =>
      question.favorites.some(fav => fav.userId === userId && fav.favorite)
    );
    res.json(favoriteQuestions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/favoritequestions-count/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const questions = await SuggestedQuestion.find({ 'favorites.userId': userId });
    const favoriteQuestions = questions.filter(question =>
      question.favorites.some(fav => fav.userId === userId && fav.favorite)
    );

    const favoriteCountBySkill = favoriteQuestions.reduce((acc, question) => {
      const skill = question.Skill;
      if (!acc[skill]) {
        acc[skill] = 0;
      }
      acc[skill]++;
      return acc;
    }, {});

    res.json(favoriteCountBySkill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.put('/suggestedquestions/:id/favorite', async (req, res) => {
  const { id } = req.params;
  const { favorite, userId } = req.body;

  try {
    const question = await SuggestedQuestion.findById(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    const userFavorite = question.favorites.find(fav => fav.userId === userId);
    if (userFavorite) {
      userFavorite.favorite = favorite;
    } else {
      question.favorites.push({ userId, favorite });
    }

    const updatedQuestion = await question.save();
    res.status(200).json(updatedQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post('/run-code', async (req, res) => {
  const { code, language, testCases } = req.body;

  // This is a simplified example. You need to handle different languages and their respective compilers/interpreters.
  const runCode = (code, input) => {
    return new Promise((resolve, reject) => {
      exec(`echo "${input}" | ${language} -c "${code}"`, (error, stdout, stderr) => {
        if (error) {
          reject(stderr);
        } else {
          resolve(stdout);
        }
      });
    });
  };

  try {
    const results = await Promise.all(testCases.map(async (testCase) => {
      const output = await runCode(code, testCase.input);
      return {
        ...testCase,
        actualOutput: output.trim(),
        passed: output.trim() === testCase.output,
      };
    }));

    res.status(200).json(results);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const addDefaultQuestions = async () => {

  const defaultQuestions = [
    // AWS (Amazon Web Services)
    {
      Question: "What is AWS?",
      QuestionType: "MCQ",
      Skill: "AWS (Amazon Web Services)",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "Amazon Web Services",
      Options: ["Amazon Web Services", "Azure", "Google Cloud", "IBM Cloud"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the core services of AWS.",
      QuestionType: "Interview Questions",
      Skill: "AWS (Amazon Web Services)",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "Core services include EC2, S3, RDS, etc.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a program to upload a file to S3 using AWS SDK.",
      QuestionType: "Programming",
      Skill: "AWS (Amazon Web Services)",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "Code to upload file to S3",
      CreatedBy: "admin"
    },
    // PostgreSQL
    {
      Question: "What is PostgreSQL?",
      QuestionType: "MCQ",
      Skill: "PostgreSQL",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "An open-source relational database",
      Options: ["An open-source relational database", "A NoSQL database", "A cloud service", "A programming language"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the architecture of PostgreSQL.",
      QuestionType: "Interview Questions",
      Skill: "PostgreSQL",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "PostgreSQL architecture includes components like the postmaster, shared memory, etc.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a SQL query to fetch the top 5 highest salaries from an employee table.",
      QuestionType: "Programming",
      Skill: "PostgreSQL",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "SELECT * FROM employee ORDER BY salary DESC LIMIT 5;",
      CreatedBy: "admin"
    },
    // MongoDB
    {
      Question: "What is MongoDB?",
      QuestionType: "MCQ",
      Skill: "MongoDB",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "A NoSQL database",
      Options: ["A NoSQL database", "A relational database", "A cloud service", "A programming language"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain MongoDB architecture.",
      QuestionType: "Interview Questions",
      Skill: "MongoDB",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "MongoDB is a NoSQL database.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a MongoDB query to find all documents where the age is greater than 25.",
      QuestionType: "Programming",
      Skill: "MongoDB",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "db.collection.find({ age: { $gt: 25 } });",
      CreatedBy: "admin"
    },
    // SQL
    {
      Question: "What is SQL?",
      QuestionType: "MCQ",
      Skill: "SQL",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "Structured Query Language",
      Options: ["Structured Query Language", "Simple Query Language", "Standard Query Language", "Sequential Query Language"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the different types of joins in SQL.",
      QuestionType: "Interview Questions",
      Skill: "SQL",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "Types of joins include INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL JOIN.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a SQL query to find the second highest salary from an employee table.",
      QuestionType: "Programming",
      Skill: "SQL",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "SELECT MAX(salary) FROM employee WHERE salary < (SELECT MAX(salary) FROM employee);",
      CreatedBy: "admin"
    },
    // C++
    {
      Question: "What is C++?",
      QuestionType: "MCQ",
      Skill: "C++",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "A programming language",
      Options: ["A programming language", "A database", "An operating system", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the concept of polymorphism in C++.",
      QuestionType: "Interview Questions",
      Skill: "C++",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "Polymorphism allows methods to do different things based on the object it is acting upon.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a C++ program to implement a simple class with a constructor and a destructor.",
      QuestionType: "Programming",
      Skill: "C++",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "class MyClass { public: MyClass() { } ~MyClass() { } };",
      CreatedBy: "admin"
    },
    // Java
    {
      Question: "What is Java?",
      QuestionType: "MCQ",
      Skill: "Java",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "A programming language",
      Options: ["A programming language", "A database", "An operating system", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the concept of inheritance in Java.",
      QuestionType: "Interview Questions",
      Skill: "Java",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "Inheritance allows a class to inherit properties and methods from another class.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a Java program to implement a simple class with a constructor and a destructor.",
      QuestionType: "Programming",
      Skill: "Java",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "class MyClass { public MyClass() { } protected void finalize() { } };",
      CreatedBy: "admin"
    },
    // Python
    {
      Question: "What is Python?",
      QuestionType: "MCQ",
      Skill: "Python",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "A programming language",
      Options: ["A programming language", "A database", "An operating system", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the concept of decorators in Python.",
      QuestionType: "Interview Questions",
      Skill: "Python",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "Decorators are a way to modify the behavior of a function or class.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a Python program to implement a simple class with a constructor and a destructor.",
      QuestionType: "Programming",
      Skill: "Python",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "class MyClass: def __init__(self): pass def __del__(self): pass",
      CreatedBy: "admin"
    },
    // JavaScript
    {
      Question: "What is JavaScript?",
      QuestionType: "MCQ",
      Skill: "JavaScript",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "A programming language",
      Options: ["A programming language", "A database", "An operating system", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the concept of closures in JavaScript.",
      QuestionType: "Interview Questions",
      Skill: "JavaScript",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "Closures are functions that have access to the parent scope, even after the parent function has closed.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a JavaScript function to add two numbers.",
      QuestionType: "Programming",
      Skill: "JavaScript",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "function add(a, b) { return a + b; }",
      CreatedBy: "admin"
    },
    // CSS
    {
      Question: "What is CSS?",
      QuestionType: "MCQ",
      Skill: "CSS",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "Cascading Style Sheets",
      Options: ["Cascading Style Sheets", "Cascading Script Sheets", "Cascading Style Scripts", "Cascading Script Styles"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the box model in CSS.",
      QuestionType: "Interview Questions",
      Skill: "CSS",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "The box model includes the content, padding, border, and margin of an element.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a CSS rule to center a div horizontally.",
      QuestionType: "Programming",
      Skill: "CSS",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "div { margin: 0 auto; }",
      CreatedBy: "admin"
    },
    // HTML
    {
      Question: "What is HTML?",
      QuestionType: "MCQ",
      Skill: "HTML",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "HyperText Markup Language",
      Options: ["HyperText Markup Language", "HyperText Markdown Language", "HyperText Markup Level", "HyperText Markdown Level"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the structure of an HTML document.",
      QuestionType: "Interview Questions",
      Skill: "HTML",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "An HTML document includes doctype, html, head, and body tags.",
      CreatedBy: "admin"
    },
    {
      Question: "Write an HTML snippet to create a form with a text input and a submit button.",
      QuestionType: "Programming",
      Skill: "HTML",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "<form><input type='text'><button type='submit'>Submit</button></form>",
      CreatedBy: "admin"
    },
    // Machine Learning (ML)
    {
      Question: "What is Machine Learning?",
      QuestionType: "MCQ",
      Skill: "Machine Learning (ML)",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "A field of AI that uses statistical techniques to give computer systems the ability to learn from data.",
      Options: ["A field of AI that uses statistical techniques to give computer systems the ability to learn from data.", "A programming language", "A database", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the difference between supervised and unsupervised learning.",
      QuestionType: "Interview Questions",
      Skill: "Machine Learning (ML)",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "Supervised learning uses labeled data, while unsupervised learning uses unlabeled data.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a Python function to implement linear regression.",
      QuestionType: "Programming",
      Skill: "Machine Learning (ML)",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "def linear_regression(X, y): pass",
      CreatedBy: "admin"
    },
    // Artificial Intelligence (AI)
    {
      Question: "What is Artificial Intelligence?",
      QuestionType: "MCQ",
      Skill: "Artificial Intelligence (AI)",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "The simulation of human intelligence in machines.",
      Options: ["The simulation of human intelligence in machines.", "A programming language", "A database", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the Turing Test.",
      QuestionType: "Interview Questions",
      Skill: "Artificial Intelligence (AI)",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "The Turing Test is a test of a machine's ability to exhibit intelligent behavior equivalent to, or indistinguishable from, that of a human.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a Python function to implement a simple chatbot.",
      QuestionType: "Programming",
      Skill: "Artificial Intelligence (AI)",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "def chatbot(input): pass",
      CreatedBy: "admin"
    },
    // Data Analysis
    {
      Question: "What is Data Analysis?",
      QuestionType: "MCQ",
      Skill: "Data Analysis",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "The process of inspecting, cleansing, transforming, and modeling data.",
      Options: ["The process of inspecting, cleansing, transforming, and modeling data.", "A programming language", "A database", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the difference between descriptive and inferential statistics.",
      QuestionType: "Interview Questions",
      Skill: "Data Analysis",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "Descriptive statistics summarize data, while inferential statistics make predictions based on data.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a Python function to calculate the mean of a list of numbers.",
      QuestionType: "Programming",
      Skill: "Data Analysis",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "def calculate_mean(numbers): return sum(numbers) / len(numbers)",
      CreatedBy: "admin"
    },
    // Network Administration
    {
      Question: "What is Network Administration?",
      QuestionType: "MCQ",
      Skill: "Network Administration",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "The process of managing and maintaining computer networks.",
      Options: ["The process of managing and maintaining computer networks.", "A programming language", "A database", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the OSI model.",
      QuestionType: "Interview Questions",
      Skill: "Network Administration",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "The OSI model is a conceptual framework used to understand network interactions in seven layers.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a Bash script to check the status of a network interface.",
      QuestionType: "Programming",
      Skill: "Network Administration",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "ifconfig eth0",
      CreatedBy: "admin"
    },
    // Cybersecurity
    {
      Question: "What is Cybersecurity?",
      QuestionType: "MCQ",
      Skill: "Cybersecurity",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "The practice of protecting systems, networks, and programs from digital attacks.",
      Options: ["The practice of protecting systems, networks, and programs from digital attacks.", "A programming language", "A database", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the difference between a virus and a worm.",
      QuestionType: "Interview Questions",
      Skill: "Cybersecurity",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "A virus attaches itself to a program or file, while a worm is a standalone malware that replicates itself.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a Python script to scan open ports on a given IP address.",
      QuestionType: "Programming",
      Skill: "Cybersecurity",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "import socket; s = socket.socket(socket.AF_INET, socket.SOCK_STREAM); s.connect(('127.0.0.1', 80))",
      CreatedBy: "admin"
    },
    // Jenkins
    {
      Question: "What is Jenkins?",
      QuestionType: "MCQ",
      Skill: "Jenkins",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "An open-source automation server.",
      Options: ["An open-source automation server.", "A programming language", "A database", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the concept of a Jenkins pipeline.",
      QuestionType: "Interview Questions",
      Skill: "Jenkins",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "A Jenkins pipeline is a suite of plugins that supports implementing and integrating continuous delivery pipelines.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a Jenkinsfile to build and deploy a Java application.",
      QuestionType: "Programming",
      Skill: "Jenkins",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "pipeline { agent any; stages { stage('Build') { steps { sh 'mvn clean install' } } stage('Deploy') { steps { sh 'scp target/*.jar user@server:/path/to/deploy' } } } }",
      CreatedBy: "admin"
    },
    // Kubernetes
    {
      Question: "What is Kubernetes?",
      QuestionType: "MCQ",
      Skill: "Kubernetes",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "An open-source container orchestration platform.",
      Options: ["An open-source container orchestration platform.", "A programming language", "A database", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the architecture of Kubernetes.",
      QuestionType: "Interview Questions",
      Skill: "Kubernetes",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "Kubernetes architecture includes components like the master node, worker nodes, etc.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a YAML file to deploy a simple Nginx application in Kubernetes.",
      QuestionType: "Programming",
      Skill: "Kubernetes",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "apiVersion: apps/v1 kind: Deployment metadata: name: nginx-deployment spec: replicas: 1 selector: matchLabels: app: nginx template: metadata: labels: app: nginx spec: containers: - name: nginx image: nginx ports: - containerPort: 80",
      CreatedBy: "admin"
    },
    // Docker
    {
      Question: "What is Docker?",
      QuestionType: "MCQ",
      Skill: "Docker",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "A platform for developing, shipping, and running applications in containers.",
      Options: ["A platform for developing, shipping, and running applications in containers.", "A programming language", "A database", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the difference between Docker and a virtual machine.",
      QuestionType: "Interview Questions",
      Skill: "Docker",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "Docker containers share the host OS kernel, while VMs run a full OS.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a Dockerfile to create a Docker image for a Node.js application.",
      QuestionType: "Programming",
      Skill: "Docker",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "FROM node:14 WORKDIR /app COPY package*.json ./ RUN npm install COPY . . EXPOSE 3000 CMD [\"node\", \"app.js\"]",
      CreatedBy: "admin"
    },
    // Google Cloud
    {
      Question: "What is Google Cloud?",
      QuestionType: "MCQ",
      Skill: "Google Cloud",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "A suite of cloud computing services by Google.",
      Options: ["A suite of cloud computing services by Google.", "A programming language", "A database", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the core services of Google Cloud.",
      QuestionType: "Interview Questions",
      Skill: "Google Cloud",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "Core services include Compute Engine, Cloud Storage, BigQuery, etc.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a command to deploy an application to Google App Engine.",
      QuestionType: "Programming",
      Skill: "Google Cloud",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "gcloud app deploy",
      CreatedBy: "admin"
    },
    // Azure
    {
      Question: "What is Azure?",
      QuestionType: "MCQ",
      Skill: "Azure",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "A cloud computing service by Microsoft.",
      Options: ["A cloud computing service by Microsoft.", "A programming language", "A database", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the core services of Azure.",
      QuestionType: "Interview Questions",
      Skill: "Azure",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "Core services include Virtual Machines, Blob Storage, Azure SQL Database, etc.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a command to create a new resource group in Azure.",
      QuestionType: "Programming",
      Skill: "Azure",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "az group create --name myResourceGroup --location eastus",
      CreatedBy: "admin"
    },
    // Vue.js
    {
      Question: "What is Vue.js?",
      QuestionType: "MCQ",
      Skill: "Vue.js",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "A progressive JavaScript framework for building user interfaces.",
      Options: ["A progressive JavaScript framework for building user interfaces.", "A database", "An operating system", "A web server"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the concept of components in Vue.js.",
      QuestionType: "Interview Questions",
      Skill: "Vue.js",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "Components are reusable Vue instances with a name.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a Vue.js component to display a list of items.",
      QuestionType: "Programming",
      Skill: "Vue.js",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "<template><ul><li v-for='item in items' :key='item.id'>{{ item.name }}</li></ul></template><script>export default { data() { return { items: [] }; } };</script>",
      CreatedBy: "admin"
    },
    // Angular
    {
      Question: "What is Angular?",
      QuestionType: "MCQ",
      Skill: "Angular",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "A platform for building mobile and desktop web applications.",
      Options: ["A platform for building mobile and desktop web applications.", "A database", "An operating system", "A web server"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the concept of modules in Angular.",
      QuestionType: "Interview Questions",
      Skill: "Angular",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "Modules are a way to group components, directives, pipes, and services.",
      CreatedBy: "admin"
    },
    {
      Question: "Write an Angular component to display a list of items.",
      QuestionType: "Programming",
      Skill: "Angular",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "@Component({ selector: 'app-item-list', template: '<ul><li *ngFor=\"let item of items\">{{ item.name }}</li></ul>' }) export class ItemListComponent { items = []; }",
      CreatedBy: "admin"
    },
    // React
    {
      Question: "What is React?",
      QuestionType: "MCQ",
      Skill: "React",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "A JavaScript library for building user interfaces.",
      Options: ["A JavaScript library for building user interfaces.", "A database", "An operating system", "A web server"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the concept of state in React.",
      QuestionType: "Interview Questions",
      Skill: "React",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "State is an object that determines how a component renders and behaves.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a React component to display a list of items.",
      QuestionType: "Programming",
      Skill: "React",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "function ItemList() { const [items, setItems] = useState([]); return <ul>{items.map(item => <li key={item.id}>{item.name}</li>)}</ul>; }",
      CreatedBy: "admin"
    },
    // Android Development
    {
      Question: "What is Android?",
      QuestionType: "MCQ",
      Skill: "Android Development",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "An open-source operating system for mobile devices.",
      Options: ["An open-source operating system for mobile devices.", "A programming language", "A database", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the Android activity lifecycle.",
      QuestionType: "Interview Questions",
      Skill: "Android Development",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "The Android activity lifecycle includes states like onCreate, onStart, onResume, onPause, onStop, and onDestroy.",
      CreatedBy: "admin"
    },
    {
      Question: "Write an Android activity to display a list of items.",
      QuestionType: "Programming",
      Skill: "Android Development",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "public class ItemListActivity extends AppCompatActivity { @Override protected void onCreate(Bundle savedInstanceState) { super.onCreate(savedInstanceState); setContentView(R.layout.activity_item_list); } }",
      CreatedBy: "admin"
    },
    // iOS Development
    {
      Question: "What is iOS?",
      QuestionType: "MCQ",
      Skill: "iOS Development",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "A mobile operating system created by Apple.",
      Options: ["A mobile operating system created by Apple.", "A programming language", "A database", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the iOS view controller lifecycle.",
      QuestionType: "Interview Questions",
      Skill: "iOS Development",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "The iOS view controller lifecycle includes states like viewDidLoad, viewWillAppear, viewDidAppear, viewWillDisappear, and viewDidDisappear.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a Swift function to display a list of items in a table view.",
      QuestionType: "Programming",
      Skill: "iOS Development",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "class ItemListViewController: UITableViewController { var items = [String]() override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int { return items.count } override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell { let cell = tableView.dequeueReusableCell(withIdentifier: \"cell\", for: indexPath) cell.textLabel?.text = items[indexPath.row] return cell } }",
      CreatedBy: "admin"
    },
    // Power BI
    {
      Question: "What is Power BI?",
      QuestionType: "MCQ",
      Skill: "Power BI",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "A business analytics service by Microsoft.",
      Options: ["A business analytics service by Microsoft.", "A programming language", "A database", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the concept of data modeling in Power BI.",
      QuestionType: "Interview Questions",
      Skill: "Power BI",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "Data modeling in Power BI involves creating relationships between different data sources.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a DAX formula to calculate the total sales in Power BI.",
      QuestionType: "Programming",
      Skill: "Power BI",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "Total Sales = SUM(Sales[Amount])",
      CreatedBy: "admin"
    },
    // Tableau
    {
      Question: "What is Tableau?",
      QuestionType: "MCQ",
      Skill: "Tableau",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "A data visualization tool.",
      Options: ["A data visualization tool.", "A programming language", "A database", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the concept of dashboards in Tableau.",
      QuestionType: "Interview Questions",
      Skill: "Tableau",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "Dashboards in Tableau are collections of views that allow you to compare a variety of data simultaneously.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a calculated field to calculate the profit margin in Tableau.",
      QuestionType: "Programming",
      Skill: "Tableau",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "Profit Margin = SUM([Profit]) / SUM([Sales])",
      CreatedBy: "admin"
    },
    // Data Visualization
    {
      Question: "What is Data Visualization?",
      QuestionType: "MCQ",
      Skill: "Data Visualization",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "The graphical representation of information and data.",
      Options: ["The graphical representation of information and data.", "A programming language", "A database", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the importance of data visualization.",
      QuestionType: "Interview Questions",
      Skill: "Data Visualization",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "Data visualization helps to understand trends, outliers, and patterns in data.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a Python script to create a bar chart using Matplotlib.",
      QuestionType: "Programming",
      Skill: "Data Visualization",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "import matplotlib.pyplot as plt; plt.bar(['A', 'B', 'C'], [10, 20, 30]); plt.show()",
      CreatedBy: "admin"
    },
    // Data Mining
    {
      Question: "What is Data Mining?",
      QuestionType: "MCQ",
      Skill: "Data Mining",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "The process of discovering patterns in large data sets.",
      Options: ["The process of discovering patterns in large data sets.", "A programming language", "A database", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the concept of clustering in data mining.",
      QuestionType: "Interview Questions",
      Skill: "Data Mining",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "Clustering is the task of dividing the population or data points into a number of groups such that data points in the same groups are more similar to other data points in the same group than those in other groups.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a Python script to perform k-means clustering.",
      QuestionType: "Programming",
      Skill: "Data Mining",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "from sklearn.cluster import KMeans; kmeans = KMeans(n_clusters=3); kmeans.fit(data)",
      CreatedBy: "admin"
    },
    // Natural Language Processing (NLP)
    {
      Question: "What is NLP?",
      QuestionType: "MCQ",
      Skill: "Natural Language Processing (NLP)",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "A field of AI that focuses on the interaction between computers and humans through natural language.",
      Options: ["A field of AI that focuses on the interaction between computers and humans through natural language.", "A programming language", "A database", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the concept of tokenization in NLP.",
      QuestionType: "Interview Questions",
      Skill: "Natural Language Processing (NLP)",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "Tokenization is the process of breaking down text into smaller units called tokens.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a Python script to perform tokenization using NLTK.",
      QuestionType: "Programming",
      Skill: "Natural Language Processing (NLP)",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "from nltk.tokenize import word_tokenize; tokens = word_tokenize('Hello, world!')",
      CreatedBy: "admin"
    },
    // Linux/Unix Administration
    {
      Question: "What is Linux?",
      QuestionType: "MCQ",
      Skill: "Linux/Unix Administration",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "An open-source operating system.",
      Options: ["An open-source operating system.", "A programming language", "A database", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the concept of file permissions in Linux.",
      QuestionType: "Interview Questions",
      Skill: "Linux/Unix Administration",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "File permissions in Linux determine who can read, write, and execute a file.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a Bash script to change file permissions.",
      QuestionType: "Programming",
      Skill: "Linux/Unix Administration",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "chmod 755 filename",
      CreatedBy: "admin"
    },
    // PowerShell
    {
      Question: "What is PowerShell?",
      QuestionType: "MCQ",
      Skill: "PowerShell",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "A task automation and configuration management framework from Microsoft.",
      Options: ["A task automation and configuration management framework from Microsoft.", "A programming language", "A database", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the concept of cmdlets in PowerShell.",
      QuestionType: "Interview Questions",
      Skill: "PowerShell",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "Cmdlets are lightweight commands used in the PowerShell environment.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a PowerShell script to list all files in a directory.",
      QuestionType: "Programming",
      Skill: "PowerShell",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "Get-ChildItem -Path C:\\path\\to\\directory",
      CreatedBy: "admin"
    },
    // Bash
    {
      Question: "What is Bash?",
      QuestionType: "MCQ",
      Skill: "Bash",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "A Unix shell and command language.",
      Options: ["A Unix shell and command language.", "A programming language", "A database", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the concept of shell scripting.",
      QuestionType: "Interview Questions",
      Skill: "Bash",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "Shell scripting is writing a series of commands for the shell to execute.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a Bash script to display the current date and time.",
      QuestionType: "Programming",
      Skill: "Bash",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "date",
      CreatedBy: "admin"
    },
    // Git
    {
      Question: "What is Git?",
      QuestionType: "MCQ",
      Skill: "Git",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "A distributed version control system.",
      Options: ["A distributed version control system.", "A programming language", "A database", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the concept of branching in Git.",
      QuestionType: "Interview Questions",
      Skill: "Git",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "Branching allows you to create a separate line of development.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a Git command to create a new branch.",
      QuestionType: "Programming",
      Skill: "Git",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "git branch new-branch",
      CreatedBy: "admin"
    },
    // Agile Methodologies
    {
      Question: "What is Agile?",
      QuestionType: "MCQ",
      Skill: "Agile Methodologies",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "A set of principles for software development under which requirements and solutions evolve through the collaborative effort of self-organizing cross-functional teams.",
      Options: ["A set of principles for software development under which requirements and solutions evolve through the collaborative effort of self-organizing cross-functional teams.", "A programming language", "A database", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the concept of Scrum in Agile.",
      QuestionType: "Interview Questions",
      Skill: "Agile Methodologies",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "Scrum is an Agile framework for managing work with an emphasis on software development.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a brief description of a sprint in Agile.",
      QuestionType: "Short Text(Single Line)",
      Skill: "Agile Methodologies",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "A sprint is a set period during which specific work has to be completed and made ready for review.",
      CreatedBy: "admin"
    },
    // Software Testing
    {
      Question: "What is Software Testing?",
      QuestionType: "MCQ",
      Skill: "Software Testing",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "The process of evaluating and verifying that a software application or program does what it is supposed to do.",
      Options: ["The process of evaluating and verifying that a software application or program does what it is supposed to do.", "A programming language", "A database", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the difference between functional and non-functional testing.",
      QuestionType: "Interview Questions",
      Skill: "Software Testing",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "Functional testing verifies that the software functions as expected, while non-functional testing checks other aspects like performance, usability, and reliability.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a test case for a login functionality.",
      QuestionType: "Programming",
      Skill: "Software Testing",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "Test Case: Verify that a user can log in with valid credentials.",
      CreatedBy: "admin"
    },
    // UI/UX Design
    {
      Question: "What is UI/UX Design?",
      QuestionType: "MCQ",
      Skill: "UI/UX Design",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "The process of designing user interfaces and user experiences for digital products.",
      Options: ["The process of designing user interfaces and user experiences for digital products.", "A programming language", "A database", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the difference between UI and UX.",
      QuestionType: "Interview Questions",
      Skill: "UI/UX Design",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "UI refers to the user interface, while UX refers to the user experience.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a brief description of a wireframe.",
      QuestionType: "Short Text(Single Line)",
      Skill: "UI/UX Design",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "A wireframe is a visual guide that represents the skeletal framework of a website or application.",
      CreatedBy: "admin"
    },
    // Express.js
    {
      Question: "What is Express.js?",
      QuestionType: "MCQ",
      Skill: "Express.js",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "A web application framework for Node.js.",
      Options: ["A web application framework for Node.js.", "A programming language", "A database", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the concept of middleware in Express.js.",
      QuestionType: "Interview Questions",
      Skill: "Express.js",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "Middleware functions are functions that have access to the request object, the response object, and the next middleware function in the application’s request-response cycle.",
      CreatedBy: "admin"
    },
    {
      Question: "Write an Express.js route to handle a GET request.",
      QuestionType: "Programming",
      Skill: "Express.js",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "app.get('/route', (req, res) => { res.send('Hello World'); });",
      CreatedBy: "admin"
    },
    // Spring
    {
      Question: "What is Spring?",
      QuestionType: "MCQ",
      Skill: "Spring",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "A framework for building Java applications.",
      Options: ["A framework for building Java applications.", "A programming language", "A database", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the concept of dependency injection in Spring.",
      QuestionType: "Interview Questions",
      Skill: "Spring",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "Dependency injection is a design pattern used to implement IoC, allowing the creation of dependent objects outside of a class and providing those objects to a class in different ways.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a Spring Boot application to handle a GET request.",
      QuestionType: "Programming",
      Skill: "Spring",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "@RestController public class MyController { @GetMapping('/route') public String handleGet() { return 'Hello World'; } }",
      CreatedBy: "admin"
    },
    // Django
    {
      Question: "What is Django?",
      QuestionType: "MCQ",
      Skill: "Django",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "A high-level Python web framework.",
      Options: ["A high-level Python web framework.", "A programming language", "A database", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the concept of models in Django.",
      QuestionType: "Interview Questions",
      Skill: "Django",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "Models in Django are a way to define the structure of your database.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a Django view to handle a GET request.",
      QuestionType: "Programming",
      Skill: "Django",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "def my_view(request): return HttpResponse('Hello World')",
      CreatedBy: "admin"
    },
    // React Native
    {
      Question: "What is React Native?",
      QuestionType: "MCQ",
      Skill: "React Native",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "A framework for building native apps using React.",
      Options: ["A framework for building native apps using React.", "A programming language", "A database", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the concept of components in React Native.",
      QuestionType: "Interview Questions",
      Skill: "React Native",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "Components are the building blocks of a React Native application.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a React Native component to display a list of items.",
      QuestionType: "Programming",
      Skill: "React Native",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "const ItemList = () => { const [items, setItems] = useState([]); return <FlatList data={items} renderItem={({ item }) => <Text>{item.name}</Text>} />; }",
      CreatedBy: "admin"
    },
    // ASP.NET
    {
      Question: "What is ASP.NET?",
      QuestionType: "MCQ",
      Skill: "ASP.NET",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "A web framework for building web applications using .NET.",
      Options: ["A web framework for building web applications using .NET.", "A programming language", "A database", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the concept of MVC in ASP.NET.",
      QuestionType: "Interview Questions",
      Skill: "ASP.NET",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "MVC stands for Model-View-Controller, a design pattern used to separate an application into three main components.",
      CreatedBy: "admin"
    },
    {
      Question: "Write an ASP.NET controller to handle a GET request.",
      QuestionType: "Programming",
      Skill: "ASP.NET",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "public class MyController : Controller { public IActionResult Index() { return View(); } }",
      CreatedBy: "admin"
    },
    // Laravel
    {
      Question: "What is Laravel?",
      QuestionType: "MCQ",
      Skill: "Laravel",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "A PHP framework for web artisans.",
      Options: ["A PHP framework for web artisans.", "A programming language", "A database", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the concept of Eloquent ORM in Laravel.",
      QuestionType: "Interview Questions",
      Skill: "Laravel",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "Eloquent ORM is Laravel's built-in ORM implementation, providing an easy way to interact with the database.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a Laravel controller to handle a GET request.",
      QuestionType: "Programming",
      Skill: "Laravel",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "class MyController extends Controller { public function index() { return view('index'); } }",
      CreatedBy: "admin"
    },
    // Flask
    {
      Question: "What is Flask?",
      QuestionType: "MCQ",
      Skill: "Flask",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "A micro web framework for Python.",
      Options: ["A micro web framework for Python.", "A programming language", "A database", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the concept of blueprints in Flask.",
      QuestionType: "Interview Questions",
      Skill: "Flask",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "Blueprints in Flask are a way to organize your application into modules.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a Flask route to handle a GET request.",
      QuestionType: "Programming",
      Skill: "Flask",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "@app.route('/route') def route(): return 'Hello World'",
      CreatedBy: "admin"
    },
    // Node.js
    {
      Question: "What is Node.js?",
      QuestionType: "MCQ",
      Skill: "Node.js",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "A JavaScript runtime built on Chrome's V8 JavaScript engine.",
      Options: ["A JavaScript runtime built on Chrome's V8 JavaScript engine.", "A programming language", "A database", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the concept of event-driven programming in Node.js.",
      QuestionType: "Interview Questions",
      Skill: "Node.js",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "Event-driven programming in Node.js means that the flow of the program is determined by events such as user actions, sensor outputs, or messages from other programs.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a Node.js script to create a simple HTTP server.",
      QuestionType: "Programming",
      Skill: "Node.js",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "const http = require('http'); const server = http.createServer((req, res) => { res.statusCode = 200; res.setHeader('Content-Type', 'text/plain'); res.end('Hello World'); }); server.listen(3000, () => {  });",
      CreatedBy: "admin"
    },
    // TypeScript
    {
      Question: "What is TypeScript?",
      QuestionType: "MCQ",
      Skill: "TypeScript",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "A typed superset of JavaScript that compiles to plain JavaScript.",
      Options: ["A typed superset of JavaScript that compiles to plain JavaScript.", "A programming language", "A database", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the concept of interfaces in TypeScript.",
      QuestionType: "Interview Questions",
      Skill: "TypeScript",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "Interfaces in TypeScript are used to define the structure of an object.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a TypeScript function to add two numbers.",
      QuestionType: "Programming",
      Skill: "TypeScript",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "function add(a: number, b: number): number { return a + b; }",
      CreatedBy: "admin"
    },
    // Swift
    {
      Question: "What is Swift?",
      QuestionType: "MCQ",
      Skill: "Swift",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "A programming language developed by Apple.",
      Options: ["A programming language developed by Apple.", "A database", "An operating system", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the concept of optionals in Swift.",
      QuestionType: "Interview Questions",
      Skill: "Swift",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "Optionals in Swift are used to handle the absence of a value.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a Swift function to add two numbers.",
      QuestionType: "Programming",
      Skill: "Swift",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "func add(a: Int, b: Int) -> Int { return a + b }",
      CreatedBy: "admin"
    },
    // PHP
    {
      Question: "What is PHP?",
      QuestionType: "MCQ",
      Skill: "PHP",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "A server-side scripting language.",
      Options: ["A server-side scripting language.", "A programming language", "A database", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the concept of sessions in PHP.",
      QuestionType: "Interview Questions",
      Skill: "PHP",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "Sessions in PHP are a way to store information (in variables) to be used across multiple pages.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a PHP script to start a session.",
      QuestionType: "Programming",
      Skill: "PHP",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "<?php session_start(); ?>",
      CreatedBy: "admin"
    },
    // Ruby on Rails
    {
      Question: "What is Ruby on Rails?",
      QuestionType: "MCQ",
      Skill: "Ruby on Rails",
      DifficultyLevel: "Easy",
      Score: "5",
      Answer: "A server-side web application framework written in Ruby.",
      Options: ["A server-side web application framework written in Ruby.", "A programming language", "A database", "A web framework"],
      CreatedBy: "admin"
    },
    {
      Question: "Explain the concept of Active Record in Ruby on Rails.",
      QuestionType: "Interview Questions",
      Skill: "Ruby on Rails",
      DifficultyLevel: "Medium",
      Score: "10",
      Answer: "Active Record is the M in MVC - the model - which is the layer of the system responsible for representing business data and logic.",
      CreatedBy: "admin"
    },
    {
      Question: "Write a Ruby on Rails controller to handle a GET request.",
      QuestionType: "Programming",
      Skill: "Ruby on Rails",
      DifficultyLevel: "Hard",
      Score: "15",
      Answer: "class MyController < ApplicationController def index render plain: 'Hello World' end end",
      CreatedBy: "admin"
    }
  ];

  try {
    await SuggestedQuestion.insertMany(defaultQuestions);
  } catch (err) {
    console.error("Error adding default questions:", err);
  }
};

// Call the function to add default questions
// addDefaultQuestions();




// async function clearAssessments() {
//   try {
//     await Users.deleteMany({});
//     console.log('Data cleared successfully.');
//   } catch (err) {
//     console.error('Error deleting assessments:', err);
//   }
// }
// clearAssessments();