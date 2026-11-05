"use client";

import {
  ChevronDown,
  ChevronUp,
  Columns2,
  Columns3,
  GalleryHorizontalEnd,
  GripVertical,
  ImageIcon,
  LayoutTemplate,
  Minus,
  PanelTop,
  Plus,
  TextCursorInput,
  Trash2,
  Type,
} from "lucide-react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import {
  COLOR_PRESETS,
  DEFAULT_WIDGET_STYLE,
  WIDGET_BG_OPTIONS,
  WIDGET_CATALOG,
  WIDGET_RADIUS_OPTIONS,
  WIDGET_SHADOW_OPTIONS,
  createEmptyWidget,
  type PageWidget,
  type PageWidgetType,
  type WidgetStyle,
} from "@/lib/page-widgets";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-[6px] border border-[#E2E4E8] bg-white px-3 py-2.5 text-sm font-medium text-[#172455] placeholder:text-[#9CA3AF] outline-none transition-all focus:border-[#FF5548] focus:ring-2 focus:ring-[#FF5548]/10";

const ICONS: Record<PageWidgetType, typeof Type> = {
  richText: Type,
  image: ImageIcon,
  imageText: LayoutTemplate,
  columns2: Columns2,
  columns3: Columns3,
  gallery: GalleryHorizontalEnd,
  cta: TextCursorInput,
  divider: Minus,
  heroBanner: PanelTop,
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#172455]">
      {children}
    </p>
  );
}

function ChipGroup<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-[6px] border px-2.5 py-1 text-[11px] font-bold",
            value === opt.value
              ? "border-[#172455] bg-[#172455] text-white"
              : "border-[#E2E4E8] bg-white text-[#172455] hover:border-[#172455]/40"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string | null;
  onChange: (v: string) => void;
}) {
  const hex = value && /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value)
    ? value.length === 4
      ? `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`
      : value
    : "#ffffff";
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={hex}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-10 cursor-pointer rounded border border-[#E2E4E8] bg-white p-0.5"
        />
        <input
          className={inputClass}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#172455"
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="shrink-0 text-xs font-semibold text-[#6B7280] hover:text-[#FF5548]"
          >
            Clear
          </button>
        ) : null}
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {COLOR_PRESETS.map((c) => (
          <button
            key={`${label}-${c}`}
            type="button"
            title={c}
            onClick={() => onChange(c)}
            className={cn(
              "h-5 w-5 rounded-full border border-black/10",
              value === c && "ring-2 ring-[#172455] ring-offset-1"
            )}
            style={{ background: c }}
          />
        ))}
      </div>
    </div>
  );
}

