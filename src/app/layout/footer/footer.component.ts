import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewsletterService } from '../services/newsletter.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-footer',
  standalone:true,
  templateUrl: './footer.component.html',
  imports: [CommonModule, ReactiveFormsModule, TranslocoModule, SharedModule, RouterModule],
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  newsletterForm: FormGroup;
  currentYear = new Date().getFullYear();
  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  siteIndex = [
  { label: 'footer.siteIndex.links.shopNow',   link: 'collections/all' },
  { label: 'footer.siteIndex.links.aboutUs',    link: '/about' }
  ];

  social = [
    { label: 'footer.social.links.instagram', link: 'https://www.instagram.com/jawista.club/', external: true },
    { label: 'footer.social.links.phone',     link: 'tel:+21652025802',     external: false }
  ];

  connect = [
    { label: 'footer.connect.links.email', link: 'mailto:info@jawista.com', external: false }
  ];

  legal = [
    { label: 'footer.legal.links.privacyPolicy',  link: '/privacy' },
    { label: 'footer.legal.links.returns',         link: '/returns' },
    { label: 'footer.legal.links.termsOfService',  link: '/terms' }
  ];

  constructor(
    private fb: FormBuilder,
    private newsletterService: NewsletterService
  ) {
    this.newsletterForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.newsletterForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitError = '';
      this.submitSuccess = false;

      const formData = this.newsletterForm.value;

      this.newsletterService.subscribe(formData).subscribe({
        next: (response) => {
          this.submitSuccess = true;
          this.newsletterForm.reset();
          this.isSubmitting = false;
          
          // Hide success message after 3 seconds
          setTimeout(() => {
            this.submitSuccess = false;
          }, 3000);
        },
        error: (error) => {
          const errorMessage = 'Subscription failed. Please try again.';
          this.submitError = error.error?.message || errorMessage;
          this.isSubmitting = false;
        }
      });
    } else {
      Object.keys(this.newsletterForm.controls).forEach(key => {
        this.newsletterForm.get(key)?.markAsTouched();
      });
    }
  }

  get name() {
    return this.newsletterForm.get('name');
  }

  get email() {
    return this.newsletterForm.get('email');
  }
}