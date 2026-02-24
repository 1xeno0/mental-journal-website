"use client";

import { useState } from "react";
import { MOODS, TAGS } from "@/lib/constants";
import { apiFetch } from "@/lib/api";

interface MoodEntryFormProps {
  onEntryCreated?: (data: any) => void;
}

export default function MoodEntryForm({ onEntryCreated }: MoodEntryFormProps) {
  const [mood, setMood] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isValid = mood && note.length >= 50;

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // First save the entry
      const entryData = await apiFetch<any>("/entries", {
        method: "POST",
        body: JSON.stringify({
          mood,
          tags: selectedTags,
          note,
        }),
      });

      // Then get the vibe check
      let aiResponse = null;
      try {
        const vibeData: any = await apiFetch("/ai/vibe-check", {
          method: "POST",
          body: JSON.stringify({ note }),
        });
        aiResponse = vibeData.ai_response;
      } catch (vibeError) {
        console.error("Vibe check failed:", vibeError);
        // We continue even if vibe check fails, just without the message
      }

      // Reset form
      setMood("");
      setSelectedTags([]);
      setNote("");
      setSuccess(true);
      
      if (onEntryCreated) {
        // Pass combined data back
        onEntryCreated({ ...entryData, ai_response: aiResponse });
      }
      
      // Hide success message after 3s
      setTimeout(() => setSuccess(false), 3000);

    } catch (err: any) {
      setError(err.message || "Failed to save entry");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {/* Mood Selector */}
      <div role="group" aria-labelledby="mood-label">
        <label id="mood-label" className="block text-lg font-semibold text-slate-800 mb-4 text-center">
          How are you feeling right now?
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {MOODS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMood(m.value)}
              aria-pressed={mood === m.value}
              className={`
                group flex flex-col items-center justify-center p-3 md:p-4 rounded-2xl transition-all duration-300 cursor-pointer
                ${mood === m.value 
                  ? "bg-white/80 shadow-lg scale-110 ring-2 ring-sky-400 ring-offset-2 ring-offset-transparent" 
                  : "bg-white/40 hover:bg-white/60 hover:scale-105 hover:shadow-md"}
              `}
            >
              <span 
                className="text-3xl md:text-4xl mb-2 filter drop-shadow-md transition-transform duration-300 group-hover:scale-110"
                role="img" 
                aria-label={m.label}
              >
                {/* @ts-ignore - emoji property exists but TS might not infer it immediately if not restarted */}
                {(m as any).emoji}
              </span>
              <span className={`text-sm font-medium ${mood === m.value ? "text-slate-900" : "text-slate-700"}`}>
                {m.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div role="group" aria-labelledby="tags-label" className="bg-white/40 rounded-xl p-4 md:p-6 backdrop-blur-sm">
        <label id="tags-label" className="block text-sm font-semibold text-slate-700 mb-3">
          What's affecting your mood?
        </label>
        <div className="flex flex-wrap gap-2">
          {TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              aria-pressed={selectedTags.includes(tag)}
              className={`
                px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200 border cursor-pointer
                ${selectedTags.includes(tag)
                  ? "bg-sky-600 text-white border-sky-600 shadow-md transform scale-105"
                  : "bg-white/60 text-slate-700 border-white/50 hover:bg-white/80 hover:border-white"}
              `}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Note */}
      <div className="bg-white/40 rounded-xl p-4 md:p-6 backdrop-blur-sm">
        <label htmlFor="note-input" className="block text-sm font-semibold text-slate-700 mb-2">
          Reflect on your day
        </label>
        <textarea
          id="note-input"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="I'm feeling this way because... (at least 50 characters)"
          rows={4}
          className="w-full p-4 rounded-xl border border-white/50 bg-white/60 focus:bg-white/90 focus:ring-2 focus:ring-sky-400 outline-none transition-all resize-none text-slate-800 placeholder:text-slate-500"
        />
        <div className="flex justify-end mt-2">
          <span className={`text-xs ${note.length >= 50 ? "text-slate-500" : "text-amber-700 font-medium"}`}>
            {note.length} / 50 characters
          </span>
        </div>
      </div>

      {/* Feedback Messages */}
      {error && (
        <div className="p-4 bg-red-100/90 text-red-700 rounded-xl text-sm border border-red-200 backdrop-blur-sm animate-pulse">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-100/90 text-green-700 rounded-xl text-sm border border-green-200 backdrop-blur-sm">
          Entry saved successfully! Getting your vibe check...
        </div>
      )}

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={!isValid || loading}
          className="w-full glass-card-solid rounded-2xl py-4 text-lg font-display font-semibold text-foreground cursor-pointer hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 ease-out flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          {loading ? (
            <>
              <span className="w-5 h-5 border-2 border-slate-600/30 border-t-slate-600 rounded-full animate-spin" />
              <span>Saving & Checking Vibe...</span>
            </>
          ) : (
            <>
              <span>Get Vibe Check ✨</span>
            </>
          )}
        </button>
      </div>

    </form>
  );
}
