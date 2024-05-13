import { createBid } from "@/serverconn";
import { useAuth } from "@clerk/clerk-expo";
import { useRef } from "react";
import { showErrorPage } from "@/components/utils/utils";
import { router } from "expo-router";
import BidView from "./BidView";

export default function BidController(){
  const {getToken} = useAuth();

  const listingId = useRef<string>();
  const amount = useRef<number>();
  const desiredSlot = useRef<Interval | undefined>(undefined);
  const highestBid = useRef<Bid>();


  const handleSubmitBid = async () => {

    if (!amount.current) {
      showErrorPage("must put a bid amount");
      return;
    }

    if (!listingId.current) {
      showErrorPage("listingId not loaded");
      return;
    }

    if (!desiredSlot.current) {
      showErrorPage("must select a timeslot");
      return;
    }

    if (highestBid.current && amount.current < highestBid.current.amount) {
      showErrorPage("bid must be higher than current highest");
      return;
    }

    try {
      const bid = await createBid(getToken, {
        amount: amount.current,
        starts: desiredSlot.current.start,
        ends: desiredSlot.current.end,
        listingId: listingId.current
      });
      router.replace({pathname: "/message-screen", params: {id: "bid-placed"}});
      console.log(bid);

      amount.current = 0;
      desiredSlot.current = undefined;
    } catch (err: any) {
      console.log(err);
      router.replace({pathname: "/message-screen", params: {id: "error"}});
    }
  }

  return (BidView({listingId, amount, desiredSlot, highestBid, handleSubmitBid}));

}