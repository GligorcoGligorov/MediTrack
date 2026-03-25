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
import { useMedStore } from '../store/useMedStore'

export default function AddMedicationScreen() {
  const [name, setName] = useState('')
  const [dosage, setDosage] = useState('')
  const [frequency, setFrequency] = useState('')
  const [time, setTime] = useState('')
  const [loading, setLoading] = useState(false)
  const { addMedication } = useMedStore()

  const handleAdd = async () => {
    if (!name || !dosage || !frequency || !time) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    setLoading(true)
    await addMedication({ name, dosage, frequency, time })
    Alert.alert('Success', 'Medication added!')
    setName('')
    setDosage('')
    setFrequency('')
    setTime('')
    setLoading(false)
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Medication ➕</Text>

      <Text style={styles.label}>Medication Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Aspirin"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Dosage</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 500mg"
        value={dosage}
        onChangeText={setDosage}
      />

      <Text style={styles.label}>Frequency</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Twice a day"
        value={frequency}
        onChangeText={setFrequency}
      />

      <Text style={styles.label}>Time</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 8:00 AM"
        value={time}
        onChangeText={setTime}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleAdd}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Adding...' : 'Add Medication'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f8f9fa' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, marginTop: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
})
