"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { GOODSHORT_GENRES, GOODSHORT_TAGS } from "@/lib/goodshort-taxonomy";

interface GoodShortCategoryMenuProps {
  selectedGenre: string | null;
  selectedTag: string | null;
  onSelectGenre: (value: string | null) => void;
  onSelectTag: (value: string | null) => void;
}

export function GoodShortCategoryMenu({
  selectedGenre,
  selectedTag,
  onSelectGenre,
  onSelectTag,
}: GoodShortCategoryMenuProps) {
  const [showTags, setShowTags] = useState(false);
  const hasFilter = !!selectedGenre || !!selectedTag;

  const clearFilter = () => {
    onSelectGenre(null);
    onSelectTag(null);
  };

  return (
    <div className="space-y-3">
      {/* 카테고리(장르) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
        <button
          onClick={clearFilter}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !hasFilter
              ? "bg-primary text-primary-foreground"
              : "bg-muted/50 text-muted-foreground hover:bg-muted"
          }`}
        >
          전체
        </button>
        {GOODSHORT_GENRES.map((genre) => (
          <button
            key={genre.value}
            onClick={() => {
              onSelectGenre(genre.value);
              onSelectTag(null);
            }}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedGenre === genre.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            {genre.ko}
          </button>
        ))}
        <button
          onClick={() => setShowTags((prev) => !prev)}
          className={`shrink-0 flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            showTags || selectedTag
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
              key={tag.value}
              onClick={() => {
                onSelectTag(tag.value);
                onSelectGenre(null);
                setShowTags(false);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedTag === tag.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-pink-500/10 text-pink-600 dark:text-pink-400 hover:bg-pink-500/20"
              }`}
            >
              {tag.ko}
            </button>
          ))}
        </div>
      )}

      {/* 선택된 필터 표시 */}
      {hasFilter && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">
            필터:{" "}
            <span className="font-medium text-foreground">
              {GOODSHORT_GENRES.find((g) => g.value === selectedGenre)?.ko ??
                GOODSHORT_TAGS.find((t) => t.value === selectedTag)?.ko}
            </span>
          </span>
          <button
            onClick={clearFilter}
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
