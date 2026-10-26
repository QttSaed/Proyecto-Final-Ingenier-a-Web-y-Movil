import { expect, vi } from 'vitest';
import matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);

window.matchMedia = window.matchMedia || function() {
  return { matches: false, addListener() {}, removeListener() {} } as unknown as MediaQueryList;
};

// jsdom does not implement scrollTo
if (typeof window !== 'undefined') {
  window.scrollTo = vi.fn();
  if (Element.prototype.scrollTo) {
    Element.prototype.scrollTo = vi.fn();
  }
}
