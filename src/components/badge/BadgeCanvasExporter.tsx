"use client";

import { Download } from "lucide-react";
import { NeonButton } from "@/components/cyber/NeonButton";

export function BadgeCanvasExporter({ svg, filename = "utcc-passbook-badge.png" }: { svg: string; filename?: string }) {
  async function exportPng() {
    const img = new Image();
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(img, 0, 0);
    const link = document.createElement("a");
    link.download = filename;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }
  return <NeonButton onClick={exportPng}><Download size={16} /> ดาวน์โหลด Badge PNG</NeonButton>;
}

