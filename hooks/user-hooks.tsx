import { getUserFromClerkId } from "@/serverconn";
import { useAuth } from "@clerk/clerk-expo";
import { useState, useEffect } from "react";

export const useUser = () => {
  const { isLoaded, isSignedIn, getToken, signOut, userId: clerkId } = useAuth();
  const [user, setUser] = useState<User>();
  useEffect(() => {
    const fetchUser = async () => {
      if (!isLoaded || !isSignedIn) return;
      const user = await getUserFromClerkId(getToken, clerkId);
      setUser(user);
    };
    try {
      fetchUser();
    } catch (err) {
      console.log(err);
      signOut();
    }
  }, [isLoaded, isSignedIn, getToken, clerkId]);
  return user;
};
