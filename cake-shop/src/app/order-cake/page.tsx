'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useFormState } from 'react-dom'; // Import useFormState
import * as z from 'zod';
import { useEffect } from 'react'; // For potential feedback handling

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cakeOrderSchema, CakeOrderFormData } from '@/lib/validators/cakeOrderSchema';
import { createCakeOrder, FormState } from './actions'; // Import the server action

const initialState: FormState = {
  success: false,
  message: '',
  errors: null,
};

export default function OrderCakePage() {
  const [state, formAction] = useFormState(createCakeOrder, initialState); // useFormState hook

  const form = useForm<CakeOrderFormData>({
    resolver: zodResolver(cakeOrderSchema), // Client-side validation still useful for UX
    defaultValues: {
      customerName: '',
      email: '',
      phone: '',
      cakeDescription: '',
      deliveryAddress: '',
      deliveryDate: '', // Should be YYYY-MM-DD string
    },
  });

  useEffect(() => {
    if (state?.success) {
      alert(state.message); // Simple feedback for success
      form.reset(); // Reset form fields
    } else if (state?.message && !state.success && !state.errors) {
      // General error message from server (not validation errors)
      alert(`Error: ${state.message}`);
    }
    // Specific field errors are handled inline via <FormMessage>
  }, [state, form]);

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Order Your Custom Cake</h1>
      {/* Display general success/error messages from server action (not field-specific) */}
      {state?.message && !state.errors && (
        <div className={`p-4 mb-4 text-sm rounded-lg ${state.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {state.message}
        </div>
      )}
      <Form {...form}>
        <form action={formAction} className="space-y-8 max-w-2xl mx-auto">
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                {/* Show server error OR client error, not both. Client error is handled by Shadcn/FormMessage by default */}
                {state?.errors?.customerName ? <FormMessage>{state.errors.customerName.join(', ')}</FormMessage> : <FormMessage />}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                {state?.errors?.email ? <FormMessage>{state.errors.email.join(', ')}</FormMessage> : <FormMessage />}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Your phone number" {...field} />
                </FormControl>
                {state?.errors?.phone ? <FormMessage>{state.errors.phone.join(', ')}</FormMessage> : <FormMessage />}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cakeDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cake Description</FormLabel>
                <FormDescription>
                  Describe your dream cake! Include flavors, design ideas, colors, etc.
                </FormDescription>
                <FormControl>
                  <Textarea
                    placeholder="e.g., A two-tier chocolate cake with vanilla buttercream, decorated with fresh berries and a 'Happy Birthday' message."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                {state?.errors?.cakeDescription ? <FormMessage>{state.errors.cakeDescription.join(', ')}</FormMessage> : <FormMessage />}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deliveryAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St, Anytown, USA" {...field} />
                </FormControl>
                {state?.errors?.deliveryAddress ? <FormMessage>{state.errors.deliveryAddress.join(', ')}</FormMessage> : <FormMessage />}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deliveryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Delivery Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                {state?.errors?.deliveryDate ? <FormMessage>{state.errors.deliveryDate.join(', ')}</FormMessage> : <FormMessage />}
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">Submit Order</Button>
        </form>
      </Form>
    </div>
  );
}
