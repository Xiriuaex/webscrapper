import Product from "@/lib/models/product.model";
import { connectToDB } from "@/lib/mongoose";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { scrapeAmazonProduct } from "@/lib/scrapper";
import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from "@/lib/utils";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        connectToDB();

        const product = await Product.find({}); //fetching all products.

        if(!product) 
            throw new Error("No Product Found");

        //CRON jobs:
        //Scrape product's latest details and update DB:
        const updatedProducts = await Promise.all(
            product.map(async (currentProduct) => {
                const scrapedProduct = await scrapeAmazonProduct(currentProduct.url);

                if(!scrapedProduct)
                    throw new Error("No product found");

                    const updatedPriceHistory = [
                        ...currentProduct.priceHistory,
                        {price: scrapedProduct.currentPrice}
                    ]
        
                    const product = {
                        ...scrapedProduct,
                        priceHistory: updatedPriceHistory,
                        lowestPrice: getLowestPrice(updatedPriceHistory),
                        highestPrice: getHighestPrice(updatedPriceHistory),
                        averagePrice: getAveragePrice(updatedPriceHistory),
                    }

                    const updatedProduct = await Product.findOneAndUpdate(
                        {url: scrapedProduct.url},
                        product,
                    );

                    //2. Check each product's status & send email accordingly:
                    const emailNotificationType = getEmailNotifType(scrapedProduct, currentProduct);

                    if(emailNotificationType && updatedProduct.users.length > 0 ) {
                        const productInfo = {
                            title: updatedProduct.title,
                            url: updatedProduct.url,
                        }

                        const EmailContent = await generateEmailBody(productInfo, emailNotificationType);


                        const userEmails = updatedProduct.users.map((user: any) => user.email);

                        await sendEmail(EmailContent, userEmails);
                    }

                    return updatedProduct;
            })
        )

        return NextResponse.json({
                message: 'ok', data: updatedProducts
        })
    } catch (error) {
        throw new Error(`Error in GET: ${error}`);
    }
}