import { options } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/prisma";
import { getServerSession } from "next-auth";
import Image from "next/image";

const fetchOrders = async () => {
  const user = await getServerSession(options);
  if (!user) {
    return [];
  }
  const orders = await prisma.order.findMany({
    where: { userId: user?.user?.id, status: "complete" },
    include: { products: true },
  });
  return orders;
};

const Dashboard = async () => {
  const orders = await fetchOrders();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full bg-white border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Product Name</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, orderIndex) =>
                order.products.map((product, productIndex) => (
                  <tr
                    key={`${order.id}-${product.id}`}
                    className={"bg-gray-100"}
                  >
                    {productIndex === 0 && (
                      <>
                        <td
                          rowSpan={order.products.length}
                          className="border px-4 py-2"
                        >
                          {orderIndex + 1}
                        </td>
                        <td
                          rowSpan={order.products.length}
                          className="border px-4 py-2"
                        >
                          {order.id}
                        </td>
                        <td
                          rowSpan={order.products.length}
                          className="border px-4 py-2"
                        >
                          <span
                            className={`inline-block px-2 py-1 rounded capitalize ${
                              order.status === "pending"
                                ? "bg-rose-300 text-rose-800"
                                : "bg-green-300 text-green-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </>
                    )}
                    <td className="border px-4 py-2">
                      <Image
                        src={product.image as string}
                        alt={product.name}
                        width={100}
                        height={100}
                        className="rounded"
                      />
                    </td>
                    <td className="border px-4 py-2">{product.name}</td>
                    <td className="border px-4 py-2">${product.price}</td>
                    <td className="border px-4 py-2">{product.quantity}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
