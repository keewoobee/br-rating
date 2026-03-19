/**
 * 가상 사용자 및 아이스크림 평점 데이터 시드 스크립트
 *
 * 사용법:
 *   npx tsx seed_users.ts <서비스계정키.json 경로>
 *
 * 서비스 계정 키 발급:
 *   Firebase Console → 프로젝트 설정 → 서비스 계정 → 새 비공개 키 생성
 */

import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccountPath = process.argv[2];
if (!serviceAccountPath) {
  console.error('❌ 서비스 계정 키 경로를 인수로 전달해주세요.');
  console.error('   npx tsx seed_users.ts ./serviceAccountKey.json');
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'br-rating-claude',
});

const db = admin.firestore();

// 아이스크림 메뉴 ID 목록 (data.ts 기준)
const menuIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

// 메뉴별 코멘트 풀 (각 메뉴 특성에 맞는 코멘트)
const commentPool: Record<number, string[]> = {
  1: ['피스타치오랑 카다이프 조합 진짜 신선해요!', '두바이 감성 제대로네요 ㅋㅋ', '카다이프 식감이 독특하고 맛있어요', '초콜릿이랑 피스타치오 밸런스 완벽', '비주얼부터 맛까지 완벽한 아이스크림'],
  2: ['꾸덕함이 진짜 장난 아님', '브라우니 조각이 생각보다 커서 좋아요', '초코 좋아하면 무조건 추천', '쫀득한 식감이 중독적이에요', '핑크초콜릿이 달달해서 좋았어요'],
  3: ['흑임자 맛이 진해서 좋아요', '떡이 쫀득쫀득 완벽', '고소한 맛 최고', '한국 맛이라 더 친근해요', '흑임자 진짜 잘 살린 것 같아요'],
  4: ['꿀향이 은은하게 나서 좋아요', '모찌 식감이 정말 쫀득해요', '달달하고 고소해서 자꾸 생각나요', '가성비 최고 아이스크림', '참깨 맛이 독특하게 맛있어요'],
  5: ['호떡 맛 진짜 똑같아요!!', '겨울에 더 생각나는 맛', '견과류가 씹는 재미를 줘요', '시럽리본이 달달해서 맛있어요', '추억의 호떡이 생각나는 맛'],
  6: ['세 가지 맛 다 살아있어요', '밤 맛이 제일 진해요', '고구마랑 옥수수 조합 신기해요', '추억의 간식 느낌 물씬', '달지 않고 고소해서 좋아요'],
  7: ['복숭아 과육이 듬뿍 들어있어요!', '크림치즈랑 복숭아 조합 완벽', '타르트 크럼블이 바삭바삭해요', '상큼달콤 완벽한 여름 아이스크림', '크림치즈 향이 은은하게 좋아요'],
  8: ['꼬북칩 본체보다 맛있어요', '바삭한 식감 살아있어요', '콘스프 맛이 진짜예요', '초코칩이 적당히 들어 달달해요', '중독성 있는 맛이에요'],
  9: ['달달하고 부드러워요', '무난하게 맛있어요', '아이들이 좋아할 것 같은 맛', '달콤한 게 기분 좋아져요', '잔잔하게 맛있는 맛'],
  10: ['생각보다 달지 않아서 좋아요', '고소하고 담백해요', '재료가 신선한 느낌', '또 먹고 싶은 맛', '밸런스가 잘 잡혀 있어요'],
};

const defaultComments = [
  '맛있어요!', '또 사 먹고 싶어요', '강추합니다', '처음에는 별로였는데 계속 먹으니 맛있어요',
  '달달하고 맛있어요', '가성비 좋아요', '독특한 맛이에요', '배스킨라빈스 역시 믿을 수 있어요',
  '식감이 좋아요', '향이 좋아요', '양이 많아서 좋아요', '다음에도 꼭 먹을 거예요',
  '친구랑 나눠먹기 좋아요', '혼자 먹기엔 양이 좀 많네요', '달달함이 딱 적당해요',
];

