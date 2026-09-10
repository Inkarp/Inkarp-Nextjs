"use client";

import { useEffect } from "react";
import { recordView } from "@/lib/recentlyViewed";

export default function RecordProductView({ product }) {
  useEffect(() => {
    recordView(product);
  }, [product]);

  return null;
}
