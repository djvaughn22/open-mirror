"use client";

import {
  originalLanguageName,
  type VerifiedWordStudy,
  type WordStudyPassage,
} from "../lib/originalLanguageWordStudy";

type OriginalWordStudyModalProps = {
  passage: WordStudyPassage;
  wordStudy: VerifiedWordStudy;
  verseUrl: string;
  onClose: () => void;
};

export default function OriginalWordStudyModal({
  passage,
  wordStudy,
  verseUrl,
  onClose,
}: OriginalWordStudyModalProps) {
  return (

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a
            href={verseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/25 bg-white/20 px-5 py-2 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-white/30"
          >
            View Verse in Bible App
          </a>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
