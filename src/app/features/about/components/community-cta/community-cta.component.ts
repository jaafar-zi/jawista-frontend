// community-cta.component.ts
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-community-cta',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './community-cta.component.html',
  styleUrls: ['./community-cta.component.scss'],
})
export class CommunityCtaComponent {
  @Input({ required: true }) instagramUrl!: string;
}