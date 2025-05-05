import React, { useState } from "react";
import { StyleSheet, View, Text, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";

import Colors from "@/constants/colors";
import { mockUsers } from "@/mocks/users";
import UserAvatar from "@/components/UserAvatar";

// Mock conversation data
const mockConversations = [
  {
    id: "1",
    userId: "3",
    lastMessage: "テーブルの納期についてご相談があります。",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    unread: 2,
  },
  {
    id: "2",
    userId: "4",
    lastMessage: "ブレスレットのデザインを確認していただけますか？",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    unread: 0,
  },
  {
    id: "3",
    userId: "5",
    lastMessage: "野菜セットの配送日を変更したいのですが、可能でしょうか？",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    unread: 0,
  },
  {
    id: "4",
    userId: "2",
    lastMessage: "ベビー服のサイズについて質問があります。",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    unread: 0,
  },
];

export default function MessagesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  const filteredConversations =
    activeTab === "unread"
      ? mockConversations.filter((conv) => conv.unread > 0)
      : mockConversations;

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      return date.toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 48) {
      return "昨日";
    } else {
      return date.toLocaleDateString("ja-JP", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const renderItem = ({ item }: { item: typeof mockConversations[0] }) => {
    const user = mockUsers.find((u) => u.id === item.userId);
    if (!user) return null;

    return (
      <Pressable
        style={styles.conversationItem}
        onPress={() => router.push(`/conversation/${item.id}`)}
      >
        <UserAvatar user={user} size={56} />
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={styles.userName}>{user.displayName}</Text>
            <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
          </View>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>
        {item.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unread}</Text>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <Pressable
          style={[styles.tab, activeTab === "all" && styles.activeTab]}
          onPress={() => setActiveTab("all")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "all" && styles.activeTabText,
            ]}
          >
            すべて
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "unread" && styles.activeTab]}
          onPress={() => setActiveTab("unread")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "unread" && styles.activeTabText,
            ]}
          >
            未読
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {activeTab === "unread"
                ? "未読のメッセージはありません"
                : "メッセージはありません"}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
  },
  activeTab: {
    backgroundColor: Colors.light.primary + "20", // 20% opacity
  },
  tabText: {
    fontSize: 14,
    color: Colors.light.subtext,
  },
  activeTabText: {
    color: Colors.light.primary,
    fontWeight: "600",
  },
  listContent: {
    paddingVertical: 8,
  },
  conversationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  conversationContent: {
    flex: 1,
    marginLeft: 12,
  },
  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.light.subtext,
  },
  lastMessage: {
    fontSize: 14,
    color: Colors.light.subtext,
  },
  unreadBadge: {
    backgroundColor: Colors.light.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.subtext,
    textAlign: "center",
  },
});