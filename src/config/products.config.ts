
import type { ProductsContent } from '../types/site.types'

export const productsConfig: ProductsContent = {
  eyebrow: 'OUR PRODUCTS',
  title: 'Explore Our Products',
  description:
    'Discover our collection of products, thoughtfully developed to meet different needs.',

  categories: [
    {
      id: 'category-one',
      name: 'Category One',
      description: 'Explore our first product collection.',
      enabled: true,
      order: 1,
    },
    {
      id: 'category-two',
      name: 'Category Two',
      description: 'Explore our second product collection.',
      enabled: true,
      order: 2,
    },
    {
      id: 'category-three',
      name: 'Category Three',
      description: 'Explore our third product collection.',
      enabled: true,
      order: 3,
    },
  ],


  products: [
    {
      id: 'product-01',
      sku: 'GLS-001',
      slug: 'product-alpha',
      name: 'Product Alpha',
      shortDescription: 'A featured product from our collection.',
      description:
        'Add a detailed product description here. Explain its purpose, key benefits and what makes it valuable.',
      categoryId: 'category-one',
      image: '/images/products/product-01.jpg',
      gallery: [
        '/images/products/product-01.jpg',
        '/images/products/product-01-02.jpg',
      ],
      specifications: [
        { label: 'Type', value: 'Standard' },
        { label: 'Availability', value: 'Available' },
        { label: 'Quality', value: 'Premium' },
      ],
      price: 100,
      stockStatus: 'in_stock',
      featured: true,
      enabled: true,
      order: 1,
    },
    {
      id: 'product-02',
      sku: 'GLS-002',
      slug: 'product-beta',
      name: 'Product Beta',
      shortDescription: 'A versatile solution for different requirements.',
      description:
        'Add the complete description of this product here.',
      categoryId: 'category-two',
      image: '/images/products/product-02.jpg',
      price: 150,
      stockStatus: 'in_stock',
      featured: true,
      enabled: true,
      order: 2,
    },
    {
      id: 'product-03',
      sku: 'GLS-003',
      slug: 'product-gamma',
      name: 'Product Gamma',
      shortDescription: 'Designed with quality and reliability in mind.',
      description:
        'Add the complete description of this product here.',
      categoryId: 'category-three',
      image: '/images/products/product-03.jpg',
      price: 200,
      stockStatus: 'in_stock',
      featured: false,
      enabled: true,
      order: 3,
    },
    {
      id: 'product-04',
      sku: 'GLS-004',
      slug: 'product-delta',
      name: 'Product Delta',
      shortDescription: 'Another offering from our product collection.',
      description:
        'Add the complete description of this product here.',
      categoryId: 'category-one',
      image: '/images/products/product-04.jpg',
      price: 250,
      stockStatus: 'in_stock',
      featured: false,
      enabled: true,
      order: 4,
    },
  ],

}
