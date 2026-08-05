import 'dotenv/config';
import app from './app.js';
import connectDB from './config/connectDB.js';

const port = process.env.PORT;

const startServer = async () => {
    await connectDB();

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

startServer();
