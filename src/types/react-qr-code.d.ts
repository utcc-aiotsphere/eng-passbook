declare module "react-qr-code" {
  import type { SVGProps } from "react";

  export type QRCodeProps = SVGProps<SVGSVGElement> & {
    value: string;
    size?: number;
    bgColor?: string;
    fgColor?: string;
    level?: "L" | "M" | "Q" | "H";
  };

  export default function QRCode(props: QRCodeProps): JSX.Element;
}
