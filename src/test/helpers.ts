import { render, type RenderOptions } from '@testing-library/react';
import { createElement, type ReactElement } from 'react';
import { LocaleProvider } from '../lib/i18n';

/**
 * Render a component wrapped in LocaleProvider.
 * Defaults to English locale (clean localStorage).
 */
export function renderWithLocale(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, {
    wrapper: ({ children }) => createElement(LocaleProvider, null, children),
    ...options,
  });
}

/**
 * Assert that a number is approximately equal to an expected value
 * within a given tolerance (absolute or relative).
 */
export function expectApprox(
  actual: number,
  expected: number,
  tolerance = 0.01
) {
  const diff = Math.abs(actual - expected);
  const relTolerance = Math.abs(expected) * tolerance;
  const absTolerance = Math.max(relTolerance, 0.001);
  expect(diff).toBeLessThanOrEqual(absTolerance);
}
