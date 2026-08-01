import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import fs from 'fs';
import path from 'path';

const getLocalQuestions = () => {
  try {
    const filePath = path.join(process.cwd(), 'data', 'questions.json');
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('Failed to read local questions.json', e);
  }
  return [];
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const topic = searchParams.get('topic');
    const difficulty = searchParams.get('difficulty');
    const limit = searchParams.get('limit') || '150';

    let questions: any[] = [];

    if (db) {
      try {
        let query: any = db.collection('Questions');

        if (subject && subject.toLowerCase() !== 'all') query = query.where('subject', '==', subject);
        if (topic) query = query.where('topic', '==', topic);
        if (difficulty) query = query.where('difficulty', '==', difficulty);

        query = query.limit(Number(limit));
        const snapshot = await query.get();
        
        snapshot.forEach((doc: any) => {
          questions.push({ id: doc.id, ...doc.data() });
        });
      } catch (fbError) {
        console.log('Firebase fetch failed, falling back to local JSON data.');
        questions = getLocalQuestions();
      }
    } else {
      questions = getLocalQuestions();
    }

    const mode = searchParams.get('mode');

    if (mode === 'daily') {
      if (subject && subject.toLowerCase() !== 'all') {
        questions = questions.filter((q: any) => q.subject === subject);
      }
      
      const today = new Date().toISOString().split('T')[0];
      const subjectHash = subject ? [...subject].reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
      
      // Simple PRNG seeded by the current date + subject
      let seedVal = (parseInt(today.replace(/-/g, '')) || 12345) + subjectHash;
      const random = () => {
        const x = Math.sin(seedVal++) * 10000;
        return x - Math.floor(x);
      };

      // Fisher-Yates shuffle with seeded random
      for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
      }
      
      questions = questions.slice(0, 50);
    } else {
      if (!db || questions.length === 0) {
        // Apply manual filtering to local questions if firebase failed or was not initialized
        if (subject && subject.toLowerCase() !== 'all') questions = questions.filter((q: any) => q.subject === subject);
        if (topic) questions = questions.filter((q: any) => q.topic === topic);
        if (difficulty) questions = questions.filter((q: any) => q.difficulty === difficulty);
      }
      questions = questions.slice(0, Number(limit));
    }

    return NextResponse.json({ success: true, data: questions });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to fetch questions', error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newQuestion = await request.json();
    
    if (!newQuestion.subject || !newQuestion.questionText || !newQuestion.correctAnswer) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    if (db) {
      try {
        const docRef = await db.collection('Questions').add(newQuestion);
        return NextResponse.json({ success: true, message: 'Question added to Firebase', id: docRef.id }, { status: 201 });
      } catch (fbError) {
        console.log('Firebase add failed, falling back to local JSON data.');
      }
    }
    
    // Fallback: write to local JSON
    const localQ = getLocalQuestions();
    newQuestion.id = 'q' + (localQ.length + 1);
    localQ.push(newQuestion);
    
    const filePath = path.join(process.cwd(), 'data', 'questions.json');
    
    // Ensure dir exists
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(localQ, null, 2));
    
    return NextResponse.json({ success: true, message: 'Question added to local JSON', id: newQuestion.id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to add question', error: error.message }, { status: 500 });
  }
}
