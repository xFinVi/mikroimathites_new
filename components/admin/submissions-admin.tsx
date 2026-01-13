// /components/admin/submissions-admin.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import {
  getTopicLabel,
  getAgeGroupLabel,
  getTypeLabel,
  getStatusLabel,
} from "@/lib/utils/forms";
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

interface SubmissionsResponse {
  submissions: Submission[];
  total: number;
  totalPages: number;
}

function parsePage(value: string | null): number {
  const n = Number.parseInt(value || "1", 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function buildQueryString(params: {
  type: string;
  status: string;
  q: string;
  page: number;
}): string {
  const sp = new URLSearchParams();
  if (params.type !== "all") sp.set("type", params.type);
  if (params.status !== "all") sp.set("status", params.status);
  if (params.q.trim()) sp.set("q", params.q.trim());
  if (params.page > 1) sp.set("page", String(params.page));
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export function SubmissionsAdmin() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initial = useMemo(() => {
    return {
      page: parsePage(searchParams.get("page")),
      type: searchParams.get("type") || "all",
      status: searchParams.get("status") || "all",
      q: searchParams.get("q") || "",
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // initial state only

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [currentPage, setCurrentPage] = useState<number>(initial.page);
  const [filterType, setFilterType] = useState<string>(initial.type);
  const [filterStatus, setFilterStatus] = useState<string>(initial.status);

  const [searchQuery, setSearchQuery] = useState<string>(initial.q);
  const [debouncedSearch, setDebouncedSearch] = useState<string>(initial.q);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const lastUrlRef = useRef<string>("");

  // Debounce search text (keeps input responsive)
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, ADMIN_CONSTANTS.SUBMISSIONS.SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  // If user changes filters/search, reset page to 1
  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, filterStatus, debouncedSearch]);

  // Sync local state on browser back/forward (URL changed outside our setters)
  useEffect(() => {
    const urlType = searchParams.get("type") || "all";
    const urlStatus = searchParams.get("status") || "all";
    const urlQ = searchParams.get("q") || "";
    const urlPage = parsePage(searchParams.get("page"));

    setFilterType((prev) => (prev !== urlType ? urlType : prev));
    setFilterStatus((prev) => (prev !== urlStatus ? urlStatus : prev));
    setSearchQuery((prev) => (prev !== urlQ ? urlQ : prev));
    setDebouncedSearch((prev) => (prev !== urlQ ? urlQ : prev));
    setCurrentPage((prev) => (prev !== urlPage ? urlPage : prev));
  }, [searchParams]);

  // Update URL when state changes (avoid infinite loops)
  useEffect(() => {
    const qs = buildQueryString({
      type: filterType,
      status: filterStatus,
      q: debouncedSearch,
      page: currentPage,
    });

    const nextUrl = `/admin/submissions${qs}`;
    if (lastUrlRef.current !== nextUrl) {
      lastUrlRef.current = nextUrl;
      router.replace(nextUrl, { scroll: false });
    }
  }, [filterType, filterStatus, debouncedSearch, currentPage, router]);

  // Fetch data with abort to prevent race conditions
  useEffect(() => {
    const controller = new AbortController();

    async function fetchSubmissions() {
      setLoading(true);
      setError(null);

      try {
        const sp = new URLSearchParams();
        if (filterType !== "all") sp.append("type", filterType);
        if (filterStatus !== "all") sp.append("status", filterStatus);
        if (debouncedSearch.trim()) sp.append("q", debouncedSearch.trim());
        sp.append("page", String(currentPage));
        sp.append("pageSize", String(ADMIN_CONSTANTS.SUBMISSIONS.PAGE_SIZE));

        const res = await fetch(`/api/admin/submissions?${sp.toString()}`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("Failed to fetch submissions");

        const data: SubmissionsResponse = await res.json();
        setSubmissions(data.submissions || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 0);
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to load submissions");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchSubmissions();

    return () => controller.abort();
  }, [filterType, filterStatus, debouncedSearch, currentPage]);

  const hasActiveFilters =
    filterType !== "all" || filterStatus !== "all" || debouncedSearch.trim() !== "";

  const startItem =
    total === 0
      ? 0
      : (currentPage - 1) * ADMIN_CONSTANTS.SUBMISSIONS.PAGE_SIZE + 1;

  const endItem = Math.min(
    currentPage * ADMIN_CONSTANTS.SUBMISSIONS.PAGE_SIZE,
    total,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Διαχείριση Υποβολών
        </h2>
        <p className="text-sm text-gray-600">Προβολή και διαχείριση υποβολών χρηστών</p>
      </div>

      {/* Search and Filters Bar (never unmounts) */}
      <div className="bg-white rounded-lg p-4 sm:p-5 shadow-sm border border-gray-200">
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
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
                  setDebouncedSearch("");
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
      {!loading && !error && (
        <div className="flex items-center justify-between flex-wrap gap-4">
          <p className="text-sm text-gray-600">
            {total === 0 ? (
              "Δεν βρέθηκαν υποβολές"
            ) : (
              <>
                Εμφάνιση {startItem}-{endItem} από {total}{" "}
                {total === 1 ? "υποβολή" : "υποβολές"}
                {hasActiveFilters && " (φιλτραρισμένες)"}
              </>
            )}
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
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
                disabled={currentPage === totalPages}
              >
                Επόμενο
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* List area */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/40 rounded-card p-6">
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="h-5 bg-gray-200 rounded w-24" />
                <div className="h-5 bg-gray-200 rounded w-16" />
                <div className="h-5 bg-gray-200 rounded w-20" />
              </div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : !error && submissions.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-gray-200">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-medium mb-1">
            {(() => {
              if (total === 0 && !hasActiveFilters) return "Δεν βρέθηκαν υποβολές";
              if (filterStatus === "new") return "Δεν υπάρχουν νέες υποβολές";
              if (filterStatus === "not_answered") return "Όλες οι υποβολές έχουν απαντηθεί";
              if (filterStatus === "answered") return "Δεν υπάρχουν απαντημένες υποβολές ακόμα";
              if (filterStatus === "published") return "Δεν υπάρχουν δημοσιευμένες υποβολές ακόμα";
              if (filterStatus === "in_progress") return "Δεν υπάρχουν υποβολές σε εξέλιξη";
              if (filterStatus === "archived") return "Δεν υπάρχουν αρχειοθετημένες υποβολές";
              return "Δεν βρέθηκαν αποτελέσματα";
            })()}
          </p>
          {hasActiveFilters && filterStatus === "all" && (
            <p className="text-sm text-gray-500 mt-2">Δοκιμάστε να αλλάξετε τα φίλτρα</p>
          )}
          {filterStatus !== "all" && (
            <p className="text-sm text-gray-500 mt-2">
              Όλες οι υποβολές θα εμφανιστούν εδώ μόλις αλλάξουν κατάσταση
            </p>
          )}
        </div>
      ) : !error ? (
        <div className="space-y-3">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              onClick={() => router.push(`/admin/submissions/${submission.id}`)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-primary-pink/50 transition-all cursor-pointer overflow-hidden"
            >
              <div className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
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
                          title={
                            submission.is_approved
                              ? "Συναίνεση δημοσίευσης"
                              : "Χωρίς συναίνεση"
                          }
                        >
                          {submission.is_approved ? "✓" : "✗"}
                        </span>
                      )}

                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                          submission.status === "new"
                            ? "bg-yellow-100 text-yellow-800"
                            : submission.status === "answered" ||
                                submission.status === "published"
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
                        <span className="font-medium text-gray-900 truncate">
                          {submission.name || "Ανώνυμος"}
                        </span>
                        <span className="text-gray-400 hidden sm:inline">•</span>
                        <span className="truncate text-xs sm:text-sm">
                          {submission.email || "-"}
                        </span>
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

                  <div
                    className="flex-shrink-0 self-start sm:self-center"
                    onClick={(e) => e.stopPropagation()}
                  >
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
      ) : null}
    </div>
  );
}