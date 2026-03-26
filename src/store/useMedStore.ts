import { cancelMedicationNotification } from '../services/notifications'
import { create } from 'zustand'
import { supabase } from '../services/supabase'
import { lightTheme, darkTheme, Theme } from '../types/theme'
import { Medication, MedicationLog } from '../types/medication'

type MedStore = {
  medications: Medication[]
  loading: boolean
  fetchMedications: () => Promise<void>
  addMedication: (med: Omit<Medication, 'id' | 'user_id'>) => Promise<void>
  deleteMedication: (id: number) => Promise<void>
  updateMedication: (
    id: number,
    updates: Omit<Medication, 'id' | 'user_id'>
  ) => Promise<void>
  // Logs
  logs: MedicationLog[]
  fetchLogs: (date: string) => Promise<void>
  logMedication: (
    medicationId: number,
    status: 'taken' | 'skipped',
    date: string
  ) => Promise<void>
  // Streak
  streak: number
  calculateStreak: () => Promise<void>
  // Theme
  isDarkMode: boolean
  theme: Theme
  toggleTheme: () => void
}

export const useMedStore = create<MedStore>((set, get) => ({
  medications: [],
  loading: false,
  logs: [],
  streak: 0,

  // Theme
  isDarkMode: false,
  theme: lightTheme,
  toggleTheme: () => {
    const isDark = !get().isDarkMode
    set({
      isDarkMode: isDark,
      theme: isDark ? darkTheme : lightTheme,
    })
  },

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
      await cancelMedicationNotification(id)
      set((state) => ({
        medications: state.medications.filter((m) => m.id !== id),
      }))
    }
  },

  updateMedication: async (id, updates) => {
    const { error } = await supabase
      .from('medications')
      .update(updates)
      .eq('id', id)

    if (!error) {
      set((state) => ({
        medications: state.medications.map((m) =>
          m.id === id ? { ...m, ...updates } : m
        ),
      }))
    }
  },

  fetchLogs: async (date) => {
    const { data, error } = await supabase
      .from('medication_logs')
      .select('*')
      .eq('date', date)

    if (!error) set({ logs: data || [] })
  },

  logMedication: async (medicationId, status, date) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const existingLog = get().logs.find(
      (l) => l.medication_id === medicationId && l.date === date
    )

    if (existingLog) {
      const { error } = await supabase
        .from('medication_logs')
        .update({ status })
        .eq('id', existingLog.id)

      if (!error) {
        const { data } = await supabase
          .from('medication_logs')
          .select('*')
          .eq('date', date)
        set({ logs: data || [] })
        await get().calculateStreak() // ← added
      }
    } else {
      const { data, error } = await supabase
        .from('medication_logs')
        .insert({
          medication_id: medicationId,
          user_id: user?.id,
          date,
          status,
        })
        .select()
        .single()

      if (!error) {
        set((state) => ({ logs: [...state.logs, data] }))
        await get().calculateStreak() // ← added
      }
    }
  },

  calculateStreak: async () => {
    const { data: logs, error } = await supabase
      .from('medication_logs')
      .select('*')
      .order('date', { ascending: false })

    if (error || !logs) return

    const medications = get().medications
    if (medications.length === 0) return

    let streak = 0
    const currentDate = new Date()

    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0]
      const dayLogs = logs.filter((l) => l.date === dateStr)

      const allTaken = medications.every((med) =>
        dayLogs.some(
          (l) => l.medication_id === med.id && l.status === 'taken'
        )
      )

      if (!allTaken) break

      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    }

    set({ streak })
  },
}))