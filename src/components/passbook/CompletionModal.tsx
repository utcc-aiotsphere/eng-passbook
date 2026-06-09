"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { CyberCard } from "@/components/cyber/CyberCard";

export function CompletionModal({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <motion.div initial={{ scale: 0.86, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <CyberCard className="max-w-md p-8 text-center">
          <Trophy className="mx-auto text-amber-200" size={58} />
          <h2 className="mt-4 text-3xl font-black">ปลดล็อก Badge สำเร็จ</h2>
          <p className="mt-3 text-slate-300">คุณผ่านฐานกิจกรรมครบตามเงื่อนไขและมีสิทธิ์รับของรางวัล</p>
        </CyberCard>
      </motion.div>
    </div>
  );
}

