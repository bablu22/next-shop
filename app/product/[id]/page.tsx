import { ISearchParams } from "@/types/productTypes";
import formatPrice from "@/utils/formatPrice";
import Image from "next/image";
import type { Metadata } from "next";
import AddCart from "@/app/components/AddCart";

export const generateMetadata = ({ searchParams }: ISearchParams): Metadata => {
  return {
    title: `Product - ${searchParams.name}`,
    description: `${searchParams.description}`,
  };
};

const ProductPage = ({ searchParams }: ISearchParams) => {
  return (
    <section className="py-10 font-poppins dark:bg-gray-800">
      <div className="max-w-6xl px-4 mx-auto">
        <div className="flex flex-wrap mb-24 -mx-4">
          <div className="w-full px-4 mb-8 md:w-1/2 md:mb-0">
            <div className="sticky top-0 overflow-hidden ">
              <div className="relative mb-6 lg:mb-10 lg:h-96">
                <Image
                  className="object-contain w-full lg:h-full"
                  src={searchParams.image}
                  alt={searchParams.name}
                  placeholder="blur"
                  blurDataURL={searchParams.image}
                  height={800}
                  width={800}
                />
              </div>
            </div>
          </div>
          <div className="w-full px-4 md:w-1/2">
            <div className="lg:pl-20">
              <div className="mb-6 ">
                <span className="px-2.5 py-0.5 text-xs text-blue-600 bg-blue-100 dark:bg-gray-700 rounded-xl dark:text-gray-200">
                  New Arrival
                </span>
                <h2 className="max-w-xl mt-6 mb-6 text-xl font-semibold leading-loose tracking-wide text-gray-700 md:text-2xl dark:text-gray-300">
                  {searchParams.name}
                </h2>
                <div className="flex flex-wrap items-center mb-6">
                  <ul className="flex mb-4 mr-2 lg:mb-0">
                    <li>
                      <button>
                        <i className="ri-star-line text-yellow-700 text-xl"></i>
                      </button>
                    </li>
                    <li>
                      <button>
                        <i className="ri-star-line text-yellow-700 text-xl"></i>
                      </button>
                    </li>
                    <li>
                      <button>
                        <i className="ri-star-line text-yellow-700 text-xl"></i>
                      </button>
                    </li>
                    <li>
                      <button>
                        <i className="ri-star-line text-yellow-700 text-xl"></i>
                      </button>
                    </li>
                    <li>
                      <button>
                        <i className="ri-star-line text-yellow-700 text-xl"></i>
                      </button>
                    </li>
                  </ul>
                </div>
                <p className="inline-block text-2xl font-semibold text-gray-700 dark:text-gray-400 ">
                  <span>{formatPrice(searchParams.price as number)}</span>
                </p>
              </div>

              <div className="py-6 mb-6 border-t border-b border-gray-200 dark:border-gray-700">
                <span className="text-base text-gray-600 dark:text-gray-400">
                  {searchParams.description}
                </span>
              </div>
              <div className="mb-6 "></div>
              <AddCart {...searchParams} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPage;
