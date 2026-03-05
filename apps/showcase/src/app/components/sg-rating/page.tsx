"use client";

import * as React from "react";
import Link from "next/link";
import { useForm, type FieldValues } from "react-hook-form";
import { Flame, Heart, ThumbsUp } from "lucide-react";
import {
  SgButton,
  SgGrid,
  SgPlayground,
  SgRating
} from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference from "../ShowcasePropsReference";
import { useShowcaseI18n, type ShowcaseLocale } from "../../../i18n";

function Section(props: {
  id?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={props.id}
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? (
        <p className="mt-1 text-sm text-muted-foreground">{props.description}</p>
      ) : null}
      <div className="mt-4 space-y-4">{props.children}</div>
    </section>
  );
}

type PropRow = {
  prop: string;
  type: string;
  defaultValue: string;
  description: string;
};

const RATING_PROPS: PropRow[] = [
  { prop: "id", type: "string", defaultValue: "-", description: "Unique component identifier." },
  { prop: "label", type: "string", defaultValue: "-", description: "Label text displayed above the rating." },
  { prop: "value", type: "number", defaultValue: "0", description: "Current rating value." },
  { prop: "stars", type: "number", defaultValue: "5", description: "Quantidade total de estrelas." },
  { prop: "allowHalf", type: "boolean", defaultValue: "false", description: "Permite selecao de meia estrela." },
  { prop: "cancel", type: "boolean", defaultValue: "true", description: "Shows a button to clear the rating." },
  { prop: "disabled", type: "boolean", defaultValue: "false", description: "Desabilita a interacao com o componente." },
  { prop: "readOnly", type: "boolean", defaultValue: "false", description: "Mantem visualizacao sem permitir alteracao." },
  { prop: "size", type: "\"sm\" | \"md\" | \"lg\" | \"xl\"", defaultValue: "\"md\"", description: "Define o tamanho das estrelas." },
  { prop: "className", type: "string", defaultValue: "-", description: "Classe CSS customizada para o container." },
  { prop: "onIcon", type: "ReactNode", defaultValue: "-", description: "Icone customizado para estado preenchido." },
  { prop: "offIcon", type: "ReactNode", defaultValue: "-", description: "Icone customizado para estado vazio." },
  { prop: "cancelIcon", type: "ReactNode", defaultValue: "-", description: "Icone customizado do botao de limpar." },
  { prop: "color", type: "string", defaultValue: "\"hsl(var(--primary))\"", description: "Color of the filled icon." },
  { prop: "emptyColor", type: "string", defaultValue: "\"hsl(var(--muted-foreground))\"", description: "Color of the empty icon." },
  { prop: "showTooltip", type: "boolean", defaultValue: "false", description: "Exibe tooltip com valor ao passar o mouse." },
  { prop: "onChange", type: "(value: number) => void", defaultValue: "-", description: "Callback disparado quando o valor muda." },
  { prop: "onHover", type: "(value: number | null) => void", defaultValue: "-", description: "Callback disparado no hover das estrelas." },
  { prop: "register", type: "UseFormRegister<FieldValues>", defaultValue: "-", description: "React Hook Form integration via register." },
  { prop: "name", type: "string", defaultValue: "-", description: "Nome do campo para integracao com formulario." },
  { prop: "control", type: "any", defaultValue: "-", description: "Control do React Hook Form." },
  { prop: "error", type: "string", defaultValue: "-", description: "Mensagem de erro externa." },
  { prop: "required", type: "boolean", defaultValue: "false", description: "Marks the field as required." },
  { prop: "requiredMessage", type: "string", defaultValue: "-", description: "Mensagem de validacao para required." }
];


type RatingTexts = {
  subtitle: string;
  examplesLabel: string;
  propsLinkLabel: string;
  propsTitle: string;
  propsColProp: string;
  propsColType: string;
  propsColDefault: string;
  propsColDescription: string;
  sectionTitles: string[];
  sectionDescriptions: string[];
  playgroundTitle: string;
};

