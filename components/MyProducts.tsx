'use client';

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import './styles.css'; 
import { Pagination, Autoplay } from "swiper/modules";
import Link from "next/link";
import { getMyProducts } from "@/lib/actions";
import ProductCard from "./ProductCard";
import { Product } from "@/types";
 
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
      <div>
        <h3>
        Loading products...
        </h3>
      </div>
    </div>;
  }

  if (!myproducts || myproducts.length === 0) {
    return <div>No products available.</div>;
  }

  console.log({myproducts})
  return (
    <div className="flex flex-col gap-3 items-end">
      <Swiper
        slidesPerView="auto"
        centeredSlides={true}
        spaceBetween={10}
        loop={true}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 2000, 
          disableOnInteraction: false,
        }}
        modules={[Autoplay, Pagination]}
        className="mySwiper"
      >
        {myproducts.map((product) => (
          <SwiperSlide key={`slide-${product.productId}`}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
      <Link
        href="/"
        className="text-2xl font-semibold text-gray-600 hover:-translate-x-3 hover:text-primary duration-300"
      >
        View All
      </Link>
    </div>
  );
};
