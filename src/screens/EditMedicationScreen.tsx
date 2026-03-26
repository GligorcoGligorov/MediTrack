import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useMedStore } from '../store/useMedStore'
import { Medication } from '../types/medication'
import { scheduleMedicationNotification } from '../services/notifications'

type RootStackParamList = {
  EditMedication: { medication: Medication }
}

type Props = NativeStackScreenProps<RootStackParamList, 'EditMedication'>

export default function EditMedicationScreen({ route, navigation }: Props) {
  const { medication } = route.params
  const { updateMedication, theme } = useMedStore()

  const [name, setName] = useState(medication.name)
  const [dosage, setDosage] = useState(medication.dosage)
  const [frequency, setFrequency] = useState(medication.frequency)
  const [time, setTime] = useState(medication.time)
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    if (!name || !dosage || !frequency || !time) {
        Alert.alert('Error', 'Please fill in all fields')
        return
    }

    setLoading(true)
    await updateMedication(medication.id, { name, dosage, frequency, time })
    await scheduleMedicationNotification(name, time, medication.id)
    setLoading(false)
    navigation.goBack()
    }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        Edit Medication ✏️
      </Text>

      <Text style={[styles.label, { color: theme.text }]}>Medication Name</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
        placeholder="e.g. Aspirin"
        placeholderTextColor={theme.subtext}
        value={name}
        onChangeText={setName}
      />

      <Text style={[styles.label, { color: theme.text }]}>Dosage</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
        placeholder="e.g. 500mg"
        placeholderTextColor={theme.subtext}
        value={dosage}
        onChangeText={setDosage}
      />

      <Text style={[styles.label, { color: theme.text }]}>Frequency</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
        placeholder="e.g. Twice a day"
        placeholderTextColor={theme.subtext}
        value={frequency}
        onChangeText={setFrequency}
      />

      <Text style={[styles.label, { color: theme.text }]}>Time</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
        placeholder="e.g. 8:00 AM"
        placeholderTextColor={theme.subtext}
        value={time}
        onChangeText={setTime}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={handleUpdate}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, marginTop: 8 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
})