const RATING_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", RatingTexts> = {
  "pt-BR": {
    subtitle: "Rating component with half-star support, visual states, icon customization and React Hook Form integration.",
    examplesLabel: "Examples",
    propsLinkLabel: "Referência de Props",
    propsTitle: "Referência de Props",
    propsColProp: "Prop",
    propsColType: "Tipo",
    propsColDefault: "Default",
    propsColDescription: "Description",
    sectionTitles: [
      "1) Basico",
      "2) Meia estrela + tooltip",
      "3) Read-only e desabilitado",
      "4) Tamanhos e quantidade de estrelas",
      "5) Cores e icones customizados",
      "6) Callbacks",
      "7) React Hook Form",
      "8) Campo obrigatorio",
      "9) Playground (SgPlayground)"
    ],
    sectionDescriptions: [
      "Example controlado com estado React.",
      "Permite clicar nas metades e exibir valor no hover.",
      "Visualizacao sem interacao e estado disabled.",
      "Controle de size e stars.",
      "Troca de cores e icones de preenchido/vazio.",
      "Example com onChange e onHover + log de eventos.",
      "Uso com control/name e submit.",
      "Example com required e requiredMessage.",
      "Simule as props principais em tempo real."
    ],
    playgroundTitle: "SgRating Playground"
  },
  "pt-PT": {
    subtitle: "Rating component with half-star support, visual states, icon customization and React Hook Form integration.",
    examplesLabel: "Examples",
    propsLinkLabel: "Referência de Props",
    propsTitle: "Referência de Props",
    propsColProp: "Prop",
    propsColType: "Tipo",
    propsColDefault: "Default",
    propsColDescription: "Description",
    sectionTitles: [
      "1) Basico",
      "2) Meia estrela + tooltip",
      "3) Read-only e desabilitado",
      "4) Tamanhos e quantidade de estrelas",
      "5) Cores e icones customizados",
      "6) Callbacks",
      "7) React Hook Form",
      "8) Campo obrigatorio",
      "9) Playground (SgPlayground)"
    ],
    sectionDescriptions: [
      "Example controlado com estado React.",
      "Permite clicar nas metades e exibir valor no hover.",
      "Visualizacao sem interacao e estado disabled.",
      "Controle de size e stars.",
      "Troca de cores e icones de preenchido/vazio.",
      "Example com onChange e onHover + log de eventos.",
      "Uso com control/name e submit.",
      "Example com required e requiredMessage.",
      "Simule as props principais em tempo real."
    ],
    playgroundTitle: "SgRating Playground"
  },
  "en-US": {
    subtitle: "Rating component with half-star support, visual states, icon customization and React Hook Form integration.",
    examplesLabel: "Examples",
    propsLinkLabel: "Props Reference",
    propsTitle: "Props Reference",
    propsColProp: "Prop",
    propsColType: "Type",
    propsColDefault: "Default",
    propsColDescription: "Description",
    sectionTitles: [
      "1) Basic",
      "2) Half star + tooltip",
      "3) Read-only and disabled",
      "4) Sizes and number of stars",
      "5) Colors and custom icons",
      "6) Callbacks",
      "7) React Hook Form",
      "8) Required field",
      "9) Playground (SgPlayground)"
    ],
    sectionDescriptions: [
      "Controlled example with React state.",
      "Allows half-click selection and hover value tooltip.",
      "View-only and disabled state.",
      "Control of size and stars.",
      "Switch filled/empty colors and icons.",
      "Example with onChange and onHover + event log.",
      "Usage with control/name and submit.",
      "Example using required and requiredMessage.",
      "Simulate main props in real time."
    ],
    playgroundTitle: "SgRating Playground"
  },
  es: {
    subtitle: "Rating component with half-star support, visual states, icon customization, and React Hook Form integration.",
    examplesLabel: "Ejemplos",
    propsLinkLabel: "Referencia de Props",
    propsTitle: "Referencia de Props",
    propsColProp: "Prop",
    propsColType: "Tipo",
    propsColDefault: "Predeterminado",
    propsColDescription: "Descripcion",
    sectionTitles: [
      "1) Basico",
      "2) Media estrella + tooltip",
      "3) Solo lectura y deshabilitado",
      "4) Tamanhos y cantidad de estrellas",
      "5) Colores e iconos personalizados",
      "6) Callbacks",
      "7) React Hook Form",
      "8) Campo obligatorio",
      "9) Playground (SgPlayground)"
    ],
    sectionDescriptions: [
      "Ejemplo controlado con estado React.",
      "Permite clicar mitades y mostrar valor en hover.",
      "Visualizacion sin interaccion y estado disabled.",
      "Control de size y stars.",
      "Cambio de colores e iconos llenos/vacios.",
      "Ejemplo con onChange y onHover + log de eventos.",
      "Uso con control/name y submit.",
      "Ejemplo con required y requiredMessage.",
      "Simula las props principales en tiempo real."
    ],
    playgroundTitle: "SgRating Playground"
  }
};

