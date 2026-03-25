import { create } from 'zustand'
import { supabase } from '../services/supabase'

type Medication = {
  id: number
  name: string
  dosage: string
  frequency: string
  time: string
  user_id: string
}

type MedStore = {
  medications: Medication[]
  loading: boolean
  fetchMedications: () => Promise<void>
  addMedication: (med: Omit<Medication, 'id' | 'user_id'>) => Promise<void>
  deleteMedication: (id: number) => Promise<void>
}

export const useMedStore = create<MedStore>((set) => ({
  medications: [],
  loading: false,

  fetchMedications: async () => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) set({ medications: data || [] })
    set({ loading: false })
  },

  addMedication: async (med) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    const { error } = await supabase
      .from('medications')
      .insert({ ...med, user_id: user?.id })

    if (!error) {
      const { data } = await supabase
        .from('medications')
        .select('*')
        .order('created_at', { ascending: false })
      set({ medications: data || [] })
    }
  },

  deleteMedication: async (id) => {
    const { error } = await supabase.from('medications').delete().eq('id', id)

    if (!error) {
      set((state) => ({
        medications: state.medications.filter((m) => m.id !== id),
      }))
    }
  },
}))
