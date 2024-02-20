import { IProduct } from "@/types/productTypes";
import formatPrice from "@/utils/formatPrice";
import Image from "next/image";
import Link from "next/link";

const Product = ({ product }: IProduct) => {
  return (
    <div className="group relative border border-gray-100 p-4">
      <Link
        href={{
          pathname: `/product/${product.id}`,
          query: {
            id: product.id,
            name: product.name,
            price: product.price,
            currency: product.currency,
            image: product.image,
            description: product.description,
          },
        }}
      >
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
          <Image
            src={product.image}
            height={800}
            width={800}
            alt={product.name}
            className="h-full w-full object-cover object-center lg:h-full lg:w-full"
            placeholder="blur"
            blurDataURL={product.image}
          />
        </div>
        <div className="mt-4 ">
          <h1 className="text-sm text-gray-700">{product.name}</h1>
          <p className="text-sm font-medium text-gray-900">
            Price: {formatPrice(product.price as number)}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default Product;
