"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, ChevronLeft, ChevronRight, Flag, CheckCircle2, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useRouter, useParams } from "next/navigation";

// Removed hardcoded mock questions

export default function DailyTestEnvironment() {
  const router = useRouter();
  const params = useParams();
  const subjectId = decodeURIComponent(params.subject as string);

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(3000); // default 50 mins
  const [initialTime, setInitialTime] = useState(3000); // track total time for result page

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Anti-Cheating State
  const [warnings, setWarnings] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);

  // Use a ref to hold latest state for the auto-submit to avoid dependency loops in event listeners
  const latestState = useRef({ questions, selectedOptions, timeLeft });
  useEffect(() => {
    latestState.current = { questions, selectedOptions, timeLeft };
  }, [questions, selectedOptions, timeLeft]);

  // Anti-Cheating Listeners
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setWarnings(prev => {
          const newWarnings = prev + 1;
          if (newWarnings >= 3) {
            // Force submit on 3rd strike
            const state = latestState.current;
            const sessionData = {
              questions: state.questions,
              selectedOptions: state.selectedOptions,
              timeSpent: initialTime - state.timeLeft,
              terminated: true
            };
            sessionStorage.setItem("testSessionData", JSON.stringify(sessionData));
            router.push("/results");
          } else {
            setShowWarningModal(true);
          }
          return newWarnings;
        });
      }
    };

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleCopyPaste = (e: ClipboardEvent) => e.preventDefault();

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopyPaste);
    document.addEventListener("paste", handleCopyPaste);
    document.addEventListener("cut", handleCopyPaste);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopyPaste);
      document.removeEventListener("paste", handleCopyPaste);
      document.removeEventListener("cut", handleCopyPaste);
    };
  }, [router]);

  useEffect(() => {
    // Fetch real questions from the backend
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`/api/questions?mode=daily&subject=${encodeURIComponent(subjectId)}`);
        const data = await res.json();
        if (data.success && data.data) {
          setQuestions(data.data);
          const totalTime = data.data.length * 60; // 1 min per question
          setTimeLeft(totalTime);
          setInitialTime(totalTime);
        }
      } catch (err) {
        console.error("Failed to fetch questions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [subjectId]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-2xl text-primary font-bold">Loading Test Environment...</div>;
  }

  if (questions.length === 0) {
    return <div className="flex items-center justify-center min-h-screen text-xl">No questions found in the database. Add some from the Admin Panel!</div>;
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const currentQ = questions[currentQIndex];

  const handleSelectOption = (optionKey: string) => {
    setSelectedOptions(prev => ({ ...prev, [currentQ.id]: optionKey }));
  };

  const toggleBookmark = () => {
    setBookmarked(prev => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }));
  };

  const handleSubmitTest = () => {
    const sessionData = {
      questions,
      selectedOptions,
      timeSpent: initialTime - timeLeft,
    };
    sessionStorage.setItem("testSessionData", JSON.stringify(sessionData));
    router.push("/results");
  };

  return (
    <div className="container mx-auto p-4 md:p-8 flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Test Header */}
      <div className="flex justify-between items-center mb-6 bg-card p-4 rounded-xl shadow-sm border border-primary/20 bg-primary/5">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <span className="text-3xl mr-2">🔥</span> {subjectId} Daily Challenge
          </h1>
          <p className="text-sm font-medium mt-1 text-primary">{questions.length} Questions</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-lg font-mono bg-muted px-4 py-2 rounded-lg text-primary font-semibold">
            <Clock className="mr-2 h-5 w-5" />
            {formatTime(timeLeft)}
          </div>
          <Button variant="destructive" onClick={handleSubmitTest}>Submit Test</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6 flex-1">
        {/* Main Question Area */}
        <div className="md:col-span-3 flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="flex flex-row items-start justify-between bg-muted/30 pb-4 border-b">
              <CardTitle className="text-lg flex items-center">
                <span className="bg-primary text-primary-foreground h-8 w-8 rounded-full flex items-center justify-center mr-3 text-sm">
                  {currentQIndex + 1}
                </span>
                Question {currentQIndex + 1} of {questions.length}
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleBookmark}
                className={bookmarked[currentQ.id] ? "text-accent" : "text-muted-foreground"}
              >
                <Flag className="mr-2 h-4 w-4" /> 
                {bookmarked[currentQ.id] ? "Bookmarked" : "Mark for Review"}
              </Button>
            </CardHeader>
            <CardContent className="pt-6 flex-1 text-lg">
              <p className="font-medium mb-8 leading-relaxed">
                {currentQ.questionText || currentQ.question}
              </p>
              
              <div className="space-y-3">
                {Object.entries(currentQ.options).map(([key, value]) => {
                  const isSelected = selectedOptions[currentQ.id] === key;
                  const hasAnswered = !!selectedOptions[currentQ.id];
                  const correctAns = currentQ.correctAnswer || currentQ.correct_answer || currentQ.answer;
                  const isCorrect = key === correctAns;
                  
                  // Determine colors based on whether user has answered
                  let borderClass = "border-muted hover:border-primary/30 hover:bg-muted/30";
                  let bgClass = "";
                  let dotClass = "border-muted-foreground text-muted-foreground";

                  if (hasAnswered) {
                    if (isCorrect) {
                      borderClass = "border-success bg-success/10 shadow-sm";
                      bgClass = "bg-success/5";
                      dotClass = "bg-success border-success text-success-foreground";
                    } else if (isSelected) {
                      borderClass = "border-destructive bg-destructive/10 shadow-sm";
                      bgClass = "bg-destructive/5";
                      dotClass = "bg-destructive border-destructive text-destructive-foreground";
                    } else {
                      borderClass = "border-muted opacity-50";
                      bgClass = "";
                      dotClass = "border-muted-foreground text-muted-foreground";
                    }
                  } else if (isSelected) {
                    // This block might not be reached if we reveal immediately, but kept for logic safety
                    borderClass = "border-primary bg-primary/5 shadow-sm";
                    bgClass = "";
                    dotClass = "bg-primary border-primary text-primary-foreground";
                  }

                  return (
                    <div 
                      key={key} 
                      onClick={() => !hasAnswered && handleSelectOption(key)}
                      className={`
                        p-4 rounded-xl border-2 transition-all flex items-center
                        ${!hasAnswered ? "cursor-pointer" : "cursor-default"}
                        ${borderClass} ${bgClass}
                      `}
                    >
                      <div className={`
                        h-6 w-6 rounded-full border flex items-center justify-center mr-4 text-sm font-medium
                        ${dotClass}
                      `}>
                        {key}
                      </div>
                      <span className={hasAnswered && !isCorrect && !isSelected ? "opacity-50" : ""}>{String(value)}</span>
                    </div>
                  );
                })}
              </div>
              
              {selectedOptions[currentQ.id] && (
                <div className="mt-6 p-5 bg-muted/40 border border-primary/20 rounded-xl">
                  <div className="flex items-center text-primary font-semibold mb-2">
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Correct Answer: {currentQ.correctAnswer || currentQ.correct_answer || currentQ.answer}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground">Explanation:</span> {currentQ.explanation}
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t bg-muted/10 p-4">
              <Button 
                variant="outline" 
                onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQIndex === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button 
                onClick={() => setCurrentQIndex(prev => Math.min(questions.length - 1, prev + 1))}
                disabled={currentQIndex === questions.length - 1}
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Question Palette Sidebar */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Question Palette</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {questions.map((q, index) => {
                const isAnswered = !!selectedOptions[q.id];
                const isMarked = bookmarked[q.id];
                const isCurrent = currentQIndex === index;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQIndex(index)}
                    className={`
                      h-10 w-10 rounded-lg flex items-center justify-center text-sm font-medium border-2 transition-all
                      ${isCurrent ? "ring-2 ring-primary ring-offset-2" : ""}
                      ${isAnswered ? "bg-success border-success text-success-foreground" : 
                        isMarked ? "bg-accent border-accent text-accent-foreground" : 
                        "bg-background border-muted hover:border-primary/50"}
                    `}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-8 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center"><div className="h-3 w-3 rounded-full bg-success mr-2"></div> Answered</div>
              <div className="flex items-center"><div className="h-3 w-3 rounded-full bg-accent mr-2"></div> Marked for Review</div>
              <div className="flex items-center"><div className="h-3 w-3 rounded-full border-2 border-muted mr-2"></div> Not Answered</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Anti-Cheating Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-destructive text-destructive-foreground p-8 rounded-2xl max-w-lg text-center shadow-2xl border-4 border-red-500/50">
            <AlertCircle className="h-20 w-20 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">Warning: Tab Switched!</h2>
            <p className="text-lg mb-6 opacity-90">
              You navigated away from the test environment. This is a strict violation of the test rules.
              <br /><br />
              <strong>Strike {warnings} of 3.</strong>
              <br />
              If you reach 3 strikes, your test will be automatically submitted and terminated.
            </p>
            <Button 
              variant="outline" 
              className="text-foreground text-lg h-12 px-8 font-bold hover:bg-white hover:text-black transition-colors"
              onClick={() => setShowWarningModal(false)}
            >
              I Understand, Return to Test
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
