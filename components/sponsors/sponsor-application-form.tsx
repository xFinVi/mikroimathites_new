"use client";

import { useState, useEffect } from "react";
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
import { LogoUpload } from "./logo-upload";
import { SuccessMessage } from "@/components/forms/success-message";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FormData {
  // Step 1: Company Information
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  website: string;

  // Step 2: Sponsor Details
  category: string;
  sponsor_type: string;
  description: string;
  tagline: string;

  // Step 3: Logo (Sanity asset)
  logo_asset_id: string; // Sanity asset ID
  logo_url: string; // Sanity CDN URL
  logo_file_name: string;
  logo_mime_type: string;
  logo_file_size: number;
}

const STEPS = [
  { id: 1, title: "Στοιχεία εταιρείας" },
  { id: 2, title: "Λεπτομέρειες χορηγίας" },
  { id: 3, title: "Λογότυπο" },
  { id: 4, title: "Επιβεβαίωση" },
];

export function SponsorApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>({
    company_name: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    website: "",
    category: "",
    sponsor_type: "",
    description: "",
    tagline: "",
    logo_asset_id: "",
    logo_url: "",
    logo_file_name: "",
    logo_mime_type: "",
    logo_file_size: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Save form data to localStorage for persistence
  const saveToLocalStorage = (data: Partial<FormData>) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sponsor_application", JSON.stringify(data));
    }
  };

  // Load form data from localStorage
  const loadFromLocalStorage = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sponsor_application");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setFormData(parsed);
        } catch {
          // Ignore parse errors
        }
      }
    }
  };

  // Load on mount
  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  const updateFormData = (updates: Partial<FormData>) => {
    const newData = { ...formData, ...updates };
    setFormData(newData);
    saveToLocalStorage(newData);
  };

  const validateStep = (step: number): boolean => {
    setError(null);

    switch (step) {
      case 1:
        if (!formData.company_name?.trim()) {
          setError("Το όνομα εταιρείας είναι υποχρεωτικό");
          return false;
        }
        if (!formData.contact_name?.trim()) {
          setError("Το όνομα επικοινωνίας είναι υποχρεωτικό");
          return false;
        }
        if (!formData.contact_email?.trim()) {
          setError("Το email είναι υποχρεωτικό");
          return false;
        }
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.contact_email)) {
          setError("Μη έγκυρο email");
          return false;
        }
        // URL validation (if provided)
        if (formData.website && formData.website.trim()) {
          try {
            new URL(formData.website);
          } catch {
            setError("Μη έγκυρη διεύθυνση ιστοσελίδας");
            return false;
          }
        }
        return true;

      case 2:
        // Step 2 is optional, no validation needed
        return true;

      case 3:
        if (!formData.logo_asset_id) {
          setError("Το λογότυπο είναι υποχρεωτικό");
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      setCurrentStep(3);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/sponsors/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: formData.company_name,
          contact_name: formData.contact_name,
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone || undefined,
          website: formData.website || undefined,
          category: formData.category || undefined,
          sponsor_type: formData.sponsor_type || undefined,
          description: formData.description || undefined,
          tagline: formData.tagline || undefined,
          logo_asset_id: formData.logo_asset_id,
          logo_url: formData.logo_url,
          logo_file_name: formData.logo_file_name,
          logo_mime_type: formData.logo_mime_type,
          logo_file_size: formData.logo_file_size,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Handle missing database table (migrations not run)
        if (errorData.code === "MISSING_TABLE" || response.status === 503) {
          const errorMsg = "Η βάση δεδομένων δεν έχει ρυθμιστεί. Παρακαλώ επικοινωνήστε με την υποστήριξη.";
          setError(errorMsg);
          toast.error("Σφάλμα συστήματος", {
            description: errorMsg,
          });
          setIsSubmitting(false);
          return;
        }
        
        // Handle rate limiting
        if (response.status === 429) {
          const retryAfter = errorData.retryAfter || 3600;
          const errorMsg = `${errorData.error || "Πολλά αιτήματα. Παρακαλώ δοκιμάστε ξανά αργότερα."}`;
          setError(errorMsg);
          toast.error("Πολλά αιτήματα", {
            description: errorMsg,
          });
        } else {
          const errorMsg = errorData.error || "Αποτυχία υποβολής αίτησης";
          setError(errorMsg);
          toast.error("Αποτυχία υποβολής", {
            description: errorMsg,
          });
        }
        setIsSubmitting(false);
        return;
      }

      // Clear localStorage on success
      if (typeof window !== "undefined") {
        localStorage.removeItem("sponsor_application");
      }

      toast.success("Επιτυχία! 🎉", {
        description: "Η αίτησή σας έχει υποβληθεί επιτυχώς. Θα την εξετάσουμε και θα σας ενημερώσουμε σύντομα.",
      });

      setIsSubmitted(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Αποτυχία υποβολής";
      setError(message);
      toast.error("Αποτυχία υποβολής", {
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <SuccessMessage
        title="Ευχαριστούμε!"
        message="Η αίτησή σας έχει υποβληθεί επιτυχώς. Θα την εξετάσουμε και θα σας ενημερώσουμε σύντομα."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors",
                  currentStep > step.id
                    ? "bg-primary-pink text-white"
                    : currentStep === step.id
                    ? "bg-primary-pink text-white ring-4 ring-primary-pink/20"
                    : "bg-background-light text-text-medium"
                )}
              >
                {currentStep > step.id ? "✓" : step.id}
              </div>
              <span
                className={cn(
                  "text-xs mt-2 text-center",
                  currentStep >= step.id
                    ? "text-text-dark font-medium"
                    : "text-text-medium"
                )}
              >
                {step.title}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-1 flex-1 mx-2 transition-colors",
                  currentStep > step.id
                    ? "bg-primary-pink"
                    : "bg-background-light"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Step 1: Company Information */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-text-dark">
            Στοιχεία εταιρείας
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="company_name">
                Όνομα εταιρείας / Οργανισμού *
              </Label>
              <Input
                id="company_name"
                value={formData.company_name || ""}
                onChange={(e) =>
                  updateFormData({ company_name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="contact_name">Όνομα επικοινωνίας *</Label>
              <Input
                id="contact_name"
                value={formData.contact_name || ""}
                onChange={(e) =>
                  updateFormData({ contact_name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="contact_email">Email *</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email || ""}
                onChange={(e) =>
                  updateFormData({ contact_email: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="contact_phone">Τηλέφωνο</Label>
              <Input
                id="contact_phone"
                type="tel"
                value={formData.contact_phone || ""}
                onChange={(e) =>
                  updateFormData({ contact_phone: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="website">Ιστοσελίδα</Label>
              <Input
                id="website"
                type="url"
                value={formData.website || ""}
                onChange={(e) => updateFormData({ website: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Sponsor Details */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-text-dark">
            Λεπτομέρειες χορηγίας
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="category">Κατηγορία</Label>
              <Select
                value={formData.category || ""}
                onValueChange={(value) => updateFormData({ category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Επιλέξτε κατηγορία" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="education">Εκπαίδευση</SelectItem>
                  <SelectItem value="health">Υγεία</SelectItem>
                  <SelectItem value="local">Τοπικό</SelectItem>
                  <SelectItem value="tech">Τεχνολογία</SelectItem>
                  <SelectItem value="other">Άλλο</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sponsor_type">Τύπος</Label>
              <Select
                value={formData.sponsor_type || ""}
                onValueChange={(value) =>
                  updateFormData({ sponsor_type: value })
                }
              >
                <SelectTrigger id="sponsor_type">
                  <SelectValue placeholder="Επιλέξτε τύπο" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business">Επιχείρηση</SelectItem>
                  <SelectItem value="individual">Άτομο</SelectItem>
                  <SelectItem value="organization">Οργανισμός</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Περιγραφή</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) =>
                  updateFormData({ description: e.target.value })
                }
                rows={4}
                placeholder="Περιγράψτε την εταιρεία/οργανισμό σας..."
              />
            </div>
            <div>
              <Label htmlFor="tagline">Σύνθημα / Tagline</Label>
              <Input
                id="tagline"
                value={formData.tagline || ""}
                onChange={(e) => updateFormData({ tagline: e.target.value })}
                placeholder="Σύντομο σύνθημα..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Logo Upload */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-text-dark">Λογότυπο</h3>
          {uploadError && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {uploadError}
            </div>
          )}
          <LogoUpload
            onUploadComplete={(data) => {
              updateFormData({
                logo_asset_id: data.assetId,
                logo_url: data.url,
                logo_file_name: data.fileName,
                logo_mime_type: data.mimeType,
                logo_file_size: data.fileSize,
              });
              setUploadError(null);
            }}
            onError={(error) => setUploadError(error)}
            currentLogo={
              formData.logo_url
                ? {
                    url: formData.logo_url,
                    fileName: formData.logo_file_name || "logo",
                  }
                : null
            }
          />
        </div>
      )}

      {/* Step 4: Review */}
      {currentStep === 4 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-text-dark">Επιβεβαίωση</h3>
          <div className="bg-background-light rounded-lg p-6 space-y-4">
            <div>
              <h4 className="font-semibold text-text-dark mb-2">
                Στοιχεία εταιρείας
              </h4>
              <div className="space-y-1 text-text-medium">
                <p>
                  <strong>Εταιρεία:</strong> {formData.company_name}
                </p>
                <p>
                  <strong>Επικοινωνία:</strong> {formData.contact_name}
                </p>
                <p>
                  <strong>Email:</strong> {formData.contact_email}
                </p>
                {formData.contact_phone && (
                  <p>
                    <strong>Τηλέφωνο:</strong> {formData.contact_phone}
                  </p>
                )}
                {formData.website && (
                  <p>
                    <strong>Ιστοσελίδα:</strong> {formData.website}
                  </p>
                )}
              </div>
            </div>
            {(formData.category || formData.sponsor_type || formData.description || formData.tagline) && (
              <div>
                <h4 className="font-semibold text-text-dark mb-2">
                  Λεπτομέρειες
                </h4>
                <div className="space-y-1 text-text-medium">
                  {formData.category && (
                    <p>
                      <strong>Κατηγορία:</strong> {formData.category}
                    </p>
                  )}
                  {formData.sponsor_type && (
                    <p>
                      <strong>Τύπος:</strong> {formData.sponsor_type}
                    </p>
                  )}
                  {formData.tagline && (
                    <p>
                      <strong>Tagline:</strong> {formData.tagline}
                    </p>
                  )}
                  {formData.description && (
                    <p>
                      <strong>Περιγραφή:</strong> {formData.description}
                    </p>
                  )}
                </div>
              </div>
            )}
            {formData.logo_url && (
              <div>
                <h4 className="font-semibold text-text-dark mb-2">
                  Λογότυπο
                </h4>
                <div className="mt-2">
                  <img 
                    src={formData.logo_url} 
                    alt="Logo preview" 
                    className="max-w-xs max-h-32 object-contain"
                  />
                  <p className="text-text-medium mt-2">
                    {formData.logo_file_name || "Ανεβασμένο"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1 || isSubmitting}
        >
          Πίσω
        </Button>
        {currentStep < STEPS.length ? (
          <Button type="button" onClick={handleNext} disabled={isSubmitting}>
            Επόμενο
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Υποβολή..." : "Υποβολή αίτησης"}
          </Button>
        )}
      </div>
    </div>
  );
}

