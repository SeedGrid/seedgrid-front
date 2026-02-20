"use client";

import React from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { SgRating, SgPlayground } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import { Heart, ThumbsUp, Flame } from "lucide-react";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  return <CodeBlockBase code={props.code} />;
}

const RATING_PLAYGROUND_APP_FILE = `import * as React from "react";
import { SgRating } from "@seedgrid/fe-components";

export default function App() {
  const [stars, setStars] = React.useState(5);
  const [allowHalf, setAllowHalf] = React.useState(false);
  const [cancel, setCancel] = React.useState(true);
  const [disabled, setDisabled] = React.useState(false);
  const [readOnly, setReadOnly] = React.useState(false);
  const [size, setSize] = React.useState<"sm" | "md" | "lg" | "xl">("md");
  const [showTooltip, setShowTooltip] = React.useState(false);
  const [required, setRequired] = React.useState(false);
  const [value, setValue] = React.useState(3);

  return (
    <div className="space-y-4 p-2">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-xs">
          <span className="mb-1 block font-medium">stars: {stars}</span>
          <input type="range" min={1} max={10} value={stars} onChange={(e) => setStars(Number(e.target.value))} className="w-full" />
        </label>

        <label className="text-xs">
          <span className="mb-1 block font-medium">size</span>
          <select value={size} onChange={(e) => setSize(e.target.value as "sm" | "md" | "lg" | "xl")} className="w-full rounded border border-slate-300 px-2 py-1">
            <option value="sm">sm</option>
            <option value="md">md</option>
            <option value="lg">lg</option>
            <option value="xl">xl</option>
          </select>
        </label>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" checked={allowHalf} onChange={(e) => setAllowHalf(e.target.checked)} />
          allowHalf
        </label>
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" checked={cancel} onChange={(e) => setCancel(e.target.checked)} />
          cancel
        </label>
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" checked={disabled} onChange={(e) => setDisabled(e.target.checked)} />
          disabled
        </label>
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" checked={readOnly} onChange={(e) => setReadOnly(e.target.checked)} />
          readOnly
        </label>
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" checked={showTooltip} onChange={(e) => setShowTooltip(e.target.checked)} />
          showTooltip
        </label>
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" checked={required} onChange={(e) => setRequired(e.target.checked)} />
          required
        </label>
      </div>

      <div className="rounded border border-border p-6">
        <SgRating
          label="Rating Playground"
          value={value}
          stars={stars}
          allowHalf={allowHalf}
          cancel={cancel}
          disabled={disabled}
          readOnly={readOnly}
          size={size}
          showTooltip={showTooltip}
          required={required}
          onChange={(next) => setValue(next)}
        />
      </div>

      <div className="rounded border border-border bg-muted/30 px-3 py-2 text-xs">
        Current value: {value}
      </div>
    </div>
  );
}
`;

