"use client";

import {
  getVerifiedWordStudyForWord,
  type VerifiedWordStudy,
  type WordStudyPassage,
} from "../lib/originalLanguageWordStudy";

type VerifiedVerseTextProps = {
  passage: WordStudyPassage;
  onWordClick: (wordStudy: VerifiedWordStudy) => void;
};

export default function VerifiedVerseText({
  passage,
  onWordClick,
}: VerifiedVerseTextProps) {
  const parts = passage.text.split(/([A-Za-z]+(?:'[A-Za-z]+)?)/g);

  return (
    <>
      {parts.map((part, index) => {
        const wordStudy = getVerifiedWordStudyForWord(passage, part);

        if (!wordStudy) {
          return <span key={`${part}-${index}`}>{part}</span>;
        }

        return (
          <button
            key={`${wordStudy.reference}-${wordStudy.englishWord}-${index}`}
            type="button"
            onClick={() => onWordClick(wordStudy)}
            title="Open Behind the Verse"
            className="font-bold text-emerald-100 underline decoration-emerald-200/70 decoration-2 underline-offset-4 transition hover:text-white"
          >
            {part}
          </button>
        );
      })}
    </>
  );
}
