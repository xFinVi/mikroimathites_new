"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { StarRating } from "@/components/ui/star-rating";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SubmissionType = "video-idea" | "feedback" | "question";

interface FormData {
  // Common fields
  name: string;
  email: string;
  child_age_group: string;
  submission_type: SubmissionType;
  
  // Video Idea fields
  topic: string;
  message: string;
  
  // Feedback fields
  rating: number;
  feedback_message: string;
  
  // Q&A fields
  category: string;
  publish_consent: boolean;
}

export function UnifiedContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    child_age_group: "",
    submission_type: "" as SubmissionType,
    topic: "",
    message: "",
    rating: 0,
    feedback_message: "",
    category: "",
    publish_consent: false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validation
    if (!formData.submission_type) {
      setError("Παρακαλώ επιλέξτε τύπο υποβολής");
      setIsSubmitting(false);
      return;
    }

    try {
      let payload: any = {
        type: formData.submission_type,
        name: formData.name || undefined,
        email: formData.email || undefined,
        child_age_group: formData.child_age_group || undefined,
      };

      // Build payload based on submission type
      switch (formData.submission_type) {
        case "video-idea":
          if (!formData.message) {
            setError("Το μήνυμα είναι υποχρεωτικό");
            setIsSubmitting(false);
            return;
          }
          payload = {
            ...payload,
            topic: formData.topic || undefined,
            message: formData.message,
          };
          break;

        case "feedback":
          if (!formData.rating) {
            setError("Η αξιολόγηση είναι υποχρεωτική");
            setIsSubmitting(false);
            return;
          }
          if (!formData.feedback_message) {
            setError("Το feedback είναι υποχρεωτικό");
            setIsSubmitting(false);
            return;
          }
          payload = {
            ...payload,
            message: formData.feedback_message,
            rating: Number(formData.rating),
          };
          break;

        case "question":
          if (!formData.message) {
            setError("Η ερώτηση είναι υποχρεωτική");
            setIsSubmitting(false);
            return;
          }
          payload = {
            ...payload,
            topic: formData.category || undefined,
            message: formData.message,
            publish_consent: formData.publish_consent,
          };
          break;

        default:
          if (!formData.message) {
            setError("Το μήνυμα είναι υποχρεωτικό");
            setIsSubmitting(false);
            return;
          }
          payload = {
            ...payload,
            message: formData.message,
          };
      }

      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Αποτυχία αποστολής");
      }
    } catch (err: any) {
      setError(err.message || "Κάτι πήγε στραβά");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        child_age_group: "",
        submission_type: "" as SubmissionType,
        topic: "",
        message: "",
        rating: 0,
        feedback_message: "",
        category: "",
        publish_consent: false,
      });
    }, 3000);
  };

  if (isSubmitted) {
    const successMessages: Record<SubmissionType, { icon: string; title: string; message: string }> = {
      "video-idea": {
        icon: "💡",
        title: "Ευχαριστούμε!",
        message: "Η ιδέα σας έχει καταγραφεί. Θα την εξετάσουμε σύντομα!",
      },
      "feedback": {
        icon: "💬",
        title: "Ευχαριστούμε!",
        message: "Το feedback σας είναι πολύτιμο. Θα το εξετάσουμε προσεκτικά!",
      },
      "question": {
        icon: "❓",
        title: "Ευχαριστούμε!",
        message: "Η ερώτησή σας έχει καταγραφεί. Θα την εξετάσουμε και θα σας απαντήσουμε σύντομα!",
      },
    };

    const success = successMessages[formData.submission_type] || {
      icon: "✅",
      title: "Ευχαριστούμε!",
      message: "Η υποβολή σας έχει καταγραφεί!",
    };

    return (
      <div className="bg-accent-green/10 border-2 border-accent-green rounded-card p-8 text-center">
        <div className="text-5xl mb-4">{success.icon}</div>
        <h3 className="text-2xl font-bold text-text-dark mb-2">{success.title}</h3>
        <p className="text-text-medium">{success.message}</p>
      </div>
    );
  }

  const showAgeGroup = formData.submission_type !== "";
  const showTypeSpecificFields = formData.submission_type !== "";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-card border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Submission Type - Always visible first */}
      <div className="space-y-2">
        <Label htmlFor="submission-type" className="text-base font-semibold text-text-dark">
          Τι θέλετε να κάνετε; <span className="text-primary-pink">*</span>
        </Label>
        <Select
          value={formData.submission_type}
          onValueChange={(value) => setFormData({ ...formData, submission_type: value as SubmissionType })}
          required
        >
          <SelectTrigger id="submission-type" className="h-12">
            <SelectValue placeholder="Επιλέξτε τύπο υποβολής" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="video-idea">💡 Ιδέα για βίντεο</SelectItem>
            <SelectItem value="feedback">💬 Feedback / Σχόλια</SelectItem>
            <SelectItem value="question">❓ Ερώτηση (Q&A)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Name and Email - Shown for all types EXCEPT feedback (feedback has its own name/email section) */}
      {showTypeSpecificFields && formData.submission_type !== "feedback" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-semibold text-text-dark">
              Όνομα
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Το όνομά σας (προαιρετικό)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base font-semibold text-text-dark">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com (προαιρετικό)"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>
      )}

      {/* Age Group - Shown after type is selected (except for feedback) */}
      {showAgeGroup && formData.submission_type !== "feedback" && (
        <div className="space-y-2">
          <Label htmlFor="child-age" className="text-base font-semibold text-text-dark">
            Ηλικία παιδιού
          </Label>
          <Select
            value={formData.child_age_group}
            onValueChange={(value) => setFormData({ ...formData, child_age_group: value })}
          >
            <SelectTrigger id="child-age" className="h-12">
              <SelectValue placeholder="Επιλέξτε ηλικία (προαιρετικό)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-2">0-2 χρόνια</SelectItem>
              <SelectItem value="2-4">2-4 χρόνια</SelectItem>
              <SelectItem value="4-6">4-6 χρόνια</SelectItem>
              <SelectItem value="greek-abroad">Ελληνικό εξωτερικό</SelectItem>
              <SelectItem value="other">Άλλο</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Type-specific fields */}
      {showTypeSpecificFields && (
        <div className="space-y-6 pt-4 border-t border-border/50">
          {/* Video Idea Fields */}
          {formData.submission_type === "video-idea" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="topic" className="text-base font-semibold text-text-dark">
                  Θέμα
                </Label>
                <Select
                  value={formData.topic}
                  onValueChange={(value) => setFormData({ ...formData, topic: value })}
                >
                  <SelectTrigger id="topic" className="h-12">
                    <SelectValue placeholder="Επιλέξτε θέμα (προαιρετικό)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sleep">Ύπνος & Ρουτίνες</SelectItem>
                    <SelectItem value="speech">Ομιλία & Λεξιλόγιο</SelectItem>
                    <SelectItem value="food">Διατροφή & Δυσκολίες</SelectItem>
                    <SelectItem value="emotions">Συναισθήματα & Συμπεριφορά</SelectItem>
                    <SelectItem value="screens">Οθόνες & Ψηφιακή Ασφάλεια</SelectItem>
                    <SelectItem value="routines">Καθημερινές Ρουτίνες</SelectItem>
                    <SelectItem value="greek-abroad">Ελληνικό Εξωτερικό</SelectItem>
                    <SelectItem value="other">Άλλο</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-base font-semibold text-text-dark">
                  Η ιδέα σας <span className="text-primary-pink">*</span>
                </Label>
                <Textarea
                  id="message"
                  placeholder="Περιγράψτε την ιδέα σας για βίντεο..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={6}
                  className="resize-none text-base"
                />
              </div>
            </>
          )}

          {/* Feedback Fields - Simplified: Rating first, then message, then name/email */}
          {formData.submission_type === "feedback" && (
            <>
              <StarRating
                value={formData.rating}
                onChange={(value) => setFormData({ ...formData, rating: value })}
                required
                label="Αξιολόγηση"
              />
              <div className="space-y-2">
                <Label htmlFor="feedback-message" className="text-base font-semibold text-text-dark">
                  Το feedback σας <span className="text-primary-pink">*</span>
                </Label>
                <Textarea
                  id="feedback-message"
                  placeholder="Πείτε μας τη γνώμη σας..."
                  value={formData.feedback_message}
                  onChange={(e) => setFormData({ ...formData, feedback_message: e.target.value })}
                  required
                  rows={6}
                  className="resize-none text-base"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-semibold text-text-dark">
                    Όνομα
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Το όνομά σας (προαιρετικό)"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-semibold text-text-dark">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com (προαιρετικό)"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}

          {/* Question (Q&A) Fields */}
          {formData.submission_type === "question" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-base font-semibold text-text-dark">
                  Κατηγορία
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="category" className="h-12">
                    <SelectValue placeholder="Επιλέξτε κατηγορία (προαιρετικό)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sleep">Ύπνος & Ρουτίνες</SelectItem>
                    <SelectItem value="speech">Ομιλία & Λεξιλόγιο</SelectItem>
                    <SelectItem value="food">Διατροφή & Δυσκολίες</SelectItem>
                    <SelectItem value="emotions">Συναισθήματα & Συμπεριφορά</SelectItem>
                    <SelectItem value="screens">Οθόνες & Ψηφιακή Ασφάλεια</SelectItem>
                    <SelectItem value="routines">Καθημερινές Ρουτίνες</SelectItem>
                    <SelectItem value="greek-abroad">Ελληνικό Εξωτερικό</SelectItem>
                    <SelectItem value="other">Άλλο</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-base font-semibold text-text-dark">
                  Η ερώτησή σας <span className="text-primary-pink">*</span>
                </Label>
                <Textarea
                  id="message"
                  placeholder="Γράψτε την ερώτησή σας εδώ..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={6}
                  className="resize-none text-base"
                />
              </div>
              <div className="flex items-start gap-3 p-4 bg-background-light rounded-card border border-border/50">
                <Checkbox
                  id="publish-consent"
                  checked={formData.publish_consent}
                  onCheckedChange={(checked) => setFormData({ ...formData, publish_consent: checked === true })}
                />
                <Label
                  htmlFor="publish-consent"
                  className="text-sm text-text-medium leading-relaxed cursor-pointer"
                >
                  Συμφωνώ να δημοσιευτεί η ερώτησή μου (μετά από έγκριση) χωρίς προσωπικά στοιχεία
                </Label>
              </div>
              <div className="p-4 bg-secondary-blue/10 rounded-card border border-secondary-blue/30">
                <p className="text-sm text-text-medium">
                  <strong className="text-text-dark">Σημείωση:</strong> Δεν παρέχουμε ιατρικές διαγνώσεις. 
                  Για σοβαρές ανησυχίες, συμβουλευτείτε πάντα έναν επαγγελματία υγείας.
                </p>
              </div>
            </>
          )}

        </div>
      )}

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || !formData.submission_type}
          className="w-full sm:w-auto bg-primary-pink hover:bg-primary-pink/90 text-white text-lg px-8 py-6 rounded-button shadow-lg hover:shadow-xl transition-all"
        >
          {isSubmitting ? "Αποστολή..." : "Στείλτε"}
        </Button>
      </div>
    </form>
  );
}

