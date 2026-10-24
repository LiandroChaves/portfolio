# Liandro Chaves — Portfólio

Portfólio em React, TypeScript, Vite e Three.js. Direção visual de estúdio digital: grafite, verde-lima, tipografia expressiva e uma escultura orbital interativa.

## Executar

Requer Node.js 22.12+ ou 24+ e npm.

```bash
npm ci
npm run dev
```

```bash
npm run build
npm run preview
npm test
```

O build estático é gerado em `dist/`. Os estudos de caso usam URLs por hash, dispensando reescrita no servidor. Em ambientes que restringem interfaces de rede, execute `npx vite --host 127.0.0.1`.

## Conteúdo e estrutura

- `src/data.ts`: projetos, participação, tecnologias, contexto, decisões e etapas de trabalho.
- `src/App.tsx`: navegação, projetos, estudos de caso, processo, tema e contato.
- `src/components/Motion.tsx`: abertura, carregamento progressivo e interações de movimento.
- `src/components/HeroVisual.tsx`: escultura orbital Three.js; mantém também o renderer de retrato compatível com a versão anterior.
- `src/components/Monogram.tsx`: monograma LC tridimensional nas seções de processo e contato.
- `src/styles.css`: tokens de tema, componentes, estudos de caso e layout responsivo.
- `src/motion.css`: composição da abertura, movimento e alternativas estáticas.

O tema inicial é escuro; a escolha claro/escuro fica persistida. A tipografia usa fontes do sistema e Georgia, sem requisições externas de fontes. Fotos anteriores permanecem em `public/images/`; o retrato com sorriso aparece na assinatura e o retrato de estúdio na apresentação.

## Movimento e acessibilidade

A abertura combina um núcleo facetado, malha geométrica, órbitas, satélites e partículas. Luz e orientação respondem ao ponteiro, com progressão suave. Three.js é carregado em chunks separados. Renderizações pausam fora da tela e com a aba oculta; redução de movimento produz cenas estáticas. Há limites de densidade de pixels e partículas para telas pequenas, descarte de recursos ao desmontar e alternativas HTML/CSS sem WebGL.

A navegação móvel mantém foco contido e fecha com Escape. Os estudos de caso preservam abas operáveis por teclado, modal nativo, retorno de foco e links próprios. Há link para pular ao conteúdo e confirmação da cópia do e-mail.

## Fidelidade do conteúdo

As prévias dos projetos são **representações conceituais em HTML/CSS**, identificadas como ilustrativas. Não são capturas reais. Não foram inventados depoimentos, métricas ou demonstrações. ZENITH-OS permanece identificado como projeto acadêmico em concepção; Instituto Brotar preserva o crédito de colaboração.

O contato usa `mailto:` e a API de clipboard, sem backend ou coleta de dados. Imagens de retrato são versões de estúdio geradas anteriormente a partir das referências fornecidas por Liandro.

## Validação

`npm run build` verifica TypeScript em modo estrito e gera a produção. `npm test` cobre fallback WebGL, ciclo de vida do renderer, redução de movimento, tema, armazenamento indisponível, menu e foco, navegação, abas, processo e contato. O chunk compartilhado do Three.js pode gerar aviso de tamanho no Vite; ele é carregado sob demanda e não impede a compilação.
