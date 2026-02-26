"use client";

import React from "react";
import { Camera, User, Users } from "lucide-react";
import { SgAvatar, SgAvatarGroup, SgPlayground } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";

const IMG_AMY = "https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png";
const IMG_ASIYA = "https://primefaces.org/cdn/primereact/images/avatar/asiyajavayant.png";
const IMG_ONYAMA = "https://primefaces.org/cdn/primereact/images/avatar/onyamalimba.png";
const IMG_IONIBOWCHER = "https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      data-showcase-example="true"
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 space-y-4">{props.children}</div>
    </section>
  );
}

function Row(props: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-4">{props.children}</div>;
}

function CodeBlock(props: { code: string }) {
  return <CodeBlockBase code={props.code} />;
}

const EXAMPLE_BASIC_CODE = `import React from "react";
import { User } from "lucide-react";
import { SgAvatar } from "@seedgrid/fe-components";

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <SgAvatar label="P" />
      <SgAvatar icon={<User />} severity="secondary" />
      <SgAvatar src="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" alt="Amy Elsner" />
    </div>
  );
}`;

const EXAMPLE_SHAPES_SIZES_CODE = `import React from "react";
import { SgAvatar } from "@seedgrid/fe-components";

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <SgAvatar label="C" shape="circle" />
      <SgAvatar label="S" shape="square" />
      <SgAvatar label="XS" size="xs" />
      <SgAvatar label="LG" size="lg" />
      <SgAvatar src="https://primefaces.org/cdn/primereact/images/avatar/asiyajavayant.png" shape="square" />
    </div>
  );
}`;

const EXAMPLE_SEVERITY_CODE = `import React from "react";
import { Camera } from "lucide-react";
import { SgAvatar } from "@seedgrid/fe-components";

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <SgAvatar label="P" severity="primary" />
      <SgAvatar label="S" severity="success" />
      <SgAvatar label="D" severity="danger" />
      <SgAvatar
        icon={<Camera />}
        severity="custom"
        customColors={{
          bg: "#7c3aed",
          fg: "#ffffff",
          border: "#5b21b6",
          ring: "rgba(124,58,237,0.35)"
        }}
      />
    </div>
  );
}`;

const EXAMPLE_GROUP_CODE = `import React from "react";
import { Users } from "lucide-react";
import { SgAvatar, SgAvatarGroup } from "@seedgrid/fe-components";

export default function Example() {
  return (
    <div className="space-y-4">
      <SgAvatarGroup>
        <SgAvatar src="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" />
        <SgAvatar src="https://primefaces.org/cdn/primereact/images/avatar/asiyajavayant.png" />
        <SgAvatar src="https://primefaces.org/cdn/primereact/images/avatar/onyamalimba.png" />
        <SgAvatar src="https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png" />
      </SgAvatarGroup>

      <SgAvatarGroup max={3} total={6} size="sm" moreSeverity="secondary">
        <SgAvatar icon={<Users />} severity="info" size="sm" />
        <SgAvatar label="AL" severity="success" size="sm" />
        <SgAvatar label="BK" severity="warning" size="sm" />
        <SgAvatar label="CM" severity="danger" size="sm" />
      </SgAvatarGroup>
    </div>
  );
}`;

const PLAYGROUND_CODE = `import * as React from "react";
import { User } from "lucide-react";
import { SgAvatar, SgButton } from "@seedgrid/fe-components";

export default function App() {
  const [shape, setShape] = React.useState<"circle" | "square">("circle");
  const [size, setSize] = React.useState<"sm" | "md" | "lg">("md");
  const [severity, setSeverity] = React.useState<"primary" | "secondary" | "success" | "warning" | "danger" | "info" | "neutral">("primary");
  const [bordered, setBordered] = React.useState(true);

  return (
    <div className="space-y-4 p-2">
      <div className="grid gap-2 sm:grid-cols-3">
        <SgButton size="sm" appearance="outline" onClick={() => setShape("circle")}>circle</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setShape("square")}>square</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setBordered((v) => !v)}>toggle border</SgButton>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <SgButton size="sm" appearance="outline" onClick={() => setSize("sm")}>sm</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSize("md")}>md</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSize("lg")}>lg</SgButton>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <SgButton size="sm" appearance="outline" onClick={() => setSeverity("primary")}>primary</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSeverity("success")}>success</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSeverity("danger")}>danger</SgButton>
      </div>

      <SgAvatar label="SG" icon={<User />} shape={shape} size={size} severity={severity} bordered={bordered} />
    </div>
  );
}`;

