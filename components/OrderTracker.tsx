// FILE: apps/web/components/OrderTracker.tsx
// Visual status stepper — shows current order stage with animated active step

"use client";

import type    { Order, OrderStatus } from "@/lib/types";

const STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  { status: "pending_payment", label: "Order placed", desc: "Waiting for payment confirmation" },
  { status: "paid",           label: "Payment confirmed", desc: "Your payment was received" },
  { status: "printing",       label: "Printing",   desc: "Your document is printing now" },
  { status: "completed",      label: "Ready",      desc: "Your printout is ready to collect" },
];

const     STATUS_ORDER: OrderStatus[] = ["pending_payment", "paid", "printing", "completed"];

interface Props {
  order: Order;
}

export default function OrderTracker({ order }: Props) {
  const currentIdx = STATUS_ORDER.indexOf(order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <div>
      {/* Order meta */}
      <div className="bg-[#1a1916] border border-[#2e2c28] rounded-xl p-4 mb-6">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-[#6b6860] mb-0.5">File</p>
            <p className="font-bold truncate">{order.fileName}</p>
          </div>
          <div>
            <p className="text-[#6b6860] mb-0.5">Amount</p>
            <p className="font-bold">₹{order.totalAmount}</p>
          </div>
          <div>
            <p className="text-[#6b6860] mb-0.5">Copies</p>
            <p className="font-bold">{order.copies}</p>
          </div>
          <div>
            <p className="text-[#6b6860] mb-0.5">Payment</p>
            <p className="font-bold capitalize">{order.paymentMode}</p>
          </div>
        </div>
      </div>

      {/* Cancelled state */}
      {isCancelled && (
        <div className="bg-red-900/20 border border-red-800/40 rounded-xl p-4 text-center">
          <p className="text-red-400 font-bold text-sm">Order Cancelled</p>
          <p className="text-red-700 text-xs mt-1">This order has been cancelled.</p>
        </div>
      )}

      {/* Status steps */}
      {!isCancelled && (
        <div className="space-y-2">
          {STEPS.map((step, i) => {
            const done = i < currentIdx;
            const active = i === currentIdx;
            const upcoming = i > currentIdx;

            return (
              <div
                key={step.status}
                className={`border rounded-xl p-4 flex items-center gap-4 transition-all ${
                  active
                    ? "border-[#e8642a] bg-[#e8642a]/5"
                    : done
                    ? "border-green-800/40 bg-green-900/10"
                    : "border-[#2e2c28] bg-[#1a1916]"
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    active
                      ? "bg-[#e8642a] text-white"
                      : done
                      ? "bg-green-800/40 text-green-400"
                      : "bg-[#0f0e0c] border border-[#2e2c28] text-[#3d3b36]"
                  }`}
                >
                  {done ? "✓" : active ? (
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  ) : (
                    i + 1
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold ${upcoming ? "text-[#3d3b36]" : ""}`}>
                    {step.label}
                  </p>
                  <p className={`text-xs ${active ? "text-[#a09c90]" : upcoming ? "text-[#2e2c28]" : "text-[#6b6860]"}`}>
                    {step.desc}
                  </p>
                </div>

                {active && (
                  <div className="text-[#e8642a] text-xs shrink-0 animate-pulse">
                    ● Live
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Completed CTA */}
      {order.status === "completed" && (
        <div className="mt-6 bg-green-900/10 border border-green-800/40 rounded-xl p-5 text-center">
          <p className="text-green-300 font-bold text-base mb-1">Ready to collect! 🎉</p>
          <p className="text-green-700 text-xs">Show this screen at the counter.</p>
        </div>
      )}

      <p className="text-[#3d3b36] text-xs text-center mt-6">
        Updates every 5 seconds automatically
      </p>
    </div>
  );
}
