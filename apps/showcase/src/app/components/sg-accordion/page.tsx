"use client";

import * as React from "react";
import { SgAccordion, SgButton, SgPlayground, type SgAccordionItem } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 space-y-4">{props.children}</div>
    </section>
  );
}

const VERTICAL_ITEMS: SgAccordionItem[] = [
  {
    id: "personal",
    title: "Dados pessoais",
    content: (
      <div className="space-y-2 text-sm">
        <p>Nome completo, email e telefone para contato.</p>
        <p className="text-muted-foreground">Edite essas informacoes no perfil do usuario.</p>
      </div>
    )
  },
  {
    id: "address",
    title: "Endereco",
    content: (
      <div className="space-y-2 text-sm">
        <p>Rua, numero, cidade, estado e CEP.</p>
        <p className="text-muted-foreground">Utilizado para faturamento e entregas.</p>
      </div>
    )
  },
  {
    id: "billing",
    title: "Faturamento",
    content: (
      <div className="space-y-2 text-sm">
        <p>Forma de pagamento, ciclo de cobranca e historico de notas.</p>
        <p className="text-muted-foreground">Atualizacoes podem levar alguns minutos para refletir.</p>
      </div>
    )
  }
];

const HORIZONTAL_ITEMS: SgAccordionItem[] = [
  {
    id: "overview",
    title: "Visao geral",
    content: (
      <div className="space-y-2 text-sm">
        <h3 className="text-base font-semibold">Visao geral</h3>
        <p>Indicadores principais de utilizacao, consumo e disponibilidade.</p>
      </div>
    )
  },
  {
    id: "security",
    title: "Seguranca",
    content: (
      <div className="space-y-2 text-sm">
        <h3 className="text-base font-semibold">Seguranca</h3>
        <p>Politicas de senha, MFA e tentativas de autenticacao.</p>
      </div>
    )
  },
  {
    id: "integrations",
    title: "Integracoes",
    content: (
      <div className="space-y-2 text-sm">
        <h3 className="text-base font-semibold">Integracoes</h3>
        <p>Conexoes com APIs, webhooks e provedores externos.</p>
      </div>
    )
  }
];

const CUSTOM_ITEMS: SgAccordionItem[] = [
  {
    id: "mail",
    title: "Email",
    icon: <span aria-hidden="true">✉</span>,
    end: <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase">novo</span>,
    content: <p className="text-sm">Configuracoes de SMTP, remetente padrao e templates.</p>
  },
  {
    id: "lock",
    title: "Permissoes",
    icon: <span aria-hidden="true">⚿</span>,
    content: <p className="text-sm">Controle de perfis, papeis e trilhas de auditoria.</p>
  },
  {
    id: "blocked",
    title: "Modulo indisponivel",
    icon: <span aria-hidden="true">⚠</span>,
    disabled: true,
    content: <p className="text-sm">Conteudo bloqueado.</p>
  }
];

const BASIC_CODE = `const items: SgAccordionItem[] = [
  { id: "personal", title: "Dados pessoais", content: <p>Conteudo...</p> },
  { id: "address", title: "Endereco", content: <p>Conteudo...</p> },
  { id: "billing", title: "Faturamento", content: <p>Conteudo...</p> }
];

<SgAccordion items={items} />`;

const MULTIPLE_CODE = `const [open, setOpen] = React.useState<number[]>([0, 2]);

<SgAccordion
  items={items}
  multiple
  collapsible
  activeIndex={open}
  onActiveIndexChange={setOpen}
/>`;

const HORIZONTAL_CODE = `<SgAccordion
  items={items}
  orientation="horizontal"
  defaultActiveIndex={1}
  horizontalHeaderWidth={56}
  horizontalMinHeight={220}
/>`;

const CONTROLLED_CODE = `const [activeIndex, setActiveIndex] = React.useState<number[]>([0]);

<SgAccordion
  items={items}
  activeIndex={activeIndex}
  onActiveIndexChange={setActiveIndex}
/>

<SgButton onClick={() => setActiveIndex([0])}>Abrir 1</SgButton>
<SgButton onClick={() => setActiveIndex([1])}>Abrir 2</SgButton>
<SgButton onClick={() => setActiveIndex([])}>Fechar todos</SgButton>`;

const CUSTOM_CODE = `<SgAccordion
  items={[
    {
      title: "Email",
      icon: <span>✉</span>,
      end: <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase">novo</span>,
      content: <p>Configuracoes de SMTP...</p>
    },
    {
      title: "Permissoes",
      icon: <span>⚿</span>,
      content: <p>Controle de perfis...</p>
    },
    {
      title: "Modulo indisponivel",
      disabled: true,
      content: <p>Conteudo bloqueado</p>
    }
  ]}
/>`;

