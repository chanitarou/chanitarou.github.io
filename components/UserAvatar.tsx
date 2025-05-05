import React from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

import { User } from "@/types";
import Colors from "@/constants/colors";

type UserAvatarProps = {
  user: User;
  size?: number;
  showVerified?: boolean;
};

export default function UserAvatar({
  user,
  size = 40,
  showVerified = true,
}: UserAvatarProps) {
  const initials = user.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <View style={{ position: "relative" }}>
      {user.avatar ? (
        <Image
          source={{ uri: user.avatar }}
          style={[
            styles.avatar,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View
          style={[
            styles.initialsContainer,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        >
          {Platform.OS !== "web" ? (
            <LinearGradient
              colors={[Colors.light.primary, Colors.light.primaryDark]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          ) : (
            <View style={[StyleSheet.absoluteFill, styles.webGradient]} />
          )}
          <Text
            style={[
              styles.initials,
              {
                fontSize: size / 2.5,
              },
            ]}
          >
            {initials}
          </Text>
        </View>
      )}
      {showVerified && user.isVerified && (
        <View
          style={[
            styles.verifiedBadge,
            {
              right: 0,
              bottom: 0,
              width: size / 3,
              height: size / 3,
            },
          ]}
        >
          <Text style={styles.verifiedIcon}>✓</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: Colors.light.card,
    borderWidth: 2,
    borderColor: Colors.light.borderLight,
  },
  initialsContainer: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  webGradient: {
    backgroundColor: Colors.light.primary,
  },
  initials: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  verifiedBadge: {
    position: "absolute",
    backgroundColor: Colors.light.primary,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.light.background,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  verifiedIcon: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "bold",
  },
});