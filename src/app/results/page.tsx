"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Clock, Target, CheckCircle2, XCircle, MinusCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ResultsPage() {
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const dataString = sessionStorage.getItem("testSessionData");
    if (dataString) {
      try {
        const data = JSON.parse(dataString);
        const { questions, selectedOptions, timeSpent, terminated } = data;
        
        let correct = 0;
        let wrong = 0;
        let skipped = 0;
        const subjectStats: Record<string, { correct: number, total: number }> = {};

        questions.forEach((q: any) => {
          const subject = q.subject || "General";
          if (!subjectStats[subject]) {
            subjectStats[subject] = { correct: 0, total: 0 };
          }
          subjectStats[subject].total += 1;

          const correctAns = q.correctAnswer || q.correct_answer || q.answer;
          const userAns = selectedOptions[q.id];

          if (!userAns) {
            skipped += 1;
          } else if (userAns === correctAns) {
            correct += 1;
            subjectStats[subject].correct += 1;
          } else {
            wrong += 1;
          }
        });

        const total = questions.length;
        const accuracy = (correct + wrong) > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;
        
        const m = Math.floor(timeSpent / 60);
        const s = timeSpent % 60;
        const timeTaken = `${m}m ${s}s`;

        // Save to test history
        const isSaved = sessionStorage.getItem("testSaved");
        if (!isSaved) {
          const historyString = localStorage.getItem("testHistory");
          const history = historyString ? JSON.parse(historyString) : [];
          history.push({
            id: Date.now().toString(),
            date: new Date().toISOString(),
            score: correct,
            total,
            accuracy,
            timeSpent,
            subjectStats,
          });
          localStorage.setItem("testHistory", JSON.stringify(history));
          sessionStorage.setItem("testSaved", "true");
        }

        const colors = ["bg-success", "bg-accent", "bg-primary", "bg-destructive"];
        const topicPerformance = Object.keys(subjectStats).map((subject, i) => ({
          topic: subject,
          score: `${subjectStats[subject].correct}/${subjectStats[subject].total}`,
          color: colors[i % colors.length]
        }));

        setResult({
          score: correct,
          total,
          accuracy,
          timeTaken,
          correct,
          wrong,
          skipped,
          topicPerformance,
          terminated
        });

      } catch (err) {
        console.error("Failed to parse session data", err);
      }
    }
  }, []);

  if (!result) {
    return (
      <div className="container mx-auto p-4 md:p-8 flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
        <h2 className="text-2xl font-bold">No Recent Test Data Found</h2>
        <p className="text-muted-foreground">It looks like you haven't taken a test recently, or your session expired.</p>
        <Link href="/practice">
          <Button>Go to Practice</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div className="text-center mb-10 mt-8">
        {result.terminated && (
          <div className="bg-destructive/10 border-2 border-destructive/20 text-destructive p-4 rounded-xl max-w-3xl mx-auto mb-8 flex items-start space-x-3 text-left">
            <XCircle className="h-6 w-6 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-semibold text-lg">Test Terminated for Policy Violation</h4>
              <p className="text-sm mt-1 text-destructive/90 font-medium">
                Your test was automatically submitted before completion because you repeatedly left the test environment. 
                Focus and integrity are critical during examinations.
              </p>
            </div>
          </div>
        )}

        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-success/20 text-success mb-6"
        >
          <Trophy className="h-12 w-12" />
        </motion.div>
        <h1 className="text-4xl font-bold tracking-tight">Test Completed!</h1>
        <p className="text-xl text-muted-foreground mt-2">Here is your performance analysis for Mock Test 1</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center"><Target className="mr-2 h-4 w-4 text-primary" /> Total Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-primary">{result.score}<span className="text-2xl text-muted-foreground font-medium">/{result.total}</span></div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-success" /> Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold">{result.accuracy}%</div>
            <Progress value={result.accuracy} className="mt-3 h-2 bg-muted [&>div]:bg-success" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center"><Clock className="mr-2 h-4 w-4 text-accent" /> Time Taken</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold">{result.timeTaken}</div>
          </CardContent>
        </Card>

        <Card className="row-span-2">
          <CardHeader>
            <CardTitle>Attempt Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="flex items-center text-muted-foreground"><CheckCircle2 className="mr-2 h-4 w-4 text-success" /> Correct</span>
              <span className="font-bold text-lg">{result.correct}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center text-muted-foreground"><XCircle className="mr-2 h-4 w-4 text-destructive" /> Incorrect</span>
              <span className="font-bold text-lg">{result.wrong}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center text-muted-foreground"><MinusCircle className="mr-2 h-4 w-4 text-muted-foreground" /> Skipped</span>
              <span className="font-bold text-lg">{result.skipped}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Topic-wise Analysis</CardTitle>
            <CardDescription>See how you performed across different subjects.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.topicPerformance.map((topic, i) => {
                const percentage = (parseInt(topic.score.split('/')[0]) / parseInt(topic.score.split('/')[1])) * 100;
                return (
                  <div key={i}>
                    <div className="flex justify-between mb-1 text-sm font-medium">
                      <span>{topic.topic}</span>
                      <span>{topic.score}</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center gap-4 pt-8">
        <Link href="/analytics" tabIndex={-1}>
          <Button size="lg" variant="outline">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
