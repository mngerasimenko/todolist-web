# Todo List — Web UI

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![Docker](https://img.shields.io/badge/Docker-24+-2496ED?logo=docker)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI%2FCD-2088FF?logo=github-actions)

React SPA для управления списком задач. Подключается к [Todo List серверу](https://github.com/mngerasimenko/todo) через REST API с JWT-аутентификацией.

---

## Demo

Приложение развернуто и доступно по адресу:

**[Попробовать онлайн](http://185.244.172.45:3000)**
Логин: `testUser` | Пароль: `testUser`

---

## Возможности

- Вход и регистрация по логину/паролю
- Совместная работа через списки задач (создание, вступление по паролю, роли ADMIN/USER)
- Просмотр, создание и редактирование задач
- Приватные задачи, видимые только создателю
- Отметка задач как выполненных (оптимистичное обновление)
- Цветные индикаторы создателя задачи
- Фильтрация задач по тексту
- Автоматическое обновление JWT-токена при истечении
- Автоматический выход при невалидном токене (401)
- Управление списками: участники, выход, смена активного списка

---

## Технологический стек

| Категория         | Технология                        | Версия  |
|-------------------|-----------------------------------|---------|
| **Язык**          | TypeScript                        | 5       |
| **UI-фреймворк**  | React                             | 19      |
| **Сборщик**       | Vite                              | 7       |
| **Стили**         | Tailwind CSS                      | 4       |
| **Компоненты**    | shadcn/ui                         | -       |
| **HTTP-клиент**   | Axios                             | -       |
| **State**         | Zustand                           | 5       |
| **Маршрутизация** | React Router                      | 7       |
| **Иконки**        | Lucide React                      | -       |
| **Веб-сервер**    | nginx:alpine                      | -       |
| **Контейнеры**    | Docker + Docker Compose           | 24+     |
| **CI/CD**         | GitHub Actions                    | -       |

---

## Архитектура

```
[React SPA (nginx:3000)] → /api/* proxy → [Spring Boot API (:8090)] → [PostgreSQL]
```

### Структура проекта

```
src/
├── api/
│   ├── client.ts          — Axios с JWT interceptor и автообновлением токена
│   ├── auth.ts            — login, register, refresh
│   ├── todos.ts           — CRUD задач + toggle done/undone
│   ├── lists.ts           — CRUD списков + участники
│   └── users.ts           — текущий пользователь (/api/users/me)
├── store/
│   ├── authStore.ts       — Zustand: user, isAuthenticated, login/logout/restoreSession
│   └── todoStore.ts       — Zustand: todos, lists, CRUD + оптимистичное обновление
├── components/
│   ├── ui/                — shadcn/ui компоненты (Button, Input, Dialog, Tabs...)
│   ├── auth/              — LoginForm, RegisterForm, ProtectedRoute
│   ├── layout/            — Header, AppLayout
│   ├── todo/              — TodoItem, TodoList, TodoForm, TodoFilter
│   └── lists/             — ListManagement (4 вкладки: мои/создать/вступить/участники)
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── TodoPage.tsx
├── types/
│   └── index.ts           — TypeScript типы (зеркало серверных DTO)
└── lib/
    └── utils.ts           — cn (className helper)
```

### JWT-стратегия

- **Access token** — хранится в памяти (Zustand), не сохраняется между перезагрузками
- **Refresh token** — хранится в `localStorage`, сохраняется между сессиями
- **Восстановление сессии** — при загрузке страницы: refresh → `/api/users/me` → восстановление user
- **Перехватчик 401** — при ошибке делает refresh, ставит запросы в очередь, повторяет их

### Маршруты

| Путь | Компонент | Доступ |
|------|-----------|--------|
| `/login` | LoginPage | Публичный |
| `/register` | RegisterPage | Публичный |
| `/` | TodoPage | Защищённый |
| `*` | → `/` | Редирект |

---

## Быстрый запуск

### Требования
- Node.js 20+
- Запущенный Todo List сервер (или Docker Compose)

### Локальная разработка

```bash
npm install
npm run dev
```

Откроется на `http://localhost:5173`. Настройте URL сервера в `.env`:

```env
VITE_API_URL=http://localhost:8090
```

### Docker Compose (вместе с бэкендом)

```bash
# В папке shoppinglist (бэкенд)
docker compose up -d --build
```

React UI будет доступен на `http://localhost:3000`.

### Команды

```bash
npm run dev       # Запуск dev-сервера (Vite HMR)
npm run build     # Продакшн-сборка в dist/
npm run lint      # ESLint
npx tsc -b        # TypeScript check
```

---

## Docker

Двухстадийная сборка:

```dockerfile
FROM node:20-alpine AS builder   # npm ci + npm run build
FROM nginx:alpine                # копировать dist/ + nginx.conf
```

nginx обеспечивает:
- SPA-роутинг: `try_files $uri /index.html`
- Proxy `/api/` → `http://todo-app:8090`
- Gzip-сжатие статики
- Кэширование assets (1 год)

---

## CI/CD

`.github/workflows/deploy.yml`:

**Этап 1 — Проверка кода** (все PR и push в master):
- `npm ci` → `npm run lint` → `npx tsc -b` → `npm run build`

**Этап 2 — Деплой** (только push в master):
- Сборка Docker-образа → push в Docker Hub (`mngerasimenko/todo-web`)
- Деплой на сервер через SSH (`appleboy/ssh-action`)
- Порт на сервере: 3000

---

## Связанные проекты

- [Todo List — сервер](https://github.com/mngerasimenko/todo) — Spring Boot REST API бэкенд
- [Todo List — Android](https://github.com/mngerasimenko/todolist-android) — нативный Android-клиент (Kotlin + Jetpack Compose)
