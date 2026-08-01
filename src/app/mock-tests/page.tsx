"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, PlayCircle, Settings2, FileText, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function MockTests() {
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mock Tests</h1>
          <p className="text-muted-foreground mt-1">Simulate the real exam environment with our structured tests.</p>
        </div>
        <Button size="lg" className="rounded-full shadow-md">
          <Settings2 className="mr-2 h-5 w-5" /> Custom Mock Test
        </Button>
      </div>

      <Tabs defaultValue="full-length" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-full grid grid-cols-2 md:grid-cols-4 w-full md:w-auto h-auto">
          <TabsTrigger value="full-length" className="rounded-full data-[state=active]:bg-background py-2">Full Length</TabsTrigger>
          <TabsTrigger value="subject" className="rounded-full data-[state=active]:bg-background py-2">Subject Tests</TabsTrigger>
          <TabsTrigger value="previous-year" className="rounded-full data-[state=active]:bg-background py-2">Previous Year</TabsTrigger>
          <TabsTrigger value="topic" className="rounded-full data-[state=active]:bg-background py-2">Topic Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="full-length" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5].map((testNum) => (
              <Card key={testNum} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="border-primary text-primary">Paper I</Badge>
                    <Badge variant="secondary">New</Badge>
                  </div>
                  <CardTitle>CTET Mock Test {testNum}</CardTitle>
                  <CardDescription>Complete syllabus covering all 5 subjects.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span className="flex items-center"><FileText className="mr-1 h-4 w-4" /> 150 Questions</span>
                    <span className="flex items-center"><Clock className="mr-1 h-4 w-4" /> 150 Mins</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full group">
                    Start Test <PlayCircle className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="previous-year">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {["2024", "2023", "2022", "2021", "2019"].map((year) => (
              <Card key={year} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit mb-2">Past Paper</Badge>
                  <CardTitle>CTET {year} Official Paper</CardTitle>
                  <CardDescription>Practice the exact questions from {year}.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span className="flex items-center"><FileText className="mr-1 h-4 w-4" /> 150 Questions</span>
                    <span className="flex items-center"><Clock className="mr-1 h-4 w-4" /> 150 Mins</span>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="outline" className="flex-1">Paper I</Button>
                  <Button variant="outline" className="flex-1">Paper II</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Placeholder for Subject and Topic tabs to keep code short */}
        <TabsContent value="subject">
          <div className="flex flex-col items-center justify-center p-12 bg-muted/20 rounded-xl border border-dashed">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium">Select a Subject</h3>
            <p className="text-muted-foreground text-center mt-2 max-w-sm">Subject specific tests will appear here. Choose a subject to begin.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="topic">
          <div className="flex flex-col items-center justify-center p-12 bg-muted/20 rounded-xl border border-dashed">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium">Select a Topic</h3>
            <p className="text-muted-foreground text-center mt-2 max-w-sm">Topic specific micro-tests will appear here. Filter by subject and topic to begin.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
