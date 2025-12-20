"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Submission {
  id: string;
  type: string;
  name: string | null;
  email: string | null;
  message: string;
  rating: number | null;
  child_age_group: string | null;
  topic: string | null;
  status: string;
  is_approved: boolean;
  created_at: string;
}

export function SubmissionsAdmin() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    // TODO: Fetch submissions from API with auth
    // For now, show placeholder
    setLoading(false);
  }, [filterType, filterStatus]);

  if (loading) {
    return (
      <div className="bg-background-white rounded-card p-8 text-center">
        <p className="text-text-medium">Φόρτωση...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/40 rounded-card p-6">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-background-white rounded-card p-6 shadow-subtle border border-border/50">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-dark">Τύπος</label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Όλα</SelectItem>
                <SelectItem value="video_idea">Ιδέες για βίντεο</SelectItem>
                <SelectItem value="feedback">Feedback</SelectItem>
                <SelectItem value="question">Ερωτήσεις</SelectItem>
                <SelectItem value="review">Αξιολογήσεις</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-dark">Κατάσταση</label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Όλα</SelectItem>
                <SelectItem value="new">Νέα</SelectItem>
                <SelectItem value="read">Διαβασμένα</SelectItem>
                <SelectItem value="approved">Εγκεκριμένα</SelectItem>
                <SelectItem value="published">Δημοσιευμένα</SelectItem>
                <SelectItem value="archived">Αρχειοθετημένα</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Placeholder Message */}
      <div className="bg-background-white rounded-card p-12 text-center shadow-subtle border border-border/50">
        <div className="text-5xl mb-4">🔒</div>
        <h3 className="text-2xl font-bold text-text-dark mb-2">
          Admin View - Ready for Implementation
        </h3>
        <p className="text-text-medium mb-6">
          This admin view will display all submissions once Supabase is configured and authentication is set up.
        </p>
        <div className="text-sm text-text-light space-y-2">
          <p>• Connect to GET /api/submissions (with auth)</p>
          <p>• Display submissions in a table</p>
          <p>• Allow status updates</p>
          <p>• Add answers for Q&A submissions</p>
          <p>• Export functionality (optional)</p>
        </div>
      </div>
    </div>
  );
}

