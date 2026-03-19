# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

## [1.1.0] - 2026-03-17

### Added
- Email verification page (auto-verify via token in URL)
- Forgot password page with email input
- Reset password page with new password form
- Change email dialog in verification banner
- Legal links (privacy policy, terms of service) in login and register forms
- MIT license

### Fixed
- ESLint errors in VerifyEmailPage (async state management)

## [1.0.0] - 2026-03-06

### Added
- Framer Motion animations for todo list items
- Toast notifications (Sonner) for success/error feedback
- Skeleton loading placeholders
- Backdrop-blur header and elevated dialog shadows
- Default Active filter on load

### Changed
- Migrated to HTTPS with custom domain todo.mngerasimenko.ru
- Modernized UI palette with new color scheme

### Fixed
- Select vertical text alignment (line-height instead of padding)
- Nginx startup failure: Docker DNS resolver for upstream resolution

## [0.1.0] - 2026-02-25

### Added
- Status filter: All / Active / Done

### Changed
- Simplified Dockerfile: copy pre-built dist from CI instead of building inside Docker

## [0.0.1] - 2026-02-23

### Added
- Initial React SPA: TypeScript + Vite + Tailwind CSS + Zustand
- Login and registration
- Todo list with CRUD operations
- Task list selection
- JWT authentication with token refresh
- Dark mode support
- CI/CD pipeline (GitHub Actions → Docker Hub → server deploy)
