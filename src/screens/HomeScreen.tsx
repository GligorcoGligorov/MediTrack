import { useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useMedStore } from '../store/useMedStore'
import { RootStackParamList } from '../../App'
import { Medication } from '../types/medication'

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

export default function HomeScreen() {
  const {
    medications,
    loading,
    fetchMedications,
    deleteMedication,
    theme,
    logs,
    fetchLogs,
    logMedication,
    streak,
    calculateStreak,
  } = useMedStore()
  const navigation = useNavigation<NavigationProp>()

  const today = new Date().toISOString().split('T')[0]

  useFocusEffect(
    useCallback(() => {
      fetchMedications()
      fetchLogs(today)
      calculateStreak()
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

  const handleEdit = (medication: Medication) => {
    navigation.navigate('EditMedication', { medication })
  }

  const getLogStatus = (medicationId: number) => {
    const log = logs.find(
      (l) => l.medication_id === medicationId && l.date === today
    )
    return log?.status || null
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        My Medications 💊
      </Text>
      <View style={[styles.streakCard, { backgroundColor: theme.primary }]}>
        <Text style={styles.streakText}>🔥 {streak} day streak</Text>
      </View>
      {loading ? (
        <Text style={[styles.empty, { color: theme.subtext }]}>
          Loading...
        </Text>
      ) : medications.length === 0 ? (
        <Text style={[styles.empty, { color: theme.subtext }]}>
          No medications yet. Add one! ➕
        </Text>
      ) : (
        <FlatList
          data={medications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const status = getLogStatus(item.id)
            return (
              <View style={[styles.card, { backgroundColor: theme.card }]}>
                <View style={styles.cardInfo}>
                  <Text style={[styles.medName, { color: theme.text }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.medDetail, { color: theme.subtext }]}>
                    💊 {item.dosage}
                  </Text>
                  <Text style={[styles.medDetail, { color: theme.subtext }]}>
                    🔄 {item.frequency}
                  </Text>
                  <Text style={[styles.medDetail, { color: theme.subtext }]}>
                    ⏰ {item.time}
                  </Text>
                  <View style={styles.statusRow}>
                    <TouchableOpacity
                      style={[
                        styles.statusBtn,
                        {
                          backgroundColor:
                            status === 'taken' ? '#34C759' : theme.border,
                        },
                      ]}
                      onPress={() => logMedication(item.id, 'taken', today)}
                    >
                      <Text style={styles.statusBtnText}>✅ Taken</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.statusBtn,
                        {
                          backgroundColor:
                            status === 'skipped' ? '#FF3B30' : theme.border,
                        },
                      ]}
                      onPress={() => logMedication(item.id, 'skipped', today)}
                    >
                      <Text style={styles.statusBtnText}>❌ Skipped</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => handleEdit(item)}
                  >
                    <Text style={styles.actionBtnText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => handleDelete(item.id)}
                  >
                    <Text style={styles.actionBtnText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
          }}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, marginTop: 8 },
  empty: { textAlign: 'center', marginTop: 48, fontSize: 16 },
  card: {
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
  medDetail: { fontSize: 14, marginBottom: 2 },
  statusRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  statusBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statusBtnText: { fontSize: 12, fontWeight: '600', color: '#fff' },
  actions: { flexDirection: 'column', gap: 8 },
  actionBtn: { padding: 6 },
  actionBtnText: { fontSize: 18 },
  streakCard: {
  borderRadius: 12,
  padding: 12,
  marginBottom: 16,
  alignItems: 'center',
  },
  streakText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})