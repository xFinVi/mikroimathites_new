"use client";

import { useState } from "react";
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
  type: string;
  rating?: string;
  message: string;
  name: string;
  email: string;
}

export function FeedbackForm() {
  const [formData, setFormData] = useState<FeedbackFormData>({
    type: "",
    rating: "",
    message: "",
    name: "",
    email: "",
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
        type: formData.type,
        message: formData.message,
        name: formData.name,
        email: formData.email,
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
        type: "",
        rating: "",
        message: "",
        name: "",
        email: "",
      });
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <div className="bg-accent-green/10 border-2 border-accent-green rounded-card p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-2xl font-bold text-text-dark mb-2">
          Ευχαριστούμε!
        </h3>
        <p className="text-text-medium">
          Η γνώμη σας είναι πολύτιμη για εμάς. Θα την εξετάσουμε σύντομα!
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

      {/* Feedback Type */}
      <div className="space-y-2">
        <Label htmlFor="feedback-type" className="text-base font-semibold text-text-dark">
          Τι θέλετε να μας πείτε; <span className="text-primary-pink">*</span>
        </Label>
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value })}
          required
        >
          <SelectTrigger id="feedback-type" className="h-12">
            <SelectValue placeholder="Επιλέξτε τύπο μηνύματος" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="video-idea">💡 Ιδέα για βίντεο</SelectItem>
            <SelectItem value="feedback">💬 Feedback / Σχόλια</SelectItem>
            <SelectItem value="rating">⭐ Αξιολόγηση</SelectItem>
            <SelectItem value="question">❓ Ερώτηση</SelectItem>
            <SelectItem value="suggestion">💭 Πρόταση βελτίωσης</SelectItem>
            <SelectItem value="other">📝 Άλλο</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Rating (only show if type is rating) */}
      {formData.type === "rating" && (
        <div className="space-y-2">
          <Label htmlFor="rating" className="text-base font-semibold text-text-dark">
            Αξιολόγηση <span className="text-primary-pink">*</span>
          </Label>
          <Select
            value={formData.rating}
            onValueChange={(value) => setFormData({ ...formData, rating: value })}
            required
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
      )}

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message" className="text-base font-semibold text-text-dark">
          Το μήνυμά σας <span className="text-primary-pink">*</span>
        </Label>
        <Textarea
          id="message"
          placeholder="Γράψτε εδώ ό,τι θέλετε να μας πείτε..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          rows={6}
          className="resize-none text-base"
        />
      </div>

      {/* Name and Email - Required */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-base font-semibold text-text-dark">
            Όνομα <span className="text-primary-pink">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Το όνομά σας"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-base font-semibold text-text-dark">
            Email <span className="text-primary-pink">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="email@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || !formData.type || !formData.message || !formData.name || !formData.email}
          className="w-full sm:w-auto bg-primary-pink hover:bg-primary-pink/90 text-white text-lg px-8 py-6 rounded-button shadow-lg hover:shadow-xl transition-all"
        >
          {isSubmitting ? "Αποστολή..." : "Στείλτε το μήνυμα"}
        </Button>
      </div>
    </form>
  );
}

