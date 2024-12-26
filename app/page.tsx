'use client'

import SearchBar from '@/components/SearchBar';
import HeroCarousel from '@/components/HeroCarousel';
import { getAllProducts, userOntoDatabase } from '@/lib/actions';
import ProductCard from '@/components/ProductCard';
import { MyProducts } from '@/components/MyProducts'; 
import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { Product } from '@/types';

const Home = () => { 
  const { isSignedIn, userId } = useAuth();// Call useAuth directly in the component body
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isSignedIn && userId) {
          console.log("Calling userOntoDatabase with userId:", userId);
          await userOntoDatabase(userId); // Call the function
          console.log("User saved to database.");
        }
  
        console.log("Fetching all products...");
        const products = await getAllProducts();
        setAllProducts(products as Product[]);
        console.log("Products fetched:", products);
      } catch (error) {
        console.error("Error fetching data or saving user:", error);
      }
    };
  
    fetchData(); // Call the async function
  }, [isSignedIn, userId]); // Include dependencies to rerun when they change
  

  // Handle the conditional rendering based on userId
  const renderMyProductsSection = () => {
    if (userId) {
      return (
        <section id='myProducts' className='flex flex-col min-h-[30vh] gap-10 px-8 md:px-32 py-20'>
          <h1 className='text-[40px] font-semibold uppercase text-center'>My Products</h1>
          <MyProducts />
        </section>
      );
    }
    return null;  // Return null to skip rendering if userId is null
  };

  return (
    <>
      <section className='px-6 md:px-11 pt-11 pb-20'>
        <div className='grid grid-cols-2 gap-12'>
          <HeroCarousel />
          <div className='flex flex-col justify-center'>
            <h1 className='head-text'>
              <span className='text-[50px]'>Keep Track Of Your Product<br /></span>         
              Tracker<span className='text-primary'>Do</span>
            </h1>
            <p className='mt-6 ml-2 text-[20px]'>
              Keep Track Of Your Products For The Best Deals
            </p>
            <SearchBar />
          </div>
        </div>
      </section>

      {renderMyProductsSection()}

      <section id='popularNow' className='flex flex-col gap-10 px-6 md:px-20 py-20'>
        <h1 className='text-[40px] font-semibold uppercase text-center'>Popular Now</h1>
        <div className='flex flex-wrap justify-center gap-x-8 gap-y-16'>
          {allProducts.sort((a, b) => 
            (a.createdAt?.getTime() ?? 0) < (b.createdAt?.getTime() ?? 0) ? 1 : -1
          ).map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
