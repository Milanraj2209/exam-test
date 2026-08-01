"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, CheckCircle, Clock, Target, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [history, setHistory] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);

  useEffect(() => {
    const historyString = localStorage.getItem("testHistory");
    if (historyString) {
      try {
        const parsedHistory = JSON.parse(historyString);
        setHistory(parsedHistory);

        let totalQuestions = 0;
        let totalCorrect = 0;
        let totalTimeSpent = 0;
        const subjectAggregates: Record<string, { correct: number, total: number }> = {};

        const dataForChart = parsedHistory.slice(-15).map((test: any, index: number) => {
          totalQuestions += test.total;
          totalCorrect += test.score;
          totalTimeSpent += test.timeSpent;

          Object.keys(test.subjectStats).forEach(sub => {
            if (!subjectAggregates[sub]) subjectAggregates[sub] = { correct: 0, total: 0 };
            subjectAggregates[sub].correct += test.subjectStats[sub].correct;
            subjectAggregates[sub].total += test.subjectStats[sub].total;
          });

          return {
            name: `Test ${index + 1}`,
            accuracy: test.accuracy
          };
        });

        const avgAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
        const hours = Math.floor(totalTimeSpent / 3600);
        const minutes = Math.floor((totalTimeSpent % 3600) / 60);

        setStats({
          questionsSolved: totalQuestions,
          accuracy: avgAccuracy,
          timeSpent: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`,
          testsTaken: parsedHistory.length
        });

        setChartData(dataForChart);

        const strong: string[] = [];
        const weak: string[] = [];

        Object.keys(subjectAggregates).forEach(sub => {
          const acc = subjectAggregates[sub].correct / subjectAggregates[sub].total;
          if (acc >= 0.8) strong.push(sub);
          else if (acc < 0.6) weak.push(sub);
        });

        setStrengths(strong);
        setWeaknesses(weak);
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  if (history.length === 0) {
    return (
      <div className="container mx-auto p-4 md:p-8 flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
        <h2 className="text-3xl font-bold">Welcome to your Dashboard!</h2>
        <p className="text-muted-foreground text-lg">You haven't taken any tests yet. Start practicing to see your analytics here.</p>
        <Link href="/practice">
          <Button size="lg" className="mt-4">Start Practice</Button>
        </Link>
      </div>
    );
  }

  const statCards = [
    { title: "Tests Taken", value: stats?.testsTaken || 0, icon: Target, color: "text-blue-500", progress: 100 },
    { title: "Questions Solved", value: stats?.questionsSolved || 0, icon: CheckCircle, color: "text-green-500", progress: 100 },
    { title: "Overall Accuracy", value: `${stats?.accuracy || 0}%`, icon: Brain, color: "text-purple-500", progress: stats?.accuracy || 0 },
    { title: "Time Spent", value: stats?.timeSpent || "0m", icon: Clock, color: "text-orange-500", progress: 100 },
  ];

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track your progress and identify areas for improvement.</p>
        </div>
        <div className="flex items-center space-x-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-full font-bold">
          <Flame className="h-5 w-5" />
          <span>Active Streak!</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.progress < 100 && (
                  <Progress value={stat.progress} className="mt-3 h-2" />
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Performance Overview Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Your accuracy over recent tests.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="accuracy" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest practice sessions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {history.slice(-5).reverse().map((activity, i) => (
                <div key={i} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Practice Test</p>
                    <p className="text-xs text-muted-foreground">{new Date(activity.date).toLocaleDateString()}</p>
                  </div>
                  <div className="ml-auto font-medium text-sm px-3 py-1 bg-muted rounded-full">
                    {activity.score}/{activity.total} ({activity.accuracy}%)
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Strong Topics ( &gt;80% Accuracy )</CardTitle>
          </CardHeader>
          <CardContent>
            {strengths.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {strengths.map(s => (
                  <span key={s} className="bg-success/20 text-success px-3 py-1 rounded-full text-sm font-medium">{s}</span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Keep practicing to build your strengths!</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Topics to Revise ( &lt;60% Accuracy )</CardTitle>
          </CardHeader>
          <CardContent>
            {weaknesses.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {weaknesses.map(w => (
                  <span key={w} className="bg-destructive/20 text-destructive px-3 py-1 rounded-full text-sm font-medium">{w}</span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Great job! No major weaknesses identified yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
