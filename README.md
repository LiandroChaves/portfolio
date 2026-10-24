# Liandro Chaves — Portfólio

Portfólio em React, TypeScript, Vite e Three.js. Direção visual de estúdio digital: grafite, verde-lima, tipografia expressiva e uma jornada tridimensional autoral a partir das iniciais LC.

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
- `src/components/HeroVisual.tsx`: jornada LC Three.js; mantém também o renderer de retrato compatível com a versão anterior.
- `src/components/Monogram.tsx`: monograma LC tridimensional nas seções de processo e contato.
- `src/styles.css`: tokens de tema, componentes, estudos de caso e layout responsivo.
- `src/motion.css`: composição da abertura, movimento e alternativas estáticas.

O tema inicial é escuro; a escolha claro/escuro fica persistida. A tipografia usa fontes do sistema e Georgia, sem requisições externas de fontes. Fotos anteriores permanecem em `public/images/`; o retrato com sorriso aparece na assinatura e o retrato de estúdio na apresentação.

## Movimento e acessibilidade

A abertura é uma cena persistente com três capítulos: partículas representam a ideia; uma assinatura LC extrudada ganha forma; o objeto se desdobra em três camadas de sistema. A rolagem controla a transformação continuamente, sem interceptar roda do mouse ou gestos. Os botões de capítulos permitem navegar diretamente e o link de projetos permite pular a experiência.

`SignatureScene.ts` concentra materiais, geometria e shader de partículas. `signatureGeometry.ts` define amostragem determinística e progressão com um intervalo estável para leitura da assinatura. Sem modelos, fontes ou texturas externas para o 3D. Ponteiro influencia orientação e afastamento local das partículas; a câmera ajusta o enquadramento à proporção da tela.

Three.js permanece em chunks separados. A cena usa 1.600 partículas no celular ou 3.600 no desktop, com limites de densidade de pixels. Renderizações pausam fora da tela e com a aba oculta; o botão de pausa interrompe movimento ambiente e reação ao ponteiro, mantendo a navegação entre capítulos. Com redução de movimento a abertura não ocupa múltiplas alturas de tela: os capítulos funcionam como seleções estáticas. Recursos são descartados ao desmontar, o contexto WebGL pode ser restaurado e a assinatura HTML/CSS aparece durante carregamento ou indisponibilidade de WebGL.

A referência criativa foi o caráter imersivo de https://www.igloo.inc/, com composição, geometria, narrativa e código próprios para Liandro. Não são usados assets, áudio ou código da referência.

A navegação móvel mantém foco contido e fecha com Escape. Os estudos de caso preservam abas operáveis por teclado, modal nativo, retorno de foco e links próprios. Há link para pular ao conteúdo e confirmação da cópia do e-mail.

## Fidelidade do conteúdo

As prévias dos projetos são **representações conceituais em HTML/CSS**, identificadas como ilustrativas. Não são capturas reais. Não foram inventados depoimentos, métricas ou demonstrações. ZENITH-OS permanece identificado como projeto acadêmico em concepção; Instituto Brotar preserva o crédito de colaboração.

O contato usa `mailto:` e a API de clipboard, sem backend ou coleta de dados. Imagens de retrato são versões de estúdio geradas anteriormente a partir das referências fornecidas por Liandro.

## Validação

`npm run build` verifica TypeScript em modo estrito e gera a produção. `npm test` cobre amostragem e progressão da geometria, atributos de partículas, capítulos estáticos, pausa, fallback e restauração WebGL, ciclo de vida do renderer, redução de movimento, tema, armazenamento indisponível, menu e foco, navegação, abas, processo e contato. A renderização dos shaders e o acabamento visual da nova cena ainda precisam de inspeção em navegador: a sessão conectada exibia a versão anterior e a política do navegador impediu abrir a prévia isolada por URL de dados. O chunk compartilhado do Three.js pode gerar aviso de tamanho no Vite; ele é carregado sob demanda e não impede a compilação.
