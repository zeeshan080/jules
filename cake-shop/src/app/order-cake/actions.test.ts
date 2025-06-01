import { describe, it, expect, vi } from 'vitest';
import { createCakeOrder, FormState } from './actions';
// Assuming actions.ts is in the same directory as the test file or adjust path.
// The user's prompt had './actions' which implies same directory.
// If it's in `cake-shop/src/app/order-cake/actions.ts`, then the path is correct.

// Mock the db module from '@/db'
// The path in actions.ts is `import { db } from '@/db';`
vi.mock('@/db', () => ({
  db: {
    insert: vi.fn().mockReturnThis(), // Mock insert to be chainable
    values: vi.fn().mockResolvedValue({}), // Mock values to resolve successfully
    // Add other Drizzle methods if they are called and need mocking, e.g., .returning()
  },
}));

// Mock revalidatePath from 'next/cache'
// The path in actions.ts is `import { revalidatePath } from 'next/cache';`
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('createCakeOrder server action', () => {
  const initialState: FormState | undefined = undefined; // As per createCakeOrder signature

  it('should return validation errors for invalid data', async () => {
    const formData = new FormData();
    formData.append('customerName', 'J'); // Invalid: too short
    formData.append('email', 'invalid-email'); // Invalid: format
    formData.append('cakeDescription', 'Short'); // Invalid: too short
    formData.append('deliveryAddress', 'Addr'); // Invalid: too short
    formData.append('deliveryDate', 'not-a-date'); // Invalid: format

    const result = await createCakeOrder(initialState, formData);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Validation failed. Please check your input.');
    expect(result.errors).not.toBeNull();
    if (result.errors) { // Type guard for errors
      expect(result.errors.customerName).toContain('Name must be at least 2 characters long.');
      expect(result.errors.email).toContain('Please enter a valid email address.');
      expect(result.errors.cakeDescription).toContain('Description must be at least 10 characters long.');
      expect(result.errors.deliveryAddress).toContain('Address must be at least 5 characters long.');
      expect(result.errors.deliveryDate).toContain('Please enter a valid date.');
    }
  });

  it('should return success for valid data and call db.insert', async () => {
    const formData = new FormData();
    formData.append('customerName', 'Valid Name');
    formData.append('email', 'valid@example.com');
    formData.append('phone', '1234567890');
    formData.append('cakeDescription', 'This is a valid cake description for the order.');
    formData.append('deliveryAddress', '123 Valid Street, Valid City');
    formData.append('deliveryDate', '2025-01-15');

    // Get the mocked db object to check calls
    const { db } = await import('@/db');
    const { revalidatePath } = await import('next/cache');

    const result = await createCakeOrder(initialState, formData);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Your cake order has been submitted successfully!');
    expect(result.errors).toBeNull();

    // Check if db.insert was called with the correct structure
    expect(db.insert).toHaveBeenCalledWith(expect.anything()); // Check if called with cakeOrders schema
    expect(db.insert(expect.anything()).values).toHaveBeenCalledWith({
      customerName: 'Valid Name',
      email: 'valid@example.com',
      phone: '1234567890',
      cakeDescription: 'This is a valid cake description for the order.',
      deliveryAddress: '123 Valid Street, Valid City',
      deliveryDate: '2025-01-15',
    });

    // Check if revalidatePath was called
    expect(revalidatePath).toHaveBeenCalledWith('/order-cake');
  });

  it('should handle database insertion errors', async () => {
    const formData = new FormData();
    formData.append('customerName', 'DB Error Test');
    formData.append('email', 'dberror@example.com');
    formData.append('cakeDescription', 'This order will cause a DB error.');
    formData.append('deliveryAddress', '123 Error Lane');
    formData.append('deliveryDate', '2025-02-01');

    // Mock db.insert().values() to throw an error
    const { db } = await import('@/db');
    (db.insert(expect.anything()).values as any).mockRejectedValueOnce(new Error('Database insertion failed'));

    const result = await createCakeOrder(initialState, formData);

    expect(result.success).toBe(false);
    expect(result.message).toContain('An error occurred while submitting your order. Please try again.'); // Or more specific if error handling improves
    expect(result.errors).toBeNull(); // Or could contain a general error
  });
});
