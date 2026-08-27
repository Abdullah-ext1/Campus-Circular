// ============================================
// CAMPUS CIRCULAR — API Communication Layer
// Connects to RateMyProfessor/Campus Circular backend with local fallback
// ============================================

import { resources as mockResources, students as mockStudents } from "../data/mockData.js";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Fetch resources from backend or local fallback with filtering & pagination
 */
export async function getCircularResources(params = {}) {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.category && params.category !== "all") query.set("category", params.category);
  if (params.availability && params.availability !== "all") query.set("availability", params.availability);
  if (params.sort) query.set("sort", params.sort);
  if (params.page) query.set("page", params.page);
  if (params.limit) query.set("limit", params.limit);

  try {
    const res = await fetch(`${API_BASE}/api/circular/resources?${query.toString()}`, {
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.data?.items && data.data.items.length > 0) {
        return {
          items: data.data.items,
          pagination: data.data.pagination,
          source: "backend",
        };
      }
    }
  } catch (err) {
    // Backend offline or unreachable — fallback locally
    console.info("Backend not accessible, utilizing campus offline resource catalog.", err.message);
  }

  // Local fallback processing
  let items = [...mockResources];

  if (params.q) {
    const qLower = params.q.toLowerCase();
    items = items.filter(
      (r) =>
        r.name?.toLowerCase().includes(qLower) ||
        r.description?.toLowerCase().includes(qLower) ||
        r.tags?.some((t) => t.toLowerCase().includes(qLower)) ||
        r.category?.toLowerCase().includes(qLower)
    );
  }

  if (params.category && params.category !== "all") {
    items = items.filter((r) => r.category?.toLowerCase() === params.category.toLowerCase());
  }

  if (params.condition && params.condition !== "all") {
    items = items.filter((r) => r.condition?.toLowerCase() === params.condition.toLowerCase());
  }

  if (params.availability && params.availability !== "all") {
    items = items.filter((r) => r.availability === params.availability);
  }

  if (params.maxPrice) {
    items = items.filter((r) => r.dailyRate <= Number(params.maxPrice));
  }

  // Sort
  if (params.sort === "priceLow") {
    items.sort((a, b) => a.dailyRate - b.dailyRate);
  } else if (params.sort === "priceHigh") {
    items.sort((a, b) => b.dailyRate - a.dailyRate);
  } else if (params.sort === "rating") {
    items.sort((a, b) => (b.rating || 5) - (a.rating || 5));
  } else if (params.sort === "trust") {
    items.sort((a, b) => {
      const ownerA = mockStudents.find((s) => s.id === a.ownerId)?.trustScore || 0;
      const ownerB = mockStudents.find((s) => s.id === b.ownerId)?.trustScore || 0;
      return ownerB - ownerA;
    });
  }

  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 12;
  const paginated = items.slice(0, page * limit);

  return {
    items: paginated,
    pagination: {
      page,
      limit,
      total: items.length,
      hasMore: paginated.length < items.length,
    },
    source: "local",
  };
}

/**
 * Fetch single resource by ID
 */
export async function getCircularResourceById(id) {
  try {
    const res = await fetch(`${API_BASE}/api/circular/resources/${id}`, {
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (e) {
    console.info("Fetching single item locally", e.message);
  }

  return mockResources.find((r) => String(r.id) === String(id)) || null;
}

/**
 * Admin API Operations
 */
export async function getAdminOverview() {
  try {
    const res = await fetch(`${API_BASE}/api/circular/admin/overview`, {
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (e) {
    console.info("Admin overview fallback", e.message);
  }

  return {
    totalListings: mockResources.length,
    activeBorrows: 4,
    registeredUsers: mockStudents.length,
    openDisputes: 1,
  };
}
