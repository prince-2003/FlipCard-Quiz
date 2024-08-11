import React, { useState, useEffect, useRef } from 'react';

export default function Flashcard({ flashcard }) {
  const [flip, setFlip] = useState(false);
  const [size, setSize] = useState({ height: 'initial', width: 'initial' });

  const frontEl = useRef();
  const backEl = useRef();

  function setMaxSize() {
    const frontHeight = frontEl.current.getBoundingClientRect().height;
    const backHeight = backEl.current.getBoundingClientRect().height;
    const frontWidth = frontEl.current.getBoundingClientRect().width;
    const backWidth = backEl.current.getBoundingClientRect().width;

    setSize({
      height: Math.max(frontHeight, backHeight, 200),
      width: Math.max(frontWidth, backWidth, 400)
    });
  }

  useEffect(() => {
    setMaxSize();
    setFlip(false); 
  }, [flashcard]);

  useEffect(() => {
    window.addEventListener('resize', setMaxSize);
    return () => window.removeEventListener('resize', setMaxSize);
  }, []);

  return (
    <div
      className={`card ${flip ? 'flip' : ''}`}
      style={{ height: size.height, width: size.width }}
      onClick={() => setFlip(!flip)}
    >
      <div className="front" ref={frontEl}>
        {flashcard.question}
        <div className="flashcard-options">
          {flashcard.options.map(option => (
            <div className="flashcard-option" key={option}>{option}</div>
          ))}
        </div>
      </div>
      <div className="back" ref={backEl}>
        {flashcard.answer}
      </div>
    </div>
  );
}
