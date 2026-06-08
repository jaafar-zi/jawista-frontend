// src/app/core/animations/text-rotate.animations.ts

import {
  trigger,
  state,
  style,
  transition,
  animate,
  query,
  group
} from '@angular/animations';

export const textRotateX = trigger('textRotateX', [
  state('idle', style({})),
  state('hovered', style({})),

  transition('idle => hovered', [
    group([
      // front face rotates up and out
      query('.detail-text', [
        animate('500ms cubic-bezier(0.76, 0, 0.24, 1)', style({
          transform: 'rotateX(90deg) translateY(-50%) translateZ(0.5em)'
        }))
      ], { optional: true }),

      // ghost copy rotates up into view
      query('.detail-wrap', [
        animate('500ms cubic-bezier(0.76, 0, 0.24, 1)', style({
          transform: 'rotateX(90deg) translateY(-50%) translateZ(0.5em)'
        }))
      ], { optional: true })
    ])
  ]),

  transition('hovered => idle', [
    group([
      query('.detail-text', [
        animate('500ms cubic-bezier(0.76, 0, 0.24, 1)', style({
          transform: 'rotateX(0deg) translateY(0) translateZ(0)'
        }))
      ], { optional: true }),

      query('.detail-wrap', [
        animate('500ms cubic-bezier(0.76, 0, 0.24, 1)', style({
          transform: 'rotateX(0deg) translateY(0) translateZ(0)'
        }))
      ], { optional: true })
    ])
  ])
]);