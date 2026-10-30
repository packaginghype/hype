"use client";

import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, X, ArrowRight, GripVertical } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import type { ProductItem } from "@/types";

interface ProductFloatingVideoProps {
  product: ProductItem;
  videoUrl: string;
  posterUrl?: string;
  description?: string;
  startingPrice?: string;
}

export function ProductFloatingVideo({
  product,
  videoUrl,
  posterUrl,
  description,
  startingPrice,
}: ProductFloatingVideoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);

  // Stored state for position so it NEVER resets to top-left on modal close
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  const asideRef = useRef<HTMLElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const currentPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragStart = useRef<{
    pointerX: number;
    pointerY: number;
    posX: number;
    posY: number;
    hasMoved: boolean;
  }>({
    pointerX: 0,
    pointerY: 0,
    posX: 0,
    posY: 0,
    hasMoved: false,
  });
  const rafId = useRef<number | null>(null);

  // Default position at bottom-right corner on mount
  useEffect(() => {
    const updateDefaultPos = () => {
      const margin = 20;
      const widgetWidth = window.innerWidth < 640 ? 116 : 132;
      const widgetHeight = window.innerWidth < 640 ? 184 : 214;
      const defaultX = Math.max(10, window.innerWidth - widgetWidth - margin);
      const defaultY = Math.max(10, window.innerHeight - widgetHeight - margin);

      setPosition((prev) => {
        if (!prev) {
          currentPos.current = { x: defaultX, y: defaultY };
          return { x: defaultX, y: defaultY };
        }
        // Keep within new viewport bounds on resize
        const clampedX = Math.min(prev.x, window.innerWidth - widgetWidth - 8);
        const clampedY = Math.min(prev.y, window.innerHeight - widgetHeight - 8);
        currentPos.current = { x: clampedX, y: clampedY };
        return { x: clampedX, y: clampedY };
      });
    };

    updateDefaultPos();
    window.addEventListener("resize", updateDefaultPos);
    return () => window.removeEventListener("resize", updateDefaultPos);
  }, []);

  // Ensure preview video autoplay starts reliably and muted
  useEffect(() => {
    if (previewVideoRef.current && videoUrl) {
      previewVideoRef.current.muted = true;
      previewVideoRef.current.defaultMuted = true;
      previewVideoRef.current.play().catch(() => { });
    }
  }, [videoUrl]);

  // Modal open/close video lifecycle (only triggers when modal opens or closes)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (modalVideoRef.current) {
        modalVideoRef.current.currentTime = 0;
        modalVideoRef.current.muted = isMuted;
        modalVideoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    } else {
      document.body.style.overflow = "";
      if (modalVideoRef.current) {
        modalVideoRef.current.pause();
        setIsPlaying(false);
      }
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted((prev) => {
      const next = !prev;
      if (modalVideoRef.current) {
        modalVideoRef.current.muted = next;
      }
      return next;
    });
  };

  // Hold & drag logic with 0% scale / 0% zoom — completely stable 1:1 movement
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button[data-close]")) return;

    e.preventDefault();

    dragStart.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      posX: currentPos.current.x,
      posY: currentPos.current.y,
      hasMoved: false,
    };

    if (asideRef.current) {
      asideRef.current.style.transition = "none";
    }

    const onPointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - dragStart.current.pointerX;
      const dy = moveEvent.clientY - dragStart.current.pointerY;

      if (!dragStart.current.hasMoved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
        dragStart.current.hasMoved = true;
      }

      const widgetWidth = window.innerWidth < 640 ? 116 : 132;
      const widgetHeight = window.innerWidth < 640 ? 184 : 214;
      const maxX = window.innerWidth - widgetWidth - 8;
      const maxY = window.innerHeight - widgetHeight - 8;

      const newX = Math.max(8, Math.min(maxX, dragStart.current.posX + dx));
      const newY = Math.max(8, Math.min(maxY, dragStart.current.posY + dy));

      currentPos.current = { x: newX, y: newY };

      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        if (asideRef.current) {
          asideRef.current.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
        }
      });
    };

    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);

      // Persist final position in state so it never jumps
      setPosition({ x: currentPos.current.x, y: currentPos.current.y });

      if (asideRef.current) {
        asideRef.current.style.transition = "transform 0.15s ease-out";
      }

      // If clicked without moving, open modal
      if (!dragStart.current.hasMoved) {
        setIsOpen(true);
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: false });
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
  };

  const togglePlay = () => {
    if (!modalVideoRef.current) return;
    if (modalVideoRef.current.paused) {
      modalVideoRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
    } else {
      modalVideoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Professional slim timeline seek handler
  const seekToPosition = (clientX: number) => {
    if (!timelineRef.current || !modalVideoRef.current || !duration) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newTime = ratio * duration;
    modalVideoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleTimelinePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsScrubbing(true);
    seekToPosition(e.clientX);

    const onMove = (moveEvt: PointerEvent) => {
      seekToPosition(moveEvt.clientX);
    };

    const onUp = () => {
      setIsScrubbing(false);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const handleScrollToQuote = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
    const quoteElement = document.getElementById("product-quote");
    if (quoteElement) {
      quoteElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!videoUrl || isDismissed) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Draggable Floating Video Reel Widget — Permanently Mounted in DOM to Prevent Position Resets */}
      <aside
        ref={asideRef}
        aria-label="Floating product video"
        onPointerDown={handlePointerDown}
        style={{
          transform: position
            ? `translate3d(${position.x}px, ${position.y}px, 0)`
            : "translate3d(-9999px, -9999px, 0)",
          touchAction: "none",
          willChange: "transform",
          background: "transparent",
          backgroundColor: "transparent",
          visibility: isOpen || !position ? "hidden" : "visible",
          pointerEvents: isOpen || !position ? "none" : "auto",
        }}
        className="fixed left-0 top-0 z-40 select-none cursor-grab active:cursor-grabbing bg-transparent"
      >
        <div className="relative flex h-[184px] w-[116px] flex-col overflow-hidden rounded-[18px] bg-black shadow-[0_16px_38px_rgba(0,0,0,0.4)] sm:h-[214px] sm:w-[132px]">
          {/* Direct video tag with source elements for reliable playback */}
          <video
            ref={previewVideoRef}
            poster={posterUrl || undefined}
            muted
            autoPlay
            loop
            playsInline
            preload="auto"
            className="pointer-events-none h-full w-full object-cover"
          >
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl} />
          </video>

          {/* Play Button Overlay — Stable with no zoom */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25">
            <span className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/95 text-[#172455] shadow-lg backdrop-blur-sm">
              <Play className="ml-0.5 h-5 w-5 fill-current" />
            </span>
          </div>

          {/* Top Bar with Drag Handle & Close Button */}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-2">
            <span
              title="Hold & drag to move"
              className="flex h-5 w-5 items-center justify-center rounded-full bg-black/55 text-white/90 backdrop-blur-sm"
            >
              <GripVertical className="h-3 w-3" />
            </span>
            <button
              data-close
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsDismissed(true);
              }}
              aria-label="Close floating video"
              className="flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-85 backdrop-blur-sm transition-opacity hover:opacity-100 hover:bg-black"
            >
              <X className="h-3 w-3" />
            </button>
          </div>

          {/* Bottom Title Pill */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2 text-center">
            <p className="truncate text-[10.5px] font-bold tracking-tight text-white drop-shadow">
              Watch Video
            </p>
          </div>
        </div>
      </aside>

      {/* Expanded Interactive Video Modal with Professional Slim Timeline at the Very Bottom */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 backdrop-blur-md animate-in fade-in duration-200 sm:p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex h-[640px] max-h-[92vh] w-full max-w-[420px] flex-col overflow-hidden rounded-[22px] bg-black shadow-2xl animate-in zoom-in-95 duration-200 border border-white/10"
          >
            {/* Top Bar inside modal */}
            <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/85 via-black/50 to-transparent p-4">
              <div className="min-w-0 pr-3">
                <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-white/70">
                  {product.categoryName}
                </p>
                <h3 className="truncate text-sm font-bold text-white drop-shadow">
                  {product.name}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/80"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close video"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/80"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Video Player (Click to toggle play/pause) */}
            <div
              onClick={togglePlay}
              className="relative flex h-full w-full cursor-pointer items-center justify-center bg-black"
            >
              <video
                ref={modalVideoRef}
                poster={posterUrl || undefined}
                muted={isMuted}
                autoPlay
                loop
                playsInline
                onTimeUpdate={() => setCurrentTime(modalVideoRef.current?.currentTime || 0)}
                onLoadedMetadata={() => setDuration(modalVideoRef.current?.duration || 0)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="max-h-full max-w-full object-contain"
              >
                <source src={videoUrl} type="video/mp4" />
                <source src={videoUrl} />
              </video>

              {/* Pause indicator on center tap */}
              {!isPlaying && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-[#172455] shadow-2xl">
                    <Play className="ml-1 h-7 w-7 fill-current" />
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Overlay with Description, Product Card, and Flush Timeline Bar */}
            <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-8">
              <div className="px-4 pb-3">
                {description ? (
                  <p className="mb-2.5 line-clamp-2 text-xs leading-relaxed text-white/90">
                    {description}
                  </p>
                ) : null}

                {/* Product Info Bar */}
                <div className="flex items-center justify-between gap-3 rounded-[12px] border border-white/15 bg-white/10 p-2.5 backdrop-blur-md">
                  <div className="flex min-w-0 items-center gap-2.5">
                    {product.imageUrl ? (
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-[8px] bg-white">
                        <SafeImage
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                    ) : null}
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-white">
                        {product.name}
                      </p>
                      {startingPrice && startingPrice !== "Contact" ? (
                        <p className="text-[11px] font-semibold text-[#FF5548]">
                          Starting from {startingPrice}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleScrollToQuote}
                    className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-[8px] bg-[#FF5548] px-3.5 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-[#e04337]"
                  >
                    Get Quote
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Slim Professional Progress Bar (Flush at the Very Bottom Edge) */}
              <div
                ref={timelineRef}
                onPointerDown={handleTimelinePointerDown}
                className="group/timeline relative w-full cursor-pointer py-1 select-none"
              >
                {/* Track */}
                <div className={`relative w-full bg-white/20 transition-all duration-200 ${isScrubbing ? "h-2 bg-white/30" : "h-1 group-hover/timeline:h-2"
                  }`}>
                  {/* Progress Fill */}
                  <div
                    className="h-full bg-[#FF5548] relative"
                    style={{ width: `${progressPercent}%` }}
                  >
                    {/* Scrubber Knob on Hover / Drag */}
                    <span className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-3.5 w-3.5 rounded-full bg-[#FF5548] border-2 border-white shadow-md transition-opacity duration-150 ${isScrubbing ? "opacity-100 scale-110" : "opacity-0 group-hover/timeline:opacity-100"
                      }`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
