"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, FileText, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ImportQuestionsPage() {
  const [pdfUrl, setPdfUrl] = useState("");
  const [year, setYear] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ message: string; count: number } | null>(null);

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfUrl) {
      setError("Please enter a valid PDF URL.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/questions/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pdfUrl, year }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess({ message: data.message, count: data.count });
        setPdfUrl("");
        setYear("");
      } else {
        setError(data.message || "Failed to import questions. Check backend console.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while connecting to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Bulk Import</h1>
          <p className="text-muted-foreground mt-1">Import multiple questions automatically from a PDF paper using AI.</p>
        </div>
        <Link href="/admin">
          <Button variant="outline">Back to Admin</Button>
        </Link>
      </div>

      <Card className="shadow-lg border-2">
        <form onSubmit={handleImport}>
          <CardHeader className="bg-muted/30 border-b pb-6">
            <CardTitle className="flex items-center text-xl">
              <FileText className="mr-2 h-6 w-6 text-primary" />
              Provide PDF Details
            </CardTitle>
            <CardDescription className="text-base">
              Enter the public URL of a CBSE CTET question paper PDF and optionally specify the year. Our AI will automatically read it and extract all the questions!
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            
            {error && (
              <div className="bg-destructive/10 border-2 border-destructive/20 text-destructive p-4 rounded-xl flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold">Import Failed</h4>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-success/10 border-2 border-success/30 text-success-foreground p-4 rounded-xl flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 mt-0.5 text-success shrink-0" />
                <div>
                  <h4 className="font-semibold text-success">Import Successful!</h4>
                  <p className="text-sm mt-1 text-success/90 font-medium">
                    {success.message} You can now view these questions in the test environment.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">PDF Web Link (URL) *</label>
                <Input 
                  placeholder="e.g. https://example.com/paper.pdf" 
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  className="h-12 text-lg border-2 focus-visible:ring-primary/20"
                />
                <p className="text-sm text-muted-foreground">
                  The URL must end in .pdf and be publicly accessible.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Year / Paper Info (Optional)</label>
                <Input 
                  placeholder="e.g. 2021 Paper 1" 
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="h-12 text-lg border-2 focus-visible:ring-primary/20"
                />
                <p className="text-sm text-muted-foreground">
                  Specify the year so questions are tagged correctly.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/10 border-t p-6">
            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-semibold" 
              disabled={isLoading || !pdfUrl}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Extracting with AI... This may take a minute!
                </>
              ) : (
                "Start Bulk Import"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
