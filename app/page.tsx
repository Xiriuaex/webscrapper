"use client";

import SearchBar from "@/components/SearchBar";
import HeroCarousel from "@/components/HeroCarousel";
import { userOntoDatabase } from "@/lib/actions";
import { MyProducts } from "@/components/MyProducts";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import Footer from "@/components/Footer";
import PopularProducts from "@/components/PopularProducts";

const Home = () => {
  const { isSignedIn, userId } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isSignedIn && userId) {
          console.log("Calling userOntoDatabase with userId:", userId);
          await userOntoDatabase(userId);
          console.log("User saved to database.");
        }
      } catch (error) {
        console.error("Error fetching data or saving user:", error);
      }
    };

    fetchData();
  }, [isSignedIn, userId]);

  const renderMyProductsSection = () => {
    if (userId) {
      return (
        <section
          id="myProducts"
          className="flex flex-col min-h-[30vh] gap-10 px-8 md:px-24 pb-20"
        >
          <h1 className="text-[40px] font-semibold uppercase text-center">
            My Products
          </h1>
          <MyProducts />
        </section>
      );
    }
    return null;
  };

  return (
    <>
      <section className="px-6 md:px-11 pt-11 pb-20">
        <div className="grid grid-cols-2 gap-12">
          <HeroCarousel />
          <div className="flex flex-col justify-center">
            <h1 className="head-text">
              <span className="text-[50px]">
                Keep Track Of Your Product
                <br />
              </span>
              Tracker<span className="text-primary">Do</span>
            </h1>
            <p className="mt-6 ml-2 text-[20px]">
              Keep Track Of Your Products For The Best Deals
            </p>
            <SearchBar />
          </div>
        </div>
      </section>

      {renderMyProductsSection()}

      <section
        id="popularNow"
        className="flex flex-col min-h-[30vh] gap-10 px-8 md:px-32 pb-20"
      >
        <h1 className="text-[40px] font-semibold uppercase text-center">
          Popular Products
        </h1>
        <PopularProducts />
      </section>

      <section>
        <Footer />
      </section>
    </>
  );
};

export default Home;
