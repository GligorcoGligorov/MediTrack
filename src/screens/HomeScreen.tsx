import { useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { useMedStore } from '../store/useMedStore'

export default function HomeScreen() {
  const { medications, loading, fetchMedications, deleteMedication } =
    useMedStore()

  useFocusEffect(
    useCallback(() => {
      fetchMedications()
    }, [])
  )

  const handleDelete = (id: number) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteMedication(id),
      },
    ])
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Medications 💊</Text>
      {loading ? (
        <Text style={styles.empty}>Loading...</Text>
      ) : medications.length === 0 ? (
        <Text style={styles.empty}>No medications yet. Add one! ➕</Text>
      ) : (
        <FlatList
          data={medications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardInfo}>
                <Text style={styles.medName}>{item.name}</Text>
                <Text style={styles.medDetail}>💊 {item.dosage}</Text>
                <Text style={styles.medDetail}>🔄 {item.frequency}</Text>
                <Text style={styles.medDetail}>⏰ {item.time}</Text>
              </View>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.deleteBtnText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f8f9fa' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, marginTop: 8 },
  empty: { textAlign: 'center', color: '#999', marginTop: 48, fontSize: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardInfo: { flex: 1 },
  medName: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  medDetail: { fontSize: 14, color: '#666', marginBottom: 2 },
  deleteBtn: { padding: 8 },
  deleteBtnText: { fontSize: 20 },
})
