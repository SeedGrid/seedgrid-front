"use client";

import React from "react";
import { Check, X } from "lucide-react";
import { SgButton } from "@seedgrid/fe-components";

function useFakeProcess(durationMs: number) {
  const [loading, setLoading] = React.useState(false);
  const timerRef = React.useRef<number | null>(null);

  const run = React.useCallback(() => {
    if (timerRef.current) return;
    setLoading(true);
    timerRef.current = window.setTimeout(() => {
      setLoading(false);
      timerRef.current = null;
    }, durationMs);
  }, [durationMs]);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  return { loading, run };
}

function Section(props: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{props.title}</h2>
      {props.children}
    </section>
  );
}

function Row(props: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{props.children}</div>;
}

export default function SgButtonShowcase() {
  const submit = useFakeProcess(2000);
  const danger = useFakeProcess(1200);

  return (
    <div className="space-y-8">
      <Section title="Basic (with onClick)">
        <Row>
          <SgButton onClick={submit.run} loading={submit.loading}>
            Submit
          </SgButton>

          <SgButton disabled>Disabled</SgButton>
        </Row>
      </Section>

      <Section title="Icons + Loading">
        <Row>
          <SgButton leftIcon={<Check className="size-4" />} loading={submit.loading} onClick={submit.run}>
            Confirm
          </SgButton>

          <SgButton
            severity="danger"
            leftIcon={<X className="size-4" />}
            loading={danger.loading}
            onClick={danger.run}
          >
            Delete
          </SgButton>

          <SgButton
            severity="danger"
            shape="rounded"
            leftIcon={<X className="size-4" />}
            loading={danger.loading}
            onClick={danger.run}
          />
        </Row>
      </Section>

      <Section title="Raised Buttons (processing)">
        <Row>
          <SgButton raised severity="success" loading={submit.loading} onClick={submit.run}>
            Save changes
          </SgButton>

          <SgButton
            raised
            severity="secondary"
            appearance="outline"
            loading={submit.loading}
            onClick={submit.run}
          >
            Update
          </SgButton>
        </Row>
      </Section>

      <Section title="Custom color + processing">
        <Row>
          <SgButton
            loading={submit.loading}
            onClick={submit.run}
            customColors={{
              bg: "#0f172a",
              fg: "#ffffff",
              hoverBg: "#020617",
              ring: "rgba(15,23,42,.35)"
            }}
          >
            Brand Action
          </SgButton>
        </Row>
      </Section>
    </div>
  );
}
