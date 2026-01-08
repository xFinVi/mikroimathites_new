"use client";

import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

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
}

interface SponsorEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sponsor: Sponsor | null;
  onConfirm: (updates: Partial<Sponsor>) => void | Promise<void>;
  isLoading?: boolean;
}

export function SponsorEditDialog({
  open,
  onOpenChange,
  sponsor,
  onConfirm,
  isLoading = false,
}: SponsorEditDialogProps) {
  const [formData, setFormData] = useState({
    company_name: "",
    contact_email: "",
    website: "",
    category: "",
    sponsor_type: "",
    tier: "standard" as "premium" | "standard" | "community",
  });

  // Update form data when sponsor changes
  useEffect(() => {
    if (sponsor) {
      setFormData({
        company_name: sponsor.company_name || "",
        contact_email: sponsor.contact_email || "",
        website: sponsor.website || "",
        category: sponsor.category || "",
        sponsor_type: sponsor.sponsor_type || "",
        tier: sponsor.tier || "standard",
      });
    }
  }, [sponsor]);

  const handleConfirm = async () => {
    const updates: Partial<Sponsor> = {
      company_name: formData.company_name.trim(),
      contact_email: formData.contact_email.trim(),
      website: formData.website.trim() || null,
      category: formData.category || null,
      sponsor_type: formData.sponsor_type || null,
      tier: formData.tier,
    };
    await onConfirm(updates);
  };

  const handleCancel = () => {
    if (sponsor) {
      setFormData({
        company_name: sponsor.company_name || "",
        contact_email: sponsor.contact_email || "",
        website: sponsor.website || "",
        category: sponsor.category || "",
        sponsor_type: sponsor.sponsor_type || "",
        tier: sponsor.tier || "standard",
      });
    }
    onOpenChange(false);
  };

  if (!sponsor) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-2 border-gray-200 shadow-2xl max-w-2xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-gray-900">
            ✏️ Επεξεργασία Χορηγού
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-gray-700 mt-2">
            Επεξεργαστείτε τις πληροφορίες του χορηγού "{sponsor.company_name}"
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4 space-y-4">
          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="company_name" className="text-sm font-medium text-gray-700">
              Όνομα Εταιρείας *
            </Label>
            <Input
              id="company_name"
              type="text"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              placeholder="Όνομα εταιρείας"
              required
            />
          </div>

          {/* Contact Email */}
          <div className="space-y-2">
            <Label htmlFor="contact_email" className="text-sm font-medium text-gray-700">
              Email *
            </Label>
            <Input
              id="contact_email"
              type="email"
              value={formData.contact_email}
              onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              placeholder="email@example.com"
              required
            />
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website" className="text-sm font-medium text-gray-700">
              Website
            </Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://example.com"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium text-gray-700">
              Κατηγορία
            </Label>
            <Select
              value={formData.category || "none"}
              onValueChange={(value) => setFormData({ ...formData, category: value === "none" ? "" : value })}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Επιλέξτε κατηγορία" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Καμία</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="local">Local</SelectItem>
                <SelectItem value="tech">Tech</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sponsor Type */}
          <div className="space-y-2">
            <Label htmlFor="sponsor_type" className="text-sm font-medium text-gray-700">
              Τύπος Χορηγού
            </Label>
            <Select
              value={formData.sponsor_type || "none"}
              onValueChange={(value) => setFormData({ ...formData, sponsor_type: value === "none" ? "" : value })}
            >
              <SelectTrigger id="sponsor_type">
                <SelectValue placeholder="Επιλέξτε τύπο" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Καμία</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="organization">Organization</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tier */}
          <div className="space-y-2">
            <Label htmlFor="tier" className="text-sm font-medium text-gray-700">
              Tier *
            </Label>
            <Select
              value={formData.tier}
              onValueChange={(value: "premium" | "standard" | "community") =>
                setFormData({ ...formData, tier: value })
              }
            >
              <SelectTrigger id="tier">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="community">Community</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel
            onClick={handleCancel}
            disabled={isLoading}
            className="border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold"
          >
            Ακύρωση
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading || !formData.company_name.trim() || !formData.contact_email.trim()}
            className="bg-gradient-to-r from-primary-pink to-pink-500 hover:from-primary-pink/90 hover:to-pink-600 text-white font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Αποθήκευση...
              </>
            ) : (
              "💾 Αποθήκευση"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

