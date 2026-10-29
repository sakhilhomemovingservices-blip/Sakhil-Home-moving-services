import React from 'react';
import { MediaItem, Language } from '../types';
import { X, Play } from 'lucide-react';

interface MediaGalleryModalProps {
  media: MediaItem | null;
  onClose: () => void;
  currentLang: Language;
}

export const MediaGalleryModal: React.FC<MediaGalleryModalProps> = ({
  media,
  onClose,
  currentLang,
}) => {
  if (!media) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl w-full max-h-[90vh] bg-slate-950 rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-white/10"
      >
        {/* Top Control Bar */}
        <div className="p-4 bg-slate-900/90 text-white flex items-center justify-between z-10">
          <div className="font-bold text-sm truncate pe-4">{media.title}</div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media display area */}
        <div className="flex-1 flex items-center justify-center bg-black p-2 overflow-hidden">
          {media.type === 'video' ? (
            <video
              src={media.url}
              controls
              autoPlay
              playsInline
              className="max-h-[70vh] w-full rounded-xl object-contain"
            />
          ) : (
            <img
              src={media.url}
              alt={media.title}
              className="max-h-[70vh] max-w-full rounded-xl object-contain"
            />
          )}
        </div>

        {/* Bottom caption bar */}
        <div className="p-3.5 bg-slate-900/90 text-slate-300 text-xs flex items-center justify-between">
          <span className="font-medium">{media.title}</span>
          <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded-md uppercase font-bold text-emerald-400">
            {media.type}
          </span>
        </div>
      </div>
    </div>
  );
};
