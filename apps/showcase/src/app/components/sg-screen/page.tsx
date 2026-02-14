"use client";

import React from "react";
import { SgScreen, SgMainPanel, SgPanel, SgStack } from "@seedgrid/fe-components";
import SgCodeBlockBase from "../others/SgCodeBlockBase";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <SgPanel borderStyle="solid" className="rounded-lg border-border" padding={24}>
      <SgStack gap={16}>
        <SgStack gap={4}>
          <h2 className="text-lg font-semibold">{props.title}</h2>
          {props.description ? <p className="text-sm text-muted-foreground">{props.description}</p> : null}
        </SgStack>
        {props.children}
      </SgStack>
    </SgPanel>
  );
}

const fullExampleCode = `"use client";

import React from "react";
import { SgScreen, SgMainPanel, SgPanel, SgStack } from "@seedgrid/fe-components";

export default function ExampleSgScreenPage() {
  return (
    <SgPanel className="h-[420px] rounded-xl bg-muted/30" padding={12}>
      <SgScreen fullscreen={false} padding={10} className="rounded-lg bg-zinc-100">
        <SgMainPanel gap={8} padding={8}>
          <SgPanel align="top" height={12} padding={10} className="rounded-md">
            <SgStack direction="row" justify="between" align="center">
              <span className="text-sm font-medium">Header</span>
              <span className="text-xs text-muted-foreground">top + height=12%</span>
            </SgStack>
          </SgPanel>

          <SgPanel align="left" width={20} padding={10} className="rounded-md">
            <SgStack gap={6}>
              <span className="text-xs font-medium text-muted-foreground">MENU</span>
              <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Dashboard</SgPanel>
              <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Relatorios</SgPanel>
              <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Clientes</SgPanel>
            </SgStack>
          </SgPanel>

          <SgPanel align="right" width="18%" padding={10} className="rounded-md">
            <SgStack gap={6}>
              <span className="text-xs font-medium text-muted-foreground">ACOES</span>
              <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Filtrar</SgPanel>
              <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Exportar</SgPanel>
            </SgStack>
          </SgPanel>

          <SgPanel align="bottom" height="10%" padding={10} className="rounded-md">
            <SgStack direction="row" justify="between" align="center">
              <span className="text-sm">Footer</span>
              <span className="text-xs text-muted-foreground">bottom + height=10%</span>
            </SgStack>
          </SgPanel>

          <SgPanel align="client" padding={10} className="rounded-md">
            <SgStack gap={8}>
              <span className="text-sm font-medium">Area client</span>
              <SgPanel borderStyle="solid" className="h-24 rounded bg-muted/20" />
              <span className="text-xs text-muted-foreground">
                Esta area ocupa todo o espaco restante.
              </span>
            </SgStack>
          </SgPanel>
        </SgMainPanel>
      </SgScreen>
    </SgPanel>
  );
}`;

export default function SgScreenPage() {
  return (
    <SgStack className="max-w-6xl" gap={32}>
      <SgStack gap={8}>
        <h1 className="text-3xl font-bold">SgScreen</h1>
        <p className="mt-2 text-muted-foreground">
          Container raiz para telas. O exemplo abaixo esta completo para copiar e colar.
        </p>
      </SgStack>

      <Section
        title="Exemplo Completo"
        description="Uso com fullscreen=false em area controlada, incluindo layout top/left/right/bottom/client."
      >
        <SgPanel className="h-[420px] rounded-xl bg-muted/30" padding={12}>
          <SgScreen fullscreen={false} padding={10} className="rounded-lg bg-zinc-100">
            <SgMainPanel gap={8} padding={8}>
              <SgPanel align="top" height={12} padding={10} className="rounded-md">
                <SgStack direction="row" justify="between" align="center">
                  <span className="text-sm font-medium">Header</span>
                  <span className="text-xs text-muted-foreground">top + height=12%</span>
                </SgStack>
              </SgPanel>

              <SgPanel align="left" width={20} padding={10} className="rounded-md">
                <SgStack gap={6}>
                  <span className="text-xs font-medium text-muted-foreground">MENU</span>
                  <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Dashboard</SgPanel>
                  <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Relatorios</SgPanel>
                  <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Clientes</SgPanel>
                </SgStack>
              </SgPanel>

              <SgPanel align="right" width="18%" padding={10} className="rounded-md">
                <SgStack gap={6}>
                  <span className="text-xs font-medium text-muted-foreground">ACOES</span>
                  <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Filtrar</SgPanel>
                  <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Exportar</SgPanel>
                </SgStack>
              </SgPanel>

              <SgPanel align="bottom" height="10%" padding={10} className="rounded-md">
                <SgStack direction="row" justify="between" align="center">
                  <span className="text-sm">Footer</span>
                  <span className="text-xs text-muted-foreground">bottom + height=10%</span>
                </SgStack>
              </SgPanel>

              <SgPanel align="client" padding={10} className="rounded-md">
                <SgStack gap={8}>
                  <span className="text-sm font-medium">Area client</span>
                  <SgPanel borderStyle="solid" className="h-24 rounded bg-muted/20" />
                  <span className="text-xs text-muted-foreground">
                    Esta area ocupa todo o espaco restante.
                  </span>
                </SgStack>
              </SgPanel>
            </SgMainPanel>
          </SgScreen>
        </SgPanel>

        <SgStack className="mt-6">
          <SgCodeBlockBase code={fullExampleCode} />
        </SgStack>
      </Section>
    </SgStack>
  );
}


