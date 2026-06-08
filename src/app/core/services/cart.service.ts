import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;

  private cartSubject = new BehaviorSubject<Cart>(this.getInitialCart());
  public cart$: Observable<Cart> = this.cartSubject.asObservable();

  private cartOpenSubject = new BehaviorSubject<boolean>(false);
  public cartOpen$: Observable<boolean> = this.cartOpenSubject.asObservable();

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.loadCartFromStorage();
    }
  }

  private getInitialCart(): Cart {
    return {
      items: [],
      total: 0,
      subtotal: 0,
      currency: 'ZAR',
      itemCount: 0
    };
  }

  private loadCartFromStorage(): void {
    if (!this.isBrowser) return;

    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const cart = JSON.parse(savedCart);
        this.cartSubject.next(cart);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      this.cartSubject.next(this.getInitialCart());
    }
  }

  private saveCartToStorage(): void {
    if (!this.isBrowser) return;

    try {
      localStorage.setItem('cart', JSON.stringify(this.cartSubject.value));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }

  private calculateCartTotals(items: CartItem[]): {
    subtotal: number;
    total: number;
    itemCount: number;
  } {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = subtotal;

    return { subtotal, total, itemCount };
  }

  addItem(item: CartItem): void {
    const currentCart = this.cartSubject.value;
    const existingItemIndex = currentCart.items.findIndex(i =>
      this.isSameCartItem(i, item)
    );

    let updatedItems: CartItem[];

    if (existingItemIndex > -1) {
      updatedItems = [...currentCart.items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + item.quantity
      };
    } else {
      updatedItems = [...currentCart.items, item];
    }

    const { subtotal, total, itemCount } = this.calculateCartTotals(updatedItems);

    const updatedCart: Cart = {
      ...currentCart,
      items: updatedItems,
      subtotal,
      total,
      itemCount
    };

    this.cartSubject.next(updatedCart);
    this.saveCartToStorage();
  }

  removeItem(itemId: string): void {
    const currentCart = this.cartSubject.value;
    const updatedItems = currentCart.items.filter(item => item.id !== itemId);

    const { subtotal, total, itemCount } = this.calculateCartTotals(updatedItems);

    const updatedCart: Cart = {
      ...currentCart,
      items: updatedItems,
      subtotal,
      total,
      itemCount
    };

    this.cartSubject.next(updatedCart);
    this.saveCartToStorage();
  }

  updateQuantity(itemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(itemId);
      return;
    }

    const currentCart = this.cartSubject.value;
    const updatedItems = currentCart.items.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    );

    const { subtotal, total, itemCount } = this.calculateCartTotals(updatedItems);

    const updatedCart: Cart = {
      ...currentCart,
      items: updatedItems,
      subtotal,
      total,
      itemCount
    };

    this.cartSubject.next(updatedCart);
    this.saveCartToStorage();
  }

  clearCart(): void {
    this.cartSubject.next(this.getInitialCart());
    if (this.isBrowser) {
      localStorage.removeItem('cart');
    }
  }

  openCart(): void {
    this.cartOpenSubject.next(true);
  }

  closeCart(): void {
    this.cartOpenSubject.next(false);
  }

  toggleCart(): void {
    this.cartOpenSubject.next(!this.cartOpenSubject.value);
  }

  getCart(): Cart {
    return this.cartSubject.value;
  }

  isCartOpen(): boolean {
    return this.cartOpenSubject.value;
  }

  private isSameCartItem(item1: CartItem, item2: CartItem): boolean {
    return item1.id === item2.id &&
           item1.size === item2.size &&
           item1.color === item2.color &&
           item1.sku === item2.sku;
  }
}