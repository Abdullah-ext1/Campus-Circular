// ============================================
// CAMPUS CIRCULAR — Utility Helpers
// Search, Filter, Sort, Formatting, and Math
// ============================================

import { platformConfig } from "../data/mockData";

export function formatCurrency(amount) {
  if (amount === undefined || amount === null) return "₹0";
  return `${platformConfig.currencySymbol}${Number(amount).toLocaleString("en-IN")}`;
}

export function formatDate(isoString) {
  if (!isoString) return "Pending";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function calculateFees({ dailyRate = 0, days = 1, deposit = 0 }) {
  const borrowingCharge = dailyRate * days;
  const platformFee = Math.round((borrowingCharge * platformConfig.platformFeePercent) / 100);
  const totalAmount = borrowingCharge + platformFee + deposit;

  return {
    borrowingCharge,
    platformFee,
    deposit,
    totalAmount,
  };
}

export function searchResources(query, resourcesList) {
  if (!query || !query.trim()) return resourcesList;
  const q = query.toLowerCase().trim();

  return resourcesList.filter((item) => {
    const matchName = item.name.toLowerCase().includes(q);
    const matchCategory = item.category.toLowerCase().includes(q);
    const matchDesc = item.description.toLowerCase().includes(q);
    const matchTags = item.tags.some((tag) => tag.toLowerCase().includes(q));
    return matchName || matchCategory || matchDesc || matchTags;
  });
}

export function filterResources(resourcesList, filters) {
  const { category, availability, minCondition } = filters;

  return resourcesList.filter((item) => {
    if (category && category !== "all" && item.category !== category) return false;
    if (availability === "available" && !item.available) return false;
    if (availability === "in_use" && item.available) return false;
    if (minCondition && item.condition < minCondition) return false;
    return true;
  });
}

export function sortResources(resourcesList, sortKey) {
  const list = [...resourcesList];

  switch (sortKey) {
    case "trust":
      // Requires owner trust score sorting
      return list.sort((a, b) => b.condition - a.condition);
    case "rate_low":
      return list.sort((a, b) => a.dailyRate - b.dailyRate);
    case "rate_high":
      return list.sort((a, b) => b.dailyRate - a.dailyRate);
    case "condition":
      return list.sort((a, b) => b.condition - a.condition);
    case "relevance":
    default:
      return list;
  }
}

export function suggestAlternatives(resource, allResources) {
  return allResources
    .filter((r) => r.id !== resource.id && r.category === resource.category)
    .slice(0, 3);
}
