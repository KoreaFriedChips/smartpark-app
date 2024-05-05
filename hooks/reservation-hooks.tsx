import { readUserReservations, getListingFromReservation, readReservation } from "@/serverconn";
import { useAuth } from "@clerk/clerk-expo";
import { useState, useEffect } from "react";
import { useUserContext } from "./user-hooks";


export const useReservations = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const user = useUserContext();
  const [reservations, setReservations] = useState<Reservation[]>();
  const [listings, setListings] = useState<Listing[]>();

  const fetchReservations = async () => {
    try {
      if (!isLoaded || !isSignedIn || !user) return;
      const reservations = await readUserReservations(getToken, user.id)
      setReservations(reservations);
    } catch (err) {
      console.log(err);
      setReservations([]);
    }
  };
  useEffect(() => {
    fetchReservations();
  }, [isLoaded, isSignedIn, getToken, user]);

  useEffect(() => {
    const fetchListings = async () => {
      if (!reservations) return;
      const listings = await Promise.all(reservations.map(async (reservation) => getListingFromReservation(getToken, reservation)));
      setListings(listings);
    };
    try {
      fetchListings();
    } catch (err) {
      console.log(err);
    }
  }, [reservations]);

  const refreshReservations = () => {
    fetchReservations();
  }

  return { reservations, listings, refreshReservations };
};

export const useReservation = (id: string) => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [reservation, setReservation] = useState<Reservation>();
  const [listing, setListing] = useState<Listing>();
  useEffect(() => {
    const fetchReservation = async () => {
      setReservation(await readReservation(getToken, id));
    }
    try {
      fetchReservation();
    } catch (err) {
      console.log(err);
    }
  }, [isLoaded, isSignedIn, getToken]);

  useEffect(() => {
    const fetchListing = async () => {
      if (!reservation) return;
      setListing(await getListingFromReservation(getToken, reservation));
    }
    try {
      fetchListing();
    } catch (err) {
      console.log(err);
    }
  }, [reservation]);

  return { reservation, listing };
}
