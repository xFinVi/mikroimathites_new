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

interface FeedbackFormData {
  name: string;
  email: string;
  what_liked: string;
  what_improve: string;
  rating: string;
}

export function FeedbackFormTab() {
  const [formData, setFormData] = useState<FeedbackFormData>({
    name: "",
    email: "",
    what_liked: "",
    what_improve: "",
    rating: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Combine what_liked and what_improve into message
      const message = `Τι μου άρεσε:\n${formData.what_liked}\n\nΤι θα βελτιώσω:\n${formData.what_improve}`;

      const payload = {
        type: "feedback" as const,
        name: formData.name || undefined,
        email: formData.email || undefined,
        message,
        rating: formData.rating ? Number(formData.rating) : undefined,
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
        what_liked: "",
        what_improve: "",
        rating: "",
      });
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <SuccessMessage
        title="Ευχαριστούμε!"
        message="Το feedback σας είναι πολύτιμο. Θα το εξετάσουμε προσεκτικά!"
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

      {/* What did you like */}
      <div className="space-y-2">
        <Label htmlFor="what-liked" className="text-base font-semibold text-text-dark">
          Τι σας άρεσε;
        </Label>
        <Textarea
          id="what-liked"
          placeholder="Πείτε μας τι σας άρεσε..."
          value={formData.what_liked}
          onChange={(e) => setFormData({ ...formData, what_liked: e.target.value })}
          rows={4}
          className="resize-none text-base"
        />
      </div>

      {/* What should we improve */}
      <div className="space-y-2">
        <Label htmlFor="what-improve" className="text-base font-semibold text-text-dark">
          Τι θα βελτιώσουμε;
        </Label>
        <Textarea
          id="what-improve"
          placeholder="Πείτε μας τι θα θέλατε να βελτιώσουμε..."
          value={formData.what_improve}
          onChange={(e) => setFormData({ ...formData, what_improve: e.target.value })}
          rows={4}
          className="resize-none text-base"
        />
      </div>

      {/* Rating */}
      <div className="space-y-2">
        <Label htmlFor="rating" className="text-base font-semibold text-text-dark">
          Αξιολόγηση (προαιρετικό)
        </Label>
        <Select
          value={formData.rating}
          onValueChange={(value) => setFormData({ ...formData, rating: value })}
        >
          <SelectTrigger id="rating" className="h-12">
            <SelectValue placeholder="Επιλέξτε αξιολόγηση" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">⭐⭐⭐⭐⭐ Εξαιρετικά</SelectItem>
            <SelectItem value="4">⭐⭐⭐⭐ Πολύ καλά</SelectItem>
            <SelectItem value="3">⭐⭐⭐ Καλά</SelectItem>
            <SelectItem value="2">⭐⭐ Μέτρια</SelectItem>
            <SelectItem value="1">⭐ Χαμηλή</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || (!formData.what_liked && !formData.what_improve)}
          className="w-full sm:w-auto bg-primary-pink hover:bg-primary-pink/90 text-white text-lg px-8 py-6 rounded-button shadow-lg hover:shadow-xl transition-all"
        >
          {isSubmitting ? "Αποστολή..." : "Στείλτε το feedback"}
        </Button>
      </div>
    </form>
  );
}

