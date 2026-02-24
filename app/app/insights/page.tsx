"use client";

import Timeline from "@/components/Timeline";
import WeeklyAnalytics from "@/components/WeeklyAnalytics";

export default function AnalyticsPage() {
  return (
    <div className="space-y-12">
      <section className="glass-card-solid p-6 md:p-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Weekly Insights</h2>
        <WeeklyAnalytics />
      </section>

      <section className="glass-card-solid p-6 md:p-8 animate-float-delayed">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Your Timeline</h2>
        <Timeline />
      </section>
    </div>
  );
}
