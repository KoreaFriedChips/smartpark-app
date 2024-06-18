import { GetToken } from "@clerk/types";
import { create, update } from "./crud";

export const createPaymentIntent = async (getToken: GetToken, amount: number, currency: string = 'usd', sellerId: string) => {
  try {
    const data = { amount, currency, sellerId };
    console.log("createPaymentIntent data:", data);
    const res = await create(getToken, "/api/payments/create-pay-intent", data);
    console.log("createPaymentIntent response:", res);
    return res;
  } catch (error) {
    console.error("Error in createPaymentIntent:", error);
    throw error;
  }
};

export const capturePaymentIntent = async (getToken: GetToken, paymentIntentId: string) => {
  try {
    const res = await update(getToken, "/api/payments/capture", { paymentIntentId });
    return res;
  } catch (error) {
    console.error("Error in confirmPaymentIntent:", error);
    throw error;
  }
};

export const cancelPaymentIntent = async (getToken: GetToken, paymentIntentId: string) => {
  try {
    const res = await update(getToken, "/api/payments/cancel", { paymentIntentId });
    return res;
  } catch (error) {
    console.error("Error in cancelPaymentIntent:", error);
    throw error;
  }
};
