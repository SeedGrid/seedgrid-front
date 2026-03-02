"use client";

import React from "react";
import { Camera, User, Users } from "lucide-react";
import { SgAvatar, SgAvatarGroup, SgPlayground } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { useShowcaseI18n, type ShowcaseLocale } from "../../../i18n";

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

type AvatarTexts = {
  headerSubtitle: string;
  section1Title: string;
  section1Description: string;
  section2Title: string;
  section2Description: string;
  section3Title: string;
  section3Description: string;
  section4Title: string;
  section4Description: string;
  section5Title: string;
  section5Description: string;
  propsReferenceTitle: string;
};

const AVATAR_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", AvatarTexts> = {
  "pt-BR": {
    headerSubtitle: "Avatar com suporte a label, icone, imagem, severidade, tamanhos e agrupamento.",
    section1Title: "1) Basico",
    section1Description: "Uso basico com label, icone e imagem.",
    section2Title: "2) Shape e Tamanho",
    section2Description: "Combinacoes de shape e size.",
    section3Title: "3) Severity e Cores Customizadas",
    section3Description: "Preset por severity e override de cores.",
    section4Title: "4) Avatar Group",
    section4Description: "Agrupamento com sobreposicao e contador automatico.",
    section5Title: "5) Playground",
    section5Description: "Ajuste shape, size, severity e borda em tempo real.",
    propsReferenceTitle: "Referencia de Props",
  },
  "pt-PT": {
    headerSubtitle: "Avatar com suporte a label, icone, imagem, severidade, tamanhos e agrupamento.",
    section1Title: "1) Basico",
    section1Description: "Uso basico com label, icone e imagem.",
    section2Title: "2) Shape e Tamanho",
    section2Description: "Combinacoes de shape e size.",
    section3Title: "3) Severity e Cores Customizadas",
    section3Description: "Preset por severity e override de cores.",
    section4Title: "4) Avatar Group",
    section4Description: "Agrupamento com sobreposicao e contador automatico.",
    section5Title: "5) Playground",
    section5Description: "Ajuste shape, size, severity e borda em tempo real.",
    propsReferenceTitle: "Referencia de Props",
  },
  "en-US": {
    headerSubtitle: "Avatar with support for label, icon, image, severity, sizes, and grouping.",
    section1Title: "1) Basic",
    section1Description: "Basic usage with label, icon, and image.",
    section2Title: "2) Shape and Size",
    section2Description: "Shape and size combinations.",
    section3Title: "3) Severity and Custom Colors",
    section3Description: "Severity presets and color overrides.",
    section4Title: "4) Avatar Group",
    section4Description: "Grouping with overlap and automatic counter.",
    section5Title: "5) Playground",
    section5Description: "Adjust shape, size, severity, and border in real time.",
    propsReferenceTitle: "Props Reference",
  },
  es: {
    headerSubtitle: "Avatar con soporte para label, icono, imagen, severidad, tamanos y agrupacion.",
    section1Title: "1) Basico",
    section1Description: "Uso basico con label, icono e imagen.",
    section2Title: "2) Shape y Tamano",
    section2Description: "Combinaciones de shape y size.",
    section3Title: "3) Severity y Colores Personalizados",
    section3Description: "Preset por severity y override de colores.",
    section4Title: "4) Avatar Group",
    section4Description: "Agrupacion con superposicion y contador automatico.",
    section5Title: "5) Playground",
    section5Description: "Ajusta shape, size, severity y borde en tiempo real.",
    propsReferenceTitle: "Referencia de Props",
  },
};

type SupportedAvatarLocale = keyof typeof AVATAR_TEXTS;

function isSupportedAvatarLocale(locale: ShowcaseLocale): locale is SupportedAvatarLocale {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}

function getAvatarTexts(locale: ShowcaseLocale): AvatarTexts {
  const normalized: SupportedAvatarLocale = isSupportedAvatarLocale(locale) ? locale : "pt-BR";
  return AVATAR_TEXTS[normalized];
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
  { prop: "label / icon / fallback / children", type: "ReactNode", defaultValue: "-", description: "ConteÃºdo visual do avatar." },
  { prop: "size", type: "\"xs\" | \"sm\" | \"md\" | \"lg\" | \"xl\"", defaultValue: "md", description: "Tamanho do avatar." },
  { prop: "shape", type: "\"circle\" | \"square\"", defaultValue: "circle", description: "Formato do avatar." },
  { prop: "severity", type: "\"primary\" | \"secondary\" | \"success\" | \"warning\" | \"danger\" | \"info\" | \"neutral\" | \"custom\"", defaultValue: "primary", description: "VariaÃ§Ã£o visual baseada no tema." },
  { prop: "bordered / disabled", type: "boolean", defaultValue: "true / false", description: "Borda e estado desabilitado." },
  { prop: "customColors", type: "{ bg, fg, border, ring }", defaultValue: "-", description: "Override de cores quando necessÃ¡rio." },
  { prop: "imageClassName / className", type: "string", defaultValue: "-", description: "Classes CSS para imagem e container." },
  { prop: "onImageError", type: "(event) => void", defaultValue: "-", description: "Callback para falha ao carregar imagem." },
  { prop: "SgAvatarGroup.children", type: "ReactNode", defaultValue: "-", description: "Lista de avatares no grupo." },
  { prop: "SgAvatarGroup.max / total", type: "number", defaultValue: "- / children.length", description: "Controle de quantos avatares exibir e total real." },
  { prop: "SgAvatarGroup.overlap", type: "\"none\" | \"sm\" | \"md\" | \"lg\"", defaultValue: "md", description: "SobreposiÃ§Ã£o entre itens." },
  { prop: "SgAvatarGroup.moreSeverity / moreLabel", type: "severity / (remaining) => ReactNode", defaultValue: "neutral / +N", description: "Avatar de excesso de itens." },
  { prop: "SgAvatarGroup.size / shape / bordered", type: "avatar props", defaultValue: "md / circle / true", description: "Estilo aplicado ao avatar de excesso." }
];

export default function SgAvatarPage() {
  const i18n = useShowcaseI18n();
  const texts = React.useMemo(() => getAvatarTexts(i18n.locale), [i18n.locale]);
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } =
    useShowcaseAnchors({ deps: [i18n.locale] });

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
          subtitle={texts.headerSubtitle}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title={texts.section1Title} description={texts.section1Description}>
          <Row>
            <SgAvatar label="P" />
            <SgAvatar icon={<User />} severity="secondary" />
            <SgAvatar src={IMG_AMY} alt="Amy Elsner" />
          </Row>
          <CodeBlock code={EXAMPLE_BASIC_CODE} />
        </Section>

        <Section title={texts.section2Title} description={texts.section2Description}>
          <Row>
            <SgAvatar label="C" shape="circle" />
            <SgAvatar label="S" shape="square" />
            <SgAvatar label="XS" size="xs" />
            <SgAvatar label="LG" size="lg" />
            <SgAvatar src={IMG_ASIYA} alt="Asiya Javayant" shape="square" />
          </Row>
          <CodeBlock code={EXAMPLE_SHAPES_SIZES_CODE} />
        </Section>

        <Section title={texts.section3Title} description={texts.section3Description}>
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

        <Section title={texts.section4Title} description={texts.section4Description}>
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

        <Section title={texts.section5Title} description={texts.section5Description}>
          <SgPlayground
            title="SgAvatar Playground"
            interactive
            codeContract="appFile"
            code={PLAYGROUND_CODE}
            height={620}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={AVATAR_PROPS} title={texts.propsReferenceTitle} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

