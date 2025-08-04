export interface PerformanceMetricPayload {
  name: string;
  value: number;
  path?: string;
  duration?: number;
  userAgent?: string;
  timestamp?: string;
  meta?: Record<string, unknown>;
}

export interface PerformanceMetric {
  id: number;
  attributes: PerformanceMetricPayload & {
    createdAt: string;
    updatedAt: string;
  };
}

export interface PerformanceMetricResponse {
  data: PerformanceMetric;
  meta?: Record<string, unknown>;
}