const PLAYGROUND_APP_FILE = `import * as React from "react";
import * as SeedGrid from "@seedgrid/fe-components";

const SgAccordionFromLib = (SeedGrid as Record<string, unknown>).SgAccordion as
  | React.ComponentType<any>
  | undefined;

function LocalFallback(props: {
  items: Array<{ title: string; content: string; disabled?: boolean }>;
  active: number[];
  onChange: (next: number[]) => void;
  multiple: boolean;
}) {
  const toggle = (idx: number) => {
    const item = props.items[idx];
    if (!item || item.disabled) return;
    const isOpen = props.active.includes(idx);
    if (isOpen) {
      props.onChange(props.active.filter((v) => v !== idx));
      return;
    }
    props.onChange(props.multiple ? [...props.active, idx] : [idx]);
  };

  return (
    <div className="space-y-2">
      {props.items.map((item, idx) => {
        const isOpen = props.active.includes(idx);
        return (
          <div key={idx} className="overflow-hidden rounded border border-slate-300">
            <button
              type="button"
              disabled={item.disabled}
              className="w-full bg-white px-3 py-2 text-left text-sm disabled:opacity-50"
              onClick={() => toggle(idx)}
            >
              {item.title}
            </button>
            {isOpen ? <div className="border-t border-slate-200 p-3 text-sm">{item.content}</div> : null}
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const hasAccordion = typeof SgAccordionFromLib === "function";
  const [orientation, setOrientation] = React.useState<"vertical" | "horizontal">("vertical");
  const [multiple, setMultiple] = React.useState(false);
  const [collapsible, setCollapsible] = React.useState(true);
  const [keepMounted, setKeepMounted] = React.useState(true);
  const [active, setActive] = React.useState<number[]>([0]);

  const items = React.useMemo(
    () => [
      { id: "one", title: "Painel 1", content: <p className="text-sm">Conteudo do primeiro painel.</p> },
      { id: "two", title: "Painel 2", content: <p className="text-sm">Conteudo do segundo painel.</p> },
      { id: "three", title: "Painel 3", content: <p className="text-sm">Conteudo do terceiro painel.</p> }
    ],
    []
  );

  return (
    <div className="space-y-4 p-2">
      {!hasAccordion ? (
        <div className="rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
          SgAccordion ainda nao esta na versao publicada usada pelo Sandpack. Exibindo fallback.
        </div>
      ) : null}

      <div className="grid gap-2 sm:grid-cols-2">
        <label className="text-xs">
          <span className="mb-1 block font-medium">Orientation</span>
          <select value={orientation} onChange={(e) => setOrientation(e.target.value as "vertical" | "horizontal")} className="w-full rounded border border-slate-300 px-2 py-1">
            <option value="vertical">vertical</option>
            <option value="horizontal">horizontal</option>
          </select>
        </label>
        <label className="text-xs">
          <span className="mb-1 block font-medium">Active indexes</span>
          <div className="rounded border border-slate-300 bg-slate-50 px-2 py-1 text-[11px]">{active.length > 0 ? active.join(", ") : "(vazio)"}</div>
        </label>
      </div>

      <div className="flex flex-wrap gap-3 text-xs">
        <label className="inline-flex items-center gap-1"><input type="checkbox" checked={multiple} onChange={(e) => setMultiple(e.target.checked)} /> multiple</label>
        <label className="inline-flex items-center gap-1"><input type="checkbox" checked={collapsible} onChange={(e) => setCollapsible(e.target.checked)} /> collapsible</label>
        <label className="inline-flex items-center gap-1"><input type="checkbox" checked={keepMounted} onChange={(e) => setKeepMounted(e.target.checked)} /> keepMounted</label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button className="rounded border border-slate-300 bg-white px-2 py-1 text-xs" onClick={() => setActive([0])}>Abrir 1</button>
        <button className="rounded border border-slate-300 bg-white px-2 py-1 text-xs" onClick={() => setActive([1])}>Abrir 2</button>
        <button className="rounded border border-slate-300 bg-white px-2 py-1 text-xs" onClick={() => setActive([2])}>Abrir 3</button>
        <button className="rounded border border-slate-300 bg-white px-2 py-1 text-xs" onClick={() => setActive([0, 1, 2])}>Abrir todos</button>
        <button className="rounded border border-slate-300 bg-white px-2 py-1 text-xs" onClick={() => setActive([])}>Fechar todos</button>
      </div>

      {hasAccordion ? (
        <SgAccordionFromLib
          items={items}
          orientation={orientation}
          multiple={multiple}
          collapsible={collapsible}
          keepMounted={keepMounted}
          activeIndex={active}
          onActiveIndexChange={setActive}
          horizontalHeaderWidth={56}
          horizontalMinHeight={220}
        />
      ) : (
        <LocalFallback
          items={[
            { title: "Painel 1", content: "Conteudo do primeiro painel." },
            { title: "Painel 2", content: "Conteudo do segundo painel." },
            { title: "Painel 3", content: "Conteudo do terceiro painel." }
          ]}
          active={active}
          onChange={setActive}
          multiple={multiple}
        />
      )}
    </div>
  );
}`;

