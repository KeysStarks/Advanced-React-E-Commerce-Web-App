import React from "react";
import { useProducts } from "../hooks";
import type { Product } from "../types/catalog";

const Profile: React.FC = () => {
  const {
    data: products = [],
    isPending,
    isError,
    error,
  } = useProducts();

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Unable to load products: {error.message}</p>;

  return (
    <div>
      {products.map((product: Product) => (
        <h1 key={product.id}>{product.title}</h1>
      ))}
    </div>
  )
}

export default Profile
