import { config } from '@vue/test-utils';
import { Quasar } from 'quasar';

// Configure Vue Test Utils to use Quasar globally
config.global.plugins = [
  [Quasar, {
    plugins: {},
  }],
];

// Mock window.matchMedia for Quasar components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock CSS.supports for Quasar
if (typeof CSS === 'undefined') {
  (global as any).CSS = {
    supports: () => false,
  };
}
