"use client";

import * as React from "react";
import { Controller } from "react-hook-form";
import type { ControllerFieldState, ControllerRenderProps, FieldValues } from "react-hook-form";
import { resolveFieldError, type RhfFieldProps } from "../rhf";
import { t, useComponentsI18n } from "../i18n";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import FontFamily from "@tiptap/extension-font-family";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  FileImage,
  Highlighter,
  IndentDecrease,
  IndentIncrease,
  List,
  ListOrdered,
  Palette
} from "lucide-react";

export type SgTextEditorSaveMeta = {
  htmlDocument: string;
  contentHtml: string;
  cssText: string;
};

export type SgTextEditorProps = {
  error?: string;
  id: string;
  valueHtml?: string;
  defaultValueHtml?: string;
  onChangeHtml?: (htmlBody: string) => void;

  cssText?: string;
  onCssTextChange?: (cssText: string) => void;

  fileName?: string;
  onSave?: (file: File, meta: SgTextEditorSaveMeta) => void;
  onLoad?: (meta: SgTextEditorSaveMeta) => void;

  height?: number;
  placeholder?: string;
  disabled?: boolean;
  borderRadius?: number | string;

  showCssEditor?: boolean;
  cssEditorLabel?: string;

  className?: string;
  style?: React.CSSProperties;
} & RhfFieldProps;

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const TextStyleWithSize = TextStyle.extend({
  addAttributes() {
    return {
      fontSize: {
        default: null,
        parseHTML: (element: HTMLElement) => element.style.fontSize?.replace(/["']/g, "") ?? null,
        renderHTML: (attrs: { fontSize?: string | null }) => {
          if (!attrs.fontSize) return {};
          return { style: `font-size:${attrs.fontSize}` };
        }
      }
    };
  }
});

function parseHtmlDocument(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const cssText = Array.from(doc.querySelectorAll("head style"))
    .map((s) => s.textContent ?? "")
    .join("\n")
    .trim();
  const bodyHtml = (doc.body?.innerHTML ?? "").trim();
  return { cssText, bodyHtml };
}

function buildFullHtmlDocument(bodyHtml: string, cssText: string, lang: string) {
  const safeCss = (cssText ?? "").trim();
  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  ${safeCss ? `<style>\n${safeCss}\n</style>` : ""}
</head>
<body>
${bodyHtml ?? ""}
</body>
</html>`;
}

function toFile(fullHtml: string, fileName: string) {
  return new File([fullHtml], fileName, { type: "text/html;charset=utf-8" });
}

function canRun(editor: Editor | null, fn: (editor: Editor) => boolean) {
  if (!editor) return false;
  try {
    return fn(editor);
  } catch {
    return false;
  }
}

function SgTextEditorBase(props: Readonly<SgTextEditorProps>) {
  const {
    id,
    valueHtml,
    defaultValueHtml,
    onChangeHtml,
    cssText = "",
    onCssTextChange,
    fileName,
    onSave,
    onLoad,
    height = 320,
    placeholder: placeholderProp,
    disabled,
    borderRadius,
    showCssEditor = false,
    cssEditorLabel: cssEditorLabelProp,
    className,
    style,
    error
  } = props;
  const i18n = useComponentsI18n();
  const placeholder = placeholderProp ?? t(i18n, "components.textEditor.placeholder");
  const cssEditorLabel = cssEditorLabelProp ?? t(i18n, "components.textEditor.cssEditorLabel");
  const editorAriaLabel = t(i18n, "components.textEditor.editorAriaLabel");

  const resolvedBorderRadius = React.useMemo(() => {
    if (borderRadius === undefined) return undefined;
    return typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius;
  }, [borderRadius]);

  const isControlled = typeof valueHtml === "string";
  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      StarterKit.configure({ codeBlock: {} }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
      Image.configure({ inline: false }),
      TextStyleWithSize,
      FontFamily,
      Color,
      Highlight.configure({ multicolor: true }),
      Subscript,
      Superscript,
      TextAlign.configure({ types: ["heading", "paragraph"] })
    ],
    content: isControlled ? valueHtml : (defaultValueHtml ?? ""),
    editorProps: {
      attributes: {
        id,
        "aria-label": editorAriaLabel,
        class: cn("prose max-w-none focus:outline-none min-h-[120px]", disabled ? "opacity-60" : ""),
        "data-placeholder": placeholder
      }
    },
    onUpdate: ({ editor }: { editor: Editor }) => {
      onChangeHtml?.(editor.getHTML());
    }
  });

  React.useEffect(() => {
    if (!editor) return;
    if (!isControlled) return;
    const current = editor.getHTML();
    if (current !== valueHtml) editor.commands.setContent(valueHtml ?? "", false);
  }, [editor, isControlled, valueHtml]);

  const doSave = React.useCallback(() => {
    if (!editor) return;
    const contentHtml = editor.getHTML();
    const htmlDocument = buildFullHtmlDocument(contentHtml, cssText, i18n.locale);
    const f = toFile(htmlDocument, fileName ?? `${id}.html`);
    onSave?.(f, { htmlDocument, contentHtml, cssText });
  }, [editor, cssText, fileName, i18n.locale, id, onSave]);

  const loadFromHtmlString = React.useCallback(
    (htmlDoc: string) => {
      if (!editor) return;
      const parsed = parseHtmlDocument(htmlDoc);
      if (parsed.cssText && parsed.cssText !== cssText) {
        onCssTextChange?.(parsed.cssText);
      }
      editor.commands.setContent(parsed.bodyHtml || "", false);
      onLoad?.({ htmlDocument: htmlDoc, contentHtml: parsed.bodyHtml, cssText: parsed.cssText });
    },
    [editor, cssText, onCssTextChange, onLoad]
  );

  const loadFromHtmlFile = React.useCallback(
    async (file: File) => {
      const text = await file.text();
      loadFromHtmlString(text);
    },
    [loadFromHtmlString]
  );

  const exec = (fn: () => void) => {
    if (!editor) return;
    editor.chain().focus();
    fn();
  };

  const active = (name: string, attrs?: any) => !!editor?.isActive(name as any, attrs);
  const toolbarStyle = resolvedBorderRadius
    ? ({ borderTopLeftRadius: resolvedBorderRadius, borderTopRightRadius: resolvedBorderRadius } as React.CSSProperties)
    : undefined;
  const editorContainerStyle: React.CSSProperties = { height };
  if (resolvedBorderRadius) {
    editorContainerStyle.borderBottomLeftRadius = resolvedBorderRadius;
    editorContainerStyle.borderBottomRightRadius = resolvedBorderRadius;
  }
  const cssTextareaStyle = resolvedBorderRadius
    ? ({ borderRadius: resolvedBorderRadius } as React.CSSProperties)
    : undefined;

  return (
    <div className={cn("w-full", className)} style={style}>
      <div
        className="flex flex-wrap items-center gap-2 rounded-t-lg border border-b-0 bg-background p-2"
        style={toolbarStyle}
      >
        <select
          className="h-9 rounded-md border px-2 text-sm bg-background"
          disabled={!editor || disabled}
          value={
            active("heading", { level: 1 })
              ? "h1"
              : active("heading", { level: 2 })
              ? "h2"
              : active("heading", { level: 3 })
              ? "h3"
              : "p"
          }
          onChange={(e) => {
            const v = e.target.value;
            if (!editor) return;
            editor.chain().focus();
            if (v === "p") editor.commands.setParagraph();
            if (v === "h1") editor.commands.toggleHeading({ level: 1 });
            if (v === "h2") editor.commands.toggleHeading({ level: 2 });
            if (v === "h3") editor.commands.toggleHeading({ level: 3 });
          }}
        >
          <option value="h1">{t(i18n, "components.textEditor.toolbar.heading")}</option>
          <option value="h2">{t(i18n, "components.textEditor.toolbar.subheading")}</option>
          <option value="p">{t(i18n, "components.textEditor.toolbar.normal")}</option>
          <option value="h3">{t(i18n, "components.textEditor.toolbar.heading3")}</option>
        </select>

        <select
          className="h-9 rounded-md border px-2 text-sm bg-background"
          disabled={!editor || disabled}
          onChange={(e) => {
            const v = e.target.value;
            if (!editor) return;
            editor.chain().focus().setFontFamily(v).run();
          }}
          defaultValue="inherit"
        >
          <option value="inherit">{t(i18n, "components.textEditor.toolbar.defaultFont")}</option>
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times</option>
          <option value="Courier New">Courier</option>
        </select>

        <select
          className="h-9 rounded-md border px-2 text-sm bg-background"
          disabled={!editor || disabled}
          defaultValue="16px"
          onChange={(e) => {
            const size = e.target.value;
            if (!editor) return;
            editor.chain().focus().setMark("textStyle", { fontSize: size }).run();
          }}
        >
          <option value="12px">12</option>
          <option value="14px">14</option>
          <option value="16px">16</option>
          <option value="18px">18</option>
          <option value="24px">24</option>
          <option value="32px">32</option>
        </select>

        <div className="mx-1 h-6 w-px bg-border" />

        <ToolbarButton
          label={t(i18n, "components.textEditor.toolbar.bold")}
          icon={<span className="font-bold leading-none" aria-hidden="true">B</span>}
          active={active("bold")}
          disabled={!canRun(editor, (ed) => ed.can().chain().focus().toggleBold().run()) || !!disabled}
          onClick={() => exec(() => editor!.chain().toggleBold().run())}
        />
        <ToolbarButton
          label={t(i18n, "components.textEditor.toolbar.italic")}
          icon={<span className="italic leading-none" aria-hidden="true">I</span>}
          active={active("italic")}
          disabled={!canRun(editor, (ed) => ed.can().chain().focus().toggleItalic().run()) || !!disabled}
          onClick={() => exec(() => editor!.chain().toggleItalic().run())}
        />
        <ToolbarButton
          label={t(i18n, "components.textEditor.toolbar.underline")}
          icon={<span className="underline leading-none" aria-hidden="true">U</span>}
          active={active("underline")}
          disabled={!canRun(editor, (ed) => ed.can().chain().focus().toggleUnderline().run()) || !!disabled}
          onClick={() => exec(() => editor!.chain().toggleUnderline().run())}
        />
        <ToolbarButton
          label={t(i18n, "components.textEditor.toolbar.strike")}
          icon={<span className="line-through leading-none" aria-hidden="true">S</span>}
          active={active("strike")}
          disabled={!canRun(editor, (ed) => ed.can().chain().focus().toggleStrike().run()) || !!disabled}
          onClick={() => exec(() => editor!.chain().toggleStrike().run())}
        />

        <div className="mx-1 h-6 w-px bg-border" />

        <ColorPickerButton
          label={t(i18n, "components.textEditor.toolbar.textColor")}
          hint={t(i18n, "components.textEditor.toolbar.textColor")}
          icon={<Palette size={14} aria-hidden="true" />}
          disabled={!editor || !!disabled}
          onChange={(color) => editor?.chain().focus().setColor(color).run()}
        />

        <ColorPickerButton
          label={t(i18n, "components.textEditor.toolbar.highlightColor")}
          hint={t(i18n, "components.textEditor.toolbar.highlightColor")}
          icon={<Highlighter size={14} aria-hidden="true" />}
          disabled={!editor || !!disabled}
          onChange={(color) => editor?.chain().focus().toggleHighlight({ color }).run()}
        />

        <div className="mx-1 h-6 w-px bg-border" />

        <ToolbarButton
          label={t(i18n, "components.textEditor.toolbar.subscript")}
          text="x2"
          active={active("subscript")}
          disabled={!editor || !!disabled}
          onClick={() => exec(() => editor!.chain().toggleSubscript().run())}
        />
        <ToolbarButton
          label={t(i18n, "components.textEditor.toolbar.superscript")}
          text="x^"
          active={active("superscript")}
          disabled={!editor || !!disabled}
          onClick={() => exec(() => editor!.chain().toggleSuperscript().run())}
        />

        <div className="mx-1 h-6 w-px bg-border" />

        <ToolbarButton
          label={t(i18n, "components.textEditor.toolbar.bullets")}
          icon={<List size={14} aria-hidden="true" />}
          active={active("bulletList")}
          disabled={!editor || !!disabled}
          onClick={() => exec(() => editor!.chain().toggleBulletList().run())}
        />
        <ToolbarButton
          label={t(i18n, "components.textEditor.toolbar.numbered")}
          icon={<ListOrdered size={14} aria-hidden="true" />}
          active={active("orderedList")}
          disabled={!editor || !!disabled}
          onClick={() => exec(() => editor!.chain().toggleOrderedList().run())}
        />
        <ToolbarButton
          label={t(i18n, "components.textEditor.toolbar.outdent")}
          icon={<IndentDecrease size={14} aria-hidden="true" />}
          active={false}
          disabled={!editor || !!disabled}
          onClick={() => exec(() => editor!.chain().liftListItem("listItem").run())}
        />
        <ToolbarButton
          label={t(i18n, "components.textEditor.toolbar.indent")}
          icon={<IndentIncrease size={14} aria-hidden="true" />}
          active={false}
          disabled={!editor || !!disabled}
          onClick={() => exec(() => editor!.chain().sinkListItem("listItem").run())}
        />

        <div className="mx-1 h-6 w-px bg-border" />

        <ToolbarButton
          label={t(i18n, "components.textEditor.toolbar.alignLeft")}
          icon={<AlignLeft size={14} aria-hidden="true" />}
          active={active("paragraph", { textAlign: "left" }) || active("heading", { textAlign: "left" })}
          disabled={!editor || !!disabled}
          onClick={() => exec(() => editor!.chain().setTextAlign("left").run())}
        />
        <ToolbarButton
          label={t(i18n, "components.textEditor.toolbar.alignCenter")}
          icon={<AlignCenter size={14} aria-hidden="true" />}
          active={active("paragraph", { textAlign: "center" }) || active("heading", { textAlign: "center" })}
          disabled={!editor || !!disabled}
          onClick={() => exec(() => editor!.chain().setTextAlign("center").run())}
        />
        <ToolbarButton
          label={t(i18n, "components.textEditor.toolbar.alignRight")}
          icon={<AlignRight size={14} aria-hidden="true" />}
          active={active("paragraph", { textAlign: "right" }) || active("heading", { textAlign: "right" })}
          disabled={!editor || !!disabled}
          onClick={() => exec(() => editor!.chain().setTextAlign("right").run())}
        />
        <ToolbarButton
          label={t(i18n, "components.textEditor.toolbar.justify")}
          icon={<AlignJustify size={14} aria-hidden="true" />}
          active={active("paragraph", { textAlign: "justify" }) || active("heading", { textAlign: "justify" })}
          disabled={!editor || !!disabled}
          onClick={() => exec(() => editor!.chain().setTextAlign("justify").run())}
        />

        <div className="mx-1 h-6 w-px bg-border" />

        <ToolbarButton
          label={t(i18n, "components.textEditor.toolbar.link")}
          text={t(i18n, "components.textEditor.toolbar.link")}
          active={active("link")}
          disabled={!editor || !!disabled}
          onClick={() => {
            if (!editor) return;
            const prev = editor.getAttributes("link").href as string | undefined;
            const url = window.prompt(t(i18n, "components.textEditor.prompt.url"), prev ?? "https://");
            if (!url) {
              editor.chain().focus().unsetLink().run();
              return;
            }
            editor.chain().focus().setLink({ href: url }).run();
          }}
        />
        <ToolbarButton
          label={t(i18n, "components.textEditor.toolbar.image")}
          icon={<FileImage size={14} aria-hidden="true" />}
          active={false}
          disabled={!editor || !!disabled}
          onClick={() => {
            if (!editor) return;
            const src = window.prompt(t(i18n, "components.textEditor.prompt.imageUrl"));
            if (!src) return;
            editor.chain().focus().setImage({ src }).run();
          }}
        />

        <div className="mx-1 h-6 w-px bg-border" />

        <ToolbarButton
          label={t(i18n, "components.textEditor.toolbar.clear")}
          text="X"
          active={false}
          disabled={!editor || !!disabled}
          onClick={() => {
            if (!editor) return;
            editor.chain().focus().unsetAllMarks().clearNodes().run();
          }}
        />

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="h-9 rounded-md border bg-muted px-3 text-sm hover:bg-muted/80 disabled:opacity-50"
            disabled={!editor || !!disabled}
            onClick={doSave}
          >{t(i18n, "components.actions.save")}</button>
          <label className="h-9 cursor-pointer rounded-md border bg-muted px-3 text-sm leading-9 hover:bg-muted/80">{t(i18n, "components.actions.loadHtml")}<input
              type="file"
              accept="text/html,.html"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                void loadFromHtmlFile(f);
                e.currentTarget.value = "";
              }}
            />
          </label>
        </div>
      </div>

      <div className="rounded-b-lg border bg-background" style={editorContainerStyle}>
        <div className="h-full overflow-auto p-3">
          <EditorContent editor={editor} />
        </div>
      </div>

      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}

      {showCssEditor ? (
        <div className="mt-3">
          <label className="mb-1 block text-sm font-medium text-foreground">{cssEditorLabel}</label>
          <textarea
            value={cssText}
            onChange={(e) => onCssTextChange?.(e.target.value)}
            className="min-h-[160px] w-full rounded-lg border p-2 font-mono text-xs"
            style={cssTextareaStyle}
          />
          <p className="mt-1 text-xs text-muted-foreground">{t(i18n, "components.textEditor.help.cssEmbedded")}</p>
        </div>
      ) : null}
    </div>
  );
}

export function SgTextEditor(props: Readonly<SgTextEditorProps>) {
  const { control, name, rules, ...rest } = props;

  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }: { field: ControllerRenderProps<FieldValues, string>; fieldState: ControllerFieldState }) => (
          <SgTextEditorBase
            {...rest}
            error={resolveFieldError(rest.error, fieldState.error?.message)}
            valueHtml={typeof field.value === "string" ? field.value : undefined}
            onChangeHtml={(html) => field.onChange(html)}
          />
        )}
      />
    );
  }

  return <SgTextEditorBase {...rest} />;
}

function ToolbarButton(props: {
  label: string;
  text?: string;
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  const { label, text, icon, active, disabled, onClick } = props;
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 text-sm",
        "hover:bg-muted/80 disabled:opacity-50",
        active ? "bg-muted" : "bg-background"
      )}
    >
      {icon ?? text}
    </button>
  );
}

function ColorPickerButton(props: {
  label: string;
  hint?: string;
  icon: React.ReactNode;
  disabled?: boolean;
  onChange: (color: string) => void;
}) {
  const { label, hint, icon, disabled, onChange } = props;
  return (
    <label
      title={hint ?? label}
      aria-label={label}
      className={cn(
        "relative inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 text-sm",
        "bg-background hover:bg-muted/80",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      )}
    >
      {icon}
      <input
        type="color"
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "absolute inset-0 h-full w-full opacity-0",
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        )}
        aria-label={label}
      />
    </label>
  );
}

SgTextEditor.displayName = "SgTextEditor";