function isSupportedLocale(locale: ShowcaseLocale): locale is keyof typeof RATING_TEXTS {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}
const BASIC_CODE = `import * as React from "react";
import { SgRating } from "@seedgrid/fe-components";

export default function Example() {
  const [value, setValue] = React.useState(0);

  return (
    <div className="space-y-2">
      <SgRating value={value} onChange={setValue} />
      <p className="text-sm text-muted-foreground">
        Current value: <strong>{value}</strong>
      </p>
    </div>
  );
}`;

const HALF_TOOLTIP_CODE = `import * as React from "react";
import { SgRating } from "@seedgrid/fe-components";

export default function Example() {
  const [value, setValue] = React.useState(2.5);
  const [hover, setHover] = React.useState<number | null>(null);

  return (
    <div className="space-y-2">
      <SgRating
        label="Hover and click half stars"
        value={value}
        allowHalf
        showTooltip
        onChange={setValue}
        onHover={setHover}
      />
      <p className="text-sm text-muted-foreground">
        Selected: <strong>{value}</strong> | Hover: <strong>{hover ?? "none"}</strong>
      </p>
    </div>
  );
}`;

const READONLY_DISABLED_CODE = `import * as React from "react";
import { SgGrid, SgRating } from "@seedgrid/fe-components";

export default function Example() {
  return (
    <SgGrid columns={{ base: 1, md: 2 }} gap={16}>
      <SgRating
        label="Read-only"
        value={3.5}
        allowHalf
        readOnly
      />

      <SgRating
        label="Desabilitado"
        value={2}
        disabled
      />
    </SgGrid>
  );
}`;

const SIZE_STARS_CODE = `import * as React from "react";
import { SgGrid, SgRating } from "@seedgrid/fe-components";

export default function Example() {
  const [smValue, setSmValue] = React.useState(3);
  const [lgValue, setLgValue] = React.useState(4);
  const [manyValue, setManyValue] = React.useState(7);

  return (
    <SgGrid columns={{ base: 1, md: 2 }} gap={16}>
      <SgRating
        label="sm / 5 estrelas"
        size="sm"
        value={smValue}
        onChange={setSmValue}
      />

      <SgRating
        label="lg / 5 estrelas"
        size="lg"
        value={lgValue}
        onChange={setLgValue}
      />

      <SgRating
        label="10 estrelas"
        stars={10}
        size="sm"
        value={manyValue}
        onChange={setManyValue}
      />
    </SgGrid>
  );
}`;

const COLORS_ICONS_CODE = `import * as React from "react";
import { Flame, Heart, ThumbsUp } from "lucide-react";
import { SgGrid, SgRating } from "@seedgrid/fe-components";

export default function Example() {
  const [heartValue, setHeartValue] = React.useState(4);
  const [likeValue, setLikeValue] = React.useState(3);
  const [fireValue, setFireValue] = React.useState(5);

  return (
    <SgGrid columns={{ base: 1, md: 2 }} gap={16}>
      <SgRating
        label="Heart"
        value={heartValue}
        color="#ec4899"
        emptyColor="#f9a8d4"
        onIcon={<Heart size={24} fill="currentColor" />}
        offIcon={<Heart size={24} />}
        onChange={setHeartValue}
      />

      <SgRating
        label="Likes"
        value={likeValue}
        color="#2563eb"
        emptyColor="#93c5fd"
        onIcon={<ThumbsUp size={24} fill="currentColor" />}
        offIcon={<ThumbsUp size={24} />}
        onChange={setLikeValue}
      />

      <SgRating
        label="Fire"
        value={fireValue}
        color="#f97316"
        emptyColor="#fdba74"
        onIcon={<Flame size={24} fill="currentColor" />}
        offIcon={<Flame size={24} />}
        onChange={setFireValue}
      />
    </SgGrid>
  );
}`;

