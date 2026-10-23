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

Edite `src/data.ts` para atualizar projetos e etapas. Os componentes ficam em `src/main.tsx`, e os tokens e estilos em `src/styles.css`.

As imagens dos projetos são **representações conceituais feitas com HTML/CSS**, identificadas na interface. Não são capturas reais nem dados de produção. Substitua-as por capturas autorizadas antes de apresentar os sistemas como demonstrações visuais fiéis. Não foram adicionados depoimentos, métricas de impacto ou links de demonstração não verificados. ZENITH-OS é apresentado como projeto acadêmico em concepção.

O contato usa o endereço associado à conta GitHub de Liandro. Fontes DM Sans e Manrope são carregadas do Google Fonts, com fontes locais de fallback. Não há analytics, formulário com coleta de dados ou dependência de backend.

## Validação

`npm run build` executa TypeScript em modo estrito e gera a versão de produção. A revisão visual em dispositivos reais e as medições de desempenho em produção devem ser feitas após publicar.
