import 'dotenv/config';
import app from './app.js';
import connectDB from './config/connectDB.js';

const port = Number(process.env.PORT || '5000');

const startServer = async () => {
    await connectDB();

    app.listen(port, '0.0.0.0', () => {
        console.log(
            `Server is running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`
        );
    });
};

startServer().catch((error) => {
    console.error(error);
    process.exit(1);
});
