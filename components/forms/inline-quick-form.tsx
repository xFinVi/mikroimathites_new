"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InlineQuickFormProps {
  defaultType?: "video-idea" | "question";
  sourcePage?: string;
}

export function InlineQuickForm({ defaultType = "question", sourcePage }: InlineQuickFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    child_age_group: "",
    type: defaultType as "video-idea" | "question",
    topic: "",
    message: "",
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
    if (!formData.message || formData.message.trim().length < 10) {
      setError("Παρακαλώ εισάγετε ένα μήνυμα (τουλάχιστον 10 χαρακτήρες)");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload: any = {
        type: formData.type,
        message: formData.message,
        name: formData.name || undefined,
        email: formData.email || undefined,
        child_age_group: formData.child_age_group || undefined,
        topic: formData.topic || undefined,
        source_page: sourcePage || window.location.href,
      };

      if (formData.type === "question") {
        payload.publish_consent = formData.publish_consent;
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

      setIsSubmitted(true);
      setIsSubmitting(false);

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          email: "",
          child_age_group: "",
          type: defaultType,
          topic: "",
          message: "",
          publish_consent: false,
        });
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Κάτι πήγε στραβά");
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-accent-green/10 border-2 border-accent-green rounded-card p-6 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="text-lg font-bold text-text-dark mb-2">
          Επιτυχία!
        </h3>
        <p className="text-text-medium text-sm">
          {formData.type === "question"
            ? "Ευχαριστούμε για την ερώτηση! Θα λάβετε απάντηση σύντομα."
            : "Ευχαριστούμε για την ιδέα! Θα την εξετάσουμε σύντομα."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-card border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Type Selection */}
      <div className="space-y-2">
        <Label htmlFor="type" className="text-sm font-semibold text-text-dark">
          Τι θέλετε να μας πείτε;
        </Label>
        <Select
          value={formData.type}
          onValueChange={(value: "video-idea" | "question") =>
            setFormData({ ...formData, type: value })
          }
        >
          <SelectTrigger id="type" className="h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="question">❓ Ερώτηση</SelectItem>
            <SelectItem value="video-idea">💡 Ιδέα για βίντεο</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Name and Email - Optional */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-semibold text-text-dark">
            Όνομα (προαιρετικό)
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Το όνομά σας"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold text-text-dark">
            Email (προαιρετικό)
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="email@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="h-10"
          />
        </div>
      </div>

      {/* Age Group - Optional */}
      <div className="space-y-2">
        <Label htmlFor="age-group" className="text-sm font-semibold text-text-dark">
          Ηλικιακή ομάδα (προαιρετικό)
        </Label>
        <Select
          value={formData.child_age_group}
          onValueChange={(value) => setFormData({ ...formData, child_age_group: value })}
        >
          <SelectTrigger id="age-group" className="h-10">
            <SelectValue placeholder="Επιλέξτε ηλικιακή ομάδα" />
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

      {/* Topic - Optional */}
      <div className="space-y-2">
        <Label htmlFor="topic" className="text-sm font-semibold text-text-dark">
          Θέμα (προαιρετικό)
        </Label>
        <Select
          value={formData.topic}
          onValueChange={(value) => setFormData({ ...formData, topic: value })}
        >
          <SelectTrigger id="topic" className="h-10">
            <SelectValue placeholder="Επιλέξτε θέμα" />
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

      {/* Message - Required */}
      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-semibold text-text-dark">
          {formData.type === "question" ? "Η ερώτησή σας" : "Η ιδέα σας"} <span className="text-primary-pink">*</span>
        </Label>
        <Textarea
          id="message"
          placeholder={
            formData.type === "question"
              ? "Γράψτε την ερώτησή σας εδώ..."
              : "Περιγράψτε την ιδέα σας για βίντεο..."
          }
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          rows={4}
          className="resize-none text-sm"
        />
      </div>

      {/* Publish Consent - Only for questions */}
      {formData.type === "question" && (
        <div className="flex items-start gap-3 p-3 bg-background-light rounded-card border border-border/50">
          <Checkbox
            id="publish-consent"
            checked={formData.publish_consent}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, publish_consent: checked === true })
            }
          />
          <Label htmlFor="publish-consent" className="text-xs text-text-medium cursor-pointer">
            Συμφωνώ να δημοσιευτεί η ερώτησή μου (αν εγκριθεί και χωρίς προσωπικά στοιχεία).
          </Label>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting || !formData.message || formData.message.trim().length < 10}
        className="w-full bg-primary-pink hover:bg-primary-pink/90 text-white"
      >
        {isSubmitting ? "Αποστολή..." : "Στείλτε το μήνυμα"}
      </Button>
    </form>
  );
}


