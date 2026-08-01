"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, PlayCircle, Settings2, FileText, Target, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function MockTests() {
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pastYears, setPastYears] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch('/api/questions?limit=2000');
        const data = await res.json();
        if (data.success && data.data) {
          setQuestions(data.data);
          
          const years = new Set<string>();
          const subjs = new Set<string>();
          
          data.data.forEach((q: any) => {
            if (q.year_and_paper) years.add(q.year_and_paper);
            if (q.subject) subjs.add(q.subject);
          });
          
          setPastYears(Array.from(years).sort().reverse());
          setSubjects(Array.from(subjs));
        }
      } catch (err) {
        console.error("Failed to fetch questions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mock Tests</h1>
          <p className="text-muted-foreground mt-1">Simulate the real exam environment with our structured tests.</p>
        </div>
        <Button size="lg" className="rounded-full shadow-md" disabled>
          <Settings2 className="mr-2 h-5 w-5" /> Custom Mock Test (Coming Soon)
        </Button>
      </div>

      <Tabs defaultValue="full-length" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-full grid grid-cols-2 md:grid-cols-4 w-full md:w-auto h-auto">
          <TabsTrigger value="full-length" className="rounded-full data-[state=active]:bg-background py-2">Full Length</TabsTrigger>
          <TabsTrigger value="previous-year" className="rounded-full data-[state=active]:bg-background py-2">Previous Year</TabsTrigger>
          <TabsTrigger value="subject" className="rounded-full data-[state=active]:bg-background py-2">Subject Tests</TabsTrigger>
          <TabsTrigger value="topic" className="rounded-full data-[state=active]:bg-background py-2">Topic Tests</TabsTrigger>
        </TabsList>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading available tests...</p>
          </div>
        ) : (
          <>
            <TabsContent value="full-length" className="space-y-4">
              {questions.length >= 10 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="border-primary text-primary">Dynamic</Badge>
                        <Badge variant="secondary">Mixed</Badge>
                      </div>
                      <CardTitle>CTET Mega Mock Test</CardTitle>
                      <CardDescription>A dynamically generated test covering multiple subjects.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span className="flex items-center"><FileText className="mr-1 h-4 w-4" /> {Math.min(150, questions.length)} Questions</span>
                        <span className="flex items-center"><Clock className="mr-1 h-4 w-4" /> {Math.min(150, questions.length)} Mins</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full group" onClick={() => router.push(`/test/daily/all`)}>
                        Start Test <PlayCircle className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-xl">
                  <h3 className="text-lg font-semibold">Not enough questions</h3>
                  <p className="text-muted-foreground">Import more questions in the admin portal to unlock full-length tests.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="previous-year">
              {pastYears.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {pastYears.map((year) => (
                    <Card key={year} className="hover:border-primary/50 transition-colors">
                      <CardHeader>
                        <Badge variant="secondary" className="w-fit mb-2">Past Paper</Badge>
                        <CardTitle>CTET {year}</CardTitle>
                        <CardDescription>Practice the exact questions from this paper.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span className="flex items-center"><FileText className="mr-1 h-4 w-4" /> Official</span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <Button className="w-full group" onClick={() => router.push(`/test/daily/${encodeURIComponent(year)}`)}>
                          Attempt Paper <PlayCircle className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-xl">
                  <h3 className="text-lg font-semibold">No Past Papers Found</h3>
                  <p className="text-muted-foreground">Make sure to add the year and paper in your CSV imports.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="subject">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {subjects.length > 0 ? (
                  subjects.map((subject) => (
                    <Card key={subject} className="hover:border-primary/50 transition-colors">
                      <CardHeader>
                        <Badge variant="outline" className="border-primary text-primary w-fit mb-2">Subject Test</Badge>
                        <CardTitle>{subject}</CardTitle>
                      </CardHeader>
                      <CardFooter>
                        <Button className="w-full group" variant="outline" onClick={() => router.push(`/test/daily/${encodeURIComponent(subject)}`)}>
                          Start <PlayCircle className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center p-12 bg-muted/20 rounded-xl border border-dashed">
                    <Target className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium">No Subjects Available</h3>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="topic">
              <div className="flex flex-col items-center justify-center p-12 bg-muted/20 rounded-xl border border-dashed">
                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium">Go to the Practice tab</h3>
                <p className="text-muted-foreground text-center mt-2 max-w-sm">For topic-specific micro-tests, please visit the main Practice section.</p>
                <Button className="mt-4" onClick={() => router.push('/practice')}>Take me there</Button>
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
