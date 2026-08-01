import React from 'react';
import CTETExamViewer, { CTETQuestion } from '@/components/CTETExamViewer';
import { db } from '@/lib/firebase';

// Fallback Mock JSON data in case Firebase is not configured yet
const mockQuestion: CTETQuestion = {
  id: "ctet_p2_ss_301",
  question_type: "assertion_reason",
  content: {
    english: {
      assertion: "Assertion (A): The Earth is called a 'Blue Planet'.",
      reason: "Reason (R): More than 71% of the Earth's surface is covered with water."
    },
    hindi: {
      assertion: "अभिकथन (A): पृथ्वी को 'नीला ग्रह' कहा जाता है।",
      reason: "कारण (R): पृथ्वी की सतह का 71% से अधिक भाग पानी से ढका है।"
    }
  },
  options: [
    {
      id: "opt_1",
      english: "Both (A) and (R) are true and (R) is the correct explanation of (A).",
      hindi: "(A) और (R) दोनों सही हैं और (R), (A) की सही व्याख्या है।",
      is_correct: true
    },
    {
      id: "opt_2",
      english: "Both (A) and (R) are true but (R) is NOT the correct explanation of (A).",
      hindi: "(A) और (R) दोनों सही हैं लेकिन (R), (A) की सही व्याख्या नहीं है।",
      is_correct: false
    },
    {
      id: "opt_3",
      english: "(A) is true but (R) is false.",
      hindi: "(A) सही है लेकिन (R) गलत है।",
      is_correct: false
    },
    {
      id: "opt_4",
      english: "Both (A) and (R) are false.",
      hindi: "(A) और (R) दोनों गलत हैं।",
      is_correct: false
    }
  ],
  explanation: {
    english: "The Earth is referred to as the Blue Planet because when viewed from space, it appears blue. This is directly due to the fact that over 71% of its surface is covered by oceans and water bodies. Therefore, the reason perfectly explains the assertion.",
    hindi: "पृथ्वी को नीला ग्रह कहा जाता है क्योंकि अंतरिक्ष से देखने पर यह नीली दिखाई देती है। यह सीधे तौर पर इस तथ्य के कारण है कि इसकी सतह का 71% से अधिक हिस्सा महासागरों और जल निकायों से ढका हुआ है। इसलिए, कारण अभिकथन की पूरी तरह से व्याख्या करता है।"
  }
};

export default async function CTETPaper2Page() {
  
  let questionToRender = mockQuestion;
  
  // Try fetching from Firestore if it is initialized
  if (db) {
    try {
      const snapshot = await db.collection('ctet_questions').limit(1).get();
      if (!snapshot.empty) {
        questionToRender = snapshot.docs[0].data() as CTETQuestion;
        // ensure ID is set from doc id if not in data
        if (!questionToRender.id) questionToRender.id = snapshot.docs[0].id;
      } else {
        console.warn("Firestore 'ctet_questions' collection is empty. Falling back to mock data.");
      }
    } catch (error) {
      console.error("Error fetching question from Firestore:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Area */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            CTET Paper 2 <span className="text-indigo-600">Mock Test</span>
          </h1>
          <p className="mt-3 text-xl text-gray-500 sm:mt-4">
            Social Science (Geography)
          </p>
          <div className="mt-4 flex justify-center space-x-4">
             <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
               Live from Firebase
             </span>
             <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
               Difficulty: Easy
             </span>
          </div>
        </div>

        {/* The Question Viewer Component */}
        <CTETExamViewer question={questionToRender} />
        
        {/* Navigation Footer Mock */}
        <div className="mt-8 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200">
           <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium disabled:opacity-50" disabled>
              ← Previous Question
           </button>
           <div className="text-sm text-gray-500 font-medium">Question 1 of 30</div>
           <button className="px-4 py-2 text-indigo-600 hover:text-indigo-900 font-medium">
              Next Question →
           </button>
        </div>

      </div>
    </div>
  );
}
