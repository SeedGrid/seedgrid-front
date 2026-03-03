"use client";

import React from "react";
import {
  SgToaster,
  SgComponentsI18nProvider,
  setComponentsI18n,
  componentsMessagesPtBr,
  componentsMessagesPtPt,
  componentsMessagesEnUs,
  componentsMessagesEs,
  SgDockScreen,
  SgDockZone,
  SgMenu,
  SgToolBar,
  SgToolbarIconButton,
  type SgMenuNode
} from "@seedgrid/fe-components";
import {
  ShowcaseI18nProvider,
  setShowcaseI18n,
  t,
  showcaseMessagesEnUs,
  showcaseMessagesEs,
  showcaseMessagesPtBr,
  showcaseMessagesPtPt,
  type ShowcaseLocale
} from "../i18n";
import { ThemeEditor } from "./ThemeEditor";
import { usePathname, useRouter } from "next/navigation";

const COMPONENTS = [
  { group: "Inputs", slug: "sg-input-text", label: "SgInputText" },
  { group: "Inputs", slug: "sg-input-number", label: "SgInputNumber" },
  { group: "Inputs", slug: "sg-currency-edit", label: "SgCurrencyEdit" },
  { group: "Inputs", slug: "sg-input-text-area", label: "SgInputTextArea" },
  { group: "Inputs", slug: "sg-input-password", label: "SgInputPassword" },
  { group: "Inputs", slug: "sg-input-otp", label: "SgInputOTP" },
  { group: "Inputs", slug: "sg-input-date", label: "SgInputDate" },
  { group: "Inputs", slug: "sg-input-birth-date", label: "SgInputBirthDate" },
  { group: "Inputs", slug: "sg-toggle-switch", label: "SgToggleSwitch" },
  { group: "Inputs", slug: "sg-input-email", label: "SgInputEmail" },
  { group: "Inputs", slug: "sg-input-cpf", label: "SgInputCPF" },
  { group: "Inputs", slug: "sg-input-cnpj", label: "SgInputCNPJ" },
  { group: "Inputs", slug: "sg-input-cpf-cnpj", label: "SgInputCPFCNPJ" },
  { group: "Inputs", slug: "sg-input-postal-code", label: "SgInputPostalCode" },
  { group: "Inputs", slug: "sg-input-phone", label: "SgInputPhone" },
  { group: "Inputs", slug: "sg-autocomplete", label: "SgAutocomplete" },
  { group: "Inputs", slug: "sg-combobox", label: "SgCombobox" },
  { group: "Inputs", slug: "sg-slider", label: "SgSlider" },
  { group: "Inputs", slug: "sg-stepper-input", label: "SgStepperInput" },
  { group: "Inputs", slug: "sg-text-editor", label: "SgTextEditor" },
  { group: "Inputs", slug: "sg-rating", label: "SgRating" },
  { group: "Inputs", slug: "sg-radio-group", label: "SgRadioGroup" },
  { group: "Buttons", slug: "sg-button", label: "SgButton" },
  { group: "Buttons", slug: "sg-split-button", label: "SgSplitButton" },
  { group: "Buttons", slug: "sg-float-action-button", label: "SgFloatActionButton" },
  { group: "Menus", slug: "sg-dock-menu", label: "SgDockMenu" },
  { group: "Menus", slug: "sg-breadcrumb", label: "SgBreadcrumb" },
  { group: "Menus", slug: "sg-menu", label: "SgMenu" },
  { group: "Utils", slug: "sg-environment-provider", label: "SgEnvironmentProvider" },
  { group: "Layout", slug: "sg-group-box", label: "SgGroupBox" },
  { group: "Layout", slug: "sg-card", label: "SgCard" },
  { group: "Layout", slug: "sg-accordion", label: "SgAccordion" },
  { group: "Layout", slug: "sg-carousel", label: "SgCarousel" },
  { group: "Layout", slug: "sg-skeleton", label: "SgSkeleton" },
  { group: "Layout", slug: "sg-screen", label: "SgScreen" },
  { group: "Layout", slug: "sg-dock-screen", label: "SgDockScreen" },
  { group: "Layout", slug: "sg-main-panel", label: "SgMainPanel" },
  { group: "Layout", slug: "sg-panel", label: "SgPanel" },
  { group: "Layout", slug: "sg-grid", label: "SgGrid" },
  { group: "Layout", slug: "sg-stack", label: "SgStack" },
  { group: "Layout", slug: "sg-badge", label: "SgBadge" },
  { group: "Layout", slug: "sg-badge-overlay", label: "SgBadgeOverlay" },
  { group: "Layout", slug: "sg-popup", label: "SgPopup" },
  { group: "Layout", slug: "sg-dialog", label: "SgDialog" },
  { group: "Layout", slug: "sg-toolbar", label: "SgToolBar" },
  { group: "Layout", slug: "sg-dock-layout", label: "SgDockLayout" },
  { group: "Layout", slug: "sg-tree-view", label: "SgTreeView" },
  { group: "Layout", slug: "sg-avatar", label: "SgAvatar" },
  { group: "Layout", slug: "sg-expandable-panel", label: "SgExpandablePanel" },
  { group: "Layout", slug: "sg-page-control", label: "SgPageControl" },
  { group: "Digits", slug: "digits/sg-flip-digit", label: "SgFlipDigit" },
  { group: "Digits", slug: "digits/sg-fade-digit", label: "SgFadeDigit" },
  { group: "Digits", slug: "digits/sg-roller3d-digit", label: "SgRoller3DDigit" },
  { group: "Digits", slug: "digits/sg-matrix-digit", label: "SgMatrixDigit" },
  { group: "Digits", slug: "digits/sg-neon-digit", label: "SgNeonDigit" },
  { group: "Digits", slug: "digits/sg-discard-digit", label: "SgDiscardDigit" },
  { group: "Gadgets", slug: "gadgets/sg-clock", label: "SgClock" },
  { group: "Gadgets", slug: "gadgets/sg-string-animator", label: "SgStringAnimator" },
  { group: "Gadgets", slug: "gadgets/sg-qr-code", label: "SgQRCode" },
  { group: "Gadgets", slug: "gadgets/sg-linear-gauge", label: "SgLinearGauge" },
  { group: "Gadgets", slug: "gadgets/sg-radial-gauge", label: "SgRadialGauge" },
  { group: "Wizard", slug: "sg-wizard", label: "SgWizard" },
  { group: "Utils", slug: "sg-toaster", label: "SgToaster" },
  // { group: "Utils", slug: "sg-playground", label: "SgPlayground" },
  { group: "Utils", slug: "sg-benchmark", label: "Benchmark" }
];

