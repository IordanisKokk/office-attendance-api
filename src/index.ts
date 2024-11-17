import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

// Your routes with proper typing
app.get('/', (req: Request, res: Response) => {
  res.send('Hello Office Attendance Tracking World!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
