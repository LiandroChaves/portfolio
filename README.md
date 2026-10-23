# Liandro Chaves — Portfólio

Portfólio pessoal em React e TypeScript, desenvolvido a partir do documento de direção criativa fornecido por Liandro.

## Executar

Requer Node.js 22.12+ (ou 24+) e npm.

```bash
npm ci
npm run dev
```

```bash
npm run build
npm run preview
```

O build estático fica em `dist/`. Pode ser publicado na Vercel, Netlify ou outro host estático. As páginas de projeto usam rotas por hash, sem necessidade de regras de reescrita no servidor.

## Experiência

- Tema claro inicial e tema escuro com preferência persistida antes da primeira pintura.
- Layout responsivo, menu móvel e link para pular ao conteúdo.
- Estudos de caso com URLs próprias por hash, contexto, solução, decisões em abas e aprendizados.
- Processo interativo com quatro etapas e representação orbital no desktop.
- Galeria modal nativa com Escape, foco contido e retorno ao acionador.
- Contato por e-mail, cópia do endereço e GitHub.
- Alternativa para redução de movimento.

## Conteúdo

Edite `src/data.ts` para atualizar projetos e etapas. A aplicação fica em `src/App.tsx`; os componentes de movimento e Three.js estão em `src/components/`. Os tokens ficam em `src/styles.css` e os efeitos em `src/motion.css`.

As imagens dos projetos são **representações conceituais feitas com HTML/CSS**, identificadas na interface. Não são capturas reais nem dados de produção. Substitua-as por capturas autorizadas antes de apresentar os sistemas como demonstrações visuais fiéis. Não foram adicionados depoimentos, métricas de impacto ou links de demonstração não verificados. ZENITH-OS é apresentado como projeto acadêmico em concepção.

O contato usa o endereço associado à conta GitHub de Liandro. Fontes DM Sans e Manrope são carregadas do Google Fonts, com fontes locais de fallback. Não há analytics, formulário com coleta de dados ou dependência de backend.

## Validação

`npm run build` executa TypeScript em modo estrito e gera a versão de produção. A revisão visual em dispositivos reais e as medições de desempenho em produção devem ser feitas após publicar.

## Direção de movimento e retrato

- Retrato de estúdio gerado a partir da foto fornecida por Liandro, com remoção do colar, troca de roupa e cenário e instruções de preservação da identidade. Arquivo usado: `public/images/liandro-studio.webp` (cerca de 140 KB). A versão anterior foi preservada.
- Hero com entrada de letras, revelação da foto e parallax por ponteiro/rolagem.
- Monograma LC com geometria extrudada em Three.js. Carregado sob demanda; fallback em HTML se WebGL não estiver disponível. Renderização pausada fora da área visível e quando a aba fica oculta; geometrias e listeners descartados ao desmontar.
- Navegação em tela cheia com foco contido, Escape e restauração de foco.
- Troca circular de tema via View Transitions quando disponível; troca direta nos demais casos.
- Perspectiva nos projetos, botões magnéticos, entradas na rolagem e indicador de progresso.
- No celular, retrato estável e disposição vertical. A preferência de redução de movimento elimina animações contínuas e parallax.

### Testes

`npm test` valida os fluxos de tema (inclusive armazenamento bloqueado), menu e foco, navegação dos cases, abas por teclado, processo e cópia de contato em DOM simulado. Esses testes não substituem inspeção visual e verificação de WebGL em navegador real.

## Edição de estúdio

Inclui narrativa visual vinculada à rolagem, cartões de projetos sobrepostos em desktops altos, órbitas e satélites no LC 3D, elementos flutuantes no retrato e luz animada. O movimento não altera o rosto da fotografia. Em telas pequenas os projetos continuam em lista; com redução de movimento a narrativa permanece estática e os cartões não ficam sobrepostos.

Retrato criado com a ferramenta integrada de geração de imagens. Direção utilizada: preservar a identidade, proporções faciais, tom de pele, textura, cabelo, barba leve e óculos retangulares; remover colar; usar camiseta preta e sobrecamisa grafite sem marcas; cenário de estúdio cinza com luz violeta discreta; iluminação suave, expressão natural e enquadramento do torso para cima.
