"use client";

import { renderBadgeSvg, svgToDataUrl } from "@/utils/badgeRenderer";
import type { BadgeTemplateConfig } from "@/types/event";

export function BadgePreview({ config, participantName = "UTCC Explorer", eventName = "UTCC AIoT Sphere" }: { config: BadgeTemplateConfig; participantName?: string; eventName?: string }) {
  const svg = renderBadgeSvg({ config, participantName, eventName, issuedText: "COMPLETED", verificationCode: "DEMO-VERIFY" });
  return <img className="w-full rounded-lg border border-cyan-300/25" src={svgToDataUrl(svg)} alt="Badge preview" />;
}

