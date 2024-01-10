
import axios from 'axios';
import * as cheerio from 'cheerio';
import { extractPrice, extractCurrency } from '../utils';

export async function scrapeAmazonProduct(url: string) {
    if(!url) return;

    //BRIGHTDATA proxy config
    const username = String(process.env.BRIGHT_DATA_USERNAME);
    const password = String(process.env.BRIGHT_DATA_PASSWORD);
    const port = 22225;
    const session_id = (1000000 * Math.random()) | 0;

    const options = {
        auth: {
            username: `${username}-session-${session_id}`,
            password,
        },
        host: 'brd.superproxy.io',
        port,
        rejectUnauthorized: false,
    }

    try {
        //fetch the product page
        const response = await axios.get(url, options);
        const $ = cheerio.load(response.data);

        //extract the product title:
        const title = $('#productTitle').text().trim();
        //extract the product current price:
        const currentPrice = extractPrice(  
            $('.priceToPay'),
            $('.a-price-whole'),
        );
        //extract the product original price:
        const originalPrice = extractPrice(
            $('#priceblock_ourprice'),
            $('.a-price.a-text-price span.a-offscreen'),
            $('#listPrice'),
            $('#priceblock_dealprice'),
            $('.a-size-base.a-color-price')
        );
        //check if product is out of stock:
        const outOfStock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable';
        //extract the product images:
        const images = 
            $('#imgBlkFront').attr('data-a-dynamic-image') ||
            $('#landingImage').attr('data-a-dynamic-image') ||
           '{}'

        const imageUrls = Object.keys(JSON.parse(images));
        //extract the price curreny symbol:
        const currency = extractCurrency($('.a-price-symbol'));
        //extract the discount rate:
        const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, '');

        //Construct data object with scraped information:
        const data = {
            url,
            currency: currency || '$',
            image: imageUrls[0],
            title,
            currentPrice: Number(currentPrice) || Number(originalPrice),
            originalPrice: Number(originalPrice) || Number(currentPrice),
            priceHistory:[],
            discountRate,
            category: "category",
            lowestPrice: Number(currentPrice) || Number(originalPrice),
            highestPrice: Number(originalPrice) || Number(currentPrice),
            average: Number(currentPrice) || Number(originalPrice),
        }
       
        return data;
        
    } catch (error: any) {
        throw new Error(`Failed to scrape product: ${error.message}`);
    }

}