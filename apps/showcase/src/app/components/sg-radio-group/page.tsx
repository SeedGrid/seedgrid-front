"use client";

import React from "react";
import { useForm } from "react-hook-form";
import {
  SgRadioGroup,
  type SgRadioGroupOption,
  SgButton,
  SgPlayground
} from "@seedgrid/fe-components";
import {
  Heart,
  Star,
  ThumbsUp,
  Circle,
  Square,
  Triangle,
  Sun,
  Moon,
  Cloud,
  Mail,
  Phone,
  Home
} from "lucide-react";
import CodeBlockBase from "../CodeBlockBase";

type PropDef = {
  name: string;
  type: string;
  description: string;
  required?: boolean;
  defaultValue?: string;
};

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 space-y-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { children: string }) {
  return <CodeBlockBase code={props.children} />;
}

function PropsTable(props: { props: PropDef[] }) {
  return (
    <section className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold">Referencia de Props</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-2 pr-4 font-semibold">Prop</th>
              <th className="pb-2 pr-4 font-semibold">Tipo</th>
              <th className="pb-2 pr-4 font-semibold">Default</th>
              <th className="pb-2 pr-4 font-semibold">Required</th>
              <th className="pb-2 font-semibold">Descricao</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {props.props.map((prop) => (
              <tr key={prop.name}>
                <td className="py-2 pr-4 font-mono text-xs">{prop.name}</td>
                <td className="py-2 pr-4">{prop.type}</td>
                <td className="py-2 pr-4">{prop.defaultValue ?? "-"}</td>
                <td className="py-2 pr-4">{prop.required ? "yes" : "no"}</td>
                <td className="py-2">{prop.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const RADIO_GROUP_PLAYGROUND_APP_FILE = `import * as React from "react";
import * as SeedGrid from "@seedgrid/fe-components";
import { Heart, Star, ThumbsUp } from "lucide-react";

const SgRadioGroupFromLib = (SeedGrid as Record<string, unknown>).SgRadioGroup as
  | React.ComponentType<any>
  | undefined;

const OPTIONS = [
  { label: "Favorito", value: "favorite", icon: <Heart className="h-4 w-4" /> },
  { label: "Importante", value: "important", icon: <Star className="h-4 w-4" /> },
  { label: "Curtir", value: "like", icon: <ThumbsUp className="h-4 w-4" /> }
];

function FallbackRadioGroup(props: {
  value: string | null;
  onChange: (next: string | null) => void;
  orientation: "horizontal" | "vertical";
  showCancel: boolean;
  disabled: boolean;
  readOnly: boolean;
}) {
  return (
    <div className={props.orientation === "horizontal" ? "flex flex-wrap gap-3" : "space-y-2"}>
      {OPTIONS.map((option) => (
        <label key={option.value} className="inline-flex items-center gap-2 text-sm">
          <input
            type="radio"
            checked={props.value === option.value}
            disabled={props.disabled || props.readOnly}
            onChange={() => props.onChange(option.value)}
          />
          <span>{option.label}</span>
        </label>
      ))}
      {props.showCancel ? (
        <button
          type="button"
          disabled={props.disabled || props.readOnly}
          className="rounded border border-slate-300 bg-white px-2 py-1 text-xs"
          onClick={() => props.onChange(null)}
        >
          Limpar
        </button>
      ) : null}
    </div>
  );
}

export default function App() {
  const hasComponent = typeof SgRadioGroupFromLib === "function";
  const [title, setTitle] = React.useState("Escolha uma opcao");
  const [orientation, setOrientation] = React.useState<"vertical" | "horizontal">("vertical");
  const [iconOnly, setIconOnly] = React.useState(false);
  const [showCancel, setShowCancel] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [readOnly, setReadOnly] = React.useState(false);
  const [required, setRequired] = React.useState(false);
  const [value, setValue] = React.useState<string | null>("favorite");

  return (
    <div className="space-y-4 p-2">
      {!hasComponent ? (
        <div className="rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
          SgRadioGroup nao esta na versao publicada do Sandpack. Exibindo fallback.
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs">
          <span className="mb-1 block font-medium">Titulo</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded border border-slate-300 px-2 py-1"
          />
        </label>
        <label className="text-xs">
          <span className="mb-1 block font-medium">Orientacao</span>
          <select
            value={orientation}
            onChange={(event) => setOrientation(event.target.value as "vertical" | "horizontal")}
            className="w-full rounded border border-slate-300 px-2 py-1"
          >
            <option value="vertical">vertical</option>
            <option value="horizontal">horizontal</option>
          </select>
        </label>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 text-xs">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={iconOnly} onChange={(event) => setIconOnly(event.target.checked)} />
          iconOnly
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={showCancel} onChange={(event) => setShowCancel(event.target.checked)} />
          showCancel
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={disabled} onChange={(event) => setDisabled(event.target.checked)} />
          disabled
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={readOnly} onChange={(event) => setReadOnly(event.target.checked)} />
          readOnly
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={required} onChange={(event) => setRequired(event.target.checked)} />
          required
        </label>
      </div>

      <div className="rounded border border-border p-4">
        {hasComponent ? (
          <SgRadioGroupFromLib
            id="radio-playground"
            title={title}
            source={OPTIONS}
            orientation={orientation}
            iconOnly={iconOnly}
            showCancel={showCancel}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            value={value}
            onChange={(next: string | number | null) => setValue(next as string | null)}
          />
        ) : (
          <FallbackRadioGroup
            value={value}
            onChange={setValue}
            orientation={orientation}
            showCancel={showCancel}
            disabled={disabled}
            readOnly={readOnly}
          />
        )}
      </div>

      <div className="rounded border border-border bg-muted/30 px-3 py-2 text-xs">
        value: {value ?? "(nenhum)"}
      </div>
    </div>
  );
}
`;

const BASIC_OPTIONS: SgRadioGroupOption[] = [
  { label: "Opção 1", value: "option1" },
  { label: "Opção 2", value: "option2" },
  { label: "Opção 3", value: "option3" }
];

const FRUIT_OPTIONS: SgRadioGroupOption[] = [
  { label: "Maçã", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Laranja", value: "orange" },
  { label: "Uva", value: "grape" }
];

const OPTIONS_WITH_ICONS: SgRadioGroupOption[] = [
  { label: "Favorito", value: "favorite", icon: <Heart className="w-4 h-4" /> },
  { label: "Importante", value: "important", icon: <Star className="w-4 h-4" /> },
  { label: "Curtir", value: "like", icon: <ThumbsUp className="w-4 h-4" /> }
];

const SHAPE_OPTIONS: SgRadioGroupOption[] = [
  { label: "Círculo", value: "circle", icon: <Circle className="w-5 h-5" /> },
  { label: "Quadrado", value: "square", icon: <Square className="w-5 h-5" /> },
  { label: "Triângulo", value: "triangle", icon: <Triangle className="w-5 h-5" /> }
];

const WEATHER_OPTIONS: SgRadioGroupOption[] = [
  { label: "Sol", value: "sun", icon: <Sun className="w-5 h-5 text-yellow-500" /> },
  { label: "Lua", value: "moon", icon: <Moon className="w-5 h-5 text-blue-500" /> },
  { label: "Nuvem", value: "cloud", icon: <Cloud className="w-5 h-5 text-gray-500" /> }
];

const CONTACT_OPTIONS: SgRadioGroupOption[] = [
  { label: "Email", value: "email", icon: <Mail className="w-4 h-4" /> },
  { label: "Telefone", value: "phone", icon: <Phone className="w-4 h-4" /> },
  { label: "Presencial", value: "in-person", icon: <Home className="w-4 h-4" /> }
];

const PRIORITY_OPTIONS: SgRadioGroupOption[] = [
  { label: "Baixa", value: "low" },
  { label: "Média", value: "medium" },
  { label: "Alta", value: "high" },
  { label: "Urgente", value: "urgent", disabled: true }
];

export default function SgRadioGroupShowcase() {
  const [selectedBasic, setSelectedBasic] = React.useState<string | number | null>("option1");
  const [selectedFruit, setSelectedFruit] = React.useState<string | number | null>(null);
  const [selectedWithCancel, setSelectedWithCancel] = React.useState<string | number | null>("option2");
  const [externalValue, setExternalValue] = React.useState<string | number | null>("banana");

  const { register, control, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
    alert(`Dados do formulário: ${JSON.stringify(data, null, 2)}`);
  };

  const propDefs: PropDef[] = [
    {
      name: "id",
      type: "string",
      description: "ID único para o grupo de radio buttons"
    },
    {
      name: "title",
      type: "string",
      description: "Título exibido acima do grupo"
    },
    {
      name: "source",
      type: "SgRadioGroupOption[]",
      required: true,
      description: "Array de opções. Cada opção deve ter label, value, e opcionalmente icon e disabled"
    },
    {
      name: "value",
      type: "string | number",
      description: "Valor selecionado (para controle externo)"
    },
    {
      name: "orientation",
      type: '"horizontal" | "vertical"',
      defaultValue: '"vertical"',
      description: "Orientação do layout das opções"
    },
    {
      name: "iconOnly",
      type: "boolean",
      defaultValue: "false",
      description: "Exibe apenas os ícones, sem os labels"
    },
    {
      name: "showCancel",
      type: "boolean",
      defaultValue: "false",
      description: "Mostra opção para cancelar/limpar seleção"
    },
    {
      name: "cancelLabel",
      type: "string",
      description: "Label customizado para a opção de cancelar"
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description: "Desabilita todo o grupo"
    },
    {
      name: "readOnly",
      type: "boolean",
      defaultValue: "false",
      description: "Torna o grupo apenas leitura"
    },
    {
      name: "required",
      type: "boolean",
      defaultValue: "false",
      description: "Marca o campo como obrigatório (com validação)"
    },
    {
      name: "onChange",
      type: "(value: string | number | null) => void",
      description: "Callback quando o valor muda"
    },
    {
      name: "name",
      type: "string",
      description: "Nome do campo (para React Hook Form)"
    },
    {
      name: "control",
      type: "Control",
      description: "Controle do React Hook Form"
    },
    {
      name: "register",
      type: "UseFormRegister",
      description: "Função register do React Hook Form"
    },
    {
      name: "error",
      type: "string",
      description: "Mensagem de erro para exibir"
    },
    {
      name: "className",
      type: "string",
      description: "Classes CSS adicionais para o container"
    },
    {
      name: "optionClassName",
      type: "string",
      description: "Classes CSS adicionais para cada opção"
    },
    {
      name: "groupBoxProps",
      type: "object",
      description: "Props adicionais para o SgGroupBox interno"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[rgb(var(--sg-text))] mb-2">SgRadioGroup</h1>
        <p className="text-[rgb(var(--sg-muted))]">
          Componente de grupo de radio buttons com suporte a ícones, orientação customizável,
          opção de cancelar e integração com React Hook Form.
        </p>
      </div>

      <PropsTable props={propDefs} />

      <Section title="Básico">
        <SgRadioGroup
          id="basic"
          title="Escolha uma opção"
          source={BASIC_OPTIONS}
          value={selectedBasic ?? undefined}
          onChange={setSelectedBasic}
        />
        <p className="mt-2 text-sm text-[rgb(var(--sg-muted))]">
          Valor selecionado: <strong>{selectedBasic}</strong>
        </p>
        <CodeBlock>
          {`const [selected, setSelected] = useState("option1");

<SgRadioGroup
  id="basic"
  title="Escolha uma opção"
  source={[
    { label: "Opção 1", value: "option1" },
    { label: "Opção 2", value: "option2" },
    { label: "Opção 3", value: "option3" }
  ]}
  value={selected}
  onChange={setSelected}
/>`}
        </CodeBlock>
      </Section>

      <Section title="Orientação Horizontal">
        <SgRadioGroup
          id="horizontal"
          title="Selecione uma fruta"
          source={FRUIT_OPTIONS}
          orientation="horizontal"
          value={selectedFruit ?? undefined}
          onChange={setSelectedFruit}
        />
        <CodeBlock>
          {`<SgRadioGroup
  title="Selecione uma fruta"
  source={fruitOptions}
  orientation="horizontal"
  value={selected}
  onChange={setSelected}
/>`}
        </CodeBlock>
      </Section>

      <Section title="Com Ícones">
        <SgRadioGroup
          id="with-icons"
          title="Escolha uma ação"
          source={OPTIONS_WITH_ICONS}
        />
        <CodeBlock>
          {`<SgRadioGroup
  title="Escolha uma ação"
  source={[
    { label: "Favorito", value: "favorite", icon: <Heart className="w-4 h-4" /> },
    { label: "Importante", value: "important", icon: <Star className="w-4 h-4" /> },
    { label: "Curtir", value: "like", icon: <ThumbsUp className="w-4 h-4" /> }
  ]}
/>`}
        </CodeBlock>
      </Section>

      <Section title="Apenas Ícones (Icon Only)">
        <SgRadioGroup
          id="icon-only"
          title="Escolha uma forma"
          source={SHAPE_OPTIONS}
          iconOnly
        />
        <CodeBlock>
          {`<SgRadioGroup
  title="Escolha uma forma"
  source={[
    { label: "Círculo", value: "circle", icon: <Circle className="w-5 h-5" /> },
    { label: "Quadrado", value: "square", icon: <Square className="w-5 h-5" /> },
    { label: "Triângulo", value: "triangle", icon: <Triangle className="w-5 h-5" /> }
  ]}
  iconOnly
/>`}
        </CodeBlock>
      </Section>

      <Section title="Com Opção de Cancelar">
        <SgRadioGroup
          id="with-cancel"
          title="Selecione (com opção de cancelar)"
          source={BASIC_OPTIONS}
          value={selectedWithCancel ?? undefined}
          onChange={setSelectedWithCancel}
          showCancel
        />
        <p className="mt-2 text-sm text-[rgb(var(--sg-muted))]">
          Valor: {selectedWithCancel === null ? "Nenhum" : selectedWithCancel}
        </p>
        <CodeBlock>
          {`<SgRadioGroup
  title="Selecione (com opção de cancelar)"
  source={options}
  value={selected}
  onChange={setSelected}
  showCancel
/>`}
        </CodeBlock>
      </Section>

      <Section title="Controle Externo (setValue/getValue)">
        <div className="space-y-4">
          <SgRadioGroup
            id="external-control"
            title="Fruta favorita"
            source={FRUIT_OPTIONS}
            value={externalValue ?? undefined}
            onChange={setExternalValue}
          />
          <div className="flex gap-2">
            <SgButton onClick={() => setExternalValue("apple")}>
              Definir Maçã
            </SgButton>
            <SgButton onClick={() => setExternalValue("banana")}>
              Definir Banana
            </SgButton>
            <SgButton onClick={() => setExternalValue("orange")}>
              Definir Laranja
            </SgButton>
            <SgButton onClick={() => setExternalValue(null)}>
              Limpar
            </SgButton>
          </div>
          <p className="text-sm text-[rgb(var(--sg-muted))]">
            Valor atual: <strong>{externalValue || "Nenhum"}</strong>
          </p>
        </div>
        <CodeBlock>
          {`const [value, setValue] = useState("banana");

<SgRadioGroup
  source={fruitOptions}
  value={value}
  onChange={setValue}
/>

<SgButton onClick={() => setValue("apple")}>
  Definir Maçã
</SgButton>`}
        </CodeBlock>
      </Section>

      <Section title="Com Opção Desabilitada">
        <SgRadioGroup
          id="with-disabled-option"
          title="Nível de prioridade"
          source={PRIORITY_OPTIONS}
        />
        <CodeBlock>
          {`<SgRadioGroup
  title="Nível de prioridade"
  source={[
    { label: "Baixa", value: "low" },
    { label: "Média", value: "medium" },
    { label: "Alta", value: "high" },
    { label: "Urgente", value: "urgent", disabled: true }
  ]}
/>`}
        </CodeBlock>
      </Section>

      <Section title="Grupo Desabilitado">
        <SgRadioGroup
          id="disabled-group"
          title="Opções desabilitadas"
          source={BASIC_OPTIONS}
          value="option2"
          disabled
        />
        <CodeBlock>
          {`<SgRadioGroup
  title="Opções desabilitadas"
  source={options}
  value="option2"
  disabled
/>`}
        </CodeBlock>
      </Section>

      <Section title="Somente Leitura">
        <SgRadioGroup
          id="readonly"
          title="Configuração atual (somente leitura)"
          source={FRUIT_OPTIONS}
          value="banana"
          readOnly
        />
        <CodeBlock>
          {`<SgRadioGroup
  title="Configuração atual (somente leitura)"
  source={options}
  value="banana"
  readOnly
/>`}
        </CodeBlock>
      </Section>

      <Section title="Obrigatório com Validação">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <SgRadioGroup
            name="preference"
            title="Preferência de contato *"
            source={CONTACT_OPTIONS}
            control={control}
            required
          />
          <SgButton type="submit">Enviar</SgButton>
        </form>
        <CodeBlock>
          {`const { control, handleSubmit } = useForm();

<form onSubmit={handleSubmit(onSubmit)}>
  <SgRadioGroup
    name="preference"
    title="Preferência de contato *"
    source={contactOptions}
    control={control}
    required
  />
  <SgButton type="submit">Enviar</SgButton>
</form>`}
        </CodeBlock>
      </Section>

      <Section title="Horizontal com Ícones Coloridos">
        <SgRadioGroup
          id="horizontal-colored"
          title="Condição do tempo"
          source={WEATHER_OPTIONS}
          orientation="horizontal"
        />
        <CodeBlock>
          {`<SgRadioGroup
  title="Condição do tempo"
  source={[
    { label: "Sol", value: "sun", icon: <Sun className="w-5 h-5 text-yellow-500" /> },
    { label: "Lua", value: "moon", icon: <Moon className="w-5 h-5 text-blue-500" /> },
    { label: "Nuvem", value: "cloud", icon: <Cloud className="w-5 h-5 text-gray-500" /> }
  ]}
  orientation="horizontal"
/>`}
        </CodeBlock>
      </Section>

      <Section title="Com GroupBox Customizado">
        <SgRadioGroup
          id="custom-groupbox"
          title="Escolha com estilo customizado"
          source={OPTIONS_WITH_ICONS}
          groupBoxProps={{
            title: "Preferências",
            className: "border-2 border-[rgb(var(--sg-primary-500))]"
          }}
        />
        <CodeBlock>
          {`<SgRadioGroup
  title="Escolha com estilo customizado"
  source={options}
  groupBoxProps={{
    title: "Preferências",
    className: "border-2 border-[rgb(var(--sg-primary-500))]"
  }}
/>`}
        </CodeBlock>
      </Section>

      <Section title="React Hook Form - Register">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <SgRadioGroup
            name="fruit"
            title="Escolha sua fruta"
            source={FRUIT_OPTIONS}
            register={register}
          />
          <SgButton type="submit">Enviar</SgButton>
        </form>
        <CodeBlock>
          {`const { register, handleSubmit } = useForm();

<form onSubmit={handleSubmit(onSubmit)}>
  <SgRadioGroup
    name="fruit"
    title="Escolha sua fruta"
    source={fruitOptions}
    register={register}
  />
  <SgButton type="submit">Enviar</SgButton>
</form>`}
        </CodeBlock>
      </Section>

      <Section title="Playground Interativo">
        <SgPlayground
          title="SgRadioGroup Playground"
          interactive
          codeContract="appFile"
          code={RADIO_GROUP_PLAYGROUND_APP_FILE}
          height={650}
          defaultOpen
        />
      </Section>
    </div>
  );
}

