// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import Flashcard from './Flashcard.jsx';
import AdminDashboard from './Admindashboard.jsx'; // Import the AdminDashboard component

function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await axios.get(`https://flipcard-quiz.onrender.com/flashcards`);
        const data = response.data;

        const formattedFlashcards = data.map((questionItem) => {
          const answer = decodeString(questionItem.correct_answer);
          const options = [
            ...questionItem.incorrect_answers.map(a => decodeString(a)),
            answer
          ];
          return {
            id: questionItem.id,
            question: decodeString(questionItem.question),
            answer: answer,
            options: options.sort(() => Math.random() - 0.5)
          };
        });

        setFlashcards(formattedFlashcards);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching flashcards:', error);
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, []);

  function decodeString(str) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = str;
    return textArea.value;
  }

  function handleNext() {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  }

  function handlePrevious() {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
    <Routes>
      <Route
        path="/"
        element={
          <>
            <div className="header">
              Flashcard Quiz
              <Link to="/admin" className="button admin-button">Go to Admin Dashboard</Link>
            </div>
            <div className="container">
              {flashcards.length > 0 ? (
                <Flashcard flashcard={flashcards[currentIndex]} />
              ) : (
                <div>No flashcards available</div>
              )}
              <div className="navigation">
                <button className="button" onClick={handlePrevious}>Previous</button>
                <button className="button" onClick={handleNext}>Next</button>
              </div>
            </div>
          </>
        }
      />
      <Route
        path="/admin"
        element={
          <>
            <div className="header">
              Admin Dashboard
              <Link to="/" className="button admin-button">Back to Flashcard Quiz</Link>
            </div>
            <AdminDashboard />
          </>
        }
      />
    </Routes>
  </Router>

  );
}

export default App;
