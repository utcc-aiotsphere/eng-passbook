import ClientPage from "./ClientPage";

export function generateStaticParams() {
  return [{ badgeId: "demo-badge" }];
}

export default function Page() {
  return <ClientPage />;
}

