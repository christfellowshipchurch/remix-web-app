Run `pnpm check` to identify linter and type errors, then fix all issues found.

**Process:**
1. Execute `pnpm check` command (runs both `pnpm lint` and `pnpm typecheck`)
2. Analyze the output for:
   - ESLint errors and warnings
   - TypeScript type errors
   - Any other issues reported
3. Fix all identified issues:
   - Correct linter errors (ESLint violations)
   - Resolve TypeScript type errors
   - Address any warnings that should be fixed
4. Re-run `pnpm check` to verify all issues are resolved
5. Continue iterating until `pnpm check` passes with no errors

**Error Handling:**
- Fix errors systematically, starting with type errors (they often cause cascading issues)
- Then address linter errors
- Ensure code follows project conventions (kebab-case, single quotes, 2-space indentation)
- Maintain existing functionality while fixing errors
- Use proper TypeScript types (avoid `any` type)
- Follow React Router v7 patterns and best practices

**Note:** You can ignore linter warnings while debugging with console logs, but all errors must be fixed.
