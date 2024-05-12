import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSignIn } from "@clerk/clerk-expo";

const Page = () => {
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  const keyboardVerticalOffset = Platform.OS === "ios" ? 80 : 0;
  const router = useRouter();

  const { signIn, setActive } = useSignIn();

  enum SignInType {
    Phone,
    Email,
    Google,
    Facebook,
  }
  const onSignIn = async (type: SignInType) => {
    if (type === SignInType.Email) {
      try {
        const completeSignIn = await signIn?.create({
          identifier: emailAddress,
          password,
        });
        // send the email.
        // await completeSignIn?.prepareFirstFactor({
        //   strategy: "email_code",
        //   emailAddressId: emailAddress,
        // });

        // router.push({
        //   pathname: "/verify?signin=true",
        // });
        await setActive!({ session: completeSignIn?.createdSessionId });
        router.replace("/");
      } catch (err: any) {
        console.error("Error signing in: ", JSON.stringify(err, null, 2));
        if (err.errors[0].code === "form_identifier_not_found") {
          Alert.alert("Error", err.errors[0].message);
        }
      }
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Welcome back</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter the phone number associated with your account
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input]}
            placeholder="Email..."
            placeholderTextColor={Colors.gray}
            keyboardType="email-address"
            value={emailAddress}
            onChangeText={(email) => setEmailAddress(email)}
          />
          <TextInput
            style={[styles.input]}
            placeholder="Password..."
            placeholderTextColor={Colors.gray}
            secureTextEntry={true}
            value={password}
            onChangeText={(password) => setPassword(password)}
          />
        </View>

        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            emailAddress !== "" || password !== "" || password.length < 8
              ? styles.enabled
              : styles.disabled,
            { marginBottom: 20 },
          ]}
          onPress={() => onSignIn(SignInType.Email)}
        >
          <Text style={defaultStyles.buttonText}>Continue</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <View
            style={{
              flex: 1,
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.gray,
            }}
          />
          <Text style={{ color: Colors.gray, fontSize: 20 }}>or</Text>
          <View
            style={{
              flex: 1,
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.gray,
            }}
          />
        </View>

        <TouchableOpacity
          onPress={() => onSignIn(SignInType.Google)}
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: "row",
              gap: 16,
              marginTop: 20,
              backgroundColor: "#fff",
            },
          ]}
        >
          <Ionicons name="logo-google" size={24} color={"#000"} />
          <Text style={[defaultStyles.buttonText, { color: "#000" }]}>
            Continue with Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onSignIn(SignInType.Facebook)}
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: "row",
              gap: 16,
              marginTop: 20,
              backgroundColor: "#fff",
            },
          ]}
        >
          <Ionicons name="logo-facebook" size={24} color={"#000"} />
          <Text style={[defaultStyles.buttonText, { color: "#000" }]}>
            Continue with Facebook
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 20,
    display: "flex",
    flex: 1,
    flexDirection: "column",
    gap: 20,
  },
  input: {
    backgroundColor: Colors.lightGray,
    padding: 10,
    borderRadius: 4,
    fontSize: 20,
    marginRight: 10,

    height: 60,
  },
  enabled: {
    backgroundColor: Colors.primary,
  },
  disabled: {
    backgroundColor: Colors.primaryMuted,
  },
});

export default Page;
