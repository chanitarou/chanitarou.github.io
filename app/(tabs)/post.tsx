import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TextInput, Pressable, Alert, Switch, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { Camera, Plus, X, Calendar, MapPin, Clock, Tag, Info, AlertCircle } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

import Colors from "@/constants/colors";
import { categories } from "@/constants/categories";

export default function PostScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [quantity, setQuantity] = useState("");
  const [tags, setTags] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [preferredDeliveryMethod, setPreferredDeliveryMethod] = useState<"shipping" | "pickup" | "both">("both");
  const [additionalRequirements, setAdditionalRequirements] = useState("");

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
    if (!title || !description || !minBudget || !maxBudget || !selectedCategory) {
      Alert.alert("エラー", "すべての必須項目を入力してください");
      return;
    }

    // In a real app, we would submit the data to a backend
    Alert.alert(
      "投稿完了",
      "ニーズが正常に投稿されました",
      [
        {
          text: "OK",
          onPress: () => router.push("/"),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <LinearGradient
        colors={[Colors.light.primaryLight, Colors.light.background]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <Text style={styles.title}>ニーズを投稿</Text>
      <Text style={styles.subtitle}>
        あなたが探している製品やサービスについて詳しく教えてください
      </Text>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>基本情報</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>タイトル <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="例: 手作りの木製ダイニングテーブルを探しています"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor={Colors.light.subtext}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>説明 <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="詳細な要件、サイズ、素材、デザインなどを記入してください"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            placeholderTextColor={Colors.light.subtext}
          />
        </View>

        <View style={styles.formRow}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>最小予算 <Text style={styles.required}>*</Text></Text>
            <View style={styles.currencyInputContainer}>
              <Text style={styles.currencySymbol}>¥</Text>
              <TextInput
                style={styles.currencyInput}
                placeholder="5,000"
                value={minBudget}
                onChangeText={setMinBudget}
                keyboardType="number-pad"
                placeholderTextColor={Colors.light.subtext}
              />
            </View>
          </View>
          <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>最大予算 <Text style={styles.required}>*</Text></Text>
            <View style={styles.currencyInputContainer}>
              <Text style={styles.currencySymbol}>¥</Text>
              <TextInput
                style={styles.currencyInput}
                placeholder="10,000"
                value={maxBudget}
                onChangeText={setMaxBudget}
                keyboardType="number-pad"
                placeholderTextColor={Colors.light.subtext}
              />
            </View>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>カテゴリー <Text style={styles.required}>*</Text></Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <Pressable
                key={category.id}
                style={[
                  styles.categoryItem,
                  selectedCategory === category.id && styles.selectedCategoryItem,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category.id && styles.selectedCategoryText,
                  ]}
                >
                  {category.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>詳細情報</Text>
        
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
                  <X size={16} color="#FFFFFF" />
                </Pressable>
              </View>
            ))}
            {images.length < 5 && (
              <Pressable style={styles.addImageButton} onPress={handleAddImage}>
                <Camera size={24} color={Colors.light.primary} />
                <Text style={styles.addImageText}>追加</Text>
              </Pressable>
            )}
          </View>
          <Text style={styles.helperText}>最大5枚まで追加できます</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>締め切り <Text style={styles.required}>*</Text></Text>
          <View style={styles.iconInputContainer}>
            <Calendar size={20} color={Colors.light.subtext} />
            <TextInput
              style={styles.iconInput}
              placeholder="例: 2023/12/31"
              value={deadline}
              onChangeText={setDeadline}
              placeholderTextColor={Colors.light.subtext}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>場所</Text>
          <View style={styles.iconInputContainer}>
            <MapPin size={20} color={Colors.light.subtext} />
            <TextInput
              style={styles.iconInput}
              placeholder="例: 東京都渋谷区"
              value={location}
              onChangeText={setLocation}
              placeholderTextColor={Colors.light.subtext}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>数量</Text>
          <View style={styles.iconInputContainer}>
            <Tag size={20} color={Colors.light.subtext} />
            <TextInput
              style={styles.iconInput}
              placeholder="例: 1個"
              value={quantity}
              onChangeText={setQuantity}
              placeholderTextColor={Colors.light.subtext}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>タグ</Text>
          <View style={styles.iconInputContainer}>
            <Tag size={20} color={Colors.light.subtext} />
            <TextInput
              style={styles.iconInput}
              placeholder="例: 手作り,木製,ナチュラル (カンマ区切り)"
              value={tags}
              onChangeText={setTags}
              placeholderTextColor={Colors.light.subtext}
            />
          </View>
        </View>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>追加オプション</Text>
        
        <View style={styles.switchFormGroup}>
          <View style={styles.switchLabelContainer}>
            <AlertCircle size={20} color={Colors.light.error} />
            <Text style={styles.switchLabel}>緊急</Text>
          </View>
          <Switch
            value={isUrgent}
            onValueChange={setIsUrgent}
            trackColor={{ false: Colors.light.border, true: Colors.light.error + '80' }}
            thumbColor={isUrgent ? Colors.light.error : Colors.light.card}
          />
        </View>
        
        <View style={styles.switchFormGroup}>
          <View style={styles.switchLabelContainer}>
            <Info size={20} color={Colors.light.primary} />
            <Text style={styles.switchLabel}>価格交渉可能</Text>
          </View>
          <Switch
            value={isNegotiable}
            onValueChange={setIsNegotiable}
            trackColor={{ false: Colors.light.border, true: Colors.light.primary + '80' }}
            thumbColor={isNegotiable ? Colors.light.primary : Colors.light.card}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>希望納品方法</Text>
          <View style={styles.deliveryMethodContainer}>
            <Pressable
              style={[
                styles.deliveryMethodButton,
                preferredDeliveryMethod === "shipping" && styles.selectedDeliveryMethod,
              ]}
              onPress={() => setPreferredDeliveryMethod("shipping")}
            >
              <Text
                style={[
                  styles.deliveryMethodText,
                  preferredDeliveryMethod === "shipping" && styles.selectedDeliveryMethodText,
                ]}
              >
                配送
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.deliveryMethodButton,
                preferredDeliveryMethod === "pickup" && styles.selectedDeliveryMethod,
              ]}
              onPress={() => setPreferredDeliveryMethod("pickup")}
            >
              <Text
                style={[
                  styles.deliveryMethodText,
                  preferredDeliveryMethod === "pickup" && styles.selectedDeliveryMethodText,
                ]}
              >
                受け取り
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.deliveryMethodButton,
                preferredDeliveryMethod === "both" && styles.selectedDeliveryMethod,
              ]}
              onPress={() => setPreferredDeliveryMethod("both")}
            >
              <Text
                style={[
                  styles.deliveryMethodText,
                  preferredDeliveryMethod === "both" && styles.selectedDeliveryMethodText,
                ]}
              >
                どちらでも
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>追加要件</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="その他の要件や希望があれば記入してください"
            value={additionalRequirements}
            onChangeText={setAdditionalRequirements}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            placeholderTextColor={Colors.light.subtext}
          />
        </View>
      </View>

      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>投稿する</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    opacity: 0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.subtext,
    marginBottom: 24,
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
  formRow: {
    flexDirection: "row",
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
  categoriesContainer: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  selectedCategoryItem: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  selectedCategoryText: {
    color: "#FFFFFF",
    fontWeight: "600",
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
  helperText: {
    fontSize: 12,
    color: Colors.light.subtext,
    marginTop: 4,
  },
  switchFormGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 8,
  },
  switchLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchLabel: {
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
  submitButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});