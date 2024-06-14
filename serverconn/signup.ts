import { sendToServer } from "./crud";
import { GetToken } from "@clerk/types";
export const signup = async (getToken: GetToken, email: string, birthday: Date, phoneNumber: string, name: string) => {
  return await sendToServer(getToken, "/api/signup", "POST", { email, birthday, phoneNumber, name }, {});
};

// import { sendToServer } from "./crud";
// import { GetToken } from "@clerk/types";
// export const signup = async (getToken: GetToken, email: string, birthday: Date, phoneNumber: string, name: string) => {
//   const token = await getToken(); // Ensure token is obtained
//   return await sendToServer(token, "/api/signup", "POST", { email, birthday, phoneNumber, name }, {});
// };