const CALLBACK_CODE = `import * as React from "react";
import { SgButton, SgGrid, SgRating } from "@seedgrid/fe-components";

export default function Example() {
  const [value, setValue] = React.useState(3);
  const [hover, setHover] = React.useState<number | null>(null);
  const [logs, setLogs] = React.useState<string[]>([]);

  const pushLog = React.useCallback((msg: string) => {
    setLogs((prev) => [msg, ...prev].slice(0, 8));
  }, []);

  return (
    <div className="space-y-3">
      <SgRating
        label="Callbacks"
        value={value}
        allowHalf
        onChange={(next) => {
          setValue(next);
          pushLog("onChange -> " + String(next));
        }}
        onHover={setHover}
      />

      <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
        <SgButton size="sm" appearance="outline" onClick={() => setValue(0)}>
          Reset
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setValue(5)}>
          Max
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setLogs([])}>
          Clear log
        </SgButton>
      </SgGrid>

      <p className="text-sm text-muted-foreground">
        Selected: <strong>{value}</strong> | Hover: <strong>{hover ?? "none"}</strong>
      </p>

      <div className="h-28 overflow-y-auto rounded border border-border bg-foreground/5 p-2 font-mono text-xs">
        {logs.length === 0 ? "No events" : logs.map((entry, index) => <div key={index}>{entry}</div>)}
      </div>
    </div>
  );
}`;

const RHF_CODE = `import * as React from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { SgButton, SgRating } from "@seedgrid/fe-components";

export default function Example() {
  const [submitResult, setSubmitResult] = React.useState("-");
  const { control, handleSubmit, watch } = useForm<FieldValues>({
    defaultValues: {
      productRating: 4,
      movieRating: 2.5
    }
  });

  return (
    <form onSubmit={handleSubmit((data) => setSubmitResult(JSON.stringify(data)))} className="space-y-4">
      <SgRating
        label="Rate the product"
        name="productRating"
        control={control}
      />

      <SgRating
        label="Rate the movie"
        name="movieRating"
        control={control}
        allowHalf
      />

      <SgButton type="submit" size="sm">
        Submit rating
      </SgButton>

      <p className="text-xs text-muted-foreground">
        watch.productRating: <strong>{String(watch("productRating"))}</strong>
        {" | "}
        watch.movieRating: <strong>{String(watch("movieRating"))}</strong>
      </p>
      <p className="text-xs text-muted-foreground">Last submit: {submitResult}</p>
    </form>
  );
}`;

const REQUIRED_CODE = `import * as React from "react";
import { SgButton, SgGrid, SgRating } from "@seedgrid/fe-components";

export default function Example() {
  const [value, setValue] = React.useState(0);

  return (
    <div className="space-y-3">
      <SgRating
        label="Required rating"
        value={value}
        required
        requiredMessage="Provide a rating before continuing"
        onChange={setValue}
      />

      <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
        <SgButton size="sm" appearance="outline" onClick={() => setValue(0)}>
          Clear
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setValue(1)}>
          Rate 1
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setValue(5)}>
          Rate 5
        </SgButton>
      </SgGrid>

      <p className="text-sm text-muted-foreground">
        Current value: <strong>{value}</strong>
      </p>
    </div>
  );
}`;

