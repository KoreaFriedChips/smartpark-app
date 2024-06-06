import { GetToken } from "@clerk/types";
import { create, paymentCreate } from "./crud";

export const createPaymentIntent = async (getToken: GetToken, amount: number, currency: string = 'usd', sellerId: string) => {
  try {
    const data = { amount, currency, sellerId };
    console.log("createPaymentIntent data:", data);
    const res = await paymentCreate(getToken, "/api/payments", data);
    console.log("createPaymentIntent response:", res);
    return res.paymentIntent;
  } catch (error) {
    console.error("Error in createPaymentIntent:", error);
    throw error;
  }
};
