import axiosClient from "./axiosClient";

/**
 * Get Audit Trail & Activity Logs
 * @param {string} [category] - Optional category filter (ALL, ADMINISTRATION, QUEUE_TRIAGE, SECURITY, etc.)
 */
export const getAuditLogs = (category) => {
  const url = category && category !== "ALL"
    ? `/super-admin/audit-logs?category=${encodeURIComponent(category)}`
    : "/super-admin/audit-logs";
  return axiosClient.get(url);
};
