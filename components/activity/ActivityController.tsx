import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useReservations, useUserListings } from '@/hooks';
import { TouchableOpacity } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

export default function ActivityController() {
  const userListings = useUserListings();
  const { reservations, refreshReservations } = useReservations();
  useFocusEffect(
    useCallback(() => {refreshReservations()}, [])
  );
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activities</Text>
      {userListings && userListings.length > 0 && <Link href={`/listing/${userListings[0].id}/edit/`} asChild >
        <TouchableOpacity>
          <Text style={styles.title}>Edit listing</Text>
        </TouchableOpacity>
      </Link>}
      {reservations && reservations.length > 0 && <Link href={`/reservation/${reservations[0].id}`} asChild >
        <TouchableOpacity>
          <Text style={styles.title}>View Reservation</Text>
        </TouchableOpacity>
      </Link>}
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/two.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
