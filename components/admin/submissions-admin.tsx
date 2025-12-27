"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { getTopicLabel, getAgeGroupLabel, getTypeLabel, getStatusLabel } from "@/lib/utils/submission-labels";
import { ADMIN_CONSTANTS } from "@/lib/constants";

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
  source_page?: string | null;
  admin_reply?: string | null;
  admin_reply_sent_at?: string | null;
}

export function SubmissionsAdmin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1"));
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>(searchParams.get("type") || "all");
  const [filterStatus, setFilterStatus] = useState<string>(searchParams.get("status") || "all");
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get("q") || "");
  const [debouncedSearch, setDebouncedSearch] = useState<string>(searchParams.get("q") || "");
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Debounce search input - only update debouncedSearch, don't trigger re-render of input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, ADMIN_CONSTANTS.SUBMISSIONS.SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  // Maintain focus on search input when it's being typed
  useEffect(() => {
    // Only restore focus if the input was previously focused and we're not loading
    if (searchInputRef.current && document.activeElement === searchInputRef.current && !loading) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  }, [loading]);

  // Reset to page 1 when filters or search change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [filterType, filterStatus, debouncedSearch]);

  // Update URL when filters, search, or page change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filterType !== "all") params.set("type", filterType);
    if (filterStatus !== "all") params.set("status", filterStatus);
    if (debouncedSearch.trim()) params.set("q", debouncedSearch.trim());
    if (currentPage > 1) params.set("page", currentPage.toString());
    const queryString = params.toString();
    router.replace(`/admin/submissions${queryString ? `?${queryString}` : ""}`, { scroll: false });
  }, [filterType, filterStatus, debouncedSearch, currentPage, router]);

  useEffect(() => {
    async function fetchSubmissions() {
      setLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams();
        if (filterType !== "all") params.append("type", filterType);
        if (filterStatus !== "all") params.append("status", filterStatus);
        if (debouncedSearch.trim()) params.append("q", debouncedSearch.trim());
        params.append("page", currentPage.toString());
        params.append("pageSize", ADMIN_CONSTANTS.SUBMISSIONS.PAGE_SIZE.toString());
        
        const response = await fetch(`/api/admin/submissions?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch submissions");
        }
        
        const data: SubmissionsResponse = await response.json();
        setSubmissions(data.submissions || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load submissions");
      } finally {
        setLoading(false);
      }
    }

    fetchSubmissions();
  }, [filterType, filterStatus, debouncedSearch, currentPage]);

  // Skeleton loader
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>

        {/* Search and Filters skeleton */}
        <div className="bg-white rounded-lg p-4 sm:p-5 shadow-sm border border-gray-200">
          <div className="h-10 bg-gray-200 rounded mb-4 animate-pulse"></div>
          <div className="flex gap-3">
            <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
          </div>
        </div>

        {/* Results skeleton */}
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="h-5 bg-gray-200 rounded w-24"></div>
                <div className="h-5 bg-gray-200 rounded w-16"></div>
                <div className="h-5 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
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

  // No client-side filtering needed - all done server-side
  const hasActiveFilters = filterType !== "all" || filterStatus !== "all" || debouncedSearch.trim() !== "";

  // Calculate pagination info
  const startItem = total === 0 ? 0 : (currentPage - 1) * ADMIN_CONSTANTS.SUBMISSIONS.PAGE_SIZE + 1;
  const endItem = Math.min(currentPage * ADMIN_CONSTANTS.SUBMISSIONS.PAGE_SIZE, total);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Διαχείριση Υποβολών</h2>
        <p className="text-sm text-gray-600">Προβολή και διαχείριση υποβολών χρηστών</p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-lg p-4 sm:p-5 shadow-sm border border-gray-200">
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Αναζήτηση (μήνυμα, όνομα, email)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 w-full"
                autoComplete="off"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
            <div className="space-y-1.5 flex-1 sm:flex-initial sm:min-w-[160px]">
              <label className="text-xs font-medium text-gray-600">Τύπος</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full">
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
            <div className="space-y-1.5 flex-1 sm:flex-initial sm:min-w-[160px]">
              <label className="text-xs font-medium text-gray-600">Κατάσταση</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Όλα</SelectItem>
                  <SelectItem value="new">Νέα</SelectItem>
                  <SelectItem value="not_answered">Μη απαντημένες</SelectItem>
                  <SelectItem value="answered">Απαντημένες</SelectItem>
                  <SelectItem value="in_progress">Σε εξέλιξη</SelectItem>
                  <SelectItem value="published">Δημοσιευμένες</SelectItem>
                  <SelectItem value="archived">Αρχειοθετημένες</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilterType("all");
                  setFilterStatus("all");
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="text-xs w-full sm:w-auto"
              >
                <X className="h-3 w-3 mr-1" />
                Καθαρισμός
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count & Pagination Info */}
      {!loading && (
        <div className="flex items-center justify-between flex-wrap gap-4">
          <p className="text-sm text-gray-600">
            {total === 0 ? (
              "Δεν βρέθηκαν υποβολές"
            ) : (
              <>
                Εμφάνιση {startItem}-{endItem} από {total} {total === 1 ? "υποβολή" : "υποβολές"}
                {hasActiveFilters && ` (φιλτραρισμένες)`}
              </>
            )}
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || loading}
              >
                <ChevronLeft className="h-4 w-4" />
                Προηγούμενο
              </Button>
              <span className="text-sm text-gray-600 px-2">
                Σελίδα {currentPage} από {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || loading}
              >
                Επόμενο
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Submissions List */}
      {submissions.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-gray-200">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-medium mb-1">
            {(() => {
              if (total === 0 && !hasActiveFilters) {
                return "Δεν βρέθηκαν υποβολές";
              }
              // Show friendly messages based on filter
              if (filterStatus === "new") {
                return "Δεν υπάρχουν νέες υποβολές";
              }
              if (filterStatus === "not_answered") {
                return "Όλες οι υποβολές έχουν απαντηθεί";
              }
              if (filterStatus === "answered") {
                return "Δεν υπάρχουν απαντημένες υποβολές ακόμα";
              }
              if (filterStatus === "published") {
                return "Δεν υπάρχουν δημοσιευμένες υποβολές ακόμα";
              }
              if (filterStatus === "in_progress") {
                return "Δεν υπάρχουν υποβολές σε εξέλιξη";
              }
              if (filterStatus === "archived") {
                return "Δεν υπάρχουν αρχειοθετημένες υποβολές";
              }
              return "Δεν βρέθηκαν αποτελέσματα";
            })()}
          </p>
          {hasActiveFilters && filterStatus === "all" && (
            <p className="text-sm text-gray-500 mt-2">
              Δοκιμάστε να αλλάξετε τα φίλτρα
            </p>
          )}
          {filterStatus !== "all" && (
            <p className="text-sm text-gray-500 mt-2">
              Όλες οι υποβολές θα εμφανιστούν εδώ μόλις αλλάξουν κατάσταση
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              onClick={() => router.push(`/admin/submissions/${submission.id}`)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-primary-pink/50 transition-all cursor-pointer overflow-hidden"
            >
              <div className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  {/* Left: Main Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-900">
                        {getTypeLabel(submission.type)}
                      </span>
                      {submission.type === "question" && (
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium flex-shrink-0 ${
                            submission.is_approved
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                          title={submission.is_approved ? "Συναίνεση δημοσίευσης" : "Χωρίς συναίνεση"}
                        >
                          {submission.is_approved ? "✓" : "✗"}
                        </span>
                      )}
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                          submission.status === "new"
                            ? "bg-yellow-100 text-yellow-800"
                            : submission.status === "answered" || submission.status === "published"
                            ? "bg-green-100 text-green-800"
                            : submission.status === "in_progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {getStatusLabel(submission.status)}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-900 truncate">{submission.name || "Ανώνυμος"}</span>
                        <span className="text-gray-400 hidden sm:inline">•</span>
                        <span className="truncate text-xs sm:text-sm">{submission.email || "-"}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-gray-400 hidden sm:inline">•</span>
                        <span className="whitespace-nowrap text-xs sm:text-sm">
                          {new Date(submission.created_at).toLocaleDateString("el-GR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        {submission.topic && (
                          <>
                            <span className="text-gray-400 hidden sm:inline">•</span>
                            <span className="text-gray-700 font-medium text-xs sm:text-sm truncate">
                              {getTopicLabel(submission.topic)}
                            </span>
                          </>
                        )}
                        {submission.child_age_group && (
                          <>
                            <span className="text-gray-400 hidden sm:inline">•</span>
                            <span className="text-gray-700 text-xs sm:text-sm whitespace-nowrap">
                              {getAgeGroupLabel(submission.child_age_group)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Action Button */}
                  <div className="flex-shrink-0 self-start sm:self-center" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/admin/submissions/${submission.id}`)}
                      className="text-primary-pink hover:text-primary-pink hover:bg-primary-pink/10 whitespace-nowrap"
                    >
                      Προβολή →
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

