"use client";

import useSWR from "swr";
import type { SiteConfiguration } from "@/types/strapi";

async function fetchSiteConfig(): Promise<SiteConfiguration["attributes"] | null> {
  const response = await fetch('/api/site-config');
  
  if (!response.ok) {
    throw new Error('Failed to fetch site config');
  }
  
  const result = await response.json();
  return result.data;
}

export function useSiteConfig() {
  const { data, error, isLoading, mutate } = useSWR(
    "site-config",
    fetchSiteConfig,
    {
      revalidateOnFocus: false,
    },
  );

  return { siteConfig: data, isLoading, isError: error, mutate };
}