const PLAYGROUND_CODE = `import * as React from "react";
import { SgButton, SgGrid, SgRating } from "@seedgrid/fe-components";

const sizes = ["sm", "md", "lg", "xl"] as const;
type Size = (typeof sizes)[number];

export default function App() {
  const [value, setValue] = React.useState(3);
  const [stars, setStars] = React.useState(5);
  const [size, setSize] = React.useState<Size>("md");
  const [allowHalf, setAllowHalf] = React.useState(false);
  const [cancel, setCancel] = React.useState(true);
  const [disabled, setDisabled] = React.useState(false);
  const [readOnly, setReadOnly] = React.useState(false);
  const [showTooltip, setShowTooltip] = React.useState(false);
  const [required, setRequired] = React.useState(false);

  return (
    <div className="space-y-4 p-2">
      <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
        <SgButton
          size="sm"
          appearance="outline"
          onClick={() => setStars((prev) => Math.max(1, prev - 1))}
        >
          - stars
        </SgButton>
        <SgButton
          size="sm"
          appearance="outline"
          onClick={() => setStars((prev) => Math.min(10, prev + 1))}
        >
          + stars
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setValue(0)}>
          Clear
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setValue(stars)}>
          Max
        </SgButton>
      </SgGrid>

      <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
        {sizes.map((sizeOption) => (
          <SgButton
            key={sizeOption}
            size="sm"
            appearance={size === sizeOption ? "solid" : "outline"}
            onClick={() => setSize(sizeOption)}
          >
            size {sizeOption}
          </SgButton>
        ))}
      </SgGrid>

      <SgGrid columns={{ base: 2, md: 3 }} gap={8}>
        <SgButton size="sm" appearance={allowHalf ? "solid" : "outline"} onClick={() => setAllowHalf((v) => !v)}>
          allowHalf
        </SgButton>
        <SgButton size="sm" appearance={cancel ? "solid" : "outline"} onClick={() => setCancel((v) => !v)}>
          cancel
        </SgButton>
        <SgButton size="sm" appearance={disabled ? "solid" : "outline"} onClick={() => setDisabled((v) => !v)}>
          disabled
        </SgButton>
        <SgButton size="sm" appearance={readOnly ? "solid" : "outline"} onClick={() => setReadOnly((v) => !v)}>
          readOnly
        </SgButton>
        <SgButton size="sm" appearance={showTooltip ? "solid" : "outline"} onClick={() => setShowTooltip((v) => !v)}>
          showTooltip
        </SgButton>
        <SgButton size="sm" appearance={required ? "solid" : "outline"} onClick={() => setRequired((v) => !v)}>
          required
        </SgButton>
      </SgGrid>

      <div className="rounded-md border border-border p-5">
        <SgRating
          label="Rating Playground"
          value={value}
          stars={stars}
          size={size}
          allowHalf={allowHalf}
          cancel={cancel}
          disabled={disabled}
          readOnly={readOnly}
          showTooltip={showTooltip}
          required={required}
          onChange={setValue}
        />
      </div>

      <div className="rounded-md border border-border bg-muted/30 p-3 text-xs">
        value: <strong>{value}</strong> | stars: <strong>{stars}</strong> | size: <strong>{size}</strong>
      </div>
    </div>
  );
}`;

function BasicExample() {
  const [value, setValue] = React.useState(0);

  return (
    <div className="space-y-2">
      <SgRating value={value} onChange={setValue} />
      <p className="text-sm text-muted-foreground">
        Current value: <strong>{value}</strong>
      </p>
    </div>
  );
}

function HalfTooltipExample() {
  const [value, setValue] = React.useState(2.5);
  const [hover, setHover] = React.useState<number | null>(null);

  return (
    <div className="space-y-2">
      <SgRating
        label="Hover and click half stars"
        value={value}
        allowHalf
        showTooltip
        onChange={setValue}
        onHover={setHover}
      />
      <p className="text-sm text-muted-foreground">
        Selected: <strong>{value}</strong> | Hover: <strong>{hover ?? "none"}</strong>
      </p>
    </div>
  );
}

function ReadonlyDisabledExample() {
  return (
    <SgGrid columns={{ base: 1, md: 2 }} gap={16}>
      <SgRating
        label="Read-only"
        value={3.5}
        allowHalf
        readOnly
      />

      <SgRating
        label="Desabilitado"
        value={2}
        disabled
      />
    </SgGrid>
  );
}

function SizeStarsExample() {
  const [smValue, setSmValue] = React.useState(3);
  const [lgValue, setLgValue] = React.useState(4);
  const [manyValue, setManyValue] = React.useState(7);

  return (
    <SgGrid columns={{ base: 1, md: 2 }} gap={16}>
      <SgRating
        label="sm / 5 estrelas"
        size="sm"
        value={smValue}
        onChange={setSmValue}
      />

      <SgRating
        label="lg / 5 estrelas"
        size="lg"
        value={lgValue}
        onChange={setLgValue}
      />

      <SgRating
        label="10 estrelas"
        stars={10}
        size="sm"
        value={manyValue}
        onChange={setManyValue}
      />
    </SgGrid>
  );
}

