"use client";

import React from "react";
import { Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { SgPlayground, SgToggleSwitch } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold">{props.title}</h2>
      {props.description ? (
        <p className="mt-1 text-sm text-muted-foreground">{props.description}</p>
      ) : null}
      <div className="mt-4 space-y-4">{props.children}</div>
    </section>
  );
}

const TOGGLE_SWITCH_PLAYGROUND_APP_FILE = `import * as React from "react";
import * as SeedGrid from "@seedgrid/fe-components";

const SgToggleSwitchFromLib = (SeedGrid as Record<string, unknown>).SgToggleSwitch as
  | React.ComponentType<any>
  | undefined;

function LocalFallback(props: {
  id: string;
  label?: string;
  checked?: boolean;
  onChange?: (next: boolean) => void;
  enabled?: boolean;
  readOnly?: boolean;
}) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <input
        id={props.id}
        type="checkbox"
        checked={Boolean(props.checked)}
        disabled={props.enabled === false}
        readOnly={props.readOnly}
        onChange={(event) => props.onChange?.(event.currentTarget.checked)}
      />
      <span>{props.label}</span>
    </label>
  );
}

export default function App() {
  const hasToggle = typeof SgToggleSwitchFromLib === "function";
  const Toggle = (hasToggle ? SgToggleSwitchFromLib : LocalFallback) as React.ComponentType<any>;
  const [checked, setChecked] = React.useState(false);
  const [enabled, setEnabled] = React.useState(true);
  const [readOnly, setReadOnly] = React.useState(false);
  const [required, setRequired] = React.useState(false);
  const [showIcons, setShowIcons] = React.useState(true);
  const [captured, setCaptured] = React.useState("(none)");

  return (
    <div className="space-y-4 p-2">
      {!hasToggle ? (
        <div className="rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
          SgToggleSwitch ainda nao esta na versao publicada usada pelo Sandpack. Exibindo fallback.
        </div>
      ) : null}

      <Toggle
        id="toggle-playground"
        label="Exemplo dinamico"
        checked={checked}
        onChange={(next: boolean) => {
          setChecked(next);
          setCaptured("onChange -> " + String(next));
        }}
        enabled={enabled}
        readOnly={readOnly}
        required={required}
        onIcon={showIcons ? "ON" : undefined}
        offIcon={showIcons ? "OFF" : undefined}
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded border border-slate-300 bg-white px-2 py-1 text-xs hover:bg-slate-50"
          onClick={() => setChecked(true)}
        >
          Set true
        </button>
        <button
          type="button"
          className="rounded border border-slate-300 bg-white px-2 py-1 text-xs hover:bg-slate-50"
          onClick={() => setChecked(false)}
        >
          Set false
        </button>
        <button
          type="button"
          className="rounded border border-slate-300 bg-white px-2 py-1 text-xs hover:bg-slate-50"
          onClick={() => setChecked((prev) => !prev)}
        >
          Toggle
        </button>
      </div>

      <div className="flex flex-wrap gap-3 text-xs">
        <label className="inline-flex items-center gap-1">
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
          enabled
        </label>
        <label className="inline-flex items-center gap-1">
          <input type="checkbox" checked={readOnly} onChange={(e) => setReadOnly(e.target.checked)} />
          readOnly
        </label>
        <label className="inline-flex items-center gap-1">
          <input type="checkbox" checked={required} onChange={(e) => setRequired(e.target.checked)} />
          required
        </label>
        <label className="inline-flex items-center gap-1">
          <input type="checkbox" checked={showIcons} onChange={(e) => setShowIcons(e.target.checked)} />
          icons
        </label>
      </div>

      <div className="rounded border border-border bg-muted/40 p-3 text-xs">
        <div><strong>value:</strong> {String(checked)}</div>
        <div><strong>captured:</strong> {captured}</div>
      </div>
    </div>
  );
}`;

const BASIC_SHOWCASE_CODE = `import * as React from "react";
import { SgToggleSwitch } from "@seedgrid/fe-components";

export default function Example() {
  const [value, setValue] = React.useState(false);

  return (
    <div>
      <SgToggleSwitch
        id="demo-basic"
        label="Ativar notificacoes"
        checked={value}
        onChange={setValue}
      />
      <p>Valor atual: {String(value)}</p>
    </div>
  );
}`;

