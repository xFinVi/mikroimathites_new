"use client";

import { useState } from "react";
import { VideoIdeaForm } from "./video-idea-form";
import { FeedbackFormTab } from "./feedback-form-tab";
import { QAForm } from "./qa-form";
import { cn } from "@/lib/utils";

type TabType = "video-idea" | "feedback" | "qa";

export function FormTabs() {
  const [activeTab, setActiveTab] = useState<TabType>("video-idea");

  const tabs = [
    { id: "video-idea" as TabType, label: "💡 Ιδέα για βίντεο", icon: "💡" },
    { id: "feedback" as TabType, label: "💬 Feedback", icon: "💬" },
    { id: "qa" as TabType, label: "❓ Ερώτηση (Q&A)", icon: "❓" },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-border/50 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-6 py-3 rounded-t-lg font-semibold text-base transition-all",
              "hover:bg-background-light",
              activeTab === tab.id
                ? "bg-primary-pink text-white shadow-md"
                : "text-text-medium bg-background-light hover:text-text-dark"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-background-white rounded-card p-6 sm:p-8 shadow-subtle border border-border/50">
        {activeTab === "video-idea" && <VideoIdeaForm />}
        {activeTab === "feedback" && <FeedbackFormTab />}
        {activeTab === "qa" && <QAForm />}
      </div>
    </div>
  );
}

