import type { BadgeTemplateConfig } from "@/types/event";

const colorMap = {
  cyan: ["#38D6FF", "#0B1020"],
  violet: ["#8B5CF6", "#0B1020"],
  magenta: ["#FF3DCE", "#0B1020"],
  amber: ["#FACC15", "#0B1020"],
};

export function renderBadgeSvg({
  config,
  participantName,
  eventName,
  issuedText,
  verificationCode,
}: {
  config: BadgeTemplateConfig;
  participantName: string;
  eventName: string;
  issuedText: string;
  verificationCode: string;
}) {
  const [accent, bg] = colorMap[config.colorTheme];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="g" x1="0" x2="1"><stop stop-color="${accent}" stop-opacity=".92"/><stop offset="1" stop-color="#FF3DCE" stop-opacity=".82"/></linearGradient>
    <filter id="glow"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="1200" height="800" fill="${bg}"/>
  <path d="M0 140 H1200 M0 300 H1200 M0 460 H1200 M0 620 H1200 M160 0 V800 M360 0 V800 M560 0 V800 M760 0 V800 M960 0 V800" stroke="${accent}" stroke-opacity=".11"/>
  <rect x="84" y="70" width="1032" height="660" rx="34" fill="#0F172A" fill-opacity=".78" stroke="${accent}" stroke-width="4"/>
  <rect x="128" y="112" width="944" height="576" rx="24" fill="none" stroke="url(#g)" stroke-width="2" stroke-dasharray="18 14"/>
  <circle cx="600" cy="255" r="104" fill="none" stroke="url(#g)" stroke-width="12" filter="url(#glow)"/>
  <text x="600" y="292" fill="${accent}" font-size="96" text-anchor="middle" font-family="Arial, sans-serif">${config.badgeIcon || "AI"}</text>
  <text x="600" y="420" fill="#E9FBFF" font-size="58" font-weight="700" text-anchor="middle" font-family="Arial, sans-serif">${escapeXml(config.badgeTitle)}</text>
  <text x="600" y="478" fill="#BFEFFF" font-size="34" text-anchor="middle" font-family="Arial, sans-serif">${escapeXml(participantName)}</text>
  <text x="600" y="530" fill="#94A3B8" font-size="28" text-anchor="middle" font-family="Arial, sans-serif">${escapeXml(eventName)}</text>
  <text x="600" y="586" fill="${accent}" font-size="28" text-anchor="middle" font-family="Arial, sans-serif">${escapeXml(config.badgeLevel)} • ${escapeXml(issuedText)}</text>
  <text x="600" y="650" fill="#FACC15" font-size="22" text-anchor="middle" font-family="Arial, sans-serif">VERIFY ${escapeXml(verificationCode)}</text>
  <text x="600" y="700" fill="#E9FBFF" font-size="24" text-anchor="middle" font-family="Arial, sans-serif">UTCC ENG Passbook • Powered by UTCC AIoT Sphere</text>
</svg>`;
}

export function svgToDataUrl(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[char] ?? char);
}

