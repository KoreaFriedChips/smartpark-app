import { useRef } from "react";
import { showErrorPage } from "@/components/utils/utils";
import { router } from "expo-router";
import BidView from "./BidView";
import { useBackend } from "@/hooks";

export default function BidController(){
  const { createBid, createReservation } = useBackend();
  const listingId = useRef<string>();
  const amount = useRef<number>();
  const desiredSlot = useRef<Interval>();
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
      const bid = await createBid({
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

  
  const handleSubmitBuy = async () => {
    if (!listingId.current) {
      showErrorPage("listingId not loaded");
      return;
    }

    if (!desiredSlot.current) {
      showErrorPage("you must select a timeslot");
      return;
    }

    try {
      const reservation = await createReservation(listingId.current, desiredSlot.current);
      console.log("reservation created");
      console.log(reservation);
      router.replace({pathname: "/message-screen", params: {id: "bid-won"}});
      desiredSlot.current = undefined;
    } catch (err: any) {
      console.log(err);
      router.push({pathname: "/message-screen", params: {id: "order-error"}});
    }

  }
  console.log("highest bid: ", highestBid);
  return (BidView({listingId: listingId, amount: amount, desiredSlot: desiredSlot, highestBid: highestBid, handleSubmitBid, handleSubmitBuy}));

}