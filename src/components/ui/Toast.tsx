"use client";

import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  type?: ToastType;
  title: string;
  description?: string;
}

const toastStyles: Record<
  ToastType,
  { icon: typeof CheckCircle; iconClass: string; borderClass: string }
> = {
  success: {
    icon: CheckCircle,
    iconClass: "text-success",
    borderClass: "border-success-border",
  },
  error: {
    icon: AlertCircle,
    iconClass: "text-danger",
    borderClass: "border-danger-border",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-warning",
    borderClass: "border-warning-border",
  },
  info: {
    icon: Info,
    iconClass: "text-accent",
    borderClass: "border-border-hover",
  },
};

export function showToast({ type = "info", title, description }: ToastProps) {
  const { icon: Icon, iconClass, borderClass } = toastStyles[type];

  toast.custom((t) => (
    <div
      className={`bg-surface border ${borderClass} flex w-85 items-start gap-3 rounded-xl p-4 text-sm shadow-lg ${t.visible ? "animate-slide-up" : "animate-leave"}`}
    >
      {/* Icon */}
      <div className="mt-0.5">
        <Icon className={iconClass} size={18} />
      </div>

      {/* Text */}
      <div className="flex-1">
        <p className="text-text-primary font-semibold">{title}</p>
        {description && (
          <p className="text-text-muted mt-1 text-xs">{description}</p>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={() => toast.dismiss(t.id)}
        className="text-text-subtle hover:text-text-secondary"
      >
        <X size={16} />
      </button>
    </div>
  ));
}
