import { vi } from 'vitest';
Object.defineProperty(window, 'matchMedia', { writable: true, value: vi.fn().mockImplementation(query => ({ matches: query.includes('reduced-motion'), media: query, addEventListener: vi.fn(), removeEventListener: vi.fn() })) });
class Observer { observe() {} unobserve() {} disconnect() {} }
vi.stubGlobal('IntersectionObserver', Observer);
vi.stubGlobal('ResizeObserver', Observer);
window.scrollTo = vi.fn();
HTMLDialogElement.prototype.showModal = function(){ this.setAttribute('open', ''); };
HTMLDialogElement.prototype.close = function(){ this.removeAttribute('open'); };
Object.defineProperty(navigator, 'clipboard', { value: { writeText: vi.fn().mockResolvedValue(undefined) }, configurable: true });
