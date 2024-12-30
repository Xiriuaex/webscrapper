import { Product } from "@/types";
import Link from "next/link";
import Image from "next/image";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  return (
    <Link
      href={`/product/${product.productId}`}
      className="sm:w-[292px] sm:max-w-[292px] bg-slate-300 p-5 pt-0 w-full flex-1 flex flex-col gap-4 rounded-xl hover:-translate-y-5 duration-300"
    >
      <div className="flex-1 relative flex flex-col gap-5 p-4 rounded-md">
        <Image
          src={product.image || ""}
          alt={product.title || "Product image"}
          width={200}
          height={200}
          className="max-h-[250px] object-contain w-full h-full bg-transparent"
        />
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-secondary text-[20px] leading-6 font-semibold truncate">
          {product.title}
        </h3>
      </div>
      <div className="flex justify-between">
        <p className="text-primary text-xl font-semibold">
          <span>{product?.currency}</span>
          <span>{product?.currentPrice}</span>
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
