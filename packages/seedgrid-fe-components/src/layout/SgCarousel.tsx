"use client";

import React from "react";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";

export type SgCarouselOrientation = "horizontal" | "vertical";

export interface SgCarouselProps {
  /** Unique identifier for the carousel */
  id?: string;
  /** Items to display in the carousel */
  items: React.ReactNode[];
  /** Number of items to display at once */
  numVisible?: number;
  /** Number of items to scroll at a time */
  numScroll?: number;
  /** Orientation of the carousel */
  orientation?: SgCarouselOrientation;
  /** Enable circular mode (infinite loop) */
  circular?: boolean;
  /** Enable auto play */
  autoPlay?: boolean;
  /** Auto play interval in milliseconds */
  autoPlayInterval?: number;
  /** Show navigation buttons */
  showNavigators?: boolean;
  /** Show indicators (dots) */
  showIndicators?: boolean;
  /** Custom class name for container */
  className?: string;
  /** Custom class name for items */
  itemClassName?: string;
  /** Width of the carousel container */
  width?: number | string;
  /** Height of the carousel container */
  height?: number | string;
  /** Gap between items in pixels */
  gap?: number;
  /** Callback when active index changes */
  onIndexChange?: (index: number) => void;
  /** Custom render for navigation buttons */
  customNavigators?: {
    prev?: React.ReactNode;
    next?: React.ReactNode;
  };
}

export function SgCarousel(props: SgCarouselProps) {
  const {
    id,
    items,
    numVisible = 1,
    numScroll = 1,
    orientation = "horizontal",
    circular = true,
    autoPlay = false,
    autoPlayInterval = 3000,
    showNavigators = true,
    showIndicators = true,
    className = "",
    itemClassName = "",
    width = "100%",
    height,
    gap = 16,
    onIndexChange,
    customNavigators
  } = props;

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(items.length / numScroll);
  const isHorizontal = orientation === "horizontal";

  // Auto play logic
  React.useEffect(() => {
    if (autoPlay && !isHovered) {
      timerRef.current = setInterval(() => {
        handleNext();
      }, autoPlayInterval);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [autoPlay, autoPlayInterval, isHovered, activeIndex]);

  const handleNext = () => {
    setActiveIndex((prev) => {
      const next = prev + numScroll;
      if (next >= items.length) {
        return circular ? 0 : prev;
      }
      const newIndex = next;
      onIndexChange?.(newIndex);
      return newIndex;
    });
  };

  const handlePrev = () => {
    setActiveIndex((prev) => {
      const next = prev - numScroll;
      if (next < 0) {
        return circular ? Math.max(0, items.length - numScroll) : 0;
      }
      const newIndex = next;
      onIndexChange?.(newIndex);
      return newIndex;
    });
  };

  const handleIndicatorClick = (index: number) => {
    setActiveIndex(index * numScroll);
    onIndexChange?.(index * numScroll);
  };

  const canGoPrev = circular || activeIndex > 0;
  const canGoNext = circular || activeIndex + numVisible < items.length;

  const getTransformValue = () => {
    const itemSize = 100 / numVisible;
    const offset = (activeIndex * itemSize);
    return isHorizontal
      ? `translateX(-${offset}%)`
      : `translateY(-${offset}%)`;
  };

  const NavButton = ({
    direction,
    onClick,
    disabled
  }: {
    direction: "prev" | "next";
    onClick: () => void;
    disabled: boolean;
  }) => {
    const isPrev = direction === "prev";
    const Icon = isHorizontal
      ? isPrev ? ChevronLeft : ChevronRight
      : isPrev ? ChevronUp : ChevronDown;

    const customButton = isPrev ? customNavigators?.prev : customNavigators?.next;

    if (customButton) {
      return (
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className={`
            absolute z-10 flex items-center justify-center transition-all
            ${disabled ? "opacity-30 cursor-not-allowed" : "hover:opacity-100 cursor-pointer"}
            ${isHorizontal
              ? `top-1/2 -translate-y-1/2 ${isPrev ? "left-2" : "right-2"}`
              : `left-1/2 -translate-x-1/2 ${isPrev ? "top-2" : "bottom-2"}`
            }
          `}
        >
          {customButton}
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`
          absolute z-10 flex h-10 w-10 items-center justify-center rounded-full
          bg-white/90 shadow-lg opacity-70 transition-all
          ${disabled ? "opacity-30 cursor-not-allowed" : "hover:opacity-100 hover:bg-white cursor-pointer"}
          ${isHorizontal
            ? `top-1/2 -translate-y-1/2 ${isPrev ? "left-2" : "right-2"}`
            : `left-1/2 -translate-x-1/2 ${isPrev ? "top-2" : "bottom-2"}`
          }
        `}
      >
        <Icon className="h-6 w-6 text-foreground" />
      </button>
    );
  };

  return (
    <div
      id={id}
      className={`relative ${className}`}
      style={{ width, height }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Navigation buttons */}
      {showNavigators && (
        <>
          <NavButton direction="prev" onClick={handlePrev} disabled={!canGoPrev} />
          <NavButton direction="next" onClick={handleNext} disabled={!canGoNext} />
        </>
      )}

      {/* Carousel container */}
      <div
        ref={containerRef}
        className={`
          overflow-hidden rounded-lg
          ${isHorizontal ? "h-full" : "w-full"}
        `}
      >
        <div
          className={`
            flex transition-transform duration-500 ease-in-out
            ${isHorizontal ? "flex-row" : "flex-col"}
          `}
          style={{
            transform: getTransformValue(),
            gap: `${gap}px`
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className={`
                flex-shrink-0
                ${itemClassName}
              `}
              style={{
                width: isHorizontal ? `calc((100% - ${gap * (numVisible - 1)}px) / ${numVisible})` : "100%",
                height: isHorizontal ? "100%" : `calc((100% - ${gap * (numVisible - 1)}px) / ${numVisible})`
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Indicators */}
      {showIndicators && (
        <div
          className={`
            absolute flex gap-2 z-10
            ${isHorizontal
              ? "bottom-4 left-1/2 -translate-x-1/2 flex-row"
              : "right-4 top-1/2 -translate-y-1/2 flex-col"
            }
          `}
        >
          {Array.from({ length: totalPages }).map((_, index) => {
            const isActive = Math.floor(activeIndex / numScroll) === index;
            return (
              <button
                key={index}
                type="button"
                onClick={() => handleIndicatorClick(index)}
                className={`
                  transition-all
                  ${isHorizontal ? "h-2" : "w-2"}
                  ${isActive
                    ? `${isHorizontal ? "w-8" : "h-8"} bg-primary`
                    : `${isHorizontal ? "w-2" : "h-2"} bg-white/60 hover:bg-white/80`
                  }
                  rounded-full
                `}
                aria-label={`Go to slide ${index + 1}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
