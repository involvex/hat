# Agents.md - AI Agent Instructions

This file provides guidelines and instructions for AI agents working on this project.

## Project Overview

This is a React-based photo editor application built with TypeScript. The project uses React 18, TypeScript, and various modern web technologies.

## Useful Commands

### Development

```bash
# Start development server
bun run start

# Run tests
bun run test

# Build for production
bun run build
```

### Code Quality

```bash
# Format code with Prettier
bun run format

# Type check with TypeScript
bun run typecheck

# Lint code with ESLint
bun run lint

# Fix linting issues automatically
bun run lint:fix
```

### Deployment

```bash
# Deploy to GitHub Pages
bun run deploy
```

**Note:** The `prebuild` command runs format, typecheck, and lint:fix before building.

## Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Bun** - JavaScript runtime and package manager
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Tailwind CSS** - Styling
- **Styled Components** - Component-level styling
- **React Scripts** - Build and development tools

## Best Practices and Guidelines

### Code Style

- Use TypeScript for all new code
- Follow strict mode in TypeScript
- Use functional components with hooks
- Prefer arrow functions for callbacks
- Use meaningful variable and function names

### Formatting

- Run `bun run format` before committing
- The project uses Prettier with custom config
- Organize imports using the prettier-plugin-organize-imports

### Linting

- ESLint is configured with TypeScript and React support
- Unused variables must be prefixed with `_` to be ignored
- Run `bun run lint:fix` to automatically fix issues

### Testing

- Write tests using React Testing Library
- Include tests for new components
- Run tests before committing changes

### Git Workflow

- Create feature branches for new features
- Write descriptive commit messages
- Run `bun run prebuild` before building for production
- Ensure all tests pass before merging

### Component Guidelines

- Keep components small and focused
- Extract reusable logic into custom hooks
- Use TypeScript interfaces for props
- Colocate related files (component, styles, types, tests)

### Performance

- Use React.memo for expensive components
- Avoid unnecessary re-renders
- Lazy load routes and heavy components
- Optimize images and assets
