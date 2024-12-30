import { NextResponse } from "next/server";

import {
  getLowestPrice,
  getHighestPrice,
  getAveragePrice,
  getEmailNotifType,
} from "@/lib/utils";
import { scrapeAmazonProduct } from "@/lib/scrapper";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";

import { prisma } from "../../../lib/db";
export const maxDuration = 10; // This function can run for a maximum of 300 seconds
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const trackedProducts = await prisma.products.findMany({
      where: {
        trackList: {
          some: {},
        },
      },
    });

    if (!trackedProducts || trackedProducts.length === 0) {
      return NextResponse.json({ message: "No tracked products found!" });
    }

    //SCRAPE LATEST PRODUCT DETAILS & UPDATE DB
    const updatedProducts = await Promise.all(
      trackedProducts.map(async (currTrackedProduct) => {
        try {
          const scrapedProduct = await scrapeAmazonProduct(
            currTrackedProduct.productUrl
          );

          if (!scrapedProduct) {
            console.error(
              `Failed to scrape product: ${currTrackedProduct.productUrl}`
            );
            return null;
          }

          const updatedPriceHistory = [
            ...scrapedProduct.priceHistory,
            { price: scrapedProduct.currentPrice },
          ];

          const updatedProductData = {
            title: scrapedProduct.title,
            currentPrice: scrapedProduct.currentPrice,
            priceHistory: updatedPriceHistory,
            lowestPrice: getLowestPrice(updatedPriceHistory),
            highestPrice: getHighestPrice(
              updatedPriceHistory,
              currTrackedProduct.highestPrice
            ),
            averagePrice: getAveragePrice(updatedPriceHistory),
          };

          // Update product in the database
          const updatedProduct = await prisma.products.update({
            where: { productUrl: currTrackedProduct.productUrl },
            data: {
              title: updatedProductData.title,
              currentPrice: updatedProductData.currentPrice,
              priceHistory: {
                create: updatedProductData.priceHistory.map((i) => ({
                  price: i.price,
                })),
              },
              LowestPrice: updatedProductData.lowestPrice,
              highestPrice: updatedProductData.highestPrice,
              averagePrice: updatedProductData.averagePrice,
            },
          });

          const userWithTrackList = await prisma.users.findMany({
            where: {
              trackList: {
                isNot: null,
              },
            },
          });

          // Get array of user emails
          const userEmails = userWithTrackList.map((user) => user.email);

          // Check for email notifications
          const emailNotifType = getEmailNotifType(
            scrapedProduct,
            currTrackedProduct
          );

          if (emailNotifType) {
            const productInfo = {
              title: updatedProduct.title,
              url: updatedProduct.productUrl,
            };

            // Construct email content
            const emailContent = await generateEmailBody(
              productInfo,
              emailNotifType
            );

            // Send email notification
            await sendEmail(emailContent, userEmails);

            return updatedProduct;
          }
        } catch (error) {
          console.error(
            `Error processing product ${currTrackedProduct.productUrl}:`,
            error
          );
          return null;
        }
      })
    );

    return NextResponse.json({
      message: "Products updated successfully",
      data: updatedProducts.filter((product) => product !== null),
    });
  } catch (error: any) {
    console.error("Failed to update products:", error);
    return NextResponse.json(
      { message: `Failed to update products: ${error.message}` },
      { status: 500 }
    );
  }
}
