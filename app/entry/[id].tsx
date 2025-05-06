import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView, Pressable, Alert, Platform, ActivityIndicator, Linking } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Image } from "expo-image";
import { Calendar, Clock, MessageSquare, Share2, Star, MapPin, Check, DollarSign, Truck, Phone } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

import Colors from "@/constants/colors";
import { mockEntries } from "@/mocks/entries";
import { mockUsers } from "@/mocks/users";
import { mockNeeds } from "@/mocks/needs";
import { formatCurrency } from "@/utils/currency";
import { formatDate } from "@/utils/date";
import UserAvatar from "@/components/UserAvatar";
import { Entry, Need, User } from "@/types";

export default function EntryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [entry, setEntry] = useState<Entry | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [need, setNeed] = useState<Need | null>(null);

  useEffect(() => {
    // Find the entry, user and need
    const foundEntry = mockEntries.find((e) => e.id === id);
    setEntry(foundEntry || null);
    
    if (foundEntry) {
      const foundUser = mockUsers.find((u) => u.id === foundEntry.userId);
      setUser(foundUser || null);
      
      const foundNeed = mockNeeds.find((n) => n.id === foundEntry.needId);
      setNeed(foundNeed || null);
    }

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text style={styles.loadingText}>提案を読み込み中...</Text>
      </View>
    );
  }

  if (!entry) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>提案が見つかりませんでした</Text>
      </View>
    );
  }

  if (!user || !need) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>データが見つかりませんでした</Text>
      </View>
    );
  }

  const handleShare = () => {
    Alert.alert("共有", "共有機能は開発中です");
  };

  const handleContact = () => {
    router.push(`/conversation/${user.id}`);
  };

  const handleCall = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // In a real app, we would use the actual phone number
    const phoneNumber = "090-1234-5678";
    
    if (Platform.OS !== "web") {
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      Alert.alert("電話", `${phoneNumber}に電話をかけます`);
    }
  };

  const handleAccept = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    Alert.alert(
      "提案を採用",
      "この提案を採用しますか？採用すると、他の提案は自動的に不採用になります。",
      [
        {
          text: "キャンセル",
          style: "cancel",
        },
        {
          text: "採用する",
          style: "default",
          onPress: () => {
            // In a real app, we would update the entry status
            Alert.alert("採用完了", "提案が採用されました。出品者と詳細を詰めてください。");
            router.push(`/need/${need.id}`);
          },
        },
      ]
    );
  };

  const handleReject = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    
    Alert.alert(
      "提案を不採用",
      "この提案を不採用にしますか？",
      [
        {
          text: "キャンセル",
          style: "cancel",
        },
        {
          text: "不採用にする",
          style: "destructive",
          onPress: () => {
            // In a real app, we would update the entry status
            Alert.alert("不採用完了", "提案が不採用になりました。");
            router.push(`/need/${need.id}`);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "提案詳細" }} />
      
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.needInfoContainer}>
          <Text style={styles.needInfoLabel}>ニーズ:</Text>
          <Pressable onPress={() => router.push(`/need/${need.id}`)}>
            <Text style={styles.needInfoTitle} numberOfLines={1}>{need.title}</Text>
          </Pressable>
        </View>

        <View style={styles.userContainer}>
          <UserAvatar user={user} size={56} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.displayName}</Text>
            <View style={styles.userRating}>
              <Star size={16} color={Colors.light.warning} fill={Colors.light.warning} />
              <Text style={styles.ratingText}>{user.rating.toFixed(1)}</Text>
            </View>
          </View>
          <View style={styles.userActions}>
            <Pressable style={styles.messageButton} onPress={handleContact}>
              <MessageSquare size={20} color={Colors.light.primary} />
            </Pressable>
            <Pressable style={styles.callButton} onPress={handleCall}>
              <Phone size={20} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, getStatusStyle(entry.status)]}>
            <Text style={[styles.statusText, getStatusTextStyle(entry.status)]}>
              {getStatusText(entry.status)}
            </Text>
          </View>
        </View>

        <View style={styles.priceContainer}>
          <View style={styles.priceHeader}>
            <DollarSign size={20} color={Colors.light.primary} />
            <Text style={styles.priceLabel}>提案価格:</Text>
          </View>
          <Text style={styles.priceValue}>{formatCurrency(entry.price)}</Text>
        </View>

        {entry.images.length > 0 && (
          <View style={styles.imagesContainer}>
            {entry.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.image}
                contentFit="cover"
                transition={300}
              />
            ))}
          </View>
        )}

        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>提案内容</Text>
          <Text style={styles.description}>{entry.description}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>詳細情報</Text>
          
          <View style={styles.detailItem}>
            <Clock size={18} color={Colors.light.subtext} />
            <Text style={styles.detailLabel}>提案日:</Text>
            <Text style={styles.detailValue}>{formatDate(new Date(entry.createdAt))}</Text>
          </View>
          
          {entry.estimatedDeliveryDate && (
            <View style={styles.detailItem}>
              <Calendar size={18} color={Colors.light.subtext} />
              <Text style={styles.detailLabel}>納品予定日:</Text>
              <Text style={styles.detailValue}>{formatDate(new Date(entry.estimatedDeliveryDate))}</Text>
            </View>
          )}
          
          {entry.deliveryMethod && (
            <View style={styles.detailItem}>
              <Truck size={18} color={Colors.light.subtext} />
              <Text style={styles.detailLabel}>納品方法:</Text>
              <Text style={styles.detailValue}>{getDeliveryMethodText(entry.deliveryMethod)}</Text>
            </View>
          )}
          
          {entry.shippingCost !== undefined && (
            <View style={styles.detailItem}>
              <DollarSign size={18} color={Colors.light.subtext} />
              <Text style={styles.detailLabel}>配送料:</Text>
              <Text style={styles.detailValue}>{formatCurrency(entry.shippingCost)}</Text>
            </View>
          )}
        </View>

        {entry.additionalNotes && (
          <View style={styles.notesContainer}>
            <Text style={styles.sectionTitle}>追加情報</Text>
            <Text style={styles.notesText}>{entry.additionalNotes}</Text>
          </View>
        )}

        {entry.status === "pending" && need.userId === "1" && (
          <View style={styles.actionButtonsContainer}>
            <Pressable style={styles.rejectButton} onPress={handleReject}>
              <Text style={styles.rejectButtonText}>不採用にする</Text>
            </Pressable>
            <Pressable style={styles.acceptButton} onPress={handleAccept}>
              <Check size={20} color="#FFFFFF" />
              <Text style={styles.acceptButtonText}>採用する</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function getStatusStyle(status: Entry["status"]) {
  switch (status) {
    case "pending":
      return styles.statusPending;
    case "accepted":
      return styles.statusAccepted;
    case "rejected":
      return styles.statusRejected;
    default:
      return styles.statusPending;
  }
}

function getStatusTextStyle(status: Entry["status"]) {
  switch (status) {
    case "pending":
      return styles.statusPendingText;
    case "accepted":
      return styles.statusAcceptedText;
    case "rejected":
      return styles.statusRejectedText;
    default:
      return styles.statusPendingText;
  }
}

function getStatusText(status: Entry["status"]) {
  switch (status) {
    case "pending":
      return "審査中";
    case "accepted":
      return "採用";
    case "rejected":
      return "不採用";
    default:
      return "審査中";
  }
}

function getDeliveryMethodText(method: "shipping" | "pickup" | "both") {
  switch (method) {
    case "shipping":
      return "配送";
    case "pickup":
      return "受け取り";
    case "both":
      return "配送または受け取り";
    default:
      return "未定";
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.light.subtext,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  needInfoContainer: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  needInfoLabel: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginRight: 8,
  },
  needInfoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.primary,
    flex: 1,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 4,
  },
  userRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginLeft: 4,
    fontWeight: "600",
  },
  userActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  statusContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  statusPending: {
    backgroundColor: Colors.light.warningLight,
  },
  statusAccepted: {
    backgroundColor: Colors.light.successLight,
  },
  statusRejected: {
    backgroundColor: Colors.light.errorLight,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "700",
  },
  statusPendingText: {
    color: Colors.light.warning,
  },
  statusAcceptedText: {
    color: Colors.light.success,
  },
  statusRejectedText: {
    color: Colors.light.error,
  },
  priceContainer: {
    backgroundColor: Colors.light.primaryLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  priceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: Colors.light.primary,
    marginLeft: 8,
    fontWeight: "600",
  },
  priceValue: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.light.primary,
  },
  imagesContainer: {
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginBottom: 8,
  },
  descriptionContainer: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
  },
  detailsContainer: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginLeft: 8,
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: "500",
    flex: 1,
  },
  notesContainer: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  notesText: {
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: Colors.light.errorLight,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginRight: 8,
  },
  rejectButtonText: {
    color: Colors.light.error,
    fontSize: 16,
    fontWeight: "700",
  },
  acceptButton: {
    flex: 2,
    flexDirection: "row",
    backgroundColor: Colors.light.success,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  errorText: {
    fontSize: 16,
    color: Colors.light.error,
    textAlign: "center",
    marginTop: 24,
  },
});