"use client";

import { useState, useEffect } from "react";
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
import { Building2, ChevronLeft, ChevronRight, Loader2, Star, StarOff, Power, PowerOff, Globe, RefreshCw, Search, X, Check, XCircle, Eye, Edit, Trash2 } from "lucide-react";
import { ConfirmationDialog } from "./confirmation-dialog";
import { InputDialog } from "./input-dialog";
import { SponsorEditDialog } from "./sponsor-edit-dialog";
import { toast } from "sonner";

interface SponsorApplication {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  website: string | null;
  category: string | null;
  sponsor_type: string | null;
  description: string | null;
  tagline: string | null;
  logo_storage_path: string | null;
  logo_file_name: string | null;
  status: "pending" | "approved" | "rejected" | "payment_pending";
  admin_notes: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  approved_at: string | null;
}

interface Sponsor {
  id: string;
  company_name: string;
  website: string | null;
  contact_email: string;
  category: string | null;
  sponsor_type: string | null;
  tier: "premium" | "standard" | "community";
  is_active: boolean;
  is_featured: boolean;
  sync_status: "pending" | "synced" | "failed";
  sanity_document_id: string | null;
  created_at: string;
}

type TabType = "applications" | "sponsors";

export function SponsorsAdmin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>(
    (searchParams.get("tab") as TabType) || "applications"
  );

  // Applications state
  const [applications, setApplications] = useState<SponsorApplication[]>([]);
  const [applicationsTotal, setApplicationsTotal] = useState(0);
  const [applicationsPage, setApplicationsPage] = useState(1);
  const [applicationsTotalPages, setApplicationsTotalPages] = useState(0);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsFilterStatus, setApplicationsFilterStatus] = useState("pending");
  const [applicationsSearchQuery, setApplicationsSearchQuery] = useState("");
  const [applicationsDebouncedSearch, setApplicationsDebouncedSearch] = useState("");
  const [processingApplicationId, setProcessingApplicationId] = useState<string | null>(null);
  const [confirmationDialog, setConfirmationDialog] = useState<{
    open: boolean;
    action: "approve" | "reject" | "delete" | "activate" | "deactivate" | "feature" | "unfeature" | "custom";
    title?: string;
    description?: string;
    onConfirm: () => void | Promise<void>;
    applicationId?: string;
    sponsorId?: string;
  } | null>(null);
  const [rejectInputDialog, setRejectInputDialog] = useState<{
    open: boolean;
    applicationId: string;
  } | null>(null);

  // Sponsors state
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [sponsorsTotal, setSponsorsTotal] = useState(0);
  const [sponsorsPage, setSponsorsPage] = useState(1);
  const [sponsorsTotalPages, setSponsorsTotalPages] = useState(0);
  const [sponsorsLoading, setSponsorsLoading] = useState(false);
  const [sponsorsFilterActive, setSponsorsFilterActive] = useState("all");
  const [sponsorsFilterTier, setSponsorsFilterTier] = useState("all");
  const [updatingSponsorId, setUpdatingSponsorId] = useState<string | null>(null);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Debounce search for applications
  useEffect(() => {
    const timer = setTimeout(() => {
      setApplicationsDebouncedSearch(applicationsSearchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [applicationsSearchQuery]);

  // Update URL when tab changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("tab", activeTab);
    router.replace(`/admin/sponsors?${params.toString()}`, { scroll: false });
  }, [activeTab, router]);

  // Fetch applications
  useEffect(() => {
    if (activeTab !== "applications") return;

    async function fetchApplications() {
      setApplicationsLoading(true);
      try {
        const params = new URLSearchParams();
        if (applicationsFilterStatus !== "all") params.append("status", applicationsFilterStatus);
        if (applicationsDebouncedSearch.trim()) params.append("q", applicationsDebouncedSearch.trim());
        params.append("page", applicationsPage.toString());
        params.append("limit", "20");
        
        const response = await fetch(`/api/admin/sponsor-applications?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch applications");
        
        const data = await response.json();
        setApplications(data.applications || []);
        setApplicationsTotal(data.pagination?.total || 0);
        setApplicationsTotalPages(data.pagination?.totalPages || 0);
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setApplicationsLoading(false);
      }
    }

    fetchApplications();
  }, [activeTab, applicationsFilterStatus, applicationsDebouncedSearch, applicationsPage]);

  // Fetch sponsors
  useEffect(() => {
    if (activeTab !== "sponsors") return;

    async function fetchSponsors() {
      setSponsorsLoading(true);
      try {
        const params = new URLSearchParams();
        if (sponsorsFilterActive !== "all") params.append("is_active", sponsorsFilterActive);
        if (sponsorsFilterTier !== "all") params.append("tier", sponsorsFilterTier);
        params.append("page", sponsorsPage.toString());
        params.append("limit", "20");
        
        const response = await fetch(`/api/admin/sponsors?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch sponsors");
        
        const data = await response.json();
        setSponsors(data.sponsors || []);
        setSponsorsTotal(data.pagination?.total || 0);
        setSponsorsTotalPages(data.pagination?.totalPages || 0);
      } catch (err) {
        console.error("Error fetching sponsors:", err);
      } finally {
        setSponsorsLoading(false);
      }
    }

    fetchSponsors();
  }, [activeTab, sponsorsFilterActive, sponsorsFilterTier, sponsorsPage]);

  // Application handlers
  const handleApprove = (id: string) => {
    setConfirmationDialog({
      open: true,
      action: "approve",
      onConfirm: async () => {
        setConfirmationDialog(null);
        setProcessingApplicationId(id);
        try {
          const response = await fetch(`/api/admin/sponsor-applications/${id}/approve`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tier: "standard" }),
          });
          if (!response.ok) throw new Error("Failed to approve");
          // Refresh both tabs since approving creates a sponsor
          if (activeTab === "applications") {
            const params = new URLSearchParams();
            if (applicationsFilterStatus !== "all") params.append("status", applicationsFilterStatus);
            params.append("page", applicationsPage.toString());
            params.append("limit", "20");
            const refreshResponse = await fetch(`/api/admin/sponsor-applications?${params.toString()}`);
            const refreshData = await refreshResponse.json();
            setApplications(refreshData.applications || []);
            setApplicationsTotal(refreshData.pagination?.total || 0);
          }
          toast.success("✅ Έγκριση επιτυχής!", {
            description: `Η αίτηση της ${applications.find(a => a.id === id)?.company_name || "εταιρείας"} εγκρίθηκε επιτυχώς και ο χορηγός δημιουργήθηκε.`,
            duration: 5000,
          });
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Αποτυχία έγκρισης";
          toast.error("❌ Σφάλμα έγκρισης", {
            description: errorMessage.includes("Failed") 
              ? "Δεν ήταν δυνατή η έγκριση της αίτησης. Παρακαλώ δοκιμάστε ξανά."
              : errorMessage,
            duration: 6000,
          });
        } finally {
          setProcessingApplicationId(null);
        }
      },
      applicationId: id,
    });
  };

  const handleReject = (id: string) => {
    setConfirmationDialog({
      open: true,
      action: "reject",
      onConfirm: async () => {
        setConfirmationDialog(null);
        // Open input dialog for reject reason
        setRejectInputDialog({ open: true, applicationId: id });
      },
      applicationId: id,
    });
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!rejectInputDialog) return;
    const id = rejectInputDialog.applicationId;
    setRejectInputDialog(null);
    
    setProcessingApplicationId(id);
    try {
      const response = await fetch(`/api/admin/sponsor-applications/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reason.trim() || undefined }),
      });
      if (!response.ok) throw new Error("Failed to reject");
      const params = new URLSearchParams();
      if (applicationsFilterStatus !== "all") params.append("status", applicationsFilterStatus);
      params.append("page", applicationsPage.toString());
      params.append("limit", "20");
      const refreshResponse = await fetch(`/api/admin/sponsor-applications?${params.toString()}`);
      const refreshData = await refreshResponse.json();
      setApplications(refreshData.applications || []);
      setApplicationsTotal(refreshData.pagination?.total || 0);
      toast.success("✅ Απόρριψη επιτυχής", {
        description: `Η αίτηση της ${applications.find(a => a.id === id)?.company_name || "εταιρείας"} απορρίφθηκε.`,
        duration: 4000,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Αποτυχία απόρριψης";
      toast.error("❌ Σφάλμα απόρριψης", {
        description: errorMessage.includes("Failed") 
          ? "Δεν ήταν δυνατή η απόρριψη της αίτησης. Παρακαλώ δοκιμάστε ξανά."
          : errorMessage,
        duration: 6000,
      });
    } finally {
      setProcessingApplicationId(null);
    }
  };

  // Sponsor handlers
  const handleUpdateSponsor = (id: string, updates: Partial<Sponsor>, action: "activate" | "deactivate" | "feature" | "unfeature") => {
    const sponsor = sponsors.find(s => s.id === id);
    const isActivating = action === "activate" || (action === "deactivate" && !sponsor?.is_active);
    const isFeaturing = action === "feature" || (action === "unfeature" && !sponsor?.is_featured);
    
    setConfirmationDialog({
      open: true,
      action: isActivating ? (sponsor?.is_active ? "deactivate" : "activate") : (sponsor?.is_featured ? "unfeature" : "feature"),
      onConfirm: async () => {
        setConfirmationDialog(null);
        setUpdatingSponsorId(id);
        try {
          const response = await fetch(`/api/admin/sponsors/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
          });
          if (!response.ok) throw new Error("Failed to update");
          const params = new URLSearchParams();
          if (sponsorsFilterActive !== "all") params.append("is_active", sponsorsFilterActive);
          if (sponsorsFilterTier !== "all") params.append("tier", sponsorsFilterTier);
          params.append("page", sponsorsPage.toString());
          params.append("limit", "20");
          const refreshResponse = await fetch(`/api/admin/sponsors?${params.toString()}`);
          const refreshData = await refreshResponse.json();
          setSponsors(refreshData.sponsors || []);
          
          // Show success message based on action
          const sponsor = sponsors.find(s => s.id === id);
          if (updates.is_active !== undefined) {
            toast.success(updates.is_active ? "✨ Ενεργοποίηση επιτυχής" : "😴 Απενεργοποίηση επιτυχής", {
              description: `Ο χορηγός "${sponsor?.company_name || "N/A"}" ${updates.is_active ? "ενεργοποιήθηκε" : "απενεργοποιήθηκε"} επιτυχώς.`,
              duration: 4000,
            });
          } else if (updates.is_featured !== undefined) {
            toast.success(updates.is_featured ? "⭐ Προβολή ως Featured" : "💫 Αφαίρεση από Featured", {
              description: `Ο χορηγός "${sponsor?.company_name || "N/A"}" ${updates.is_featured ? "προβάλλεται τώρα ως featured" : "αφαιρέθηκε από τα featured"}.`,
              duration: 4000,
            });
          } else {
            toast.success("✅ Ενημέρωση επιτυχής", {
              description: `Οι αλλαγές για τον χορηγό "${sponsor?.company_name || "N/A"}" αποθηκεύτηκαν.`,
              duration: 4000,
            });
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Αποτυχία ενημέρωσης";
          toast.error("❌ Σφάλμα ενημέρωσης", {
            description: errorMessage.includes("Failed") 
              ? "Δεν ήταν δυνατή η ενημέρωση του χορηγού. Παρακαλώ δοκιμάστε ξανά."
              : errorMessage,
            duration: 6000,
          });
        } finally {
          setUpdatingSponsorId(null);
        }
      },
      sponsorId: id,
    });
  };

  const handleSyncToSanity = async (id: string) => {
    setUpdatingSponsorId(id);
    try {
      const response = await fetch(`/api/admin/sponsors/${id}/sync-to-sanity`, { method: "POST" });
      if (!response.ok) throw new Error("Failed to sync");
      const params = new URLSearchParams();
      if (sponsorsFilterActive !== "all") params.append("is_active", sponsorsFilterActive);
      if (sponsorsFilterTier !== "all") params.append("tier", sponsorsFilterTier);
      params.append("page", sponsorsPage.toString());
      params.append("limit", "20");
      const refreshResponse = await fetch(`/api/admin/sponsors?${params.toString()}`);
      const refreshData = await refreshResponse.json();
      setSponsors(refreshData.sponsors || []);
      
      const sponsor = sponsors.find(s => s.id === id);
      toast.success("🔄 Συγχρονισμός επιτυχής!", {
        description: `Ο χορηγός "${sponsor?.company_name || "N/A"}" συγχρονίστηκε επιτυχώς με το Sanity και θα εμφανίζεται στην αρχική σελίδα.`,
        duration: 5000,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Αποτυχία συγχρονισμού";
      const sponsor = sponsors.find(s => s.id === id);
      toast.error("❌ Σφάλμα συγχρονισμού", {
        description: errorMessage.includes("Failed") 
          ? `Δεν ήταν δυνατός ο συγχρονισμός του χορηγού "${sponsor?.company_name || "N/A"}" με το Sanity. Παρακαλώ ελέγξτε τα logs.`
          : errorMessage,
        duration: 6000,
      });
    } finally {
      setUpdatingSponsorId(null);
    }
  };

  const handleEditSponsor = (sponsor: Sponsor) => {
    setEditingSponsor(sponsor);
    setIsEditDialogOpen(true);
  };

  const handleEditConfirm = async (updates: Partial<Sponsor>) => {
    if (!editingSponsor) return;
    
    setIsEditDialogOpen(false);
    setUpdatingSponsorId(editingSponsor.id);
    try {
      const response = await fetch(`/api/admin/sponsors/${editingSponsor.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update");
      
      // Refresh sponsors list
      const params = new URLSearchParams();
      if (sponsorsFilterActive !== "all") params.append("is_active", sponsorsFilterActive);
      if (sponsorsFilterTier !== "all") params.append("tier", sponsorsFilterTier);
      params.append("page", sponsorsPage.toString());
      params.append("limit", "20");
      const refreshResponse = await fetch(`/api/admin/sponsors?${params.toString()}`);
      const refreshData = await refreshResponse.json();
      setSponsors(refreshData.sponsors || []);
      
      // If sponsor was synced, trigger a re-sync to update Sanity
      if (editingSponsor.sync_status === "synced") {
        // Sync in background (non-blocking)
        fetch(`/api/admin/sponsors/${editingSponsor.id}/sync-to-sanity`, { method: "POST" })
          .then((syncResponse) => {
            if (syncResponse.ok) {
              // Refresh again to get updated sync status
              const refreshParams = new URLSearchParams();
              if (sponsorsFilterActive !== "all") refreshParams.append("is_active", sponsorsFilterActive);
              if (sponsorsFilterTier !== "all") refreshParams.append("tier", sponsorsFilterTier);
              refreshParams.append("page", sponsorsPage.toString());
              refreshParams.append("limit", "20");
              return fetch(`/api/admin/sponsors?${refreshParams.toString()}`);
            }
          })
          .then((refreshResponse) => {
            if (refreshResponse) {
              return refreshResponse.json();
            }
          })
          .then((refreshData) => {
            if (refreshData) {
              setSponsors(refreshData.sponsors || []);
            }
          })
          .catch((err) => {
            console.error("Error syncing to Sanity after edit:", err);
          });
      }
      
      toast.success("✅ Ενημέρωση επιτυχής!", {
        description: `Οι αλλαγές για τον χορηγό "${editingSponsor.company_name}" αποθηκεύτηκαν επιτυχώς.${editingSponsor.sync_status === "synced" ? " Οι αλλαγές θα συγχρονιστούν με το Sanity." : ""}`,
        duration: 5000,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Αποτυχία ενημέρωσης";
      toast.error("❌ Σφάλμα ενημέρωσης", {
        description: errorMessage.includes("Failed") 
          ? "Δεν ήταν δυνατή η ενημέρωση του χορηγού. Παρακαλώ δοκιμάστε ξανά."
          : errorMessage,
        duration: 6000,
      });
    } finally {
      setUpdatingSponsorId(null);
      setEditingSponsor(null);
    }
  };

  const handleDeleteSponsor = (id: string) => {
    const sponsor = sponsors.find(s => s.id === id);
    setConfirmationDialog({
      open: true,
      action: "delete",
      title: "🗑️ Διαγραφή Χορηγού",
      description: `Είστε σίγουροι ότι θέλετε να διαγράψετε τον χορηγό "${sponsor?.company_name || "N/A"}"; Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.`,
      onConfirm: async () => {
        setConfirmationDialog(null);
        setUpdatingSponsorId(id);
        try {
          const response = await fetch(`/api/admin/sponsors/${id}`, {
            method: "DELETE",
          });
          if (!response.ok) throw new Error("Failed to delete");
          
          // Refresh sponsors list
          const params = new URLSearchParams();
          if (sponsorsFilterActive !== "all") params.append("is_active", sponsorsFilterActive);
          if (sponsorsFilterTier !== "all") params.append("tier", sponsorsFilterTier);
          params.append("page", sponsorsPage.toString());
          params.append("limit", "20");
          const refreshResponse = await fetch(`/api/admin/sponsors?${params.toString()}`);
          const refreshData = await refreshResponse.json();
          setSponsors(refreshData.sponsors || []);
          setSponsorsTotal(refreshData.pagination?.total || 0);
          
          toast.success("🗑️ Διαγραφή επιτυχής", {
            description: `Ο χορηγός "${sponsor?.company_name || "N/A"}" διαγράφηκε επιτυχώς.`,
            duration: 4000,
          });
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Αποτυχία διαγραφής";
          toast.error("❌ Σφάλμα διαγραφής", {
            description: errorMessage.includes("Failed") 
              ? "Δεν ήταν δυνατή η διαγραφή του χορηγού. Παρακαλώ δοκιμάστε ξανά."
              : errorMessage,
            duration: 6000,
          });
        } finally {
          setUpdatingSponsorId(null);
        }
      },
      sponsorId: id,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "payment_pending": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return "Εκκρεμής";
      case "approved": return "Εγκεκριμένη";
      case "rejected": return "Απορριφθείσα";
      case "payment_pending": return "Αναμονή πληρωμής";
      default: return status;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "premium": return "bg-purple-100 text-purple-800";
      case "standard": return "bg-blue-100 text-blue-800";
      case "community": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case "premium": return "Premium";
      case "standard": return "Standard";
      case "community": return "Community";
      default: return tier;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Χορηγοί</h1>
        <p className="text-gray-600">Διαχείριση αιτήσεων και εγκεκριμένων χορηγών</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("applications")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "applications"
                ? "border-primary-pink text-primary-pink"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Αιτήσεις Χορηγών
            {applicationsTotal > 0 && (
              <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                {applicationsTotal}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("sponsors")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "sponsors"
                ? "border-primary-pink text-primary-pink"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Εγκεκριμένοι Χορηγοί
            {sponsorsTotal > 0 && (
              <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                {sponsorsTotal}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Applications Tab Content */}
      {activeTab === "applications" && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Αναζήτηση (εταιρεία, email)..."
                  value={applicationsSearchQuery}
                  onChange={(e) => setApplicationsSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                />
                {applicationsSearchQuery && (
                  <button
                    onClick={() => setApplicationsSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="space-y-1.5 sm:min-w-[160px]">
                <label className="text-xs font-medium text-gray-600">Κατάσταση</label>
                <Select value={applicationsFilterStatus} onValueChange={setApplicationsFilterStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Όλα</SelectItem>
                    <SelectItem value="pending">Εκκρεμής</SelectItem>
                    <SelectItem value="approved">Εγκεκριμένες</SelectItem>
                    <SelectItem value="rejected">Απορριφθείσες</SelectItem>
                    <SelectItem value="payment_pending">Αναμονή πληρωμής</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Applications List */}
          {applicationsLoading ? (
            <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-gray-200">
              <Loader2 className="h-8 w-8 animate-spin text-primary-pink mx-auto mb-4" />
              <p className="text-gray-600">Φόρτωση...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-gray-200">
              <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Δεν βρέθηκαν αιτήσεις</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Εμφάνιση {Math.min((applicationsPage - 1) * 20 + 1, applicationsTotal)}-{Math.min(applicationsPage * 20, applicationsTotal)} από {applicationsTotal}
                </p>
                {applicationsTotalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setApplicationsPage((p) => Math.max(1, p - 1))}
                      disabled={applicationsPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-600 px-2">
                      Σελίδα {applicationsPage} από {applicationsTotalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setApplicationsPage((p) => Math.min(applicationsTotalPages, p + 1))}
                      disabled={applicationsPage === applicationsTotalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                {applications.map((app) => (
                  <div key={app.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{app.company_name}</h3>
                            <p className="text-sm text-gray-600">{app.contact_name} • {app.contact_email}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                            {getStatusLabel(app.status)}
                          </span>
                        </div>
                        {app.tagline && <p className="text-sm text-gray-700 italic">"{app.tagline}"</p>}
                        {app.description && <p className="text-sm text-gray-600 line-clamp-2">{app.description}</p>}
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                          {app.category && <span>Κατηγορία: {app.category}</span>}
                          {app.sponsor_type && <span>Τύπος: {app.sponsor_type}</span>}
                          {app.website && (
                            <a href={app.website} target="_blank" rel="noopener noreferrer" className="text-primary-pink hover:underline">
                              Website
                            </a>
                          )}
                          <span>Υποβλήθηκε: {new Date(app.submitted_at).toLocaleDateString("el-GR")}</span>
                        </div>
                      </div>
                      {app.status === "pending" && (
                        <div className="flex flex-col sm:flex-row gap-2 lg:flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(app.id)}
                            disabled={processingApplicationId === app.id}
                            className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50"
                          >
                            {processingApplicationId === app.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                            Έγκριση
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(app.id)}
                            disabled={processingApplicationId === app.id}
                            className="flex items-center gap-2 border-red-200 text-red-700 hover:bg-red-50"
                          >
                            {processingApplicationId === app.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <XCircle className="h-4 w-4" />
                            )}
                            Απόρριψη
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Sponsors Tab Content */}
      {activeTab === "sponsors" && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="space-y-1.5 sm:min-w-[160px]">
                <label className="text-xs font-medium text-gray-600">Κατάσταση</label>
                <Select value={sponsorsFilterActive} onValueChange={setSponsorsFilterActive}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Όλα</SelectItem>
                    <SelectItem value="true">Ενεργοί</SelectItem>
                    <SelectItem value="false">Ανενεργοί</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 sm:min-w-[160px]">
                <label className="text-xs font-medium text-gray-600">Tier</label>
                <Select value={sponsorsFilterTier} onValueChange={setSponsorsFilterTier}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Όλα</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="community">Community</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Sponsors List */}
          {sponsorsLoading ? (
            <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-gray-200">
              <Loader2 className="h-8 w-8 animate-spin text-primary-pink mx-auto mb-4" />
              <p className="text-gray-600">Φόρτωση...</p>
            </div>
          ) : sponsors.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-gray-200">
              <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Δεν βρέθηκαν χορηγοί</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Εμφάνιση {Math.min((sponsorsPage - 1) * 20 + 1, sponsorsTotal)}-{Math.min(sponsorsPage * 20, sponsorsTotal)} από {sponsorsTotal}
                </p>
                {sponsorsTotalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSponsorsPage((p) => Math.max(1, p - 1))}
                      disabled={sponsorsPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-600 px-2">
                      Σελίδα {sponsorsPage} από {sponsorsTotalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSponsorsPage((p) => Math.min(sponsorsTotalPages, p + 1))}
                      disabled={sponsorsPage === sponsorsTotalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                {sponsors.map((sponsor) => (
                  <div key={sponsor.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{sponsor.company_name}</h3>
                            <p className="text-sm text-gray-600">{sponsor.contact_email}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTierColor(sponsor.tier)}`}>
                              {getTierLabel(sponsor.tier)}
                            </span>
                            {sponsor.is_featured && (
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Featured
                              </span>
                            )}
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              sponsor.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}>
                              {sponsor.is_active ? "Ενεργός" : "Ανενεργός"}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              sponsor.sync_status === "synced" ? "bg-blue-100 text-blue-800" :
                              sponsor.sync_status === "failed" ? "bg-red-100 text-red-800" :
                              "bg-yellow-100 text-yellow-800"
                            }`}>
                              {sponsor.sync_status === "synced" ? "Συγχρονισμένο" :
                               sponsor.sync_status === "failed" ? "Σφάλμα" : "Εκκρεμές"}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                          {sponsor.category && <span>Κατηγορία: {sponsor.category}</span>}
                          {sponsor.sponsor_type && <span>Τύπος: {sponsor.sponsor_type}</span>}
                          {sponsor.website && (
                            <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="text-primary-pink hover:underline flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              Website
                            </a>
                          )}
                          <span>Δημιουργήθηκε: {new Date(sponsor.created_at).toLocaleDateString("el-GR")}</span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 lg:flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditSponsor(sponsor)}
                          disabled={updatingSponsorId === sponsor.id || isEditDialogOpen}
                          className="flex items-center gap-2 border-primary-pink/30 text-primary-pink hover:bg-primary-pink/10"
                        >
                          <Edit className="h-4 w-4" />
                          Επεξεργασία
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteSponsor(sponsor.id)}
                          disabled={updatingSponsorId === sponsor.id || (confirmationDialog?.open && confirmationDialog?.sponsorId === sponsor.id)}
                          className="flex items-center gap-2 border-red-200 text-red-700 hover:bg-red-50"
                        >
                          {updatingSponsorId === sponsor.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4" />
                              Διαγραφή
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateSponsor(sponsor.id, { is_active: !sponsor.is_active }, sponsor.is_active ? "deactivate" : "activate")}
                          disabled={updatingSponsorId === sponsor.id || (confirmationDialog?.open && confirmationDialog?.sponsorId === sponsor.id)}
                          className={`flex items-center gap-2 ${
                            sponsor.is_active 
                              ? "border-red-200 text-red-700 hover:bg-red-50" 
                              : "border-green-200 text-green-700 hover:bg-green-50"
                          }`}
                        >
                          {updatingSponsorId === sponsor.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : sponsor.is_active ? (
                            <>
                              <PowerOff className="h-4 w-4" />
                              Απενεργοποίηση
                            </>
                          ) : (
                            <>
                              <Power className="h-4 w-4" />
                              Ενεργοποίηση
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateSponsor(sponsor.id, { is_featured: !sponsor.is_featured }, sponsor.is_featured ? "unfeature" : "feature")}
                          disabled={updatingSponsorId === sponsor.id || (confirmationDialog?.open && confirmationDialog?.sponsorId === sponsor.id)}
                          className={`flex items-center gap-2 ${
                            sponsor.is_featured 
                              ? "border-yellow-200 text-yellow-700 hover:bg-yellow-50" 
                              : "border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {updatingSponsorId === sponsor.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : sponsor.is_featured ? (
                            <>
                              <StarOff className="h-4 w-4" />
                              Unfeature
                            </>
                          ) : (
                            <>
                              <Star className="h-4 w-4" />
                              Feature
                            </>
                          )}
                        </Button>
                        {sponsor.sync_status !== "synced" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSyncToSanity(sponsor.id)}
                            disabled={updatingSponsorId === sponsor.id}
                            className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                          >
                            {updatingSponsorId === sponsor.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <RefreshCw className="h-4 w-4" />
                                Sync
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmationDialog && (
        <ConfirmationDialog
          open={confirmationDialog.open}
          onOpenChange={(open) => {
            if (!open) {
              setConfirmationDialog(null);
            }
          }}
          action={confirmationDialog.action}
          title={confirmationDialog.title}
          description={confirmationDialog.description}
          onConfirm={confirmationDialog.onConfirm}
          isLoading={
            (confirmationDialog.applicationId && processingApplicationId === confirmationDialog.applicationId) ||
            (confirmationDialog.sponsorId && updatingSponsorId === confirmationDialog.sponsorId)
          }
        />
      )}

      {/* Reject Reason Input Dialog */}
      {rejectInputDialog && (
        <InputDialog
          open={rejectInputDialog.open}
          onOpenChange={(open) => {
            if (!open) {
              setRejectInputDialog(null);
            }
          }}
          title="⚠️ Λόγος Απόρριψης"
          description="Παρακαλώ δώστε λόγο απόρριψης (προαιρετικό). Μπορείτε να αφήσετε κενό."
          label="Λόγος απόρριψης"
          placeholder="Π.χ. Δεν πληροί τα κριτήρια, Ατελής αίτηση..."
          confirmLabel="✅ Απόρριψη"
          cancelLabel="Ακύρωση"
          onConfirm={handleRejectConfirm}
          isLoading={processingApplicationId === rejectInputDialog.applicationId}
        />
      )}

      {/* Edit Sponsor Dialog */}
      {editingSponsor && (
        <SponsorEditDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          sponsor={editingSponsor}
          onConfirm={handleEditConfirm}
          isLoading={updatingSponsorId === editingSponsor.id}
        />
      )}
    </div>
  );
}
