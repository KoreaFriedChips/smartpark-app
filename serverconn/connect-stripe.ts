import { GetToken } from "@clerk/types";
import { create, connectAccountCreate} from "./crud";

export const createConnectedAccount = async (getToken: GetToken) => {
  try {
    const data = { };
    const res = await connectAccountCreate(getToken, "/api/connect-stripe", data);
    console.log("connect-stripe response:", res);
    return res;
  } catch (error) {
    console.error("Error in connect-stripe:", error);
    throw error;
  }
};

