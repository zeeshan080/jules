import * as z from 'zod';

export const cakeOrderSchema = z.object({
  customerName: z.string().min(2, { message: 'Name must be at least 2 characters long.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits.' }).optional(),
  cakeDescription: z.string().min(10, { message: 'Description must be at least 10 characters long.' }),
  deliveryAddress: z.string().min(5, { message: 'Address must be at least 5 characters long.' }),
  deliveryDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: 'Please enter a valid date.' }), // Basic date validation
});

export type CakeOrderFormData = z.infer<typeof cakeOrderSchema>;