const ICONS_SHOWCASE_CODE = `import * as React from "react";
import { Check, X } from "lucide-react";
import { SgToggleSwitch } from "@seedgrid/fe-components";

export default function Example() {
  const [value, setValue] = React.useState(true);

  return (
    <div>
      <SgToggleSwitch
        id="demo-icons"
        label="Status da conta"
        checked={value}
        onChange={setValue}
        onIcon={<Check size={12} />}
        offIcon={<X size={12} />}
      />
      <p>Valor atual: {String(value)}</p>
    </div>
  );
}`;

const REMOTE_SHOWCASE_CODE = `import * as React from "react";
import { Check, X } from "lucide-react";
import { SgToggleSwitch } from "@seedgrid/fe-components";

export default function Example() {
  const [value, setValue] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [log, setLog] = React.useState<string[]>([]);

  const handleRemoteToggle = (nextValue: boolean) => {
    setValue(nextValue);
    setLoading(true);
    setTimeout(() => {
      setLog((prev) => ["value=" + String(nextValue), ...prev].slice(0, 8));
      setLoading(false);
    }, 450);
  };

  return (
    <div>
      <SgToggleSwitch
        id="demo-remote"
        label={loading ? "Salvando..." : "Publicar automaticamente"}
        checked={value}
        onChange={handleRemoteToggle}
        enabled={!loading}
        onIcon={<Check size={12} />}
        offIcon={<X size={12} />}
      />
      <div>{log.map((entry, index) => <div key={index}>{entry}</div>)}</div>
    </div>
  );
}`;

const EXTERNAL_SHOWCASE_CODE = `import * as React from "react";
import { Check, X } from "lucide-react";
import { SgToggleSwitch } from "@seedgrid/fe-components";

export default function Example() {
  const [value, setValue] = React.useState(false);
  const [captured, setCaptured] = React.useState("(sem evento)");

  return (
    <div>
      <SgToggleSwitch
        id="demo-external"
        label="Permitir sincronizacao"
        checked={value}
        onChange={(next) => {
          setValue(next);
          setCaptured("onChange -> " + String(next));
        }}
        onIcon={<Check size={12} />}
        offIcon={<X size={12} />}
      />

      <button onClick={() => setValue(true)}>Setar true</button>
      <button onClick={() => setValue(false)}>Setar false</button>
      <button onClick={() => setValue((prev) => !prev)}>Toggle externo</button>
      <button onClick={() => setCaptured("captura manual -> " + String(value))}>Capturar agora</button>

      <p>capturado: {captured}</p>
    </div>
  );
}`;

const RHF_SHOWCASE_CODE = `import * as React from "react";
import { Check, X } from "lucide-react";
import { useForm, type FieldValues } from "react-hook-form";
import { SgToggleSwitch } from "@seedgrid/fe-components";

export default function Example() {
  const [submitResult, setSubmitResult] = React.useState("-");
  const { register, control, handleSubmit, watch } = useForm<FieldValues>({
    defaultValues: {
      notifications: false,
      active: true
    } as FieldValues
  });

  return (
    <form onSubmit={handleSubmit((data) => setSubmitResult(JSON.stringify(data)))}>
      <SgToggleSwitch
        id="demo-rhf-register"
        name="notifications"
        label="Receber notificacoes por email"
        register={register}
      />

      <SgToggleSwitch
        id="demo-rhf-control"
        name="active"
        label="Conta ativa"
        control={control}
        onIcon={<Check size={12} />}
        offIcon={<X size={12} />}
      />

      <button type="submit">Enviar</button>
      <p>watch.notifications: {String(watch("notifications"))}</p>
      <p>watch.active: {String(watch("active"))}</p>
      <p>Ultimo submit: {submitResult}</p>
    </form>
  );
}`;

const DISABLED_READONLY_SHOWCASE_CODE = `import * as React from "react";
import { Check, X } from "lucide-react";
import { SgToggleSwitch } from "@seedgrid/fe-components";

export default function Example() {
  return (
    <div>
      <SgToggleSwitch
        id="demo-disabled"
        label="Disabled"
        checked
        enabled={false}
        onIcon={<Check size={12} />}
        offIcon={<X size={12} />}
      />

      <SgToggleSwitch
        id="demo-readonly"
        label="ReadOnly"
        checked={false}
        readOnly
        onIcon={<Check size={12} />}
        offIcon={<X size={12} />}
      />
    </div>
  );
}`;

