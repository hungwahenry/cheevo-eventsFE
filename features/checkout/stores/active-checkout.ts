import { create } from 'zustand';

export type CheckoutPhase =
  | 'idle'
  | 'paying'
  | 'confirming'
  | 'paid'
  | 'pending'
  | 'failed'
  | 'cancelled';

type ActiveCheckoutState = {
  orderId: string | null;
  authorizationUrl: string | null;
  phase: CheckoutPhase;
  setActive: (orderId: string, authorizationUrl: string) => void;
  setPhase: (phase: CheckoutPhase) => void;
  clear: () => void;
};

const TERMINAL: ReadonlySet<CheckoutPhase> = new Set<CheckoutPhase>([
  'paid',
  'pending',
  'failed',
  'cancelled',
]);

export const useActiveCheckoutStore = create<ActiveCheckoutState>((set) => ({
  orderId: null,
  authorizationUrl: null,
  phase: 'idle',
  setActive: (orderId, authorizationUrl) =>
    set({ orderId, authorizationUrl, phase: 'idle' }),
  setPhase: (phase) => set({ phase }),
  clear: () => set({ orderId: null, authorizationUrl: null, phase: 'idle' }),
}));

export function isTerminalPhase(phase: CheckoutPhase): boolean {
  return TERMINAL.has(phase);
}
