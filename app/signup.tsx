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
import { useSignUp } from "@clerk/clerk-expo";

const Page = () => {
  // const [countryCode, setCountryCode] = useState("+855");
  // const [phoneNumber, setPhoneNumber] = useState("");

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);

  const { isLoaded, signUp, setActive } = useSignUp();

  const keyboardVerticalOffset = Platform.OS === "ios" ? 80 : 0;
  const router = useRouter();

  const onSignup = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress,
        password,
      });

      // send the email.
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      router.push({
        pathname: "/verify",
      });
    } catch (err: any) {
      console.error("Error signing up: ", JSON.stringify(err, null, 2));
      if (err.errors[0].code === "form_identifier_not_found") {
        Alert.alert("Error", err.errors[0].message);
      }
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="height"
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Let's get started!</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter your phone number. We will send you a confirmation code there
        </Text>

        <View
          style={[
            styles.inputContainer,
            { flex: 1, flexDirection: "column", gap: 10 },
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="First name..."
            placeholderTextColor={Colors.gray}
            value={firstName}
            onChangeText={(firstName) => setFirstName(firstName)}
          />
          <TextInput
            style={styles.input}
            placeholder="Last name..."
            placeholderTextColor={Colors.gray}
            value={lastName}
            onChangeText={(lastName) => setLastName(lastName)}
          />
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
          <Link href={"/login"} replace asChild>
            <TouchableOpacity>
              <Text style={[defaultStyles.textLink, { marginTop: 10 }]}>
                Already have an account? Log in
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            isLoaded ? styles.enabled : styles.disabled,
            { marginBottom: 20 },
          ]}
          onPress={onSignup}
        >
          <Text style={defaultStyles.buttonText}>Sign up</Text>
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
