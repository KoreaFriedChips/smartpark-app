import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useUserListings } from '@/hooks/hooks';
import { TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function ActivityScreen() {
  const userListings = useUserListings();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activities</Text>
      {userListings && userListings.length > 0 && <Link href={`/edit-listing/${userListings[0].id}`} asChild >
        <TouchableOpacity>
          <Text style={styles.title}>Edit listing</Text>
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
