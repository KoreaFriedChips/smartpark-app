import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useListing } from '@/hooks/hooks';
import { useEffect, useRef } from 'react';
import { createReservation } from '@/serverconn';
import { useAuth } from '@clerk/clerk-expo';

export default function BuyController() {
  const { getToken } = useAuth();
  const listing = useListing();
  let desiredInterval = useRef<Interval | undefined>(undefined);

  useEffect(() => {
    if (!listing) return;
    if (listing.availability.length === 0) return;

    desiredInterval.current = listing.availability[0];
  }, [listing]);

  
  const handleSubmitBuy = async() => {
    if (!listing) return;
    if (!desiredInterval.current) return;

    try {
      const reservation = await createReservation(getToken, listing.id, desiredInterval.current);
      console.log("reservation created");
      console.log(reservation);
    } catch (err) {
      console.log(err);
    }

  }
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSubmitBuy}>
        <Text style={styles.title}>buy now</Text>
      </TouchableOpacity>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
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
