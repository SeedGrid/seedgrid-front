# AGENTS.md

## Conventions
- Todo componente deve ter showcase.
- O código de cada exemplo do showcase deve refletir exatamente o que está renderizado (copy/paste 1:1).
- Todo showcase deve ter `SgPlayground`.
- Sempre que possível, usar componentes SeedGrid no exemplo e no componente.
  - Exemplo: `button` -> `SgButton`
  - Exemplo: `div flex` -> `SgGrid`
- Aplicar `I18NReady` nas páginas de showcase.
- Arquivos devem estar em UTF-8 para não quebrar acentuação.

## Referência de Props
- Criar uma seção "Referência de Props" com todas as propriedades públicas do componente.
- A tabela deve conter: `Prop`, `Tipo`, `Padrão`, `Descrição`.

Exemplo de linha:
- `id | string | - | Identificador único`

## Layout fixo do showcase (obrigatório)
Cada página de componente deve ter um cabeçalho fixo (sticky/freeze) no topo, contendo:
1. Nome do componente
2. Descrição curta do objetivo e funcionalidades
3. Links âncora para todos os exemplos da página (`#exemplo-1`, `#exemplo-2`, ..., `#exemplo-n`)
4. Link âncora para a seção de Props Reference (`#props-reference`)

## Regras técnicas obrigatórias para o cabeçalho fixo
- O scroll da página deve ocorrer no container principal do conteúdo (não no `body`).
- O cabeçalho sticky deve ter `z-index` alto e fundo opaco.
- Não pode haver "vazamento" visual de exemplos por trás do cabeçalho durante o scroll.
- Cada seção de exemplo deve ter `id="exemplo-N"` correspondente ao link.
- Cada seção deve ter offset de ancoragem (`scroll-margin-top`) suficiente para não ficar escondida pelo cabeçalho sticky.
- O offset de ancoragem deve usar a altura real do cabeçalho sticky (valor dinâmico), com margem de segurança.
- Deve existir exatamente 1 link no cabeçalho para cada exemplo renderizado.
- A seção de props deve ter `id="props-reference"` e também ter offset de ancoragem.

## Estrutura padrão do showcase
1. Cabeçalho fixo (nome, descrição e links para exemplos)
2. Exemplos numerados
3. Playground (`SgPlayground`)
4. Props Reference (Referência de Props)

## Critérios de aceite mínimos
- Ao rolar a página, o cabeçalho permanece fixo e legível.
- Ao clicar em qualquer link do cabeçalho, o título do exemplo destino fica visível (não coberto).
- Ao clicar nos links em qualquer breakpoint (mobile/desktop), o título do exemplo deve ficar 100% visível com respiro mínimo abaixo do cabeçalho.
- Quantidade de links no cabeçalho = quantidade de exemplos da página.
- O link `Props Reference` deve navegar corretamente para a seção de props, com título visível.
- O bloco de código de cada exemplo corresponde ao exemplo exibido na tela (1:1).
