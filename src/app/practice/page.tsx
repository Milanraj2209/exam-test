"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Filter, Search, ChevronRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function PracticeModule() {
  const [activeSubject, setActiveSubject] = useState("All");
  const [subjects, setSubjects] = useState<string[]>(["All"]);
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAndGroupQuestions = async () => {
      try {
        const res = await fetch('/api/questions?limit=1000');
        const data = await res.json();
        
        if (data.success && data.data) {
          const questions = data.data;
          
          const topicMap: Record<string, { subject: string, count: number, difficulty: string }> = {};
          const subjectSet = new Set<string>();

          questions.forEach((q: any) => {
            const subject = q.subject || "General";
            const topic = q.topic || subject; // Fallback to subject if no specific topic

            subjectSet.add(subject);

            const topicKey = `${subject}|||${topic}`;
            if (!topicMap[topicKey]) {
              topicMap[topicKey] = {
                subject: subject,
                count: 0,
                difficulty: q.difficulty || "Medium"
              };
            }
            topicMap[topicKey].count += 1;
          });

          const uniqueSubjects = ["All", ...Array.from(subjectSet)];
          
          const aggregatedTopics = Object.keys(topicMap).map(key => {
            const [subj, top] = key.split("|||");
            return {
              name: top,
              subject: subj,
              questionsCount: topicMap[key].count,
              difficulty: topicMap[key].difficulty
            };
          });

          // Sort topics by question count
          aggregatedTopics.sort((a, b) => b.questionsCount - a.questionsCount);

          setSubjects(uniqueSubjects);
          setTopics(aggregatedTopics);
        }
      } catch (err) {
        console.error("Failed to fetch questions for practice page", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAndGroupQuestions();
  }, []);

  const filteredTopics = topics.filter(t => {
    const matchesSubject = activeSubject === "All" || t.subject === activeSubject;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Practice Topic-wise PYQs</h1>
          <p className="text-muted-foreground mt-1">Select a topic to start practicing previous year questions.</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search topics..." 
              className="w-[250px] pl-8" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>



      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Analyzing your imported questions...</p>
        </div>
      ) : (
        <>
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {subjects.map((subject) => (
              <Button
                key={subject}
                variant={activeSubject === subject ? "default" : "outline"}
                className="rounded-full whitespace-nowrap"
                onClick={() => setActiveSubject(subject)}
              >
                {subject}
              </Button>
            ))}
          </div>

          {filteredTopics.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-xl">
              <h3 className="text-lg font-semibold">No topics found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTopics.map((topic, i) => (
                <Card key={i} className="hover:border-primary/50 transition-colors cursor-pointer group">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <Badge variant="secondary" className="mb-2">{topic.subject}</Badge>
                      <Badge variant={topic.difficulty === "Easy" ? "default" : topic.difficulty === "Medium" ? "secondary" : "destructive"}>
                        {topic.difficulty}
                      </Badge>
                    </div>
                    <CardTitle>{topic.name}</CardTitle>
                    <CardDescription className="flex items-center mt-2">
                      <BookOpen className="mr-1 h-4 w-4" /> {topic.questionsCount} Questions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all" 
                      variant="outline"
                      onClick={() => window.location.href = `/test/${encodeURIComponent(topic.name)}`}
                    >
                      Start Practice <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