const COMPONENT_HINT_KEY_BY_SLUG: Record<string, string> = {
  "sg-input-text": "showcase.component.inputText.subtitle",
  "sg-input-number": "showcase.component.inputNumber.subtitle",
  "sg-currency-edit": "showcase.component.currencyEdit.subtitle",
  "sg-input-text-area": "showcase.component.inputTextArea.subtitle",
  "sg-input-password": "showcase.component.inputPassword.subtitle",
  "sg-input-date": "showcase.component.inputDate.subtitle",
  "sg-input-birth-date": "showcase.component.inputBirthDate.subtitle",
  "sg-input-email": "showcase.component.inputEmail.subtitle",
  "sg-input-cpf": "showcase.component.cpf.subtitle",
  "sg-input-cnpj": "showcase.component.cnpj.subtitle",
  "sg-input-cpf-cnpj": "showcase.component.cpfcnpj.subtitle",
  "sg-input-postal-code": "showcase.component.inputPostalCode.subtitle",
  "sg-input-phone": "showcase.component.inputPhone.subtitle",
  "sg-autocomplete": "showcase.component.autocomplete.subtitle",
  "sg-text-editor": "showcase.component.textEditor.subtitle",
  "sg-float-action-button": "showcase.component.fab.subtitle",
  "sg-environment-provider": "showcase.component.environment.subtitle",
  "sg-group-box": "showcase.component.groupBox.subtitle",
  "sg-card": "showcase.component.card.subtitle",
  "sg-badge": "showcase.component.badge.subtitle",
  "sg-badge-overlay": "showcase.component.badgeOverlay.subtitle",
  "sg-popup": "showcase.component.popup.subtitle",
  "sg-dialog": "showcase.component.dialog.subtitle",
  "sg-dock-layout": "showcase.component.dockLayout.subtitle",
  "sg-tree-view": "showcase.component.treeView.subtitle",
  "sg-wizard": "showcase.component.wizard.subtitle",
  "gadgets/sg-clock": "showcase.component.clock.subtitle"
};

