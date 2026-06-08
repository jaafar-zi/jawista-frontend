import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './layout/footer/footer.component';
import { SharedModule } from './shared/shared.module';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { CommunityModalComponent } from './layout/community-modal/community-modal.component';
import { TranslocoService } from '@jsverse/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PreferencesService } from './core/services/preferences.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    FooterComponent,
    SharedModule,
    NavbarComponent,
    CommunityModalComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {

  private readonly preferences = inject(PreferencesService);

  ngOnInit(): void {
    this.preferences.initialize();
  }
}