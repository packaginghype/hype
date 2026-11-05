import { SafeImage } from "@/components/ui/SafeImage";
import { RichText } from "@/components/ui/RichText";
import { Button } from "@/components/ui/Button";
import {
  isDarkWidgetStyle,
  widgetShellClass,
  widgetShellInlineStyle,
  type PageWidget,
  type WidgetStyle,
} from "@/lib/page-widgets";
import { cn } from "@/lib/utils";

function ColumnCard({
  title,
  html,
  imageSrc,
  imageAlt,
  dark,
}: {
  title?: string | null;
  html?: string | null;
  imageSrc?: string | null;
  imageAlt?: string | null;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-2xl border",
        dark
          ? "border-white/15 bg-white/5"
          : "border-[#E8EAEF] bg-white"
      )}
    >
      {imageSrc ? (
        <div className="relative aspect-[4/3] w-full bg-[#F6F8FA]">
          <SafeImage
            src={imageSrc}
            alt={imageAlt || title || ""}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-2 p-5">
        {title ? (
          <h3
            className={cn(
              "text-lg font-bold",
              dark ? "text-white" : "text-[#172455]"
            )}
          >
            {title}
          </h3>
        ) : null}
        {html ? (
          <div className={dark ? "prose-invert" : undefined}>
            <RichText html={html} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Shell({
  style,
  className,
  children,
}: {
  style?: WidgetStyle | null;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(widgetShellClass(style), className)}
      style={widgetShellInlineStyle(style)}
    >
      {children}
    </div>
  );
}

function aspectClass(aspect?: string) {
  switch (aspect) {
    case "wide":
      return "aspect-[21/9]";
    case "square":
      return "aspect-square";
    case "auto":
      return "aspect-auto min-h-[200px]";
    default:
      return "aspect-[16/9]";
  }
}

export function PageWidgets({
  widgets,
  className,
}: {
  widgets: PageWidget[];
  className?: string;
}) {
  if (!widgets.length) return null;

  return (
    <div className={cn("space-y-6 sm:space-y-8", className)}>
      {widgets.map((widget) => {
        const dark = isDarkWidgetStyle(widget.style);

        switch (widget.type) {
          case "heroBanner": {
            const tone =
              widget.tone === "navy"
                ? "bg-[#172455] text-white"
                : widget.tone === "blue"
                  ? "bg-[#EEF6FF] text-[#172455]"
                  : widget.tone === "soft"
                    ? "bg-[#F6F8FA] text-[#172455]"
                    : "bg-[#E8F5F2] text-[#172455]";
            return (
              <Shell key={widget.id} style={widget.style} className="!p-0 overflow-hidden">
                <div
                  className={cn(
                    "grid items-center gap-6 p-6 sm:gap-8 sm:p-8 lg:grid-cols-2 lg:p-10",
                    tone,
                    widget.style?.align === "center" && "text-center lg:text-left"
                  )}
                >
                  <div className="space-y-3">
                    {widget.eyebrow ? (
                      <p
                        className={cn(
                          "text-xs font-bold uppercase tracking-wider",
                          widget.tone === "navy" ? "text-[#21AAA5]" : "text-[#21AAA5]"
                        )}
                      >
                        {widget.eyebrow}
                      </p>
                    ) : null}
                    {widget.title ? (
                      <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                        {widget.title}
                      </h2>
                    ) : null}
                    {widget.text ? (
                      <p
                        className={cn(
                          "text-sm leading-relaxed sm:text-base",
                          widget.tone === "navy" ? "text-white/80" : "text-[#4B5563]"
                        )}
                      >
                        {widget.text}
                      </p>
                    ) : null}
                    {widget.buttonLabel && widget.buttonHref ? (
                      <div className="pt-2">
                        <Button href={widget.buttonHref} variant="primary" size="lg">
                          {widget.buttonLabel}
                        </Button>
                      </div>
                    ) : null}
                  </div>
                  {widget.imageSrc ? (
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-black/5">
                      <SafeImage
                        src={widget.imageSrc}
                        alt={widget.imageAlt || widget.title || ""}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  ) : null}
                </div>
              </Shell>
            );
          }

          case "richText":
            return (
              <Shell key={widget.id} style={widget.style}>
                <div className="space-y-3">
                  {widget.title ? (
                    <h2
                      className={cn(
                        "text-2xl font-extrabold tracking-tight",
                        dark ? "text-white" : "text-[#172455]"
                      )}
                    >
                      {widget.title}
                    </h2>
                  ) : null}
                  {widget.html ? <RichText html={widget.html} /> : null}
                </div>
              </Shell>
            );

          case "image":
            if (!widget.src) return null;
            return (
              <Shell key={widget.id} style={widget.style}>
                <figure>
                  <div
                    className={cn(
                      "relative w-full overflow-hidden bg-[#F6F8FA]",
                      widget.style?.radius !== "none" && "rounded-xl",
                      aspectClass(widget.aspect)
                    )}
                  >
                    <SafeImage
                      src={widget.src}
                      alt={widget.alt || ""}
                      fill
                      className={
                        widget.aspect === "auto" ? "object-contain" : "object-cover"
                      }
                      sizes="(max-width: 1024px) 100vw, 1100px"
                    />
                  </div>
                  {widget.caption ? (
                    <figcaption
                      className={cn(
                        "mt-2 text-sm",
                        widget.style?.align === "center" ? "text-center" : "",
                        dark ? "text-white/70" : "text-[#6B7280]"
                      )}
                    >
                      {widget.caption}
                    </figcaption>
                  ) : null}
                </figure>
              </Shell>
            );

          case "imageText":
            return (
              <Shell key={widget.id} style={widget.style}>
                <div
                  className={cn(
                    "grid items-center gap-6 sm:gap-8 lg:grid-cols-2",
                    widget.imageSide === "right" &&
                      "[&>*:first-child]:lg:order-2"
                  )}
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#F6F8FA]">
                    {widget.imageSrc ? (
                      <SafeImage
                        src={widget.imageSrc}
                        alt={widget.imageAlt || widget.title || ""}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    ) : null}
                  </div>
                  <div className="space-y-3">
                    {widget.title ? (
                      <h2
                        className={cn(
                          "text-2xl font-extrabold tracking-tight",
                          dark ? "text-white" : "text-[#172455]"
                        )}
                      >
                        {widget.title}
                      </h2>
                    ) : null}
                    {widget.html ? <RichText html={widget.html} /> : null}
                  </div>
                </div>
              </Shell>
            );

          case "columns2":
            return (
              <Shell key={widget.id} style={widget.style}>
                <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                  <ColumnCard {...widget.left} dark={dark} />
                  <ColumnCard {...widget.right} dark={dark} />
                </div>
              </Shell>
            );

          case "columns3":
            return (
              <Shell key={widget.id} style={widget.style}>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {widget.columns.map((col, i) => (
                    <ColumnCard
                      key={`${widget.id}-${i}`}
                      {...col}
                      dark={dark}
                    />
                  ))}
                </div>
              </Shell>
            );

          case "gallery": {
            const images = widget.images.filter((img) => img.src);
            if (!images.length) return null;
            const cols =
              widget.columns === "2"
                ? "grid-cols-2"
                : widget.columns === "3"
                  ? "grid-cols-2 sm:grid-cols-3"
                  : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";
            return (
              <Shell key={widget.id} style={widget.style}>
                <div className={cn("grid gap-3 sm:gap-4", cols)}>
                  {images.map((img, i) => (
                    <div
                      key={`${widget.id}-${i}`}
                      className="relative aspect-square overflow-hidden rounded-xl bg-[#F6F8FA]"
                    >
                      <SafeImage
                        src={img.src}
                        alt={img.alt || ""}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    </div>
                  ))}
                </div>
              </Shell>
            );
          }

          case "cta": {
            const tone =
              widget.tone === "teal"
                ? "bg-[#E8F5F2] text-[#172455]"
                : widget.tone === "coral"
                  ? "bg-[#FFF5F4] text-[#172455]"
                  : widget.tone === "soft"
                    ? "bg-[#F6F8FA] text-[#172455]"
                    : "bg-[#172455] text-white";
            const muted =
              widget.tone === "navy" ? "text-white/80" : "text-[#4B5563]";
            return (
              <Shell key={widget.id} style={widget.style} className="!p-0">
                <div
                  className={cn(
                    "rounded-2xl px-6 py-8 sm:px-10 sm:py-10",
                    tone,
                    widget.style?.align === "center" ? "text-center" : "text-left"
                  )}
                >
                  {widget.eyebrow ? (
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#21AAA5]">
                      {widget.eyebrow}
                    </p>
                  ) : null}
                  {widget.title ? (
                    <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                      {widget.title}
                    </h2>
                  ) : null}
                  {widget.text ? (
                    <p
                      className={cn(
                        "mt-3 max-w-2xl text-sm leading-relaxed sm:text-base",
                        muted,
                        widget.style?.align === "center" && "mx-auto"
                      )}
                    >
                      {widget.text}
                    </p>
                  ) : null}
                  {widget.buttonLabel && widget.buttonHref ? (
                    <div className="mt-6">
                      <Button href={widget.buttonHref} variant="primary" size="lg">
                        {widget.buttonLabel}
                      </Button>
                    </div>
                  ) : null}
                </div>
              </Shell>
            );
          }

          case "divider":
            return widget.dividerStyle === "space" ? (
              <div key={widget.id} className="h-6 sm:h-10" aria-hidden />
            ) : (
              <hr
                key={widget.id}
                className="border-0 border-t border-[#E5E7EB]"
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
