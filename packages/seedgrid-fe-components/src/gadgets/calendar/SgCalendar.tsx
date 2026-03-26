"use client";

import * as React from "react";
import { SgCard, type SgCardProps } from "../../layout/SgCard";
import { t, useComponentsI18n } from "../../i18n";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function normalizeDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function addDays(date: Date, amount: number): Date {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  next.setDate(next.getDate() + amount);
  return normalizeDate(next);
}

function isValidDate(date: unknown): date is Date {
  return date instanceof Date && Number.isFinite(date.getTime());
}

const DATE_ONLY_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

function parseDateInput(value?: Date | string): Date | null {
  if (value === undefined || value === null) return null;
  if (isValidDate(value)) return normalizeDate(value);

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;

    const dateOnlyMatch = DATE_ONLY_RE.exec(trimmed);
    if (dateOnlyMatch) {
      const year = Number.parseInt(dateOnlyMatch[1] ?? "0", 10);
      const month = Number.parseInt(dateOnlyMatch[2] ?? "1", 10) - 1;
      const day = Number.parseInt(dateOnlyMatch[3] ?? "1", 10);
      const localDate = new Date(year, month, day);
      return isValidDate(localDate) ? normalizeDate(localDate) : null;
    }

    const parsed = new Date(trimmed);
    return isValidDate(parsed) ? normalizeDate(parsed) : null;
  }

  return null;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function clampWeekStart(value: number | undefined): number {
  if (!Number.isFinite(value)) return 0;
  const normalized = Math.trunc(value as number) % 7;
  return normalized < 0 ? normalized + 7 : normalized;
}

function clampInt(value: number | undefined, fallback: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return fallback;
  const numeric = Math.trunc(value as number);
  if (numeric < min) return min;
  if (numeric > max) return max;
  return numeric;
}

function resolveCssLength(value: number | string | undefined, fallback: string): string {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return `${value}px`;
  }
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }
  return fallback;
}

function dateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function capitalizeFirst(value: string, locale: string): string {
  if (!value) return value;
  return value.charAt(0).toLocaleUpperCase(locale) + value.slice(1);
}

export type SgCalendarWeekdayFormat = "narrow" | "short" | "long";

export type SgCalendarProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "onChange"> & {
  value?: Date | string;
  defaultValue?: Date | string;
  onValueChange?: (date: Date) => void;
  viewDate?: Date | string;
  defaultViewDate?: Date | string;
  onViewDateChange?: (viewDate: Date) => void;
  locale?: string;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  weekdayFormat?: SgCalendarWeekdayFormat;
  numberOfMonths?: number;
  monthsPerLine?: number;
  monthMinWidth?: number | string;
  showAdjacentMonths?: boolean;
  minDate?: Date | string;
  maxDate?: Date | string;
  isDateDisabled?: (date: Date) => boolean;
  showTodayShortcut?: boolean;
  cardTitle?: React.ReactNode;
  cardProps?: Omit<SgCardProps, "children" | "title">;
};

