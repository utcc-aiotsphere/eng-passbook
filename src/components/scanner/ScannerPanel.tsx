"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera } from "lucide-react";
import { NeonButton } from "@/components/cyber/NeonButton";

export function ScannerPanel({ onScan }: { onScan: (value: string) => void }) {
  const [running, setRunning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const id = "utcc-qr-scanner";

  useEffect(() => () => {
    scannerRef.current?.stop().catch(() => undefined);
  }, []);

  async function start() {
    const scanner = new Html5Qrcode(id);
    scannerRef.current = scanner;
    setRunning(true);
    await scanner.start({ facingMode: "environment" }, { fps: 10, qrbox: 250 }, (decodedText) => {
      onScan(decodedText);
      scanner.stop().catch(() => undefined);
      setRunning(false);
    }, undefined);
  }

  return (
    <div>
      <div id={id} className="min-h-64 overflow-hidden rounded-lg border border-cyan-300/25 bg-black/50" />
      <NeonButton onClick={start} disabled={running} className="mt-4 w-full"><Camera size={16} /> {running ? "กำลังสแกน..." : "เปิดกล้องสแกน QR"}</NeonButton>
    </div>
  );
}