const COMPONENT_HINT_TEXTS_BY_SLUG: Record<string, Partial<Record<ShowcaseLocale, string>>> = {
  "digits/sg-discard-digit": {
    "pt-BR": "Bloco de folhas com animacao 3D de descarte: a folha do topo sai e revela a proxima.",
    "pt-PT": "Bloco de folhas com animacao 3D de descarte: a folha no topo sai e revela a seguinte.",
    "en-US": "Stacked paper-style digit with a 3D discard animation: the top sheet leaves and reveals the next one.",
    es: "Bloque de hojas con animacion 3D de descarte: la hoja superior sale y revela la siguiente."
  },
  "digits/sg-fade-digit": {
    "pt-BR": "Card animado que \"apaga\" o digito atual e \"acende\" o novo - efeito de lampada ou tubo nixie. Sem bibliotecas externas; animacao 100% CSS + React.",
    "pt-PT": "Card animado que \"apaga\" o digito atual e \"acende\" o novo - efeito de lampada ou tubo nixie. Sem bibliotecas externas; animacao 100% CSS + React.",
    "en-US": "Animated card that \"turns off\" the current digit and \"turns on\" the new one - lamp or nixie-tube style effect. No external libraries; animation is 100% CSS + React.",
    es: "Tarjeta animada que \"apaga\" el digito actual y \"enciende\" el nuevo - efecto tipo lampara o tubo nixie. Sin librerias externas; animacion 100% CSS + React."
  },
  "digits/sg-flip-digit": {
    "pt-BR": "Componente de flip animado para exibicao de digitos e caracteres unicos.",
    "pt-PT": "Componente de flip animado para exibicao de digitos e caracteres unicos.",
    "en-US": "Animated flip component for displaying digits and single characters.",
    es: "Componente flip animado para mostrar digitos y caracteres unicos."
  },
  "digits/sg-matrix-digit": {
    "pt-BR": "Componente de caracteres matriciais em pontos, com suporte a color e backgroundColor.",
    "pt-PT": "Componente de caracteres matriciais em pontos, com suporte a color e backgroundColor.",
    "en-US": "Dot-matrix character component with support for color and backgroundColor.",
    es: "Componente de caracteres matriciales por puntos, con soporte para color y backgroundColor."
  },
  "digits/sg-neon-digit": {
    "pt-BR": "Caracteres em neon com animacao de troca, color, font, backgroundColor e shadowColor.",
    "pt-PT": "Caracteres em neon com animacao de troca, color, font, backgroundColor e shadowColor.",
    "en-US": "Neon character component with swap animation, color, font, backgroundColor, and shadowColor.",
    es: "Caracteres neon con animacion de cambio, color, font, backgroundColor y shadowColor."
  },
  "digits/sg-roller3d-digit": {
    "pt-BR": "Tambor vertical animado - exibe qualquer valor de uma lista com transicao suave via CSS.",
    "pt-PT": "Tambor vertical animado - exibe qualquer valor de uma lista com transicao suave via CSS.",
    "en-US": "Animated vertical drum - displays any value from a list with smooth CSS transition.",
    es: "Tambor vertical animado - muestra cualquier valor de una lista con transicion CSS suave."
  },
  "gadgets/sg-linear-gauge": {
    "pt-BR": "Gauge linear com axis, ranges, bar pointer, marker pointers e arraste.",
    "pt-PT": "Gauge linear com axis, ranges, bar pointer, marker pointers e arraste.",
    "en-US": "Linear gauge with axis, ranges, bar pointer, marker pointers, and drag support.",
    es: "Gauge lineal con axis, ranges, bar pointer, marker pointers y arrastre."
  },
  "gadgets/sg-qr-code": {
    "pt-BR": "Gera QR Code a partir de um valor e permite configurar um logo no centro.",
    "pt-PT": "Gera QR Code a partir de um valor e permite configurar um logo no centro.",
    "en-US": "Generates QR Code from a value and allows configuring a centered logo.",
    es: "Genera QR Code a partir de un valor y permite configurar un logo centrado."
  },
  "gadgets/sg-radial-gauge": {
    "pt-BR": "Gauge radial com ranges, ponteiros e agora com controle de anel mais espesso (ringThickness).",
    "pt-PT": "Gauge radial com ranges, ponteiros e agora com controle de anel mais espesso (ringThickness).",
    "en-US": "Radial gauge with ranges, pointers, and ring thickness control (ringThickness).",
    es: "Gauge radial con ranges, punteros y control de anillo mas grueso (ringThickness)."
  },
  "gadgets/sg-string-animator": {
    "pt-BR": "Anima caractere por caractere de uma string para outra. Suporta seis estilos: roller3d, flip, neon, fade, discard e matrix. Configuravel em velocidade, alinhamento e cores.",
    "pt-PT": "Anima caractere a caractere de uma string para outra. Suporta seis estilos: roller3d, flip, neon, fade, discard e matrix. Configuravel em velocidade, alinhamento e cores.",
    "en-US": "Animates one string into another, character by character. Supports six styles: roller3d, flip, neon, fade, discard, and matrix. Fully configurable for speed, alignment, and colors.",
    es: "Anima una cadena a otra caracter por caracter. Soporta seis estilos: roller3d, flip, neon, fade, discard y matrix. Configurable en velocidad, alineacion y colores."
  },
  "sg-accordion": {
    "pt-BR": "Accordion com configuracao vertical/horizontal, modo single ou multiple e controle externo.",
    "pt-PT": "Accordion com configuracao vertical/horizontal, modo single ou multiple e controlo externo.",
    "en-US": "Accordion with vertical/horizontal layout, single or multiple mode, and external state control.",
    es: "Accordion con configuracion vertical/horizontal, modo single o multiple y control externo."
  },
  "sg-avatar": {
    "pt-BR": "Avatar com suporte a label, icone, imagem, severidade, tamanhos e agrupamento.",
    "pt-PT": "Avatar com suporte a label, icone, imagem, severidade, tamanhos e agrupamento.",
    "en-US": "Avatar with support for label, icon, image, severity, sizes, and grouping.",
    es: "Avatar con soporte para label, icono, imagen, severidad, tamanos y agrupacion."
  },
  "sg-benchmark": {
    "pt-BR": "Comparativo de custo de updates em inputs uncontrolled (SgInputText vs input nativo).",
    "pt-PT": "Comparativo de custo de updates em inputs uncontrolled (SgInputText vs input nativo).",
    "en-US": "Update-cost comparison for uncontrolled inputs (SgInputText vs native input).",
    es: "Comparativo de costo de updates en inputs uncontrolled (SgInputText vs input nativo)."
  },
  "sg-breadcrumb": {
    "pt-BR": "Breadcrumb hierarquico com suporte a icones, navegacao e overflow.",
    "pt-PT": "Breadcrumb hierarquico com suporte a icones, navegacao e overflow.",
    "en-US": "Hierarchical breadcrumb with support for icons, navigation, and overflow.",
    es: "Breadcrumb jerarquico con soporte para iconos, navegacion y overflow."
  },
  "sg-button": {
    "pt-BR": "Botao com suporte a severity, appearance, shape, elevation, icons e loading.",
    "pt-PT": "Botao com suporte a severity, appearance, shape, elevation, icons e loading.",
    "en-US": "Button with support for severity, appearance, shape, elevation, icons, and loading.",
    es: "Boton con soporte para severity, appearance, shape, elevation, iconos y loading."
  },
  "sg-carousel": {
    "pt-BR": "Um componente de carrossel responsivo com navegacao horizontal/vertical, autoplay e indicadores.",
    "pt-PT": "Um componente de carrossel responsivo com navegacao horizontal/vertical, autoplay e indicadores.",
    "en-US": "A responsive carousel component with horizontal/vertical navigation, autoplay, and indicators.",
    es: "Un componente de carrusel responsivo con navegacion horizontal/vertical, autoplay e indicadores."
  },
  "sg-combobox": {
    "pt-BR": "Combobox no estilo select, sem digitacao livre. O item selecionado vem de source e o evento onSelect devolve o objeto selecionado.",
    "pt-PT": "Combobox no estilo select, sem digitacao livre. O item selecionado vem de source e o evento onSelect devolve o objeto selecionado.",
    "en-US": "Select-style combobox, no free typing. The selected item comes from source and onSelect returns the selected object.",
    es: "Combobox estilo select, sin escritura libre. El item seleccionado viene de source y onSelect devuelve el objeto seleccionado."
  },
  "sg-dock-menu": {
    "pt-BR": "Dock estilo macOS com posicoes, drag and drop, badges, labels e magnify.",
    "pt-PT": "Dock estilo macOS com posicoes, drag and drop, badges, labels e magnify.",
    "en-US": "macOS-style dock with positions, drag and drop, badges, labels, and magnify.",
    es: "Dock estilo macOS con posiciones, drag and drop, badges, labels y magnify."
  },
  "sg-dock-screen": {
    "pt-BR": "Componente de conveniencia que combina SgScreen + SgDockLayout no mesmo root.",
    "pt-PT": "Componente de conveniencia que combina SgScreen + SgDockLayout no mesmo root.",
    "en-US": "Convenience component that combines SgScreen + SgDockLayout in a single root.",
    es: "Componente de conveniencia que combina SgScreen + SgDockLayout en el mismo root."
  },
  "sg-expandable-panel": {
    "pt-BR": "Mais exemplos cobrindo as principais propriedades de modo inline e overlay.",
    "pt-PT": "Mais exemplos cobrindo as principais propriedades de modo inline e overlay.",
    "en-US": "More examples covering the main props in inline and overlay modes.",
    es: "Mas ejemplos cubriendo las principales props en modo inline y overlay."
  },
  "sg-grid": {
    "pt-BR": "Grid com colunas responsivas, auto-fit, span, rowSpan, dense e rowHeight.",
    "pt-PT": "Grid com colunas responsivas, auto-fit, span, rowSpan, dense e rowHeight.",
    "en-US": "Grid with responsive columns, auto-fit, span, rowSpan, dense mode and rowHeight.",
    es: "Grid con columnas responsivas, auto-fit, span, rowSpan, dense y rowHeight."
  },
  "sg-input-otp": {
    "pt-BR": "Input OTP com digitos separados, suporte a colagem e mascara configuravel.",
    "pt-PT": "Input OTP com digitos separados, suporte a colagem e mascara configuravel.",
    "en-US": "OTP input with separated digits, paste support, and configurable mask.",
    es: "Input OTP con digitos separados, soporte de pegado y mascara configurable."
  },
  "sg-main-panel": {
    "pt-BR": "Layout estilo Delphi com align=\"top|left|bottom|right|client\". width e height numericos viram porcentagem.",
    "pt-PT": "Layout estilo Delphi com align=\"top|left|bottom|right|client\". width e height numericos viram percentagem.",
    "en-US": "Delphi-style layout with align=\"top|left|bottom|right|client\". Numeric width and height are treated as percentages.",
    es: "Layout estilo Delphi con align=\"top|left|bottom|right|client\". width y height numericos se tratan como porcentaje."
  },
  "sg-menu": {
    "pt-BR": "Menu hierarquico para sidebar, drawer, inline e hibrido, com busca e multiplos estilos.",
    "pt-PT": "Menu hierarquico para sidebar, drawer, inline e hibrido, com busca e multiplos estilos.",
    "en-US": "Hierarchical menu for sidebar, drawer, inline, and hybrid layouts, with search and multiple styles.",
    es: "Menu jerarquico para sidebar, drawer, inline e hibrido, con busqueda y multiples estilos."
  },
  "sg-page-control": {
    "pt-BR": "TabView com controle externo de pagina ativa e ocultacao dinamica de tabs.",
    "pt-PT": "TabView com controlo externo da pagina ativa e ocultacao dinamica de tabs.",
    "en-US": "TabView with external active-page control and dynamic tab hiding.",
    es: "TabView con control externo de pagina activa y ocultacion dinamica de tabs."
  },
  "sg-panel": {
    "pt-BR": "Showcase com exemplos de todas as props do SgPanel.",
    "pt-PT": "Showcase com exemplos de todas as props do SgPanel.",
    "en-US": "Showcase with examples covering all SgPanel props.",
    es: "Showcase con ejemplos de todas las props de SgPanel."
  },
  "sg-radio-group": {
    "pt-BR": "Grupo de radio buttons com orientacao horizontal/vertical, icones, opcao de limpar e integracao com React Hook Form.",
    "pt-PT": "Grupo de radio buttons com orientacao horizontal/vertical, icones, opcao de limpar e integracao com React Hook Form.",
    "en-US": "Radio button group with horizontal/vertical orientation, icons, clear option, and React Hook Form integration.",
    es: "Grupo de radio buttons con orientacion horizontal/vertical, iconos, opcion de limpiar e integracion con React Hook Form."
  },
  "sg-rating": {
    "pt-BR": "Componente de avaliacao com suporte a meia estrela, estados visuais, customizacao de icones e integracao com React Hook Form.",
    "pt-PT": "Componente de avaliacao com suporte a meia estrela, estados visuais, customizacao de icones e integracao com React Hook Form.",
    "en-US": "Rating component with half-star support, visual states, icon customization and React Hook Form integration.",
    es: "Componente de valoracion con soporte de media estrella, estados visuales, personalizacion de iconos e integracion con React Hook Form."
  },
  "sg-screen": {
    "pt-BR": "Container raiz para telas. O exemplo abaixo esta completo para copiar e colar.",
    "pt-PT": "Container raiz para ecras. O exemplo abaixo esta completo para copiar e colar.",
    "en-US": "Root container for screens. The example below is complete and copy/paste ready.",
    es: "Contenedor raiz para pantallas. El ejemplo de abajo esta completo para copiar y pegar."
  },
  "sg-skeleton": {
    "pt-BR": "Placeholder visual para estados de carregamento inspirado no Skeleton do PrimeFaces.",
    "pt-PT": "Placeholder visual para estados de carregamento inspirado no Skeleton do PrimeFaces.",
    "en-US": "Visual placeholder for loading states inspired by PrimeFaces Skeleton.",
    es: "Placeholder visual para estados de carga inspirado en el Skeleton de PrimeFaces."
  },
  "sg-slider": {
    "pt-BR": "Slider com min/max, controle externo, step, width, inputProps e estado disabled.",
    "pt-PT": "Slider com min/max, controlo externo, step, width, inputProps e estado disabled.",
    "en-US": "Slider with min/max, external control, step, width, inputProps and disabled state.",
    es: "Slider con min/max, control externo, step, width, inputProps y estado disabled."
  },
  "sg-split-button": {
    "pt-BR": "Botao dividido com acao principal e menu dropdown de opcoes adicionais.",
    "pt-PT": "Botao dividido com acao principal e menu dropdown de opcoes adicionais.",
    "en-US": "Split button with primary action and dropdown menu for additional options.",
    es: "Boton dividido con accion principal y menu desplegable de opciones adicionales."
  },
  "sg-stack": {
    "pt-BR": "Wrapper flex declarativo para direcao, alinhamento, distribuicao e espacamento.",
    "pt-PT": "Wrapper flex declarativo para direcao, alinhamento, distribuicao e espacamento.",
    "en-US": "Declarative flex wrapper for direction, alignment, distribution and spacing.",
    es: "Wrapper flex declarativo para direccion, alineacion, distribucion y espaciado."
  },
  "sg-stepper-input": {
    "pt-BR": "Input numerico com setas de incremento/decremento, limites min/max e callback onChange.",
    "pt-PT": "Input numerico com setas de incremento/decremento, limites min/max e callback onChange.",
    "en-US": "Numeric input with increment/decrement controls, min/max limits and onChange callback.",
    es: "Input numerico con flechas de incremento/decremento, limites min/max y callback onChange."
  },
  "sg-toaster": {
    "pt-BR": "Sistema de notificacao com API imperativa (toast) e renderer (SgToaster).",
    "pt-PT": "Sistema de notificacao com API imperativa (toast) e renderer (SgToaster).",
    "en-US": "Notification system with imperative API (toast) and renderer (SgToaster).",
    es: "Sistema de notificaciones con API imperativa (toast) y renderer (SgToaster)."
  },
  "sg-toggle-switch": {
    "pt-BR": "Toggle switch inspirado no PrimeFaces (toggleSwitch) com suporte a icones, estados disabled/readonly e integracao com react-hook-form.",
    "pt-PT": "Toggle switch inspirado no PrimeFaces (toggleSwitch) com suporte a icones, estados disabled/readonly e integracao com react-hook-form.",
    "en-US": "PrimeFaces-inspired toggle switch with icon support, disabled/readonly states, and react-hook-form integration.",
    es: "Toggle switch inspirado en PrimeFaces con soporte de iconos, estados disabled/readonly e integracion con react-hook-form."
  },
  "sg-toolbar": {
    "pt-BR": "Toolbar reutilizavel com orientacao vertical/horizontal, acoes assincronas e customizacao visual.",
    "pt-PT": "Toolbar reutilizavel com orientacao vertical/horizontal, acoes assincronas e customizacao visual.",
    "en-US": "Reusable toolbar with vertical/horizontal orientation, async actions, and visual customization.",
    es: "Toolbar reutilizable con orientacion vertical/horizontal, acciones asincronas y personalizacion visual."
  }
};

