import { cn } from "@/utils/cn";

export function CyberCard({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <section className={cn("glass scan-line rounded-lg", className)} {...props}>{children}</section>;
}
