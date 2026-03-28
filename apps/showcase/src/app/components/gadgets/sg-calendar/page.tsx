"use client";

import * as React from "react";
import { SgButton, SgCalendar, SgEnvironmentProvider, SgGrid } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import SgCodeBlockBase from "../../sgCodeBlockBase";
import I18NReady from "../../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../../ShowcasePropsReference";
import ShowcaseStickyHeader from "../../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../../useShowcaseAnchors";
import { useShowcaseI18n, type ShowcaseLocale } from "../../../../i18n";

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


type CalendarTexts = {
  subtitle: string;
  section1Title: string;
  section1Description: string;
  section2Title: string;
  section2Description: string;
  section3Title: string;
  section3Description: string;
  section4Title: string;
  section4Description: string;
  playgroundTitle: string;
  propsValue: string;
  propsView: string;
  propsLocale: string;
  propsWeekStart: string;
  propsWeekdayFormat: string;
  propsNumberOfMonths: string;
  propsMonthsPerLine: string;
  propsMonthMinWidth: string;
  propsAdjacent: string;
  propsMinMax: string;
  propsDisabled: string;
  propsTodayShortcut: string;
  propsClassStyle: string;
  propsCard: string;
};

const CALENDAR_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", CalendarTexts> = {
  "pt-BR": {
    subtitle: "Calendario mensal em formato de gadget, com card arrastavel/recolhivel e suporte a locale.",
    section1Title: "1) Basico (mes atual)",
    section1Description: "Configuracao inicial com data selecionada e persistencia de posicao no card.",
    section2Title: "2) Selecionado controlado + limite de datas",
    section2Description: "Controle externo de valor, bloqueio de finais de semana e limite minimo/maximo.",
    section3Title: "3) Locale + multiplos meses",
    section3Description: "Alterna locale, primeiro dia da semana e quantidade de meses (numberOfMonths, monthsPerLine=3).",
    section4Title: "4) Playground (SgPlayground)",
    section4Description: "Teste interativo das principais props do SgCalendar.",
    playgroundTitle: "SgCalendar Playground",
    propsValue: "Valor selecionado (controlado ou inicial) e callback de mudanca.",
    propsView: "Mes visivel (controlado ou inicial) e callback de navegacao.",
    propsLocale: "Locale usado para formatar mes, data selecionada e labels dos dias.",
    propsWeekStart: "Define o primeiro dia da semana (0=domingo, 1=segunda...).",
    propsWeekdayFormat: "Formato textual dos dias da semana (narrow, short, long).",
    propsNumberOfMonths: "Quantidade de meses visiveis no componente (de 1 a 12).",
    propsMonthsPerLine: "Quantidade de meses por linha antes de quebrar para a proxima linha.",
    propsMonthMinWidth: "Largura minima de cada mes (numero em px ou string CSS, ex.: 280 ou 18rem).",
    propsAdjacent: "Exibe/oculta dias de meses adjacentes na grade.",
    propsMinMax: "Limites minimo e maximo para selecao de data.",
    propsDisabled: "Regra adicional para desabilitar datas especificas.",
    propsTodayShortcut: "Mostra/oculta o botao de atalho para voltar para hoje.",
    propsClassStyle: "Customizacao visual no container interno do calendario.",
    propsCard: "Configura titulo e props do SgCard do gadget."
  },
  "pt-PT": {
    subtitle: "Calendario mensal em formato de gadget, com card arrastavel/recolhivel e suporte a locale.",
    section1Title: "1) Basico (mes atual)",
    section1Description: "Configuracao inicial com data selecionada e persistencia de posicao no card.",
    section2Title: "2) Selecionado controlado + limite de datas",
    section2Description: "Controlo externo de valor, bloqueio de fins de semana e limite minimo/maximo.",
    section3Title: "3) Locale + multiplos meses",
    section3Description: "Alterna locale, primeiro dia da semana e quantidade de meses (numberOfMonths, monthsPerLine=3).",
    section4Title: "4) Playground (SgPlayground)",
    section4Description: "Teste interativo das principais props do SgCalendar.",
    playgroundTitle: "SgCalendar Playground",
    propsValue: "Valor selecionado (controlado ou inicial) e callback de alteracao.",
    propsView: "Mes visivel (controlado ou inicial) e callback de navegacao.",
    propsLocale: "Locale usado para formatar mes, data selecionada e labels dos dias.",
    propsWeekStart: "Define o primeiro dia da semana (0=domingo, 1=segunda...).",
    propsWeekdayFormat: "Formato textual dos dias da semana (narrow, short, long).",
    propsNumberOfMonths: "Quantidade de meses visiveis no componente (de 1 a 12).",
    propsMonthsPerLine: "Quantidade de meses por linha antes de quebrar para a linha seguinte.",
    propsMonthMinWidth: "Largura minima de cada mes (numero em px ou string CSS, ex.: 280 ou 18rem).",
    propsAdjacent: "Mostra/oculta dias de meses adjacentes na grelha.",
    propsMinMax: "Limites minimo e maximo para selecao de data.",
    propsDisabled: "Regra adicional para desativar datas especificas.",
    propsTodayShortcut: "Mostra/oculta o botao de atalho para voltar a hoje.",
    propsClassStyle: "Customizacao visual no contentor interno do calendario.",
    propsCard: "Configura titulo e props do SgCard do gadget."
  },
  "en-US": {
    subtitle: "Monthly calendar gadget with a draggable/collapsible card and locale support.",
    section1Title: "1) Basic (current month)",
    section1Description: "Initial setup with selected date and card position persistence.",
    section2Title: "2) Controlled selection + date range",
    section2Description: "External value control, weekend blocking, and min/max limits.",
    section3Title: "3) Locale + multi-month",
    section3Description: "Switch locale, week start, and month count (numberOfMonths, monthsPerLine=3).",
    section4Title: "4) Playground (SgPlayground)",
    section4Description: "Interactive test for the main SgCalendar props.",
    playgroundTitle: "SgCalendar Playground",
    propsValue: "Selected value (controlled or initial) and change callback.",
    propsView: "Visible month (controlled or initial) and navigation callback.",
    propsLocale: "Locale used to format month, selected date, and weekday labels.",
    propsWeekStart: "Sets first day of week (0=Sunday, 1=Monday...).",
    propsWeekdayFormat: "Weekday textual format (narrow, short, long).",
    propsNumberOfMonths: "Amount of visible months in the component (from 1 to 12).",
    propsMonthsPerLine: "How many months are rendered per row before wrapping.",
    propsMonthMinWidth: "Minimum width of each month (number as px or CSS string, e.g. 280 or 18rem).",
    propsAdjacent: "Shows/hides adjacent-month days in the grid.",
    propsMinMax: "Minimum and maximum selectable date.",
    propsDisabled: "Additional rule to disable specific dates.",
    propsTodayShortcut: "Shows/hides the shortcut button to jump to today.",
    propsClassStyle: "Visual customization on the internal calendar container.",
    propsCard: "Configures gadget card title and SgCard props."
  },
  es: {
    subtitle: "Calendario mensual en formato gadget, con card draggable/collapsible y soporte de locale.",
    section1Title: "1) Basico (mes actual)",
    section1Description: "Configuracion inicial con fecha seleccionada y persistencia de posicion del card.",
    section2Title: "2) Seleccion controlada + rango de fechas",
    section2Description: "Control externo del valor, bloqueo de fines de semana y limites min/max.",
    section3Title: "3) Locale + multi mes",
    section3Description: "Alterna locale, primer dia de la semana y cantidad de meses (numberOfMonths, monthsPerLine=3).",
    section4Title: "4) Playground (SgPlayground)",
    section4Description: "Prueba interactiva de las props principales de SgCalendar.",
    playgroundTitle: "SgCalendar Playground",
    propsValue: "Valor seleccionado (controlado o inicial) y callback de cambio.",
    propsView: "Mes visible (controlado o inicial) y callback de navegacion.",
    propsLocale: "Locale usado para formatear mes, fecha seleccionada y dias de semana.",
    propsWeekStart: "Define el primer dia de la semana (0=domingo, 1=lunes...).",
    propsWeekdayFormat: "Formato textual de los dias (narrow, short, long).",
    propsNumberOfMonths: "Cantidad de meses visibles en el componente (de 1 a 12).",
    propsMonthsPerLine: "Cantidad de meses por fila antes de hacer salto de linea.",
    propsMonthMinWidth: "Ancho minimo de cada mes (numero en px o string CSS, ej.: 280 o 18rem).",
    propsAdjacent: "Muestra/oculta dias de meses adyacentes en la grilla.",
    propsMinMax: "Limites minimo y maximo para seleccion de fecha.",
    propsDisabled: "Regla adicional para deshabilitar fechas especificas.",
    propsTodayShortcut: "Muestra/oculta el boton para volver a hoy.",
    propsClassStyle: "Customizacion visual en el contenedor interno del calendario.",
    propsCard: "Configura titulo y props del SgCard del gadget."
  }
};

