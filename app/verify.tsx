import { View, Text, StyleSheet, Alert } from "react-native";
import React, { Fragment, useEffect, useState } from "react";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import {
  isClerkAPIResponseError,
  useSignIn,
  useSignUp,
} from "@clerk/clerk-expo";
import { defaultStyles } from "@/constants/Styles";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import Colors from "@/constants/Colors";

const Page = () => {
  const [code, setCode] = useState("");
  const { signin } = useLocalSearchParams<{
    signin: string;
  }>();
  const router = useRouter();
  const CELL_COUNT: number = 6;

  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });

  // const { signIn } = useSignIn();
  const { signUp, setActive } = useSignUp();

  useEffect(() => {
    if (code.length === 6) {
      verifyCode();
    }
  }, [code]);

  const verifyCode = async () => {
    try {
      const verifyCoplete = await signUp!.attemptEmailAddressVerification({
        code,
      });
      await setActive!({ session: verifyCoplete!.createdSessionId });
      router.replace("/");
    } catch (err: any) {
      console.log("Error", JSON.stringify(err, null, 2));
      if (isClerkAPIResponseError(err)) {
        Alert.alert("Error", err.errors[0].message);
      }
    }
  };

  // const verifySignIn = async () => {
  //   try {
  //     await signIn!.attemptFirstFactor({ strategy: "phone_code", code: code });
  //     await setActive!({ session: signIn!.createdSessionId });
  //   } catch (err) {
  //     console.log("error", JSON.stringify(err, null, 2));
  //     if (isClerkAPIResponseError(err)) {
  //       Alert.alert("Error", err.errors[0].message);
  //     }
  //   }
  // };

  return (
    <View style={defaultStyles.container}>
      <Text style={defaultStyles.header}>Welcome back</Text>
      <Text style={defaultStyles.descriptionText}>
        Code sent to your email unless you already have an account
      </Text>
      <CodeField
        ref={ref}
        {...props}
        value={code}
        onChangeText={setCode}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <Fragment key={index}>
            <View
              // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
              onLayout={getCellOnLayoutHandler(index)}
              key={index}
              style={[styles.cellRoot, isFocused && styles.focusCell]}
            >
              <Text style={styles.cellText}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            </View>
            {index === 2 ? (
              <View key={`separator-${index}`} style={styles.separator} />
            ) : null}
          </Fragment>
        )}
      />
      <Link href={"/login"} replace asChild>
        <Text style={[defaultStyles.textLink]}>
          Already have an account? Log in
        </Text>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  codeFieldRoot: {
    marginVertical: 20,
    marginLeft: "auto",
    marginRight: "auto",
    gap: 12,
  },
  cellRoot: {
    width: 45,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
  },
  cellText: {
    color: "#000",
    fontSize: 36,
    textAlign: "center",
  },
  focusCell: {
    paddingBottom: 8,
  },
  separator: {
    height: 2,
    width: 10,
    backgroundColor: Colors.gray,
    alignSelf: "center",
  },
});

export default Page;
