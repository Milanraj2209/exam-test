import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import fs from 'fs';
import path from 'path';

const getLocalResults = () => {
  try {
    const filePath = path.join(process.cwd(), 'data', 'results.json');
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('Failed to read local results.json', e);
  }
  return [];
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const limit = searchParams.get('limit') || '100';

    let results: any[] = [];

    if (db) {
      try {
        let query: any = db.collection('Results');

        if (email) query = query.where('userEmail', '==', email);

        // Sort by date descending
        query = query.orderBy('date', 'desc').limit(Number(limit));
        
        const snapshot = await query.get();
        
        snapshot.forEach((doc: any) => {
          results.push({ id: doc.id, ...doc.data() });
        });
      } catch (fbError) {
        console.log('Firebase fetch failed for Results, falling back to local JSON data.');
        results = getLocalResults();
      }
    } else {
      results = getLocalResults();
    }

    if (!db || results.length === 0) {
      if (email) results = results.filter((r: any) => r.userEmail === email);
      results = results.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, Number(limit));
    }

    return NextResponse.json({ success: true, data: results });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to fetch results', error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newResult = await request.json();
    
    if (!newResult.userEmail || newResult.score === undefined || !newResult.total) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // Add server timestamp if missing
    if (!newResult.date) {
      newResult.date = new Date().toISOString();
    }

    if (db) {
      try {
        const docRef = await db.collection('Results').add(newResult);
        return NextResponse.json({ success: true, message: 'Result added to Firebase', id: docRef.id }, { status: 201 });
      } catch (fbError) {
        console.log('Firebase add failed for Results, falling back to local JSON data.');
      }
    }
    
    // Fallback: write to local JSON
    const localR = getLocalResults();
    newResult.id = 'r' + (localR.length + 1) + '_' + Date.now();
    localR.push(newResult);
    
    const filePath = path.join(process.cwd(), 'data', 'results.json');
    
    // Ensure dir exists
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(localR, null, 2));
    
    return NextResponse.json({ success: true, message: 'Result added to local JSON', id: newResult.id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to save result', error: error.message }, { status: 500 });
  }
}
