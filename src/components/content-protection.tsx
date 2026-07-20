"use client";

import { useEffect } from "react";

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
 * Soft content protection: blocks casual copy, save, print, and image drag.
 * OS screenshots and determined users cannot be stopped from a webpage.
 */
export function ContentProtection() {
  useEffect(() => {
    document.documentElement.classList.add("content-protected");

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
      document.documentElement.classList.remove("content-protected");
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
