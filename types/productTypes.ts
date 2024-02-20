export interface IProduct {
  product: {
    id: string;
    name: string;
    price: number | null;
    currency: string;
    image: string;
    description: string | null;
  };
}

export interface ISearchParams {
  searchParams: {
    id: string;
    name: string;
    price: number | null;
    currency: string;
    image: string;
    description: string | null;
  };
}
