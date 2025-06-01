import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
          Welcome to Our Custom Cake Shop!
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
          Order the cake of your dreams, made with love and the finest ingredients.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/order-cake">
            <Button size="lg">Order a Custom Cake</Button>
          </Link>
              <Link href="/admin/orders" className="ml-4">
                <Button size="lg" variant="outline">View Orders (Admin)</Button>
              </Link>
        </div>
      </div>
    </main>
  );
}