function ColorsIconsExample() {
  const [heartValue, setHeartValue] = React.useState(4);
  const [likeValue, setLikeValue] = React.useState(3);
  const [fireValue, setFireValue] = React.useState(5);

  return (
    <SgGrid columns={{ base: 1, md: 2 }} gap={16}>
      <SgRating
        label="Heart"
        value={heartValue}
        color="#ec4899"
        emptyColor="#f9a8d4"
        onIcon={<Heart size={24} fill="currentColor" />}
        offIcon={<Heart size={24} />}
        onChange={setHeartValue}
      />

      <SgRating
        label="Likes"
        value={likeValue}
        color="#2563eb"
        emptyColor="#93c5fd"
        onIcon={<ThumbsUp size={24} fill="currentColor" />}
        offIcon={<ThumbsUp size={24} />}
        onChange={setLikeValue}
      />

      <SgRating
        label="Fire"
        value={fireValue}
        color="#f97316"
        emptyColor="#fdba74"
        onIcon={<Flame size={24} fill="currentColor" />}
        offIcon={<Flame size={24} />}
        onChange={setFireValue}
      />
    </SgGrid>
  );
}

function CallbackExample() {
  const [value, setValue] = React.useState(3);
  const [hover, setHover] = React.useState<number | null>(null);
  const [logs, setLogs] = React.useState<string[]>([]);

  const pushLog = React.useCallback((msg: string) => {
    setLogs((prev) => [msg, ...prev].slice(0, 8));
  }, []);

  return (
    <div className="space-y-3">
      <SgRating
        label="Callbacks"
        value={value}
        allowHalf
        onChange={(next) => {
          setValue(next);
          pushLog("onChange -> " + String(next));
        }}
        onHover={setHover}
      />

      <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
        <SgButton size="sm" appearance="outline" onClick={() => setValue(0)}>
          Reset
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setValue(5)}>
          Max
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setLogs([])}>
          Clear log
        </SgButton>
      </SgGrid>

      <p className="text-sm text-muted-foreground">
        Selected: <strong>{value}</strong> | Hover: <strong>{hover ?? "none"}</strong>
      </p>

      <div className="h-28 overflow-y-auto rounded border border-border bg-foreground/5 p-2 font-mono text-xs">
        {logs.length === 0 ? "No events" : logs.map((entry, index) => <div key={index}>{entry}</div>)}
      </div>
    </div>
  );
}

function RhfExample() {
  const [submitResult, setSubmitResult] = React.useState("-");
  const { control, handleSubmit, watch } = useForm<FieldValues>({
    defaultValues: {
      productRating: 4,
      movieRating: 2.5
    }
  });

  return (
    <form onSubmit={handleSubmit((data) => setSubmitResult(JSON.stringify(data)))} className="space-y-4">
      <SgRating
        label="Rate the product"
        name="productRating"
        control={control}
      />

      <SgRating
        label="Rate the movie"
        name="movieRating"
        control={control}
        allowHalf
      />

      <SgButton type="submit" size="sm">
        Submit rating
      </SgButton>

      <p className="text-xs text-muted-foreground">
        watch.productRating: <strong>{String(watch("productRating"))}</strong>
        {" | "}
        watch.movieRating: <strong>{String(watch("movieRating"))}</strong>
      </p>
      <p className="text-xs text-muted-foreground">Last submit: {submitResult}</p>
    </form>
  );
}

function RequiredExample() {
  const [value, setValue] = React.useState(0);

  return (
    <div className="space-y-3">
      <SgRating
        label="Required rating"
        value={value}
        required
        requiredMessage="Provide a rating before continuing"
        onChange={setValue}
      />

      <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
        <SgButton size="sm" appearance="outline" onClick={() => setValue(0)}>
          Clear
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setValue(1)}>
          Rate 1
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setValue(5)}>
          Rate 5
        </SgButton>
      </SgGrid>

      <p className="text-sm text-muted-foreground">
        Current value: <strong>{value}</strong>
      </p>
    </div>
  );
}

