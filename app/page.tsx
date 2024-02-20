import Stripe from "stripe";
import Product from "./components/Product";

const getProducts = async () => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2023-10-16",
  });
  const products = await stripe.products.list();
  const productsWithPrice = await Promise.all(
    products.data.map(async (product) => {
      const price = await stripe.prices.list({
        product: product.id,
      });
      return {
        id: product.id,
        name: product.name,
        price: price.data[0].unit_amount,
        currency: price.data[0].currency,
        image: product.images[0],
        description: product.description,
      };
    })
  );
  return productsWithPrice;
};

export default async function Home() {
  const products = await getProducts();

  return (
    <main>
      <h2 className="mt-5 text-2xl font-bold tracking-tight text-gray-900">
        Trending products
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
