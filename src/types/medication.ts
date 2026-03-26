export type Medication = {
  id: number
  name: string
  dosage: string
  frequency: string
  time: string
  user_id: string
}
export type MedicationLog = {
  id: number
  medication_id: number
  user_id: string
  date: string
  status: 'taken' | 'skipped'
}