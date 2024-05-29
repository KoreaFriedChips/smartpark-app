import { useAuth } from "@clerk/clerk-expo"
import * as backend from '@/serverconn';
import { LatLng } from "react-native-maps";

export const useBackend = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const registerDevicePushToken = async () => {
    return await backend.registerDevicePushToken(getToken);
  }

  const createListing = async (data: any) : Promise<Listing> => {
    return await backend.createListing(getToken, data);
  }

  const createReview = async (
    listingId: string,
    reviewData: {
      rating: number,
      review: string,
      date: Date
    }  
  ): Promise<Review> => {
    return await backend.createReview(getToken, listingId, reviewData);
  }

  const getSeller = async (listing: Listing) => {
    return await backend.getSeller(getToken, listing);
  }

  const updateListing = async (listingId: string, data: any) => {
    return await backend.updateListing(getToken, listingId, data);
  }

  const deleteReservation = async ( reservationId: string) => {
    return await backend.deleteReservation(getToken, reservationId);
  }

  const createBid = async (data: any) => {
    return await backend.createBid(getToken, data);
  }

  const createReservation = async (listingId: string, interval: Interval) => {
    return await backend.createReservation(getToken, listingId, interval);
  }

  const getReviewer = async (review: Review) => {
    return await backend.getReviewer(getToken, review);
  }

  const readReviews = async (searchParams: any) => {
    return await backend.readReviews(getToken, searchParams);
  }

  const readFavorites = async (searchParams: any) => {
    return await backend.readFavorites(getToken, searchParams);
  }

  const deleteFavorite = async (favoriteId: string) => {
    return await backend.deleteFavorite(getToken, favoriteId);
  }

  const createFavorite = async (data: any) => {
    return await backend.createFavorite(getToken, data);
  }

  const uploadImage = async (filename: string, filesize: number, data: Blob) => {
    return await backend.uploadImage(getToken, filename, filesize, data);
  }

  const readMapsCoordinatesWithInput = async (input: string) => {
    return await backend.readMapsCoordinatesWithInput(getToken, input);
  }

  const readMapsCoordinates = async (address?: string, city?: string, state?: string) => {
    return await backend.readMapsCoordinates(getToken, address, city, state);
  }

  const readCityStateFromCoordinates = async (coords: LatLng) => {
    return await backend.readCityStateFromCoordinates(getToken, coords);
  }

  const createMessage = async (message: string, attachments: string[], toUserId: string) => {
    return await backend.createMessage(getToken, message, attachments, toUserId);
  }

  const readMessages = async (userId: string) => {
    return await backend.readMessages(getToken, userId);
  }
  

  return { 
    registerDevicePushToken,
    createListing,
    createReview,
    getSeller,
    updateListing,
    deleteReservation,
    createBid,
    createReservation,
    getReviewer,
    readReviews,
    readFavorites,
    deleteFavorite,
    createFavorite,
    uploadImage,
    readMapsCoordinatesWithInput,
    readMapsCoordinates,
    readCityStateFromCoordinates,
    createMessage,
    readMessages,
  };
}