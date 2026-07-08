import type { ReactNode } from "react";
import { KALASH_VIEW } from "@/kalash/lib/kalash-view-tokens";

interface ViewContainerProps {
  /** Top chrome — header row, status-adjacent UI */
  header?: ReactNode;
  /** Scrollable primary content column */
  children?: ReactNode;
  /** Pinned bottom tab bar */
  bottomNav?: ReactNode;
  className?: string;
}

/**
 * Semantic layout shell for the Kalash home view.
 * iPhone 17 viewport (393×852) with stacked regions and strict overflow clipping.
 */
export function ViewContainer({
  header,
  children,
  bottomNav,
  className = "",
}: ViewContainerProps) {
  const { viewport, color, space } = KALASH_VIEW;

  return (
    <main
      className={`relative flex h-full min-h-0 w-full max-w-full flex-col overflow-hidden antialiased ${className}`.trim()}
      style={{
        maxWidth: viewport.width,
        borderRadius: viewport.screenRadiusPx,
      }}
      aria-label="Kalash app home screen"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute inset-0"
          style={{ backgroundColor: color.surface }}
        />
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <section
          className="no-scrollbar relative z-10 min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain"
          style={
            bottomNav
              ? {
                  paddingBottom:
                    space.bottomNavHeight + space.safeAreaBottom,
                }
              : undefined
          }
          aria-label="App content"
        >
          {header ? (
            <header className="kalash-glass-chrome sticky top-0 z-30 shrink-0">
              {header}
            </header>
          ) : null}
          <div className="flex flex-col">{children}</div>
        </section>

        {bottomNav ? (
          <nav
            className="absolute inset-x-0 bottom-0 z-20 shrink-0 overflow-hidden bg-white"
            style={{ paddingBottom: space.safeAreaBottom }}
            aria-label="Primary navigation"
          >
            {bottomNav}
          </nav>
        ) : null}
      </div>
    </main>
  );
}
