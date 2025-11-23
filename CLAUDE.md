# CLAUDE.md - AI Assistant Development Guide

## Project Overview

**Project Name:** AI-Video-Prompt-Builder
**License:** MIT License (Copyright 2025 JWB)
**Repository Status:** Early stage development
**Primary Purpose:** A tool to help users build, craft, and optimize prompts for AI video generation systems

## Current Repository State

### Existing Files
- `README.md` - Minimal project documentation (needs expansion)
- `LICENSE` - MIT License
- `.gitignore` - Comprehensive Node.js/JavaScript/TypeScript configuration

### Technology Stack (Inferred)
Based on the `.gitignore` configuration, this project is set up to support:
- **Runtime:** Node.js
- **Languages:** JavaScript/TypeScript
- **Potential Frameworks:** Next.js, Nuxt.js, Vite, Vue, Svelte, or similar
- **Package Manager:** npm/yarn/pnpm

**Note:** The actual tech stack is not yet defined. When implementing, coordinate with the user to select appropriate technologies.

## Project Structure (To Be Established)

### Recommended Directory Structure
```
AI-Video-Prompt-Builder/
├── src/                    # Source code
│   ├── components/         # UI components
│   ├── lib/               # Core library code
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript type definitions
│   ├── hooks/             # React hooks (if using React)
│   └── styles/            # Styling files
├── public/                # Static assets
├── tests/                 # Test files
│   ├── unit/             # Unit tests
│   ├── integration/      # Integration tests
│   └── e2e/              # End-to-end tests
├── docs/                  # Documentation
├── scripts/               # Build and utility scripts
├── .env.example          # Environment variable template
├── package.json          # Project dependencies
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

## Development Workflows

### Getting Started Workflow
1. **Initial Setup:**
   - Determine tech stack with user input
   - Initialize package.json with `npm init` or similar
   - Install core dependencies
   - Set up build tooling (Vite, webpack, etc.)
   - Configure TypeScript (if using)
   - Set up linting (ESLint) and formatting (Prettier)

2. **Development Environment:**
   - Create `.env.example` for required environment variables
   - Set up development server with hot reload
   - Configure testing framework (Jest, Vitest, etc.)

3. **Git Workflow:**
   - Work on feature branches with `claude/` prefix
   - Commit frequently with clear, descriptive messages
   - Follow conventional commits format: `type(scope): description`
   - Push to origin with `-u` flag for branch tracking

### Feature Development Workflow
1. **Planning:**
   - Use TodoWrite tool to break down complex tasks
   - Identify affected files and components
   - Consider testing requirements upfront

2. **Implementation:**
   - Read existing code before making changes
   - Follow established patterns in the codebase
   - Keep changes focused and minimal
   - Avoid over-engineering solutions

3. **Testing:**
   - Write tests alongside features
   - Ensure all tests pass before committing
   - Test edge cases and error scenarios

4. **Documentation:**
   - Update relevant documentation
   - Add JSDoc comments for public APIs
   - Update README.md with new features

## Coding Conventions

### General Principles
- **Simplicity First:** Avoid premature abstractions and over-engineering
- **Explicit Over Implicit:** Make code intentions clear
- **DRY, But Pragmatic:** Don't abstract until a pattern appears 3+ times
- **Type Safety:** Prefer TypeScript for better developer experience
- **Accessibility:** Ensure UI is accessible (WCAG 2.1 AA minimum)

### Code Style
- Use **2 spaces** for indentation
- Use **single quotes** for strings (unless interpolation needed)
- Use **semicolons** consistently
- Use **trailing commas** in multi-line objects/arrays
- Maximum line length: **100 characters**
- Use **const** by default, **let** when reassignment needed, avoid **var**

### Naming Conventions
- **Files:** kebab-case (`prompt-builder.ts`)
- **Components:** PascalCase (`PromptBuilder.tsx`)
- **Functions/Variables:** camelCase (`buildPrompt`, `videoSettings`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_PROMPT_LENGTH`)
- **Types/Interfaces:** PascalCase (`VideoPromptConfig`)
- **Private properties:** Prefix with underscore (`_internalState`)

