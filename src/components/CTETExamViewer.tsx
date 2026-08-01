"use client";

import React, { useState } from 'react';

// Using a generic Question interface to support the CTET structure
export interface CTETQuestion {
  id: string;
  question_type: string;
  content: {
    english: { assertion: string; reason: string; image_url?: string | null };
    hindi: { assertion: string; reason: string; image_url?: string | null };
  };
  options: {
    id: string;
    english: string;
    hindi: string;
    is_correct: boolean;
  }[];
  explanation: {
    english: string;
    hindi: string;
  };
}

interface CTETExamViewerProps {
  question: CTETQuestion;
}

export default function CTETExamViewer({ question }: CTETExamViewerProps) {
  const [language, setLanguage] = useState<'english' | 'hindi'>('english');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSubmit = () => {
    setShowExplanation(true);
  };

  const handleLanguageToggle = () => {
    setLanguage(prev => (prev === 'english' ? 'hindi' : 'english'));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 bg-white text-gray-800 rounded-xl shadow-lg border border-gray-100">
      
      {/* 1. Header & Language Toggle */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <div>
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold tracking-wide">
            Assertion & Reason
          </span>
        </div>
        <button 
          onClick={handleLanguageToggle}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm flex items-center gap-2"
        >
          <span>🌐</span> View in {language === 'english' ? 'Hindi' : 'English'}
        </button>
      </div>

      {/* 2. Display the Question Content dynamically based on language */}
      <div className="mb-8 p-6 bg-blue-50 border-l-4 border-indigo-500 rounded-r-lg">
        <p className="font-bold text-lg md:text-xl mb-4 leading-relaxed text-slate-900">
          {question.content[language].assertion}
        </p>
        <p className="text-slate-700 italic text-md md:text-lg leading-relaxed">
          {question.content[language].reason}
        </p>
      </div>

      {/* 3. Display the Options */}
      <div className="space-y-4 mb-8">
        {question.options.map((opt, index) => {
          
          let optionClasses = "p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 text-md md:text-lg font-medium";
          
          if (showExplanation) {
            // Evaluated State
            if (opt.is_correct) {
              optionClasses += " border-green-500 bg-green-50 text-green-900 shadow-sm"; // Correct answer styling
            } else if (selectedOption === opt.id && !opt.is_correct) {
              optionClasses += " border-red-500 bg-red-50 text-red-900 shadow-sm"; // User picked wrong answer
            } else {
              optionClasses += " border-gray-200 bg-gray-50 opacity-60"; // Other unselected wrong answers
            }
          } else {
            // Picking State
            if (selectedOption === opt.id) {
              optionClasses += " border-indigo-500 bg-indigo-50 text-indigo-900 shadow-md transform scale-[1.01]";
            } else {
              optionClasses += " border-gray-200 hover:border-indigo-300 hover:bg-gray-50";
            }
          }

          return (
            <div 
              key={opt.id}
              onClick={() => !showExplanation && setSelectedOption(opt.id)}
              className={optionClasses}
            >
              <div className="flex items-start">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-300 shadow-sm mr-4 shrink-0 font-bold text-gray-600">
                  {index + 1}
                </span>
                <span className="mt-1">{opt[language]}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Submit Button */}
      <button 
        onClick={handleSubmit}
        disabled={!selectedOption || showExplanation}
        className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md"
      >
        {showExplanation ? 'Evaluated' : 'Submit Answer'}
      </button>

      {/* 5. Show Explanation conditionally after submitting */}
      {showExplanation && (
        <div className="mt-8 p-6 bg-amber-50 rounded-xl border border-amber-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="font-bold text-amber-900 text-lg mb-3 flex items-center gap-2">
            <span>💡</span> Explanation:
          </h3>
          <p className="text-amber-950 leading-relaxed text-md md:text-lg">
            {question.explanation[language]}
          </p>
        </div>
      )}

    </div>
  );
}
