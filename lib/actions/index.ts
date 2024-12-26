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

//save user on database:
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
    // Debug: Notify function start
    // console.log("Fetching Clerk user details for:", userId);

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
      console.error("Error fetching user details from Clerk:", errorText);
      return;
    }

    const user = await userResponse.json();
    // console.log("Fetched user object from Clerk:", user);
    // Extract required fields from Clerk response
    const email =
      user.email_addresses[0]?.email_address || "default@example.com";
    const fullname =
      user.username || `${user.first_name}\d${user.last_name}` || "Anonymous";

    // Debug: Log fetched user data
    // console.log("Fetched Clerk user:", { email, fullname });

    // Upsert user details into database
    const userData = await prisma.users.upsert({
      where: { uid: userId },
      update: {
        email,
        fullname,
      },
      create: {
        uid: userId, 
        email,
        fullname,
        userToProductList: {
          create: {
            userId,
          },
        },
      },
    });

    // Debug: Log database operation result
    // console.log("Upserted user into database:", userData);
  } catch (error) {
    console.error("Error saving user to database:", error);
  }
}

//update user table and productList table as well
export async function scrapeAndStoreProduct(
  productURL: string,
  req?: NextApiRequest,
  res?: NextApiResponse
): Promise<Product | null> {
  try {
    // Authenticate the user
    const { userId } = await auth();

    if (!userId) {
      res?.status(401).send({ message: "Authentication Failed!" });
      return null;
    }

    if (!productURL) {
      res?.status(400).send({ message: "No URL found!" });
      return null;
    }

    // Scrape the product data
    const scrapedProduct = await scrapeAmazonProduct(productURL);

    if (!scrapedProduct) {
      res?.status(404).send({ message: "Failed to scrape product data!" });
      return null;
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

      // console.log(updatedProductData)
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

      res
        ?.status(200)
        .send({ existingProduct, message: "Product updated successfully!" });
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
          LowestPrice: scrapedProduct.currentPrice ?? 0,
          highestPrice: scrapedProduct.currentPrice ?? 0,
          averagePrice: scrapedProduct.currentPrice ?? 0,
          discountRate: scrapedProduct.discountRate ?? 0,
          isOutOfStock: scrapedProduct.isOutOfStock ?? false,
          priceHistory: {
            create: [{ price: scrapedProduct.currentPrice }],
          },
        },
      });
      // Add product to user's product list
      await prisma.productList.upsert({
        where: {
          userId: userId,
        },
        update: {
          products: {
            connect: {
              productUrl: scrapedProduct.productUrl,
            },
          },
        },
        create: {
          userId: userId,
          products: {
            connect: {
              productUrl: scrapedProduct.productUrl,
            },
          },
        },
      });

      res
        ?.status(201)
        .send({ newProduct, message: "New product created successfully!" });
      return newProduct;
    }
  } catch (error) {
    console.log("Error in scrapeAndStoreProduct:", error);
    res?.status(500).json({ error: `Internal Server Error:` });
    return null;
  }
}

//check for if user also
export async function getProductById(productId: string) {
  try {
    const product = await prisma.products.findUnique({
      where: {
        productId,
      },
    });

    if (!product) return undefined;

    return product;
  } catch (error) {
    console.log(error);
  }
}

//create myProducts
export async function getMyProducts() {
  try {
    // Authenticate the user
    const { userId } = await auth();

    if (!userId) {
      alert("No User login");
      return null;
    }

    const myproducts = await prisma.products.findMany({
      where: {
        productList: {
          some: {
            userId: userId,
          },
        },
      },
    });

    return myproducts;
  } catch (error) {
    alert("Something wrong fetching My products!");
    console.log("Something Wrong", error);
  }
}

//get all products that are tracked by users.
//in the frontend check if the product is tracked by that user or not. if not then show track option
export async function getAllProducts() {
  try {
    const products = await prisma.products.findMany();

    return products;
  } catch (error) {
    console.log("Something Wrong!");
  }
}

export async function addUserEmailToProduct(
  productId: string,
  userEmail: string
) {
  try {
    const { userId } = await auth();

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
