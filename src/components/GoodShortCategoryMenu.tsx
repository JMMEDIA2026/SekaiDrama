"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { GOODSHORT_GENRES, GOODSHORT_TAGS } from "@/lib/goodshort-taxonomy";

interface GoodShortCategoryMenuProps {
  selected: string | null;
  onSelect: (value: string | null) => void;
}

export function GoodShortCategoryMenu({ selected, onSelect }: GoodShortCategoryMenuProps) {
  const [showTags, setShowTags] = useState(false);

  return (
    <div className="space-y-3">
      {/* 카테고리(장르) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
        <button
          onClick={() => onSelect(null)}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !selected
              ? "bg-primary text-primary-foreground"
              : "bg-muted/50 text-muted-foreground hover:bg-muted"
          }`}
        >
          전체
        </button>
        {GOODSHORT_GENRES.map((genre) => (
          <button
            key={genre}
            onClick={() => onSelect(genre)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selected === genre
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            {genre}
          </button>
        ))}
        <button
          onClick={() => setShowTags((prev) => !prev)}
          className={`shrink-0 flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            showTags || (selected && !GOODSHORT_GENRES.includes(selected))
              ? "bg-primary/20 text-primary"
              : "bg-muted/50 text-muted-foreground hover:bg-muted"
          }`}
        >
          핫태그
          {showTags ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* 핫태그 목록 */}
      {showTags && (
        <div className="flex flex-wrap gap-2 p-4 rounded-2xl bg-muted/30 max-h-72 overflow-y-auto animate-fade-up">
          {GOODSHORT_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                onSelect(tag);
                setShowTags(false);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selected === tag
                  ? "bg-primary text-primary-foreground"
                  : "bg-pink-500/10 text-pink-600 dark:text-pink-400 hover:bg-pink-500/20"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* 선택된 필터 표시 */}
      {selected && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">
            필터: <span className="font-medium text-foreground">{selected}</span>
          </span>
          <button
            onClick={() => onSelect(null)}
            className="p-1 rounded-full hover:bg-muted transition-colors"
            aria-label="필터 해제"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
