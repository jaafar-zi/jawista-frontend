// ─── Interfaces ───────────────────────────────────────────────
export interface Subscriber {
  id: number;
  name: string;
  email: string;
  active: boolean;
  initials: string;
  statusLabel: string;
  statusColor: SubscriberStatusColor;
}

export type SubscriberStatusColor = 'success' | 'danger';

// ─── Payloads ─────────────────────────────────────────────────
export interface SubscribePayload {
  name: string;
  email: string;
}

export interface UnsubscribePayload {
  email: string;
}

// ─── Filters ──────────────────────────────────────────────────
export interface SubscriberFilter {
  active?: boolean;
  searchTerm?: string;
}