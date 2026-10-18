"use client";

import { useEffect, useMemo, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  Alignment,
  Autoformat,
  AutoImage,
  BlockQuote,
  Bold,
  ClassicEditor,
  Code,
  CodeBlock,
  Essentials,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  GeneralHtmlSupport,
  Heading,
  Highlight,
  HorizontalLine,
  Image,
  ImageCaption,
  ImageInsert,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  MediaEmbed,
  Paragraph,
  PasteFromOffice,
  RemoveFormat,
  SourceEditing,
  SpecialCharacters,
  SpecialCharactersEssentials,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TodoList,
  Underline,
  Undo,
  type EditorConfig,
  type FileLoader,
  type UploadAdapter,
  type UploadResponse,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
};

/** Upload images from the editor toolbar via our Cloudinary admin API. */
function AdminUploadAdapterPlugin(editor: {
  plugins: {
    get: (name: string) => {
      createUploadAdapter: (loader: FileLoader) => UploadAdapter;
    };
  };
}) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) =>
    new AdminUploadAdapter(loader);
}

class AdminUploadAdapter implements UploadAdapter {
  constructor(private loader: FileLoader) {}

  async upload(): Promise<UploadResponse> {
    const file = await this.loader.file;
    if (!file) throw new Error("No file");

    const body = new FormData();
    body.append("file", file);
    body.append("folder", "packaginghype/editor");
    body.append("kind", "image");

    const res = await fetch("/api/admin/upload", { method: "POST", body });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");

    return { default: data.url };
  }

  abort() {}
}

export function CkEditorField({
  value,
  onChange,
  placeholder = "Write description…",
  className,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const config = useMemo<EditorConfig>(
    () => ({
      licenseKey: "GPL",
      placeholder,
      plugins: [
        Essentials,
        Paragraph,
        Autoformat,
        PasteFromOffice,
        Bold,
        Italic,
        Underline,
        Strikethrough,
        Code,
        Subscript,
        Superscript,
        RemoveFormat,
        Heading,
        FontFamily,
        FontSize,
        FontColor,
        FontBackgroundColor,
        Highlight,
        Link,
        List,
        ListProperties,
        TodoList,
        Indent,
        IndentBlock,
        BlockQuote,
        CodeBlock,
        Alignment,
        HorizontalLine,
        SpecialCharacters,
        SpecialCharactersEssentials,
        Table,
        TableToolbar,
        TableProperties,
        TableCellProperties,
        TableColumnResize,
        TableCaption,
        Image,
        ImageCaption,
        ImageStyle,
        ImageToolbar,
        ImageUpload,
        ImageInsert,
        ImageResize,
        AutoImage,
        LinkImage,
        MediaEmbed,
        SourceEditing,
        FindAndReplace,
        GeneralHtmlSupport,
        Undo,
        AdminUploadAdapterPlugin,
      ],
      toolbar: {
        items: [
          "undo",
          "redo",
          "|",
          "sourceEditing",
          "findAndReplace",
          "|",
          "heading",
          "|",
          "fontFamily",
          "fontSize",
          "fontColor",
          "fontBackgroundColor",
          "highlight",
          "|",
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "subscript",
          "superscript",
          "code",
          "removeFormat",
          "|",
          "link",
          "insertImage",
          "mediaEmbed",
          "insertTable",
          "horizontalLine",
          "specialCharacters",
          "blockQuote",
          "codeBlock",
          "|",
          "alignment",
          "|",
          "bulletedList",
          "numberedList",
          "todoList",
          "outdent",
          "indent",
        ],
        shouldNotGroupWhenFull: false,
      },
      heading: {
        options: [
          {
            model: "paragraph",
            title: "Paragraph",
            class: "ck-heading_paragraph",
          },
          {
            model: "heading1",
            view: "h1",
            title: "Heading 1",
            class: "ck-heading_heading1",
          },
          {
            model: "heading2",
            view: "h2",
            title: "Heading 2",
            class: "ck-heading_heading2",
          },
          {
            model: "heading3",
            view: "h3",
            title: "Heading 3",
            class: "ck-heading_heading3",
          },
          {
            model: "heading4",
            view: "h4",
            title: "Heading 4",
            class: "ck-heading_heading4",
          },
          {
            model: "heading5",
            view: "h5",
            title: "Heading 5",
            class: "ck-heading_heading5",
          },
          {
            model: "heading6",
            view: "h6",
            title: "Heading 6",
            class: "ck-heading_heading6",
          },
        ],
      },
      fontSize: {
        options: [10, 12, 14, "default", 16, 18, 20, 24, 28, 32, 36, 48],
        supportAllValues: true,
      },
      fontFamily: {
        options: [
          "default",
          "Arial, Helvetica, sans-serif",
          "Georgia, serif",
          "Times New Roman, Times, serif",
          "Courier New, Courier, monospace",
          "Verdana, Geneva, sans-serif",
          "Tahoma, Geneva, sans-serif",
        ],
        supportAllValues: true,
      },
      fontColor: {
        columns: 5,
        documentColors: 8,
      },
      fontBackgroundColor: {
        columns: 5,
        documentColors: 8,
      },
      link: {
        decorators: {
          openInNewTab: {
            mode: "manual",
            label: "Open in a new tab",
            attributes: {
              target: "_blank",
              rel: "noopener noreferrer",
            },
          },
        },
      },
      list: {
        properties: {
          styles: true,
          startIndex: true,
          reversed: true,
        },
      },
      image: {
        toolbar: [
          "imageTextAlternative",
          "toggleImageCaption",
          "|",
          "imageStyle:inline",
          "imageStyle:block",
          "imageStyle:side",
          "|",
          "resizeImage",
          "linkImage",
        ],
        insert: {
          integrations: ["upload", "url"],
        },
      },
      table: {
        contentToolbar: [
          "tableColumn",
          "tableRow",
          "mergeTableCells",
          "tableProperties",
          "tableCellProperties",
          "toggleTableCaption",
        ],
      },
      htmlSupport: {
        allow: [
          {
            name: /.*/,
            attributes: true,
            classes: true,
            styles: true,
          },
        ],
      },
      mediaEmbed: {
        previewsInData: true,
      },
    }),
    [placeholder]
  );

  if (!mounted) {
    return (
      <div
        className={cn(
          "flex min-h-[260px] items-center justify-center rounded-[6px] border border-[#E2E4E8] bg-[#F8FAFC] text-xs font-semibold text-[#9CA3AF]",
          className
        )}
      >
        Loading CKEditor…
      </div>
    );
  }

  return (
    <div
      className={cn(
        "ckeditor-field overflow-hidden rounded-[6px] border border-[#E2E4E8] bg-white focus-within:border-[#FF5548]",
        className
      )}
    >
      <CKEditor
        editor={ClassicEditor}
        config={config}
        data={value || ""}
        onChange={(_event, editor) => {
          onChange(editor.getData());
        }}
      />
    </div>
  );
}
