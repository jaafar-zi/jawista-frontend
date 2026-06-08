// src/app/core/models/newsletter.model.ts

export interface NewsletterSubscription {
  name:  string;
  email: string;
}

export interface NewsletterResponse {
  success: boolean;
  message: string;
}

export type NewsletterStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error'
  | 'already-subscribed';