import { strapiClient } from "./client";
import type {
  PerformanceMetricPayload,
  PerformanceMetricResponse,
} from "@/types/performance-metric";

export async function recordPerformanceMetric(
  metric: PerformanceMetricPayload,
): Promise<PerformanceMetricResponse> {
  return strapiClient.post<PerformanceMetricResponse, { data: PerformanceMetricPayload }>(
    "/performance-metrics",
    { data: metric },
  );
}
