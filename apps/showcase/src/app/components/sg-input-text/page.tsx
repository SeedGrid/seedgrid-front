import React from "react";
import Link from "next/link";
import { SgButton, SgStack } from "@seedgrid/fe-components";
import SgCodeBlockBase from "../others/SgCodeBlockBase";
import { loadSample } from "../utils/loadSample";
import BackToTopFab from "../sg-code-block-base/BackToTopFab";

export default async function SgInputTextPage() {
  const basicExample = await loadSample("sg-input-text", "sg-input-text-basic.src");
  const requiredExample = await loadSample("sg-input-text", "sg-input-text-required.src");
  const controlledExample = await loadSample("sg-input-text", "sg-input-text-controlled.src");
  const maxLengthCounterExample = await loadSample("sg-input-text", "sg-input-text-max-length-counter.src");
  const minLengthExample = await loadSample("sg-input-text", "sg-input-text-min-length.src");
  const minWordsExample = await loadSample("sg-input-text", "sg-input-text-min-words.src");
  const customValidationExample = await loadSample("sg-input-text", "sg-input-text-custom-validation.src");
  const prefixIconExample = await loadSample("sg-input-text", "sg-input-text-prefix-icon.src");
  const prefixSuffixTextExample = await loadSample("sg-input-text", "sg-input-text-prefix-suffix-text.src");
  const iconButtonsExample = await loadSample("sg-input-text", "sg-input-text-icon-buttons.src");
  const visualVariantsExample = await loadSample("sg-input-text", "sg-input-text-visual-variants.src");
  const noClearButtonExample = await loadSample("sg-input-text", "sg-input-text-no-clear-button.src");
  const widthBorderRadiusExample = await loadSample("sg-input-text", "sg-input-text-width-border-radius.src");
  const disabledReadonlyExample = await loadSample("sg-input-text", "sg-input-text-disabled-readonly.src");
  const externalErrorExample = await loadSample("sg-input-text", "sg-input-text-external-error.src");
  const standaloneFormExample = await loadSample("sg-input-text", "sg-input-text-standalone-form.src");
  const eventsExample = await loadSample("sg-input-text", "sg-input-text-events.src");

  const sectionLinks = [
    { href: "#example-basic", label: "1) Básico" },
    { href: "#example-required", label: "2) Required" },
    { href: "#example-controlled", label: "3) Controlled" },
    { href: "#example-counter", label: "4) MaxLength + Counter" },
    { href: "#example-minlength", label: "5) MinLength" },
    { href: "#example-minwords", label: "6) MinNumberOfWords" },
    { href: "#example-validation", label: "7) Custom Validation" },
    { href: "#example-prefix-icon", label: "8) Prefix Icon" },
    { href: "#example-prefix-suffix", label: "9) Prefix/Suffix Text" },
    { href: "#example-icon-buttons", label: "10) Icon Buttons" },
    { href: "#example-visual", label: "11) Visual (Sem borda/Filled)" },
    { href: "#example-noclear", label: "12) Sem Clear Button" },
    { href: "#example-size", label: "13) Width/Border Radius" },
    { href: "#example-disabled", label: "14) Disabled/ReadOnly" },
    { href: "#example-error", label: "15) Erro Externo" },
    { href: "#example-standalone", label: "16) Standalone Form" },
    { href: "#example-events", label: "17) Events" }
  ];

  return (
    <SgStack className="w-full" gap={32}>
      <SgStack id="examples-top" gap={8}>
        <h1 className="text-3xl font-bold">SgInputText</h1>
        <p className="text-muted-foreground">
          Componente de input de texto com validação e integração com react-hook-form.
        </p>
        <SgStack direction="row" gap={8} wrap>
          {sectionLinks.map((item) => (
            <Link key={item.href} href={item.href}>
              <SgButton appearance="outline" size="sm">
                {item.label}
              </SgButton>
            </Link>
          ))}
        </SgStack>
      </SgStack>

      <SgCodeBlockBase
        cardId="example-basic"
        title="1) Básico"
        description="Uso básico com register do react-hook-form."
        code={basicExample}
        interactive
        codeContract="appFile"
        dependencies={{ "react-hook-form": "^7.0.0" }}
      />

      <SgCodeBlockBase
        cardId="example-required"
        title="2) Required"
        description="Campo obrigatório com mensagem padrão e customizada."
        code={requiredExample}
        interactive
        codeContract="appFile"
        dependencies={{ "react-hook-form": "^7.0.0" }}
      />

      <SgCodeBlockBase
        cardId="example-controlled"
        title="3) Controlled"
        description="Input controlado usando control do react-hook-form."
        code={controlledExample}
        interactive
        codeContract="appFile"
        dependencies={{ "react-hook-form": "^7.0.0" }}
      />

      <SgCodeBlockBase
        cardId="example-counter"
        title="4) MaxLength + Counter"
        description="Limite de caracteres com contador visual."
        code={maxLengthCounterExample}
        interactive
        codeContract="appFile"
        dependencies={{ "react-hook-form": "^7.0.0" }}
      />

      <SgCodeBlockBase
        cardId="example-minlength"
        title="5) MinLength"
        description="Validação de comprimento mínimo."
        code={minLengthExample}
        interactive
        codeContract="appFile"
        dependencies={{ "react-hook-form": "^7.0.0" }}
      />

      <SgCodeBlockBase
        cardId="example-minwords"
        title="6) MinNumberOfWords"
        description="Validação de número mínimo de palavras."
        code={minWordsExample}
        interactive
        codeContract="appFile"
        dependencies={{ "react-hook-form": "^7.0.0" }}
      />

      <SgCodeBlockBase
        cardId="example-validation"
        title="7) Custom Validation"
        description="Validação customizada com função validation."
        code={customValidationExample}
        interactive
        codeContract="appFile"
        dependencies={{ "react-hook-form": "^7.0.0" }}
      />

      <SgCodeBlockBase
        cardId="example-prefix-icon"
        title="8) Prefix Icon"
        description="Ícone no início do input."
        code={prefixIconExample}
        interactive
        codeContract="appFile"
        dependencies={{ "react-hook-form": "^7.0.0" }}
      />

      <SgCodeBlockBase
        cardId="example-prefix-suffix"
        title="9) Prefix/Suffix Text"
        description="Texto fixo antes ou depois do valor do input."
        code={prefixSuffixTextExample}
        interactive
        codeContract="appFile"
        dependencies={{ "react-hook-form": "^7.0.0" }}
      />

      <SgCodeBlockBase
        cardId="example-icon-buttons"
        title="10) Icon Buttons"
        description="Botões customizados dentro do input."
        code={iconButtonsExample}
        interactive
        codeContract="appFile"
        dependencies={{ "react-hook-form": "^7.0.0" }}
      />

      <SgCodeBlockBase
        cardId="example-visual"
        title="11) Visual (Sem borda/Filled)"
        description="Variações visuais: sem borda ou preenchido."
        code={visualVariantsExample}
        interactive
        codeContract="appFile"
        dependencies={{ "react-hook-form": "^7.0.0" }}
      />

      <SgCodeBlockBase
        cardId="example-noclear"
        title="12) Sem Clear Button"
        description="Input sem o botão de limpar."
        code={noClearButtonExample}
        interactive
        codeContract="appFile"
        dependencies={{ "react-hook-form": "^7.0.0" }}
      />

      <SgCodeBlockBase
        cardId="example-size"
        title="13) Width/Border Radius"
        description="Customização de largura e raio de borda."
        code={widthBorderRadiusExample}
        interactive
        codeContract="appFile"
        dependencies={{ "react-hook-form": "^7.0.0" }}
      />

      <SgCodeBlockBase
        cardId="example-disabled"
        title="14) Disabled/ReadOnly"
        description="Estados desabilitado e somente leitura."
        code={disabledReadonlyExample}
        interactive
        codeContract="appFile"
        dependencies={{ "react-hook-form": "^7.0.0" }}
      />

      <SgCodeBlockBase
        cardId="example-error"
        title="15) Erro Externo"
        description="Exibição de erro passado via prop."
        code={externalErrorExample}
        interactive
        codeContract="appFile"
        dependencies={{ "react-hook-form": "^7.0.0" }}
      />

      <SgCodeBlockBase
        cardId="example-standalone"
        title="16) Standalone Form"
        description="Uso sem react-hook-form, com refs nativas."
        code={standaloneFormExample}
        interactive
        codeContract="appFile"
        dependencies={{ "react-hook-form": "^7.0.0" }}
      />

      <SgCodeBlockBase
        cardId="example-events"
        title="17) Events"
        description="Callbacks de eventos: onChange, onEnter, onExit, onClear, onValidation."
        code={eventsExample}
        interactive
        codeContract="appFile"
        dependencies={{ "react-hook-form": "^7.0.0" }}
      />

      <BackToTopFab targetId="examples-top" />
    </SgStack>
  );
}
