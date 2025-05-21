import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = 3100;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello from TypeScript server on port 3100!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
