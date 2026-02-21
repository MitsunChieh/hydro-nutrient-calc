Run code quality checks for the project:

1. `npx tsc --noEmit` — TypeScript type check must pass with zero errors
2. `npm test` — all tests must pass
3. `npm run test:coverage` — report coverage summary; flag any source file below 80% line coverage
4. `npx astro build` — production build must succeed

Report a summary of all checks with pass/fail status.
