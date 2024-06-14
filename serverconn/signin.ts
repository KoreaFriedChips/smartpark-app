import { sendToServer } from "./crud";
import { GetToken } from "@clerk/types";
export const signin = async (getToken: GetToken) => {
  return await sendToServer(getToken, "/api/signin", "POST", {}, {});
};

// import { sendToServer } from "./crud";
// import { GetToken } from "@clerk/types";
// export const signin = async (getToken: GetToken) => {
//   const token = await getToken(); // Ensure token is obtained
//   return await sendToServer(token, "/api/signin", "POST", {}, {});
// };
