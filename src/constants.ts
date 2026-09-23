export const DASHBOARD_URL = "https://fundednext.com/dashboard";

/**
 * Buffer-consumed thresholds (percent) that flip an account's health color.
 * Below caution = safe (green), caution..danger = amber, danger+ = red.
 */
export const HEALTH_THRESHOLDS = {
  caution: 60,
  danger: 85,
} as const;
