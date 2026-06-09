import ClientPage from "./ClientPage";
import { Suspense } from "react";

export function generateStaticParams() {
  return [{ eventId: "demo-aiot-open-house", stationId: "aibi-lab" }];
}

export default function Page() {
  return (
    <Suspense fallback={<main className="p-8">กำลังโหลด QR check-in...</main>}>
      <ClientPage />
    </Suspense>
  );
}
