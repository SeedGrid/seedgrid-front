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
  { prop: "id", type: "string", defaultValue: "-", description: "Identificador único do componente." },
  { prop: "label", type: "string", defaultValue: "-", description: "Texto do label exibido acima do rating." },
  { prop: "value", type: "number", defaultValue: "0", description: "Valor atual da avaliação." },
  { prop: "stars", type: "number", defaultValue: "5", description: "Quantidade total de estrelas." },
  { prop: "allowHalf", type: "boolean", defaultValue: "false", description: "Permite seleção de meia estrela." },
  { prop: "cancel", type: "boolean", defaultValue: "true", description: "Exibe botão para limpar a avaliação." },
  { prop: "disabled", type: "boolean", defaultValue: "false", description: "Desabilita a interação com o componente." },
  { prop: "readOnly", type: "boolean", defaultValue: "false", description: "Mantém visualização sem permitir alteração." },
  { prop: "size", type: "\"sm\" | \"md\" | \"lg\" | \"xl\"", defaultValue: "\"md\"", description: "Define o tamanho das estrelas." },
  { prop: "className", type: "string", defaultValue: "-", description: "Classe CSS customizada para o container." },
  { prop: "onIcon", type: "ReactNode", defaultValue: "-", description: "Ícone customizado para estado preenchido." },
  { prop: "offIcon", type: "ReactNode", defaultValue: "-", description: "Ícone customizado para estado vazio." },
  { prop: "cancelIcon", type: "ReactNode", defaultValue: "-", description: "Ícone customizado do botão de limpar." },
  { prop: "color", type: "string", defaultValue: "\"hsl(var(--primary))\"", description: "Cor do ícone preenchido." },
  { prop: "emptyColor", type: "string", defaultValue: "\"hsl(var(--muted-foreground))\"", description: "Cor do ícone vazio." },
  { prop: "showTooltip", type: "boolean", defaultValue: "false", description: "Exibe tooltip com valor ao passar o mouse." },
  { prop: "onChange", type: "(value: number) => void", defaultValue: "-", description: "Callback disparado quando o valor muda." },
  { prop: "onHover", type: "(value: number | null) => void", defaultValue: "-", description: "Callback disparado no hover das estrelas." },
  { prop: "register", type: "UseFormRegister<FieldValues>", defaultValue: "-", description: "Integração React Hook Form via register." },
  { prop: "name", type: "string", defaultValue: "-", description: "Nome do campo para integração com formulário." },
  { prop: "control", type: "any", defaultValue: "-", description: "Control do React Hook Form." },
  { prop: "error", type: "string", defaultValue: "-", description: "Mensagem de erro externa." },
  { prop: "required", type: "boolean", defaultValue: "false", description: "Define o campo como obrigatório." },
  { prop: "requiredMessage", type: "string", defaultValue: "-", description: "Mensagem de validação para required." }
];

const EXAMPLE_LINKS = [
  { id: "exemplo-1", label: "1) Basico" },
  { id: "exemplo-2", label: "2) Meia estrela + tooltip" },
  { id: "exemplo-3", label: "3) Somente leitura e desabilitado" },
  { id: "exemplo-4", label: "4) Tamanhos e quantidade de estrelas" },
  { id: "exemplo-5", label: "5) Cores e ícones customizados" },
  { id: "exemplo-6", label: "6) Callbacks" },
  { id: "exemplo-7", label: "7) React Hook Form" },
  { id: "exemplo-8", label: "8) Campo obrigatório" },
  { id: "exemplo-9", label: "9) Playground" }
];

