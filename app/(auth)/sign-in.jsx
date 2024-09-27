import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Image } from "react-native";

import { images } from "../../constants";
import CustomButton from "../../components/CustomButton"
import FormField from "../../components/FormField";

const SignIn = () => {

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  return (
    <SafeAreaView className="bg-primary h-full">
     <ScrollView>
      <View className="w-full flex justify-center h-full px-4 my-6">

      <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[34px]"
          />

      <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
        Log in to Aora
      </Text>
      <FormField
      title="Email"
      value={form.email}
      handleChangeText = {(e)=>
        setForm({...form,
          email : e
        })
      }
      otherStyles="mt-7"
      keyboardType="email-address"
      />
      <FormField
      title="Password"
      value={form.password}
      handleChangeText = {(e)=>
        setForm({...form,
          password : e
        })
      }
      otherStyles="mt-7"
      />
      <CustomButton
            title="Sign In"

            containerStyles="mt-7"
          />
      <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-psemibold text-secondary"
            >
              Signup
            </Link>
          </View>
      </View>
     </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn;