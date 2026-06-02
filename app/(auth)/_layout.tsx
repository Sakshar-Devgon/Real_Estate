import { useAuth } from '@clerk/expo'
import { Redirect, Stack } from 'expo-router'

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth() // useAuth hook to get the authentication status of the user from clerk ! 

  if (!isLoaded) {
    return null
  }

  if (isSignedIn) {
    return <Redirect href={'/'} />
  }

  return <Stack screenOptions={{ headerShown: false }} />
}