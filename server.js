import path from "path";
import express from "express";

const app = express();

// Serve API routes
app.use('/api', apiRouter);

// Serve React frontend
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
