// FILE: apps/web/lib/price.ts
// Price calculation logic — single source of truth for frontend estimates.
// Backend recalculates independently; this is for live UI display only.

import type   { PrintConfig } from "@/lib/types";

// Pricing constants — keep in sync with backend order.service.ts
const BW_PER_PAGE = 1;    // ₹1 per B&W page
const COLOR_PER_PAGE = 6; // ₹6 per colour page

interface PriceLine {
  label: string;
  amount: number;
}

interface PriceResult {
  perPageCost: number;
  subtotal: number;
  total: number;
  breakdown: PriceLine[];
}

export function calculatePrice(config: PrintConfig): PriceResult {
  const perPageCost = config.colour ? COLOR_PER_PAGE : BW_PER_PAGE;
  const subtotal = perPageCost * config.pages * config.copies;

  const breakdown: PriceLine[] = [
    {
      label: `${config.pages} page${config.pages > 1 ? "s" : ""} × ${config.copies} cop${config.copies > 1 ? "ies" : "y"} × ₹${perPageCost}`,
      amount: subtotal,
    },
  ];

  // Duplex discount: 10% off if double-sided (saves paper)
  let total = subtotal;
  if (config.duplex && config.pages > 1) {
    const discount = Math.round(subtotal * 0.1);
    breakdown.push({ label: "Duplex discount (−10%)", amount: -discount });
    total -= discount;
  }

  return { perPageCost, subtotal, total, breakdown };
}
