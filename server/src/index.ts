import express, { Request, Response } from 'express';
import cors from 'cors';
import usersRouter from './routes/userRoutes';

const app = express();
const PORT = 3100;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello from TypeScript server on port 3100!' });
});

app.use('/api/users', usersRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
