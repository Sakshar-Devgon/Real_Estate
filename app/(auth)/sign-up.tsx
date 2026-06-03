import React from 'react'
import { View , Text, TextInput, TouchableOpacity, ActivityIndicator} from 'react-native'
import { ScrollView } from 'react-native'
import { Image } from 'react-native'
import {useSignUp} from "@clerk/expo"
import { useAuth } from '@clerk/expo'
import { Ionicons } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'

export default function SignUp() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const {isSignedIn} = useAuth();

  const router = useRouter();

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [code, setCode] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const isLoading = fetchStatus === "fetching";

  if(signUp.status === "complete" || isSignedIn){
    return null; 
    }

  const onSignUpPress = async () => {
   const { error } = await signUp.password({
      emailAddress: email,      // function for signing up the user with email and password
      password: password,
      firstName: firstName,
      lastName: lastName
    });

    if(error){
      alert(error.message);
      return;
    }

    if(!error) {
      await signUp.verifications.sendEmailCode();
      setPendingVerification(true);
    }
  };

  const onCancelVerification = async () => {
    try {
      if (signUp && typeof (signUp as any).abandonAt === 'function') {
        await (signUp as any).abandonAt(new Date());
      }
    } catch (_) {}
    setPendingVerification(false);
    setCode('');
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    router.replace('/sign-up');
  };

  const onVerifyPress = async () => {
    await signUp.verifications.verifyEmailCode({
      code,
    });

    if(signUp.status === "complete"){
      await signUp.finalize({
        navigate: ({decorateUrl})=>{
          const url = decorateUrl("/");
          router.replace(url as any);
        }
      })
    }

  };

  if(pendingVerification){
    return(

     <View className="flex-1 items-center justify-center px-6 py-12 bg-white">
            <Image source={require("../../assets/images/Kribb.png")} 
            className = "w-32 h-16 mb-8"
            resizeMode='contain'
            />

            <Text className="text-3xl font-bold text-gray-800 mb-2">
              Verify your account{" "}
            </Text>
            <Text className='text-gray-500 mb-8'>We sent a code to <Text className="font-semibold text-gray-800">{email}</Text>{"\n"}Wrong email?</Text>

            <TextInput
               className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"
               placeholder="Enter Verification code"
               placeholderTextColor="#9CA3AF"
               value={code}
               onChangeText={setCode}
               keyboardType="number-pad"
               autoCapitalize="none"
            />
            {errors.fields.code && (
                <Text className="text-red-500 text-sm mb-2">
                  {errors.fields.code.message}
                </Text>
              )}

               <TouchableOpacity
             onPress={onVerifyPress}  /// onVerifyPress function will be triggered 
             disabled={isLoading}
             className={`w-full bg-blue-600 rounded-xl py-4 items-center mb-4 ${isLoading ? 'opacity-50' : ''}`}
             >
              {isLoading ? (
               <ActivityIndicator color = "white" />
              ) : (
                <Text className="text-white text-base font-bold">Verify</Text>
              )}
             </TouchableOpacity>

             <TouchableOpacity 
             onPress={() => signUp.verifications.sendEmailCode()}
             className = "py-2"
             >
              <Text className="text-blue-600">I need a new Code</Text>
             </TouchableOpacity>

             <TouchableOpacity
             onPress={onCancelVerification}
             className="py-2"
             >
              <Text className="text-red-500">Use a different email</Text>
             </TouchableOpacity>
          </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{flexGrow:1}}
    className = "bg-white"
    keyboardShouldPersistTaps='handled'
    >
        <View className="flex-1 items-center justify-center px-6 py-12">
            <Image source={require("../../assets/images/Kribb.png")} 
            className = "w-32 h-16 mb-8"
            resizeMode='contain'
            />

            <Text className="text-3xl font-bold text-gray-800 mb-2">
              Create account
            </Text>
            <Text className='text-gray-500 mb-8'> Find your Dream Home today!</Text>
            

            <View className="flex-row gap-3 mb-4">
              <TextInput
               className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
               placeholder="First Name"
               placeholderTextColor="#9CA3AF"
               value={firstName}
               onChangeText={setFirstName}
               autoCapitalize="words"
              />

              <TextInput
               className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
               placeholder="Last Name"
               placeholderTextColor="#9CA3AF"
               value={lastName}
               onChangeText={setLastName}
               autoCapitalize="words"
              />
            </View>

             <TextInput
               className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"
               placeholder="Email"
               placeholderTextColor="#9CA3AF"
               value={email}
               onChangeText={setEmail}
               keyboardType="email-address"
               autoCapitalize="none"
              />
              {errors.fields.emailAddress && (
                <Text className="text-red-500 text-sm mb-2">
                  {errors.fields.emailAddress.message}
                </Text>
              )}

              <View className="w-full flex-row items-center border border-gray-300 rounded-xl px-4 mb-6">
                <TextInput
                  className="flex-1 py-3"
                  placeholder="Password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
              {errors.fields.password && (
                <Text className="text-red-500 text-sm mb-2">
                  {errors.fields.password.message}
                </Text>
              )}

             <TouchableOpacity
             onPress={onSignUpPress}  /// onsignup function will be triggered 
             disabled={isLoading}
             className={`w-full bg-blue-600 rounded-xl py-4 items-center mb-4 ${isLoading ? 'opacity-50' : ''}`}
             >
              {isLoading ? (
               <ActivityIndicator color = "white" />
              ) : (
                <Text className="text-white text-base font-bold">Sign Up</Text>
              )}
             </TouchableOpacity>

             <View className="flex-row justify-center">
              <Text className = "text-gray-500">Already have an account? </Text>
              <Link href="/sign-in">
                <Text className="text-blue-600 font-semibold">Sign In</Text>
              </Link>
             </View>
             <View nativeID="clerk-captcha" />
        </View>
    </ScrollView>
  )
}