const THEME_ITEMS = [
  { slug: "theme", labelKey: "showcase.nav.themeSystem" },
  { slug: "credits", labelKey: "showcase.nav.creditsLicenses" }
];

const MENU_GROUP_ORDER = ["Inputs", "Buttons", "Menus", "Layout", "Digits", "Gadgets", "Wizard", "Utils"] as const;

const THEME_HINT_TEXTS_BY_SLUG: Record<string, Record<ShowcaseLocale, string>> = {
  theme: {
    "pt-BR": "Sistema de temas baseado em uma cor seed que gera paletas harmoniosas automaticamente.",
    "pt-PT": "Sistema de temas baseado numa cor seed que gera paletas harmoniosas automaticamente.",
    "en-US": "Theme system based on a single seed color that automatically generates harmonic palettes.",
    es: "Sistema de temas basado en un color seed que genera paletas armoniosas automaticamente."
  },
  credits: {
    "pt-BR":
      "Listagem de todas as bibliotecas open-source utilizadas nos componentes da SeedGrid, com suas respectivas licencas e links de referencia.",
    "pt-PT":
      "Lista de todas as bibliotecas open-source usadas nos componentes da SeedGrid, com as respetivas licencas e links de referencia.",
    "en-US": "List of all open-source libraries used by SeedGrid components, with their licenses and reference links.",
    es: "Listado de todas las bibliotecas open-source usadas en los componentes de SeedGrid, con sus licencias y enlaces de referencia."
  }
};

