"use client";
import { useEffect, useId } from "react";

declare global {
  interface Window {
    hbspt?: {
      forms: { create: (config: Record<string, unknown>) => void };
    };
  }
}

export default function HubSpotForm({ formId }: { formId: string }) {
  const uid = useId().replace(/:/g, "");
  const containerId = `hs-form-${uid}`;

  useEffect(() => {
    function initForm() {
      window.hbspt?.forms.create({
        portalId: "27137020",
        formId,
        region: "eu1",
        target: `#${containerId}`,
      });
    }

    if (window.hbspt) {
      initForm();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src*="hsforms.net"]'
    );
    if (existing) {
      existing.addEventListener("load", initForm);
      return () => existing.removeEventListener("load", initForm);
    }

    const script = document.createElement("script");
    script.src = "//js-eu1.hsforms.net/forms/embed/v2.js";
    script.charset = "utf-8";
    script.type = "text/javascript";
    script.onload = initForm;
    document.head.appendChild(script);
  }, [formId, containerId]);

  return <div id={containerId} />;
}