### Component Structure (React/Vue)
```typescript
// 1. Imports
import { useState } from 'react';
import { SomeComponent } from './components';

// 2. Types/Interfaces
interface Props {
  // ...
}

// 3. Component
export function ComponentName({ prop }: Props) {
  // 4. Hooks
  const [state, setState] = useState();

  // 5. Handlers
  const handleAction = () => {
    // ...
  };

  // 6. Render
  return (
    // ...
  );
}
```

### Function Guidelines
- **Keep functions small:** Single responsibility principle
- **Pure when possible:** Avoid side effects unless necessary
- **Named exports preferred:** Over default exports for better refactoring
- **Early returns:** Use guard clauses to reduce nesting
- **Error handling:** Use try/catch for async operations, proper error boundaries

### Comment Guidelines
- **When to comment:**
  - Complex business logic that isn't self-evident
  - Non-obvious performance optimizations
  - Workarounds for external library bugs
  - Public API documentation (JSDoc)

- **When NOT to comment:**
  - Self-explanatory code
  - What the code does (the code shows that)
  - Commented-out code (delete it instead)
  - Redundant information

## Security Best Practices

### Input Validation
- **Never trust user input:** Validate and sanitize all inputs
- **Use allowlists:** Instead of blocklists when possible
- **Escape output:** Prevent XSS attacks
- **Rate limiting:** Implement for API endpoints

### API Keys & Secrets
- **Never commit secrets:** Use environment variables
- **Provide .env.example:** Template without actual values
- **Rotate keys regularly:** Especially after exposure
- **Principle of least privilege:** Minimal permissions needed

### Common Vulnerabilities to Avoid
- **XSS:** Cross-Site Scripting
- **SQL Injection:** Use parameterized queries
- **CSRF:** Cross-Site Request Forgery
- **Command Injection:** Sanitize shell command inputs
- **Path Traversal:** Validate file paths
- **Denial of Service:** Rate limiting and input validation

## Testing Strategy

### Test Types
1. **Unit Tests:** Test individual functions/components in isolation
2. **Integration Tests:** Test component interactions
3. **E2E Tests:** Test critical user flows
4. **Accessibility Tests:** Automated a11y checks

### Testing Guidelines
- **Test behavior, not implementation:** Tests should survive refactoring
- **Arrange-Act-Assert pattern:** Clear test structure
- **Descriptive test names:** `it('should reject prompts exceeding max length')`
- **Mock external dependencies:** Keep tests fast and reliable
- **Aim for 80%+ coverage:** But focus on critical paths

## Error Handling

### Error Categories
1. **User Errors:** Invalid input, validation failures
2. **System Errors:** Network failures, API errors
3. **Programming Errors:** Bugs, logical errors

### Error Handling Pattern
```typescript
try {
  // Operation
  const result = await riskyOperation();
  return result;
} catch (error) {
  // Log for debugging
  console.error('Operation failed:', error);

  // User-friendly message
  throw new Error('Failed to process prompt. Please try again.');
}
```

### Error Boundaries (React)
- Implement error boundaries for UI components
- Provide fallback UI for better UX
- Log errors for monitoring

## Performance Considerations

### Optimization Guidelines
- **Measure first:** Use profiling tools before optimizing
- **Lazy load:** Code split and lazy load routes/components
- **Memoization:** Use React.memo, useMemo, useCallback judiciously
- **Debounce/Throttle:** User input and expensive operations
- **Virtual scrolling:** For long lists
- **Image optimization:** Proper formats, lazy loading, responsive images

### Bundle Size
- Monitor bundle size with each change
- Tree-shake unused code
- Use dynamic imports for large dependencies
- Consider lighter alternatives to heavy libraries

## AI Assistant Specific Guidelines

### Before Making Changes
1. **Read the code first:** Never modify files without reading them
2. **Understand context:** Check related files and dependencies
3. **Search before asking:** Use Grep/Glob to find existing patterns
4. **Verify assumptions:** Check file structure, imports, exports

### During Implementation
1. **Use TodoWrite:** For multi-step tasks, track progress
2. **Commit incrementally:** Small, logical commits
3. **Test as you go:** Don't wait until the end
4. **Handle errors properly:** Don't leave unhandled promise rejections
5. **Clean up:** Remove debugging code, unused imports, console.logs

