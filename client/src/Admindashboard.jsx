import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingFlashcard, setEditingFlashcard] = useState(null);
  const [form, setForm] = useState({ question: '', correct_answer: '', incorrect_answers: [] });

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await axios.get(`https://flipcard-quiz.onrender.com/flashcards`);
        setFlashcards(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching flashcards:', error);
      }
    };
    fetchFlashcards();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleArrayInputChange = (index, value) => {
    const updatedAnswers = [...form.incorrect_answers];
    updatedAnswers[index] = value;
    setForm({ ...form, incorrect_answers: updatedAnswers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFlashcard) {
        await axios.put(`https://flipcard-quiz.onrender.com/flashcards/${editingFlashcard.id}`, form);
      } else {
        await axios.post(`https://flipcard-quiz.onrender.com/addflashcards`, form);
      }
      setForm({ question: '', correct_answer: '', incorrect_answers: [] });
      setEditingFlashcard(null);
      const response = await axios.get(`https://flipcard-quiz.onrender.com/flashcards`);
      setFlashcards(response.data);
    } catch (error) {
      console.error('Error saving flashcard:', error);
    }
  };

  const handleEdit = (flashcard) => {
    setEditingFlashcard(flashcard);
    setForm(flashcard);
  };

  const handleCancelEdit = () => {
    setEditingFlashcard(null);
    setForm({ question: '', correct_answer: '', incorrect_answers: [] });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://flipcard-quiz.onrender.com/flashcards/${id}`);
      setFlashcards(flashcards.filter(flashcard => flashcard.id !== id));
    } catch (error) {
      console.error('Error deleting flashcard:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      
      <form onSubmit={handleSubmit} className="form">
      <h2>{editingFlashcard ? 'Editing Flashcard' : 'Adding Flashcard'}</h2>
        <label htmlFor="question">Question</label>
        <input
          type="text"
          id="question"
          name="question"
          className="input"
          placeholder="Question"
          value={form.question}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="correct_answer">Correct Answer</label>
        <input
          type="text"
          id="correct_answer"
          name="correct_answer"
          className="input"
          placeholder="Correct Answer"
          value={form.correct_answer}
          onChange={handleInputChange}
          required
        />
        <div className="incorrect-answers">
          {form.incorrect_answers.map((answer, index) => (
            <React.Fragment key={index}>
              <label htmlFor={`incorrect_answer_${index}`}>Incorrect Answer {index + 1}</label>
              <input
                type="text"
                id={`incorrect_answer_${index}`}
                className="input"
                placeholder={`Incorrect Answer ${index + 1}`}
                value={answer}
                onChange={(e) => handleArrayInputChange(index, e.target.value)}
                required
              />
            </React.Fragment>
          ))}
          <button type="button" className="button" onClick={() => setForm({ ...form, incorrect_answers: [...form.incorrect_answers, ''] })}>
            Add Incorrect Answer
          </button>
        </div>
        <div className="form-actions">
          <button type="submit" className="button">
            {editingFlashcard ? 'Update Flashcard' : 'Add Flashcard'}
          </button>
          {editingFlashcard && (
            <button type="button" className="button cancel-button" onClick={handleCancelEdit}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>
      <ul className="flashcard-list">
        {flashcards.map(flashcard => (
          <li key={flashcard.id} className="flashcard-item">
            <strong>{flashcard.question}</strong>
            <div className="form-actions" style={{ gap: '1rem'}}>
              <button className="button" onClick={() => handleEdit(flashcard)}>Edit</button>
              <button className="button" onClick={() => handleDelete(flashcard.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
