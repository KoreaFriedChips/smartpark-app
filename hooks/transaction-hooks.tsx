import { useAuth } from "@clerk/clerk-expo";
import { useUserContext } from "./user-hooks";
import { useEffect, useState } from "react";
import { readUserTransactions } from "@/serverconn";

export const useTransactions = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const user = useUserContext();
  const [transactions, setTransactions] = useState<Transaction[]>();
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!isLoaded || !isSignedIn || !user) return;
      setTransactions(await readUserTransactions(getToken, user.id));
    }
    try {
      fetchTransactions();
      console.log("fetch transactions succeeded");
    } catch (err) {
      console.log("fetch transactions failed");
      console.log(err);
    }
  }, [isLoaded, isSignedIn, getToken, user]);

  return transactions;
}