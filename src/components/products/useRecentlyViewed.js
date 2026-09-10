"use client";

import { useSyncExternalStore } from "react";
import { getRecentlyViewed, getServerRecentlyViewed, subscribe } from "@/lib/recentlyViewed";

/** The visitor's recently-viewed products, kept in sync across every component and tab. */
export default function useRecentlyViewed() {
  return useSyncExternalStore(subscribe, getRecentlyViewed, getServerRecentlyViewed);
}
