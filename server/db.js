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

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;