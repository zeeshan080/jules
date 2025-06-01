import { describe, it, expect } from 'vitest';
import { cakeOrderSchema } from './cakeOrderSchema';

describe('cakeOrderSchema', () => {
  it('should validate a correct order object', () => {
    const validOrder = {
      customerName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      cakeDescription: 'A delicious chocolate cake',
      deliveryAddress: '123 Main St, Anytown',
      deliveryDate: '2024-12-31', // YYYY-MM-DD format
    };
    const result = cakeOrderSchema.safeParse(validOrder);
    expect(result.success).toBe(true);
  });

  it('should fail if customerName is too short', () => {
    const invalidOrder = {
      customerName: 'J',
      email: 'john.doe@example.com',
      phone: '1234567890', // phone is optional, but ensure other required fields are present
      cakeDescription: 'A delicious chocolate cake',
      deliveryAddress: '123 Main St, Anytown',
      deliveryDate: '2024-12-31',
    };
    const result = cakeOrderSchema.safeParse(invalidOrder);
    expect(result.success).toBe(false);
    // Safely access fieldErrors
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.customerName).toContain('Name must be at least 2 characters long.');
    }
  });

  it('should fail for invalid email', () => {
    const invalidOrder = {
      customerName: 'Jane Doe',
      email: 'not-an-email',
      cakeDescription: 'Vanilla cake',
      deliveryAddress: '456 Oak Ave',
      deliveryDate: '2024-11-15',
    };
    const result = cakeOrderSchema.safeParse(invalidOrder);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toContain('Please enter a valid email address.');
    }
  });

  it('should pass if optional phone number is not provided', () => {
    const validOrder = {
      customerName: 'John Doe',
      email: 'john.doe@example.com',
      // phone: undefined, // or not present
      cakeDescription: 'A delicious chocolate cake',
      deliveryAddress: '123 Main St, Anytown',
      deliveryDate: '2024-12-31',
    };
    const result = cakeOrderSchema.safeParse(validOrder);
    expect(result.success).toBe(true);
  });

  it('should fail if cakeDescription is too short', () => {
    const invalidOrder = {
      customerName: 'Valid Name',
      email: 'valid@example.com',
      cakeDescription: 'Too short',
      deliveryAddress: '123 Main St',
      deliveryDate: '2024-12-31',
    };
    const result = cakeOrderSchema.safeParse(invalidOrder);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.cakeDescription).toContain('Description must be at least 10 characters long.');
    }
  });

  it('should fail if deliveryAddress is too short', () => {
    const invalidOrder = {
      customerName: 'Valid Name',
      email: 'valid@example.com',
      cakeDescription: 'Long enough cake description.',
      deliveryAddress: 'Addr',
      deliveryDate: '2024-12-31',
    };
    const result = cakeOrderSchema.safeParse(invalidOrder);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.deliveryAddress).toContain('Address must be at least 5 characters long.');
    }
  });

  it('should fail for invalid deliveryDate format', () => {
    const invalidOrder = {
      customerName: 'Valid Name',
      email: 'valid@example.com',
      cakeDescription: 'Long enough cake description.',
      deliveryAddress: '123 Main St',
      deliveryDate: 'this is not a date',
    };
    const result = cakeOrderSchema.safeParse(invalidOrder);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.deliveryDate).toContain('Please enter a valid date.');
    }
  });

});
