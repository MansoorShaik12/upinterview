
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
// const LoginBasicDetails1 = require('./models/LoginBasicDetails1.js');
// const LoginAdditionalDetails = require('./models/LoginAdditionalDetails.js');
// const LoginBasicDetails2 = require('./models/LoginBasicDetails2.js');
const LoginAvailability = require('./models/LoginAvailability.js');
// const LinkedInDetails = require('./models/LinkedInDetails');
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

app.use(cors({
  origin: process.env.CORS_ORIGIN,
}));

connectDB();
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: process.env.WS_PORT || 8080 });

console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN);
console.log('WS_PORT:', process.env.WS_PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI);


const SECRET_KEY = 'vpaas-magic-cookie-019af5b8e9c74f42a44947ee0c08572d';
const TOKEN_EXPIRATION = '1h';
app.get('/generate-token', (req, res) => {
  const payload = {
    // Add your payload data here
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });
  res.json({ token });
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

    broadcastImageData(body.type, body.id);
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
    broadcastImageData('candidate', id); 
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

// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

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
  const { AssessmentTitle, AssessmentType, Position, Duration, DifficultyLevel, NumberOfQuestions, ExpiryDate, Sections, ModifiedBy, ModifiedDate } = req.body;

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
  const { Question, QuestionType, Skill, DifficultyLevel, Score, Answer, Options } = req.body;

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
    const questions = await NewQuestion.find({ createdBy });
    broadcastData('question', questions);
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

  const { Title, Skills, DateTime, Interviewer, Duration, Description, Status } = req.body;
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
    const mockInterviews = await MockInterview.find({ CreatedBy });
    broadcastData('mockinterview', mockInterviews);

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

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// async function clearAssessments() {
//   try {
//     await Users.deleteMany({});
//     console.log('Data cleared successfully.');
//   } catch (err) {
//     console.error('Error deleting assessments:', err);
//   }
// }
// clearAssessments();