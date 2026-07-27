"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureLanding } from "@/lib/tracking";

export default function TrackingCapture() {
  const pathname = usePathname();

  useEffect(() => {
    captureLanding();
  }, [pathname]);

  return null;
}
