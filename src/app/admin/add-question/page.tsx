"use client";

import React, { useState } from 'react';

export default function AddQuestionAdmin() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus("Saving...");
    
    // In a real app, you would post this to an API route (/api/admin/add-question)
    // which securely uses the firebase-admin SDK to write to Firestore.
    try {
      const response = await fetch('/api/admin/add-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            // Form values would go here...
            test: "test"
        })
      });
      if (response.ok) {
          setStatus("Question saved to Firebase successfully!");
      } else {
          setStatus("Error saving to Firebase.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Error saving to Firebase.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white mt-12 rounded-xl shadow border border-gray-200">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Add CTET Question to Firebase</h1>
      <form onSubmit={handleSubmit} className="space-y-6 text-gray-700">
         <div>
            <label className="block font-medium mb-1">Assertion (English)</label>
            <textarea className="w-full p-2 border rounded" rows={2} placeholder="e.g. The Earth is a Blue Planet"></textarea>
         </div>
         <div>
            <label className="block font-medium mb-1">Reason (English)</label>
            <textarea className="w-full p-2 border rounded" rows={2}></textarea>
         </div>
         
         <hr />
         <p className="font-bold">Options</p>
         
         <div className="grid grid-cols-2 gap-4">
             <input type="text" className="p-2 border rounded" placeholder="Option 1 (English)" />
             <input type="text" className="p-2 border rounded" placeholder="Option 2 (English)" />
             <input type="text" className="p-2 border rounded" placeholder="Option 3 (English)" />
             <input type="text" className="p-2 border rounded" placeholder="Option 4 (English)" />
         </div>

         <button 
           type="submit" 
           disabled={loading}
           className="w-full py-3 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-700"
         >
           {loading ? 'Pushing to Database...' : 'Save to Firebase Firestore'}
         </button>
         {status && <p className="mt-4 text-center font-medium text-green-600">{status}</p>}
      </form>
    </div>
  );
}
