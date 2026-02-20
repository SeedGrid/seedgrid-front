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
- A medição da altura deve considerar o bloco sticky completo (container externo + paddings), não apenas o card interno.
- A navegação por âncora deve aplicar respiro mínimo adicional (>= 12px) abaixo do cabeçalho para o título ficar totalmente visível.
- Após o scroll para âncora, deve haver ajuste fino pela posição real renderizada do título da seção (correção pós-scroll) para garantir que nunca fique atrás do cabeçalho.
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
- A navegação por link de exemplo deve acertar a posição já no primeiro clique (sem exigir segundo clique para corrigir).
- Quantidade de links no cabeçalho = quantidade de exemplos da página.
- O link `Props Reference` deve navegar corretamente para a seção de props, com título visível.
- Ao clicar em `Props Reference`, não pode ficar nenhum trecho do exemplo anterior entre o cabeçalho e o título da seção de props.
- O bloco de código de cada exemplo corresponde ao exemplo exibido na tela (1:1).
