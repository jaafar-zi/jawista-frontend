// src/app/features/products/components/collection-header/products-collection-header.component.ts
import {
  Component,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'app-products-collection-header',
  standalone: false,
  templateUrl: './products-collection-header.component.html',
  styleUrls: ['./products-collection-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsCollectionHeaderComponent {
  @Input() collectionName = '';
  @Input() productCount = 0;
  @Input() year: number = new Date().getFullYear();
}