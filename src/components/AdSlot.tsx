"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import type { AdSenseSlot, AdSlotPlacement } from "@/types/ads";

function AdSlotItem({ slot }: { slot: AdSenseSlot }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // innerHTML로 삽입된 <script>는 브라우저가 실행하지 않으므로
    // 새 script 엘리먼트로 교체해 실제로 실행되게 합니다.
    container.innerHTML = slot.code;
    container.querySelectorAll("script").forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) =>
        newScript.setAttribute(attr.name, attr.value)
      );
      newScript.text = oldScript.textContent ?? "";
      oldScript.replaceWith(newScript);
    });
  }, [slot.code]);

  return <div ref={containerRef} className="w-full flex justify-center" />;
}

export function AdSlot({ placement }: { placement: AdSlotPlacement }) {
  const { data } = useQuery({
    queryKey: ["ads", "slots"],
    queryFn: async () => {
      const res = await fetch("/api/ads/slots");
      const json = await res.json();
      return (json.slots as AdSenseSlot[]) ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const slots = (data ?? []).filter((slot) => slot.placement === placement);
  if (slots.length === 0) return null;

  return (
    <div className="space-y-4">
      {slots.map((slot) => (
        <AdSlotItem key={slot.id} slot={slot} />
      ))}
    </div>
  );
}
