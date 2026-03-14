/**
 * プリセット投稿の初期データ投入
 * 実行: npx tsx src/db/seed.ts
 */
import { db } from "./index";
import { posts } from "./schema";

const PRESET_POSTS = [
  { emotion: 5,  body: "息をするのも億劫な夜" },
  { emotion: 10, body: "静かすぎると逆に不安になる" },
  { emotion: 15, body: "空が妙に遠く感じる日" },
  { emotion: 20, body: "雨の音がずっと聞こえている" },
  { emotion: 25, body: "少しだけ、泣きたい気分" },
  { emotion: 30, body: "誰かに話しかけたくなった" },
  { emotion: 35, body: "窓の外を見ていたら時間が経っていた" },
  { emotion: 50, body: "今日も終わっていく" },
  { emotion: 60, body: "何かが変わりそうな予感がする" },
  { emotion: 70, body: "明日は少しだけ違う日になるかもしれない" },
  { emotion: 80, body: "久しぶりに笑った気がする" },
  { emotion: 90, body: "空が澄んでいて、ちょっとだけうれしい" },
];

async function seed() {
  console.log("Seeding preset posts...");
  for (const post of PRESET_POSTS) {
    await db.insert(posts).values({
      userId: null,
      emotion: post.emotion,
      body: post.body,
      isPreset: true,
    });
  }
  console.log(`Seeded ${PRESET_POSTS.length} preset posts.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
