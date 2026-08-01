"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AddQuestionPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <Link href="/admin" tabIndex={-1}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add New Question</h1>
          <p className="text-sm text-muted-foreground">Add a new question to the master database.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Question Details</CardTitle>
          <CardDescription>Fill out the metadata and content of the question.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input placeholder="e.g. Child Development" />
            </div>
            <div className="space-y-2">
              <Label>Topic</Label>
              <Input placeholder="e.g. Piaget Theory" />
            </div>
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Year (Optional for PYQ)</Label>
              <Input placeholder="e.g. 2023" />
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <Label>Question Text</Label>
            <textarea 
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
              placeholder="Enter the main question text here..." 
            />
          </div>

          <Tabs defaultValue="options" className="w-full pt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="options">Options & Answer</TabsTrigger>
              <TabsTrigger value="explanation">Explanation & AI</TabsTrigger>
            </TabsList>
            <TabsContent value="options" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Option A</Label>
                <Input placeholder="First option" />
              </div>
              <div className="space-y-2">
                <Label>Option B</Label>
                <Input placeholder="Second option" />
              </div>
              <div className="space-y-2">
                <Label>Option C</Label>
                <Input placeholder="Third option" />
              </div>
              <div className="space-y-2">
                <Label>Option D</Label>
                <Input placeholder="Fourth option" />
              </div>
              <div className="space-y-2 pt-2">
                <Label>Correct Answer</Label>
                <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  <option>A</option>
                  <option>B</option>
                  <option>C</option>
                  <option>D</option>
                </select>
              </div>
            </TabsContent>
            <TabsContent value="explanation" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Detailed Explanation</Label>
                <textarea 
                  className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                  placeholder="Explain why the correct answer is correct, and why other options are incorrect." 
                />
              </div>
              <Button variant="secondary" className="w-full border-dashed border-2 bg-muted/50">
                Generate AI Explanation
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6">
          <Button variant="ghost">Cancel</Button>
          <Button>
            <Save className="mr-2 h-4 w-4" /> Save Question
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