export default function SgRatingPage() {
  const i18n = useShowcaseI18n();
  const locale: keyof typeof RATING_TEXTS = isSupportedLocale(i18n.locale) ? i18n.locale : "en-US";
  const texts = RATING_TEXTS[locale];
  const exampleLinks = React.useMemo(() => texts.sectionTitles.map((label, index) => ({ id: `exemplo-${index + 1}`, label })), [texts]);
  const stickyHeaderRef = React.useRef<HTMLDivElement | null>(null);
  const [anchorOffset, setAnchorOffset] = React.useState(320);

  React.useEffect(() => {
    const updateAnchorOffset = () => {
      const headerHeight = stickyHeaderRef.current?.getBoundingClientRect().height ?? 0;
      setAnchorOffset(Math.max(240, Math.ceil(headerHeight + 40)));
    };

    updateAnchorOffset();
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateAnchorOffset) : null;
    if (resizeObserver && stickyHeaderRef.current) {
      resizeObserver.observe(stickyHeaderRef.current);
    }

    window.addEventListener("resize", updateAnchorOffset);
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateAnchorOffset);
    };
  }, []);

  const findScrollContainer = React.useCallback((element: HTMLElement | null): HTMLElement | Window => {
    let current = element?.parentElement ?? null;
    while (current) {
      const style = window.getComputedStyle(current);
      const overflowY = style.overflowY;
      if ((overflowY === "auto" || overflowY === "scroll") && current.scrollHeight > current.clientHeight) {
        return current;
      }
      current = current.parentElement;
    }
    return window;
  }, []);

  const navigateToAnchor = React.useCallback((anchorId: string) => {
    const target = document.getElementById(anchorId);
    if (!target) return;

    const scrollContainer = findScrollContainer(target);
    const extraTopGap = 12;
    const titleEl =
      (target.querySelector("h1, h2, h3, [data-anchor-title='true']") as HTMLElement | null) ?? target;

    const correctIfNeeded = () => {
      const stickyBottomNow = stickyHeaderRef.current?.getBoundingClientRect().bottom ?? 0;
      const desiredTopNow = stickyBottomNow + extraTopGap;
      const currentTop = titleEl.getBoundingClientRect().top;
      const delta = currentTop - desiredTopNow;
      if (Math.abs(delta) <= 1) return;

      if (scrollContainer === window) {
        const next = Math.max(0, window.scrollY + delta);
        window.scrollTo({ top: next, behavior: "auto" });
        return;
      }

      const container = scrollContainer as HTMLElement;
      const next = Math.max(0, container.scrollTop + delta);
      container.scrollTo({ top: next, behavior: "auto" });
    };

    if (scrollContainer === window) {
      const stickyBottomNow = stickyHeaderRef.current?.getBoundingClientRect().bottom ?? 0;
      const desiredTopNow = stickyBottomNow + extraTopGap;
      const titleTop = window.scrollY + titleEl.getBoundingClientRect().top;
      window.scrollTo({ top: Math.max(0, titleTop - desiredTopNow), behavior: "auto" });
    } else {
      const container = scrollContainer as HTMLElement;
      const containerRect = container.getBoundingClientRect();
      const stickyBottomNow = stickyHeaderRef.current?.getBoundingClientRect().bottom ?? 0;
      const desiredTopInContainer = stickyBottomNow + extraTopGap - containerRect.top;
      const titleRect = titleEl.getBoundingClientRect();
      const titleTopInContainer = container.scrollTop + (titleRect.top - containerRect.top);
      container.scrollTo({ top: Math.max(0, titleTopInContainer - desiredTopInContainer), behavior: "auto" });
    }

    window.history.replaceState(null, "", `#${anchorId}`);
    requestAnimationFrame(() => {
      correctIfNeeded();
      requestAnimationFrame(correctIfNeeded);
    });
    window.setTimeout(correctIfNeeded, 120);
    window.setTimeout(correctIfNeeded, 260);
  }, [findScrollContainer]);

  const handleAnchorClick = React.useCallback((event: React.MouseEvent<HTMLAnchorElement>, anchorId: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    navigateToAnchor(anchorId);
  }, [navigateToAnchor]);

  const navigateToAnchorRef = React.useRef(navigateToAnchor);
  React.useEffect(() => {
    navigateToAnchorRef.current = navigateToAnchor;
  }, [navigateToAnchor]);

  React.useEffect(() => {
    const applyHashNavigation = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) return;
      navigateToAnchorRef.current(hash);
    };

    const timer = window.setTimeout(applyHashNavigation, 0);
    window.addEventListener("hashchange", applyHashNavigation);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", applyHashNavigation);
    };
  }, []);

  return (
    <I18NReady>
      <div
        className="max-w-6xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <div ref={stickyHeaderRef} className="sticky top-0 z-50 isolate max-h-[52vh] overflow-y-auto bg-background pb-2 pt-2 md:-top-8 md:max-h-none md:overflow-visible md:pb-2 md:pt-8">
          <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
            <h1 className="text-3xl font-bold">SgRating</h1>
            <p className="mt-2 text-muted-foreground">{texts.subtitle}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{texts.examplesLabel}</p>
            <SgGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={8} className="mt-2">
              {exampleLinks.map((example) => (
                <Link
                  key={example.id}
                  href={`#${example.id}`}
                  onClick={(event) => handleAnchorClick(event, example.id)}
                  className="rounded-md border border-border px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-muted/40"
                >
                  {example.label}
                </Link>
              ))}
              <Link
                href="#props-reference"
                onClick={(event) => handleAnchorClick(event, "props-reference")}
                className="rounded-md border border-border px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-muted/40"
              >{texts.propsLinkLabel}</Link>
            </SgGrid>
          </div>
        </div>

        <Section id="exemplo-1" title={texts.sectionTitles[0] ?? ""} description={texts.sectionDescriptions[0] ?? ""}>
          <BasicExample />
          <CodeBlockBase code={BASIC_CODE} />
        </Section>

        <Section id="exemplo-2" title={texts.sectionTitles[1] ?? ""} description={texts.sectionDescriptions[1] ?? ""}>
          <HalfTooltipExample />
          <CodeBlockBase code={HALF_TOOLTIP_CODE} />
        </Section>

        <Section id="exemplo-3" title={texts.sectionTitles[2] ?? ""} description={texts.sectionDescriptions[2] ?? ""}>
          <ReadonlyDisabledExample />
          <CodeBlockBase code={READONLY_DISABLED_CODE} />
        </Section>

        <Section id="exemplo-4" title={texts.sectionTitles[3] ?? ""} description={texts.sectionDescriptions[3] ?? ""}>
          <SizeStarsExample />
          <CodeBlockBase code={SIZE_STARS_CODE} />
        </Section>

        <Section id="exemplo-5" title={texts.sectionTitles[4] ?? ""} description={texts.sectionDescriptions[4] ?? ""}>
          <ColorsIconsExample />
          <CodeBlockBase code={COLORS_ICONS_CODE} />
        </Section>

        <Section id="exemplo-6" title={texts.sectionTitles[5] ?? ""} description={texts.sectionDescriptions[5] ?? ""}>
          <CallbackExample />
          <CodeBlockBase code={CALLBACK_CODE} />
        </Section>

        <Section id="exemplo-7" title={texts.sectionTitles[6] ?? ""} description={texts.sectionDescriptions[6] ?? ""}>
          <RhfExample />
          <CodeBlockBase code={RHF_CODE} />
        </Section>

        <Section id="exemplo-8" title={texts.sectionTitles[7] ?? ""} description={texts.sectionDescriptions[7] ?? ""}>
          <RequiredExample />
          <CodeBlockBase code={REQUIRED_CODE} />
        </Section>

        <Section id="exemplo-9" title={texts.sectionTitles[8] ?? ""} description={texts.sectionDescriptions[8] ?? ""}>
          <SgPlayground
            title={texts.playgroundTitle}
            interactive
            codeContract="appFile"
            code={PLAYGROUND_CODE}
            height={660}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference id="props-reference" title={texts.propsTitle} rows={RATING_PROPS} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}






