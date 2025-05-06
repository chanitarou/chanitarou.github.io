import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView, TextInput, Pressable, Alert, Switch, Platform, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Image } from "expo-image";
import { Camera, Calendar, DollarSign, Truck, Info, Check } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

import Colors from "@/constants/colors";
import { mockNeeds } from "@/mocks/needs";
import { Need } from "@/types";
import { formatCurrency } from "@/utils/currency";

export default function SubmitEntryScreen() {
  const { needId } = useLocalSearchParams<{ needId: string }>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [need, setNeed] = useState<Need | null>(null);
  
  // Form state
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"shipping" | "pickup" | "both">("shipping");
  const [shippingCost, setShippingCost] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [includeShippingInPrice, setIncludeShippingInPrice] = useState(false);

  useEffect(() => {
    // Find the need
    const foundNeed = mockNeeds.find((n) => n.id === needId);
    setNeed(foundNeed || null);

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [needId]);

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

  const handleAddImage = async () => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const handleRemoveImage = (index: number) => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
    
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Validate form
    if (!description || !price) {
      Alert.alert("エラー", "必須項目を入力してください");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        "提案完了",
        "提案が正常に送信されました",
        [
          {
            text: "OK",
            onPress: () => router.push(`/need/${needId}`),
          },
        ]
      );
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "提案を作成" }} />
      
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.needInfoContainer}>
          <Text style={styles.needInfoTitle}>{need.title}</Text>
          <View style={styles.budgetContainer}>
            <Text style={styles.budgetLabel}>予算:</Text>
            <Text style={styles.budgetValue}>
              {formatCurrency(need.budget.min)} ~ {formatCurrency(need.budget.max)}
            </Text>
          </View>
        </View>

        <LinearGradient
          colors={[Colors.light.primaryLight, Colors.light.background]}
          style={styles.formGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>提案内容</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>説明 <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="提案内容の詳細を記入してください"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              placeholderTextColor={Colors.light.subtext}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>価格 <Text style={styles.required}>*</Text></Text>
            <View style={styles.currencyInputContainer}>
              <Text style={styles.currencySymbol}>¥</Text>
              <TextInput
                style={styles.currencyInput}
                placeholder="10,000"
                value={price}
                onChangeText={setPrice}
                keyboardType="number-pad"
                placeholderTextColor={Colors.light.subtext}
              />
            </View>
            <Text style={styles.helperText}>
              予算範囲: {formatCurrency(need.budget.min)} ~ {formatCurrency(need.budget.max)}
            </Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>画像</Text>
            <View style={styles.imagesContainer}>
              {images.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri: image }} style={styles.image} contentFit="cover" />
                  <Pressable
                    style={styles.removeImageButton}
                    onPress={() => handleRemoveImage(index)}
                  >
                    <Text style={styles.removeImageButtonText}>×</Text>
                  </Pressable>
                </View>
              ))}
              {images.length < 3 && (
                <Pressable style={styles.addImageButton} onPress={handleAddImage}>
                  <Camera size={24} color={Colors.light.primary} />
                  <Text style={styles.addImageText}>追加</Text>
                </Pressable>
              )}
            </View>
            <Text style={styles.helperText}>最大3枚まで追加できます</Text>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>納品詳細</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>納品予定日</Text>
            <View style={styles.iconInputContainer}>
              <Calendar size={20} color={Colors.light.subtext} />
              <TextInput
                style={styles.iconInput}
                placeholder="例: 2023/12/31"
                value={estimatedDeliveryDate}
                onChangeText={setEstimatedDeliveryDate}
                placeholderTextColor={Colors.light.subtext}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>納品方法</Text>
            <View style={styles.deliveryMethodContainer}>
              <Pressable
                style={[
                  styles.deliveryMethodButton,
                  deliveryMethod === "shipping" && styles.selectedDeliveryMethod,
                ]}
                onPress={() => setDeliveryMethod("shipping")}
              >
                <Text
                  style={[
                    styles.deliveryMethodText,
                    deliveryMethod === "shipping" && styles.selectedDeliveryMethodText,
                  ]}
                >
                  配送
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.deliveryMethodButton,
                  deliveryMethod === "pickup" && styles.selectedDeliveryMethod,
                ]}
                onPress={() => setDeliveryMethod("pickup")}
              >
                <Text
                  style={[
                    styles.deliveryMethodText,
                    deliveryMethod === "pickup" && styles.selectedDeliveryMethodText,
                  ]}
                >
                  受け取り
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.deliveryMethodButton,
                  deliveryMethod === "both" && styles.selectedDeliveryMethod,
                ]}
                onPress={() => setDeliveryMethod("both")}
              >
                <Text
                  style={[
                    styles.deliveryMethodText,
                    deliveryMethod === "both" && styles.selectedDeliveryMethodText,
                  ]}
                >
                  どちらでも
                </Text>
              </Pressable>
            </View>
          </View>

          {(deliveryMethod === "shipping" || deliveryMethod === "both") && (
            <View style={styles.formGroup}>
              <View style={styles.shippingHeader}>
                <Text style={styles.label}>配送料</Text>
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>価格に含む</Text>
                  <Switch
                    value={includeShippingInPrice}
                    onValueChange={setIncludeShippingInPrice}
                    trackColor={{ false: Colors.light.border, true: Colors.light.primary + '80' }}
                    thumbColor={includeShippingInPrice ? Colors.light.primary : Colors.light.card}
                  />
                </View>
              </View>
              {!includeShippingInPrice && (
                <View style={styles.currencyInputContainer}>
                  <Text style={styles.currencySymbol}>¥</Text>
                  <TextInput
                    style={styles.currencyInput}
                    placeholder="1,000"
                    value={shippingCost}
                    onChangeText={setShippingCost}
                    keyboardType="number-pad"
                    placeholderTextColor={Colors.light.subtext}
                  />
                </View>
              )}
            </View>
          )}

          <View style={styles.formGroup}>
            <Text style={styles.label}>追加情報</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="納品に関する追加情報や注意事項があれば記入してください"
              value={additionalNotes}
              onChangeText={setAdditionalNotes}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              placeholderTextColor={Colors.light.subtext}
            />
          </View>
        </View>

        <View style={styles.termsContainer}>
          <Info size={20} color={Colors.light.subtext} />
          <Text style={styles.termsText}>
            提案を送信することで、ダチオクの利用規約に同意したことになります。
          </Text>
        </View>

        <Pressable 
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Check size={20} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>提案を送信</Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
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
    marginBottom: 24,
  },
  needInfoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 12,
  },
  budgetContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  budgetLabel: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginRight: 8,
  },
  budgetValue: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.primary,
  },
  formGradient: {
    position: 'absolute',
    top: 150,
    left: 0,
    right: 0,
    height: 200,
    opacity: 0.5,
  },
  formSection: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderLight,
    paddingBottom: 8,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 8,
  },
  required: {
    color: Colors.light.error,
  },
  input: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  currencyInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 16,
    color: Colors.light.text,
    marginRight: 8,
  },
  currencyInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: Colors.light.text,
  },
  helperText: {
    fontSize: 12,
    color: Colors.light.subtext,
    marginTop: 4,
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 12,
    marginBottom: 12,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  removeImageButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: Colors.light.background,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderStyle: "dashed",
  },
  addImageText: {
    fontSize: 14,
    color: Colors.light.primary,
    marginTop: 8,
  },
  iconInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingHorizontal: 16,
  },
  iconInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: Colors.light.text,
    marginLeft: 8,
  },
  deliveryMethodContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  deliveryMethodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  selectedDeliveryMethod: {
    backgroundColor: Colors.light.primaryLight,
    borderColor: Colors.light.primary,
  },
  deliveryMethodText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  selectedDeliveryMethodText: {
    color: Colors.light.primary,
    fontWeight: "600",
  },
  shippingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchLabel: {
    fontSize: 14,
    color: Colors.light.text,
    marginRight: 8,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    padding: 16,
    backgroundColor: Colors.light.infoLight,
    borderRadius: 12,
  },
  termsText: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginLeft: 12,
    flex: 1,
  },
  submitButton: {
    flexDirection: "row",
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.light.primary + "80", // 50% opacity
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  errorText: {
    fontSize: 16,
    color: Colors.light.error,
    textAlign: "center",
    marginTop: 24,
  },
});