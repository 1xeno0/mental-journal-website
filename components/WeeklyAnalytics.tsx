"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import { getEntries, Entry } from "@/lib/api";
import { MOODS } from "@/lib/constants";

// Entry interface is imported from @/lib/api

interface MoodCount {
  mood: string;
  count: number;
  label?: string;
  color?: string;
}

interface DailyStat {
  date: string; // e.g., "Mon"
  fullDate: string; // e.g. "2023-10-27" for sorting/keys
  [key: string]: string | number; // dynamic mood counts
}

export default function WeeklyAnalytics() {
  const [moodData, setMoodData] = useState<MoodCount[]>([]);
  const [dailyData, setDailyData] = useState<DailyStat[]>([]);
  const [viewMode, setViewMode] = useState<"distribution" | "daily">("distribution");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    async function fetchEntriesAndCalculate() {
      try {
        // Fetch raw entries instead of using the weekly endpoint
        const entries = await getEntries();
        
        if (!Array.isArray(entries)) {
          setMoodData([]);
          setDailyData([]);
          return;
        }

        // Filter for entries from the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setHours(0, 0, 0, 0);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Include today + 6 previous days
        
        const recentEntries = entries.filter(entry => 
          new Date(entry.created_at) >= sevenDaysAgo
        );

        // --- 1. Calculate Mood Distribution ---
        const moodCounts: Record<string, number> = {};
        
        recentEntries.forEach(entry => {
          const mood = entry.mood;
          moodCounts[mood] = (moodCounts[mood] || 0) + 1;
        });

        // Convert to array format expected by Recharts
        const chartData = Object.entries(moodCounts).map(([mood, count]) => {
          const config = MOODS.find(m => m.value === mood);
          return {
            mood,
            count,
            label: config?.label || mood,
            color: getMoodColor(mood)
          };
        });
        
        // Sort by count (descending)
        chartData.sort((a, b) => b.count - a.count);
        setMoodData(chartData);

        // Helper to get local YYYY-MM-DD
        const getLocalYYYYMMDD = (d: Date) => {
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        // --- 2. Calculate Daily Stats ---
        const dailyStatsMap: Record<string, DailyStat> = {};
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        // Initialize last 7 days
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateKey = getLocalYYYYMMDD(d);
          
          dailyStatsMap[dateKey] = {
            date: days[d.getDay()],
            fullDate: dateKey,
          };
          // Initialize all moods to 0
          MOODS.forEach(m => {
            dailyStatsMap[dateKey][m.value] = 0;
          });
        }

        // Fill in counts
        recentEntries.forEach(entry => {
          const entryDate = new Date(entry.created_at);
          const dateKey = getLocalYYYYMMDD(entryDate);
          
          if (dailyStatsMap[dateKey]) {
            const mood = entry.mood;
            dailyStatsMap[dateKey][mood] = (dailyStatsMap[dateKey][mood] as number) + 1;
          }
        });

        // Convert map to sorted array (oldest to newest)
        const dailyChartData = Object.values(dailyStatsMap).sort((a, b) => 
          a.fullDate.localeCompare(b.fullDate)
        );
        setDailyData(dailyChartData);

      } catch (err) {
        setError("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    }
    fetchEntriesAndCalculate();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check initially
    checkMobile();
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  function getMoodColor(mood: string): string {
    // Map to colors matching lib/constants.ts
    switch (mood) {
      case "happy": return "#fbbf24"; // amber-400
      case "calm": return "#2dd4bf"; // teal-400
      case "neutral": return "#94a3b8"; // slate-400
      case "anxious": return "#fb923c"; // orange-400
      case "sad": return "#818cf8"; // indigo-400
      case "stressed": return "#f43f5e"; // rose-500
      default: return "#cbd5e1";
    }
  }

  if (loading) {
    return (
      <div className="h-64 w-full bg-slate-50 dark:bg-slate-900 rounded-xl animate-pulse border border-slate-200 dark:border-slate-800"></div>
    );
  }

  if (error) {
    return (
      <div className="h-64 w-full flex items-center justify-center text-red-500 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
        {error}
      </div>
    );
  }

  // Calculate total entries for the empty state check
  const totalEntries = moodData.reduce((acc, item) => acc + item.count, 0);

  if (totalEntries === 0) {
    return (
      <div className="h-64 w-full flex items-center justify-center text-slate-400 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        No mood data recorded this week.
      </div>
    );
  }

  return (
    <div className="h-80 md:h-96 w-full bg-white dark:bg-slate-900 p-4 md:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h3 className="text-xs md:text-sm font-semibold text-slate-400 uppercase tracking-wider">
          {viewMode === "distribution" ? "Mood Distribution" : "Daily Mood Trend"}
        </h3>
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode("distribution")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              viewMode === "distribution" 
                ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setViewMode("daily")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              viewMode === "daily" 
                ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Daily
          </button>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === "distribution" ? (
            <BarChart data={moodData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="label" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip 
                trigger={isMobile ? "click" : "hover"}
                cursor={{ fill: 'transparent' }}
                contentStyle={{ 
                  borderRadius: '8px', 
                  border: 'none', 
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)'
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={50}>
                {moodData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip 
                trigger={isMobile ? "click" : "hover"}
                cursor={{ fill: 'transparent' }}
                contentStyle={{ 
                  borderRadius: '8px', 
                  border: 'none', 
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)'
                }}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              {MOODS.map((mood) => (
                <Bar 
                  key={mood.value} 
                  dataKey={mood.value} 
                  stackId="a" 
                  fill={getMoodColor(mood.value)} 
                  radius={[0, 0, 0, 0]}
                  maxBarSize={50}
                  name={mood.label}
                />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
