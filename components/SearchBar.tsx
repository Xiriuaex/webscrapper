"use client";

import { scrapeAndStoreProduct } from "@/lib/actions"; 
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const isValidAmazonProductURL = (url: string) => {
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;

    if (
      hostname.includes("amazon.com") ||
      hostname.includes("amazon.in") ||
      hostname.includes("amazon.")
    ) {
      return true;
    }
  } catch (error) {
    return false;
  }
};

const SearchBar = () => {
  const { isSignedIn, user } = useUser();
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isSignedIn) {
      alert("User Not logged!");
      return;
    }

    const isValidLink = isValidAmazonProductURL(searchPrompt);

    if (!isValidLink) return alert("Please provide a valid link");

    try {
      setIsLoading(true);
      const product = await scrapeAndStoreProduct(searchPrompt);

      if (product) {
        router.push(`/product/${product.productId}`);
      } else {
        alert("Product processing failed. Please try again.");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="flex flex-wrap gap-0 justify-start mt-12"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder="Enter product link"
        className="flex-1 max-w-[500px] mr-2 p-3 border border-gray-500 rounded-lg shadow-xs text-base text-gray-500 focus:outline-none"
      />
      <button
        type="submit"
        className="bg-gray-900 w-[130px] border ml-2 border-gray-900 rounded-lg shadow-xs px-5 py-3 text-white text-base font-semibold hover:opacity-90 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40"
        disabled={searchPrompt === ""}
      >
        {isLoading ? "Searching..." : "Search"}
      </button>
    </form>
  );
};

export default SearchBar;
