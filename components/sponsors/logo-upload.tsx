"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoUploadProps {
  onUploadComplete: (data: {
    assetId: string;
    url: string;
    fileName: string;
    mimeType: string;
    fileSize: number;
  }) => void;
  onError: (error: string) => void;
  currentLogo?: {
    url: string;
    fileName: string;
  } | null;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];

export function LogoUpload({
  onUploadComplete,
  onError,
  currentLogo,
}: LogoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      onError("Μη έγκυρος τύπος αρχείου. Επιτρέπονται μόνο PNG, JPG, SVG.");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      onError("Το αρχείο είναι πολύ μεγάλο. Μέγιστο μέγεθος: 5MB.");
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    onError(""); // Clear previous errors

    try {
      // Upload directly to Sanity via API
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("/api/sponsors/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}));
        
        // Provide user-friendly error messages
        let errorMessage = errorData.error || "Failed to upload file";
        
        if (errorData.code === "MISSING_TOKEN") {
          errorMessage = "Server configuration error. Please contact support.";
        } else if (uploadResponse.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
        
        throw new Error(errorMessage);
      }

      const { assetId, url } = await uploadResponse.json();

      // Update preview to use the uploaded URL (so it persists across steps)
      if (url) {
        setPreview(url);
      }

      // Notify parent component
      onUploadComplete({
        assetId,
        url,
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Upload failed";
      onError(message);
      setSelectedFile(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onError("");
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="logo-upload">Λογότυπο *</Label>
      <div className="space-y-3">
        {/* File Input */}
        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            id="logo-upload"
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/svg+xml"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="hidden"
          />
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            variant="outline"
            className="flex-shrink-0"
          >
            {isUploading ? "Ανέβασμα..." : "Επιλέξτε αρχείο"}
          </Button>
          <p className="text-sm text-text-medium">
            PNG, JPG, SVG (μέχρι 5MB)
          </p>
        </div>

        {/* Preview */}
        {(preview || currentLogo) && (
          <div className="relative w-full max-w-xs h-48 border-2 border-dashed border-border rounded-lg overflow-hidden bg-background-light">
            {preview ? (
              <Image
                src={preview}
                alt="Logo preview"
                fill
                className="object-contain p-4"
                unoptimized={preview.startsWith('http') && !preview.includes('cdn.sanity.io')}
              />
            ) : currentLogo?.url ? (
              <Image
                src={currentLogo.url}
                alt="Logo preview"
                fill
                className="object-contain p-4"
                unoptimized={currentLogo.url.startsWith('http') && !currentLogo.url.includes('cdn.sanity.io')}
              />
            ) : currentLogo ? (
              <div className="w-full h-full flex items-center justify-center p-4">
                <p className="text-sm text-text-medium text-center">
                  {currentLogo.fileName}
                </p>
              </div>
            ) : null}
            {preview && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                aria-label="Remove logo"
              >
                ×
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

