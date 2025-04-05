import React, { useMemo, useEffect, useRef } from 'react';
import { X, Star, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavorites } from '@/hooks/useFavorites';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FavoritesList } from '@/components/weather/FavoritesList';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FavoritesModal({ isOpen, onClose }: FavoritesModalProps) {
  const { favorites, loading } = useFavorites();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Memoize count to avoid re-renders
  const count = useMemo(() => favorites.length, [favorites]);

  // Focus management - focus the close button when the modal opens
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      // Small delay to ensure dialog is fully mounted
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => !open && onClose()}
      aria-labelledby="favorites-dialog-title"
      aria-describedby="favorites-dialog-description"
    >
      <DialogContent
        className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 p-0 text-white shadow-xl backdrop-blur-lg sm:max-w-md"
        role="dialog"
        aria-modal="true"
      >
        <DialogHeader className="border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-white/20 p-1.5" aria-hidden="true">
                <Star className="h-4 w-4 text-yellow-300" aria-hidden="true" />
              </div>
              <DialogTitle id="favorites-dialog-title" className="text-xl">
                Favorite Locations
              </DialogTitle>
            </div>
            <Button
              ref={closeButtonRef}
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-white/10 p-0 hover:bg-white/20"
              onClick={onClose}
              aria-label="Close favorites modal"
            >
              <X className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <DialogDescription id="favorites-dialog-description" className="text-white/70">
            {loading
              ? 'Loading your favorite locations...'
              : count > 0
                ? `You have ${count} saved location${count > 1 ? 's' : ''}. You can save up to 10 locations.`
                : 'You have no favorite locations yet.'}
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          <FavoritesList />

          <div className="mt-6 border-t border-white/10 pt-4">
            <p className="mb-2 text-xs text-white/70">
              Tip: You can add locations to your favorites by clicking the star icon in the weather
              details.
            </p>
            <Button
              variant="ghost"
              className="w-full bg-white/10 py-2 hover:bg-white/20"
              onClick={onClose}
              aria-label="Close favorites modal"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
