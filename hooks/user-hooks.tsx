import { getUserFromClerkId, readUsers } from "@/serverconn";
import { useAuth } from "@clerk/clerk-expo";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect, createContext, useContext } from "react";
import { useBackend } from "./backend-hooks";

export const UserContext = createContext<User | undefined>(undefined);

export const useUserContext = () => useContext(UserContext);

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

export const useOtherUser = () => {
  const { getUserWithId } = useBackend();
  const { id } = useLocalSearchParams<{id: string}>();
  const [user, setUser] = useState<User>();
  const fetchUser = async () => {
    try {
      const otherUser = await getUserWithId(id);
      setUser(otherUser);
    } catch (e) {
      console.log("other user not found");
    }
  }
  useEffect(() => {
    fetchUser();
  },[]);

  return user;
}
