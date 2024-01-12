import { getProductById, getSimilarProducts } from "@/lib/actions";
import Image from "next/image";
import { redirect } from 'next/navigation';
import Link from "next/link";
import { formatNumber } from "@/lib/utils";
import { Product } from "@/types";
import PriceInfo from "@/components/PriceInfo"; 
import ProductCard from "@/components/ProductCard";
import Modal from "@/components/Modal";


type Props = {
    params: {id: string}
}

const ProductDetails = async ({ params: {id} }: Props) => {

  const product: Product = await getProductById(id);

  if(!product) redirect('/');

  const similarProducts = await getSimilarProducts(id);
  
  return (
    <div className="product-container">
      <div className="flex gap-28 xl:flex-row flex-col">
        <div className="product-image">
          <Image
            src={product.image}
            alt="product.title"
            width={580}
            height={400}
            className="mx-auto"
          />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start gap-5 flex-wrap pb-6">
            <div className="flex flex-col gap-3">
              <p className="text-[25px] text-secondary font-semibold">{product.title}</p>
              
              <Link
                href={product.url}
                target= "_blank"
                className= "text-base text-[17px] text-black opacity-50"
              >
                Visit Product
              </Link>
            </div>

            <div className="product-info">
                <div className="flex flex-col gap-2">
                    <p className="text-[28px] text-secondary font-bold">
                      {product.currency} {formatNumber(product.currentPrice)}
                    </p>
                    <p className="text-[18px] text-black opacity-50 line-through">
                      {product.currency} {formatNumber(product.originalPrice)}
                    </p>
                </div>
            </div>
          </div>

          <div className="my-7 flex flex-col gap-5">
                <div className="flex gap-5 flex-wrap">
                  <PriceInfo 
                    title="Current Price"
                    iconSrc= "/assets/icons/priceTag.svg"
                    value={`${product.currency} ${formatNumber(product.currentPrice)}`}
                  />
                  <PriceInfo 
                    title="Avegare Price"
                    iconSrc= "/assets/icons/average.svg"
                    value={`${product.currency} ${formatNumber(product.averagePrice)}`}
                  />
                  <PriceInfo 
                    title="Highest Price"
                    iconSrc= "/assets/icons/arrowUp.svg"
                    value={`${product.currency} ${formatNumber(product.highestPrice)}`}
                  />
                  <PriceInfo 
                    title="Lowest Price"
                    iconSrc= "/assets/icons/arrowDown.svg"
                    value={`${product.currency} ${formatNumber(product.lowestPrice)}`}
                  />
                </div>
          </div>
        </div>
      </div>

      <Modal productId={id} />

      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-5">
          <h3 className="text-2xl text-secondary font-semibold">
            Product Description
          </h3>

          <div className="flex flex-col gap-4">
            {product?.description}
          </div>
        </div>
      </div>

      <button className="btn w-fit mx-auto flex items-center justify-center gap-3 min-w-[200px]">
        <Image
          src={"/assets/icons/buyCart.svg"}
          alt="check"
          width={22}
          height={22}
        />
        <Link href={product.url} className="text-base text-white">
          Buy Now
        </Link>
      </button>


      {similarProducts && similarProducts?.length > 0 && (
          <div className="py-14 flex flex-col gap-2 w-full">
              <p className="section-text">Similar Products</p>

              <div className="flex flex-wrap gap-10 mt7 w-full">
                {similarProducts.map((product) => (
                  <ProductCard key= {product._id} product={product}/>
                ))}
              </div>
          </div>
        )
      }
    </div>
  )
}

export default ProductDetails
