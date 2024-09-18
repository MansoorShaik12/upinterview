// const mongoose = require('mongoose');

// const connectDB = async () => {
//     try {
//         const conn = await mongoose.connect('mongodb+srv://smb:smb123@candidatetable.wewzvjo.mongodb.net/testdb?retryWrites=true&w=majority&appName=CandidateTable');
//         console.log(`MongoDB connected`);
//     } catch (error) {
//         console.error(error);
//         process.exit(1);
//     }
// }

// module.exports = connectDB;


const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
        console.error('Error: MONGODB_URI is not defined in environment variables');
        process.exit(1);
    }

    try {
        const conn = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB connected`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

module.exports = connectDB;