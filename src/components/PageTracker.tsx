"use client";

import { useEffect, useRef } from "react";
import { trackPageView } from "@/lib/analytics";

interface PageTrackerProps {
  page: string;
}

/**
 * Client component that tracks page views
 * Can be included in server components to add analytics tracking
 */
export default function PageTracker({ page }: PageTrackerProps) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!hasTracked.current) {
      trackPageView(page);
      hasTracked.current = true;
    }
  }, [page]);

  return null;
}