### Code Quality Checklist
- [ ] Code follows established patterns in the codebase
- [ ] No security vulnerabilities introduced
- [ ] Error handling is comprehensive
- [ ] Tests are written and passing
- [ ] No unused imports or variables
- [ ] Code is properly typed (if TypeScript)
- [ ] Accessibility considerations addressed
- [ ] Performance implications considered
- [ ] Documentation updated if needed

### What to Avoid
- **Don't over-engineer:** Solve the current problem, not hypothetical futures
- **Don't add unnecessary features:** Stick to requirements
- **Don't refactor unrelated code:** Keep changes focused
- **Don't skip error handling:** Always handle edge cases
- **Don't commit secrets:** Check before committing
- **Don't use deprecated APIs:** Check documentation

### Communication Patterns
- **Be explicit:** State what you're doing and why
- **Show your work:** Explain significant decisions
- **Ask when uncertain:** Don't guess at requirements
- **Provide alternatives:** When multiple approaches exist
- **Reference code locations:** Use `file:line` format

## Git Commit Message Format

### Structure
```
type(scope): subject

body (optional)

footer (optional)
```

### Types
- **feat:** New feature
- **fix:** Bug fix
- **docs:** Documentation changes
- **style:** Code style changes (formatting, etc.)
- **refactor:** Code refactoring
- **test:** Adding or updating tests
- **chore:** Maintenance tasks
- **perf:** Performance improvements

### Examples
```
feat(prompt-builder): add character limit validation

Implement real-time character counting and validation
to ensure prompts don't exceed API limits.

Closes #123
```

```
fix(ui): resolve contrast issue in dark mode

Update button colors to meet WCAG AA standards
for better accessibility in dark mode.
```

## Project-Specific Guidelines

### AI Video Prompt Building Context
This tool is designed to help users create effective prompts for AI video generation. Consider:

1. **Prompt Structure:** Different AI video models may have different prompt formats
2. **Token Limits:** Most models have maximum input lengths
3. **Prompt Templates:** Users may want to save and reuse templates
4. **Guidance:** Provide tips for effective prompt writing
5. **Preview:** Allow users to preview or iterate on prompts
6. **Export:** Support multiple export formats
7. **Model Compatibility:** May need to support multiple AI video platforms

### Key Features to Consider
- Prompt editor with syntax highlighting
- Character/token counter
- Prompt templates library
- Prompt history
- Import/export functionality
- Tips and best practices
- Model-specific optimization
- Collaborative features (optional)

## Resources & References

### Documentation to Create
- [ ] README.md - Comprehensive project overview
- [ ] CONTRIBUTING.md - Contribution guidelines
- [ ] API.md - API documentation (when applicable)
- [ ] CHANGELOG.md - Version history
- [ ] DEPLOYMENT.md - Deployment instructions

### Useful Links (To be added)
- Project repository: [Add GitHub URL]
- Live demo: [Add when available]
- Documentation site: [Add when available]
- Issue tracker: [GitHub Issues]

## Changelog

### 2025-11-23
- Initial CLAUDE.md created
- Established coding conventions and workflows
- Defined project structure guidelines
- Set up security and testing guidelines

## Notes for Future Development

### Immediate Next Steps
1. **Define Tech Stack:** Choose framework (React, Vue, etc.)
2. **Initialize Project:** Set up package.json and tooling
3. **Create Basic Structure:** Implement recommended directory structure
4. **Set up Development Environment:** Configure dev server, linting, testing
5. **Design Core Features:** Define MVP feature set
6. **Implement Authentication:** If user accounts are needed
7. **Build Core UI:** Prompt editor and basic interface
8. **Add Prompt Logic:** Template system and validation

### Questions to Resolve
- [ ] What AI video platforms should be supported initially?
- [ ] Is this a web app, CLI tool, or both?
- [ ] Does it need user authentication and data persistence?
- [ ] Should prompts be stored locally or in a database?
- [ ] Are collaborative features required?
- [ ] What's the target audience (beginners, professionals, both)?

---

**Last Updated:** 2025-11-23
**Maintained By:** AI Assistants working on this project
**Status:** Living document - update as project evolves
