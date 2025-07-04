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

## 📦 Scripts

Para facilitar o desenvolvimento e a manutenção, os seguintes scripts estão disponíveis:

pnpm dev       # Inicia o ambiente de desenvolvimento
pnpm build     # Cria a build de produção do projeto
pnpm start     # Roda o projeto em modo de produção local
pnpm lint      # Executa o ESLint para análise estática de código
pnpm generate  # Gera arquivos com PlopJS para agilizar o desenvolvimento 


## 🛠️ Instalação Local
Para configurar e rodar o projeto em sua máquina local, siga os passos abaixo:

git clone [https://github.com/seu-usuario/myroofs.git](https://github.com/seu-usuario/myroofs.git)
cd myroofs
pnpm install
pnpm dev

## Variáveis de Ambiente
# URLs Públicas do Next.js
NEXT_PUBLIC_LOGIN_URL=https://web.myroofs.com.br

# Credenciais do Nodemailer
NEXT_PUBLIC_NODEMAILER_PASS=bwko bufu mivr csqp
NEXT_PUBLIC_NODEMAILER_USER=cadastro.myroofs@gmail.com

# Token de Acesso do Expo
EXPO_ACCESS_TOKEN=tgWggPh1XBqxUB_KfSDP4LWHRTVUGpvuJgYTMqo0

# Credenciais da API Vonage
NEXT_PUBLIC_VONAGE_API_SECRET=aWBXbs9Hu1hJ1f4A
NEXT_PUBLIC_VONAGE_API_KEY=4290378b

# Credenciais do Firebase Admin SDK (A Chave Privada requer manuseio cuidadoso)
NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL=firebase-adminsdk-83lve@myroofs-c05e0.iam.gserviceaccount.com
NEXT_PUBLIC_FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC5zmAzC4WZbEyE\nMnaA1u394gg9HSp7WpYi3FooPdtwkj34kAjA+IhpXsZcQ/4nSt5A6f/ocIlqcZ33\n9h7HRvb/vImkvVHse2ufANfMJcyDp5zgtJlFSM5N8eT/RyVIJGiG6TeBMoNPkvy2\nvIW1F3Xyy2fxLid5DZoJQuHr/kkUWRWbGuga0kw2/3lMnPkI5htsD5nFKXk+USiI\n1XY7k5gPRHj1M4xi6BSKSCOoPRsDm63p5i3ycjzoZSgdjhgpOaYWYXTZuFzduqvb\nMOsY17hZZCEfakgsUPnt3KEX8ZTtFPRf5hLgKhydFbySiKojjKit0VRpTGWQe1z2\n3NLEfBQ3AgMBAAECggEABgTccurdohGzDNlBo3zS6tWGpMwsEyDlGi3/MayHTkc+\ngK3RysaCTL+IN3bwZb90IbAy3QnAOdWCY4TyjEwNNk2aO97yJ3H8E4OIehGDZYRp\fZH8IRVxsW6zl11rpMGhLTWi2amUPWCqlRTYU/x1kq7qKBLxrmc1ZTVociejoGgQ\nPBxvKvE1rH2qE1BZBj60cQnMjOtqP7wTAurQPcMWBFazp3u7ExiS0hTcmcyIQ5qtX\n+DYRYrY2jlHWm9+rQWj3cM3ivXm51kIILyjuei7tklzNkfqkX5OX91jvKdhJnG4F\tEj0pQmb8lmCa2h34kVCkXpKEOj8MvG0a0xl1IAJ6QKBgQDeSqgmPpIGgVJeuvS7\nwa0EQe8FXR2UxcSbs8Dlqh4eeEv0cbKMiW2fzecr5U1O+oaZqZJSfO0VxOLUDUg/\nsCEmlS+b+cf5ptwOUJnlRBpu2KS1jDLf48hh6bC2Mr2EIGBPsnXDNKJFdVXgBY+4\n1gWvzAFbZAUHpxkYLz5zjyZaYwKBgQDV+1sW06Tivwp899yINcVeGVZKCjx3r53x\n4gEC0ACn18Iik7yAK/wCboVssaGIqTBBCqnDAc7MJ3DaMBLSrOuJyC3sPshQ4zM2\nTFrGRPRNkVfYutztQt6++NlBgFc4oF/6InI/wPbHmtotOzrd65h58Ey2MWgIL1WQ\nQ9eiQ/D9HQKBgGxiFk5fX6+QSmsp2L3bFtLmmvYQiqXJL62DHWBda8YLfW04Kohf\nUXYDXN2INgN2Hz648UEK7EYa80XVHA8Bf4hiYQ454YkWFGFeZ0rjw8ecFeL28q87\nTq5+1MxhPQo5BvyU1NpSxXP8W9yYmZTTtX4bh+XZhKJQlOm3z0lk2JxlAoGBAJqd\n3EzbMypwdmikROLbT7jVwAcR7G1jJVKRRr+8gqzE9086xxsqLReoupo2pAz2i5qD\n1PTGiqHz4dSWphM6xZsyXRR2rRHdibSzaWgYjRq7ael95INALWl6sKlmzh9pqtA4\nMaulh+vlFb9XLAsM4IlDvHptqsk3QrFShC6Iv0p1AoGAMpzf9srp8v0rIUJGQWpi\nYHbYUlZvAGnd8PEAmoX872oyYwiqwr8jVvh9u8ZZzK7Fv1+9PJ+p3FxSumeZSxKR\nr6Czn8u76Yh10A3zF+GJs+f24iuXbw2Lt043HyrNdGVkmaXrNgULX0ZbcjyELLtx\nkeN+OiKv9QoQCh+cV1muC9A=\n-----END PRIVATE KEY-----"

# Configuração do Firebase para o Cliente
NEXT_PUBLIC_FIREBASE_APP_ID=1:213315135729:web:56a3409aa5e59d256c6150
NEXT_PUBLIC_FIREBASE_MESSAGIN_SENDER_ID=213315135729
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=myroofs-c05e0.appspot.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=myroofs-c05e0
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=myroofs-c05e0.firebaseapp.com
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDxEFztZ1qf-tie5prIFGeDzo6Q2xwdM0Q