export function SgCalendar(props: Readonly<SgCalendarProps>) {
  const i18n = useComponentsI18n();
  const {
    value,
    defaultValue,
    onValueChange,
    viewDate,
    defaultViewDate,
    onViewDateChange,
    locale = "pt-BR",
    weekStartsOn = 0,
    weekdayFormat = "narrow",
    numberOfMonths = 1,
    monthsPerLine = 3,
    monthMinWidth,
    showAdjacentMonths = true,
    minDate,
    maxDate,
    isDateDisabled,
    showTodayShortcut = true,
    className,
    style,
    cardTitle,
    cardProps,
    ...rest
  } = props;
  const resolvedCardTitle = cardTitle ?? t(i18n, "components.gadgets.calendar.title");

  const today = React.useMemo(() => normalizeDate(new Date()), []);
  const valueControlled = value !== undefined;
  const viewControlled = viewDate !== undefined;

  const parsedControlledValue = React.useMemo(() => parseDateInput(value), [value]);
  const parsedMinDate = React.useMemo(() => parseDateInput(minDate), [minDate]);
  const parsedMaxDate = React.useMemo(() => parseDateInput(maxDate), [maxDate]);

  const [internalValue, setInternalValue] = React.useState<Date>(() => {
    const parsedDefault = parseDateInput(defaultValue);
    return parsedDefault ?? today;
  });

  const selectedDate = valueControlled ? parsedControlledValue ?? today : internalValue;

  const [internalViewDate, setInternalViewDate] = React.useState<Date>(() => {
    const parsedDefaultView = parseDateInput(defaultViewDate);
    const parsedDefaultValue = parseDateInput(defaultValue);
    return startOfMonth(parsedDefaultView ?? parsedDefaultValue ?? today);
  });

  const parsedControlledViewDate = React.useMemo(() => parseDateInput(viewDate), [viewDate]);
  const monthViewDate = viewControlled
    ? startOfMonth(parsedControlledViewDate ?? selectedDate)
    : internalViewDate;

  React.useEffect(() => {
    if (viewControlled) return;
    if (!valueControlled) return;
    if (!parsedControlledValue) return;

    setInternalViewDate((current) => {
      if (isSameMonth(current, parsedControlledValue)) return current;
      return startOfMonth(parsedControlledValue);
    });
  }, [parsedControlledValue, valueControlled, viewControlled]);

  const safeWeekStartsOn = clampWeekStart(weekStartsOn);
  const safeNumberOfMonths = clampInt(numberOfMonths, 1, 1, 12);
  const safeMonthsPerLine = Math.min(
    safeNumberOfMonths,
    clampInt(monthsPerLine, 3, 1, 12)
  );
  const uiLabels = React.useMemo(
    () => ({
      previousMonth: t(i18n, "components.gadgets.calendar.previousMonth"),
      nextMonth: t(i18n, "components.gadgets.calendar.nextMonth"),
      goToday: t(i18n, "components.gadgets.calendar.goToday")
    }),
    [i18n]
  );

  const formatSelectedDate = React.useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        weekday: "long",
        day: "numeric",
        month: "long"
      }),
    [locale]
  );

  const formatMonthYear = React.useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        month: "long",
        year: "numeric"
      }),
    [locale]
  );

  const weekdayLabels = React.useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale, { weekday: weekdayFormat });
    const sundayAnchor = new Date(2026, 2, 1);
    return Array.from({ length: 7 }, (_, index) => {
      const weekDay = (safeWeekStartsOn + index) % 7;
      const dayDate = addDays(sundayAnchor, weekDay);
      const raw = formatter.format(dayDate);
      return capitalizeFirst(raw, locale);
    });
  }, [locale, safeWeekStartsOn, weekdayFormat]);

  const setMonthViewDate = React.useCallback(
    (next: Date) => {
      const normalized = startOfMonth(next);
      if (!viewControlled) {
        setInternalViewDate(normalized);
      }
      onViewDateChange?.(new Date(normalized));
    },
    [onViewDateChange, viewControlled]
  );

  const isCellDisabled = React.useCallback(
    (date: Date) => {
      if (parsedMinDate && date.getTime() < parsedMinDate.getTime()) return true;
      if (parsedMaxDate && date.getTime() > parsedMaxDate.getTime()) return true;
      if (isDateDisabled?.(date)) return true;
      return false;
    },
    [isDateDisabled, parsedMaxDate, parsedMinDate]
  );

  const handleSelectDate = React.useCallback(
    (date: Date) => {
      if (isCellDisabled(date)) return;
      if (!valueControlled) {
        setInternalValue(date);
      }
      onValueChange?.(new Date(date));

      if (!isSameMonth(date, monthViewDate)) {
        setMonthViewDate(date);
      }
    },
    [isCellDisabled, monthViewDate, onValueChange, setMonthViewDate, valueControlled]
  );

  const handleGoToday = React.useCallback(() => {
    const now = normalizeDate(new Date());
    if (!isCellDisabled(now)) {
      if (!valueControlled) {
        setInternalValue(now);
      }
      onValueChange?.(new Date(now));
    }
    setMonthViewDate(now);
  }, [isCellDisabled, onValueChange, setMonthViewDate, valueControlled]);

  const monthDates = React.useMemo(
    () => Array.from({ length: safeNumberOfMonths }, (_, index) => addMonths(monthViewDate, index)),
    [monthViewDate, safeNumberOfMonths]
  );
  const selectedLabel = capitalizeFirst(formatSelectedDate.format(selectedDate), locale);
  const visibleColumns = Math.min(safeMonthsPerLine, safeNumberOfMonths);
  const monthColumnMinWidth = resolveCssLength(
    monthMinWidth,
    visibleColumns === 1 ? "20.75rem" : "16rem"
  );
  const monthGridStyle: React.CSSProperties = {
    gridTemplateColumns: `repeat(${visibleColumns}, minmax(${monthColumnMinWidth}, 1fr))`,
    width: visibleColumns === 1 ? "max-content" : "100%"
  };
  const mergedCardClassName = cn("max-w-full", cardProps?.className);
  const mergedCardBodyClassName = cn("max-h-full max-w-full overflow-auto", cardProps?.bodyClassName);
  const mergedCardStyle: React.CSSProperties = {
    width: "fit-content",
    maxWidth: "100%",
    ...(cardProps?.style ?? {})
  };

  return (
    <SgCard
      title={resolvedCardTitle}
      collapsible
      defaultOpen
      collapseToggleAlign="right"
      collapseIconSize={20}
      draggable
      bgColor="rgb(var(--sg-surface,var(--sg-bg)))"
      bgColorTitle="rgb(var(--sg-surface-2,var(--sg-surface,var(--sg-bg))))"
      cardStyle="outlined"
      {...cardProps}
      className={mergedCardClassName}
      bodyClassName={mergedCardBodyClassName}
      style={mergedCardStyle}
    >
      <div
        className={cn(
          "inline-flex max-w-full select-none flex-col gap-3",
          className
        )}
        style={style}
        {...rest}
      >
        <div className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-background px-4 py-3">
          <div className="min-h-6 text-sm font-medium text-foreground">{selectedLabel}</div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setMonthViewDate(addMonths(monthViewDate, -1))}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={uiLabels.previousMonth}
              title={uiLabels.previousMonth}
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
                <path d="m12.5 5.8-4.2 4.2 4.2 4.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setMonthViewDate(addMonths(monthViewDate, 1))}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={uiLabels.nextMonth}
              title={uiLabels.nextMonth}
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
                <path d="m7.5 5.8 4.2 4.2-4.2 4.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {showTodayShortcut ? (
              <button
                type="button"
                onClick={handleGoToday}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border/70 bg-muted/40 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label={uiLabels.goToday}
                title={uiLabels.goToday}
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
                  <path d="M5.6 7.6 10 12l4.4-4.4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ) : null}
          </div>
        </div>

        <div className="max-h-full max-w-full overflow-auto">
          <div
            className="grid gap-4"
            style={monthGridStyle}
          >
            {monthDates.map((monthDate) => {
              const firstDayOfMonth = startOfMonth(monthDate);
              const firstDayOffset = (firstDayOfMonth.getDay() - safeWeekStartsOn + 7) % 7;
              const gridStart = addDays(firstDayOfMonth, -firstDayOffset);
              const days = Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
              const monthLabel = capitalizeFirst(formatMonthYear.format(monthDate), locale);

              return (
                <div key={`${monthDate.getFullYear()}-${monthDate.getMonth()}`} className="rounded-xl border border-border/70 bg-background">
                  <div className="border-b border-border/70 px-4 py-3">
                    <div className="text-[1.1rem] font-semibold text-foreground">{monthLabel}</div>
                  </div>

                  <div className="px-4 pb-4 pt-3">
                    <div className="mb-2 grid grid-cols-7 text-center text-[0.79rem] font-medium uppercase tracking-wide text-muted-foreground">
                      {weekdayLabels.map((label, index) => (
                        <span key={`${label}-${index}`} className="py-1">
                          {label}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-y-1">
                      {days.map((day) => {
                        const inCurrentMonth = isSameMonth(day, monthDate);
                        const hiddenAdjacentDay = !showAdjacentMonths && !inCurrentMonth;
                        const disabled = isCellDisabled(day);
                        const selected = isSameDay(day, selectedDate) && inCurrentMonth;
                        const isToday = isSameDay(day, today) && inCurrentMonth;

                        if (hiddenAdjacentDay) {
                          return (
                            <span
                              key={`${dateKey(day)}-blank`}
                              className="mx-auto inline-flex h-10 w-10"
                              aria-hidden="true"
                            />
                          );
                        }

                        return (
                          <button
                            key={dateKey(day)}
                            type="button"
                            onClick={() => handleSelectDate(day)}
                            disabled={disabled}
                            className={cn(
                              "mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors",
                              selected
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "hover:bg-muted",
                              inCurrentMonth ? "text-foreground" : "text-muted-foreground",
                              disabled ? "cursor-not-allowed opacity-40" : "",
                              isToday && !selected ? "ring-1 ring-primary/45 ring-offset-1 ring-offset-background" : ""
                            )}
                            aria-pressed={selected}
                          >
                            {day.getDate()}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SgCard>
  );
}

SgCalendar.displayName = "SgCalendar";