function getLocalizedHint(locale: ShowcaseLocale, hints: Partial<Record<ShowcaseLocale, string>>): string {
  return hints[locale] ?? hints["pt-BR"] ?? hints["pt-PT"] ?? hints["en-US"] ?? hints.es ?? "";
}

function getComponentHint(
  locale: ShowcaseLocale,
  messages: Record<string, string>,
  slug: string
): string {
  const directHints = COMPONENT_HINT_TEXTS_BY_SLUG[slug];
  if (directHints) return getLocalizedHint(locale, directHints);

  const hintKey = COMPONENT_HINT_KEY_BY_SLUG[slug];
  if (!hintKey) return "";

  const translatedHint = t({ locale, messages }, hintKey);
  if (translatedHint === hintKey) return "";
  return translatedHint;
}

function getThemeItemHint(locale: ShowcaseLocale, slug: string): string {
  const hints = THEME_HINT_TEXTS_BY_SLUG[slug];
  if (!hints) return "";
  return getLocalizedHint(locale, hints);
}

function getGroupHint(locale: ShowcaseLocale, group: string): string {
  if (locale === "en-US") return `${group} component list.`;
  if (locale === "es") return `Lista de componentes de ${group}.`;
  return `Lista de componentes de ${group}.`;
}

const SIDEBAR_THEME_VARS = {
  "--primary": "27 62% 47%",
  "--primary-foreground": "0 0% 100%",
  "--muted": "35 55% 94%",
  "--muted-foreground": "28 30% 36%",
  "--border": "32 42% 83%",
  "--input": "32 42% 83%",
  "--ring": "27 62% 47%",
  "--sg-bg": "247 243 238",
  "--sg-surface": "255 250 245",
  "--sg-muted-surface": "242 233 223",
  "--sg-border": "226 206 188",
  "--sg-ring": "197 106 45",
  "--sg-text": "43 31 20",
  "--sg-muted": "126 95 70",
  "--sg-primary-500": "197 106 45",
  "--sg-primary-600": "168 87 38",
  "--sg-primary-hover": "168 87 38",
  "--sg-primary-active": "147 74 32",
  "--sg-on-primary": "255 255 255",
  "--sg-link": "197 106 45",
  "--sg-link-hover": "168 87 38"
} as React.CSSProperties;

