"use client";

import QRCode from "react-qr-code";
import { Download } from "lucide-react";
import { NeonButton } from "@/components/cyber/NeonButton";
import { CyberCard } from "@/components/cyber/CyberCard";

export function QRCodeCard({ title, value }: { title: string; value: string }) {
  function downloadSvg() {
    const svg = document.getElementById(`qr-${title}`)?.querySelector("svg");
    if (!svg) return;
    const blob = new Blob([svg.outerHTML], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <CyberCard className="p-5">
      <h3 className="mb-4 font-bold">{title}</h3>
      <div id={`qr-${title}`} className="rounded-md bg-white p-4">
        <QRCode value={value || "missing"} className="h-auto w-full" />
      </div>
      <NeonButton onClick={downloadSvg} className="mt-4 w-full"><Download size={16} /> Download SVG</NeonButton>
    </CyberCard>
  );
}

