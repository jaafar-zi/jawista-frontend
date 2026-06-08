export interface SlideContent {
  id: string;
  imageUrl: string;
}

export interface CursorPosition {
  x: number;
  y: number;
}

export enum NavigationDirection {
  PREV = 'PREV',
  NEXT = 'NEXT',
  NONE = '',
}