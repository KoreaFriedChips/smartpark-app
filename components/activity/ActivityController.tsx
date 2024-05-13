import { useReservations, useUserListings } from '@/hooks';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import ActivityView from './ActivityView';

export default function ActivityController() {
  const userListings = useUserListings();
  const { reservations, refreshReservations } = useReservations();
  useFocusEffect(
    useCallback(() => {refreshReservations()}, [])
  );
  
  return ( <ActivityView/> );
}