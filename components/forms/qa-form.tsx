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

interface QAFormData {
  name: string;
  email: string;
  category: string;
  question: string;
  publish_consent: boolean;
}

export function QAForm() {
  const [formData, setFormData] = useState<QAFormData>({
    name: "",
    email: "",
    category: "",
    question: "",
    publish_consent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        type: "question" as const,
        name: formData.name || undefined,
        email: formData.email || undefined,
        topic: formData.category || undefined,
        message: formData.question,
        publish_consent: formData.publish_consent,
      };

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
        category: "",
        question: "",
        publish_consent: false,
      });
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <div className="bg-accent-green/10 border-2 border-accent-green rounded-card p-8 text-center">
        <div className="text-5xl mb-4">❓</div>
        <h3 className="text-2xl font-bold text-text-dark mb-2">
          Ευχαριστούμε!
        </h3>
        <p className="text-text-medium">
          Η ερώτησή σας έχει καταγραφεί. Θα την εξετάσουμε και θα σας απαντήσουμε σύντομα!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-card border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Name and Email */}
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
            placeholder="email@example.com (για ειδοποίηση)"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <p className="text-xs text-text-light">Θα σας ειδοποιήσουμε όταν απαντήσουμε</p>
        </div>
      </div>

      {/* Category */}
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
            <SelectItem value="other">Άλλο</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Question */}
      <div className="space-y-2">
        <Label htmlFor="question" className="text-base font-semibold text-text-dark">
          Η ερώτησή σας <span className="text-primary-pink">*</span>
        </Label>
        <Textarea
          id="question"
          placeholder="Γράψτε την ερώτησή σας εδώ..."
          value={formData.question}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          required
          rows={6}
          className="resize-none text-base"
        />
      </div>

      {/* Publish Consent */}
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

      {/* Safety Note */}
      <div className="p-4 bg-secondary-blue/10 rounded-card border border-secondary-blue/30">
        <p className="text-sm text-text-medium">
          <strong className="text-text-dark">Σημείωση:</strong> Δεν παρέχουμε ιατρικές διαγνώσεις. 
          Για σοβαρές ανησυχίες, συμβουλευτείτε πάντα έναν επαγγελματία υγείας.
        </p>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || !formData.question}
          className="w-full sm:w-auto bg-primary-pink hover:bg-primary-pink/90 text-white text-lg px-8 py-6 rounded-button shadow-lg hover:shadow-xl transition-all"
        >
          {isSubmitting ? "Αποστολή..." : "Στείλτε την ερώτηση"}
        </Button>
      </div>
    </form>
  );
}