function LocaleFlag(props: Readonly<{ locale: ShowcaseLocale }>) {
  if (props.locale === "pt-BR") {
    return (
      <svg viewBox="0 0 24 16" width="16" height="12" aria-hidden="true">
        <rect width="24" height="16" fill="#1f8f3a" />
        <polygon points="12,2 22,8 12,14 2,8" fill="#f6c431" />
        <circle cx="12" cy="8" r="3.2" fill="#1b4d9a" />
      </svg>
    );
  }

  if (props.locale === "pt-PT") {
    return (
      <svg viewBox="0 0 24 16" width="16" height="12" aria-hidden="true">
        <rect width="10" height="16" fill="#1f8f3a" />
        <rect x="10" width="14" height="16" fill="#c2332b" />
        <circle cx="10" cy="8" r="2.2" fill="#f6c431" />
      </svg>
    );
  }

  if (props.locale === "en-US") {
    return (
      <svg viewBox="0 0 24 16" width="16" height="12" aria-hidden="true">
        <rect width="24" height="16" fill="#ffffff" />
        <rect y="0" width="24" height="2" fill="#c2332b" />
        <rect y="4" width="24" height="2" fill="#c2332b" />
        <rect y="8" width="24" height="2" fill="#c2332b" />
        <rect y="12" width="24" height="2" fill="#c2332b" />
        <rect width="10" height="8" fill="#1b4d9a" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 16" width="16" height="12" aria-hidden="true">
      <rect width="24" height="16" fill="#c2332b" />
      <rect width="8" height="16" fill="#f6c431" />
    </svg>
  );
}

type LocaleOption = {
  value: ShowcaseLocale;
  label: string;
};

const LOCALES: LocaleOption[] = [
  { value: "pt-BR", label: "pt-BR (Portugues do Brasil)" },
  { value: "pt-PT", label: "pt-PT (Portugues de Portugal)" },
  { value: "en-US", label: "en-US (Ingles dos Estados Unidos)" },
  { value: "es", label: "es (Espanhol)" }
];

const MESSAGES_BY_LOCALE: Record<ShowcaseLocale, Record<string, string>> = {
  "pt-BR": showcaseMessagesPtBr,
  "pt-PT": showcaseMessagesPtPt,
  "en-US": showcaseMessagesEnUs,
  es: showcaseMessagesEs
};

const COMPONENTS_MESSAGES_BY_LOCALE: Record<ShowcaseLocale, Record<string, string>> = {
  "pt-BR": componentsMessagesPtBr,
  "pt-PT": componentsMessagesPtPt,
  "en-US": componentsMessagesEnUs,
  es: componentsMessagesEs
};

export default function ShowcaseShell(props: {
  children: React.ReactNode;
  initialLocale?: ShowcaseLocale;
  initialMessages?: Record<string, string>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [locale, setLocale] = React.useState<ShowcaseLocale>(props.initialLocale ?? "pt-BR");
  const [messages, setMessages] = React.useState<Record<string, string>>(
    props.initialMessages ?? showcaseMessagesPtBr
  );
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(true);
  const [isMobileViewport, setIsMobileViewport] = React.useState(false);

  const applyLocale = React.useCallback((next: ShowcaseLocale) => {
    const nextMessages = MESSAGES_BY_LOCALE[next] ?? showcaseMessagesPtBr;
    setLocale(next);
    setMessages(nextMessages);
  }, []);

  React.useEffect(() => {
    let stored: ShowcaseLocale | null = null;
    try {
      stored = (localStorage.getItem("seedgrid-showcase-locale") as ShowcaseLocale | null) ?? null;
    } catch {
      stored = null;
    }
    if (stored && MESSAGES_BY_LOCALE[stored]) {
      const nextMessages = MESSAGES_BY_LOCALE[stored] ?? showcaseMessagesPtBr;
      const nextComponentMessages =
        COMPONENTS_MESSAGES_BY_LOCALE[stored] ?? componentsMessagesPtBr;
      setLocale(stored);
      setMessages(nextMessages);
      setShowcaseI18n({ locale: stored, messages: nextMessages });
      setComponentsI18n({ locale: stored, messages: nextComponentMessages });
      return;
    }
    setShowcaseI18n({ locale, messages });
    setComponentsI18n({
      locale,
      messages: COMPONENTS_MESSAGES_BY_LOCALE[locale] ?? componentsMessagesPtBr
    });
  }, []);

  React.useEffect(() => {
    setShowcaseI18n({ locale, messages });
    setComponentsI18n({
      locale,
      messages: COMPONENTS_MESSAGES_BY_LOCALE[locale] ?? componentsMessagesPtBr
    });
    try {
      localStorage.setItem("seedgrid-showcase-locale", locale);
    } catch {
      // ignore
    }
  }, [locale, messages]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(max-width: 767px)");
    const syncViewport = () => setIsMobileViewport(media.matches);
    syncViewport();
    media.addEventListener("change", syncViewport);
    return () => media.removeEventListener("change", syncViewport);
  }, []);

  const shellMenu = React.useMemo<SgMenuNode[]>(() => ([
    ...THEME_ITEMS.map((item) => ({
      id: `theme-${item.slug}`,
      label: t({ locale, messages }, item.labelKey),
      hint: getThemeItemHint(locale, item.slug),
      url: `/${item.slug}`
    })),
    ...MENU_GROUP_ORDER.map((group) => {
      const children = COMPONENTS.filter((item) => item.group === group).map((item) => {
        return {
          id: `component-${item.slug}`,
          label: item.label,
          url: `/components/${item.slug}`,
          hint: getComponentHint(locale, messages, item.slug)
        };
      });
      return {
        id: `group-${group.toLowerCase()}`,
        label: group,
        hint: getGroupHint(locale, group),
        children
      };
    }).filter((node) => node.children.length > 0)
  ]), [locale, messages]);

  return (
    <ShowcaseI18nProvider locale={locale} messages={messages}>
      <SgComponentsI18nProvider
        locale={locale}
        messages={COMPONENTS_MESSAGES_BY_LOCALE[locale] ?? componentsMessagesPtBr}
      >
        <SgDockScreen
          id="showcase-shell-dock"
          screenId="showcase-shell-screen"
          fullscreen={false}
          className="h-screen w-full"
          layoutClassName="!grid-cols-[auto_minmax(0,1fr)] lg:!grid-cols-[auto_minmax(0,1fr)_auto] !grid-rows-[auto_minmax(0,1fr)]"
        >
          <SgDockZone zone="top" className="col-span-2 row-start-1 !p-0 border-b border-[#e2cebc] bg-[#f7f3ee] lg:col-span-3">
            <div className="px-2 py-1">
              <SgToolBar
                id="showcase-locale-toolbar"
                title={t({ locale, messages }, "showcase.toolbar.language")}
                orientationDirection="horizontal-left"
                collapsible={false}
                dockZone="top"
              >
                {LOCALES.map((item) => (
                  <SgToolbarIconButton
                    key={item.value}
                    icon={<LocaleFlag locale={item.value} />}
                    label={item.value}
                    hint={item.label}
                    severity={locale === item.value ? "primary" : "plain"}
                    onClick={() => applyLocale(item.value)}
                  />
                ))}
              </SgToolBar>
            </div>
          </SgDockZone>

          <SgDockZone zone="left" className="col-start-1 row-start-2 !p-0 border-r border-[#e2cebc] bg-[#f7f3ee]">
            <SgMenu
              id="showcase-shell-menu-dockable"
              menu={shellMenu}
              selection={{ activeUrl: pathname ?? undefined }}
              brand={{
                image: (
                  <div className="flex flex-col items-center gap-0.5 py-1">
                    <img src="/logo-seedgrid-icon.svg" className="h-10 w-auto" alt="" />
                    <span className="text-xl font-black leading-none tracking-tight">
                      <span style={{ color: "#2b1f14" }}>Seed</span>
                      <span style={{ color: "#C56A2D" }}>Grid</span>
                    </span>
                  </div>
                ),
                title: "",
                onClick: () => router.push("/")
              }}
              variant="sidebar"
              menuStyle="panel"
              mode="multiple"
              defaultExpandedIds={[]}
              collapsed={sidebarCollapsed}
              onCollapsedChange={setSidebarCollapsed}
              showCollapseButton
              search={{ enabled: true, placeholder: t({ locale, messages }, "showcase.nav.search.placeholder") }}
              dockable
              dockZone="left"
              draggable
              expandedWidth={isMobileViewport ? 260 : 288}
              collapsedWidth={isMobileViewport ? 56 : 76}
              border
              className="h-full bg-[#f7f3ee] text-[#2b1f14]"
              style={SIDEBAR_THEME_VARS}
              ariaLabel="Menu do showcase"
              onNavigate={(node) => {
                if (node.url) router.push(node.url);
              }}
            />
          </SgDockZone>

          <SgDockZone zone="right" className="col-start-3 row-start-2 hidden !p-0 border-l border-[#e2cebc] bg-[#f7f3ee] lg:flex">
            <div className="h-full w-14" />
          </SgDockZone>

          <SgDockZone zone="free" className="col-start-2 row-start-2 !p-0 !items-stretch !justify-start">
            <main className="h-full w-full overflow-y-auto p-2">{props.children}</main>
          </SgDockZone>
        </SgDockScreen>
        <SgToaster />
        <ThemeEditor />
      </SgComponentsI18nProvider>
    </ShowcaseI18nProvider>
  );
}
