"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend
} from "recharts";

interface ChartCardProps {
  title: string;
  description?: string;
  data: unknown[];
  type: "line" | "bar" | "area" | "pie";
  dataKey: string;
  nameKey: string;
  colors?: string[];
  height?: number;
  className?: string;
}

const DEFAULT_COLORS = ["#D4AF37", "#1c1c1c", "#71717A", "#e8e5e0"];

export function ChartCard({
  title,
  description,
  data,
  type,
  dataKey,
  nameKey,
  colors = DEFAULT_COLORS,
  height = 300,
  className
}: ChartCardProps) {
  
  const renderChart = () => {
    switch (type) {
      case "bar":
        return (
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--dashboard-border)" />
            <XAxis dataKey={nameKey} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--dashboard-text-muted)" }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--dashboard-text-muted)" }} dx={-10} />
            <RechartsTooltip 
              cursor={{ fill: 'var(--dashboard-bg)' }}
              contentStyle={{ borderRadius: '8px', border: '1px solid var(--dashboard-border)', backgroundColor: 'var(--dashboard-card)' }}
            />
            <Bar dataKey={dataKey} fill={colors[0]} radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case "line":
        return (
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--dashboard-border)" />
            <XAxis dataKey={nameKey} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--dashboard-text-muted)" }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--dashboard-text-muted)" }} dx={-10} />
            <RechartsTooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid var(--dashboard-border)', backgroundColor: 'var(--dashboard-card)' }}
            />
            <Line type="monotone" dataKey={dataKey} stroke={colors[0]} strokeWidth={2} dot={{ r: 4, fill: colors[0] }} activeDot={{ r: 6 }} />
          </LineChart>
        );
      case "area":
        return (
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
            <defs>
              <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[0]} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={colors[0]} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--dashboard-border)" />
            <XAxis dataKey={nameKey} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--dashboard-text-muted)" }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--dashboard-text-muted)" }} dx={-10} />
            <RechartsTooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid var(--dashboard-border)', backgroundColor: 'var(--dashboard-card)' }}
            />
            <Area type="monotone" dataKey={dataKey} stroke={colors[0]} fillOpacity={1} fill={`url(#color-${dataKey})`} />
          </AreaChart>
        );
      case "pie":
        return (
          <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <RechartsTooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid var(--dashboard-border)', backgroundColor: 'var(--dashboard-card)' }}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey={dataKey}
              nameKey={nameKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        );
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-dashboard-text">{title}</CardTitle>
        {description && <CardDescription className="text-dashboard-text-muted">{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: height }}>
          <ResponsiveContainer>
             {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