export default function SgAccordionPage() {
  const [controlled, setControlled] = React.useState<number[]>([0]);
  const [multiControlled, setMultiControlled] = React.useState<number[]>([0, 2]);

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">SgAccordion</h1>
        <p className="mt-2 text-muted-foreground">
          Accordion com configuracao vertical/horizontal, modo single ou multiple e controle externo.
        </p>
      </div>

      <Section
        title="1) Basico vertical (single)"
        description="Comportamento padrao em coluna, abrindo um painel por vez."
      >
        <SgAccordion items={VERTICAL_ITEMS} />
        <CodeBlockBase code={BASIC_CODE} />
      </Section>

      <Section
        title="2) Multiple + collapsible"
        description="Abra varios paineis ao mesmo tempo e controle estado ativo externamente."
      >
        <SgAccordion
          items={VERTICAL_ITEMS}
          multiple
          collapsible
          activeIndex={multiControlled}
          onActiveIndexChange={setMultiControlled}
        />
        <div className="flex flex-wrap gap-2">
          <SgButton size="sm" appearance="outline" onClick={() => setMultiControlled([0])}>Apenas 1</SgButton>
          <SgButton size="sm" appearance="outline" onClick={() => setMultiControlled([1, 2])}>2 e 3</SgButton>
          <SgButton size="sm" appearance="outline" onClick={() => setMultiControlled([0, 1, 2])}>Todos</SgButton>
          <SgButton size="sm" appearance="outline" onClick={() => setMultiControlled([])}>Nenhum</SgButton>
        </div>
        <CodeBlockBase code={MULTIPLE_CODE} />
      </Section>

      <Section
        title="3) Horizontal"
        description="Headers em trilho lateral e conteudo expandindo horizontalmente."
      >
        <SgAccordion
          items={HORIZONTAL_ITEMS}
          orientation="horizontal"
          defaultActiveIndex={1}
          horizontalHeaderWidth={56}
          horizontalMinHeight={220}
        />
        <CodeBlockBase code={HORIZONTAL_CODE} />
      </Section>

      <Section
        title="4) Controlado por estado"
        description="Use activeIndex/onActiveIndexChange para abrir/fechar via botoes externos."
      >
        <SgAccordion
          items={VERTICAL_ITEMS}
          activeIndex={controlled}
          onActiveIndexChange={setControlled}
        />
        <div className="flex flex-wrap gap-2">
          <SgButton size="sm" appearance="outline" onClick={() => setControlled([0])}>Abrir 1</SgButton>
          <SgButton size="sm" appearance="outline" onClick={() => setControlled([1])}>Abrir 2</SgButton>
          <SgButton size="sm" appearance="outline" onClick={() => setControlled([2])}>Abrir 3</SgButton>
          <SgButton size="sm" appearance="outline" onClick={() => setControlled([])}>Fechar todos</SgButton>
        </div>
        <CodeBlockBase code={CONTROLLED_CODE} />
      </Section>

      <Section
        title="5) Customizacao de itens"
        description="Itens com icon, badge final e estado disabled."
      >
        <SgAccordion items={CUSTOM_ITEMS} defaultActiveIndex={0} />
        <CodeBlockBase code={CUSTOM_CODE} />
      </Section>

      <Section
        title="6) Playground (SgPlayground)"
        description="Playground para o dev testar orientacao, modo multiple, estado controlado e outras opcoes."
      >
        <SgPlayground
          title="SgAccordion Playground"
          interactive
          codeContract="appFile"
          code={PLAYGROUND_APP_FILE}
          height={680}
          defaultOpen
        />
      </Section>
    </div>
  );
}

