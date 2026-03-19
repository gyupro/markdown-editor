# Markdown Editor - Claude Code Configuration

## Build Commands

- `npm run build` - Build project
- `npm run dev` - Development server
- `npm run lint` - Linting
- `npx tsc --noEmit` - Type checking

## File Organization

- `/src` - Source code
- `/tests` - Test files
- `/docs` - Documentation
- `/public` - Static assets

## Code Style

- **Modular Design**: Files under 500 lines
- **Environment Safety**: Never hardcode secrets
- **Clean Architecture**: Separate concerns
- **Immutability**: Create new objects, never mutate

## Important Rules

- Do what has been asked; nothing more, nothing less.
- NEVER create files unless they're absolutely necessary.
- ALWAYS prefer editing an existing file to creating a new one.
- NEVER proactively create documentation files (*.md) or README files.
- Never save working files, text/mds and tests to the root folder.
