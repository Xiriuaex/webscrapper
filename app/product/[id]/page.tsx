'use client'
import { getProductById } from "@/lib/actions";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { formatNumber } from "@/lib/utils";
import { Product } from "@/types";
import PriceInfo from "@/components/PriceInfo"; 
import ProductCard from "@/components/ProductCard";
import Modal from "@/components/Modal";
import React, { useEffect, useState } from "react";


interface Props {
  params: Promise<{ id: string }>;
}

const ProductDetails = ({ params }: Props) => {
 
  const { id } = React.use(params); // Unwrap the Promise to access `id`

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);


  useEffect(()=> {
    const getProduct = async() => {
      try { 
        const product: Product | undefined = await getProductById(id);
        setProduct(product as Product);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    getProduct();
  }, [])

  if (isLoading) {
    return <div className="flex flex-col justify-center items-center mt-44">
      <div>
        <h3>
        Loading products...
        </h3>
      </div>
    </div>;
  }

  return (
    <div className="product-container">
      <div className="flex gap-28 xl:flex-row flex-col">
        <div className="product-image">
          <Image
            src={product?.image  ?? ""}
            alt={product?.title || "Product image"}
            width={580}
            height={400}
            className="mx-auto"
          />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start gap-5 flex-wrap pb-6">
            <div className="flex flex-col gap-3">
              <p className="text-[25px] text-secondary font-semibold">{product?.title}</p>
              
              <Link
                href={product?.productUrl ?? ""}
                target= "_blank"
                className= "text-base text-[17px] text-black opacity-50"
              >
                Visit Product
              </Link>
            </div>

            <div className="product-info">
                <div className="flex flex-col gap-2">
                    <p className="text-[28px] text-secondary font-bold">
                      {product?.currency} {formatNumber(product?.currentPrice)}
                    </p>
                    <p className="text-[18px] text-black opacity-50 line-through">
                      {product?.currency} {formatNumber(product?.originalPrice)}
                    </p>
                </div>
            </div>
          </div>

          <div className="my-7 flex flex-col gap-5">
                <div className="flex gap-5 flex-wrap">
                  <PriceInfo 
                    title="Current Price"
                    iconSrc= "/assets/icons/priceTag.svg"
                    value={`${product?.currency} ${formatNumber(product?.currentPrice)}`}
                  />
                  <PriceInfo 
                    title="Avegare Price"
                    iconSrc= "/assets/icons/average.svg"
                    value={`${product?.currency} ${formatNumber(product?.averagePrice)}`}
                  />
                  <PriceInfo 
                    title="Highest Price"
                    iconSrc= "/assets/icons/arrowUp.svg"
                    value={`${product?.currency} ${formatNumber(product?.highestPrice)}`}
                  />
                  <PriceInfo 
                    title="Lowest Price"
                    iconSrc= "/assets/icons/arrowDown.svg"
                    value={`${product?.currency} ${formatNumber(product?.lowestPrice)}`}
                  />
                </div>
                <button className="btn  flex flex-row items-center justify-center gap-3 min-w-[200px]">
                  <Image
                    src={"/assets/icons/buyCart.svg"}
                    alt="check"
                    width={22}
                    height={22}
                  />
                  <Link href={product?.productUrl ?? ""} className="text-base text-white">
                    Buy Now
                  </Link>
                </button>
          </div>
        </div>
      </div>

      <Modal productId={id} />

      
    </div>
  )
}

export default ProductDetails
