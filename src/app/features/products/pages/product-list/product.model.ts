import { Product } from '../../../../shared/models/product.model';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Pro Beach Tennis Racket',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1642182799808-303577fd1080?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxiZWFjaCUyMHBhZGRsZSUyMGJhbGwlMjBzcG9ydHxlbnwxfHx8fDE3NzU1NjMyNDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'rackets',
    inStock: true,
  },
  {
    id: 2,
    name: 'Premium Wooden Paddle Set',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1642182799350-3455e2a6154f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw5fHxiZWFjaCUyMHBhZGRsZSUyMGJhbGwlMjBzcG9ydHxlbnwxfHx8fDE3NzU1NjMyNDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'rackets',
    inStock: true,
  },
];