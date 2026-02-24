"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MoodEntryForm from "@/components/MoodEntryForm";
import MainButton from "@/components/MainButton";

export default function VibeCheckPage() {
  const router = useRouter();
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  function handleEntryCreated(data: any) {
    if (data && data.ai_response) {
      setAiResponse(data.ai_response);
    }
    // If no AI response, do nothing (user stays on form with success message)
  }

  if (aiResponse) {
    return (
      <section className="glass-card-solid p-8 md:p-12 animate-float max-w-2xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-800">Here's a thought for you...</h2>
          <div className="p-6 bg-white/60 rounded-xl backdrop-blur-sm shadow-inner">
            <p className="text-lg text-slate-700 italic leading-relaxed">
              "{aiResponse}"
            </p>
          </div>
        </div>
        
        <MainButton href="/app/insights">
          View Insights
        </MainButton>
      </section>
    );
  }

  return (
    <section className="glass-card-solid p-6 md:p-8 animate-float-delayed">
      <h2 className="sr-only">New Entry</h2>
      <MoodEntryForm onEntryCreated={handleEntryCreated} />
    </section>
  );
}
