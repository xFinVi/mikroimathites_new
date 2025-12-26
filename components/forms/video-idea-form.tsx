"use client";

import { useState } from "react";
import { SuccessMessage } from "./success-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VideoIdeaFormData {
  name: string;
  email: string;
  child_age_group: string;
  topic: string;
  message: string;
}

export function VideoIdeaForm() {
  const [formData, setFormData] = useState<VideoIdeaFormData>({
    name: "",
    email: "",
    child_age_group: "",
    topic: "",
    message: "",
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
        type: "video-idea" as const,
        name: formData.name || undefined,
        email: formData.email || undefined,
        child_age_group: formData.child_age_group || undefined,
        topic: formData.topic || undefined,
        message: formData.message,
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
        child_age_group: "",
        topic: "",
        message: "",
      });
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <SuccessMessage
        title="Ευχαριστούμε!"
        message="Η ιδέα σας έχει καταγραφεί. Θα την εξετάσουμε σύντομα!"
      />
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
            placeholder="email@example.com (προαιρετικό)"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      </div>

      {/* Child's Age */}
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
            <SelectItem value="0-2">0-2 χρόνων</SelectItem>
            <SelectItem value="2-4">2-4 χρόνων</SelectItem>
            <SelectItem value="4-6">4-6 χρόνων</SelectItem>
            <SelectItem value="other">Άλλο</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Topic */}
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
            <SelectItem value="other">Άλλο</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Message */}
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

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || !formData.message}
          className="w-full sm:w-auto bg-primary-pink hover:bg-primary-pink/90 text-white text-lg px-8 py-6 rounded-button shadow-lg hover:shadow-xl transition-all"
        >
          {isSubmitting ? "Αποστολή..." : "Στείλτε την ιδέα"}
        </Button>
      </div>
    </form>
  );
}

