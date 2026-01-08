"use client";

import { useState } from "react";
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
import { Loader2 } from "lucide-react";

interface InputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  label: string;
  placeholder?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: (value: string) => void | Promise<void>;
  isLoading?: boolean;
  defaultValue?: string;
}

export function InputDialog({
  open,
  onOpenChange,
  title,
  description,
  label,
  placeholder,
  confirmLabel = "Επιβεβαίωση",
  cancelLabel = "Ακύρωση",
  onConfirm,
  isLoading = false,
  defaultValue = "",
}: InputDialogProps) {
  const [value, setValue] = useState(defaultValue);

  const handleConfirm = async () => {
    await onConfirm(value);
    setValue(defaultValue); // Reset on confirm
  };

  const handleCancel = () => {
    setValue(defaultValue); // Reset on cancel
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-2 border-gray-200 shadow-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-gray-900">
            {title}
          </AlertDialogTitle>
          {description && (
            <AlertDialogDescription className="text-base text-gray-700 mt-2">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <div className="py-4">
          <Label htmlFor="input-dialog-field" className="text-sm font-medium text-gray-700">
            {label}
          </Label>
          <Input
            id="input-dialog-field"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="mt-2"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isLoading && value.trim()) {
                handleConfirm();
              }
            }}
          />
        </div>
        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel 
            onClick={handleCancel}
            disabled={isLoading}
            className="border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold"
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading || !value.trim()}
            className="bg-gradient-to-r from-primary-pink to-pink-500 hover:from-primary-pink/90 hover:to-pink-600 text-white font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Επεξεργασία...
              </>
            ) : (
              confirmLabel
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

