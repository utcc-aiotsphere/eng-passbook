import ClientPage from "./ClientPage";

export function generateStaticParams() {
  return [{ eventId: "demo-aiot-open-house" }];
}

export default function Page() {
  return <ClientPage />;
}

