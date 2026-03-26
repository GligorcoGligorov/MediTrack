import { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native'
import { supabase } from '../services/supabase'
import { useMedStore } from '../store/useMedStore'

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null)
  const { theme, isDarkMode, toggleTheme } = useMedStore()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.auth.signOut()
          if (error) Alert.alert('Error', error.message)
        },
      },
    ])
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
        <Text style={styles.avatarText}>👤</Text>
      </View>

      <Text style={[styles.email, { color: theme.text }]}>{user?.email}</Text>
      <Text style={[styles.joined, { color: theme.subtext }]}>
        Joined {new Date(user?.created_at).toLocaleDateString()}
      </Text>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          Account Info
        </Text>
        <Text style={[styles.cardText, { color: theme.subtext }]}>
          Email: {user?.email}
        </Text>
        <Text style={[styles.cardText, { color: theme.subtext }]}>
          ID: {user?.id?.slice(0, 8)}...
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          Appearance
        </Text>
        <View style={styles.themeRow}>
          <Text style={[styles.cardText, { color: theme.subtext }]}>
            Dark Mode
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#ddd', true: theme.primary }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.logoutBtn, { backgroundColor: theme.danger }]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  avatarText: { fontSize: 36 },
  email: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  joined: { fontSize: 14, marginBottom: 32 },
  card: {
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  cardText: { fontSize: 14, marginBottom: 6 },
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutBtn: {
    borderRadius: 8,
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
})