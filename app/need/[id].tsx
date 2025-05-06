import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView, Pressable, Alert, Platform, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Image } from "expo-image";
import { Calendar, Clock, Heart, MessageSquare, Share2, Eye, ChevronLeft, ChevronRight, Star, MapPin, Tag, AlertCircle, Check, DollarSign, Truck, MapPinOff } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

import Colors from "@/constants/colors";
import { mockNeeds } from "@/mocks/needs";
import { mockUsers } from "@/mocks/users";
import { mockEntries } from "@/mocks/entries";
import { formatCurrency } from "@/utils/currency";
import { formatDate, formatDeadline } from "@/utils/date";
import UserAvatar from "@/components/UserAvatar";
import EntryCard from "@/components/EntryCard";
import { categories } from "@/constants/categories";
import { Need, User } from "@/types";

export default function NeedDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [need, setNeed] = useState<Need | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Find the need and user
    const foundNeed = mockNeeds.find((n) => n.id === id);
    setNeed(foundNeed || null);
    
    if (foundNeed) {
      const foundUser = mockUsers.find((u) => u.id === foundNeed.userId);
      setUser(foundUser || null);
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
        <Text style={styles.loadingText}>ニーズを読み込み中...</Text>
      </View>
    );
  }

  if (!need) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>ニーズが見つかりませんでした</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>ユーザーが見つかりませんでした</Text>
      </View>
    );
  }

  const entries = mockEntries.filter((e) => e.needId === need.id);
  const categoryName = categories.find(c => c.id === need.category)?.name || "その他";

  const toggleFavorite = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    Alert.alert("共有", "共有機能は開発中です");
  };

  const handleContact = () => {
    router.push(`/conversation/${user.id}`);
  };

  const handleSubmitEntry = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      router.push(`/submit-entry/${need.id}`);
    }, 500);
  };

  const nextImage = () => {
    if (currentImageIndex < need.images.length - 1) {
      if (Platform.OS !== "web") {
        Haptics.selectionAsync();
      }
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      if (Platform.OS !== "web") {
        Haptics.selectionAsync();
      }
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  // Helper function to render tags
  const renderTags = () => {
    if (!need.tags || need.tags.length === 0) return null;
    
    return (
      <View style={styles.tagsContainer}>
        {Array.isArray(need.tags) ? (
          need.tags.map((tag, index) => (
            <View key={index} style={styles.tagBadge}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))
        ) : typeof need.tags === 'string' ? (
          // Use type assertion to tell TypeScript that need.tags is a string
          (need.tags as string).split(',').map((tag, index) => (
            <View key={index} style={styles.tagBadge}>
              <Text style={styles.tagText}>{tag.trim()}</Text>
            </View>
          ))
        ) : null}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "ニーズ詳細" }} />
      
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: need.images[currentImageIndex] }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.6)", "transparent", "transparent"]}
            style={styles.imageGradient}
          />
          
          {need.images.length > 1 && (
            <>
              <Pressable
                style={[styles.imageNavButton, styles.prevButton]}
                onPress={prevImage}
                disabled={currentImageIndex === 0}
              >
                <ChevronLeft
                  size={24}
                  color="#FFFFFF"
                  style={{ opacity: currentImageIndex === 0 ? 0.5 : 1 }}
                />
              </Pressable>
              <Pressable
                style={[styles.imageNavButton, styles.nextButton]}
                onPress={nextImage}
                disabled={currentImageIndex === need.images.length - 1}
              >
                <ChevronRight
                  size={24}
                  color="#FFFFFF"
                  style={{
                    opacity: currentImageIndex === need.images.length - 1 ? 0.5 : 1,
                  }}
                />
              </Pressable>
              <View style={styles.imagePagination}>
                {need.images.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      index === currentImageIndex && styles.activePaginationDot,
                    ]}
                  />
                ))}
              </View>
            </>
          )}
          
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{categoryName}</Text>
          </View>
          
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{getStatusText(need.status)}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{need.title}</Text>
            <View style={styles.actions}>
              <Pressable style={styles.actionButton} onPress={toggleFavorite}>
                <Heart
                  size={24}
                  color={isFavorite ? Colors.light.error : Colors.light.text}
                  fill={isFavorite ? Colors.light.error : "transparent"}
                />
              </Pressable>
              <Pressable style={styles.actionButton} onPress={handleShare}>
                <Share2 size={24} color={Colors.light.text} />
              </Pressable>
            </View>
          </View>

          {need.isUrgent && (
            <View style={styles.urgentBanner}>
              <AlertCircle size={16} color="#FFFFFF" />
              <Text style={styles.urgentText}>緊急ニーズ</Text>
            </View>
          )}

          <View style={styles.budgetContainer}>
            <View style={styles.budgetHeader}>
              <DollarSign size={18} color={Colors.light.primary} />
              <Text style={styles.budgetLabel}>予算:</Text>
            </View>
            <Text style={styles.budgetValue}>
              {formatCurrency(need.budget.min)} ~ {formatCurrency(need.budget.max)}
            </Text>
            {need.isNegotiable && (
              <View style={styles.negotiableBadge}>
                <Text style={styles.negotiableText}>交渉可</Text>
              </View>
            )}
          </View>

          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Calendar size={16} color={Colors.light.subtext} />
              <Text style={styles.metaText}>
                投稿日: {formatDate(new Date(need.createdAt))}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Clock size={16} color={Colors.light.subtext} />
              <Text style={styles.metaText}>
                締切: {formatDeadline(new Date(need.deadline))}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Eye size={16} color={Colors.light.subtext} />
              <Text style={styles.metaText}>{need.viewCount} 閲覧</Text>
            </View>
            {need.location ? (
              <View style={styles.metaItem}>
                <MapPin size={16} color={Colors.light.subtext} />
                <Text style={styles.metaText}>{need.location}</Text>
              </View>
            ) : (
              <View style={styles.metaItem}>
                <MapPinOff size={16} color={Colors.light.subtext} />
                <Text style={styles.metaText}>場所指定なし</Text>
              </View>
            )}
            {need.quantity && (
              <View style={styles.metaItem}>
                <Tag size={16} color={Colors.light.subtext} />
                <Text style={styles.metaText}>数量: {need.quantity}</Text>
              </View>
            )}
          </View>

          <View style={styles.userContainer}>
            <UserAvatar user={user} size={48} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.displayName}</Text>
              <View style={styles.userRating}>
                <Star size={14} color={Colors.light.warning} fill={Colors.light.warning} />
                <Text style={styles.ratingText}>{user.rating.toFixed(1)}</Text>
              </View>
            </View>
            <Pressable style={styles.contactButton} onPress={handleContact}>
              <MessageSquare size={16} color="#FFFFFF" />
              <Text style={styles.contactButtonText}>メッセージ</Text>
            </Pressable>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>詳細</Text>
            <Text style={styles.description}>{need.description}</Text>
            
            {renderTags()}
          </View>

          {need.preferredDeliveryMethod && (
            <View style={styles.deliveryContainer}>
              <Text style={styles.sectionTitle}>
                <Truck size={18} color={Colors.light.text} style={styles.sectionIcon} />
                希望納品方法
              </Text>
              <View style={styles.deliveryOptions}>
                <View style={[
                  styles.deliveryOption,
                  (need.preferredDeliveryMethod === "shipping" || need.preferredDeliveryMethod === "both") && styles.activeDeliveryOption
                ]}>
                  <Check size={16} color={
                    (need.preferredDeliveryMethod === "shipping" || need.preferredDeliveryMethod === "both") 
                      ? Colors.light.primary 
                      : Colors.light.border
                  } />
                  <Text style={[
                    styles.deliveryOptionText,
                    (need.preferredDeliveryMethod === "shipping" || need.preferredDeliveryMethod === "both") && styles.activeDeliveryOptionText
                  ]}>配送</Text>
                </View>
                <View style={[
                  styles.deliveryOption,
                  (need.preferredDeliveryMethod === "pickup" || need.preferredDeliveryMethod === "both") && styles.activeDeliveryOption
                ]}>
                  <Check size={16} color={
                    (need.preferredDeliveryMethod === "pickup" || need.preferredDeliveryMethod === "both") 
                      ? Colors.light.primary 
                      : Colors.light.border
                  } />
                  <Text style={[
                    styles.deliveryOptionText,
                    (need.preferredDeliveryMethod === "pickup" || need.preferredDeliveryMethod === "both") && styles.activeDeliveryOptionText
                  ]}>受け取り</Text>
                </View>
              </View>
            </View>
          )}

          {need.additionalRequirements && (
            <View style={styles.additionalContainer}>
              <Text style={styles.sectionTitle}>追加要件</Text>
              <Text style={styles.additionalText}>{need.additionalRequirements}</Text>
            </View>
          )}

          <View style={styles.entriesContainer}>
            <View style={styles.entriesHeader}>
              <Text style={styles.sectionTitle}>提案 ({entries.length})</Text>
              {entries.length > 0 && (
                <Text
                  style={styles.viewAllText}
                  onPress={() => router.push(`/entries/${need.id}`)}
                >
                  すべて見る
                </Text>
              )}
            </View>

            {entries.length > 0 ? (
              entries.slice(0, 2).map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
              ))
            ) : (
              <View style={styles.emptyEntries}>
                <Text style={styles.emptyEntriesText}>
                  まだ提案はありません。最初の提案者になりましょう！
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.relatedContainer}>
            <Text style={styles.sectionTitle}>関連するニーズ</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.relatedScrollContent}
            >
              {mockNeeds
                .filter(n => n.category === need.category && n.id !== need.id)
                .slice(0, 5)
                .map(relatedNeed => (
                  <View key={relatedNeed.id} style={styles.relatedNeedContainer}>
                    <Pressable 
                      style={styles.relatedNeedCard}
                      onPress={() => router.push(`/need/${relatedNeed.id}`)}
                    >
                      <Image
                        source={{ uri: relatedNeed.images[0] }}
                        style={styles.relatedNeedImage}
                        contentFit="cover"
                      />
                      <View style={styles.relatedNeedContent}>
                        <Text style={styles.relatedNeedTitle} numberOfLines={2}>
                          {relatedNeed.title}
                        </Text>
                        <Text style={styles.relatedNeedBudget}>
                          {formatCurrency(relatedNeed.budget.min)} ~ {formatCurrency(relatedNeed.budget.max)}
                        </Text>
                      </View>
                    </Pressable>
                  </View>
                ))
              }
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable 
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
          onPress={handleSubmitEntry}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>提案を送信</Text>
          )}
        </Pressable>
      </View>
    </View>
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
    paddingBottom: 100,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 350,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  imageNavButton: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  prevButton: {
    left: 16,
  },
  nextButton: {
    right: 16,
  },
  imagePagination: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  activePaginationDot: {
    backgroundColor: "#FFFFFF",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  categoryBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  statusBadge: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: "800",
    color: Colors.light.text,
    marginRight: 16,
    lineHeight: 32,
  },
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.card,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  urgentBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.error,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  urgentText: {
    color: "#FFFFFF",
    fontWeight: "700",
    marginLeft: 8,
  },
  budgetContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: Colors.light.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  budgetHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  budgetLabel: {
    fontSize: 16,
    color: Colors.light.primary,
    marginRight: 8,
    fontWeight: "600",
  },
  budgetValue: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.light.primary,
    flex: 1,
  },
  negotiableBadge: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  negotiableText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  metaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
    backgroundColor: Colors.light.card,
    padding: 16,
    borderRadius: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginLeft: 6,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
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
    fontSize: 16,
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
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  contactButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    marginLeft: 6,
  },
  descriptionContainer: {
    marginBottom: 24,
    backgroundColor: Colors.light.card,
    padding: 16,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.light.text,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  sectionIcon: {
    marginRight: 8,
  },
  description: {
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
  },
  tagBadge: {
    backgroundColor: Colors.light.secondaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: Colors.light.secondary,
    fontWeight: "600",
  },
  deliveryContainer: {
    marginBottom: 24,
    backgroundColor: Colors.light.card,
    padding: 16,
    borderRadius: 16,
  },
  deliveryOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  deliveryOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.background,
  },
  activeDeliveryOption: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primaryLight,
  },
  deliveryOptionText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.light.text,
  },
  activeDeliveryOptionText: {
    color: Colors.light.primary,
    fontWeight: "600",
  },
  additionalContainer: {
    marginBottom: 24,
    backgroundColor: Colors.light.card,
    padding: 16,
    borderRadius: 16,
  },
  additionalText: {
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
  },
  entriesContainer: {
    marginBottom: 24,
  },
  entriesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: "700",
  },
  emptyEntries: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  emptyEntriesText: {
    fontSize: 14,
    color: Colors.light.subtext,
    textAlign: "center",
    lineHeight: 20,
  },
  relatedContainer: {
    marginBottom: 24,
  },
  relatedScrollContent: {
    paddingRight: 16,
  },
  relatedNeedContainer: {
    width: 200,
    marginRight: 12,
  },
  relatedNeedCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  relatedNeedImage: {
    width: "100%",
    height: 120,
  },
  relatedNeedContent: {
    padding: 12,
  },
  relatedNeedTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 4,
  },
  relatedNeedBadge: {
    fontSize: 12,
    color: Colors.light.primary,
    fontWeight: "600",
  },
  relatedNeedBudget: {
    fontSize: 12,
    color: Colors.light.primary,
    fontWeight: "600",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: Colors.light.primary + "80", // 50% opacity
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  errorText: {
    fontSize: 16,
    color: Colors.light.error,
    textAlign: "center",
    marginTop: 24,
  },
});