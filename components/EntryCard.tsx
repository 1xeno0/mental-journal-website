"use client";

import { useState } from "react";
import { MOODS } from "@/lib/constants";
import { deleteEntry, Entry } from "@/lib/api";

export interface EntryCardProps {
  entry: Entry;
  onDelete: (id: string) => void;
  onEdit: (entry: Entry) => void;
}

export default function EntryCard({ entry, onDelete, onEdit }: EntryCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const moodConfig = MOODS.find((m) => m.value === entry.mood);
  
  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    
    setIsDeleting(true);
    try {
      await deleteEntry(entry.id);
      onDelete(entry.id);
    } catch (err) {
      alert("Failed to delete entry");
      setIsDeleting(false);
    }
  }

  // Determine border color from accent (e.g., bg-amber-400 -> border-amber-400)
  const accentColor = (moodConfig as any)?.accent || "bg-slate-300";
  const borderColor = accentColor.replace("bg-", "border-");
  const borderLeftColor = (moodConfig as any)?.borderLeft || "border-l-slate-300";
  
  // Determine text color for Vibe Check label based on mood accent
  const accentTextColor = accentColor.replace("bg-", "text-");

  // Extract text color from color string (e.g. "bg-amber-100 text-amber-800 ...")
  const moodTextColor = (moodConfig as any)?.color?.split(" ").find((c: string) => c.startsWith("text-")) || "text-slate-800";

  return (
    <div 
      className={`
        relative group overflow-hidden rounded-xl bg-white/60 backdrop-blur-md shadow-sm transition-all hover:shadow-lg border-l-[6px] border border-white/50
        ${borderLeftColor} ${isDeleting ? "opacity-50 pointer-events-none scale-95" : ""}
      `}
    >
      <div className="p-5">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl" role="img" aria-label={moodConfig?.label}>
              {(moodConfig as any)?.emoji || "✨"}
            </span>
            <span className={`font-bold capitalize text-base tracking-tight ${moodTextColor}`}>
              {moodConfig?.label || entry.mood}
            </span>
            <span className="text-slate-300 mx-1">•</span>
            <span className="text-xs text-slate-500">
              {new Date(entry.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
            </span>
          </div>

          {/* Edit/Delete Actions (Inline on mobile, absolute/hidden on desktop) */}
          <div className="flex gap-2 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity md:absolute md:top-3 md:right-3 -mt-1 -mr-1 md:mt-0 md:mr-0">
            <button 
              onClick={() => onEdit(entry)}
              className="p-2 bg-white/90 rounded-full text-slate-500 hover:text-indigo-600 hover:bg-white shadow-sm transition-all hover:scale-110 cursor-pointer active:scale-95"
              title="Edit"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button 
              onClick={handleDelete}
              className="p-2 bg-white/90 rounded-full text-slate-500 hover:text-rose-600 hover:bg-white shadow-sm transition-all hover:scale-110 cursor-pointer active:scale-95"
              title="Delete"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Note Content */}
        <p className="text-sm text-slate-700/90 mb-3 leading-relaxed">
          {entry.note}
        </p>

        {/* Tags */}
        {entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {entry.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Vibe Check Divider */}
        {(entry.ai_response || entry.disclaimer) && (
          <div className="border-t border-slate-200/50 pt-3 mt-2">
            {/* AI Response */}
            {entry.ai_response && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-500 mb-1">
                  Vibe Check
                </p>
                <p className="text-sm text-slate-600 italic leading-relaxed font-serif">
                  {entry.ai_response}
                </p>
              </div>
            )}

            {/* Disclaimer */}
            {entry.disclaimer && (
              <div className="mt-3 p-2 bg-amber-50 rounded text-xs text-amber-800 border border-amber-100">
                <span className="font-semibold mr-1">Notice:</span>
                {entry.disclaimer}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
