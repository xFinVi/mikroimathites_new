"use client";

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
import { Loader2 } from "lucide-react";

export type ConfirmationAction = "approve" | "reject" | "delete" | "activate" | "deactivate" | "feature" | "unfeature" | "custom";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: ConfirmationAction;
  title?: string;
  description?: string;
  customTitle?: string;
  customDescription?: string;
  customConfirmLabel?: string;
  customCancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
  variant?: "default" | "destructive";
}

const actionConfig: Record<ConfirmationAction, {
  title: string;
  description: string;
  confirmLabel: string;
  variant: "default" | "destructive";
  emoji: string;
  colorClass: string;
}> = {
  approve: {
    title: "🎉 Επιβεβαίωση Έγκρισης",
    description: "Είστε σίγουροι ότι θέλετε να εγκρίνετε αυτή την αίτηση;",
    confirmLabel: "✅ Έγκριση",
    variant: "default",
    emoji: "🎉",
    colorClass: "from-green-50 to-emerald-50 border-green-300",
  },
  reject: {
    title: "⚠️ Επιβεβαίωση Απόρριψης",
    description: "Είστε σίγουροι ότι θέλετε να απορρίψετε αυτή την αίτηση;",
    confirmLabel: "❌ Απόρριψη",
    variant: "destructive",
    emoji: "⚠️",
    colorClass: "from-orange-50 to-amber-50 border-orange-300",
  },
  delete: {
    title: "🗑️ Επιβεβαίωση Διαγραφής",
    description: "Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό;",
    confirmLabel: "🗑️ Διαγραφή",
    variant: "destructive",
    emoji: "🗑️",
    colorClass: "from-red-50 to-pink-50 border-red-300",
  },
  activate: {
    title: "✨ Ενεργοποίηση",
    description: "Είστε σίγουροι ότι θέλετε να ενεργοποιήσετε αυτό;",
    confirmLabel: "✨ Ενεργοποίηση",
    variant: "default",
    emoji: "✨",
    colorClass: "from-blue-50 to-cyan-50 border-blue-300",
  },
  deactivate: {
    title: "😴 Απενεργοποίηση",
    description: "Είστε σίγουροι ότι θέλετε να απενεργοποιήσετε αυτό;",
    confirmLabel: "😴 Απενεργοποίηση",
    variant: "default",
    emoji: "😴",
    colorClass: "from-gray-50 to-slate-50 border-gray-300",
  },
  feature: {
    title: "⭐ Προβολή ως Featured",
    description: "Είστε σίγουροι ότι θέλετε να προβάλετε αυτό ως featured;",
    confirmLabel: "⭐ Feature",
    variant: "default",
    emoji: "⭐",
    colorClass: "from-yellow-50 to-amber-50 border-yellow-300",
  },
  unfeature: {
    title: "💫 Αφαίρεση από Featured",
    description: "Είστε σίγουροι ότι θέλετε να αφαιρέσετε αυτό από τα featured;",
    confirmLabel: "💫 Unfeature",
    variant: "default",
    emoji: "💫",
    colorClass: "from-purple-50 to-indigo-50 border-purple-300",
  },
  custom: {
    title: "🤔 Επιβεβαίωση",
    description: "Είστε σίγουροι ότι θέλετε να συνεχίσετε;",
    confirmLabel: "✅ Επιβεβαίωση",
    variant: "default",
    emoji: "🤔",
    colorClass: "from-blue-50 to-indigo-50 border-blue-300",
  },
};

export function ConfirmationDialog({
  open,
  onOpenChange,
  action,
  title,
  description,
  customTitle,
  customDescription,
  customConfirmLabel,
  customCancelLabel = "Ακύρωση",
  onConfirm,
  isLoading = false,
  variant,
}: ConfirmationDialogProps) {
  const config = actionConfig[action];
  const finalTitle = customTitle || title || config.title;
  const finalDescription = customDescription || description || config.description;
  const finalConfirmLabel = customConfirmLabel || config.confirmLabel;
  const finalVariant = variant || config.variant;
  const colorClass = config.colorClass;

  const handleConfirm = async () => {
    await onConfirm();
    // Don't close automatically - let the parent component handle it
  };

  // Get button colors based on action
  const getButtonColors = () => {
    if (finalVariant === "destructive") {
      return "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg shadow-red-200";
    }
    switch (action) {
      case "approve":
        return "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg shadow-green-200";
      case "activate":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-200";
      case "feature":
        return "bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white shadow-lg shadow-yellow-200";
      default:
        return "bg-gradient-to-r from-primary-pink to-pink-500 hover:from-primary-pink/90 hover:to-pink-600 text-white shadow-lg shadow-pink-200";
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-2 border-gray-200 shadow-2xl">
        <div className={`p-1 rounded-2xl bg-gradient-to-br ${colorClass}`}>
          <AlertDialogHeader className="p-6 bg-white rounded-xl">
            <AlertDialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-3xl">{config.emoji}</span>
              {finalTitle.replace(/^[^\s]+\s/, "")}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 text-base text-gray-700 mt-4">
                <p>{finalDescription}</p>
                {action === "delete" && (
                  <div className="mt-3 p-4 bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-xl shadow-sm">
                    <div className="text-sm font-semibold text-red-900 flex items-center gap-2">
                      <span className="text-lg">⛔</span>
                      Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.
                    </div>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter className="gap-3 px-6 pb-6">
          <AlertDialogCancel 
            disabled={isLoading}
            className="border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold"
          >
            {customCancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className={`${getButtonColors()} font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Επεξεργασία...
              </>
            ) : (
              finalConfirmLabel
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

