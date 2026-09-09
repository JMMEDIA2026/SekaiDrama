"use client";

import Image from "next/image";
import { usePlatform, type PlatformInfo } from "@/hooks/usePlatform";

export function PlatformSelector() {
  const { currentPlatform, setPlatform, platforms } = usePlatform();

  return (
    <div className="w-full py-4 px-4">
      {/* Horizontal tabs on every screen size (모바일 포함 가로 배치) */}
      <div className="flex items-center gap-3">
        {platforms.map((platform) => (
          <PlatformButton
            key={platform.id}
            platform={platform}
            isActive={currentPlatform === platform.id}
            onClick={() => setPlatform(platform.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface PlatformButtonProps {
  platform: PlatformInfo;
  isActive: boolean;
  onClick: () => void;
}

function PlatformButton({ platform, isActive, onClick }: PlatformButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex flex-1 items-center justify-center gap-2 px-4 py-2.5 rounded-full
        transition-all duration-300 ease-out
        ${
          isActive
            ? "bg-primary/20 ring-2 ring-primary shadow-lg shadow-primary/20"
            : "bg-muted/50 hover:bg-muted/80"
        }
      `}
    >
      <div className="relative w-6 h-6 rounded-md overflow-hidden">
        <Image
          src={platform.logo}
          alt={platform.name}
          fill
          className="object-cover"
          sizes="24px"
        />
      </div>
      <span
        className={`
          font-medium text-sm whitespace-nowrap
          ${isActive ? "text-primary" : "text-muted-foreground"}
        `}
      >
        {platform.name}
      </span>
      {isActive && (
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary animate-pulse" />
      )}
    </button>
  );
}
