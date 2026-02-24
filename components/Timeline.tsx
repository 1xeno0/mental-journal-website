"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import EntryCard, { Entry } from "./EntryCard";
import EditEntryModal from "./EditEntryModal";

interface TimelineProps {
  key?: number; // Used to force refresh from parent
}

export default function Timeline({}: TimelineProps) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    try {
      const data = await apiFetch<Entry[]>("/entries");
      // Sort newest first
      const sorted = data.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setEntries(sorted);
    } catch (err) {
      setError("Failed to load timeline");
    } finally {
      setLoading(false);
    }
  }

  function handleDelete(id: string) {
    setEntries(prev => prev.filter(e => e.id !== id));
  }

  function handleEdit(entry: Entry) {
    setEditingEntry(entry);
  }

  function handleSave(updatedEntry: Entry) {
    setEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e));
    setEditingEntry(null);
  }

  function toggleSection(label: string) {
    setExpandedSections(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  }

  // Grouping logic
  const groups: Record<string, Entry[]> = {
    Today: [],
    Yesterday: [],
    "Last Week": [],
    Older: []
  };

  entries.forEach(entry => {
    const date = new Date(entry.created_at);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) groups["Today"].push(entry);
    else if (diffDays === 1) groups["Yesterday"].push(entry);
    else if (diffDays < 7) groups["Last Week"].push(entry);
    else groups["Older"].push(entry);
  });

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 dark:text-slate-500">
        <p>No entries yet. Start by checking in above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(groups).map(([label, groupEntries]) => {
        if (groupEntries.length === 0) return null;

        const isExpanded = expandedSections[label];
        const displayedEntries = isExpanded ? groupEntries : groupEntries.slice(0, 3);
        const hasMore = groupEntries.length > 3;

        return (
          <div key={label}>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 pl-1">
              {label}
            </h3>
            <div className="space-y-4">
              {displayedEntries.map(entry => (
                <EntryCard 
                  key={entry.id} 
                  entry={entry} 
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
            </div>
            
            {hasMore && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => toggleSection(label)}
                  className="px-4 py-2 text-sm font-medium text-slate-500 bg-white/50 hover:bg-white hover:text-slate-700 rounded-full border border-slate-200/50 backdrop-blur-sm transition-all shadow-sm hover:shadow cursor-pointer flex items-center gap-2"
                >
                  {isExpanded ? (
                    <>
                      <span>Show Less</span>
                      <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  ) : (
                    <>
                      <span>Show {groupEntries.length - 3} More</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        );
      })}

      {editingEntry && (
        <EditEntryModal
          entry={editingEntry}
          isOpen={!!editingEntry}
          onClose={() => setEditingEntry(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
