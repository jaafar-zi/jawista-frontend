import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonComponent } from './components/button/button.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { InputComponent } from './components/input/input.component';
import { ModalComponent } from './components/modal/modal.component';
import { LoaderComponent } from './components/loader/loader.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { HighlightPipe } from './pipes/highlight.pipe';
import { HighlightDirective } from './directives/highlight.directive';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { ProductCardSlideComponent } from './components/product-card-slide/product-card-slide.component';
import { InfiniteProductScrollComponent } from './components/infinite-product-scroll/infinite-product-scroll.component';
import { HorizontalProductCarouselComponent } from './components/horizontal-product-carousel/horizontal-product-carousel.component';
import { CursorHoverElementComponent } from './components/cursor-hover-element/cursor-hover-element.component';
import { SectionTitleComponent } from './components/section-title/section-title.component';
import { TranslocoModule } from '@jsverse/transloco';
import { CurrencyFormatPipe } from './pipes/currency-format.pipe';
import { LogoIconComponent } from './components/logo-icon/logo-icon.component';
import { SectionContainerComponent } from './components/section-container/section-container.component';
import { LabelTextComponent } from './components/label-text/label-text.component';
import { DescriptionTextComponent } from './components/description-text/description-text.component';
import { LinkWrapperComponent } from './components/link-wrapper/link-wrapper.component';
import { CoverImageComponent } from './components/cover-image/cover-image.component';
import { ArrowIconComponent } from './components/arrow-icon/arrow-icon.component';
import { SearchIconComponent } from './components/search-icon/search-icon.component';
import { QuantitySelectorComponent } from './components/quantity-selector/quantity-selector.component';
import { AccordionComponent } from './components/accordion/accordion.component';
import { OptionSelectorComponent } from './components/option-selector/option-selector.component';
import { StatusMessageComponent } from './components/status-message/status-message.component';
import { AsyncStateWrapperComponent } from './components/async-state-wrapper/async-state-wrapper.component';
import { SkeletonComponent } from './components/skeleton/skeleton.component';
import { FlickthroughHoverDirective, FlickthroughImgHoverDirective } from './directives/flickthrough.directive';
import { FormInputComponent } from './components/form-input/form-input.component';
import { FormCheckboxComponent } from './components/form-checkbox/form-checkbox.component';

const COMPONENTS = [
  ButtonComponent,
  ProductCardComponent,
  ProductCardSlideComponent,
  CursorHoverElementComponent,
  HorizontalProductCarouselComponent,
  InfiniteProductScrollComponent,
  InputComponent,
  ModalComponent,
  LoaderComponent,
  EmptyStateComponent,
  SectionTitleComponent,
  LogoIconComponent,
  SectionContainerComponent,
  LabelTextComponent,
  DescriptionTextComponent,
  LinkWrapperComponent,
  CoverImageComponent,
  ArrowIconComponent,
  SearchIconComponent,
  QuantitySelectorComponent,
  AccordionComponent,
  OptionSelectorComponent,
  StatusMessageComponent,
  AsyncStateWrapperComponent,
  SkeletonComponent,
  FlickthroughHoverDirective,
  FlickthroughImgHoverDirective,
  FormInputComponent,
  FormCheckboxComponent,
];

const DIRECTIVES = [
  HighlightDirective
];

const PIPES = [
  TruncatePipe,
  HighlightPipe,
  CurrencyFormatPipe,
];

const MODULES = [
  CommonModule,
  RouterModule,
  FormsModule,
  TranslocoModule,
  ReactiveFormsModule
];

@NgModule({
  declarations: [
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES
  ],
  imports: [
    ...MODULES
  ],
  exports: [
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES,
    ...MODULES
  ]
})
export class SharedModule { }