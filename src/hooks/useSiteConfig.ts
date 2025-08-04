"use client";

import useSWR from "swr";
import { getCachedSiteConfig } from "@/lib/strapi/site-config";
import type { SiteConfiguration } from "@/types/strapi";

async function fetchSiteConfig(): Promise<SiteConfiguration["attributes"] | null> {
  const config = await getCachedSiteConfig();
  return config?.attributes ?? null;
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
