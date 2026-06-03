import { Redirect } from 'expo-router';
import { useAuth } from '@clerk/expo';

export default function Index(){
  const { isLoaded } = useAuth();
  if (!isLoaded) return null;
  return <Redirect href="/splash" />;
}
