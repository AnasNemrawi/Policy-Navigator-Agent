import React from 'react';
import './ExamplePrompts.css';

const ExamplePrompts = ({ darkTheme, onSelectPrompt }) => {
  const examples = [
    "What is the policy for academic transcripts at Cambridge School?",
    "What are the responsibilities of an SEA and an LEA for preparing a report card?",
    "Explain the Every Student Succeeds Act",
    "Save a note about ESEA requirements"
  ];

  return (
    <div className={`example-prompts ${darkTheme ? 'dark-theme' : 'light-theme'}`}>
      <h3>💡 Example Prompts</h3>
      <div className="prompts-grid">
        {examples.map((prompt, index) => (
          <button
            key={index}
            className="prompt-btn"
            onClick={() => onSelectPrompt(prompt, '')}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExamplePrompts;

