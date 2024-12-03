import express from 'express';
import cookieParser from 'cookie-parser';
import postRoute from './routes/post.route.js';
import authRoute from './routes/auth.route.js';
const PORT = process.env.PORT || 8800;

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/post', postRoute);

app.use('/api/auth', authRoute);

app.listen(PORT, () => {
  console.log('Server is runing');
});
