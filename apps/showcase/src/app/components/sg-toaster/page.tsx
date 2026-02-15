"use client";

import React from "react";
import { SgButton, SgPlayground, toast, type SgToastId } from "@seedgrid/fe-components";
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

function CodeBlock(props: { code: string }) {
  return <CodeBlockBase code={props.code} />;
}

const SETUP_CODE = `import { SgToaster } from "@seedgrid/fe-components";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <SgToaster />
      </body>
    </html>
  );
}`;

const TYPES_CODE = `import { toast } from "@seedgrid/fe-components";

toast.message("Mensagem neutra");
toast.success("Operacao concluida");
toast.info("Informacao importante");
toast.warning("Atencao");
toast.error("Falha ao salvar");
toast.loading("Processando...");
`;

const LOADING_BY_ID_CODE = `const id = toast.loading("Exportando relatorio...");

// atualiza o mesmo toast pelo id
toast.success("Exportacao concluida", { id });
// ou
toast.error("Nao foi possivel exportar", { id });

// remover todos
toast.dismiss();
`;

const PROMISE_CODE = `await toast.promise(
  () => salvarNoServidor(),
  {
    loading: "Salvando...",
    success: (result) => "Salvo com sucesso: " + result.id,
    error: (err) => "Falha: " + (err instanceof Error ? err.message : "erro")
  },
  {
    description: "O helper cuida do ciclo loading/sucesso/erro."
  }
);`;

const CUSTOM_CODE = `toast.warning("Item arquivado", {
  description: "Voce pode desfazer a acao.",
  action: {
    label: "Desfazer",
    onClick: () => toast.success("Acao desfeita")
  }
});

toast.custom((id) => (
  <div className="rounded-md border border-primary/40 bg-background p-3">
    <div className="text-sm font-semibold">Toast customizado</div>
    <button onClick={() => toast.dismiss(id)}>Fechar</button>
  </div>
));`;

const OPTIONS_CODE = `toast.info("Toast com opcoes", {
  description: "Duracao longa, sem botao fechar e estilo custom.",
  duration: 10000,
  closeButton: false,
  className: "border-[#c56a2d]",
  style: {
    background: "#fff7f1",
    color: "#5b3b23"
  }
});`;

const PLAYGROUND_APP_FILE = `import * as React from "react";
import { SgButton, SgStack, SgToaster, toast } from "@seedgrid/fe-components";

const positions = [
  "top-right",
  "top-left",
  "top-center",
  "bottom-right",
  "bottom-left",
  "bottom-center"
];

export default function App() {
  const [position, setPosition] = React.useState("top-right");
  const [duration, setDuration] = React.useState(3500);
  const [visibleToasts, setVisibleToasts] = React.useState(4);
  const [closeButton, setCloseButton] = React.useState(true);
  const [richColors, setRichColors] = React.useState(true);

  return (
    <div className="space-y-3">
      <SgToaster
        position={position}
        duration={duration}
        visibleToasts={visibleToasts}
        closeButton={closeButton}
        richColors={richColors}
      />

      <SgStack direction="row" wrap gap={8} align="center">
        <label className="text-sm">
          Position:
          <select
            className="ml-2 rounded border px-2 py-1 text-xs"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          >
            {positions.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          Duration:
          <input
            className="ml-2 w-24 rounded border px-2 py-1 text-xs"
            type="number"
            min={500}
            step={500}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </label>

        <label className="text-sm">
          Visible:
          <input
            className="ml-2 w-16 rounded border px-2 py-1 text-xs"
            type="number"
            min={1}
            max={10}
            value={visibleToasts}
            onChange={(e) => setVisibleToasts(Number(e.target.value))}
          />
        </label>

        <label className="text-sm">
          <input
            className="mr-1"
            type="checkbox"
            checked={closeButton}
            onChange={(e) => setCloseButton(e.target.checked)}
          />
          closeButton
        </label>

        <label className="text-sm">
          <input
            className="mr-1"
            type="checkbox"
            checked={richColors}
            onChange={(e) => setRichColors(e.target.checked)}
          />
          richColors
        </label>
      </SgStack>

      <SgStack direction="row" wrap gap={8}>
        <SgButton onClick={() => toast.message("Mensagem padrao")}>Message</SgButton>
        <SgButton severity="success" onClick={() => toast.success("Tudo certo!")}>Success</SgButton>
        <SgButton severity="warning" onClick={() => toast.warning("Atenção!")}>Warning</SgButton>
        <SgButton severity="danger" onClick={() => toast.error("Falhou!")}>Error</SgButton>
        <SgButton appearance="outline" onClick={() => toast.dismiss()}>Dismiss all</SgButton>
      </SgStack>
    </div>
  );
}`;

