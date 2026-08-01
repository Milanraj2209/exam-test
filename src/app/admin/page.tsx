"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, BookOpen, Database, Activity, PlusCircle, Settings, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState([
    { title: "Total Users", value: "1", icon: Users, color: "text-blue-500", trend: "Live" },
    { title: "Total Questions", value: "...", icon: Database, color: "text-green-500", trend: "Live" },
    { title: "Active Mock Tests", value: "...", icon: Activity, color: "text-orange-500", trend: "Live" },
    { title: "Subjects Covered", value: "...", icon: BookOpen, color: "text-purple-500", trend: "Live" },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/questions?limit=10000');
        const data = await res.json();
        if (data.success && data.data) {
          const questions = data.data;
          
          const uniqueSubjects = new Set<string>();
          const uniqueYears = new Set<string>();
          
          questions.forEach((q: any) => {
            if (q.subject) uniqueSubjects.add(q.subject);
            if (q.year_and_paper) uniqueYears.add(q.year_and_paper);
          });
          
          setStats([
            { title: "Total Users", value: "1", icon: Users, color: "text-blue-500", trend: "Live" },
            { title: "Total Questions", value: questions.length.toString(), icon: Database, color: "text-green-500", trend: "Live" },
            { title: "Active Past Papers", value: uniqueYears.size.toString(), icon: Activity, color: "text-orange-500", trend: "Live" },
            { title: "Subjects Covered", value: uniqueSubjects.size.toString(), icon: BookOpen, color: "text-purple-500", trend: "Live" },
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch admin stats", err);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 min-h-screen bg-muted/20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage platform content and monitor user activity.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Button>
          <Link href="/admin/questions/new" tabIndex={-1}>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Question
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-success font-medium">{stat.trend}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used administrative tools.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div onClick={() => router.push('/admin/import')} tabIndex={-1} className="p-4 border rounded-xl flex items-start space-x-4 hover:border-primary transition-colors cursor-pointer group">
              <div className="bg-primary/10 p-3 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <UploadCloud className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold">Bulk Import (AI)</h4>
                <p className="text-sm text-muted-foreground">Import questions directly from a CBSE PDF.</p>
              </div>
            </div>
            
            <div onClick={() => router.push('/admin/results')} tabIndex={-1} className="p-4 border rounded-xl flex items-start space-x-4 hover:border-primary transition-colors cursor-pointer group">
              <div className="bg-primary/10 p-3 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold">User Results</h4>
                <p className="text-sm text-muted-foreground">View test scores and activity of all users.</p>
              </div>
            </div>

            <div className="p-4 border rounded-xl flex items-start space-x-4 hover:border-primary transition-colors cursor-pointer group">
              <div className="bg-primary/10 p-3 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Database className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold">Manage Bank</h4>
                <p className="text-sm text-muted-foreground">Edit or delete questions.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Database Capacity</span>
                <span className="font-medium text-muted-foreground">24% used</span>
              </div>
              <Progress value={24} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>API Limit (Firebase)</span>
                <span className="font-medium text-muted-foreground">8% used</span>
              </div>
              <Progress value={8} className="h-2" />
            </div>
            <div className="pt-4 border-t mt-4 flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Last Backup:</span>
              <span className="font-medium">2 hours ago</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
