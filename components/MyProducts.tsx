'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";

//Swiper Imports:
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination"; 
import { Pagination, Autoplay } from "swiper/modules";

import { getMyProducts } from "@/lib/actions";
import { Product } from "@/types";
import ProductCard from "./ProductCard";
 
export const MyProducts = () => {
  const [myproducts, setMyProducts] = useState<Product[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const myproducts = await getMyProducts();
        setMyProducts(myproducts as Product[]);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (isLoading) {
    return <div className="flex flex-col justify-center items-center">
      <div className="mt-14">
        <h3>
        Loading products...
        </h3>
      </div>
    </div>;
  }

  if (!myproducts || myproducts.length === 0) {
    return <div>User Has no previous products!</div>;
  }

  return (
    <div className="flex flex-col items-end"> 
    <div className='flex w-full flex-row justify-center gap-x-6 gap-y-14'>
      {myproducts.sort((a, b) => 
        (a.createdAt?.getTime() ?? 0) < (b.createdAt?.getTime() ?? 0) ? 1 : -1
      ).slice(0,3).map((product) => (
        <ProductCard key={product.productId} product={product} />
      ))}
    </div>
    <Link
        href="/"
        className="text-2xl font-semibold text-gray-600 hover:-translate-x-3 hover:text-primary duration-300"
      >
        View All
      </Link>
    </div>
  );
};
