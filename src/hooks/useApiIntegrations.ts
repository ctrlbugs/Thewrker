"use client";

import { useEffect, useState } from "react";

import { fetchIntegrationStatus, type IntegrationStatus } from "@/lib/api/client";

const DEFAULT_STATUS: IntegrationStatus = {
  "google-cse": false,
  serpapi: false,
  "ocr-space": false,
  "remove-bg": false,
  openai: false,
  webSearch: false,
};

export function useApiIntegrations() {
  const [status, setStatus] = useState<IntegrationStatus>(DEFAULT_STATUS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetchIntegrationStatus()
      .then((nextStatus) => {
        if (active) setStatus(nextStatus);
      })
      .catch(() => {
        if (active) setStatus(DEFAULT_STATUS);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { status, loading };
}