export default function SgRatingPage() {
  const [basicValue, setBasicValue] = React.useState(0);
  const [readonlyValue] = React.useState(3.5);
  const [halfStarValue, setHalfStarValue] = React.useState(2.5);
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);
  const [eventLog, setEventLog] = React.useState<string[]>([]);

  const log = (msg: string) => {
    setEventLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  };

  const { register, control, handleSubmit, watch, setValue } = useForm<FieldValues>({
    defaultValues: {
      rating: 0,
      productRating: 4,
      movieRating: 0
    }
  });

  const productRatingValue = watch("productRating");
  const movieRatingValue = watch("movieRating");

  const handleFormSubmit = (data: FieldValues) => {
    log(`Form submitted: ${JSON.stringify(data)}`);
  };

  return (
    <div className="max-w-7xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">SgRating</h1>
        <p className="mt-2 text-muted-foreground">
          Componente de avaliaÃ§Ã£o por estrelas com suporte a meias estrelas, modo somente leitura e customizaÃ§Ã£o.
        </p>
      </div>

      {/* Basic */}
      <Section
        title="BÃ¡sico"
        description="Rating simples com 5 estrelas"
      >
        <div className="space-y-4">
          <SgRating
            value={basicValue}
            onChange={(value) => {
              setBasicValue(value);
              log(`Rating changed: ${value}`);
            }}
          />
          <p className="text-sm text-muted-foreground">
            Valor atual: <strong>{basicValue}</strong> {basicValue === 1 ? "estrela" : "estrelas"}
          </p>
        </div>
        <CodeBlock
          code={`const [rating, setRating] = React.useState(0);

<SgRating
  value={rating}
  onChange={(value) => setRating(value)}
/>

<p>Valor atual: {rating}</p>`}
        />
      </Section>

      {/* With Label */}
      <Section
        title="Com Label"
        description="Rating com label descritivo"
      >
        <SgRating
          label="Avalie este produto"
          value={3}
          onChange={(value) => log(`Product rating: ${value}`)}
        />
        <CodeBlock
          code={`<SgRating
  label="Avalie este produto"
  value={3}
  onChange={(value) => console.log(value)}
/>`}
        />
      </Section>

      {/* Half Stars */}
      <Section
        title="Meias Estrelas"
        description="Rating com suporte a meias estrelas (clique nas metades)"
      >
        <div className="space-y-4">
          <SgRating
            label="Rating com meias estrelas"
            value={halfStarValue}
            allowHalf
            onChange={(value) => {
              setHalfStarValue(value);
              log(`Half star rating: ${value}`);
            }}
          />
          <p className="text-sm text-muted-foreground">
            Valor: <strong>{halfStarValue}</strong> {halfStarValue === 0.5 || halfStarValue === 1 ? "estrela" : "estrelas"}
          </p>
        </div>
        <CodeBlock
          code={`<SgRating
  label="Rating com meias estrelas"
  value={2.5}
  allowHalf
  onChange={(value) => console.log(value)}
/>`}
        />
      </Section>

      {/* Read Only */}
      <Section
        title="Somente Leitura"
        description="Rating em modo de visualizaÃ§Ã£o (nÃ£o editÃ¡vel)"
      >
        <div className="space-y-4">
          <SgRating
            label="AvaliaÃ§Ã£o do produto (3.5/5)"
            value={readonlyValue}
            allowHalf
            readOnly
          />
          <SgRating
            label="AvaliaÃ§Ã£o alta (5/5)"
            value={5}
            readOnly
          />
          <SgRating
            label="AvaliaÃ§Ã£o baixa (1/5)"
            value={1}
            readOnly
          />
        </div>
        <CodeBlock
          code={`<SgRating
  label="AvaliaÃ§Ã£o do produto (3.5/5)"
  value={3.5}
  allowHalf
  readOnly
/>`}
        />
      </Section>

      {/* Without Cancel */}
      <Section
        title="Sem BotÃ£o de Cancelar"
        description="Rating sem a opÃ§Ã£o de limpar a avaliaÃ§Ã£o"
      >
        <SgRating
          label="Sem botÃ£o cancelar"
          value={3}
          cancel={false}
          onChange={(value) => log(`No cancel rating: ${value}`)}
        />
        <CodeBlock
          code={`<SgRating
  label="Sem botÃ£o cancelar"
  value={3}
  cancel={false}
  onChange={(value) => console.log(value)}
/>`}
        />
      </Section>

      {/* Different Sizes */}
      <Section
        title="Diferentes Tamanhos"
        description="Rating em diferentes tamanhos: sm, md, lg, xl"
      >
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Small (sm)</p>
            <SgRating value={4} size="sm" onChange={(v) => log(`Small: ${v}`)} />
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Medium (md) - padrÃ£o</p>
            <SgRating value={4} size="md" onChange={(v) => log(`Medium: ${v}`)} />
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Large (lg)</p>
            <SgRating value={4} size="lg" onChange={(v) => log(`Large: ${v}`)} />
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Extra Large (xl)</p>
            <SgRating value={4} size="xl" onChange={(v) => log(`XL: ${v}`)} />
          </div>
        </div>
        <CodeBlock
          code={`<SgRating value={4} size="sm" />
<SgRating value={4} size="md" />
<SgRating value={4} size="lg" />
<SgRating value={4} size="xl" />`}
        />
      </Section>

      {/* Custom Number of Stars */}
      <Section
        title="NÃºmero Customizado de Estrelas"
        description="Rating com diferentes quantidades de estrelas"
      >
        <div className="space-y-4">
          <SgRating label="3 estrelas" value={2} stars={3} onChange={(v) => log(`3 stars: ${v}`)} />
          <SgRating label="7 estrelas" value={5} stars={7} onChange={(v) => log(`7 stars: ${v}`)} />
          <SgRating label="10 estrelas" value={8} stars={10} size="sm" onChange={(v) => log(`10 stars: ${v}`)} />
        </div>
        <CodeBlock
          code={`<SgRating label="3 estrelas" value={2} stars={3} />
<SgRating label="7 estrelas" value={5} stars={7} />
<SgRating label="10 estrelas" value={8} stars={10} size="sm" />`}
        />
      </Section>

      {/* Custom Colors */}
      <Section
        title="Cores Customizadas"
        description="Rating com cores personalizadas"
      >
        <div className="space-y-4">
          <SgRating
            label="Vermelho"
            value={3}
            color="#ef4444"
            emptyColor="#fca5a5"
            onChange={(v) => log(`Red: ${v}`)}
          />
          <SgRating
            label="Verde"
            value={4}
            color="#22c55e"
            emptyColor="#86efac"
            onChange={(v) => log(`Green: ${v}`)}
          />
          <SgRating
            label="Roxo"
            value={2}
            color="#a855f7"
            emptyColor="#d8b4fe"
            onChange={(v) => log(`Purple: ${v}`)}
          />
          <SgRating
            label="Dourado"
            value={5}
            color="#f59e0b"
            emptyColor="#fcd34d"
            onChange={(v) => log(`Gold: ${v}`)}
          />
        </div>
        <CodeBlock
          code={`<SgRating
  label="Vermelho"
  value={3}
  color="#ef4444"
  emptyColor="#fca5a5"
/>

<SgRating
  label="Dourado"
  value={5}
  color="#f59e0b"
  emptyColor="#fcd34d"
/>`}
        />
      </Section>

      {/* Custom Icons */}
      <Section
        title="Ãcones Customizados"
        description="Rating com Ã­cones diferentes de estrelas"
      >
        <div className="space-y-4">
          <SgRating
            label="CoraÃ§Ãµes"
            value={4}
            stars={5}
            color="#ec4899"
            onIcon={<Heart size={24} fill="currentColor" />}
            offIcon={<Heart size={24} />}
            onChange={(v) => log(`Hearts: ${v}`)}
          />
          <SgRating
            label="Curtidas"
            value={3}
            stars={5}
            color="#3b82f6"
            onIcon={<ThumbsUp size={24} fill="currentColor" />}
            offIcon={<ThumbsUp size={24} />}
            onChange={(v) => log(`Likes: ${v}`)}
          />
          <SgRating
            label="Fogo"
            value={5}
            stars={5}
            color="#f97316"
            onIcon={<Flame size={24} fill="currentColor" />}
            offIcon={<Flame size={24} />}
            onChange={(v) => log(`Fire: ${v}`)}
          />
        </div>
        <CodeBlock
          code={`import { Heart, ThumbsUp, Flame } from "lucide-react";

<SgRating
  label="CoraÃ§Ãµes"
  value={4}
  color="#ec4899"
  onIcon={<Heart size={24} fill="currentColor" />}
  offIcon={<Heart size={24} />}
/>

<SgRating
  label="Fogo"
  value={5}
  color="#f97316"
  onIcon={<Flame size={24} fill="currentColor" />}
  offIcon={<Flame size={24} />}
/>`}
        />
      </Section>

      {/* With Tooltips */}
      <Section
        title="Com Tooltips"
        description="Rating mostrando o valor ao passar o mouse"
      >
        <SgRating
          label="Passe o mouse para ver o valor"
          value={3}
          allowHalf
          showTooltip
          onChange={(value) => log(`Tooltip rating: ${value}`)}
        />
        <CodeBlock
          code={`<SgRating
  label="Passe o mouse para ver o valor"
  value={3}
  allowHalf
  showTooltip
  onChange={(value) => console.log(value)}
/>`}
        />
      </Section>

      {/* With Hover Callback */}
      <Section
        title="Com Callback de Hover"
        description="Detecta quando o usuÃ¡rio passa o mouse sobre as estrelas"
      >
        <div className="space-y-4">
          <SgRating
            label="Passe o mouse sobre as estrelas"
            value={basicValue}
            allowHalf
            onChange={(value) => setBasicValue(value)}
            onHover={(value) => setHoverValue(value)}
          />
          <div className="rounded-lg bg-muted/40 p-4">
            <p className="text-sm">
              <strong>Valor selecionado:</strong> {basicValue}
            </p>
            <p className="text-sm">
              <strong>Hover atual:</strong> {hoverValue ?? "nenhum"}
            </p>
          </div>
        </div>
        <CodeBlock
          code={`const [value, setValue] = React.useState(0);
const [hover, setHover] = React.useState<number | null>(null);

<SgRating
  value={value}
  allowHalf
  onChange={setValue}
  onHover={setHover}
/>

<p>Valor: {value}</p>
<p>Hover: {hover ?? "nenhum"}</p>`}
        />
      </Section>

      {/* Disabled */}
      <Section
        title="Desabilitado"
        description="Rating em estado desabilitado"
      >
        <SgRating
          label="Rating desabilitado"
          value={3}
          disabled
        />
        <CodeBlock
          code={`<SgRating
  label="Rating desabilitado"
  value={3}
  disabled
/>`}
        />
      </Section>

      {/* With React Hook Form */}
      <Section
        title="IntegraÃ§Ã£o com React Hook Form"
        description="Rating integrado com formulÃ¡rios"
      >
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <SgRating
            label="Avalie o produto"
            name="productRating"
            control={control}
          />
          <p className="text-sm text-muted-foreground">
            Valor: <strong>{productRatingValue}</strong>
          </p>

          <SgRating
            label="Avalie o filme"
            name="movieRating"
            control={control}
            allowHalf
          />
          <p className="text-sm text-muted-foreground">
            Valor: <strong>{movieRatingValue}</strong>
          </p>

          <button
            type="submit"
            className="rounded border border-border bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90"
          >
            Enviar AvaliaÃ§Ã£o
          </button>
        </form>
        <CodeBlock
          code={`import { useForm } from "react-hook-form";

const { control, handleSubmit } = useForm({
  defaultValues: {
    productRating: 4,
    movieRating: 0
  }
});

<form onSubmit={handleSubmit((data) => console.log(data))}>
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

  <button type="submit">Enviar</button>
</form>`}
        />
      </Section>

      {/* Required */}
      <Section
        title="Campo ObrigatÃ³rio"
        description="Rating com validaÃ§Ã£o de campo obrigatÃ³rio"
      >
        <SgRating
          label="AvaliaÃ§Ã£o obrigatÃ³ria"
          value={0}
          required
          requiredMessage="Por favor, forneÃ§a uma avaliaÃ§Ã£o"
          onChange={(value) => log(`Required rating: ${value}`)}
        />
        <CodeBlock
          code={`<SgRating
  label="AvaliaÃ§Ã£o obrigatÃ³ria"
  value={0}
  required
  requiredMessage="Por favor, forneÃ§a uma avaliaÃ§Ã£o"
  onChange={(value) => console.log(value)}
/>`}
        />
      </Section>

      {/* Events Log */}
      <Section
        title="Log de Eventos"
        description="Visualize todos os eventos do rating"
      >
        <div className="space-y-4">
          <SgRating
            label="Rating com log de eventos"
            value={3}
            allowHalf
            onChange={(value) => log(`onChange: ${value}`)}
            onHover={(value) => value !== null && log(`onHover: ${value}`)}
          />
          <div className="h-40 overflow-y-auto rounded border border-border bg-foreground/5 p-2 font-mono text-xs">
            {eventLog.length === 0 ? (
              <span className="text-muted-foreground">
                Interaja com o rating para ver os eventos...
              </span>
            ) : (
              eventLog.map((entry, i) => <div key={i}>{entry}</div>)
            )}
          </div>
        </div>
        <CodeBlock
          code={`<SgRating
  value={3}
  allowHalf
  onChange={(value) => console.log('onChange:', value)}
  onHover={(value) => console.log('onHover:', value)}
/>`}
        />
      </Section>

      {/* Playground */}
      <Section
        title="ðŸŽ® Playground Interativo"
        description="Experimente diferentes configuraÃ§Ãµes do rating em tempo real"
      >
        <SgPlayground
          title="SgRating Playground"
          interactive
          codeContract="appFile"
          code={RATING_PLAYGROUND_APP_FILE}
          height={620}
          defaultOpen
        />
      </Section>

      {/* Props Reference */}
      <section className="rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">ReferÃªncia de Props</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 pr-4 font-semibold">Prop</th>
                <th className="pb-2 pr-4 font-semibold">Tipo</th>
                <th className="pb-2 pr-4 font-semibold">PadrÃ£o</th>
                <th className="pb-2 font-semibold">DescriÃ§Ã£o</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">id</td>
                <td className="py-2 pr-4">string</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Identificador Ãºnico</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">label</td>
                <td className="py-2 pr-4">string</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Label descritivo</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">value</td>
                <td className="py-2 pr-4">number</td>
                <td className="py-2 pr-4">0</td>
                <td className="py-2">Valor atual da avaliaÃ§Ã£o</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">stars</td>
                <td className="py-2 pr-4">number</td>
                <td className="py-2 pr-4">5</td>
                <td className="py-2">NÃºmero de estrelas</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">allowHalf</td>
                <td className="py-2 pr-4">boolean</td>
                <td className="py-2 pr-4">false</td>
                <td className="py-2">Habilita meias estrelas</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">cancel</td>
                <td className="py-2 pr-4">boolean</td>
                <td className="py-2 pr-4">true</td>
                <td className="py-2">Mostra botÃ£o para cancelar/limpar</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">disabled</td>
                <td className="py-2 pr-4">boolean</td>
                <td className="py-2 pr-4">false</td>
                <td className="py-2">Estado desabilitado</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">readOnly</td>
                <td className="py-2 pr-4">boolean</td>
                <td className="py-2 pr-4">false</td>
                <td className="py-2">Modo somente leitura</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">size</td>
                <td className="py-2 pr-4">&quot;sm&quot; | &quot;md&quot; | &quot;lg&quot; | &quot;xl&quot;</td>
                <td className="py-2 pr-4">&quot;md&quot;</td>
                <td className="py-2">Tamanho das estrelas</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">color</td>
                <td className="py-2 pr-4">string</td>
                <td className="py-2 pr-4">&quot;hsl(var(--primary))&quot;</td>
                <td className="py-2">Cor das estrelas preenchidas</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">emptyColor</td>
                <td className="py-2 pr-4">string</td>
                <td className="py-2 pr-4">&quot;hsl(var(--muted-foreground))&quot;</td>
                <td className="py-2">Cor das estrelas vazias</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">showTooltip</td>
                <td className="py-2 pr-4">boolean</td>
                <td className="py-2 pr-4">false</td>
                <td className="py-2">Mostra tooltip com o valor ao hover</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">onIcon</td>
                <td className="py-2 pr-4">ReactNode</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Ãcone customizado para estado preenchido</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">offIcon</td>
                <td className="py-2 pr-4">ReactNode</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Ãcone customizado para estado vazio</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">cancelIcon</td>
                <td className="py-2 pr-4">ReactNode</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Ãcone customizado para botÃ£o cancelar</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">required</td>
                <td className="py-2 pr-4">boolean</td>
                <td className="py-2 pr-4">false</td>
                <td className="py-2">Campo obrigatÃ³rio</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">requiredMessage</td>
                <td className="py-2 pr-4">string</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Mensagem de erro para campo obrigatÃ³rio</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">error</td>
                <td className="py-2 pr-4">string</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Mensagem de erro externa</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">onChange</td>
                <td className="py-2 pr-4">(value: number) =&gt; void</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Callback quando o valor muda</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">onHover</td>
                <td className="py-2 pr-4">(value: number | null) =&gt; void</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Callback quando o mouse passa sobre as estrelas</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">name</td>
                <td className="py-2 pr-4">string</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Nome do campo (React Hook Form)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">control</td>
                <td className="py-2 pr-4">any</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Control do React Hook Form</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

