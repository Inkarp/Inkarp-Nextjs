"use client";

import { useSyncExternalStore } from "react";
import { getCompareBasket, getServerCompareBasket, subscribe } from "@/lib/compareBasket";

/** The current compare shortlist, kept in sync across every component and tab. */
export default function useCompareBasket() {
  return useSyncExternalStore(subscribe, getCompareBasket, getServerCompareBasket);
}
