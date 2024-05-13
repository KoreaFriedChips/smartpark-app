import { useAuth } from "@clerk/clerk-expo";
import { useListingWithId } from "./listing-hooks";
import { getBidCount, getHighestBid } from "@/serverconn";
import { useState } from "react";
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
  setInterval(async ()=>  fetchCount(), minutesToMilliseconds(1));

  return count;
} 

export const useHighestBid = (listingId: string | undefined, desiredSlot: Interval | undefined) => {
  const { getToken } = useAuth();
  const [highestBid, setHighestBid] = useState<Bid>();
  const fetchHighestBid = async () => {
    try {
      if (!listingId || !desiredSlot) return;
      const bid = await getHighestBid(getToken, listingId, desiredSlot.start, desiredSlot.end);
      setHighestBid(bid);
      return;
    } catch (err: any) {
      console.log(err.message);
      return;
    }
  }
  setInterval(async () =>  fetchHighestBid(), minutesToMilliseconds(1));

  return highestBid;
}