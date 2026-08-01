"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, CheckCircle2, Target, Trophy } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-24 pb-32">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">
              Master CTET with <span className="text-primary">Topic-wise PYQs</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground mb-10">
              Practice thousands of CTET questions organized exactly according to the syllabus. Get AI-powered explanations, mock tests, and analytics.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 rounded-full shadow-lg hover:shadow-primary/25 transition-all">
                Start Practicing <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 rounded-full">
                Explore Topics
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose CTET Master?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Everything you need to clear the Central Teacher Eligibility Test in one place.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Topic-wise PYQs",
                desc: "Practice previous year questions sorted exactly by syllabus topics.",
                icon: Target,
                color: "text-primary",
              },
              {
                title: "AI Explanations",
                desc: "Get detailed, AI-generated step-by-step explanations for every question.",
                icon: BrainCircuit,
                color: "text-accent",
              },
              {
                title: "Performance Analytics",
                desc: "Track your accuracy, speed, and weak areas with advanced charts.",
                icon: Trophy,
                color: "text-success",
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-card p-8 rounded-2xl shadow-sm border"
              >
                <div className={`h-12 w-12 rounded-lg bg-muted flex items-center justify-center mb-6 ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Comprehensive Coverage</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {["Child Development", "Mathematics", "Science", "Social Studies", "Language I", "Language II", "EVS", "Pedagogy"].map((subject, i) => (
              <div key={i} className="flex items-center space-x-2 p-4 rounded-xl border bg-card hover:border-primary transition-colors cursor-pointer">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="font-medium text-sm md:text-base">{subject}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