function isSupportedLocale(locale: ShowcaseLocale): locale is keyof typeof CALENDAR_TEXTS {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}

function BasicCalendarExample() {
  return (
    <SgCalendar
      locale="pt-BR"
      defaultValue="2026-03-10"
      defaultViewDate="2026-03-01"
      cardTitle="Calendario base"
      cardProps={{ id: "showcase-calendar-basic", dragPersistKey: "showcase-calendar-basic" }}
    />
  );
}

function ControlledCalendarExample() {
  const [selected, setSelected] = React.useState(new Date(2026, 2, 10));
  const selectedText = React.useMemo(
    () => selected.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }),
    [selected]
  );
  const minDate = React.useMemo(() => new Date(2026, 2, 5), []);
  const maxDate = React.useMemo(() => new Date(2026, 2, 25), []);

  return (
    <div className="space-y-2">
      <SgCalendar
        value={selected}
        onValueChange={setSelected}
        locale="pt-BR"
        minDate={minDate}
        maxDate={maxDate}
        isDateDisabled={(date) => date.getDay() === 0 || date.getDay() === 6}
        cardTitle="Agenda de visitas"
        cardProps={{ id: "showcase-calendar-range", dragPersistKey: "showcase-calendar-range" }}
      />
      <p className="text-sm text-muted-foreground">Selecionado: {selectedText}</p>
    </div>
  );
}