function WidgetStyleEditor({
  style,
  onChange,
}: {
  style?: WidgetStyle | null;
  onChange: (next: WidgetStyle) => void;
}) {
  const s = { ...DEFAULT_WIDGET_STYLE, ...style };
  return (
    <div className="mt-4 space-y-3 rounded-[8px] border border-dashed border-[#D1D5DB] bg-[#F8FAFC] p-3">
      <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
        Widget style — color, shadow, radius
      </p>
      <div>
        <FieldLabel>Background preset</FieldLabel>
        <div className="flex flex-wrap gap-1.5">
          {WIDGET_BG_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() =>
                onChange({
                  ...s,
                  bg: opt.value,
                  bgColor: opt.value === "custom" ? s.bgColor || "#172455" : "",
                })
              }
              className={cn(
                "inline-flex items-center gap-1.5 rounded-[6px] border px-2.5 py-1 text-[11px] font-bold",
                s.bg === opt.value
                  ? "border-[#172455] bg-[#172455] text-white"
                  : "border-[#E2E4E8] bg-white text-[#172455]"
              )}
            >
              <span
                className="h-3 w-3 rounded-full border border-black/10"
                style={{ background: opt.swatch }}
              />
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      {s.bg === "custom" ? (
        <ColorField
          label="Custom background color"
          value={s.bgColor}
          onChange={(bgColor) => onChange({ ...s, bg: "custom", bgColor })}
        />
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <ColorField
          label="Text color"
          value={s.textColor}
          onChange={(textColor) => onChange({ ...s, textColor })}
        />
        <ColorField
          label="Border color"
          value={s.borderColor}
          onChange={(borderColor) =>
            onChange({ ...s, borderColor, border: true })
          }
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <FieldLabel>Padding</FieldLabel>
          <ChipGroup
            value={s.padding || "md"}
            options={[
              { value: "none", label: "None" },
              { value: "sm", label: "S" },
              { value: "md", label: "M" },
              { value: "lg", label: "L" },
              { value: "xl", label: "XL" },
            ]}
            onChange={(padding) => onChange({ ...s, padding })}
          />
        </div>
        <div>
          <FieldLabel>Align</FieldLabel>
          <ChipGroup
            value={s.align || "left"}
            options={[
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
            ]}
            onChange={(align) => onChange({ ...s, align })}
          />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <FieldLabel>Corner radius</FieldLabel>
          <ChipGroup
            value={s.radius || "lg"}
            options={WIDGET_RADIUS_OPTIONS.map((o) => ({
              value: o.value,
              label: o.label,
            }))}
            onChange={(radius) => onChange({ ...s, radius })}
          />
        </div>
        <div>
          <FieldLabel>Box shadow</FieldLabel>
          <ChipGroup
            value={s.shadow || "none"}
            options={WIDGET_SHADOW_OPTIONS.map((o) => ({
              value: o.value,
              label: o.label,
            }))}
            onChange={(shadow) => onChange({ ...s, shadow })}
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm font-semibold text-[#172455]">
          <input
            type="checkbox"
            checked={Boolean(s.border)}
            onChange={(e) => onChange({ ...s, border: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-[#FF5548]"
          />
          Border
        </label>
        {s.border ? (
          <ChipGroup
            value={s.borderWidth || "1"}
            options={[
              { value: "1", label: "1px" },
              { value: "2", label: "2px" },
              { value: "4", label: "4px" },
            ]}
            onChange={(borderWidth) => onChange({ ...s, borderWidth })}
          />
        ) : null}
      </div>
    </div>
  );
}

function ColumnFields({
  value,
  onChange,
  label,
}: {
  label: string;
  value: {
    title?: string | null;
    html?: string | null;
    imageSrc?: string | null;
    imageAlt?: string | null;
  };
  onChange: (next: typeof value) => void;
}) {
  return (
    <div className="space-y-3 rounded-[8px] border border-[#E8EAEF] bg-[#F8FAFC] p-3">
      <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
        {label}
      </p>
      <div>
        <FieldLabel>Title</FieldLabel>
        <input
          className={inputClass}
          value={value.title || ""}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
        />
      </div>
      <ImageUploadField
        label="Image (optional)"
        value={value.imageSrc || ""}
        onChange={(url) => onChange({ ...value, imageSrc: url })}
        recommended="900×900"
        folder="packaginghype/pages"
      />
      <div>
        <FieldLabel>Image alt</FieldLabel>
        <input
          className={inputClass}
          value={value.imageAlt || ""}
          onChange={(e) => onChange({ ...value, imageAlt: e.target.value })}
        />
      </div>
      <div>
        <FieldLabel>Content</FieldLabel>
        <RichTextEditor
          value={value.html || ""}
          onChange={(html) => onChange({ ...value, html })}
        />
      </div>
    </div>
  );
}

function WidgetEditor({
  widget,
  onChange,
}: {
  widget: PageWidget;
  onChange: (next: PageWidget) => void;
}) {
  const patchStyle = (style: WidgetStyle) => onChange({ ...widget, style } as PageWidget);

  const body = (() => {
    switch (widget.type) {
      case "heroBanner":
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FieldLabel>Tone</FieldLabel>
              <ChipGroup
                value={widget.tone || "teal"}
                options={[
                  { value: "teal", label: "Teal" },
                  { value: "navy", label: "Navy" },
                  { value: "blue", label: "Blue" },
                  { value: "soft", label: "Soft" },
                ]}
                onChange={(tone) => onChange({ ...widget, tone })}
              />
            </div>
            <div>
              <FieldLabel>Eyebrow</FieldLabel>
              <input
                className={inputClass}
                value={widget.eyebrow || ""}
                onChange={(e) => onChange({ ...widget, eyebrow: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>Title</FieldLabel>
              <input
                className={inputClass}
                value={widget.title || ""}
                onChange={(e) => onChange({ ...widget, title: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel>Text</FieldLabel>
              <textarea
                className={`${inputClass} min-h-[72px]`}
                value={widget.text || ""}
                onChange={(e) => onChange({ ...widget, text: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <ImageUploadField
                label="Side image"
                value={widget.imageSrc || ""}
                onChange={(imageSrc) => onChange({ ...widget, imageSrc })}
                recommended="1000×750"
                folder="packaginghype/pages"
              />
            </div>
            <div>
              <FieldLabel>Button label</FieldLabel>
              <input
                className={inputClass}
                value={widget.buttonLabel || ""}
                onChange={(e) =>
                  onChange({ ...widget, buttonLabel: e.target.value })
                }
              />
            </div>
            <div>
              <FieldLabel>Button link</FieldLabel>
              <input
                className={inputClass}
                value={widget.buttonHref || ""}
                onChange={(e) =>
                  onChange({ ...widget, buttonHref: e.target.value })
                }
                placeholder="/quote"
              />
            </div>
          </div>
        );

      case "richText":
        return (
          <div className="space-y-3">
            <div>
              <FieldLabel>Title</FieldLabel>
              <input
                className={inputClass}
                value={widget.title || ""}
                onChange={(e) => onChange({ ...widget, title: e.target.value })}
                placeholder="Optional section heading"
              />
            </div>
            <RichTextEditor
              value={widget.html || ""}
              onChange={(html) => onChange({ ...widget, html })}
            />
          </div>
        );

      case "image":
        return (
          <div className="space-y-3">
            <ImageUploadField
              label="Image"
              value={widget.src || ""}
              onChange={(src) => onChange({ ...widget, src })}
              recommended="1600×900"
              folder="packaginghype/pages"
            />
            <div>
              <FieldLabel>Aspect ratio</FieldLabel>
              <ChipGroup
                value={widget.aspect || "video"}
                options={[
                  { value: "video", label: "16:9" },
                  { value: "wide", label: "21:9" },
                  { value: "square", label: "1:1" },
                  { value: "auto", label: "Auto" },
                ]}
                onChange={(aspect) => onChange({ ...widget, aspect })}
              />
            </div>
            <div>
              <FieldLabel>Alt text</FieldLabel>
              <input
                className={inputClass}
                value={widget.alt || ""}
                onChange={(e) => onChange({ ...widget, alt: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>Caption</FieldLabel>
              <input
                className={inputClass}
                value={widget.caption || ""}
                onChange={(e) => onChange({ ...widget, caption: e.target.value })}
              />
            </div>
          </div>
        );

      case "imageText":
        return (
          <div className="space-y-3">
            <div>
              <FieldLabel>Image side</FieldLabel>
              <ChipGroup
                value={widget.imageSide}
                options={[
                  { value: "left", label: "Left" },
                  { value: "right", label: "Right" },
                ]}
                onChange={(imageSide) => onChange({ ...widget, imageSide })}
              />
            </div>
            <ImageUploadField
              label="Image"
              value={widget.imageSrc || ""}
              onChange={(imageSrc) => onChange({ ...widget, imageSrc })}
              recommended="1000×750"
              folder="packaginghype/pages"
            />
            <div>
              <FieldLabel>Title</FieldLabel>
              <input
                className={inputClass}
                value={widget.title || ""}
                onChange={(e) => onChange({ ...widget, title: e.target.value })}
              />
            </div>
            <RichTextEditor
              value={widget.html || ""}
              onChange={(html) => onChange({ ...widget, html })}
            />
          </div>
        );

      case "columns2":
        return (
          <div className="grid gap-4 lg:grid-cols-2">
            <ColumnFields
              label="Left column"
              value={widget.left}
              onChange={(left) => onChange({ ...widget, left })}
            />
            <ColumnFields
              label="Right column"
              value={widget.right}
              onChange={(right) => onChange({ ...widget, right })}
            />
          </div>
        );

      case "columns3":
        return (
          <div className="grid gap-4 lg:grid-cols-3">
            {widget.columns.map((col, i) => (
              <ColumnFields
                key={i}
                label={`Column ${i + 1}`}
                value={col}
                onChange={(next) => {
                  const columns = [...widget.columns] as typeof widget.columns;
                  columns[i] = next;
                  onChange({ ...widget, columns });
                }}
              />
            ))}
          </div>
        );

      case "gallery":
        return (
          <div className="space-y-4">
            <div>
              <FieldLabel>Columns</FieldLabel>
              <ChipGroup
                value={widget.columns || "4"}
                options={[
                  { value: "2", label: "2" },
                  { value: "3", label: "3" },
                  { value: "4", label: "4" },
                ]}
                onChange={(columns) => onChange({ ...widget, columns })}
              />
            </div>
            {widget.images.map((img, i) => (
              <div
                key={i}
                className="rounded-[8px] border border-[#E8EAEF] bg-[#F8FAFC] p-3"
              >
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                    Image {i + 1}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...widget,
                        images: widget.images.filter((_, idx) => idx !== i),
                      })
                    }
                    className="rounded p-1 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <ImageUploadField
                  label="Upload"
                  value={img.src}
                  onChange={(src) => {
                    const images = [...widget.images];
                    images[i] = { ...images[i], src };
                    onChange({ ...widget, images });
                  }}
                  recommended="900×900"
                  folder="packaginghype/pages"
                />
              </div>
            ))}
            {widget.images.length < 8 ? (
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...widget,
                    images: [...widget.images, { src: "", alt: "" }],
                  })
                }
                className="inline-flex items-center gap-1.5 rounded-[6px] border border-dashed border-[#D1D5DB] px-3 py-2 text-sm font-semibold text-[#172455]"
              >
                <Plus className="h-4 w-4" />
                Add image
              </button>
            ) : null}
          </div>
        );

      case "cta":
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FieldLabel>Tone</FieldLabel>
              <ChipGroup
                value={widget.tone || "navy"}
                options={[
                  { value: "navy", label: "Navy" },
                  { value: "teal", label: "Teal" },
                  { value: "coral", label: "Coral" },
                  { value: "soft", label: "Soft" },
                ]}
                onChange={(tone) => onChange({ ...widget, tone })}
              />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel>Title</FieldLabel>
              <input
                className={inputClass}
                value={widget.title || ""}
                onChange={(e) => onChange({ ...widget, title: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel>Text</FieldLabel>
              <textarea
                className={`${inputClass} min-h-[80px]`}
                value={widget.text || ""}
                onChange={(e) => onChange({ ...widget, text: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>Button label</FieldLabel>
              <input
                className={inputClass}
                value={widget.buttonLabel || ""}
                onChange={(e) =>
                  onChange({ ...widget, buttonLabel: e.target.value })
                }
              />
            </div>
            <div>
              <FieldLabel>Button link</FieldLabel>
              <input
                className={inputClass}
                value={widget.buttonHref || ""}
                onChange={(e) =>
                  onChange({ ...widget, buttonHref: e.target.value })
                }
              />
            </div>
          </div>
        );

      case "divider":
        return (
          <div>
            <FieldLabel>Divider style</FieldLabel>
            <ChipGroup
              value={widget.dividerStyle || "line"}
              options={[
                { value: "line", label: "Line" },
                { value: "space", label: "Space" },
              ]}
              onChange={(dividerStyle) => onChange({ ...widget, dividerStyle })}
            />
          </div>
        );

      default:
        return null;
    }
  })();

  return (
    <div>
      {body}
      {widget.type !== "divider" ? (
        <WidgetStyleEditor style={widget.style} onChange={patchStyle} />
      ) : null}
    </div>
  );
}

export function PageWidgetBuilder({
  widgets,
  onChange,
}: {
  widgets: PageWidget[];
  onChange: (next: PageWidget[]) => void;
}) {
  function addWidget(type: PageWidgetType) {
    onChange([...widgets, createEmptyWidget(type)]);
  }

  function updateAt(index: number, next: PageWidget) {
    const copy = [...widgets];
    copy[index] = next;
    onChange(copy);
  }

  function removeAt(index: number) {
    onChange(widgets.filter((_, i) => i !== index));
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= widgets.length) return;
    const copy = [...widgets];
    const [item] = copy.splice(index, 1);
    copy.splice(target, 0, item);
    onChange(copy);
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-[#172455]">Add widget</p>
        <p className="mt-0.5 text-xs text-[#6B7280]">
          Build and style the full page — banners, columns, images, CTAs.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {WIDGET_CATALOG.map((item) => {
            const Icon = ICONS[item.type];
            return (
              <button
                key={item.type}
                type="button"
                onClick={() => addWidget(item.type)}
                className="flex items-start gap-2.5 rounded-[8px] border border-[#E5E7EB] bg-white px-3 py-2.5 text-left transition-colors hover:border-[#172455] hover:bg-[#F8FAFC]"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] bg-[#EEF2FF] text-[#172455]">
                  <Icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-bold text-[#172455]">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-[#6B7280]">
                    {item.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {widgets.length === 0 ? (
        <div className="rounded-[10px] border border-dashed border-[#D1D5DB] bg-[#F8FAFC] px-4 py-8 text-center text-sm text-[#6B7280]">
          No widgets yet — pick a layout above to start building.
        </div>
      ) : (
        <div className="space-y-3">
          {widgets.map((widget, index) => {
            const meta = WIDGET_CATALOG.find((w) => w.type === widget.type);
            const Icon = ICONS[widget.type];
            return (
              <div
                key={widget.id}
                className="overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-white"
              >
                <div className="flex items-center gap-2 border-b border-[#EEF1F6] bg-[#F8FAFC] px-3 py-2">
                  <GripVertical className="h-4 w-4 text-[#9CA3AF]" />
                  <Icon className="h-4 w-4 text-[#172455]" />
                  <p className="flex-1 text-sm font-bold text-[#172455]">
                    {meta?.label || widget.type}
                    <span className="ml-2 text-[11px] font-medium text-[#9CA3AF]">
                      #{index + 1}
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="rounded p-1.5 text-[#6B7280] hover:bg-white disabled:opacity-30"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === widgets.length - 1}
                    className="rounded p-1.5 text-[#6B7280] hover:bg-white disabled:opacity-30"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeAt(index)}
                    className="rounded p-1.5 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-4">
                  <WidgetEditor
                    widget={widget}
                    onChange={(next) => updateAt(index, next)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
