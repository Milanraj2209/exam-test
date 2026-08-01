import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
// Remove the failing ESM import of pdf-parse

export async function POST(request: Request) {
  try {
    const { pdfUrl, year } = await request.json();

    if (!pdfUrl) {
      return NextResponse.json({ success: false, message: 'PDF URL is required' }, { status: 400 });
    }

    // 1. Download PDF
    console.log(`Downloading PDF from ${pdfUrl}...`);
    const pdfResponse = await fetch(pdfUrl);
    if (!pdfResponse.ok) {
      throw new Error(`Failed to download PDF. Status: ${pdfResponse.status}`);
    }
    
    const arrayBuffer = await pdfResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Parse PDF to Text
    console.log('Parsing PDF...');
    
    // Polyfill DOMMatrix for pdf.js in Node environment
    if (typeof global.DOMMatrix === 'undefined') {
      (global as any).DOMMatrix = class DOMMatrix {
        a=1; b=0; c=0; d=1; e=0; f=0;
      };
    }
    
    const pdfModule = require('pdf-parse/lib/pdf-parse.js');
    const pdf = typeof pdfModule === 'function' ? pdfModule : pdfModule.default;
    const pdfData = await pdf(buffer);
    const text = pdfData.text;

    console.log(`Extracted ${text.length} characters of text.`);

    if (text.length < 50) {
      throw new Error('PDF appears to be empty or unreadable.');
    }

    // 3. Send to Gemini
    console.log('Sending to Gemini for extraction...');
    
    // Initialize Gemini API
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured in the environment variables.');
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `
      You are an expert educational content extractor. I am providing you with the text extracted from a CTET (Central Teacher Eligibility Test) previous year question paper.
      Your task is to extract all the multiple-choice questions from this text and return them strictly as a JSON array.

      IMPORTANT RULES:
      1. Your response MUST be valid JSON only. Do not include any markdown formatting like \`\`\`json or \`\`\`.
      2. Extract as many questions as you can find.
      3. Use the following schema for each object in the array:
         - "subject": string (e.g., "Child Development and Pedagogy", "Mathematics", "Environmental Studies")
         - "topic": string (Infer a specific topic for the question, e.g., "Piaget's Theory", "Fractions", "Photosynthesis". If you cannot infer one, use "General")
         - "questionText": string (The actual question)
         - "options": object (A map of options, e.g., {"1": "Option A text", "2": "Option B text", "3": "Option C text", "4": "Option D text"})
         - "correctAnswer": string (The key of the correct option. If you are unsure, infer the best answer, but provide one.)
         - "explanation": string (A brief explanation of why the answer is correct)
         - "difficulty": string ("Easy", "Medium", or "Hard" based on your assessment)
         - "year_and_paper": string (Extract this from the header if possible, otherwise use "Unknown")

      Here is the raw text from the PDF:
      ---
      ${text}
    `;

    const modelResponse = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    let jsonString = modelResponse.text || '';
    
    // Clean up potential markdown formatting from Gemini
    jsonString = jsonString.replace(/^```json\n/, '').replace(/\n```$/, '');
    
    let questions;
    try {
      questions = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Failed to parse Gemini output as JSON:", jsonString.substring(0, 200) + "...");
      throw new Error('Gemini did not return valid JSON.');
    }

    if (!Array.isArray(questions)) {
      throw new Error('Gemini returned JSON, but it is not an array of questions.');
    }

    // 4. Save to Database using the local API route logic
    console.log(`Successfully extracted ${questions.length} questions. Saving...`);
    
    const { db } = await import('@/lib/firebase');
    const fs = await import('fs');
    const path = await import('path');
    
    let savedCount = 0;
    
    for (const q of questions) {
      // Validate schema loosely
      if (!q.questionText && !q.question) continue;
      
      const newQ: any = {
        subject: q.subject || 'Unknown',
        topic: q.topic || 'General',
        questionText: q.questionText || q.question,
        options: q.options || {},
        correctAnswer: q.correctAnswer || q.correct_answer || q.answer || "1",
        explanation: q.explanation || 'No explanation provided.',
        difficulty: q.difficulty || 'Medium',
        year_and_paper: year ? year : (q.year_and_paper || 'Unknown'),
        source: 'PDF Import',
        importedAt: new Date().toISOString()
      };

      if (db) {
        try {
          await db.collection('Questions').add(newQ);
          savedCount++;
          continue;
        } catch (e) {
          console.warn("Firebase save failed for a question, falling back to local JSON");
        }
      }
      
      // Local fallback
      try {
        const filePath = path.join(process.cwd(), 'data', 'questions.json');
        let localQ = [];
        if (fs.existsSync(filePath)) {
          localQ = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
        
        newQ.id = 'q' + (localQ.length + 1) + '_' + Date.now();
        localQ.push(newQ);
        
        if (!fs.existsSync(path.dirname(filePath))) {
          fs.mkdirSync(path.dirname(filePath), { recursive: true });
        }
        
        fs.writeFileSync(filePath, JSON.stringify(localQ, null, 2));
        savedCount++;
      } catch (e) {
        console.error("Local save failed", e);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully extracted and saved ${savedCount} questions!`,
      count: savedCount
    });

  } catch (error: any) {
    console.error('Import Error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to import questions' }, { status: 500 });
  }
}
