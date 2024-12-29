"use server";

import { scrapeAmazonProduct } from "../scrapper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { revalidatePath } from "next/cache";
import { Product, User } from "@/types";
import { generateEmailBody, sendEmail } from "../nodemailer";
import axios from "axios"; // Replace with your preferred HTTP library if needed

import { prisma } from "../db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";
import Error from "next/error";
import { Erica_One } from "next/font/google";
import { Products } from "@prisma/client";

//Store User:
export async function userOntoDatabase(userId: string): Promise<void> {
  try {
    // Debug: Check if userId is valid
    if (!userId) {
      console.error("Error: No userId provided");
      return;
    }
    const existingUser = await prisma.users.findUnique({
      where: {
        userId,
      },
    });

    if (existingUser) {
      console.log("userExists!");
      return;
    }

    // Fetch user details from Clerk
    const userResponse = await fetch(
      `https://api.clerk.dev/v1/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      }
    );

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.log("Error fetching user details from Clerk:", errorText);
      return;
    }

    const user = await userResponse.json();

    const email =
      user.email_addresses[0]?.email_address || "default@example.com";
    const fullname =
      user.username || `${user.first_name}\d${user.last_name}` || "Anonymous";

    await prisma.users.upsert({
      where: { clerkId: userId },
      update: {
        email,
        fullname,
      },
      create: {
        clerkId: userId,
        email,
        fullname
      },
    });

    return;
  } catch (error) {
    console.log("Error saving user to database!", error);
  }
}

//Scrape Product
export async function scrapeAndStoreProduct(productURL: string) {
  try {
    // Authenticate the user
    const { userId } = await auth();

    if (!userId) {
      alert("Authentication Failed!")
      return;
    }

    if (!productURL) {
      alert("No URL found!")
      return 
    }

    // Scrape the product data
    const scrapedProduct = await scrapeAmazonProduct(productURL);

    if (!scrapedProduct) {
      alert("Failed to scrape product data!");
      return;
    }

    const existingProduct = await prisma.products.findUnique({
      where: {
        productUrl: scrapedProduct.productUrl,
      },
      include: {
        priceHistory: true,
      },
    });

    if (existingProduct) {
      // Update price history for existing product
      const updatedPrices = [
        ...existingProduct.priceHistory.map((ph) => ({ price: ph.price })),
        { price: scrapedProduct.currentPrice },
      ];

      const updatedProductData = {
        currentPrice: scrapedProduct.currentPrice,
        lowestPrice: getLowestPrice(updatedPrices),
        highestPrice: getHighestPrice(
          updatedPrices,
          existingProduct.highestPrice
        ),
        averagePrice: getAveragePrice(updatedPrices),
      };

      // Update product and price history
      await prisma.products.update({
        where: { productUrl: scrapedProduct.productUrl },
        data: {
          averagePrice: updatedProductData.averagePrice,
          currentPrice: updatedProductData.currentPrice,
          LowestPrice: updatedProductData.lowestPrice,
          highestPrice: updatedProductData.highestPrice,
        },
      });

      console.log("product is updated!");
      await prisma.priceHistory.upsert({
        where: {
          productId: existingProduct.productId,
        },
        update: {
          price: scrapedProduct.currentPrice,
        },
        create: {
          productId: existingProduct.productId,
          price: scrapedProduct.currentPrice,
        },
      });

      console.log("Product updated successfully!");
      return existingProduct;
    } else {
      // Create a new product entry
      const newProduct = await prisma.products.create({
        data: {
          productUrl: scrapedProduct.productUrl,
          currency: scrapedProduct.currency ?? "",
          image: scrapedProduct.image ?? "",
          title: scrapedProduct.title ?? "",
          currentPrice: scrapedProduct.currentPrice ?? 0,
          originalPrice: scrapedProduct.originalPrice ?? 0,
          LowestPrice: scrapedProduct.lowestPrice ?? 0,
          highestPrice: scrapedProduct.highestPrice ?? 0,
          averagePrice: scrapedProduct.averagePrice ?? 0,
          discountRate: scrapedProduct.discountRate ?? 0,
          isOutOfStock: scrapedProduct.isOutOfStock ?? false,
          priceHistory: {
            create: [{ price: scrapedProduct.currentPrice }],
          },
        },
      });
      // // Add product to user's track list
      // await prisma.productList.upsert({
      //   where: {
      //     userId: userId,
      //   },
      //   update: {
      //     products: {
      //       connect: {
      //         productUrl: scrapedProduct.productUrl,
      //       },
      //     },
      //   },
      //   create: {
      //     userId: userId,
      //     products: {
      //       connect: {
      //         productUrl: scrapedProduct.productUrl,
      //       },
      //     },
      //   },
      // });

      return newProduct;
    }
  } catch (error) {
    console.log("Error in scrapeAndStoreProduct!", error);
    return;
  }
}

export async function trackAndStoreProduct(productId: string) {
  try {
      // Authenticate the user
      const { userId } = await auth();

      if (!userId) {
        alert("Authentication Failed!")
        return;
      }
      
      const isAlreadyTracked = await prisma.trackList.findMany({
        where: {
          products: {
            some: {
              productId
            }
          }
        }
      });

      if(isAlreadyTracked) {
        return alert("This Item Is already tracked!");
      }
    
      // // Add product to user's track list
      await prisma.trackList.upsert({
        where: {
          userId: userId,
        },
        update: {
          products: {
            connect: {
              productId
            },
          },
        },
        create: {
          userId: userId,
          products: {
            connect: {
              productId,
            },
          },
        },
      });
  } catch (error) {
    console.log("Something Wrong to track product!!");
  }
}

//Get Specific Product:
export async function getProductById(productId: string) {
  try {
    const product = await prisma.products.findUnique({
      where: {
        productId,
      },
    });

    if (!product) return;

    return product;
  } catch (error) {
    console.log(error);
    return;
  }
}

//myProducts
export async function getMyProducts() {
  try {
    const { userId } = await auth();

    if (!userId) {
      alert("No User login");
      return [];
    }

    const myproducts = await prisma.trackList.findMany({
      where: {
        userId
      },
    });

    return myproducts;
  } catch (error) {
    console.error("Error fetching my products!", error);
    return [];
  }
}


export async function getAllProducts() {
  try {
    const products: Products[] = await prisma.products.findMany();
    return products;
  } catch (error) {
    console.log("Error fetching all products!", error);
    return [];
  }
}


export async function addUserEmailToProduct(
  productId: string,
  userEmail: string
) {
  try {
    const product = await prisma.products.findUnique({
      where: { productId: productId as string },
    });

    if (!product) {
      console.error("Product not found");
      return;
    }

    const emailContent = await generateEmailBody(product, "WELCOME");
    await sendEmail(emailContent, userEmail);
  } catch (error) {
    console.error("Error adding user email to product:", error);
  }
}
