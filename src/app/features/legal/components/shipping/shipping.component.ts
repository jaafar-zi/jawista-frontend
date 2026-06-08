// src/app/features/legal/components/shipping/shipping.component.ts

import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../../../core/services/seo.service';
import { LegalPageConfig } from '../../../../core/models/legal.model';
import { LegalFacade } from '../../facade/legal.facade';

@Component({
  selector: 'app-shipping',
  standalone: false,
  templateUrl: './shipping.component.html',
})
export class ShippingComponent implements OnInit {
  config!: LegalPageConfig;
  
  constructor(private readonly seo: SeoService,
                  private facade: LegalFacade) {}

  ngOnInit(): void {

    this.config = this.facade.getShippingConfig();

    this.seo.updateMetaFromKeys({
      titleKey:       'seo.legal.shipping.title',
      descriptionKey: 'seo.legal.shipping.description',
      keywordsKey:    'seo.legal.shipping.keywords',
    });
  }
}