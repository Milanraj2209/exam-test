"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Trophy } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminResultsPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch('/api/results?limit=500');
        const data = await res.json();
        if (data.success && data.data) {
          setResults(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch user results", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 min-h-screen bg-muted/20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">User Test Results</h1>
          </div>
          <p className="text-muted-foreground">Monitor performance of users taking tests on the platform.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
          <CardDescription>A real-time list of the most recent tests taken by your users.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading user results...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-xl bg-muted/30">
              <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No results found</h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm mt-1">
                No logged-in users have submitted any tests yet. When they do, their scores will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                  <tr>
                    <th className="px-4 py-3 font-medium">User Email</th>
                    <th className="px-4 py-3 font-medium">Score</th>
                    <th className="px-4 py-3 font-medium">Accuracy</th>
                    <th className="px-4 py-3 font-medium">Time Taken</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {results.map((r) => {
                    const m = Math.floor((r.timeSpent || 0) / 60);
                    const s = (r.timeSpent || 0) % 60;
                    const dateObj = new Date(r.date);
                    
                    return (
                      <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-4 font-medium text-foreground">{r.userEmail}</td>
                        <td className="px-4 py-4 font-bold text-primary">{r.score} <span className="text-muted-foreground font-normal">/ {r.total}</span></td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            r.accuracy >= 80 ? 'bg-success/20 text-success' : 
                            r.accuracy >= 50 ? 'bg-accent/20 text-accent' : 
                            'bg-destructive/20 text-destructive'
                          }`}>
                            {r.accuracy}%
                          </span>
                        </td>
                        <td className="px-4 py-4 text-muted-foreground">{m}m {s}s</td>
                        <td className="px-4 py-4 text-muted-foreground">
                          {dateObj.toLocaleDateString()} at {dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
