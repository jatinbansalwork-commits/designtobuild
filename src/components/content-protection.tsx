"use client";

import { useEffect } from "react";
import { useScreenshotDetection } from "camerashy";
import { mountPrintStyle, unmountPrintStyle } from "camerashy/core";

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.closest("[data-allow-copy]")) return true;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

function isModified(event: KeyboardEvent) {
  return event.metaKey || event.ctrlKey;
}

/**
 * Soft content protection + camerashy screenshot shielding.
 * Blurs the page on screenshot shortcuts (visual deterrent only).
 */
export function ContentProtection() {
  const shielded = useScreenshotDetection({ sensitivity: "balanced" });

  useEffect(() => {
    mountPrintStyle();
    return () => unmountPrintStyle();
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("content-protected");
    return () => document.documentElement.classList.remove("content-protected");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("camerashy-shielded", shielded);
    return () => document.documentElement.classList.remove("camerashy-shielded");
  }, [shielded]);

  useEffect(() => {
    const onContextMenu = (event: MouseEvent) => {
      if (isEditableTarget(event.target)) return;
      event.preventDefault();
    };

    const onCopyCut = (event: ClipboardEvent) => {
      if (isEditableTarget(event.target)) return;
      event.preventDefault();
    };

    const onDragStart = (event: DragEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (isEditableTarget(target)) return;
      if (target.closest("img, picture, video, a[href], [draggable='true']")) {
        event.preventDefault();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return;
      if (!isModified(event)) return;

      const key = event.key.toLowerCase();
      // Copy / cut / select-all / save / print / view-source
      if (["c", "x", "a", "s", "p", "u"].includes(key)) {
        event.preventDefault();
      }
    };

    const onBeforePrint = (event: Event) => {
      event.preventDefault();
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("copy", onCopyCut);
    document.addEventListener("cut", onCopyCut);
    document.addEventListener("dragstart", onDragStart);
    document.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("beforeprint", onBeforePrint);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("copy", onCopyCut);
      document.removeEventListener("cut", onCopyCut);
      document.removeEventListener("dragstart", onDragStart);
      document.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("beforeprint", onBeforePrint);
    };
  }, []);

  return null;
}
