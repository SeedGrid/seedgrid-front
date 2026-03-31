export { SgInputText } from "./inputs/SgInputText";
export type { SgInputTextProps } from "./inputs/SgInputText";
export { SgInputNumber } from "./inputs/SgInputNumber";
export type { SgInputNumberProps } from "./inputs/SgInputNumber";
export { SgInputCurrency, SgCurrencyEdit } from "./inputs/SgInputCurrency";
export type { SgInputCurrencyProps, SgCurrencyEditProps } from "./inputs/SgInputCurrency";
export { SgInputTextArea } from "./inputs/SgInputTextArea";
export type { SgInputTextAreaProps } from "./inputs/SgInputTextArea";
export { SgInputSelect } from "./inputs/SgInputSelect";
export type { SgInputSelectProps } from "./inputs/SgInputSelect";
export { SgInputCPF } from "./inputs/SgInputCPF";
export type { SgInputCPFProps } from "./inputs/SgInputCPF";
export { SgInputCNPJ } from "./inputs/SgInputCNPJ";
export type { SgInputCNPJProps } from "./inputs/SgInputCNPJ";
export { SgInputCPFCNPJ } from "./inputs/SgInputCPFCNPJ";
export type { SgInputCPFCNPJProps } from "./inputs/SgInputCPFCNPJ";
export { SgInputPostalCode } from "./inputs/SgInputPostalCode";
export type { SgInputPostalCodeProps, PostalCodeCountry, ViaCepResponse } from "./inputs/SgInputPostalCode";
export { SgInputPhone } from "./inputs/SgInputPhone";
export type { SgInputPhoneProps } from "./inputs/SgInputPhone";
export { SgInputEmail } from "./inputs/SgInputEmail";
export { SgInputPassword } from "./inputs/SgInputPassword";
export { SgInputOTP } from "./inputs/SgInputOTP";
export type { SgInputOTPProps, SgInputOTPRef } from "./inputs/SgInputOTP";
export { SgSlider } from "./inputs/SgSlider";
export type { SgSliderProps } from "./inputs/SgSlider";
export { SgStepperInput } from "./inputs/SgStepperInput";
export type { SgStepperInputProps } from "./inputs/SgStepperInput";
export { SgInputDate } from "./inputs/SgInputDate";
export { SgInputBirthDate } from "./inputs/SgInputBirthDate";
export { SgToggleSwitch, SgSwitch } from "./inputs/SgToggleSwitch";
export type { SgToggleSwitchProps, SgSwitchProps } from "./inputs/SgToggleSwitch";
export { SgAutocomplete } from "./inputs/SgAutocomplete";
export type { SgAutocompleteItem, SgAutocompleteProps } from "./inputs/SgAutocomplete";
export { SgCombobox } from "./inputs/SgCombobox";
export type { SgComboboxProps, SgComboboxSource } from "./inputs/SgCombobox";
export { SgTextEditor } from "./inputs/SgTextEditor";
export type { SgTextEditorProps, SgTextEditorSaveMeta } from "./inputs/SgTextEditor";
export { SgRating } from "./inputs/SgRating";
export type { SgRatingProps, SgRatingSize } from "./inputs/SgRating";
export { SgRadioGroup } from "./inputs/SgRadioGroup";
export type { SgRadioGroupProps, SgRadioGroupOption, SgRadioGroupOrientation, SgRadioGroupSelectionStyle } from "./inputs/SgRadioGroup";
export { SgCheckboxGroup } from "./inputs/SgCheckboxGroup";
export type { SgCheckboxGroupProps, SgCheckboxGroupOption, SgCheckboxGroupOrientation, SgCheckboxGroupSelectionStyle, SgCheckboxGroupRef } from "./inputs/SgCheckboxGroup";
export { SgOrderList } from "./inputs/SgOrderList";
export type {
  SgOrderListProps,
  SgOrderListItem,
  SgOrderListSelectionMode,
  SgOrderListControlsPosition,
  SgOrderListRef
} from "./inputs/SgOrderList";
export { SgPickList } from "./inputs/SgPickList";
export type {
  SgPickListProps,
  SgPickListItem,
  SgPickListListName,
  SgPickListSelectionMode,
  SgPickListFilterMatchMode,
  SgPickListChangeType,
  SgPickListValue,
  SgPickListChangeEvent,
  SgPickListRef
} from "./inputs/SgPickList";
export { SgDatatable } from "./inputs/SgDatatable";
export type {
  SgDatatableProps,
  SgDatatableRow,
  SgDatatableColumn,
  SgDatatableColumnAlign,
  SgDatatableCellMeta,
  SgDatatableFilterEvent,
  SgDatatableFilterMatchMode,
  SgDatatablePageEvent,
  SgDatatableRef,
  SgDatatableSelection,
  SgDatatableSelectionMode,
  SgDatatableSortEvent,
  SgDatatableSortOrder
} from "./inputs/SgDatatable";
export { SgButton } from "./buttons/SgButton";
export type { SgButtonProps, SgButtonCustomColors } from "./buttons/SgButton";
export { SgSplitButton } from "./buttons/SgSplitButton";
export type { SgSplitButtonProps, SgSplitButtonItem } from "./buttons/SgSplitButton";
export { SgFloatActionButton } from "./buttons/SgFloatActionButton";
export type {
  SgFloatActionButtonProps, SgFABAction,
  FABPosition, FABSeverity, FABSize, FABShape, FABElevation, FABAnimation, FABAnimationTrigger, FABLayoutType
} from "./buttons/SgFloatActionButton";
export { SgDockMenu } from "./menus/SgDockMenu";
export type { SgDockMenuProps, SgDockMenuItem, SgDockMenuPosition, SgDockMenuOrientation } from "./menus/SgDockMenu";
export { SgToaster } from "./commons/SgToaster";
export type {
  SgToasterProps,
  SgToasterPosition,
  SgToasterTypeColors,
  SgToasterCustomColors
} from "./commons/SgToaster";
export { SgToastHost } from "./commons/SgToastHost";
export type { SgToastHostProps } from "./commons/SgToastHost";
export { SgWhistleHost } from "./commons/SgWhistleHost";
export type { SgWhistleHostProps } from "./commons/SgWhistleHost";
export { buildFabStorageKey, parseStoredFabDragPosition } from "./buttons/fab-helpers";
export { buildDockMenuStorageKey, buildToolbarStorageKey, parseStoredPanelDragPosition } from "./layout/drag-position";
export { buildToolbarLayoutState, resolveToolbarDockOrientationDirection, resolveToolbarOrientationDirection } from "./layout/toolbar-logic";
export { buildDockMenuContainerStyle, buildDockMenuContextMenuState, buildDockMenuItemMotion, buildDockMenuLabelStyle, buildDockMenuLayout, resolveDockMenuLiftDirection, resolveDockMenuOrientation } from "./menus/dock-menu-logic";
export { getActiveHostId, hasAnyHost, nextHostId, registerHost, subscribeHostRegistry, unregisterHost } from "./commons/sgToastHostRegistry";
export { SgPopup } from "./overlay/SgPopup";
export type {
  SgPopupProps,
  SgPopupAction,
  SgPopupPlacement,
  SgPopupPreferPlacement,
  SgPopupAlign,
  SgPopupSeverity
} from "./overlay/SgPopup";
export { SgDialog } from "./overlay/SgDialog";
export type {
  SgDialogProps,
  SgDialogSize,
  SgDialogSeverity,
  SgDialogAnimation
} from "./overlay/SgDialog";
export { SgConfirmationDialog } from "./overlay/SgConfirmationDialog";
export type {
  SgConfirmationDialogProps,
  SgConfirmationDialogButtonConfig
} from "./overlay/SgConfirmationDialog";
export { SgBadge } from "./commons/SgBadge";
export { SgBadgeOverlay } from "./commons/SgBadgeOverlay";
export { SgSkeleton } from "./commons/SgSkeleton";
export { SgAvatar, SgAvatarGroup } from "./commons/SgAvatar";
export type {
  SgBadgeProps,
  SgBadgeSeverity,
  SgBadgeVariant,
  SgBadgeSize,
  SgBadgeCustomColors,
  SgBadgePartsClassName
} from "./commons/SgBadge";
export type { SgBadgeOverlayProps, SgBadgeOverlayPlacement } from "./commons/SgBadgeOverlay";
export type { SgSkeletonProps, SgSkeletonAnimation, SgSkeletonShape } from "./commons/SgSkeleton";
export type {
  SgAvatarProps,
  SgAvatarGroupProps,
  SgAvatarSeverity,
  SgAvatarShape,
  SgAvatarSize,
  SgAvatarCustomColors,
  SgAvatarGroupOverlap
} from "./commons/SgAvatar";
export { toast, dismissSgToast, subscribeSgToasts } from "./commons/SgToast";
export type {
  SgToastFn,
  SgToastId,
  SgToastType,
  SgToastAction,
  SgToastOptions,
  SgToastRecord,
  SgToastPromiseMessages
} from "./commons/SgToast";
export { sgWhistle, dismissSgWhistle, subscribeSgWhistles } from "./commons/SgWhistle";
export type {
  SgWhistleId,
  SgWhistleSeverity,
  SgWhistleBorderStyle,
  SgWhistleAction,
  SgWhistleOptions,
  SgWhistleCustomOptions,
  SgWhistleRecord,
  SgWhistlePromiseStates
} from "./commons/SgWhistle";
export {
  onlyDigits,
  maskCpf,
  maskCnpj,
  maskCpfCnpj,
  maskCep,
  maskPostalCodeBR,
  maskPostalCodePT,
  maskPostalCodeUS,
  maskPostalCodeES,
  maskPostalCodeUY,
  maskPostalCodeAR,
  maskPostalCodePY,
  maskPhone
} from "./masks";
export {
  isValidCpf,
  isValidCnpj,
  isValidEmail,
  isBlockedEmailDomain,
  getBlockedEmailDomains,
  DEFAULT_BLOCKED_EMAIL_DOMAINS,
  validatePassword,
  validateBirthDate,
  isDateAfter,
  isDateBefore
} from "./validators";
export type { PasswordPolicy, BirthDatePolicy } from "./validators";
export { SgGroupBox } from "./layout/SgGroupBox";
export type { SgGroupBoxProps } from "./layout/SgGroupBox";
export { SgScreen } from "./layout/SgScreen";
export type { SgScreenProps } from "./layout/SgScreen";
export { SgPanel } from "./layout/SgPanel";
export type {
  SgPanelProps,
  SgPanelAlign,
  SgPanelBorderStyle,
  SgPanelScrollable,
  SgPanelPercent
} from "./layout/SgPanel";
export { SgGrid } from "./layout/SgGrid";
export type { SgGridProps, SgGridColumns } from "./layout/SgGrid";
export { SgStack } from "./layout/SgStack";
export type { SgStackProps } from "./layout/SgStack";
export { SgCard } from "./layout/SgCard";
export type { SgCardProps, SgCardVariant, SgCardSize, SgCardPosition } from "./layout/SgCard";
export { SgAccordion } from "./layout/SgAccordion";
export type { SgAccordionProps, SgAccordionItem, SgAccordionOrientation } from "./layout/SgAccordion";
export { SgCarousel } from "./layout/SgCarousel";
export type { SgCarouselProps, SgCarouselOrientation } from "./layout/SgCarousel";
export { SgExpandablePanel } from "./layout/SgExpandablePanel";
export type {
  SgExpandablePanelProps,
  SgExpandablePanelDirection,
  SgExpandablePanelPlacement,
  SgExpandablePanelMode,
  SgExpandablePanelSize,
  SgExpandablePanelAnimation,
  SgExpandablePanelElevation,
  SgExpandablePanelRounded,
  SgExpandablePanelRole
} from "./layout/SgExpandablePanel";
export { SgBreadcrumb } from "./layout/SgBreadcrumb";
export type {
  SgBreadcrumbProps,
  SgBreadcrumbItem,
  SgBreadcrumbSeparator
} from "./layout/SgBreadcrumb";
export { SgPageControl, SgPageControlPage } from "./layout/SgPageControl";
export type { SgPageControlProps, SgPageControlPageProps } from "./layout/SgPageControl";
export { SgMenu } from "./layout/SgMenu";
export { buildMenuMaps, collectMenuSearchEntries, collectParentChain, computeActiveSets, filterMenuNodes, flattenVisibleNodes, mergeExpandedIdsForActivePath, resolveEffectiveActiveId, resolveExpandedIdsToggle, resolveHorizontalDockAlign, resolveMegaMenuActiveNode, resolveMegaMenuHoverActiveId, resolveMegaMenuInteraction, resolveMenuAutocompleteItems, resolveMenuHintPosition, resolveMenuKeyboardAction, resolveMenuLayoutState, resolveMenuNodeActionIntent, resolveMenuSearchSelectionState, resolveTieredActiveState, resolveTieredClickState, resolveTieredHoverIntent, resolveTieredHoverPath, resolveTieredNodeClickIntent } from "./layout/menu-logic";
export type {
  SgMenuProps,
  SgMenuStyle,
  SgMenuNode,
  SgMenuSelection,
  SgMenuBrand,
  SgMenuUser
} from "./layout/SgMenu";
export type { MenuKeyboardAction, MenuVisibleNode, MenuLogicNode } from "./layout/menu-logic";
export { SgToolBar, SgToolbarIconButton } from "./layout/SgToolBar";
export type {
  SgToolBarProps,
  SgToolBarOrientation,
  SgToolBarOrientationDirection,
  SgToolBarSeverity,
  SgToolBarSize,
  SgToolbarIconButtonProps
} from "./layout/SgToolBar";
export { SgDockLayout } from "./layout/SgDockLayout";
export type { SgDockLayoutProps, SgDockLayoutState, SgDockToolbarState, SgDockZoneId } from "./layout/SgDockLayout";
export { SgDockZone } from "./layout/SgDockZone";
export type { SgDockZoneProps } from "./layout/SgDockZone";
export { SgDockScreen } from "./layout/SgDockScreen";
export type { SgDockScreenProps } from "./layout/SgDockScreen";
export { SgTreeView, sgTreeFromJson, sgTreeFromJsonWithChecked } from "./layout/SgTreeView";
export type {
  SgTreeViewProps,
  SgTreeViewRef,
  SgTreeNode,
  SgTreeNodeJson,
  SgTreeIconRegistry,
  SgTreeConfirmBar,
  SgSize,
  SgDensity,
  SgTone
} from "./layout/SgTreeView";
export { SgTimeProvider, useSgTime } from "./gadgets/clock/SgTimeProvider";
export { SgClock } from "./gadgets/clock/SgClock";
export { SgCalendar } from "./gadgets/calendar";
export type { SgTimeContextValue } from "./gadgets/clock/SgTimeProvider";
export type { SgClockProps, SgClockDigitalStyle } from "./gadgets/clock/SgClock";
export type { SgCalendarProps, SgCalendarWeekdayFormat } from "./gadgets/calendar";
export { SgFlipDigit } from "./digits/flip-digit";
export type { SgFlipDigitProps } from "./digits/flip-digit";
export { SgFadeDigit } from "./digits/fade-digit";
export type { SgFadeDigitProps } from "./digits/fade-digit";
export { SgRoller3DDigit } from "./digits/roller3d-digit";
export type { SgRoller3DDigitProps } from "./digits/roller3d-digit";
export { SgMatrixDigit } from "./digits/matrix-digit";
export type { SgMatrixDigitProps } from "./digits/matrix-digit";
export { SgNeonDigit } from "./digits/neon-digit";
export type { SgNeonDigitProps } from "./digits/neon-digit";
export { SgDiscardDigit } from "./digits/discard-digit";
export type { SgDiscardDigitProps, SgDiscardDigitHandle } from "./digits/discard-digit";
export { SgSegmentDigit } from "./digits/segment-digit";
export type { SgSegmentDigitProps } from "./digits/segment-digit";
export { SgSevenSegmentDigit } from "./digits/seven-segment-digit";
export type { SgSevenSegmentDigitProps, SgSevenSegmentDigitPalette } from "./digits/seven-segment-digit";
export { SgStringAnimator, SG_STRING_ANIMATOR_DEFAULT_CHARSET } from "./gadgets/string-animator";
export type {
  SgStringAnimatorProps,
  SgStringAnimatorRef,
  SgStringAnimatorStyle,
  SgStringAnimatorAlign,
} from "./gadgets/string-animator";
export { SgQRCode } from "./gadgets/qr-code";
export type { SgQRCodeProps, SgQRCodeErrorCorrectionLevel } from "./gadgets/qr-code";
export { SgLinearGauge, SgRadialGauge } from "./gadgets/gauge";
export type {
  SgLinearGaugeProps,
  SgLinearGaugeRange,
  SgLinearGaugePointer,
  SgLinearGaugePointerShape,
  SgRadialGaugeProps,
  SgRadialGaugeRange,
  SgRadialGaugePointer,
  SgRadialGaugePointerType,
  SgRadialGaugeMarkerShape,
  SgRadialGaugeAnnotation
} from "./gadgets/gauge";
export {
  registerTheme,
  registerThemes,
  getTheme,
  hasTheme,
  listThemes,
  unregisterTheme,
  clearThemes,
  createThemeResolver,
  SgClockThemeProvider,
  useSgClockThemeResolver,
  ThemeLayer,
  resolveTheme,
  useDarkFlag,
  SgClockThemePicker,
  SgClockThemePreview,
  sgClockThemesBuiltIn
} from "./gadgets/clock/themes";
export type {
  SgClockTheme,
  SgClockThemeRenderArgs,
  SgClockThemeResolveMode,
  SgClockThemeResolver
} from "./gadgets/clock/themes";
export { SgWizard, SgWizardPage } from "./wizard/SgWizard";
export type {
  SgWizardProps,
  SgWizardPageProps,
  SgWizardLabels,
  SgWizardStepper
} from "./wizard/SgWizard";
export {
  canNavigateToWizardStep,
  canProceedWizardAction,
  clampWizardStep
} from "./wizard/logic";
export type { WizardGuardRunner, WizardStepNavigation } from "./wizard/logic";
export { clearLocalPersistentState, readLocalPersistentState, resolvePersistedStateValue, writeLocalPersistentState } from "./environment/persistent-state";
export {
  SgEnvironmentProvider,
  useSgEnvironment,
  useSgNamespaceProvider,
  buildSgPersistenceKey,
  createLocalStorageStrategy,
  createApiPersistenceStrategy,
  createCompositePersistenceStrategy,
  useSgPersistence,
  useSgPersistentState
} from "./environment/SgEnvironmentProvider";
export type {
  NamespaceProvider,
  PersistenceStrategy,
  SgEnvironment,
  SgEnvironmentValue,
  SgPersistenceMode,
  SgPersistenceConfig,
  SgPersistenceRecordDTO
} from "./environment/SgEnvironmentProvider";
export type {
  SeedGridModuleId,
  SeedGridProvider,
  SeedGridNavItem,
  SeedGridRoute,
  SeedGridI18nBundle,
  SeedGridRegistry,
  SeedGridModuleManifest
} from "./integration/module";
export { componentsManifest } from "./manifest";
export {
  SgComponentsI18nProvider,
  setComponentsI18n,
  getComponentsI18n,
  resolveComponentsI18n,
  useComponentsI18n,
  t as tComponents,
  formatMessage as formatComponentsMessage,
  componentsMessagesPtBr,
  componentsMessagesPtPt,
  componentsMessagesEnUs,
  componentsMessagesEn,
  componentsMessagesEs,
  componentsMessagesFr,
  normalizeComponentsLocale,
  getBuiltInComponentsMessages
} from "./i18n";
export type {
  SgComponentsI18n,
  SgComponentsI18nInput,
  SgComponentsLocale,
  SgComponentsMessages,
  SgComponentsMessagesByNamespace
} from "./i18n";







