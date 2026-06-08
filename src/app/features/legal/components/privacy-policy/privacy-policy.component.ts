// src/app/features/legal/components/privacy-policy/privacy-policy.component.ts

import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../../../core/services/seo.service';
import { LegalPageConfig } from '../../../../core/models/legal.model';
import { LegalFacade } from '../../facade/legal.facade';

@Component({
  selector: 'app-privacy-policy',
  standalone: false,
  templateUrl: './privacy-policy.component.html',
})
export class PrivacyPolicyComponent implements OnInit {
  
  config!: LegalPageConfig;

  constructor(private readonly seo: SeoService,
              private facade: LegalFacade) {}

  ngOnInit(): void {
  
    this.config = this.facade.getPrivacyPolicyConfig();

    this.seo.updateMetaFromKeys({
      titleKey:       'seo.legal.privacyPolicy.title',
      descriptionKey: 'seo.legal.privacyPolicy.description',
      keywordsKey:    'seo.legal.privacyPolicy.keywords',
    });
  }
}