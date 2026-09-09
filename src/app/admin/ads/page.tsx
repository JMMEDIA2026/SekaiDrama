"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { QrisPopupSettings, AdSenseSlot, AdSlotPlacement } from "@/types/ads";

const PLACEMENT_LABELS: Record<AdSlotPlacement, string> = {
  home_top: "홈 화면 상단",
  home_bottom: "홈 화면 하단",
  detail_top: "상세 페이지 상단",
};

async function fetchJson(url: string, init?: RequestInit) {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "요청에 실패했습니다.");
  return data;
}

function QrisSettingsSection() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "ads", "qris"],
    queryFn: () => fetchJson("/api/admin/ads/qris"),
  });

  const [form, setForm] = useState<QrisPopupSettings | null>(null);

  useEffect(() => {
    if (data?.settings) setForm(data.settings);
  }, [data]);

  const save = useMutation({
    mutationFn: (settings: QrisPopupSettings) =>
      fetchJson("/api/admin/ads/qris", { method: "PUT", body: JSON.stringify(settings) }),
    onSuccess: () => {
      toast.success("QRIS 팝업 설정이 저장되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["admin", "ads", "qris"] });
    },
    onError: (error: any) => toast.error(error.message),
  });

  if (!form) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>QRIS 도네이션 팝업</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">불러오는 중...</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>QRIS 도네이션 팝업</CardTitle>
        <CardDescription>상세 페이지 진입 시 노출되는 도네이션 팝업을 관리합니다.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="qris-enabled">팝업 표시</Label>
          <Switch
            id="qris-enabled"
            checked={form.enabled}
            onCheckedChange={(checked) => setForm({ ...form, enabled: checked })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="qris-title">제목</Label>
          <Input
            id="qris-title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="qris-description">설명</Label>
          <Textarea
            id="qris-description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="qris-image">QR 이미지 URL</Label>
          <Input
            id="qris-image"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="/qris.jpg 또는 https://..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="qris-footnote">하단 문구</Label>
          <Input
            id="qris-footnote"
            value={form.footnote}
            onChange={(e) => setForm({ ...form, footnote: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="qris-countdown">닫기 버튼 활성화까지 대기 시간(초)</Label>
          <Input
            id="qris-countdown"
            type="number"
            min={0}
            max={60}
            value={form.countdownSeconds}
            onChange={(e) => setForm({ ...form, countdownSeconds: Number(e.target.value) })}
          />
        </div>
        <Button onClick={() => save.mutate(form)} disabled={save.isPending}>
          {save.isPending ? "저장 중..." : "저장"}
        </Button>
      </CardContent>
    </Card>
  );
}

function emptyBannerForm() {
  return { imageUrl: "", linkUrl: "", title: "", sortOrder: 0 };
}

function BannerSection() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "ads", "banners"],
    queryFn: () => fetchJson("/api/admin/ads/banners"),
  });
  const banners: any[] = data?.banners ?? [];

  const [newBanner, setNewBanner] = useState(emptyBannerForm());

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "ads", "banners"] });

  const setLocalBanner = (id: number, patch: Record<string, unknown>) => {
    queryClient.setQueryData(["admin", "ads", "banners"], (old: any) => ({
      banners: (old?.banners ?? []).map((b: any) => (b.id === id ? { ...b, ...patch } : b)),
    }));
  };

  const createBanner = useMutation({
    mutationFn: (banner: typeof newBanner) =>
      fetchJson("/api/admin/ads/banners", { method: "POST", body: JSON.stringify(banner) }),
    onSuccess: () => {
      toast.success("배너가 추가되었습니다.");
      setNewBanner(emptyBannerForm());
      invalidate();
    },
    onError: (error: any) => toast.error(error.message),
  });

  const updateBanner = useMutation({
    mutationFn: ({ id, ...banner }: any) =>
      fetchJson(`/api/admin/ads/banners/${id}`, { method: "PATCH", body: JSON.stringify(banner) }),
    onSuccess: () => {
      toast.success("배너가 수정되었습니다.");
      invalidate();
    },
    onError: (error: any) => toast.error(error.message),
  });

  const deleteBanner = useMutation({
    mutationFn: (id: number) => fetchJson(`/api/admin/ads/banners/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("배너가 삭제되었습니다.");
      invalidate();
    },
    onError: (error: any) => toast.error(error.message),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>배너 광고</CardTitle>
        <CardDescription>홈 화면 상단에 노출할 배너 이미지를 추가/수정/삭제합니다.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          {banners.map((banner) => (
            <div key={banner.id} className="grid gap-3 rounded-lg border p-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>이미지 URL</Label>
                <Input
                  value={banner.image_url}
                  onChange={(e) => setLocalBanner(banner.id, { image_url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>링크 URL</Label>
                <Input
                  value={banner.link_url ?? ""}
                  onChange={(e) => setLocalBanner(banner.id, { link_url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>제목</Label>
                <Input
                  value={banner.title ?? ""}
                  onChange={(e) => setLocalBanner(banner.id, { title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>정렬 순서</Label>
                <Input
                  type="number"
                  value={banner.sort_order}
                  onChange={(e) => setLocalBanner(banner.id, { sort_order: Number(e.target.value) })}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={banner.is_active}
                  onCheckedChange={(checked) => setLocalBanner(banner.id, { is_active: checked })}
                />
                <Label>노출</Label>
              </div>
              <div className="flex items-end gap-2 md:col-span-2">
                <Button
                  size="sm"
                  onClick={() =>
                    updateBanner.mutate({
                      id: banner.id,
                      imageUrl: banner.image_url,
                      linkUrl: banner.link_url,
                      title: banner.title,
                      sortOrder: banner.sort_order,
                      isActive: banner.is_active,
                    })
                  }
                  disabled={updateBanner.isPending}
                >
                  저장
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteBanner.mutate(banner.id)}
                  disabled={deleteBanner.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                  삭제
                </Button>
              </div>
            </div>
          ))}
          {banners.length === 0 && (
            <p className="text-sm text-muted-foreground">등록된 배너가 없습니다.</p>
          )}
        </div>

        <div className="space-y-3 rounded-lg border border-dashed p-4">
          <p className="text-sm font-medium">새 배너 추가</p>
          <div className="grid gap-2 md:grid-cols-2">
            <Input
              placeholder="이미지 URL"
              value={newBanner.imageUrl}
              onChange={(e) => setNewBanner({ ...newBanner, imageUrl: e.target.value })}
            />
            <Input
              placeholder="링크 URL (선택)"
              value={newBanner.linkUrl}
              onChange={(e) => setNewBanner({ ...newBanner, linkUrl: e.target.value })}
            />
            <Input
              placeholder="제목 (선택)"
              value={newBanner.title}
              onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
            />
            <Input
              type="number"
              placeholder="정렬 순서"
              value={newBanner.sortOrder}
              onChange={(e) => setNewBanner({ ...newBanner, sortOrder: Number(e.target.value) })}
            />
          </div>
          <Button
            size="sm"
            onClick={() => createBanner.mutate(newBanner)}
            disabled={!newBanner.imageUrl || createBanner.isPending}
          >
            <Plus className="w-4 h-4" />
            배너 추가
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AdSlotsSection() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "ads", "slots"],
    queryFn: () => fetchJson("/api/admin/ads/slots"),
  });

  const [slots, setSlots] = useState<AdSenseSlot[] | null>(null);

  useEffect(() => {
    if (data?.slots) setSlots(data.slots);
  }, [data]);

  const save = useMutation({
    mutationFn: (payload: AdSenseSlot[]) =>
      fetchJson("/api/admin/ads/slots", {
        method: "PUT",
        body: JSON.stringify({ slots: payload }),
      }),
    onSuccess: () => {
      toast.success("광고 슬롯 설정이 저장되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["admin", "ads", "slots"] });
    },
    onError: (error: any) => toast.error(error.message),
  });

  if (!slots) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>일반 광고 슬롯 (애드센스 등)</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">불러오는 중...</CardContent>
      </Card>
    );
  }

  const updateSlot = (id: string, patch: Partial<AdSenseSlot>) => {
    setSlots((prev) => prev!.map((slot) => (slot.id === id ? { ...slot, ...patch } : slot)));
  };

  const removeSlot = (id: string) => {
    setSlots((prev) => prev!.filter((slot) => slot.id !== id));
  };

  const addSlot = () => {
    setSlots((prev) => [
      ...(prev ?? []),
      { id: `slot-${Date.now()}`, name: "", placement: "home_top", code: "", enabled: false },
    ]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>일반 광고 슬롯 (애드센스 등)</CardTitle>
        <CardDescription>
          페이지 곳곳에 표시할 광고 스크립트/HTML을 등록합니다. 본인이 신뢰하는 코드만 입력하세요.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {slots.map((slot) => (
          <div key={slot.id} className="space-y-2 rounded-lg border p-4">
            <div className="grid gap-2 md:grid-cols-2">
              <Input
                placeholder="슬롯 이름"
                value={slot.name}
                onChange={(e) => updateSlot(slot.id, { name: e.target.value })}
              />
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={slot.placement}
                onChange={(e) => updateSlot(slot.id, { placement: e.target.value as AdSlotPlacement })}
              >
                {Object.entries(PLACEMENT_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <Textarea
              placeholder="광고 스크립트/HTML 코드"
              value={slot.code}
              onChange={(e) => updateSlot(slot.id, { code: e.target.value })}
              rows={4}
              className="font-mono text-xs"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  checked={slot.enabled}
                  onCheckedChange={(checked) => updateSlot(slot.id, { enabled: checked })}
                />
                <Label>활성화</Label>
              </div>
              <Button size="sm" variant="destructive" onClick={() => removeSlot(slot.id)}>
                <Trash2 className="w-4 h-4" />
                삭제
              </Button>
            </div>
          </div>
        ))}

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={addSlot}>
            <Plus className="w-4 h-4" />
            슬롯 추가
          </Button>
          <Button size="sm" onClick={() => save.mutate(slots)} disabled={save.isPending}>
            {save.isPending ? "저장 중..." : "전체 저장"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminAdsPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">광고 관리</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          QRIS 도네이션 팝업, 배너, 일반 광고 슬롯을 관리합니다.
        </p>
      </div>
      <QrisSettingsSection />
      <BannerSection />
      <AdSlotsSection />
    </div>
  );
}
