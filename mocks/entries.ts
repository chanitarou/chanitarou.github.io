import { Entry } from "@/types";

export const mockEntries: Entry[] = [
  {
    id: "1",
    needId: "1",
    userId: "3",
    description: "オーク材を使用した手作りのダイニングテーブルを提供できます。天然オイル仕上げで、環境に優しい素材のみを使用しています。4人家族に最適なサイズで、耐久性も抜群です。",
    price: 120000,
    images: [
      "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?q=80&w=2940&auto=format&fit=crop",
    ],
    status: "pending",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    needId: "1",
    userId: "5",
    description: "ウォールナット材を使用した高級感のあるダイニングテーブルを提案します。職人の手作業で丁寧に仕上げており、末永くご使用いただけます。",
    price: 145000,
    images: [
      "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=2069&auto=format&fit=crop",
    ],
    status: "pending",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    needId: "2",
    userId: "4",
    description: "オーガニックコットン100%の手作りベビー服セットをお作りします。肌に優しい素材と染料のみを使用し、赤ちゃんの敏感な肌にも安心です。",
    price: 6500,
    images: [
      "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?q=80&w=2787&auto=format&fit=crop",
    ],
    status: "pending",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];