export default function SgToasterPage() {
  const [loadingId, setLoadingId] = React.useState<SgToastId | null>(null);

  const startLoading = React.useCallback(() => {
    const id = toast.loading("Processando lote...", {
      description: "Esse toast fica aberto ate voce atualizar ou fechar."
    });
    setLoadingId(id);
  }, []);

  const finishLoadingSuccess = React.useCallback(() => {
    if (!loadingId) {
      toast.warning("Nenhum loading ativo");
      return;
    }

    toast.success("Processamento concluido", {
      id: loadingId,
      description: "Atualizacao usando o mesmo id."
    });
    setLoadingId(null);
  }, [loadingId]);

  const finishLoadingError = React.useCallback(() => {
    if (!loadingId) {
      toast.warning("Nenhum loading ativo");
      return;
    }

    toast.error("Falha no processamento", {
      id: loadingId,
      description: "Atualizacao de loading para erro."
    });
    setLoadingId(null);
  }, [loadingId]);

  const runPromiseDemo = React.useCallback(async () => {
    const task = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      if (Math.random() < 0.35) {
        throw new Error("Erro aleatorio de demonstracao");
      }
      return { id: "ORD-2026-001" };
    };

    try {
      await toast.promise(task, {
        loading: "Salvando pedido...",
        success: (value) => `Pedido salvo: ${value.id}`,
        error: (error) => `Falha: ${error instanceof Error ? error.message : "erro"}`
      });
    } catch {
      // erro ja tratado pelo toast.promise
    }
  }, []);

  const runActionDemo = React.useCallback(() => {
    toast.warning("Item arquivado", {
      description: "Clique em desfazer para restaurar.",
      action: {
        label: "Desfazer",
        onClick: () =>
          toast.success("Acao desfeita", {
            description: "O item voltou para a lista."
          })
      }
    });
  }, []);

  const runCustomDemo = React.useCallback(() => {
    toast.custom(
      (id) => (
        <div className="w-full max-w-[280px] rounded-md border border-[#c56a2d]/50 bg-[#fff7f1] p-3">
          <div className="text-sm font-semibold text-[#8f4b1f]">Toast customizado</div>
          <p className="mt-1 text-xs text-[#6b4b33]">Conteudo renderizado via toast.custom(...)</p>
          <div className="mt-2 flex gap-2">
            <SgButton size="sm" onClick={() => toast.dismiss(id)}>
              Fechar
            </SgButton>
          </div>
        </div>
      ),
      { duration: 8000, closeButton: false }
    );
  }, []);

  const runOptionsDemo = React.useCallback(() => {
    toast.info("Toast com opcoes customizadas", {
      description: "Duracao 10s, sem closeButton e estilo proprio.",
      duration: 10000,
      closeButton: false,
      className: "border-[#c56a2d]",
      style: {
        background: "#fff7f1",
        color: "#5b3b23"
      }
    });
  }, []);

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">SgToaster</h1>
        <p className="mt-2 text-muted-foreground">
          Sistema de notificacao com API imperativa (`toast`) + renderer (`SgToaster`).
        </p>
      </div>

      <Section
        title="1) Setup base"
        description="No showcase, o SgToaster ja esta montado no layout. Em app real, monte uma vez no root."
      >
        <div className="flex flex-wrap gap-2">
          <SgButton onClick={() => toast.message("Mensagem basica")}>toast.message</SgButton>
          <SgButton severity="success" onClick={() => toast.success("Sucesso!")}>
            toast.success
          </SgButton>
          <SgButton appearance="outline" onClick={() => toast.dismiss()}>
            toast.dismiss (all)
          </SgButton>
        </div>
        <CodeBlock code={SETUP_CODE} />
      </Section>

      <Section
        title="2) Tipos de toast"
        description="Use metodos especificos por severidade."
      >
        <div className="flex flex-wrap gap-2">
          <SgButton onClick={() => toast.message("Mensagem neutra")}>default</SgButton>
          <SgButton severity="success" onClick={() => toast.success("Operacao concluida")}>
            success
          </SgButton>
          <SgButton severity="info" onClick={() => toast.info("Informacao importante")}>
            info
          </SgButton>
          <SgButton severity="warning" onClick={() => toast.warning("Atencao no fluxo")}>
            warning
          </SgButton>
          <SgButton severity="danger" onClick={() => toast.error("Falha ao salvar")}>
            error
          </SgButton>
          <SgButton appearance="outline" onClick={() => toast.loading("Processando...")}>
            loading
          </SgButton>
        </div>
        <CodeBlock code={TYPES_CODE} />
      </Section>

      <Section
        title="3) Loading por id (update do mesmo toast)"
        description="Guarde o id retornado e reutilize para trocar estado sem criar outro toast."
      >
        <div className="flex flex-wrap items-center gap-2">
          <SgButton onClick={startLoading}>Iniciar loading</SgButton>
          <SgButton severity="success" onClick={finishLoadingSuccess}>
            Finalizar com sucesso
          </SgButton>
          <SgButton severity="danger" onClick={finishLoadingError}>
            Finalizar com erro
          </SgButton>
          <SgButton appearance="outline" onClick={() => toast.dismiss()}>
            Limpar todos
          </SgButton>
          <span className="text-xs text-muted-foreground">
            loadingId: <code>{loadingId ?? "nenhum"}</code>
          </span>
        </div>
        <CodeBlock code={LOADING_BY_ID_CODE} />
      </Section>

      <Section
        title="4) toast.promise"
        description="Conveniencia para ciclo loading/success/error em promessas."
      >
        <div className="flex flex-wrap gap-2">
          <SgButton onClick={runPromiseDemo}>Executar promise demo</SgButton>
        </div>
        <CodeBlock code={PROMISE_CODE} />
      </Section>

      <Section
        title="5) Acoes e toast customizado"
        description="Use action para CTA rapido e custom para render livre."
      >
        <div className="flex flex-wrap gap-2">
          <SgButton severity="warning" onClick={runActionDemo}>
            Toast com action
          </SgButton>
          <SgButton appearance="outline" onClick={runCustomDemo}>
            Toast custom
          </SgButton>
        </div>
        <CodeBlock code={CUSTOM_CODE} />
      </Section>

      <Section
        title="6) Opcoes por toast"
        description="Cada toast aceita duration, closeButton, className e style."
      >
        <div className="flex flex-wrap gap-2">
          <SgButton onClick={runOptionsDemo}>Disparar toast com opcoes</SgButton>
        </div>
        <CodeBlock code={OPTIONS_CODE} />
      </Section>

      <Section
        title="7) Playground isolado do SgToaster"
        description="Aqui voce altera props do SgToaster (position, duration, visibleToasts, closeButton, richColors) em tempo real."
      >
        <SgPlayground
          title="SgToaster Playground"
          interactive
          codeContract="appFile"
          code={PLAYGROUND_APP_FILE}
          height={560}
          defaultOpen
        />
      </Section>

      <Section title="8) Props de referencia">
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="text-left">
                <th className="px-3 py-2">Prop</th>
                <th className="px-3 py-2">Tipo</th>
                <th className="px-3 py-2">Default</th>
                <th className="px-3 py-2">Descricao</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr><td className="px-3 py-2 font-mono text-xs">position</td><td className="px-3 py-2">"top-right" | "top-left" | "top-center" | "bottom-right" | "bottom-left" | "bottom-center"</td><td className="px-3 py-2">"top-right"</td><td className="px-3 py-2">Posicao do container de toasts.</td></tr>
              <tr><td className="px-3 py-2 font-mono text-xs">duration</td><td className="px-3 py-2">number</td><td className="px-3 py-2">4000</td><td className="px-3 py-2">Duracao padrao (ms) para auto-close.</td></tr>
              <tr><td className="px-3 py-2 font-mono text-xs">visibleToasts</td><td className="px-3 py-2">number</td><td className="px-3 py-2">6</td><td className="px-3 py-2">Quantidade maxima exibida simultaneamente.</td></tr>
              <tr><td className="px-3 py-2 font-mono text-xs">closeButton</td><td className="px-3 py-2">boolean</td><td className="px-3 py-2">true</td><td className="px-3 py-2">Mostra botao de fechar nos toasts.</td></tr>
              <tr><td className="px-3 py-2 font-mono text-xs">richColors</td><td className="px-3 py-2">boolean</td><td className="px-3 py-2">true</td><td className="px-3 py-2">Usa paleta forte por severidade.</td></tr>
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

