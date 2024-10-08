import { ReservationModel } from "@/types";
import { GetToken } from "@clerk/types";
import { create, read, serverDelete } from "./crud";


export const createReservation = async (getToken: GetToken, listingId: string, interval: Interval) => {
    const reservationData = {
        starts: interval.start,
        ends: interval.end,
        listingId
    };
    const res = await create(getToken, "/api/reservations", reservationData);
    return ReservationModel.parse(res);
};

export const createReservationFromBid = async (getToken: GetToken, listingId: string, interval: Interval, userId: string) => {
    const reservationData = {
        userId,
        starts: interval.start,
        ends: interval.end,
        listingId
    };
    const res = await create(getToken, "/api/reservations/from-bid", reservationData);
    return ReservationModel.parse(res);
};

export const readUserReservations = async (getToken: GetToken, userId: string) => {
    return await readReservations(getToken, { userId: userId });
};

export const readReservations = async (getToken: GetToken, searchParams: any): Promise<Reservation[]> => {
    const res = await read(getToken, "/api/reservations", searchParams);
    return res.map(ReservationModel.parse);
};

export const readReservation = async (getToken: GetToken, id: string) => {
    const reservations = await readReservations(getToken, { id: id });
    if (reservations.length !== 1) throw new Error("reservation id not unique");
    return reservations[0];
}

export const deleteReservation = async (getToken: GetToken, id: string) => {
    return await serverDelete(getToken, `/api/reservations/${id}`);
}