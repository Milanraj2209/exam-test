"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Loader2, Target } from "lucide-react";

export default function DailyChallengesPage() {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch('/api/questions?limit=1000');
        const data = await res.json();
        
        if (data.success && data.data) {
          const subjectSet = new Set<string>();
          data.data.forEach((q: any) => {
            const subject = q.subject || "General";
            subjectSet.add(subject);
          });
          setSubjects(Array.from(subjectSet));
        }
      } catch (err) {
        console.error("Failed to fetch subjects for daily tests", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubjects();
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <span className="text-4xl mr-3">🔥</span> Daily Challenges
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Fresh, seeded 50-question tests for each subject. Compete against others taking the same test today!
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading today's challenges...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {subjects.length === 0 ? (
             <div className="col-span-full text-center py-12 border-2 border-dashed rounded-xl">
               <h3 className="text-lg font-semibold">No subjects found</h3>
               <p className="text-muted-foreground">Import some questions to see daily challenges.</p>
             </div>
          ) : (
            subjects.map((subject) => (
              <Card key={`daily-${subject}`} className="bg-gradient-to-br from-primary/10 to-background border-primary/20 shadow-md hover:border-primary/50 transition-colors group">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="border-primary text-primary bg-primary/5">
                      Daily Seed: {new Date().toLocaleDateString()}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl mt-1 text-primary">{subject}</CardTitle>
                  <CardDescription className="text-base flex items-center mt-2">
                    <Target className="mr-2 h-4 w-4" /> 50 Questions • 1 Min/Q
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    size="lg" 
                    className="w-full font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-all" 
                    onClick={() => window.location.href = `/test/daily/${encodeURIComponent(subject)}`}
                  >
                    Start Challenge <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