export default function SgToggleSwitchPage() {
  const [basicValue, setBasicValue] = React.useState(false);
  const [iconValue, setIconValue] = React.useState(true);
  const [externalValue, setExternalValue] = React.useState(false);
  const [capturedValue, setCapturedValue] = React.useState<string>("(sem evento)");
  const [remoteValue, setRemoteValue] = React.useState(false);
  const [remoteLoading, setRemoteLoading] = React.useState(false);
  const [remoteLog, setRemoteLog] = React.useState<string[]>([]);
  const [submitResult, setSubmitResult] = React.useState<string>("-");

  const { register, control, handleSubmit, watch } = useForm<FieldValues>({
    defaultValues: {
      notifications: false,
      active: true
    } as FieldValues
  });

  const watchedNotifications = Boolean(watch("notifications"));
  const watchedActive = Boolean(watch("active"));

  const handleRemoteToggle = (nextValue: boolean) => {
    setRemoteValue(nextValue);
    setRemoteLoading(true);
    window.setTimeout(() => {
      const timestamp = new Date().toLocaleTimeString();
      setRemoteLog((prev) => [`[${timestamp}] value=${String(nextValue)}`, ...prev].slice(0, 8));
      setRemoteLoading(false);
    }, 450);
  };

  const onSubmit = (data: FieldValues) => {
    setSubmitResult(JSON.stringify(data));
  };

  const handleExternalChange = React.useCallback((nextValue: boolean) => {
    setExternalValue(nextValue);
    setCapturedValue(`onChange -> ${String(nextValue)}`);
  }, []);

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">SgToggleSwitch</h1>
        <p className="mt-2 text-muted-foreground">
          Toggle switch inspirado no PrimeFaces (`toggleSwitch`) com suporte a icones,
          estados disabled/readonly e integracao com `react-hook-form`.
        </p>
      </div>

      <Section
        title="Basico"
        description="Exemplo simples controlado por estado React."
      >
        <div className="rounded-md border border-border p-4">
          <SgToggleSwitch
            id="demo-basic"
            label="Ativar notificacoes"
            checked={basicValue}
            onChange={setBasicValue}
          />
          <p className="mt-3 text-xs text-muted-foreground">
            Valor atual: <code className="rounded bg-muted px-1">{String(basicValue)}</code>
          </p>
        </div>
        <CodeBlockBase
          code={BASIC_SHOWCASE_CODE}
        />
      </Section>

      <Section
        title="Com icones (on/off)"
        description="Variacao visual com icones dentro do thumb, seguindo a ideia do exemplo com icon no PrimeFaces."
      >
        <div className="rounded-md border border-border p-4">
          <SgToggleSwitch
            id="demo-icons"
            label="Status da conta"
            checked={iconValue}
            onChange={setIconValue}
            onIcon={<Check size={12} />}
            offIcon={<X size={12} />}
          />
          <p className="mt-3 text-xs text-muted-foreground">
            Valor atual: <code className="rounded bg-muted px-1">{String(iconValue)}</code>
          </p>
        </div>
        <CodeBlockBase
          code={ICONS_SHOWCASE_CODE}
        />
      </Section>

      <Section
        title="Remote (simulacao de update)"
        description="Ao alterar o switch, simulamos uma atualizacao remota para reproduzir o fluxo comum do showcase PrimeFaces."
      >
        <div className="rounded-md border border-border p-4">
          <SgToggleSwitch
            id="demo-remote"
            label={remoteLoading ? "Salvando..." : "Publicar automaticamente"}
            checked={remoteValue}
            onChange={handleRemoteToggle}
            enabled={!remoteLoading}
            onIcon={<Check size={12} />}
            offIcon={<X size={12} />}
          />
          <div className="mt-3 h-28 overflow-y-auto rounded border border-border bg-foreground/5 p-2 font-mono text-xs">
            {remoteLog.length === 0 ? (
              <span className="text-muted-foreground">
                Altere o switch para registrar eventos.
              </span>
            ) : (
              remoteLog.map((entry, index) => <div key={index}>{entry}</div>)
            )}
          </div>
        </div>
        <CodeBlockBase
          code={REMOTE_SHOWCASE_CODE}
        />
      </Section>

      <Section
        title="Controlado externamente + captura do valor"
        description="Exemplo de value controlado por estado externo e captura via onChange."
      >
        <div className="rounded-md border border-border p-4 space-y-3">
          <SgToggleSwitch
            id="demo-external"
            label="Permitir sincronizacao"
            checked={externalValue}
            onChange={handleExternalChange}
            onIcon={<Check size={12} />}
            offIcon={<X size={12} />}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded border border-border px-3 py-1.5 text-sm hover:bg-foreground/5"
              onClick={() => setExternalValue(true)}
            >
              Setar true
            </button>
            <button
              type="button"
              className="rounded border border-border px-3 py-1.5 text-sm hover:bg-foreground/5"
              onClick={() => setExternalValue(false)}
            >
              Setar false
            </button>
            <button
              type="button"
              className="rounded border border-border px-3 py-1.5 text-sm hover:bg-foreground/5"
              onClick={() => setExternalValue((prev) => !prev)}
            >
              Toggle externo
            </button>
            <button
              type="button"
              className="rounded border border-border px-3 py-1.5 text-sm hover:bg-foreground/5"
              onClick={() => setCapturedValue(`captura manual -> ${String(externalValue)}`)}
            >
              Capturar agora
            </button>
          </div>
          <div className="rounded border border-border bg-foreground/5 p-2 text-xs">
            <div>value externo: <code className="rounded bg-muted px-1">{String(externalValue)}</code></div>
            <div>capturado: <code className="rounded bg-muted px-1">{capturedValue}</code></div>
          </div>
        </div>
        <CodeBlockBase
          code={EXTERNAL_SHOWCASE_CODE}
        />
      </Section>

      <Section
        title="React Hook Form"
        description="Suporte nativo para `register` e `control`."
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-md border border-border p-4">
          <SgToggleSwitch
            id="demo-rhf-register"
            name="notifications"
            label="Receber notificacoes por email"
            register={register}
          />
          <SgToggleSwitch
            id="demo-rhf-control"
            name="active"
            label="Conta ativa"
            control={control}
            onIcon={<Check size={12} />}
            offIcon={<X size={12} />}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              className="rounded border border-border px-3 py-1.5 text-sm hover:bg-foreground/5"
            >
              Enviar
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            watch.notifications: <code className="rounded bg-muted px-1">{String(watchedNotifications)}</code>
            {" | "}
            watch.active: <code className="rounded bg-muted px-1">{String(watchedActive)}</code>
          </p>
          <p className="text-xs text-muted-foreground">
            Ultimo submit: <code className="rounded bg-muted px-1">{submitResult}</code>
          </p>
        </form>
        <CodeBlockBase
          code={RHF_SHOWCASE_CODE}
        />
      </Section>

      <Section
        title="Estados Disabled / ReadOnly"
        description="Disabled bloqueia interacao. ReadOnly mantem visual habilitado, mas nao altera o valor."
      >
        <div className="grid gap-4 rounded-md border border-border p-4 sm:grid-cols-2">
          <SgToggleSwitch
            id="demo-disabled"
            label="Disabled"
            checked
            enabled={false}
            onIcon={<Check size={12} />}
            offIcon={<X size={12} />}
          />
          <SgToggleSwitch
            id="demo-readonly"
            label="ReadOnly"
            checked={false}
            readOnly
            onIcon={<Check size={12} />}
            offIcon={<X size={12} />}
          />
        </div>
        <CodeBlockBase
          code={DISABLED_READONLY_SHOWCASE_CODE}
        />
      </Section>

      <Section
        title="Playground (SgPlayground)"
        description="Playground interativo do componente com set externo e captura de valor."
      >
        <SgPlayground
          title="SgToggleSwitch Playground"
          interactive
          codeContract="appFile"
          code={TOGGLE_SWITCH_PLAYGROUND_APP_FILE}
          height={560}
          defaultOpen
        />
      </Section>
    </div>
  );
}
