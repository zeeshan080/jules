import { db } from '@/db';
import { cakeOrders } from '@/db/schema';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Function to fetch orders - this would typically be in an action or service
async function getOrders() {
  try {
    // This query will likely not work in the current environment if the table doesn't exist
    // or if DB queries fail silently.
    const orders = await db.select().from(cakeOrders).orderBy(cakeOrders.createdAt);
    return orders;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    // In a real app, you might throw the error or return a specific error state
    return []; // Return empty array on error for now
  }
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Cake Orders</h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">
          No cake orders found. (Or there was an issue fetching them, or the table does not exist).
        </p>
      ) : (
        <Table>
          <TableCaption>A list of recent cake orders.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Delivery Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Order Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.email}</TableCell>
                <TableCell className="max-w-xs truncate">{order.cakeDescription}</TableCell>
                <TableCell>{new Date(order.deliveryDate).toLocaleDateString()}</TableCell>
                <TableCell>{order.orderStatus}</TableCell>
                <TableCell className="text-right">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
