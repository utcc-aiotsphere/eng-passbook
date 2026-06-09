"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function DashboardCharts({ stationData, trendData }: { stationData: { name: string; visits: number; dwell: number }[]; trendData: { time: string; checkins: number }[] }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="h-72 rounded-lg border border-cyan-300/20 bg-slate-950/55 p-4">
        <h3 className="mb-3 font-bold">Station visit count</h3>
        <ResponsiveContainer width="100%" height="85%"><BarChart data={stationData}><CartesianGrid strokeDasharray="3 3" stroke="#164e63" /><XAxis dataKey="name" stroke="#bae6fd" /><YAxis stroke="#bae6fd" /><Tooltip /><Bar dataKey="visits" fill="#38D6FF" /></BarChart></ResponsiveContainer>
      </div>
      <div className="h-72 rounded-lg border border-cyan-300/20 bg-slate-950/55 p-4">
        <h3 className="mb-3 font-bold">Check-ins over time</h3>
        <ResponsiveContainer width="100%" height="85%"><LineChart data={trendData}><CartesianGrid strokeDasharray="3 3" stroke="#164e63" /><XAxis dataKey="time" stroke="#bae6fd" /><YAxis stroke="#bae6fd" /><Tooltip /><Line dataKey="checkins" stroke="#FF3DCE" strokeWidth={3} /></LineChart></ResponsiveContainer>
      </div>
    </div>
  );
}

