// legal.facade.ts
import { Injectable } from '@angular/core';
import { LegalPageConfig } from '../../../core/models/legal.model';

@Injectable({ providedIn: 'root' })
export class LegalFacade {

  // ── Privacy Policy ────────────────────────────────────────────────────────
  getPrivacyPolicyConfig(): LegalPageConfig {
    return {
      pageTitleKey: 'legal.privacyPolicy.title',
      lastUpdatedKey: 'legal.privacyPolicy.lastUpdated',
      sections: [
        {
          id: 'introduction',
          titleKey: 'legal.privacyPolicy.sections.introduction.title',
          contentKey: 'legal.privacyPolicy.sections.introduction.content',
        },
        {
          id: 'data-collected',
          titleKey: 'legal.privacyPolicy.sections.dataCollected.title',
          contentKey: 'legal.privacyPolicy.sections.dataCollected.content',
        },
        {
          id: 'use-of-data',
          titleKey: 'legal.privacyPolicy.sections.useOfData.title',
          contentKey: 'legal.privacyPolicy.sections.useOfData.content',
        },
        {
          id: 'data-sharing',
          titleKey: 'legal.privacyPolicy.sections.dataSharing.title',
          contentKey: 'legal.privacyPolicy.sections.dataSharing.content',
        },
        {
          id: 'security',
          titleKey: 'legal.privacyPolicy.sections.security.title',
          contentKey: 'legal.privacyPolicy.sections.security.content',
        },
        {
          id: 'external-links',
          titleKey: 'legal.privacyPolicy.sections.externalLinks.title',
          contentKey: 'legal.privacyPolicy.sections.externalLinks.content',
        },
        {
          id: 'consent',
          titleKey: 'legal.privacyPolicy.sections.consent.title',
          contentKey: 'legal.privacyPolicy.sections.consent.content',
        },
      ],
    };
  }

  // ── Refund Policy ─────────────────────────────────────────────────────────
  getRefundsConfig(): LegalPageConfig {
    return {
      pageTitleKey: 'legal.refunds.title',
      lastUpdatedKey: 'legal.refunds.lastUpdated',
      sections: [
        {
          id: 'general-conditions',
          titleKey: 'legal.refunds.sections.generalConditions.title',
          contentKey: 'legal.refunds.sections.generalConditions.content',
        },
        {
          id: 'return-conditions',
          titleKey: 'legal.refunds.sections.returnConditions.title',
          contentKey: 'legal.refunds.sections.returnConditions.content',
        },
        {
          id: 'timeframes',
          titleKey: 'legal.refunds.sections.timeframes.title',
          contentKey: 'legal.refunds.sections.timeframes.content',
        },
        {
          id: 'full-refund',
          titleKey: 'legal.refunds.sections.fullRefund.title',
          contentKey: 'legal.refunds.sections.fullRefund.content',
        },
        {
          id: 'returns-without-defect',
          titleKey: 'legal.refunds.sections.returnsWithoutDefect.title',
          contentKey: 'legal.refunds.sections.returnsWithoutDefect.content',
        },
        {
          id: 'contact',
          titleKey: 'legal.refunds.sections.contact.title',
          contentKey: 'legal.refunds.sections.contact.content',
        },
      ],
    };
  }

  // ── Shipping Policy ───────────────────────────────────────────────────────
  getShippingConfig(): LegalPageConfig {
    return {
      pageTitleKey: 'legal.shipping.title',
      lastUpdatedKey: 'legal.shipping.lastUpdated',
      sections: [
        {
          id: 'delivery',
          titleKey: 'legal.shipping.sections.delivery.title',
          contentKey: 'legal.shipping.sections.delivery.content',
        },
        {
          id: 'processing-time',
          titleKey: 'legal.shipping.sections.processingTime.title',
          contentKey: 'legal.shipping.sections.processingTime.content',
        },
        {
          id: 'shipping-rates',
          titleKey: 'legal.shipping.sections.shippingRates.title',
          contentKey: 'legal.shipping.sections.shippingRates.content',
        },
        {
          id: 'tracking',
          titleKey: 'legal.shipping.sections.tracking.title',
          contentKey: 'legal.shipping.sections.tracking.content',
        },
        {
          id: 'lost-damaged',
          titleKey: 'legal.shipping.sections.lostDamaged.title',
          contentKey: 'legal.shipping.sections.lostDamaged.content',
        },
      ],
    };
  }

  // ── Terms & Conditions ────────────────────────────────────────────────────
  getTermsOfServiceConfig(): LegalPageConfig {
    return {
      pageTitleKey: 'legal.terms.title',
      lastUpdatedKey: 'legal.terms.lastUpdated',
      sections: [
        {
          id: 'introduction',
          titleKey: 'legal.terms.sections.introduction.title',
          contentKey: 'legal.terms.sections.introduction.content',
        },
        {
          id: 'use-of-website',
          titleKey: 'legal.terms.sections.useOfWebsite.title',
          contentKey: 'legal.terms.sections.useOfWebsite.content',
        },
        {
          id: 'orders-pricing',
          titleKey: 'legal.terms.sections.ordersPricing.title',
          contentKey: 'legal.terms.sections.ordersPricing.content',
        },
        {
          id: 'intellectual-property',
          titleKey: 'legal.terms.sections.intellectualProperty.title',
          contentKey: 'legal.terms.sections.intellectualProperty.content',
        },
        {
          id: 'liability',
          titleKey: 'legal.terms.sections.liability.title',
          contentKey: 'legal.terms.sections.liability.content',
        },
        {
          id: 'termination',
          titleKey: 'legal.terms.sections.termination.title',
          contentKey: 'legal.terms.sections.termination.content',
        },
        {
          id: 'governing-law',
          titleKey: 'legal.terms.sections.governingLaw.title',
          contentKey: 'legal.terms.sections.governingLaw.content',
        },
      ],
    };
  }
}