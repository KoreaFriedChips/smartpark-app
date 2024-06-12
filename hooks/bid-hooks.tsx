import { useAuth } from "@clerk/clerk-expo";
import { useListingWithId } from "./listing-hooks";
import { getBidCount, getHighestBid } from "@/serverconn";
import { useEffect, useState } from "react";
import { minutesToMilliseconds } from "date-fns";

export const useBidCount = (listingId: string | undefined, desiredSlot: Interval | undefined) => {
  const { getToken } = useAuth();
  const [count, setCount] = useState(0);
  const fetchCount = async () => {
    try {
      if (!listingId || !desiredSlot) return;
      const count = await getBidCount(getToken, listingId, desiredSlot.start, desiredSlot.end);
      setCount(count);
    } catch (err: any) {
      console.log(err.message);
      return;
    }
  }
  useEffect(() => {
    fetchCount();
  }, []);
  setInterval(async ()=>  fetchCount(), minutesToMilliseconds(5));

  return count;
} 

export const useHighestBid = (listingId: string | undefined, desiredSlot: Interval | undefined) => {
  const { getToken } = useAuth();
  const [highestBid, setHighestBid] = useState<Bid>();

  const fetchHighestBid = async () => {
    try {
      //console.log("listingId: ", listingId, "desiredSlot: ", desiredSlot);
      if (!listingId || !desiredSlot) return;
      const bid = await getHighestBid(getToken, listingId, desiredSlot.start, desiredSlot.end);
     //console.log("bid: ", bid);
      setHighestBid(bid);
    } catch (err: any) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    if (listingId && desiredSlot) {
      fetchHighestBid();
      const intervalId = setInterval(fetchHighestBid, minutesToMilliseconds(5));
      return () => clearInterval(intervalId);
    }
  }, [listingId, desiredSlot]);

  setInterval(async () =>  fetchHighestBid(), minutesToMilliseconds(5));
  //console.log("use highest bid: ", highestBid);
  return highestBid;
}
