import { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { supabase } from './src/services/supabase'
import AuthScreen from './src/screens/AuthScreen'
import HomeScreen from './src/screens/HomeScreen'
import AddMedicationScreen from './src/screens/AddMedicationScreen'
import ProfileScreen from './src/screens/ProfileScreen'
import { Session } from '@supabase/supabase-js'

const Tab = createBottomTabNavigator()

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: '#999',
      tabBarStyle: { paddingBottom: 8, height: 60 },
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{ tabBarLabel: '💊 Home' }}
    />
    <Tab.Screen
      name="Add"
      component={AddMedicationScreen}
      options={{ tabBarLabel: '➕ Add' }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ tabBarLabel: '👤 Profile' }}
    />
  </Tab.Navigator>
)

export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <NavigationContainer>
      {session ? <TabNavigator /> : <AuthScreen />}
    </NavigationContainer>
  )
}
