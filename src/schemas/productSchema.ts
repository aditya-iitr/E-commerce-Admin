import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().min(0.1, 'Price must be greater than 0'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  category: z.string().min(1, 'Please select a category'),
  imageUrl: z.string().min(1, 'Product image is required'),
});

export type ProductFormValues = z.infer<typeof productSchema>;