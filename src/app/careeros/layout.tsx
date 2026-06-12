import { CareerOSProvider } from "@/components/careeros/CareerOSProvider";

export default function CareerOSLayout({ children }: { children: React.ReactNode }) {
  return <CareerOSProvider>{children}</CareerOSProvider>;
}