const AVATAR_PROPS: ShowcasePropRow[] = [
  { prop: "src / alt", type: "string", defaultValue: "- / Avatar", description: "Imagem do avatar e texto alternativo." },
  { prop: "label / icon / fallback / children", type: "ReactNode", defaultValue: "-", description: "Conteúdo visual do avatar." },
  { prop: "size", type: "\"xs\" | \"sm\" | \"md\" | \"lg\" | \"xl\"", defaultValue: "md", description: "Tamanho do avatar." },
  { prop: "shape", type: "\"circle\" | \"square\"", defaultValue: "circle", description: "Formato do avatar." },
  { prop: "severity", type: "\"primary\" | \"secondary\" | \"success\" | \"warning\" | \"danger\" | \"info\" | \"neutral\" | \"custom\"", defaultValue: "primary", description: "Variação visual baseada no tema." },
  { prop: "bordered / disabled", type: "boolean", defaultValue: "true / false", description: "Borda e estado desabilitado." },
  { prop: "customColors", type: "{ bg, fg, border, ring }", defaultValue: "-", description: "Override de cores quando necessário." },
  { prop: "imageClassName / className", type: "string", defaultValue: "-", description: "Classes CSS para imagem e container." },
  { prop: "onImageError", type: "(event) => void", defaultValue: "-", description: "Callback para falha ao carregar imagem." },
  { prop: "SgAvatarGroup.children", type: "ReactNode", defaultValue: "-", description: "Lista de avatares no grupo." },
  { prop: "SgAvatarGroup.max / total", type: "number", defaultValue: "- / children.length", description: "Controle de quantos avatares exibir e total real." },
  { prop: "SgAvatarGroup.overlap", type: "\"none\" | \"sm\" | \"md\" | \"lg\"", defaultValue: "md", description: "Sobreposição entre itens." },
  { prop: "SgAvatarGroup.moreSeverity / moreLabel", type: "severity / (remaining) => ReactNode", defaultValue: "neutral / +N", description: "Avatar de excesso de itens." },
  { prop: "SgAvatarGroup.size / shape / bordered", type: "avatar props", defaultValue: "md / circle / true", description: "Estilo aplicado ao avatar de excesso." }
];

export default function SgAvatarPage() {
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgAvatar"
          subtitle="Avatar com suporte a label, ícone, imagem, severidade, tamanhos e agrupamento."
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title="1) Básico" description="Uso básico com label, ícone e imagem.">
          <Row>
            <SgAvatar label="P" />
            <SgAvatar icon={<User />} severity="secondary" />
            <SgAvatar src={IMG_AMY} alt="Amy Elsner" />
          </Row>
          <CodeBlock code={EXAMPLE_BASIC_CODE} />
        </Section>

        <Section title="2) Shape e Tamanho" description="Combinações de shape e size.">
          <Row>
            <SgAvatar label="C" shape="circle" />
            <SgAvatar label="S" shape="square" />
            <SgAvatar label="XS" size="xs" />
            <SgAvatar label="LG" size="lg" />
            <SgAvatar src={IMG_ASIYA} alt="Asiya Javayant" shape="square" />
          </Row>
          <CodeBlock code={EXAMPLE_SHAPES_SIZES_CODE} />
        </Section>

        <Section title="3) Severity e Cores Customizadas" description="Preset por severity e override de cores.">
          <Row>
            <SgAvatar label="P" severity="primary" />
            <SgAvatar label="S" severity="success" />
            <SgAvatar label="D" severity="danger" />
            <SgAvatar
              icon={<Camera />}
              severity="custom"
              customColors={{
                bg: "#7c3aed",
                fg: "#ffffff",
                border: "#5b21b6",
                ring: "rgba(124,58,237,0.35)"
              }}
            />
          </Row>
          <CodeBlock code={EXAMPLE_SEVERITY_CODE} />
        </Section>

        <Section title="4) Avatar Group" description="Agrupamento com sobreposição e contador automático.">
          <div className="space-y-4">
            <Row>
              <SgAvatarGroup>
                <SgAvatar src={IMG_AMY} alt="Amy Elsner" />
                <SgAvatar src={IMG_ASIYA} alt="Asiya Javayant" />
                <SgAvatar src={IMG_ONYAMA} alt="Onyama Limba" />
                <SgAvatar src={IMG_IONIBOWCHER} alt="Ioni Bowcher" />
              </SgAvatarGroup>
            </Row>
            <Row>
              <SgAvatarGroup max={3} total={6} size="sm" moreSeverity="secondary">
                <SgAvatar icon={<Users />} severity="info" size="sm" />
                <SgAvatar label="AL" severity="success" size="sm" />
                <SgAvatar label="BK" severity="warning" size="sm" />
                <SgAvatar label="CM" severity="danger" size="sm" />
              </SgAvatarGroup>
            </Row>
          </div>
          <CodeBlock code={EXAMPLE_GROUP_CODE} />
        </Section>

        <Section title="5) Playground" description="Ajuste shape, size, severity e borda em tempo real.">
          <SgPlayground
            title="SgAvatar Playground"
            interactive
            codeContract="appFile"
            code={PLAYGROUND_CODE}
            height={620}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={AVATAR_PROPS} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

