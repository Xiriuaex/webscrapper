'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";

//Swiper Imports:
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination"; 
import { Pagination, Autoplay } from "swiper/modules";

import { getAllProducts } from "@/lib/actions";
import { Product } from "@/types";
import ProductCard from "./ProductCard";
 
const PopularProducts = () => {
  const [allProducts, setAllProducts] = useState<Product[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); 
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const myproducts = await getAllProducts();
        setAllProducts(myproducts as Product[]);
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

  if (!allProducts || allProducts.length === 0) {
    return <div>No Products Available Currently!</div>;
  }

  return (
    <div className="flex flex-col items-end">
      <Swiper
        slidesPerView={3}
        centeredSlides={
          (allProducts.length < 2) ? true : false
        }
        spaceBetween={0}
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
        {allProducts.map((product) => (
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

export default PopularProducts;