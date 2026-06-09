import Link from "next/link";
import { cn } from "@/utils/cn";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  children: React.ReactNode;
};

export function NeonButton({ className, href, children, ...props }: Props) {
  const classes = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-cyan-300/55 bg-cyan-300/12 px-4 py-2 text-sm font-semibold text-cyan-100 shadow-[0_0_24px_rgba(56,214,255,0.18)] transition hover:bg-cyan-300/22 focus-visible:outline-2 focus-visible:outline-offset-2",
    className,
  );
  if (href) return <Link href={href} className={classes}>{children}</Link>;
  return <button className={classes} {...props}>{children}</button>;
}
