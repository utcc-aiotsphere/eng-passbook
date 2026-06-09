"use client";

import QRCode from "react-qr-code";
import type { EventDoc } from "@/types/event";
import type { Station } from "@/types/station";

export function QRPoster({ event, station }: { event: EventDoc; station: Station }) {
  return (
    <div className="rounded-lg border-2 border-cyan-300 bg-[#050816] p-8 text-center text-white shadow-[0_0_32px_rgba(56,214,255,.24)]">
      <p className="text-sm uppercase tracking-[0.3em] text-cyan-200">UTCC ENG Passbook</p>
      <h2 className="mt-3 text-3xl font-black">{event.name}</h2>
      <h3 className="mt-2 text-xl text-amber-200">{station.name}</h3>
      <div className="mx-auto mt-6 w-72 rounded-md bg-white p-5">
        <QRCode value={station.qrUrl || ""} className="h-auto w-full" />
      </div>
      <p className="mt-6 text-lg font-bold">สแกนเพื่อเช็กอิน</p>
      <p className="mt-2 text-sm text-slate-300">Powered by UTCC AIoT Sphere</p>
    </div>
  );
}

