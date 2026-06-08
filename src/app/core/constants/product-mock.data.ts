import { Product } from "../../shared/models/product.model";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'OR MONOGRAM CAP (WHITE/BROWN)',
    price: 700.00,
    image: 'https://images.unsplash.com/photo-1606483956061-46a898dce538?w=1080',
    hoverImage: 'https://images.unsplash.com/photo-1715608720717-ac3d1b638e44?w=1080',
    images: [
      'https://images.unsplash.com/photo-1606483956061-46a898dce538?w=1080',
      'https://images.unsplash.com/photo-1715608720717-ac3d1b638e44?w=1080',
      'https://images.unsplash.com/photo-1556793521-ec4b34e6545e?w=1080'
    ],
    description: `<h4>Collection 02 • The Traditions that shape us.</h4>
<p>Cap by Odd Ritual made from premium cotton twill with bespoke OR monogram embroidery on the front, a vegetable tanned leather visor and a bespoke branded snap closure.</p>
<p>Locally made | Limited drop.</p>`,
    sizes: ['One Size'],
    category: 'caps',
    inStock: true,
    attributes: [
      {
        id: 'garment-details',
        title: 'Garment Details',
        content: `Premium cotton twill construction<br>
Structured front panels<br>
Bespoke OR monogram embroidery<br>
Vegetable tanned leather visor<br>
Locally designed & produced in South Africa`
      },
      {
        id: 'wash-care',
        title: 'Wash Care',
        content: `Spot clean only<br>
Do not machine wash<br>
Avoid direct water contact<br>
Do not bleach<br>
Allow to air dry naturally<br>
Keep away from direct heat<br>
Do not tumble dry`
      },
      {
        id: 'shipping',
        title: 'Shipping & Returns',
        content: `Free shipping on orders over R500<br>
30-day return policy<br>
Ships within 2-3 business days<br>
Ethically made in Cape Town, South Africa`
      }
    ]
  },
  {
    id: 2,
    name: 'OR MONOGRAM CAP (NAVY)',
    price: 700.00,
    image: 'https://images.unsplash.com/photo-1678099277937-8753e6031301?w=1080',
    images: [
      'https://images.unsplash.com/photo-1678099277937-8753e6031301?w=1080'
    ],
    description: `<h4>Collection 02 • The Traditions that shape us.</h4>
<p>Navy version of the iconic OR Monogram Cap. Premium cotton twill with bespoke OR monogram embroidery, vegetable tanned leather visor and branded snap closure.</p>
<p>Ethically made in Cape Town, South Africa.</p>`,
    sizes: ['One Size'],
    category: 'caps',
    inStock: true,
    attributes: [
      {
        id: 'garment-details',
        title: 'Garment Details',
        content: `Premium cotton twill construction<br>
Structured front panels<br>
Bespoke OR monogram embroidery<br>
Vegetable tanned leather visor<br>
Locally designed & produced in South Africa`
      },
      {
        id: 'wash-care',
        title: 'Wash Care',
        content: `Spot clean only<br>
Do not machine wash<br>
Allow to air dry naturally`
      }
    ]
  },
  {
    id: 3,
    name: 'SUEDE UNSTRUCTURED CAP (MAROON)',
    price: 750.00,
    image: 'https://images.unsplash.com/photo-1715608720994-c19e4e5dabe7?w=1080',
    images: [
      'https://images.unsplash.com/photo-1715608720994-c19e4e5dabe7?w=1080'
    ],
    description: `<h4>Suede Collection</h4>
<p>Unstructured suede cap in rich maroon. A relaxed silhouette crafted from genuine suede with a soft crown and pre-curved visor.</p>
<p>Ethically made in Cape Town, South Africa.</p>`,
    sizes: ['One Size'],
    category: 'caps',
    inStock: true,
    attributes: [
      {
        id: 'garment-details',
        title: 'Garment Details',
        content: `Genuine suede upper<br>
Unstructured soft crown<br>
Pre-curved visor<br>
Adjustable strap closure<br>
Locally designed & produced in South Africa`
      },
      {
        id: 'wash-care',
        title: 'Wash Care',
        content: `Suede brush clean only<br>
Keep away from water<br>
Avoid direct sunlight<br>
Professional cleaning recommended`
      }
    ]
  },
  {
    id: 4,
    name: 'ROL KNIT BEANIE (BLACK)',
    price: 350.00,
    image: 'https://images.unsplash.com/photo-1635650804512-003e5ee6ccac?w=1080',
    images: [
      'https://images.unsplash.com/photo-1635650804512-003e5ee6ccac?w=1080'
    ],
    description: `<h4>Winter Essentials</h4>
<p>Classic roll-knit beanie in all-black. A wardrobe essential knitted from a soft wool-blend yarn with a double-layer cuff for extra warmth.</p>
<p>Ethically made in Cape Town, South Africa.</p>`,
    sizes: ['One Size'],
    category: 'beanies',
    inStock: true,
    attributes: [
      {
        id: 'garment-details',
        title: 'Garment Details',
        content: `Wool-blend yarn<br>
Double-layer roll cuff<br>
One size fits most<br>
Locally designed & produced in South Africa`
      },
      {
        id: 'wash-care',
        title: 'Wash Care',
        content: `Hand wash cold<br>
Lay flat to dry<br>
Do not tumble dry<br>
Do not bleach`
      }
    ]
  },
  {
    id: 5,
    name: 'OR MONOGRAM CAP (WHITE/BROWN) — RESTOCK',
    price: 700.00,
    image: 'https://images.unsplash.com/photo-1606483956061-46a898dce538?w=1080',
    hoverImage: 'https://images.unsplash.com/photo-1715608720717-ac3d1b638e44?w=1080',
    category: 'caps',
    inStock: true
  },
  {
    id: 6,
    name: 'OR MONOGRAM CAP (NAVY) — RESTOCK',
    price: 700.00,
    image: 'https://images.unsplash.com/photo-1678099277937-8753e6031301?w=1080',
    hoverImage: 'https://images.unsplash.com/photo-1556793521-ec4b34e6545e?w=1080',
    category: 'caps',
    inStock: true
  },
  {
    id: 7,
    name: 'SUEDE UNSTRUCTURED CAP (MAROON) — RESTOCK',
    price: 750.00,
    image: 'https://images.unsplash.com/photo-1715608720994-c19e4e5dabe7?w=1080',
    hoverImage: 'https://images.unsplash.com/photo-1606483956061-46a898dce538?w=1080',
    category: 'caps',
    inStock: true
  },
  {
    id: 8,
    name: 'ROL KNIT BEANIE (BLACK) — RESTOCK',
    price: 350.00,
    image: 'https://images.unsplash.com/photo-1635650804512-003e5ee6ccac?w=1080',
    category: 'beanies',
    inStock: true
  },
  {
    id: 9,
    name: 'CLASSIC FITTED CAP (BLACK)',
    price: 650.00,
    image: 'https://images.unsplash.com/photo-1606483956061-46a898dce538?w=1080',
    category: 'caps',
    inStock: true
  },
  {
    id: 10,
    name: 'VINTAGE TRUCKER HAT',
    price: 600.00,
    image: 'https://images.unsplash.com/photo-1678099277937-8753e6031301?w=1080',
    category: 'caps',
    inStock: true
  },
  {
    id: 11,
    name: 'WOOL BLEND BEANIE (GREY)',
    price: 380.00,
    image: 'https://images.unsplash.com/photo-1635650804512-003e5ee6ccac?w=1080',
    category: 'beanies',
    inStock: true
  },
  {
    id: 12,
    name: 'PREMIUM SNAPBACK (OLIVE)',
    price: 720.00,
    image: 'https://images.unsplash.com/photo-1715608720994-c19e4e5dabe7?w=1080',
    category: 'caps',
    inStock: true
  }
];