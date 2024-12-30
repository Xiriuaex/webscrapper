"use server";

import { EmailContent, NotificationType, Product } from "@/types";
import nodemailer from "nodemailer";
import { Resend } from "resend";

const Notification = {
  WELCOME: "WELCOME",
  CHANGE_OF_STOCK: "CHANGE_OF_STOCK",
  LOWEST_PRICE: "LOWEST_PRICE",
  THRESHOLD_MET: "THRESHOLD_MET",
};

export const generateEmailBody = async (
  product: Product | null,
  type: NotificationType
) => {
  if (!product) {
    throw new Error("Product is required to generate email content.");
  }

  const THRESHOLD_PERCENTAGE = 40;
  const shortenedTitle =
    (product.title ?? "").length > 20
      ? `${(product.title as string).substring(0, 20)}...`
      : product.title;

  let subject = "";
  let body = "";

  switch (type) {
    case Notification.WELCOME:
      subject = `Welcome to Price Tracking for ${shortenedTitle}`;
      body = `
            <div>
              <h2>Welcome to TrackerDo 🚀</h2>
              <p>You are now tracking ${product.title}.</p>
            </div>
          `;
      break;

    case Notification.CHANGE_OF_STOCK:
      subject = `${shortenedTitle} is now back in stock!`;
      body = `
            <div>
              <h4>Hey, ${product.title} is now restocked! Grab yours before they run out again!</h4>
              <p>See the product <a href="${product.productUrl}" target="_blank" rel="noopener noreferrer">here</a>.</p>
            </div>
          `;
      break;

    case Notification.LOWEST_PRICE:
      subject = `Lowest Price Alert for ${shortenedTitle}`;
      body = `
            <div>
              <h4>Hey, ${product.title} has reached its lowest price ever!!</h4>
              <p>Grab the product <a href="${product.productUrl}" target="_blank" rel="noopener noreferrer">here</a> now.</p>
            </div>
          `;
      break;

    case Notification.THRESHOLD_MET:
      subject = `Discount Alert for ${shortenedTitle}`;
      body = `
            <div>
              <h4>Hey, ${product.title} is now available at a discount of more than ${THRESHOLD_PERCENTAGE}%!</h4>
              <p>Grab it right away from <a href="${product.productUrl}" target="_blank" rel="noopener noreferrer">here</a>.</p>
            </div>
          `;
      break;

    default:
      throw new Error("Invalid notification type.");
  }

  return { subject, body };
};

const transporter = nodemailer.createTransport({
  pool: true,
  service: "hotmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASSWORD,
  },
  maxConnections: 1,
});

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (
  emailContent: EmailContent,
  sendTo: string | string[]
) => {
  if (!emailContent || !emailContent.subject || !emailContent.body) {
    throw new Error("Invalid email content provided.");
  }

  try {
    console.log(sendTo);
    await resend.emails.send({
      from: "onboarding@resend.dev", // Replace with your verified Resend email
      to: sendTo,
      subject: emailContent.subject,
      html: emailContent.body,
    });
  } catch (error) {
    console.error("Error sending mail:", error);
    return false;
  }
};