function LocaleCalendarExample() {
  const [locale, setLocale] = React.useState<"pt-BR" | "en-US" | "es">("pt-BR");
  const [weekStartsOn, setWeekStartsOn] = React.useState<0 | 1>(0);
  const [numberOfMonths, setNumberOfMonths] = React.useState(6);

  return (
    <div className="space-y-3">
      <SgGrid columns={{ base: 2, md: 5 }} gap={8}>
        <SgButton appearance={locale === "pt-BR" ? "solid" : "outline"} onClick={() => setLocale("pt-BR")}>pt-BR</SgButton>
        <SgButton appearance={locale === "en-US" ? "solid" : "outline"} onClick={() => setLocale("en-US")}>en-US</SgButton>
        <SgButton appearance={locale === "es" ? "solid" : "outline"} onClick={() => setLocale("es")}>es</SgButton>
        <SgButton appearance={weekStartsOn === 0 ? "solid" : "outline"} onClick={() => setWeekStartsOn(0)}>Sunday first</SgButton>
        <SgButton appearance={weekStartsOn === 1 ? "solid" : "outline"} onClick={() => setWeekStartsOn(1)}>Monday first</SgButton>
      </SgGrid>

      <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
        <SgButton appearance={numberOfMonths === 1 ? "solid" : "outline"} onClick={() => setNumberOfMonths(1)}>1 month</SgButton>
        <SgButton appearance={numberOfMonths === 3 ? "solid" : "outline"} onClick={() => setNumberOfMonths(3)}>3 months</SgButton>
        <SgButton appearance={numberOfMonths === 6 ? "solid" : "outline"} onClick={() => setNumberOfMonths(6)}>6 months</SgButton>
        <SgButton appearance={numberOfMonths === 12 ? "solid" : "outline"} onClick={() => setNumberOfMonths(12)}>12 months</SgButton>
      </SgGrid>

      <SgCalendar
        locale={locale}
        weekStartsOn={weekStartsOn}
        numberOfMonths={numberOfMonths}
        monthsPerLine={3}
        defaultValue="2026-03-10"
        defaultViewDate="2026-03-01"
        cardTitle="Calendar i18n + multi month"
        cardProps={{ id: "showcase-calendar-i18n", dragPersistKey: "showcase-calendar-i18n" }}
      />
    </div>
  );
}

