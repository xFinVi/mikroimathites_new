"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2, Mail, User, Calendar, MessageSquare, Globe, Archive, Trash2 } from "lucide-react";
import { getTopicLabel, getAgeGroupLabel, getTypeLabel, getStatusLabel } from "@/lib/utils/forms";
import { ADMIN_CONSTANTS } from "@/lib/constants";
import type { Submission } from "@/lib/types/submission";
import { EmailTemplates } from "@/components/admin/email-templates";

export function SubmissionDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Form state
  const [status, setStatus] = useState<string>("");
  const [adminReply, setAdminReply] = useState<string>("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchSubmission() {
      try {
        const resolvedParams = await params;
        const response = await fetch(`/api/admin/submissions/${resolvedParams.id}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch submission");
        }
        
        const data = await response.json();
        setSubmission(data.submission);
        setStatus(data.submission.status);
        setAdminReply(data.submission.admin_reply || "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load submission");
      } finally {
        setLoading(false);
      }
    }

    fetchSubmission();
  }, [params]);

  const handleSave = async () => {
    if (!submission) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/admin/submissions/${submission.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          admin_reply: adminReply || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update submission");
      }

      const data = await response.json();
      setSubmission(data.submission);
      setStatus(data.submission.status); // Update local state
      setSuccess("Η υποβολή ενημερώθηκε επιτυχώς!");
      
      // Clear success message after timeout
      setTimeout(() => setSuccess(null), ADMIN_CONSTANTS.UI.SUCCESS_MESSAGE_TIMEOUT);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update submission");
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async () => {
    if (!submission) return;

    if (!confirm("Είστε σίγουροι ότι θέλετε να αρχειοθετήσετε αυτή την υποβολή;")) {
      return;
    }

    setArchiving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/admin/submissions/${submission.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "archived",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to archive submission");
      }

      const data = await response.json();
      setSubmission(data.submission);
      setStatus("archived");
      setSuccess("Η υποβολή αρχειοθετήθηκε επιτυχώς!");
      setTimeout(() => {
        router.push("/admin/submissions?status=not_answered");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to archive submission");
    } finally {
      setArchiving(false);
    }
  };

  const handleDelete = async () => {
    if (!submission) return;

    if (!confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την υποβολή; Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.")) {
      return;
    }

    setDeleting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/admin/submissions/${submission.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete submission");
      }

      setSuccess("Η υποβολή διαγράφηκε επιτυχώς!");
      setTimeout(() => {
        router.push("/admin/submissions?status=not_answered");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete submission");
    } finally {
      setDeleting(false);
    }
  };

  const handleSendReply = async () => {
    if (!submission || !adminReply.trim()) {
      setError("Παρακαλώ γράψτε μια απάντηση πριν την αποστολή.");
      return;
    }

    if (!submission.email) {
      setError("Δεν υπάρχει email για αυτή την υποβολή.");
      return;
    }

    setSendingEmail(true);
    setError(null);
    setSuccess(null);

    try {
      // Send reply - API handles: email, draft creation, and submission update
      // Also includes admin_notes to avoid race condition
      const emailResponse = await fetch(`/api/admin/submissions/${submission.id}/send-reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reply: adminReply,
        }),
      });

      if (!emailResponse.ok) {
        const emailData = await emailResponse.json();
        throw new Error(emailData.error || "Failed to send reply");
      }

      // Get response data to check if draft was created
      const emailData = await emailResponse.json();
      
      // Admin notes are now saved in the same request (no separate call needed)
      
      // Refresh submission data to get updated sanity_qa_item_id and status
      const resolvedParams = await params;
      const refreshResponse = await fetch(`/api/admin/submissions/${resolvedParams.id}`);
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        setSubmission(refreshData.submission);
        setStatus(refreshData.submission.status);
      }
      
      // Show success message with draft info and warnings if applicable
      if (emailData.partialSuccess && !emailData.success) {
        // Partial success - some operations may have failed
        const warnings = emailData.warnings || [];
        setSuccess(
          `Η απάντηση ${emailData.emailSent ? "στάλθηκε" : "αποθηκεύτηκε"}${emailData.draftCreated ? " και δημιουργήθηκε draft" : ""}${warnings.length > 0 ? `. Προειδοποίηση: ${warnings.join(", ")}` : ""}`
        );
      } else if (emailData.draftCreated) {
        setSuccess("Η απάντηση στάλθηκε επιτυχώς! Δημιουργήθηκε draft στο Sanity Studio.");
      } else {
        setSuccess("Η απάντηση στάλθηκε επιτυχώς στον χρήστη!");
      }
      
      // Show warning if partial success
      if (emailData.partialSuccess && !emailData.success && emailData.warnings?.length > 0) {
        setError(`⚠️ ${emailData.warnings.join(", ")}`);
        setTimeout(() => setError(null), 8000);
      }
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reply");
    } finally {
      setSendingEmail(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-pink" />
      </div>
    );
  }

  if (error && !submission) {
    return (
      <div className="bg-destructive/10 border border-destructive/40 rounded-card p-6">
        <p className="text-destructive">{error}</p>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/submissions")}
          className="mt-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Επιστροφή
        </Button>
      </div>
    );
  }

  if (!submission) {
    return null;
  }

  // Handle template insertion
  const handleInsertTemplate = (templateText: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      // Fallback: just set the value
      setAdminReply(templateText);
      return;
    }

    // Get cursor position
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = adminReply;

    // Insert template at cursor position (or replace selection)
    const newValue = 
      currentValue.substring(0, start) + 
      templateText + 
      currentValue.substring(end);

    setAdminReply(newValue);

    // Set cursor position after inserted text
    setTimeout(() => {
      const newCursorPos = start + templateText.length;
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push("/admin/submissions")}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Επιστροφή στις υποβολές
      </Button>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-card p-4 text-sm text-green-800">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-destructive/10 border border-destructive/40 rounded-card p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Management Section - Top Row */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Διαχείριση</h3>
          
          <div className="flex flex-row items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="status" className="text-base font-semibold text-text-dark">
                Κατάσταση
              </Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Νέα</SelectItem>
                  <SelectItem value="in_progress">Σε εξέλιξη</SelectItem>
                  <SelectItem value="answered">Απαντημένη</SelectItem>
                  <SelectItem value="published">Δημοσιευμένη</SelectItem>
                  <SelectItem value="archived">Αρχειοθετημένη</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleSave}
              disabled={saving}
              variant="outline"
              className="flex-shrink-0"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Αποθήκευση...
                </>
              ) : (
                "💾 Αποθήκευση (Κατάσταση)"
              )}
            </Button>
          </div>
          <p className="text-xs text-text-light mt-2">
            Αποθηκεύει μόνο την κατάσταση (δεν στέλνει email)
          </p>

          {/* Archive and Delete Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
            <Button
              onClick={handleArchive}
              disabled={archiving || submission.status === "archived"}
              variant="outline"
              className="flex-1 border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300"
            >
              {archiving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Αρχειοθεσία...
                </>
              ) : (
                <>
                  <Archive className="h-4 w-4 mr-2" />
                  Αρχειοθεσία
                </>
              )}
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              variant="outline"
              className="flex-1 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Διαγραφή...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Διαγραφή
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Question and Answer Section - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Question - 50% width */}
          <div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Λεπτομέρειες Υποβολής</h2>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
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
              
              <div className="space-y-6">
                {/* Message Section */}
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="h-5 w-5 text-gray-600" />
                    <p className="text-sm font-semibold text-gray-700">Μήνυμα</p>
                  </div>
                  <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{submission.message}</p>
                </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Όνομα</p>
                    <p className="text-sm font-medium text-gray-900">{submission.name || "Ανώνυμος"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-50">
                    <Mail className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Email</p>
                    <p className="text-sm text-gray-900">{submission.email || "-"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-green-50">
                    <Calendar className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Ημερομηνία</p>
                    <p className="text-sm text-gray-900">
                      {new Date(submission.created_at).toLocaleString("el-GR")}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Τύπος</p>
                  <p className="text-sm font-medium text-gray-900">{getTypeLabel(submission.type)}</p>
                </div>

                {submission.topic && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Θέμα / Κατηγορία</p>
                    <p className="text-sm text-gray-900">
                      {getTopicLabel(submission.topic)}
                    </p>
                  </div>
                )}

                {submission.child_age_group && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Ηλικιακή ομάδα</p>
                    <p className="text-sm text-gray-900">
                      {getAgeGroupLabel(submission.child_age_group)}
                    </p>
                  </div>
                )}
              </div>

              {/* Publish Consent - Only for questions */}
              {submission.type === "question" && (
                <div className="pt-4 border-t border-gray-200">
                  <div className={`flex items-start gap-3 p-4 rounded-lg border-2 ${
                    submission.is_approved
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50 border-gray-200"
                  }`}>
                    <div className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center ${
                      submission.is_approved 
                        ? "bg-green-600 border-green-600" 
                        : "bg-white border-gray-400"
                    }`}>
                      {submission.is_approved && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        Συναίνεση Δημοσίευσης
                      </p>
                      <p className={`text-sm ${
                        submission.is_approved ? "text-green-800" : "text-gray-600"
                      }`}>
                        {submission.is_approved 
                          ? "✓ Ο χρήστης συμφώνησε να δημοσιευτεί η ερώτησή του (χωρίς προσωπικά στοιχεία)"
                          : "✗ Ο χρήστης δεν συμφώνησε να δημοσιευτεί η ερώτησή του"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Answer Textarea - 50% width */}
        <div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Απάντηση</h3>
              {submission && (
                <EmailTemplates
                  submissionType={submission.type}
                  submissionName={submission.name}
                  submissionMessage={submission.message}
                  onInsertTemplate={handleInsertTemplate}
                />
              )}
            </div>
            
            <div className="space-y-4 flex-1 flex flex-col">
              <div className="space-y-2 flex-1 flex flex-col">
                <Label htmlFor="admin_reply" className="text-base font-semibold text-text-dark">
                  Απάντηση στον χρήστη
                </Label>
                <Textarea
                  ref={textareaRef}
                  id="admin_reply"
                  value={adminReply}
                  onChange={(e) => setAdminReply(e.target.value)}
                  placeholder="Γράψτε την απάντησή σας ή επιλέξτε ένα πρότυπο από το μενού..."
                  className="resize-none flex-1 min-h-[500px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Send Button - Below Question and Answer */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        {submission.email ? (
          <div className="space-y-3">
            <Button
              onClick={handleSendReply}
              disabled={sendingEmail || !adminReply.trim()}
              className="w-full bg-primary-pink hover:bg-primary-pink/90 text-white font-semibold"
              size="lg"
            >
              {sendingEmail ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Αποστολή...
                </>
              ) : (
                <>
                  📧 Αποστολή Απάντησης
                </>
              )}
            </Button>
            <p className="text-xs text-text-medium text-center">
              Θα αποθηκευτεί, θα σταλεί email στον χρήστη, θα δημιουργηθεί draft στο Sanity (αν υπάρχει συναίνεση) και η κατάσταση θα οριστεί σε "Απαντημένη"
            </p>
            {submission.admin_reply_sent_at && (
              <div className="bg-green-50 border border-green-200 rounded-card p-3 text-sm text-green-800">
                ✓ Αποστάλθηκε email στις {new Date(submission.admin_reply_sent_at).toLocaleString("el-GR")}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-card p-3 text-sm text-yellow-800">
            ⚠ Δεν υπάρχει email για αυτή την υποβολή. Η απάντηση μπορεί να αποθηκευτεί αλλά δεν θα σταλεί email.
          </div>
        )}

        {/* Draft Created Indicator - Shows when draft exists but not published */}
        {submission.type === "question" && 
         submission.sanity_qa_item_id && 
         !submission.published_to_sanity && (
          <div className="mt-4">
            <div className="bg-blue-50 border border-blue-200 rounded-card p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-900 mb-1">
                    📝 Draft δημιουργήθηκε στο Sanity
                  </p>
                  <p className="text-xs text-blue-700 mb-2">
                    Η ερώτηση και η απάντηση έχουν δημιουργηθεί ως draft στο Sanity Studio. Μπορείτε να την δείτε, να την επεξεργαστείτε και να τη δημοσιεύσετε από εκεί.
                  </p>
                  {submission.sanity_qa_item_id && (
                    <p className="text-xs text-blue-600 mt-1 font-mono">
                      Sanity ID: {submission.sanity_qa_item_id}
                    </p>
                  )}
                  <a
                    href="/studio/structure/qaitem"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-700 underline mt-2 inline-block"
                  >
                    → Άνοιγμα Sanity Studio
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Already Published Indicator */}
        {submission.type === "question" && submission.published_to_sanity && (
          <div className="mt-4">
            <div className="bg-green-50 border border-green-200 rounded-card p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <Globe className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-900 mb-1">
                    ✓ Δημοσιεύτηκε στο Q&A
                  </p>
                  <p className="text-xs text-green-700">
                    Η ερώτηση έχει ήδη δημοσιευτεί στη σελίδα Q&A
                  </p>
                  {submission.sanity_qa_item_id && (
                    <p className="text-xs text-green-600 mt-1 font-mono">
                      Sanity ID: {submission.sanity_qa_item_id}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