const BASIC_CODE = `import * as React from "react";
import { SgRating } from "@seedgrid/fe-components";

export default function Example() {
  const [value, setValue] = React.useState(0);

  return (
    <div className="space-y-2">
      <SgRating value={value} onChange={setValue} />
      <p className="text-sm text-muted-foreground">
        Valor atual: <strong>{value}</strong>
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
        label="Passe o mouse e clique nas metades"
        value={value}
        allowHalf
        showTooltip
        onChange={setValue}
        onHover={setHover}
      />
      <p className="text-sm text-muted-foreground">
        Selecionado: <strong>{value}</strong> | Hover: <strong>{hover ?? "nenhum"}</strong>
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
        label="Somente leitura"
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
        label="Coracao"
        value={heartValue}
        color="#ec4899"
        emptyColor="#f9a8d4"
        onIcon={<Heart size={24} fill="currentColor" />}
        offIcon={<Heart size={24} />}
        onChange={setHeartValue}
      />

      <SgRating
        label="Curtidas"
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
          Zerar
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setValue(5)}>
          Maximo
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setLogs([])}>
          Limpar log
        </SgButton>
      </SgGrid>

      <p className="text-sm text-muted-foreground">
        Selecionado: <strong>{value}</strong> | Hover: <strong>{hover ?? "nenhum"}</strong>
      </p>

      <div className="h-28 overflow-y-auto rounded border border-border bg-foreground/5 p-2 font-mono text-xs">
        {logs.length === 0 ? "Sem eventos" : logs.map((entry, index) => <div key={index}>{entry}</div>)}
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
        label="Avalie o produto"
        name="productRating"
        control={control}
      />

      <SgRating
        label="Avalie o filme"
        name="movieRating"
        control={control}
        allowHalf
      />

      <SgButton type="submit" size="sm">
        Enviar avaliacao
      </SgButton>

      <p className="text-xs text-muted-foreground">
        watch.productRating: <strong>{String(watch("productRating"))}</strong>
        {" | "}
        watch.movieRating: <strong>{String(watch("movieRating"))}</strong>
      </p>
      <p className="text-xs text-muted-foreground">Ultimo submit: {submitResult}</p>
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
        label="Avaliacao obrigatoria"
        value={value}
        required
        requiredMessage="Informe uma avaliacao antes de continuar"
        onChange={setValue}
      />

      <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
        <SgButton size="sm" appearance="outline" onClick={() => setValue(0)}>
          Limpar
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setValue(1)}>
          Nota 1
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setValue(5)}>
          Nota 5
        </SgButton>
      </SgGrid>

      <p className="text-sm text-muted-foreground">
        Valor atual: <strong>{value}</strong>
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
          Limpar
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setValue(stars)}>
          Maximo
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
        Valor atual: <strong>{value}</strong>
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
        label="Passe o mouse e clique nas metades"
        value={value}
        allowHalf
        showTooltip
        onChange={setValue}
        onHover={setHover}
      />
      <p className="text-sm text-muted-foreground">
        Selecionado: <strong>{value}</strong> | Hover: <strong>{hover ?? "nenhum"}</strong>
      </p>
    </div>
  );
}

function ReadonlyDisabledExample() {
  return (
    <SgGrid columns={{ base: 1, md: 2 }} gap={16}>
      <SgRating
        label="Somente leitura"
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
        label="Coracao"
        value={heartValue}
        color="#ec4899"
        emptyColor="#f9a8d4"
        onIcon={<Heart size={24} fill="currentColor" />}
        offIcon={<Heart size={24} />}
        onChange={setHeartValue}
      />

      <SgRating
        label="Curtidas"
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
          Zerar
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setValue(5)}>
          Maximo
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setLogs([])}>
          Limpar log
        </SgButton>
      </SgGrid>

      <p className="text-sm text-muted-foreground">
        Selecionado: <strong>{value}</strong> | Hover: <strong>{hover ?? "nenhum"}</strong>
      </p>

      <div className="h-28 overflow-y-auto rounded border border-border bg-foreground/5 p-2 font-mono text-xs">
        {logs.length === 0 ? "Sem eventos" : logs.map((entry, index) => <div key={index}>{entry}</div>)}
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
        label="Avalie o produto"
        name="productRating"
        control={control}
      />

      <SgRating
        label="Avalie o filme"
        name="movieRating"
        control={control}
        allowHalf
      />

      <SgButton type="submit" size="sm">
        Enviar avaliacao
      </SgButton>

      <p className="text-xs text-muted-foreground">
        watch.productRating: <strong>{String(watch("productRating"))}</strong>
        {" | "}
        watch.movieRating: <strong>{String(watch("movieRating"))}</strong>
      </p>
      <p className="text-xs text-muted-foreground">Ultimo submit: {submitResult}</p>
    </form>
  );
}

function RequiredExample() {
  const [value, setValue] = React.useState(0);

  return (
    <div className="space-y-3">
      <SgRating
        label="Avaliacao obrigatoria"
        value={value}
        required
        requiredMessage="Informe uma avaliacao antes de continuar"
        onChange={setValue}
      />

      <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
        <SgButton size="sm" appearance="outline" onClick={() => setValue(0)}>
          Limpar
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setValue(1)}>
          Nota 1
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setValue(5)}>
          Nota 5
        </SgButton>
      </SgGrid>

      <p className="text-sm text-muted-foreground">
        Valor atual: <strong>{value}</strong>
      </p>
    </div>
  );
}

export default function SgRatingPage() {
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
            <p className="mt-2 text-muted-foreground">
              Componente de avaliação com suporte a meia estrela, estados visuais, customização de ícones e integração com React Hook Form.
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Exemplos
            </p>
            <SgGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={8} className="mt-2">
              {EXAMPLE_LINKS.map((example) => (
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
              >
                Props Reference
              </Link>
            </SgGrid>
          </div>
        </div>

        <Section id="exemplo-1" title="1) Basico" description="Exemplo controlado com estado React.">
          <BasicExample />
          <CodeBlockBase code={BASIC_CODE} />
        </Section>

        <Section id="exemplo-2" title="2) Meia estrela + tooltip" description="Permite clicar nas metades e exibir valor no hover.">
          <HalfTooltipExample />
          <CodeBlockBase code={HALF_TOOLTIP_CODE} />
        </Section>

        <Section id="exemplo-3" title="3) Somente leitura e desabilitado" description="Visualização sem interação e estado disabled.">
          <ReadonlyDisabledExample />
          <CodeBlockBase code={READONLY_DISABLED_CODE} />
        </Section>

        <Section id="exemplo-4" title="4) Tamanhos e quantidade de estrelas" description="Controle de size e stars.">
          <SizeStarsExample />
          <CodeBlockBase code={SIZE_STARS_CODE} />
        </Section>

        <Section id="exemplo-5" title="5) Cores e ícones customizados" description="Troca de cores e ícones de preenchido/vazio.">
          <ColorsIconsExample />
          <CodeBlockBase code={COLORS_ICONS_CODE} />
        </Section>

        <Section id="exemplo-6" title="6) Callbacks" description="Exemplo com onChange e onHover + log de eventos.">
          <CallbackExample />
          <CodeBlockBase code={CALLBACK_CODE} />
        </Section>

        <Section id="exemplo-7" title="7) React Hook Form" description="Uso com control/name e submit.">
          <RhfExample />
          <CodeBlockBase code={RHF_CODE} />
        </Section>

        <Section id="exemplo-8" title="8) Campo obrigatório" description="Exemplo com required e requiredMessage.">
          <RequiredExample />
          <CodeBlockBase code={REQUIRED_CODE} />
        </Section>

        <Section id="exemplo-9" title="9) Playground (SgPlayground)" description="Simule as props principais em tempo real.">
          <SgPlayground
            title="SgRating Playground"
            interactive
            codeContract="appFile"
            code={PLAYGROUND_CODE}
            height={660}
            defaultOpen
          />
        </Section>

        <section
          id="props-reference"
          className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
        >
          <h2 data-anchor-title="true" className="text-lg font-semibold">Referência de Props</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 pr-4 font-semibold">Prop</th>
                  <th className="pb-2 pr-4 font-semibold">Tipo</th>
                  <th className="pb-2 pr-4 font-semibold">Padrão</th>
                  <th className="pb-2 font-semibold">Descrição</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {RATING_PROPS.map((row) => (
                  <tr key={row.prop}>
                    <td className="py-2 pr-4 font-mono text-xs">{row.prop}</td>
                    <td className="py-2 pr-4">{row.type}</td>
                    <td className="py-2 pr-4">{row.defaultValue}</td>
                    <td className="py-2">{row.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
