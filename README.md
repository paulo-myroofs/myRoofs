# 🏠 myRoofs

A **myRoofs** é uma empresa comprometida em **comunicar, simplificar e digitalizar o dia a dia dos condomínios residenciais**.

Este repositório contém o frontend do sistema, construído com **Next.js** e utilizando **Firebase** como *backend as a service*.

---

## 🚀 Tecnologias

* **Next.js 14**: Framework React para renderização do lado do servidor e geração de sites estáticos.
* **React 18**: Biblioteca JavaScript para construção de interfaces de usuário interativas.
* **TypeScript**: Superconjunto tipado do JavaScript que melhora a segurança e escalabilidade do código.
* **Tailwind CSS**: Framework CSS utilitário para design rápido e responsivo.
* **Firebase (Auth + Firestore)**: Plataforma de desenvolvimento de aplicativos que oferece autenticação e um banco de dados NoSQL em nuvem.
* **React Hook Form** + **Zod**: Soluções para gerenciamento de formulários e validação de esquemas de dados.
* **TanStack React Query**: Biblioteca para gerenciamento, cache e sincronização de dados assíncronos.

---

## 🔐 Autenticação

A autenticação é realizada via **Firebase Admin SDK**, com integração direta nas rotas de API do Next.js.

---

## ☁️ Backend

Utilizamos **Firebase como *backend as a service***. Isso significa que não há um backend customizado; todas as funcionalidades rodam no lado do cliente ou são gerenciadas diretamente pelo Firebase.

---

## 🌐 Produção

O projeto está hospedado na **Vercel**. As variáveis de ambiente são gerenciadas diretamente pela plataforma.

---

### 📦 Scripts

Para facilitar o desenvolvimento e a manutenção, os seguintes scripts estão disponíveis:

* `pnpm dev`           # Inicia o ambiente de desenvolvimento
* `pnpm build`         # Cria a build de produção do projeto
* `pnpm start`         # Roda o projeto em modo de produção local
* `pnpm lint`          # Executa o ESLint para análise estática de código
* `pnpm generate`      # Gera arquivos com PlopJS para agilizar o desenvolvimento

### 🛠️ Instalação Local

Para configurar e rodar o projeto em sua máquina local, siga os passos abaixo:

```bash
git clone [https://github.com/seu-usuario/myroofs.git](https://github.com/seu-usuario/myroofs.git)
cd myroofs
pnpm install
pnpm dev
