import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import type { GoodShortRankListResponse, GoodShortForYouResponse, GoodShortItem } from "@/types/goodshort";
import { decryptData } from "@/lib/crypto";
import { GOODSHORT_KOREAN_FEED_QUERIES } from "@/lib/goodshort-taxonomy";

// Helper: Extract items from the rank list response (data -> records[0] -> items)
function extractRankItems(data: GoodShortRankListResponse): GoodShortItem[] {
  if (!data?.data?.records?.[0]?.items) return [];
  return data.data.records[0].items;
}

// Fetch "Terbaru" (Latest)
export function useGoodShortLatest() {
  return useQuery({
    queryKey: ["goodshort", "latest"],
    queryFn: async () => {
      const res = await fetch("/api/goodshort/latest");
      if (!res.ok) throw new Error("최신 데이터를 불러오지 못했습니다");
      const resJson = await res.json();
      const data: GoodShortRankListResponse = decryptData(resJson.data);
      return extractRankItems(data);
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Fetch "Trending"
export function useGoodShortTrending() {
  return useQuery({
    queryKey: ["goodshort", "trending"],
    queryFn: async () => {
      const res = await fetch("/api/goodshort/trending");
      if (!res.ok) throw new Error("인기 데이터를 불러오지 못했습니다");
      const resJson = await res.json();
      const data: GoodShortRankListResponse = decryptData(resJson.data);
      return extractRankItems(data);
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Fetch "Lainnya" with infinite scroll (max 50 pages)
export function useInfiniteGoodShortForYou() {
  return useInfiniteQuery({
    queryKey: ["goodshort", "foryou"],
    queryFn: async ({ pageParam = 1 }: { pageParam: number }) => {
      const res = await fetch(`/api/goodshort/foryou?page=${pageParam}`);
      if (!res.ok) throw new Error("데이터를 불러오지 못했습니다");
      const resJson = await res.json();
      const data: GoodShortForYouResponse = decryptData(resJson.data);
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage?.data?.records || lastPage.data.records.length === 0 || allPages.length >= 50) {
        return undefined;
      }
      // Check if current page < total pages
      if (lastPage.data.current < lastPage.data.pages) {
        return allPages.length + 1;
      }
      return undefined;
    },
  });
}

// 홈 화면용: 검색 API가 실제 한국어 원작으로 매칭하는 검색어 여러 개를 동시에 조회해
// 한국어(language: KOREAN) 결과만 모아 중복 제거한 뒤 반환. 최신/인기 랭킹 API는
// 언어 필터를 지원하지 않아 항상 인도네시아어 카탈로그만 나오기 때문에 만든 별도 피드.
export function useGoodShortKoreanFeed() {
  return useQuery({
    queryKey: ["goodshort", "korean-feed"],
    queryFn: async () => {
      const results = await Promise.all(
        GOODSHORT_KOREAN_FEED_QUERIES.map(async (query) => {
          try {
            const res = await fetch(`/api/goodshort/search?query=${encodeURIComponent(query)}`);
            if (!res.ok) return [];
            const resJson = await res.json();
            const data = decryptData<any>(resJson.data);
            return (data?.data?.searchResult?.records || []) as GoodShortItem[];
          } catch {
            return [];
          }
        })
      );

      const seen = new Set<string>();
      const merged: GoodShortItem[] = [];
      for (const item of results.flat()) {
        if (item.language !== "KOREAN" || seen.has(item.bookId)) continue;
        seen.add(item.bookId);
        merged.push(item);
      }
      return merged;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Fetch Search
export function useGoodShortSearch(query: string) {
  return useQuery({
    queryKey: ["goodshort", "search", query],
    queryFn: async () => {
      if (!query) return [];
      const res = await fetch(`/api/goodshort/search?query=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("검색 데이터를 불러오지 못했습니다");
      const resJson = await res.json();
      const data = decryptData<any>(resJson.data);
      return data?.data?.searchResult?.records || [];
    },
    enabled: !!query,
    staleTime: 5 * 60 * 1000,
  });
}

// Fetch Detail
export function useGoodShortDetail(bookId: string) {
  return useQuery({
    queryKey: ["goodshort", "detail", bookId],
    queryFn: async () => {
      if (!bookId) throw new Error("Book ID tidak diberikan");
      const res = await fetch(`/api/goodshort/detail?bookId=${encodeURIComponent(bookId)}`);
      if (!res.ok) throw new Error("상세 데이터를 불러오지 못했습니다");
      const resJson = await res.json();
      const data = decryptData<any>(resJson.data);
      return data?.data;
    },
    enabled: !!bookId,
    staleTime: 5 * 60 * 1000,
  });
}

// Fetch All Episodes (for watch page)
export function useGoodShortEpisodes(bookId: string) {
  return useQuery({
    queryKey: ["goodshort", "allepisode", bookId],
    queryFn: async () => {
      if (!bookId) throw new Error("Book ID tidak diberikan");
      const res = await fetch(`/api/goodshort/allepisode?bookId=${encodeURIComponent(bookId)}`);
      if (!res.ok) throw new Error("에피소드 데이터를 불러오지 못했습니다");
      const resJson = await res.json();
      const data = decryptData<any>(resJson.data);
      return data?.data;
    },
    enabled: !!bookId,
    staleTime: 5 * 60 * 1000,
  });
}

