import express from 'express';
import dotenv from 'dotenv';
import db from 'pg';
import cors from 'cors'; 

dotenv.config();

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Allow the react app to access the server
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
  allowedHeaders: ['Content-Type'], // Specify allowed headers
  credentials: true // If you need to send cookies or other credentials
}));

const pool = new db.Pool({
  user: process.env.DB_USER,   
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.get('/flashcards', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM flashcards');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


app.post('/addflashcards', async (req, res) => {
  const { question, correct_answer, incorrect_answers } = req.body;  

  try {
    await pool.query(
      'INSERT INTO flashcards (question, correct_answer, incorrect_answers) VALUES ($1, $2, $3)', 
      [question, correct_answer, incorrect_answers]
    );
    res.status(201).send('Flashcard added');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// Update an existing flashcard
app.put('/flashcards/:id', async (req, res) => {
  const { id } = req.params;
  const { question, correct_answer, incorrect_answers } = req.body;

  try {
    await pool.query(
      'UPDATE flashcards SET question = $1, correct_answer = $2, incorrect_answers = $3 WHERE id = $4',
      [question, correct_answer, incorrect_answers, id]
    );
    res.send('Flashcard updated');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// Delete a flashcard
app.delete('/flashcards/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM flashcards WHERE id = $1', [id]);
    res.send('Flashcard deleted');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
