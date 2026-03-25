# 💊 MediTrack

A healthcare medication reminder app built with React Native, Expo, and Supabase.

## Tech Stack

- React Native + Expo (TypeScript)
- Supabase (Auth + PostgreSQL database)
- React Navigation (Stack + Bottom Tabs)
- Zustand (State Management)
- ESLint + Prettier (Code Quality)

## Features

- User authentication (Register/Login/Logout)
- Add medications with name, dosage, frequency and time
- View all medications in a clean list
- Delete medications
- Data persisted in Supabase cloud database
- Secure session storage with expo-secure-store

## Getting Started

1. Clone the repo
2. Run `npm install`
3. Create a `.env` file with your Supabase credentials:
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
4. Run `npx expo start`