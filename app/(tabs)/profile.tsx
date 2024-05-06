import { StyleSheet, TouchableOpacity } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useAuth } from '@clerk/clerk-expo';
import { useUserContext } from '@/hooks';
import { useGivenReviews, useReceivedReviews } from '@/hooks/review-hooks';
import { useEffect } from 'react';


export default function TabTwoScreen() {
  const { signOut } = useAuth();
  const user = useUserContext();
  const givenReviews = useGivenReviews();
  const receivedReviews = useReceivedReviews();

  useEffect(() => {
    if (!givenReviews) return;
    console.log(givenReviews);
  }, [givenReviews]);

  useEffect(() => {
    if (!receivedReviews) return;
    console.log(receivedReviews);
  }, [receivedReviews]);
  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => signOut()}><Text style={styles.title}>Tab Two</Text></TouchableOpacity>
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
