"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, FileText, AlertCircle, CheckCircle2, BookOpen, ArrowRight } from "lucide-react";

interface DashboardStats {
  totalSubmissions: number;
  newSubmissions: number;
  answeredSubmissions: number;
  publishedQA: number;
}

export function DashboardStats() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/admin/stats");
        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load stats");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-background-white rounded-lg p-6 shadow-sm border-2 border-gray-200 animate-pulse"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-gray-200 w-12 h-12"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/40 rounded-card p-4 text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      label: "Σύνολο Υποβολών",
      value: stats.totalSubmissions,
      icon: FileText,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-200",
      onClick: () => router.push("/admin/submissions"),
    },
    {
      label: "Νέα Αιτήματα",
      value: stats.newSubmissions,
      icon: AlertCircle,
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
      borderColor: "border-yellow-200",
      onClick: () => router.push("/admin/submissions?status=not_answered"),
      highlight: stats.newSubmissions > 0,
    },
    {
      label: "Απαντημένες",
      value: stats.answeredSubmissions,
      icon: CheckCircle2,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      borderColor: "border-green-200",
      onClick: () => router.push("/admin/submissions?status=answered"),
    },
    {
      label: "Δημοσιευμένες Q&A",
      value: stats.publishedQA,
      icon: BookOpen,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      borderColor: "border-purple-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            onClick={card.onClick}
            className={`bg-background-white rounded-lg p-6 shadow-sm border-2 transition-all cursor-pointer hover:shadow-md hover:scale-[1.02] ${
              card.borderColor
            } ${card.highlight ? "ring-2 ring-yellow-400 ring-offset-2" : ""}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-6 w-6 ${card.textColor}`} />
              </div>
              {card.onClick && (
                <ArrowRight className="h-4 w-4 text-text-medium opacity-50" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-text-medium mb-1">{card.label}</p>
              <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
            </div>
            {card.highlight && (
              <div className="mt-3 pt-3 border-t border-yellow-200">
                <p className="text-xs font-medium text-yellow-700">
                  ⚠️ Απαιτεί προσοχή
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

