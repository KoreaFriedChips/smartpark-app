import { useRef } from "react";
import { router } from "expo-router";
import BidView from "./BidView";
import { useBackend } from "@/hooks";
import { readBids, updateBid } from "@/serverconn";
import { useAuth } from "@clerk/clerk-expo";
import { cancelPaymentIntent } from "@/serverconn/payments";

export default function BidController(){
  const { createBid, createReservation } = useBackend();
  const listingId = useRef<string>();
  const amount = useRef<number>();
  const desiredSlot = useRef<Interval>();
  const highestBid = useRef<Bid>();
  const { getToken } = useAuth();


  const handleSubmitBid = async (paymentIntentId: string) => {

    if (!amount.current) {
      router.replace({
        pathname: "/message-screen",
        params: { id: "error", subtitle: "Must input a bid amount." },
      });
      return;
    }

    if (!listingId.current) {
      router.replace({
        pathname: "/message-screen",
        params: { id: "error", subtitle: "Listing not loaded!" },
      });
      return;
    }

    if (!desiredSlot.current) {
      router.replace({
        pathname: "/message-screen",
        params: { id: "error", subtitle: "Must select a valid timeslot." },
      });
      return;
    }

    if (highestBid.current && amount.current < highestBid.current.amount) {
      router.replace({
        pathname: "/message-screen",
        params: { id: "error", subtitle: "New bid amount must be greater than current highest bid!" },
      });
      return;
    }

    try {
      const bid = await createBid({
        amount: amount.current,
        starts: desiredSlot.current.start,
        ends: desiredSlot.current.end,
        listingId: listingId.current, 
        stripePaymentIntentId: paymentIntentId
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

  
  const handleSubmitBuy = async () => {
    if (!listingId.current) {
      router.replace({
        pathname: "/message-screen",
        params: { id: "error", subtitle: "Listing not loaded!" },
      });
      return;
    }

    if (!desiredSlot.current) {
      router.replace({
        pathname: "/message-screen",
        params: { id: "error", subtitle: "Must select a valid timeslot." },
      });
      return;
    }

    try {
      const slot = desiredSlot.current;
      const reservation = await createReservation(listingId.current, slot);
      console.log("reservation created");
      console.log(reservation);
      router.replace({pathname: "/message-screen", params: {id: "bid-won"}});
      desiredSlot.current = undefined;

      // cancel all bids for this listing interval
      const bids = await readBids(getToken, { listingId: listingId.current, starts: slot.start, ends: slot.end} );
      for (const bid of bids) {
        await cancelPaymentIntent(getToken, bid.stripePaymentIntentId);
        await updateBid(getToken, bid.id, { status: "cancelled" });
      }
        
    } catch (err: any) {
      console.log(err);
      router.push({pathname: "/message-screen", params: {id: "order-error"}});
    }

  }
  //console.log("highest bid: ", highestBid);
  return (BidView({listingId: listingId, amount: amount, desiredSlot: desiredSlot, highestBid: highestBid, handleSubmitBid, handleSubmitBuy}));

}