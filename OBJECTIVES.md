# Objetivos do Projeto Cosmic Adventure Forge

## Objetivo
Expandir e consolidar o jogo Cosmic Adventure Forge, estruturado em React + Vite + Tailwind + shadcn/ui, com arquitetura moderna e foco em combate por turnos, evolução de companions ("sombras") e narrativa dinâmica.

## Meta
Implementar sistemas essenciais de gameplay, evolução e persistência, alinhados com UX imersiva e modularidade escalável.

## 🧩 Recursos a implementar

### 1. Sistema de Evolução das Sombras
- Permitir que companions (shadows) evoluam com base em tempo de uso, batalhas vencidas ou itens consumidos.
- Mudanças visuais (paleta, efeitos, animações) por raridade ou classe.
- Gerar feedback visual e sonoro imersivo a cada evolução.
- Controlar estado com Zustand ou Redux, persistido em Supabase.

### 2. Forge / Crafting Dinâmico
- Criação de novos companions a partir de combinações de ingredientes coletados em missões.
- Implementar lógica baseada em raridade, probabilidade e buffs herdados.
- Interfaces interativas usando drag & drop ou animações forjadas.
- Gerar histórico de forja (logs visuais de resultados anteriores).

### 3. Combate por Turnos Avançado
- Sistema modular de combate 1v1 e PvE com atributos variáveis (HP, ATK, DEF, SPD, habilidades ativas/passivas).
- IA inimiga adaptável com padrões de decisão reativos.
- Controle por FSM (Finite State Machine) para ações de batalha.
- Animações sincronizadas com turnos e feedback de dano em tempo real.

### 4. Sistema de Aventura em Fases
- Mapa de progressão com stages desbloqueáveis (semelhante a Slay the Spire).
- Fases com recompensas únicas, status do companion persistente entre lutas.
- Geração procedural de desafios ou inimigos.
- Persistência do progresso no Supabase (fase atual, companions vivos, recursos).

### 5. Conta de Usuário e Salvamento na Nuvem
- Autenticação com Supabase (e-mail/senha ou OAuth).
- Salvamento automático do estado do jogo (companions, evolução, fases).
- Sistema de "carregar progresso" e "novo jogo".

### 6. Polimento de UI/UX e Feedback
- Integração fluida de componentes shadcn/ui com Tailwind responsivo.
- Transições suaves entre telas (fade, slide, depth).
- Sistema de notificações e conquistas integradas.
- Acessibilidade (atalhos de teclado, contraste, navegação clara).

### 7. CI/CD e Deploy
- Setup de CI/CD com GitHub Actions.
- Deploy automático via Vercel (ambiente de produção e preview).
- Versionamento semântico (semver) com Changelog automático.

## 📦 Stack atual
- Frontend: React 18 + Vite
- Estilização: TailwindCSS + shadcn/ui
- Gerenciamento de estado: Zustand (ou Redux opcional)
- Persistência: Supabase (auth + database)
- Build/Deploy: GitHub + Vercel
- Testes: Vitest (unitários), Playwright (E2E)

## 🧠 Requisitos de engenharia
- Código limpo, modular e documentado.
- Arquitetura extensível (facilidade para novas fases, sombras, inimigos).
- Uso eficiente de recursos (lazy loading de assets, debounce em interações).
- Estrutura de pastas clara: /components, /screens, /hooks, /data, /utils, /api.

## ✅ Entregáveis esperados
- Implementações completas com fallback funcional.
- Documentação breve no README sobre como iniciar e testar os novos recursos.
- Atualizações no changelog.md.
- Testes cobrindo no mínimo 80% das novas funcionalidades.