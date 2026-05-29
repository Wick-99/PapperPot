"use client";

import { useEffect } from "react";

export function FontStylesheetActivator() {
  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>("link[data-fontshare-stylesheet]");
    if (link) link.media = "all";
  }, []);

  return null;
}