// 가상 사용자 데이터
const fakeUsers = [
  { id: 'test_user_001', name: '아이스크림덕후', avatar: '🍦' },
  { id: 'test_user_002', name: '민지민지', avatar: '🌸' },
  { id: 'test_user_003', name: '달달러버', avatar: '🍬' },
  { id: 'test_user_004', name: '초코마니아', avatar: '🍫' },
  { id: 'test_user_005', name: '베스킨고수', avatar: '🏆' },
  { id: 'test_user_006', name: '아이스보이', avatar: '🧊' },
  { id: 'test_user_007', name: '핑크러버', avatar: '💕' },
  { id: 'test_user_008', name: '맛탐험가', avatar: '🗺️' },
  { id: 'test_user_009', name: '주말아이스', avatar: '😋' },
  { id: 'test_user_010', name: '크림천국', avatar: '☁️' },
];

// 유저별 평점 패턴 (성향)
const userProfiles = [
  { ratingBias: 0, commentRate: 0.9, countMin: 15, countMax: 20 },  // 많이 먹는 헤비유저
  { ratingBias: 1, commentRate: 0.7, countMin: 8,  countMax: 14 },  // 후한 평가자
  { ratingBias: -1, commentRate: 0.6, countMin: 6, countMax: 12 },  // 까다로운 평가자
  { ratingBias: 0, commentRate: 1.0, countMin: 10, countMax: 15 },  // 코멘트 많이 남기는 유저
  { ratingBias: 1, commentRate: 0.5, countMin: 12, countMax: 18 },  // 전반적으로 좋아함
  { ratingBias: 0, commentRate: 0.3, countMin: 4,  countMax: 8  },  // 가끔 먹는 유저
  { ratingBias: 0.5, commentRate: 0.8, countMin: 8, countMax: 13 }, // 약간 후한 편
  { ratingBias: -0.5, commentRate: 0.7, countMin: 7, countMax: 12 },// 약간 까다로운 편
  { ratingBias: 0, commentRate: 0.5, countMin: 5,  countMax: 10 },  // 보통 유저
  { ratingBias: 0.5, commentRate: 0.9, countMin: 10, countMax: 16 },// 코멘트 잘 남기는 유저
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function getComment(menuId: number): string {
  const pool = commentPool[menuId] || defaultComments;
  return pool[randomInt(0, pool.length - 1)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function seedUsers() {
  console.log('🍦 가상 사용자 데이터 시딩 시작...\n');

  const batch = db.batch();

  for (let i = 0; i < fakeUsers.length; i++) {
    const user = fakeUsers[i];
    const profile = userProfiles[i];

    const count = randomInt(profile.countMin, profile.countMax);
    const selectedMenuIds = shuffle(menuIds).slice(0, Math.min(count, menuIds.length));

    const ratings: Record<string, number> = {};
    const comments: Record<string, string> = {};

    for (const menuId of selectedMenuIds) {
      const baseRating = randomInt(2, 5) + profile.ratingBias;
      const rating = clamp(Math.round(baseRating), 1, 5);
      ratings[String(menuId)] = rating;

      if (Math.random() < profile.commentRate) {
        comments[String(menuId)] = getComment(menuId);
      }
    }

    const docRef = db.collection('users').doc(user.id);
    batch.set(docRef, {
      name: user.name,
      avatar: user.avatar,
      ratings,
      comments,
      updatedAt: new Date().toISOString(),
    });

    const ratingCount = Object.keys(ratings).length;
    const commentCount = Object.keys(comments).length;
    console.log(`  ✅ ${user.name} (${user.avatar}) - 평점 ${ratingCount}개, 코멘트 ${commentCount}개`);
  }

  await batch.commit();
  console.log('\n🎉 완료! Firestore에 가상 사용자 10명 추가됨.');
  console.log('   ID 패턴: test_user_001 ~ test_user_010');
  console.log('\n🗑️  데이터 삭제 시: npx tsx seed_users.ts <key.json> --delete');
}

async function deleteTestUsers() {
  console.log('🗑️  테스트 데이터 삭제 중...\n');
  const batch = db.batch();
  for (const user of fakeUsers) {
    batch.delete(db.collection('users').doc(user.id));
  }
  await batch.commit();
  console.log('✅ 테스트 사용자 10명 삭제 완료');
}

const isDelete = process.argv.includes('--delete');
(isDelete ? deleteTestUsers() : seedUsers())
  .then(() => process.exit(0))
  .catch(err => { console.error('❌ 오류:', err); process.exit(1); });
