import {
  trigger,
  state,
  style,
  transition,
  animate,
  query,
  stagger,
  animateChild,
  group,
  sequence
} from '@angular/animations';

export const menuAnimations = {
  menuState: trigger('menuState', [
    state('closed', style({ display: 'none' })),
    state('open', style({ display: 'block' })),

    transition('closed => open', [
      style({ display: 'block' }),
      sequence([
        query('@menuLinkSlide', animateChild(), { optional: true }),
        group([
          query('@overlayFade', animateChild(), { optional: true }),
          query('@panelSlide', animateChild(), { optional: true }),
          query('@fadeIn', animateChild(), { optional: true }),
        ])
      ])
    ]),

    transition('open => closed', [
      sequence([
        group([
          query('@overlayFade', animateChild(), { optional: true }),
          query('@panelSlide', animateChild(), { optional: true }),
          query('@fadeIn', animateChild(), { optional: true }),
        ]),
        query('@menuLinkSlide', animateChild(), { optional: true }),
      ]),
      animate('1ms', style({ display: 'none' }))
    ])
  ]),

  overlayFade: trigger('overlayFade', [
    state('closed', style({ opacity: 0, visibility: 'hidden' })),
    state('open', style({ opacity: 1, visibility: 'visible' })),
    transition('closed => open', animate('250ms ease-out')),
    transition('open => closed', animate('250ms ease-in'))
  ]),

  panelSlide: trigger('panelSlide', [
    state('closed', style({ transform: 'translateY(-101%)' })),
    state('open', style({ transform: 'translateY(0%)' })),
    transition('closed => open', animate('400ms cubic-bezier(0.645, 0.045, 0.355, 1.000)')),
    transition('open => closed', animate('300ms cubic-bezier(0.645, 0.045, 0.355, 1.000)'))
  ]),

  fadeIn: trigger('fadeIn', [
    state('closed', style({ opacity: 0, visibility: 'hidden' })),
    state('open', style({ opacity: 1, visibility: 'visible' })),
    transition('closed => open', animate('250ms 100ms ease-out')),
    transition('open => closed', animate('200ms ease-in'))
  ]),

  menuLinkSlide: trigger('menuLinkSlide', [
    state('closed', style({ transform: 'translateY(-140%)', opacity: 0 })),
    state('open', style({ transform: 'translateY(0%)', opacity: 1 })),
    transition('closed => open', animate('350ms cubic-bezier(0.645, 0.045, 0.355, 1.000)')),
    transition('open => closed', animate('250ms cubic-bezier(0.645, 0.045, 0.355, 1.000)'))
  ]),

  staggerMenuItems: trigger('staggerMenuItems', [
    transition('* => *', [
      query(':enter', [
        style({ opacity: 0, transform: 'translateY(-140%)' }),
        stagger('60ms', [
          animate('350ms cubic-bezier(0.645, 0.045, 0.355, 1.000)',
            style({ opacity: 1, transform: 'translateY(0%)' }))
        ])
      ], { optional: true })
    ])
  ]),

  imageClipPath: trigger('imageClipPath', [
    state('hidden', style({
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
      transform: 'translateY(-50%)'
    })),
    state('visible', style({
      clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
      transform: 'translateY(0%)'
    })),
    transition('hidden => visible', animate('400ms cubic-bezier(0.645, 0.045, 0.355, 1.000)')),
    transition('visible => hidden', animate('300ms cubic-bezier(0.645, 0.045, 0.355, 1.000)'))
  ])
};