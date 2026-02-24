"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { MOODS, TAGS } from "@/lib/constants";
import { updateEntry, Entry } from "@/lib/api";

interface EditEntryModalProps {
  entry: Entry;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedEntry: Entry) => void;
}

export default function EditEntryModal({ entry, isOpen, onClose, onSave }: EditEntryModalProps) {
  const [mood, setMood] = useState(entry.mood);
  const [selectedTags, setSelectedTags] = useState<string[]>(entry.tags);
  const [note, setNote] = useState(entry.note);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset form when entry changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setMood(entry.mood);
      setSelectedTags(entry.tags);
      setNote(entry.note);
      setError("");
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [entry, isOpen]);

  if (!isOpen || !mounted) return null;

  const isValid = mood && note.length >= 50;

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    setError("");

    try {
      const updated = await updateEntry(entry.id, {
        mood,
        tags: selectedTags,
        note,
      });
      onSave(updated);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update entry");
    } finally {
      setLoading(false);
    }
  }

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/10 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto no-scrollbar glass-card-solid p-4 md:p-8 relative animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pt-4 md:pt-0">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-800 dark:text-slate-100">Edit Entry</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 pb-8">
          
          {/* Mood Selector */}
          <div role="group" aria-labelledby="edit-mood-label">
            <label id="edit-mood-label" className="block text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 text-center">
              How were you feeling?
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
                      ? "bg-white/80 dark:bg-slate-800/80 shadow-lg scale-110 ring-2 ring-sky-400 ring-offset-2 ring-offset-transparent" 
                      : "bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:scale-105 hover:shadow-md"}
                  `}
                >
                  <span 
                    className="text-3xl md:text-4xl mb-2 filter drop-shadow-md transition-transform duration-300 group-hover:scale-110"
                    role="img" 
                    aria-label={m.label}
                  >
                    {(m as any).emoji}
                  </span>
                  <span className={`text-sm font-medium ${mood === m.value ? "text-slate-900 dark:text-slate-100" : "text-slate-700 dark:text-slate-400"}`}>
                    {m.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div role="group" aria-labelledby="edit-tags-label" className="bg-white/40 dark:bg-slate-800/40 rounded-xl p-4 md:p-6 backdrop-blur-sm">
            <label id="edit-tags-label" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              What affected your mood?
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
                      : "bg-white/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 border-white/50 dark:border-slate-600 hover:bg-white/80 dark:hover:bg-slate-700 hover:border-white dark:hover:border-slate-500"}
                  `}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="bg-white/40 dark:bg-slate-800/40 rounded-xl p-4 md:p-6 backdrop-blur-sm">
            <label htmlFor="edit-note-input" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Reflect on your day
            </label>
            <textarea
              id="edit-note-input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="I felt this way because... (at least 50 characters)"
              rows={6}
              className="w-full p-4 rounded-xl border border-white/50 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 focus:bg-white/90 dark:focus:bg-slate-800/90 focus:ring-2 focus:ring-sky-400 outline-none transition-all resize-none text-slate-800 dark:text-slate-200 placeholder:text-slate-500 dark:placeholder:text-slate-400"
            />
            <div className="flex justify-end mt-2">
              <span className={`text-xs ${note.length >= 50 ? "text-slate-500 dark:text-slate-400" : "text-amber-600 dark:text-amber-500 font-medium"}`}>
                {note.length} / 50 characters
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-100/90 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl text-sm border border-red-200 dark:border-red-800 backdrop-blur-sm animate-pulse">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid || loading}
              className="flex-1 glass-card-solid rounded-2xl py-3 text-lg font-display font-semibold text-slate-800 dark:text-slate-100 cursor-pointer hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-slate-600/30 border-t-slate-600 rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