export default function SgCalendarPage() {
  const i18n = useShowcaseI18n();
  const locale: keyof typeof CALENDAR_TEXTS = isSupportedLocale(i18n.locale) ? i18n.locale : "en-US";
  const texts = CALENDAR_TEXTS[locale];
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();

  const calendarProps: ShowcasePropRow[] = React.useMemo(
    () => [
      { prop: "value / defaultValue / onValueChange", type: "Date | string / Date | string / callback", defaultValue: "today / today / -", description: texts.propsValue },
      { prop: "viewDate / defaultViewDate / onViewDateChange", type: "Date | string / Date | string / callback", defaultValue: "selected month / selected month / -", description: texts.propsView },
      { prop: "locale", type: "string", defaultValue: '"pt-BR"', description: texts.propsLocale },
      { prop: "weekStartsOn", type: "0 | 1 | 2 | 3 | 4 | 5 | 6", defaultValue: "0", description: texts.propsWeekStart },
      { prop: "weekdayFormat", type: '"narrow" | "short" | "long"', defaultValue: '"narrow"', description: texts.propsWeekdayFormat },
      { prop: "numberOfMonths", type: "number", defaultValue: "1", description: texts.propsNumberOfMonths },
      { prop: "monthsPerLine", type: "number", defaultValue: "3", description: texts.propsMonthsPerLine },
      { prop: "monthMinWidth", type: "number | string", defaultValue: "auto", description: texts.propsMonthMinWidth },
      { prop: "showAdjacentMonths", type: "boolean", defaultValue: "true", description: texts.propsAdjacent },
      { prop: "minDate / maxDate", type: "Date | string", defaultValue: "-", description: texts.propsMinMax },
      { prop: "isDateDisabled", type: "(date: Date) => boolean", defaultValue: "-", description: texts.propsDisabled },
      { prop: "showTodayShortcut", type: "boolean", defaultValue: "true", description: texts.propsTodayShortcut },
      { prop: "className / style", type: "string / CSSProperties", defaultValue: "-", description: texts.propsClassStyle },
      { prop: "cardTitle / cardProps", type: 'ReactNode / Omit<SgCardProps, "children" | "title">', defaultValue: '"Calendar/Calendario" / -', description: texts.propsCard }
    ],
    [texts]
  );

  return (
    <I18NReady>
      <SgEnvironmentProvider
        value={{
          namespaceProvider: { getNamespace: () => "showcase" },
          persistence: { scope: "app:showcase", mode: "fallback", stateVersion: 1 }
        }}
      >
        <div
          ref={pageRef}
          className="max-w-5xl space-y-8"
          style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
        >
          <ShowcaseStickyHeader
            stickyHeaderRef={stickyHeaderRef}
            title="SgCalendar"
            subtitle={texts.subtitle}
            exampleLinks={exampleLinks}
            onAnchorClick={handleAnchorClick}
          />

          <Section title={texts.section1Title} description={texts.section1Description}>
            <BasicCalendarExample />
            <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/gadgets/sg-calendar/samples/basico-mes-atual.tsx.sample" />
          </Section>

          <Section title={texts.section2Title} description={texts.section2Description}>
            <ControlledCalendarExample />
            <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/gadgets/sg-calendar/samples/selecionado-controlado-limite-de-datas.tsx.sample" />
          </Section>

          <Section title={texts.section3Title} description={texts.section3Description}>
            <LocaleCalendarExample />
            <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/gadgets/sg-calendar/samples/locale-multiplos-meses.tsx.sample" />
          </Section>

          <Section title={texts.section4Title} description={texts.section4Description}>
            <SgPlayground
              title={texts.playgroundTitle}
              interactive
              codeContract="appFile"
              playgroundFile="apps/showcase/src/app/components/gadgets/sg-calendar/sg-calendar.tsx.playground"
              height={640}
              defaultOpen
            />
          </Section>

          <ShowcasePropsReference rows={calendarProps} />
          <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
        </div>
      </SgEnvironmentProvider>
    </I18NReady>
  );
}

