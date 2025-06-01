'use server';

import { z } from 'zod';
import { db } from '@/db';
import { cakeOrders } from '@/db/schema';
import { cakeOrderSchema, CakeOrderFormData } from '@/lib/validators/cakeOrderSchema';
import { revalidatePath } from 'next/cache';

export type FormState = {
  success: boolean;
  message: string;
  errors?: Record<keyof CakeOrderFormData, string[]> | null;
};

export async function createCakeOrder(
  prevState: FormState | undefined, // prevState is not used in this version but good for pattern
  formData: FormData
): Promise<FormState> {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = cakeOrderSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    console.error('Server-side validation failed:', validatedFields.error.flatten().fieldErrors);
    return {
      success: false,
      message: 'Validation failed. Please check your input.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const data = validatedFields.data;

  try {
    await db.insert(cakeOrders).values({
      customerName: data.customerName,
      email: data.email,
      phone: data.phone,
      cakeDescription: data.cakeDescription,
      deliveryAddress: data.deliveryAddress,
      // Ensure deliveryDate is compatible with what PostgreSQL timestamp expects.
      // The schema for `cakeOrderSchema` for `deliveryDate` is z.string().refine(...)
      // The DB column `deliveryDate` is timestamp({ mode: 'string' })
      // HTML input type="date" provides 'YYYY-MM-DD'. This should be acceptable for PostgreSQL timestamp.
      deliveryDate: data.deliveryDate,
    });

    revalidatePath('/order-cake'); // Revalidate the page if you display orders there
    // revalidatePath('/admin/orders'); // Or an admin page

    return {
      success: true,
      message: 'Your cake order has been submitted successfully!',
      errors: null,
    };
  } catch (error) {
    console.error('Error inserting cake order:', error);
    // Check if the error is a ZodError or a database error and customize message
    let specificMessage = 'An error occurred while submitting your order. Please try again.';
    if (error instanceof z.ZodError) { // Should have been caught by safeParse, but as a safeguard
        specificMessage = 'There was an issue with the data format.';
    } else if (error instanceof Error && error.message.includes('database')) { // Basic check
        specificMessage = 'A database error occurred. Please try again later.';
    }
    return {
      success: false,
      message: specificMessage,
      errors: null, // Optionally, you could try to map DB errors to specific fields if applicable
    };
  }
}
