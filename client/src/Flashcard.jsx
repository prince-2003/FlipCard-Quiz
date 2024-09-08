import React, { useState, useEffect } from 'react';

export default function Flashcard({ flashcard }) {
  const [flip, setFlip] = useState(false);

 
  useEffect(() => {
    
    setFlip(false); 
  }, [flashcard]);


  return (
    <div
      className={`card ${flip ? 'flip' : ''}`}
      onClick={() => setFlip(!flip)}
    >
      <div className="front" >
        {flashcard.question}
        <div className="flashcard-options">
          {flashcard.options.map(option => (
            <div className="flashcard-option" key={option}>{option}</div>
          ))}
        </div>
      </div>
      <div className="back" >
        {flashcard.answer}
      </div>
    </div>
  );
}
