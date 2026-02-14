"use client";

import React from "react";
import { Save, RefreshCw, Trash2, Home, Plus, Download, Upload, Copy, Printer, Share2, Mail, FileText } from "lucide-react";
import { SgSplitButton } from "@seedgrid/fe-components";
import SgCodeBlockBase from "../others/SgCodeBlockBase";

const SEVERITIES = ["primary", "secondary", "success", "info", "warning", "help", "danger"] as const;

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="text-sm text-muted-foreground">{props.description}</p> : null}
      {props.children}
    </section>
  );
}

function Row(props: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{props.children}</div>;
}

function CodeBlock(props: { code: string }) {
  return <SgCodeBlockBase code={props.code.trim()} />;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const BASIC_ITEMS = [
  { label: "Update", icon: <RefreshCw className="size-4" />, onClick: () => console.log("Update") },
  { label: "Delete", icon: <Trash2 className="size-4" />, onClick: () => console.log("Delete") },
  { label: "Homepage", icon: <Home className="size-4" />, onClick: () => console.log("Homepage") }
];

const FILE_ITEMS = [
  { label: "Copy", icon: <Copy className="size-4" />, onClick: () => console.log("Copy") },
  { label: "Print", icon: <Printer className="size-4" />, onClick: () => console.log("Print") },
  { separator: true, label: "Export as PDF", icon: <FileText className="size-4" />, onClick: () => console.log("PDF") },
  { label: "Share via email", icon: <Mail className="size-4" />, onClick: () => console.log("Email") }
];

export default function SgSplitButtonShowcase() {
  return (
    <div className="max-w-4xl space-y-10">
      <div>
        <h1 className="text-3xl font-bold">SgSplitButton</h1>
        <p className="mt-2 text-muted-foreground">
          Botao dividido com acao principal e menu dropdown de opcoes adicionais.
        </p>
      </div>

      {/* â”€â”€ Basic â”€â”€ */}
      <Section title="Basic" description="Split button com acao principal e dropdown de itens.">
        <Row>
          <SgSplitButton
            label="Save"
            leftIcon={<Save className="size-4" />}
            onClick={() => console.log("Save")}
            items={BASIC_ITEMS}
          />
        </Row>
        <CodeBlock code={`import { Save, RefreshCw, Trash2, Home } from "lucide-react";
import { SgSplitButton } from "@seedgrid/fe-components";

<SgSplitButton
  label="Save"
  leftIcon={<Save className="size-4" />}
  onClick={() => handleSave()}
  items={[
    { label: "Update", icon: <RefreshCw className="size-4" />, onClick: () => handleUpdate() },
    { label: "Delete", icon: <Trash2 className="size-4" />, onClick: () => handleDelete() },
    { label: "Homepage", icon: <Home className="size-4" />, onClick: () => navigate("/") },
  ]}
/>`} />
      </Section>

      {/* â”€â”€ Severities â”€â”€ */}
      <Section title="Severities" description='severity="primary" | "secondary" | "success" | "info" | "warning" | "help" | "danger"'>
        <Row>
          {SEVERITIES.map((s) => (
            <SgSplitButton
              key={s}
              label={capitalize(s)}
              severity={s}
              onClick={() => console.log(s)}
              items={BASIC_ITEMS}
            />
          ))}
        </Row>
        <CodeBlock code={`import { SgSplitButton } from "@seedgrid/fe-components";

const items = [
  { label: "Update", icon: <RefreshCw className="size-4" />, onClick: () => {} },
  { label: "Delete", icon: <Trash2 className="size-4" />, onClick: () => {} },
];

<SgSplitButton label="Primary" severity="primary" onClick={() => {}} items={items} />
<SgSplitButton label="Success" severity="success" onClick={() => {}} items={items} />
<SgSplitButton label="Danger" severity="danger" onClick={() => {}} items={items} />`} />
      </Section>

      {/* â”€â”€ Outlined â”€â”€ */}
      <Section title="Outlined" description='appearance="outline" - bordas coloridas sem preenchimento.'>
        <Row>
          {SEVERITIES.map((s) => (
            <SgSplitButton
              key={s}
              label={capitalize(s)}
              severity={s}
              appearance="outline"
              onClick={() => console.log(s)}
              items={BASIC_ITEMS}
            />
          ))}
        </Row>
        <CodeBlock code={`<SgSplitButton label="Primary" severity="primary" appearance="outline" onClick={() => {}} items={items} />
<SgSplitButton label="Success" severity="success" appearance="outline" onClick={() => {}} items={items} />`} />
      </Section>

      {/* â”€â”€ Ghost â”€â”€ */}
      <Section title="Ghost" description='appearance="ghost" - sem fundo, apenas texto colorido.'>
        <Row>
          {SEVERITIES.map((s) => (
            <SgSplitButton
              key={s}
              label={capitalize(s)}
              severity={s}
              appearance="ghost"
              onClick={() => console.log(s)}
              items={BASIC_ITEMS}
            />
          ))}
        </Row>
        <CodeBlock code={`<SgSplitButton label="Primary" severity="primary" appearance="ghost" onClick={() => {}} items={items} />
<SgSplitButton label="Danger" severity="danger" appearance="ghost" onClick={() => {}} items={items} />`} />
      </Section>

      {/* â”€â”€ Raised â”€â”€ */}
      <Section title="Elevated" description='appearance="solid" + elevation="sm".'>
        <Row>
          {SEVERITIES.map((s) => (
            <SgSplitButton
              key={s}
              label={capitalize(s)}
              severity={s}
              appearance="solid"
              elevation="sm"
              onClick={() => console.log(s)}
              items={BASIC_ITEMS}
            />
          ))}
        </Row>
        <CodeBlock code={`<SgSplitButton label="Primary" severity="primary" appearance="solid" elevation="sm" onClick={() => {}} items={items} />`} />
      </Section>

      {/* â”€â”€ Sizes â”€â”€ */}
      <Section title="Sizes" description='size="sm" | "md" | "lg"'>
        <Row>
          <SgSplitButton
            label="Small"
            size="sm"
            leftIcon={<Save className="size-4" />}
            onClick={() => console.log("sm")}
            items={BASIC_ITEMS}
          />
          <SgSplitButton
            label="Medium"
            size="md"
            leftIcon={<Save className="size-4" />}
            onClick={() => console.log("md")}
            items={BASIC_ITEMS}
          />
          <SgSplitButton
            label="Large"
            size="lg"
            leftIcon={<Save className="size-4" />}
            onClick={() => console.log("lg")}
            items={BASIC_ITEMS}
          />
        </Row>
        <CodeBlock code={`<SgSplitButton label="Small" size="sm" onClick={() => {}} items={items} />
<SgSplitButton label="Medium" size="md" onClick={() => {}} items={items} />
<SgSplitButton label="Large" size="lg" onClick={() => {}} items={items} />`} />
      </Section>

      {/* â”€â”€ With Icons â”€â”€ */}
      <Section title="With Icons" description="leftIcon na acao principal e icon nos itens do menu.">
        <Row>
          <SgSplitButton
            label="Save"
            leftIcon={<Save className="size-4" />}
            severity="primary"
            onClick={() => console.log("Save")}
            items={BASIC_ITEMS}
          />
          <SgSplitButton
            label="New"
            leftIcon={<Plus className="size-4" />}
            severity="success"
            onClick={() => console.log("New")}
            items={[
              { label: "Import", icon: <Upload className="size-4" />, onClick: () => console.log("Import") },
              { label: "Download template", icon: <Download className="size-4" />, onClick: () => console.log("Template") }
            ]}
          />
          <SgSplitButton
            label="Share"
            leftIcon={<Share2 className="size-4" />}
            severity="info"
            onClick={() => console.log("Share")}
            items={FILE_ITEMS}
          />
        </Row>
        <CodeBlock code={`<SgSplitButton
  label="Save"
  leftIcon={<Save className="size-4" />}
  severity="primary"
  onClick={() => handleSave()}
  items={[
    { label: "Update", icon: <RefreshCw className="size-4" />, onClick: () => {} },
    { label: "Delete", icon: <Trash2 className="size-4" />, onClick: () => {} },
  ]}
/>`} />
      </Section>

      {/* â”€â”€ Separators â”€â”€ */}
      <Section title="Menu Separators" description="separator=true para dividir grupos de itens no menu.">
        <Row>
          <SgSplitButton
            label="File"
            leftIcon={<FileText className="size-4" />}
            severity="secondary"
            onClick={() => console.log("File")}
            items={FILE_ITEMS}
          />
        </Row>
        <CodeBlock code={`<SgSplitButton
  label="File"
  leftIcon={<FileText className="size-4" />}
  severity="secondary"
  onClick={() => console.log("File")}
  items={[
    { label: "Copy", icon: <Copy className="size-4" />, onClick: () => {} },
    { label: "Print", icon: <Printer className="size-4" />, onClick: () => {} },
    { separator: true, label: "Export as PDF", icon: <FileText className="size-4" />, onClick: () => {} },
    { label: "Share via email", icon: <Mail className="size-4" />, onClick: () => {} },
  ]}
/>`} />
      </Section>

      {/* â”€â”€ Disabled â”€â”€ */}
      <Section title="Disabled" description="disabled=true desabilita o split button inteiro.">
        <Row>
          <SgSplitButton
            label="Save"
            leftIcon={<Save className="size-4" />}
            disabled
            onClick={() => console.log("Save")}
            items={BASIC_ITEMS}
          />
          <SgSplitButton
            label="Disabled Outline"
            severity="danger"
            appearance="outline"
            disabled
            onClick={() => console.log("disabled")}
            items={BASIC_ITEMS}
          />
        </Row>
        <CodeBlock code={`<SgSplitButton label="Save" leftIcon={<Save className="size-4" />} disabled onClick={() => {}} items={items} />`} />
      </Section>

      {/* â”€â”€ Loading â”€â”€ */}
      <Section title="Loading" description="loading=true exibe spinner na acao principal e desabilita o menu.">
        <Row>
          <SgSplitButton
            label="Saving..."
            leftIcon={<Save className="size-4" />}
            loading
            onClick={() => console.log("Save")}
            items={BASIC_ITEMS}
          />
          <SgSplitButton
            label="Processing..."
            severity="success"
            loading
            onClick={() => console.log("process")}
            items={BASIC_ITEMS}
          />
        </Row>
        <CodeBlock code={`<SgSplitButton label="Saving..." leftIcon={<Save className="size-4" />} loading onClick={() => {}} items={items} />`} />
      </Section>

      {/* â”€â”€ Disabled Items â”€â”€ */}
      <Section title="Disabled Items" description="Itens individuais podem ser desabilitados.">
        <Row>
          <SgSplitButton
            label="Actions"
            severity="primary"
            onClick={() => console.log("Action")}
            items={[
              { label: "Update", icon: <RefreshCw className="size-4" />, onClick: () => console.log("Update") },
              { label: "Delete (disabled)", icon: <Trash2 className="size-4" />, onClick: () => console.log("Delete"), disabled: true },
              { label: "Homepage", icon: <Home className="size-4" />, onClick: () => console.log("Homepage") }
            ]}
          />
        </Row>
        <CodeBlock code={`<SgSplitButton
  label="Actions"
  severity="primary"
  onClick={() => {}}
  items={[
    { label: "Update", icon: <RefreshCw className="size-4" />, onClick: () => {} },
    { label: "Delete", icon: <Trash2 className="size-4" />, onClick: () => {}, disabled: true },
    { label: "Homepage", icon: <Home className="size-4" />, onClick: () => {} },
  ]}
/>`} />
      </Section>
    </div>
  );
}


