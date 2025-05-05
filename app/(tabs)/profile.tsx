import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, Pressable, Alert } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Settings, LogOut, Edit, Star, MessageSquare, Heart, Package, ChevronRight } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

import Colors from "@/constants/colors";
import { mockUsers } from "@/mocks/users";
import { mockNeeds } from "@/mocks/needs";

export default function ProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"needs" | "favorites">("needs");
  
  // Use the first mock user as the current user
  const currentUser = mockUsers[0];
  
  // Filter needs by the current user
  const userNeeds = mockNeeds.filter(need => need.userId === currentUser.id);

  const handleTabChange = (tab: "needs" | "favorites") => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
    setActiveTab(tab);
  };

  const handleEditProfile = () => {
    Alert.alert("編集", "プロフィール編集機能は開発中です");
  };

  const handleLogout = () => {
    Alert.alert(
      "ログアウト",
      "本当にログアウトしますか？",
      [
        {
          text: "キャンセル",
          style: "cancel",
        },
        {
          text: "ログアウト",
          style: "destructive",
          onPress: () => {
            // In a real app, we would handle logout logic here
            console.log("User logged out");
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.headerActions}>
          <Pressable style={styles.iconButton} onPress={() => router.push("/settings")}>
            <Settings size={24} color={Colors.light.text} />
          </Pressable>
          <Pressable style={styles.iconButton} onPress={handleLogout}>
            <LogOut size={24} color={Colors.light.text} />
          </Pressable>
        </View>
        
        <View style={styles.profileInfo}>
          <Image
            source={{ uri: currentUser.avatar }}
            style={styles.avatar}
            contentFit="cover"
          />
          <Text style={styles.displayName}>{currentUser.displayName}</Text>
          <Text style={styles.username}>@{currentUser.username}</Text>
          
          <View style={styles.ratingContainer}>
            <Star size={16} color={Colors.light.warning} fill={Colors.light.warning} />
            <Text style={styles.rating}>{currentUser.rating.toFixed(1)}</Text>
          </View>
          
          <Text style={styles.bio}>{currentUser.bio}</Text>
          
          <Pressable style={styles.editButton} onPress={handleEditProfile}>
            <Edit size={16} color="#FFFFFF" />
            <Text style={styles.editButtonText}>プロフィールを編集</Text>
          </Pressable>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userNeeds.length}</Text>
            <Text style={styles.statLabel}>ニーズ</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>取引</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>48</Text>
            <Text style={styles.statLabel}>評価</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.tabsContainer}>
        <Pressable
          style={[styles.tab, activeTab === "needs" && styles.activeTab]}
          onPress={() => handleTabChange("needs")}
        >
          <Package size={20} color={activeTab === "needs" ? Colors.light.primary : Colors.light.subtext} />
          <Text
            style={[
              styles.tabText,
              activeTab === "needs" && styles.activeTabText,
            ]}
          >
            マイニーズ
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "favorites" && styles.activeTab]}
          onPress={() => handleTabChange("favorites")}
        >
          <Heart size={20} color={activeTab === "favorites" ? Colors.light.primary : Colors.light.subtext} />
          <Text
            style={[
              styles.tabText,
              activeTab === "favorites" && styles.activeTabText,
            ]}
          >
            お気に入り
          </Text>
        </Pressable>
      </View>
      
      <View style={styles.contentSection}>
        {activeTab === "needs" ? (
          userNeeds.length > 0 ? (
            userNeeds.map(need => (
              <Pressable 
                key={need.id} 
                style={styles.needItem}
                onPress={() => router.push(`/need/${need.id}`)}
              >
                <Image
                  source={{ uri: need.images[0] }}
                  style={styles.needImage}
                  contentFit="cover"
                />
                <View style={styles.needInfo}>
                  <Text style={styles.needTitle} numberOfLines={1}>{need.title}</Text>
                  <View style={styles.needMeta}>
                    <View style={styles.needMetaItem}>
                      <MessageSquare size={14} color={Colors.light.subtext} />
                      <Text style={styles.needMetaText}>{need.entryCount}</Text>
                    </View>
                    <Text style={styles.needStatus}>{getStatusText(need.status)}</Text>
                  </View>
                </View>
                <ChevronRight size={20} color={Colors.light.subtext} />
              </Pressable>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>まだニーズを投稿していません</Text>
              <Pressable 
                style={styles.emptyStateButton}
                onPress={() => router.push("/post")}
              >
                <Text style={styles.emptyStateButtonText}>ニーズを投稿する</Text>
              </Pressable>
            </View>
          )
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>まだお気に入りはありません</Text>
            <Pressable 
              style={styles.emptyStateButton}
              onPress={() => router.push("/")}
            >
              <Text style={styles.emptyStateButtonText}>ニーズを探す</Text>
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function getStatusText(status: string) {
  switch (status) {
    case "open":
      return "募集中";
    case "in-progress":
      return "進行中";
    case "completed":
      return "完了";
    case "cancelled":
      return "キャンセル";
    default:
      return "募集中";
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  header: {
    backgroundColor: Colors.light.card,
    paddingBottom: 16,
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  profileInfo: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  displayName: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: Colors.light.subtext,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  rating: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginLeft: 4,
  },
  bio: {
    fontSize: 14,
    color: Colors.light.text,
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.text,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.light.subtext,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.light.border,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: Colors.light.primary,
  },
  tabText: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginLeft: 8,
  },
  activeTabText: {
    color: Colors.light.primary,
    fontWeight: "600",
  },
  contentSection: {
    padding: 16,
  },
  needItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  needImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  needInfo: {
    flex: 1,
    marginLeft: 12,
  },
  needTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 4,
  },
  needMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  needMetaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  needMetaText: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginLeft: 4,
  },
  needStatus: {
    fontSize: 12,
    color: Colors.light.primary,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.light.subtext,
    marginBottom: 16,
  },
  emptyStateButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  emptyStateButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});