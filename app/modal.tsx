import React from "react";
import { StyleSheet, View, Text, ScrollView, Pressable } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { X } from "lucide-react-native";

import Colors from "@/constants/colors";

export default function ModalScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ダチオクについて</Text>
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <X size={24} color={Colors.light.text} />
        </Pressable>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Image
          source={{ uri: "https://i.imgur.com/hJJtoqy.jpeg" }}
          style={styles.logo}
          contentFit="contain"
        />
        
        <Text style={styles.appName}>ダチオク</Text>
        <Text style={styles.version}>バージョン 1.0.0</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ダチオクとは</Text>
          <Text style={styles.paragraph}>
            ダチオクは、従来の市場の仕組みを逆転させた新しいマーケットプレイスです。
            消費者が先にニーズを投稿し、それに対して生産者や販売者が競争して最適な提案を行います。
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>解決したい課題</Text>
          <Text style={styles.paragraph}>
            現在の消費財市場では、過剰な広告やプロモーションによって購買意欲が刺激され、
            企業は「売れる前提での大量生産」を行う構造が主流となっています。
          </Text>
          <Text style={styles.paragraph}>
            その結果、以下のような課題が表出化しています：
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• 本来評価されるべき高品質・少量生産の商品が埋もれる</Text>
            <Text style={styles.bulletItem}>• 消費者のニーズと供給がマッチしないまま購買が進む</Text>
            <Text style={styles.bulletItem}>• 不用品や在庫の廃棄が社会課題となる</Text>
          </View>
          <Text style={styles.paragraph}>
            これは大規模マーケティングと大量生産に依存した「供給主導型市場」の限界ともいえます。
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ダチオクによる理想の姿</Text>
          <Text style={styles.paragraph}>
            ニーズが先行してダチオクに投稿されてコンペが開催され、最も良い製品が選ばれて購入される形が
            商品購入の選択肢となります。
          </Text>
          <Text style={styles.paragraph}>
            その結果以下のようになる想定です：
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• 消費者が欲しいもの・探しているものを先に可視化</Text>
            <Text style={styles.bulletItem}>• 生産者や出品社が無駄なくそれに答える形をとる</Text>
            <Text style={styles.bulletItem}>• 無駄な在庫や廃棄を減らす</Text>
            <Text style={styles.bulletItem}>• 高品質な製品が正当に評価される健全な流通環境の実現</Text>
          </View>
          <Text style={styles.paragraph}>
            これによってマーケティングに頼らず高品質な製品を販売する個人の職人等の製品が売れ、
            廃棄も少なくなる「需要主導型市場」が創出されます。
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: "center",
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.light.primary,
    textAlign: "center",
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    color: Colors.light.subtext,
    textAlign: "center",
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
    marginBottom: 12,
  },
  bulletList: {
    marginBottom: 12,
  },
  bulletItem: {
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
    marginBottom: 8,
    paddingLeft: 8,
  },
});