"use client";

import { useSyncExternalStore } from "react";
import { getBasket, getServerBasket, subscribe } from "@/lib/quoteBasket";

/** The current quote shortlist, kept in sync across every component and tab. */
export default function useQuoteBasket() {
  return useSyncExternalStore(subscribe, getBasket, getServerBasket);
}
