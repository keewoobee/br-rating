export interface MenuItem {
  id: number;
  name: string;
  tags?: string[];
  kcal?: number;
  imageUrl?: string;
  englishName?: string;
  description?: string;
  components?: string[];
  nutrition?: Record<string, string>;
}

export interface TierInfo {
  name: string;
  minCount: number;
  color: string;
  imageUrl: string;
}

export const tiers: TierInfo[] = [
  { 
    name: '싱글레귤러', 
    minCount: 0, 
    color: 'bg-pink-100 text-pink-600', 
    imageUrl: 'https://i.namu.wiki/i/3aD-AwNx2E7TOG59LUZnazaTs0OAWZMQB8fXbd1XoONQjJubXd00lqHdAESVZ8ZGNjfqnb5VW3dNPi1Ee9HvpeQe-qC82wtpzPtjsbkvsgNzluktn8FwBU_vKCwK3QtjZpV7kTdO9PvN4ob4uW9l6w.webp'
  },
  { 
    name: '싱글킹', 
    minCount: 5, 
    color: 'bg-pink-200 text-pink-700', 
    imageUrl: 'https://i.namu.wiki/i/9_YOlP6Dd44RZjNasQW_OU_DqH-qbG_g1XS2vpH5en0gGJEe1-ifg2gwQGpflFAHRG6zbW3FWVI1ccB3a8QoRZaaYxUwKAsVKwBa-3VnCgqMCkaSuA9qnorI0MqUbu7IJNqhh6zG2VbirRb-krqp4w.webp'
  },
  { 
    name: '더블주니어', 
    minCount: 10, 
    color: 'bg-orange-100 text-orange-600', 
    imageUrl: 'https://i.namu.wiki/i/O3rtV0o7E80P2KQzMxO1AFZny4drIWymyXzEOCM7nkZcMnZJHNFM8fq3wG0Q8RGngj8L72HO3NHhyLYIh2MPtN7McoqgsTsVN44Ide7OxvWHK9MxiyGxyXH83FWgVHhUMDNkgygMVHpMOqe8vHK4tw.webp'
  },
  { 
    name: '더블레귤러', 
    minCount: 15, 
    color: 'bg-yellow-100 text-yellow-600', 
    imageUrl: 'https://i.namu.wiki/i/71gnsusKvtYUnd-SLDIZ3v_pDx9MRanXbhzWT13oLR0lIIb92j6-TwleOqJJAY3_0TGQSrdVpMr7-sZcOE4LN3KN_S8aoqhzWqk5SXj1B-hE5RS6rwTqTa1Z-lRJLhYQ5srcb2snnNcuHCVRf7xqpw.webp'
  },
  { 
    name: '파인트', 
    minCount: 20, 
    color: 'bg-yellow-200 text-yellow-700', 
    imageUrl: 'https://i.namu.wiki/i/M7iXqPQ5g7szTtcCNJqaP6XcaBP6e5NUP37JfDVB_1k6r1Hr8pOI4Q1RY92CYLeNMJyfxr6WdbxBxne0eUJrlHn5cFC8QZq0CHfep8jQgLx7XKG3vLNystBhRIyOf0fFMRO-pbpLjIB14nVi_EdTVQ.webp'
  },
  { 
    name: '쿼터', 
    minCount: 25, 
    color: 'bg-blue-100 text-blue-600', 
    imageUrl: 'https://i.namu.wiki/i/Lnb5qDK67HbW09G2NSQSbK3BPg8YVGZHCTtmmj_wJKhg6e8TzTWOb7LhTE5vVtcgMb6R1xxXC9l9o2g64IpVjUzR--do-ULTV6uCzOq4t0zOdAmLgu1ViaXx9d5sQ4SGll3Gg05Zw5ZTOk3FRawubQ.webp'
  },
  { 
    name: '패밀리', 
    minCount: 35, 
    color: 'bg-blue-200 text-blue-700', 
    imageUrl: 'https://i.namu.wiki/i/v45YzDSjdW8r8P7BqbpFIV_GtqKXeRyp7vY7LuAwINpq-z5phenRzgGMhizcOrJkPvy0oTzH8wrTfMBRiPrKpPFkY12e5KXCBiQJ5vTfGNUGc592C-2Nt_OMWf-1eD8aob6cjChj1YvGZK90uH5MYA.webp'
  },
  { 
    name: '하프갤런', 
    minCount: 45, 
    color: 'bg-purple-100 text-purple-600', 
    imageUrl: 'https://i.namu.wiki/i/JlgOwjrOfpeYKAhqU55ve9BVaKiAadTVYxh6u65a3CDMl9sYdbDjPhWDffN4nbO10r89sxC-j-u6QSoRBR-vAaGg6k1KgA7DyTuSAw7q9POZd_UXTylSJawWFyx1koaMu8barDwiidvSh1FptfH_PQ.webp'
  },
];

export const getTier = (count: number): TierInfo => {
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (count >= tiers[i].minCount) {
      return tiers[i];
    }
  }
  return tiers[0];
};

export const menuData: MenuItem[] = [
  {
    "id": 1,
    "name": "두바이에서 온 엄마는 외계인",
    "tags": [
      "이달의맛",
      "2026년",
      "3월",
      "초콜릿",
      "피스타치오",
      "카다이프"
    ],
    "kcal": 295,
    "imageUrl": "/images/1.png",
    "englishName": "ICE PISTACHIO & CHOCOLATE WITH KADAYIF",
    "description": "리얼 카다이프가 들어간 피스타치오&초콜릿 아이스크림에 초콜릿 쫀떡볼이 쏙쏙!",
    "components": [
      "초콜릿",
      "피스타치오",
      "카다이프"
    ],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "295",
      "당류(g)": "24",
      "단백질(g)": "5",
      "포화지방(g)": "8",
      "나트륨(mg)": "153",
      "알레르기 성분": "우유, 밀, 대두"
    }
  },
  {
    "id": 2,
    "name": "진정한 쫀꾸렛",
    "tags": [
      "다크초코",
      "꾸덕함",
      "이달의맛",
      "2026년",
      "2월"
    ],
    "kcal": 265,
    "imageUrl": "/images/2.png",
    "englishName": "The Real Crunchy & Fudge Chocolate Ice cream",
    "description": "바삭, 쫀득, 꾸덕한 초콜렛 아이스크림! 사랑스러운 핑크 초콜릿 향& 초콜릿 아이스크림에 초콜릿 쿠키와 브라우니가 가득",
    "components": [
      "초콜릿 칩",
      "브라우니",
      "핑크초콜릿"
    ],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "265",
      "당류(g)": "26",
      "단백질(g)": "4",
      "포화지방(g)": "9",
      "나트륨(mg)": "97",
      "알레르기 성분": "우유, 대두, 밀, 계란"
    }
  },
  {
    "id": 3,
    "name": "쫀득 만난 흑임자",
    "tags": [
      "흑임자",
      "떡",
      "고소함"
    ],
    "kcal": 259,
    "imageUrl": "/images/3.png",
    "englishName": "CHEWY RICE CAKE & BLACK SESAME ICE CREAM",
    "description": "국내산 100% 쌀 아이스크림 속 쫀득한 쌀떡과 고소한 흑임자 풍미가 가득",
    "components": [
      "쌀",
      "흑임자떡"
    ],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "259",
      "당류(g)": "25",
      "단백질(g)": "3",
      "포화지방(g)": "5",
      "나트륨(mg)": "134",
      "알레르기 성분": "우유, 밀, 대두, 계란, 오징어"
    }
  },
  {
    "id": 4,
    "name": "말랑 꿀떡 모찌",
    "tags": [
      "꿀",
      "모찌",
      "달콤"
    ],
    "kcal": 246,
    "imageUrl": "/images/4.png",
    "englishName": "Chewy Kkultteock Mochi",
    "description": "고소한 참깨 아이스크림에 달콤한 꿀참깨 리본과 쫀득한 떡 다이스가 쏙쏙!",
    "components": [
      "떡",
      "꿀참깨"
    ],
    "nutrition": {
      "1회 제공량(g)": "115 g",
      "열량(kcal)": "246",
      "당류(g)": "31",
      "단백질(g)": "3",
      "포화지방(g)": "6",
      "나트륨(mg)": "88",
      "알레르기 성분": "우유, 대두, 밀"
    }
  },
  {
    "id": 5,
    "name": "아이스 호떡",
    "tags": [
      "호떡",
      "견과류",
      "이달의맛",
      "2020년",
      "11월"
    ],
    "kcal": 286,
    "imageUrl": "/images/5.png",
    "englishName": "Ice Hotteok",
    "description": "달콤한 호떡맛 아이스크림에 호떡 시럽리본과 씨앗, 떡 다이스가 어우러진 아이스크림",
    "components": [
      "호떡",
      "견과류"
    ],
    "nutrition": {
      "1회 제공량(g)": "115 g",
      "열량(kcal)": "286",
      "당류(g)": "29",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "85",
      "알레르기 성분": "우유, 대두, 밀, 땅콩"
    }
  },
  {
    "id": 6,
    "name": "밤이 옥수로 맛있구마",
    "tags": [
      "밤",
      "옥수수",
      "고구마"
    ],
    "kcal": 236,
    "imageUrl": "/images/6.png",
    "englishName": "MARON, CORN, AND SWEET POTATO",
    "description": "아이스크림으로 즐기는 추억의 간식. 밤, 옥수수, 고구마",
    "components": [
      "밤",
      "옥수수",
      "고구마"
    ],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "236",
      "당류(g)": "21",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "76",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 7,
    "name": "크림치즈 피치 타르트",
    "tags": [
      "복숭아",
      "크림치즈"
    ],
    "kcal": 231,
    "imageUrl": "/images/7.png",
    "englishName": "Cream Cheese Peach Tart",
    "description": "부드러운 크림치즈에 달콤한 복숭아를 올리고 타르트의 식감을 살린 아이스크림",
    "components": [
      "타르트 크럼블",
      "구운복숭아과육"
    ],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "231",
      "당류(g)": "23",
      "단백질(g)": "4",
      "포화지방(g)": "7",
      "나트륨(mg)": "89",
      "알레르기 성분": "우유, 밀, 복숭아"
    }
  },
  {
    "id": 8,
    "name": "아이스 꼬북칩",
    "tags": [
      "콘스프",
      "초코칩",
      "바삭",
      "이달의맛",
      "2021년",
      "8월"
    ],
    "kcal": 284,
    "imageUrl": "/images/8.png",
    "englishName": "ICE TURTLE CHIP",
    "description": "바삭한 꼬북칩과  달콤한 시나몬 초콜릿의 완벽한 만남!",
    "components": [
      "꼬북칩"
    ],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "284",
      "당류(g)": "25",
      "단백질(g)": "4",
      "포화지방(g)": "10",
      "나트륨(mg)": "95",
      "알레르기 성분": "우유, 대두, 밀"
    }
  },
  {
    "id": 9,
    "name": "치즈 고구마구마",
    "tags": [
      "고구마",
      "치즈케이크",
      "이달의맛",
      "2021년",
      "10월"
    ],
    "kcal": 245,
    "imageUrl": "/images/9.png",
    "englishName": "CHEESE & SWEET POTATO",
    "description": "고구마 아이스크림, 크림치즈 아이스크림에 고소한 고구마와 고구마 치크케이크가 쏘옥!",
    "components": [
      "크림치즈",
      "고구마"
    ],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "245",
      "당류(g)": "21",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "84",
      "알레르기 성분": "우유, 대두, 밀, 계란"
    }
  },
  {
    "id": 10,
    "name": "(Lessly Edition) 아몬드 봉봉",
    "tags": [
      "아몬드",
      "초코",
      "저당"
    ],
    "kcal": 162,
    "imageUrl": "/images/10.png",
    "englishName": "(Lessly Edition) Almond Bonbon",
    "description": "맛은 그대로! 당류 & 칼로리는 더 가볍게~ 자사 기존 제품 대비 당류 30%, 칼로리 48% 낮아진 아몬드 봉봉",
    "components": [
      "바닐라",
      "밀크 초콜릿 시럽",
      "초코 아몬드"
    ],
    "nutrition": {
      "1회 제공량(g)": "115 g",
      "열량(kcal)": "162",
      "당류(g)": "18",
      "단백질(g)": "5",
      "포화지방(g)": "2.1",
      "나트륨(mg)": "80",
      "알레르기 성분": "우유, 대두"
    }
  },
  {
    "id": 11,
    "name": "(Lessly Edition) 엄마는 외계인",
    "tags": [
      "초코볼",
      "저당"
    ],
    "kcal": 156,
    "imageUrl": "/images/11.png",
    "englishName": "(Lessly Edition) Puss In Boots",
    "description": "맛은 그대로! 당류 & 칼로리는 더 가볍게~ 자사 기존 제품 대비 당류 39%, 칼로리 47% 낮아진 엄마는 외계인",
    "components": [
      "밀크초콜릿",
      "화이트 무스",
      "다크 초콜릿",
      "초콜릿 칩",
      "초코 프레첼"
    ],
    "nutrition": {
      "1회 제공량(g)": "115 g",
      "열량(kcal)": "156",
      "당류(g)": "14",
      "단백질(g)": "5",
      "포화지방(g)": "3.8",
      "나트륨(mg)": "57",
      "알레르기 성분": "우유, 밀, 대두"
    }
  },
  {
    "id": 12,
    "name": "아몬드 봉봉",
    "tags": [
      "초콜릿",
      "아몬드",
      "바닐라"
    ],
    "kcal": 312,
    "imageUrl": "/images/12.png",
    "englishName": "Almond Bon Bon",
    "description": "입안 가득 즐거운 초콜릿, 아몬드로 더욱 달콤하게!",
    "components": [
      "바닐라",
      "밀크 초콜릿 시럽",
      "초코 아몬드"
    ],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "312",
      "당류(g)": "26",
      "단백질(g)": "5",
      "포화지방(g)": "8",
      "나트륨(mg)": "94",
      "알레르기 성분": "우유, 대두"
    }
  },
  {
    "id": 13,
    "name": "엄마는 외계인",
    "tags": [
      "밀크초코",
      "다크초코",
      "초코볼"
    ],
    "kcal": 296,
    "imageUrl": "/images/13.png",
    "englishName": "Puss In Boots",
    "description": "밀크 초콜릿, 다크 초콜릿, 화이트 무스 세 가지 아이스크림에 달콤 바삭한 초코볼이 더해진 아이스크림",
    "components": [
      "밀크초콜릿",
      "화이트 무스",
      "다크 초콜릿",
      "초콜릿 칩",
      "초코 프레첼"
    ],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "296",
      "당류(g)": "23",
      "단백질(g)": "5",
      "포화지방(g)": "11",
      "나트륨(mg)": "114",
      "알레르기 성분": "우유, 대두, 밀"
    }
  },
  {
    "id": 14,
    "name": "사랑에 빠진 딸기",
    "tags": [
      "딸기",
      "치즈케이크",
      "초코칩"
    ],
    "kcal": 292,
    "imageUrl": "/images/14.png",
    "englishName": "Love Struck Strawberry",
    "description": "딸기와 초콜릿이 치즈케이크에 반해버린 사랑의 맛",
    "components": [
      "치즈딸기",
      "크래클 퍼지",
      "치즈케이크 큐브",
      "딸기 과육"
    ],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "292",
      "당류(g)": "26",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "103",
      "알레르기 성분": "우유, 계란, 대두, 땅콩, 밀"
    }
  },
  {
    "id": 15,
    "name": "윈터 민트 초콜릿 칩",
    "tags": [
      "민트",
      "초코칩",
      "시원함"
    ],
    "kcal": 288,
    "imageUrl": "/images/15.png",
    "englishName": "Winter Mint Chocolate Chip",
    "description": "상쾌한 민트 초콜릿 칩 아이스크림에 팝핑캔디가 쏙쏙!",
    "components": [
      "민트",
      "초콜릿 칩",
      "팝핑 캔디"
    ],
    "nutrition": {
      "1회 제공량(g)": "115 g",
      "열량(kcal)": "288",
      "당류(g)": "26",
      "단백질(g)": "4",
      "포화지방(g)": "10",
      "나트륨(mg)": "67",
      "알레르기 성분": "우유, 대두"
    }
  },
  {
    "id": 16,
    "name": "숭아야, 그릭다...",
    "tags": [
      "복숭아",
      "그릭요거트",
      "이달의맛",
      "2024년",
      "10월"
    ],
    "kcal": 198,
    "imageUrl": "/images/16.png",
    "englishName": "DEAR DONUT PEACH & GREEK YOGURT",
    "description": "한 입 먹는 순간 그리워질 달콤한 납작복숭아와 부드러운 그릭요거트, 바삭한 그래놀라의 조화!",
    "components": [
      "그릭 요거트",
      "납작 복숭아",
      "복숭아 과육",
      "그래놀라"
    ],
    "nutrition": {
      "1회 제공량(g)": "115 g",
      "열량(kcal)": "198",
      "당류(g)": "28",
      "단백질(g)": "4",
      "포화지방(g)": "4.1",
      "나트륨(mg)": "57",
      "알레르기 성분": "복숭아, 우유, 대두"
    }
  },
  {
    "id": 17,
    "name": "너 T(tea)야??",
    "tags": [
      "얼그레이",
      "카카오"
    ],
    "kcal": 259,
    "imageUrl": "/images/17.png",
    "englishName": "EARL GREY & CHOCOLATE ICE CREAM",
    "description": "향긋한 얼그레이와 달콤한 초콜릿이 만난, F까지 반하게 할 T(Tea,차) 아이스크림!",
    "components": [
      "초콜릿",
      "얼그레이"
    ],
    "nutrition": {
      "1회 제공량(g)": "115 g",
      "열량(kcal)": "259",
      "당류(g)": "30",
      "단백질(g)": "5",
      "포화지방(g)": "7",
      "나트륨(mg)": "70",
      "알레르기 성분": "우유, 대두"
    }
  },
  {
    "id": 18,
    "name": "수박 Hero",
    "tags": [
      "수박",
      "샤베트"
    ],
    "kcal": 165,
    "imageUrl": "/images/18.png",
    "englishName": "Watermelon Hero",
    "description": "수박 소르베와 밀크소다 샤베트, 파인애플 다이스의 영웅적 만남!",
    "components": [
      "파인애플",
      "수박"
    ],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "165",
      "당류(g)": "28",
      "단백질(g)": "0",
      "포화지방(g)": "0",
      "나트륨(mg)": "17",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 19,
    "name": "소금 우유 아이스크림",
    "tags": [
      "솔티",
      "우유맛"
    ],
    "kcal": 222,
    "imageUrl": "/images/19.png",
    "englishName": "Salted Milk Ice Cream",
    "description": "부드러운 우유 맛 아이스크림 속에 깊은 단 맛을 끌어내는 소금 아이스크림",
    "components": [
      "소금우유"
    ],
    "nutrition": {
      "1회 제공량(g)": "115 g",
      "열량(kcal)": "222",
      "당류(g)": "22",
      "단백질(g)": "5",
      "포화지방(g)": "7",
      "나트륨(mg)": "266",
      "알레르기 성분": "우유, 대두"
    }
  },
  {
    "id": 20,
    "name": "애플 민트",
    "tags": [
      "사과",
      "민트",
      "샤베트"
    ],
    "kcal": 187,
    "imageUrl": "/images/20.png",
    "englishName": "APPLE MINT",
    "description": "상큼한 사과와 시원한 민트향이 기분까지 상쾌하게",
    "components": [
      "민트"
    ],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "187",
      "당류(g)": "22",
      "단백질(g)": "6",
      "포화지방(g)": "3.1",
      "나트륨(mg)": "29",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 21,
    "name": "아빠는 딸바봉",
    "tags": [
      "딸기",
      "바나나",
      "프레첼볼",
      "이달의맛",
      "2019년",
      "10월"
    ],
    "kcal": 308,
    "imageUrl": "/images/21.png",
    "englishName": "Papa & Daughter Ice Cream",
    "description": "두가지 딸기 아이스크림과 바닐라향 아이스크림에 봉봉 프레첼이 쏘옥~!",
    "components": [
      "딸기",
      "바닐라",
      "딸기 크런치볼"
    ],
    "nutrition": {
      "1회 제공량(g)": "115 g",
      "열량(kcal)": "308",
      "당류(g)": "26",
      "단백질(g)": "4",
      "포화지방(g)": "14",
      "나트륨(mg)": "84",
      "알레르기 성분": "우유, 대두, 밀"
    }
  },
  {
    "id": 22,
    "name": "민트 초콜릿 칩",
    "tags": [
      "민트",
      "초코칩"
    ],
    "kcal": 259,
    "imageUrl": "/images/22.png",
    "englishName": "Mint Chocolate Chip",
    "description": "쿨한 당신의 선택! 상쾌한 민트향에 초코칩까지!",
    "components": [
      "민트",
      "초콜릿 칩"
    ],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "259",
      "당류(g)": "23",
      "단백질(g)": "4",
      "포화지방(g)": "9",
      "나트륨(mg)": "81",
      "알레르기 성분": "우유, 대두"
    }
  },
  {
    "id": 23,
    "name": "뉴욕 치즈케이크",
    "tags": [
      "치즈케이크",
      "그레이엄크래커"
    ],
    "kcal": 275,
    "imageUrl": "/images/23.png",
    "englishName": "New York CheeseCake",
    "description": "부드럽게 즐기는 뉴욕식 정통 치즈케이크 아이스크림",
    "components": [
      "치즈",
      "그라함 크래커"
    ],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "275",
      "당류(g)": "21",
      "단백질(g)": "4",
      "포화지방(g)": "10",
      "나트륨(mg)": "105",
      "알레르기 성분": "우유, 대두, 밀"
    }
  },
  {
    "id": 24,
    "name": "레인보우 샤베트",
    "tags": [
      "파인애플",
      "오렌지",
      "라즈베리"
    ],
    "kcal": 163,
    "imageUrl": "/images/24.png",
    "englishName": "Rainbow Sherbet",
    "description": "상큼한 파인애플, 오렌지, 라즈베리가 만드는 일곱빛깔 무지개",
    "components": [
      "오렌지",
      "파인애플",
      "라즈베리"
    ],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "163",
      "당류(g)": "25",
      "단백질(g)": "1",
      "포화지방(g)": "1.2",
      "나트륨(mg)": "15",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 25,
    "name": "체리쥬빌레",
    "tags": [
      "체리",
      "과육"
    ],
    "kcal": 239,
    "imageUrl": "/images/25.png",
    "englishName": "Cherries Jubilee",
    "description": "체리과육이 탱글탱글 씹히는 체리 아이스크림",
    "components": [
      "체리",
      "체리 과육"
    ],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "239",
      "당류(g)": "28",
      "단백질(g)": "3",
      "포화지방(g)": "7",
      "나트륨(mg)": "48",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 26,
    "name": "슈팅스타",
    "tags": [
      "톡톡캔디",
      "체리",
      "블루베리"
    ],
    "kcal": 260,
    "imageUrl": "/images/26.png",
    "englishName": "Shooting Star",
    "description": "블루베리 & 바닐라향에 입안에서 톡톡 터지는 캔디와 신나는 축제",
    "components": [
      "블루베리",
      "바닐라",
      "체리 시럽",
      "블루 팝핑캔디"
    ],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "260",
      "당류(g)": "27",
      "단백질(g)": "3",
      "포화지방(g)": "7",
      "나트륨(mg)": "65",
      "알레르기 성분": "우유, 대두, 밀"
    }
  },
  {
    "id": 27,
    "name": "오레오 쿠키 앤 크림",
    "tags": [
      "오레오",
      "바닐라"
    ],
    "kcal": 254,
    "imageUrl": "/images/27.png",
    "englishName": "Oreo Cookie´s n Cream",
    "description": "부드러운 바닐라향 아이스크림에, 달콤하고 진한 오레오 쿠키가 듬뿍!",
    "components": [
      "바닐라",
      "오레오"
    ],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "254",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "92",
      "알레르기 성분": "우유, 대두, 밀"
    }
  },
  {
    "id": 28,
    "name": "베리베리 스트로베리",
    "tags": [
      "딸기",
      "과육"
    ],
    "kcal": 228,
    "imageUrl": "/images/28.png",
    "englishName": "Very Berry Strawberry",
    "description": "새콤상큼 딸기 과육이 듬뿍!",
    "components": [
      "딸기",
      "딸기 과육"
    ],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "228",
      "당류(g)": "24",
      "단백질(g)": "3",
      "포화지방(g)": "7",
      "나트륨(mg)": "69",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 29,
    "name": "31요거트",
    "tags": [
      "상큼",
      "유산균"
    ],
    "kcal": 198,
    "imageUrl": "/images/29.png",
    "englishName": "31 Yogurt",
    "description": "유산균이 들어있는 오리지널 요거트 아이스크림",
    "components": [
      "요거트"
    ],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "198",
      "당류(g)": "26",
      "단백질(g)": "5",
      "포화지방(g)": "4",
      "나트륨(mg)": "67",
      "알레르기 성분": "우유, 대두"
    }
  },
  {
    "id": 30,
    "name": "바람과 함께 사라지다",
    "tags": [
      "블루베리",
      "딸기",
      "치즈케이크"
    ],
    "kcal": 269,
    "imageUrl": "/images/30.png",
    "englishName": "Twinberry CheeseCake",
    "description": "블루베리와 딸기로 상큼함을 더한 치즈케이크 한 조각",
    "components": [
      "치즈",
      "블루베리 시럽",
      "딸기 시럽",
      "치즈케이크 큐브"
    ],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "269",
      "당류(g)": "25",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "95",
      "알레르기 성분": "우유, 대두, 밀, 계란"
    }
  },
  {
    "id": 31,
    "name": "이상한 나라의 솜사탕",
    "tags": [
      "솜사탕",
      "달콤",
      "2012년",
      "4월",
      "2016년",
      "5월"
    ],
    "kcal": 287,
    "imageUrl": "/images/31.png",
    "englishName": "Cotton Candy Wonderland",
    "description": "부드럽고 달콤한 솜사탕과 함께 떠나는 이상한 나라로의 여행",
    "components": [
      "옐로우 솜사탕",
      "핑크 솜사탕",
      "블루 솜사탕",
      "옐로우 크런치",
      "핑크 크런치"
    ],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "287",
      "당류(g)": "31",
      "단백질(g)": "5",
      "포화지방(g)": "10",
      "나트륨(mg)": "109",
      "알레르기 성분": "우유, 대두"
    }
  },
  {
    "id": 32,
    "name": "피스타치오 아몬드",
    "tags": [
      "피스타치오",
      "아몬드"
    ],
    "kcal": 302,
    "imageUrl": "/images/32.png",
    "englishName": "Pistachio Almond",
    "description": "피스타치오와 아몬드가 만나 고소함이 두 배!",
    "components": [
      "피스타치오",
      "아몬드"
    ],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "302",
      "당류(g)": "27",
      "단백질(g)": "7",
      "포화지방(g)": "8",
      "나트륨(mg)": "72",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 33,
    "name": "초콜릿 무스",
    "tags": [
      "진한초코",
      "초코칩"
    ],
    "kcal": 318,
    "imageUrl": "/images/33.png",
    "englishName": "Chocolate Mousse",
    "description": "초콜릿 칩이 들어있는 진한 초콜릿 아이스크림",
    "components": [
      "초콜릿 무스"
    ],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "318",
      "당류(g)": "27",
      "단백질(g)": "5",
      "포화지방(g)": "12",
      "나트륨(mg)": "96",
      "알레르기 성분": "우유, 대두"
    }
  },
  {
    "id": 34,
    "name": "그린티",
    "tags": [
      "녹차",
      "쌉싸름"
    ],
    "kcal": 245,
    "imageUrl": "/images/34.png",
    "englishName": "Green Tea",
    "description": "엄선된 녹차를 사용한 싱그러운 그린티 아이스크림",
    "components": [
      "그린티"
    ],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "245",
      "당류(g)": "20",
      "단백질(g)": "5",
      "포화지방(g)": "8",
      "나트륨(mg)": "73",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 35,
    "name": "자모카 아몬드 훠지",
    "tags": [
      "커피",
      "아몬드",
      "초콜릿리본"
    ],
    "kcal": 273,
    "imageUrl": "/images/35.png",
    "englishName": "Jamoca\nAlmond Fudge",
    "description": "깊고 풍부한 자모카 아이스크림에 고소한 아몬드와 초콜릿 훠지 시럽이 들어있는 제품",
    "components": [
      "커피",
      "초콜릿 시럽",
      "아몬드"
    ],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "273",
      "당류(g)": "25",
      "단백질(g)": "5",
      "포화지방(g)": "7",
      "나트륨(mg)": "82",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 36,
    "name": "초콜릿",
    "tags": [
      "클래식",
      "초코"
    ],
    "kcal": 274,
    "imageUrl": "/images/36.png",
    "englishName": "Chocolate",
    "description": "진하고 부드러운 정통 초콜릿 아이스크림",
    "components": [
      "초콜릿"
    ],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "274",
      "당류(g)": "24",
      "단백질(g)": "5",
      "포화지방(g)": "8",
      "나트륨(mg)": "85",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 37,
    "name": "바닐라",
    "tags": [
      "바닐라빈",
      "깔끔함"
    ],
    "kcal": 246,
    "imageUrl": "/images/37.png",
    "englishName": "Vanilla",
    "description": "부드럽고 깔끔한 바닐라 아이스크림",
    "components": [
      "바닐라"
    ],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "246",
      "당류(g)": "21",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "74",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 191,
    "name": "베리 굿",
    "tags": [
      "이달의맛",
      "2026년",
      "1월"
    ],
    "imageUrl": "/images/191.png"
  },
  {
    "id": 173,
    "name": "초콜릿 쿠키 스모어",
    "tags": [
      "이달의맛",
      "2025년",
      "12월"
    ],
    "imageUrl": "/images/173.png"
  },
  {
    "id": 197,
    "name": "골든 프랄린 버터",
    "tags": [
      "이달의맛",
      "2025년",
      "12월"
    ],
    "imageUrl": "/images/197.png"
  },
  {
    "id": 171,
    "name": "치즈가 브라우니?",
    "tags": [
      "이달의맛",
      "2025년",
      "11월"
    ],
    "imageUrl": "/images/171.png"
  },
  {
    "id": 500,
    "name": "솔티끼 나 너 초코♥",
    "tags": [
      "이달의맛",
      "2025년",
      "10월"
    ],
    "imageUrl": "/images/500.png"
  },
  {
    "id": 176,
    "name": "위대한 비쵸비",
    "tags": [
      "이달의맛",
      "2025년",
      "9월"
    ],
    "imageUrl": "/images/176.png"
  },
  {
    "id": 288,
    "name": "블루 바나나 브륄레",
    "tags": [
      "이달의맛",
      "2025년",
      "8월"
    ],
    "kcal": 0,
    "imageUrl": "/images/288.png",
    "components": [],
    "nutrition": {}
  },
  {
    "id": 164,
    "name": "애망빙",
    "tags": [
      "이달의맛",
      "2025년",
      "7월"
    ],
    "kcal": 250,
    "imageUrl": "/images/164.png",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 163,
    "name": "카페오레 초코 크런치",
    "tags": [
      "이달의맛",
      "2025년",
      "6월"
    ],
    "kcal": 250,
    "imageUrl": "/images/163.png",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 162,
    "name": "봄날의 곰을 좋아하세요?",
    "tags": [
      "이달의맛",
      "2025년",
      "5월"
    ],
    "kcal": 250,
    "imageUrl": "/images/162.png",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 161,
    "name": "아이스 그린티 킷캣",
    "tags": [
      "이달의맛",
      "2025년",
      "4월"
    ],
    "kcal": 250,
    "imageUrl": "/images/161.png",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 160,
    "name": "말랑 딸기 찹쌀떡",
    "tags": [
      "이달의맛",
      "2025년",
      "3월"
    ],
    "kcal": 250,
    "imageUrl": "/images/160.png",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 159,
    "name": "아이스 초코 도쿄바나나",
    "tags": [
      "이달의맛",
      "2025년",
      "2월"
    ],
    "kcal": 250,
    "imageUrl": "/images/159.png",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 158,
    "name": "춘식이의 고구마얌!",
    "tags": [
      "이달의맛",
      "2025년",
      "1월"
    ],
    "kcal": 250,
    "imageUrl": "/images/158.png",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 157,
    "name": "키세스 브라우니 초콜릿",
    "tags": [
      "이달의맛",
      "2024년",
      "12월"
    ],
    "kcal": 250,
    "imageUrl": "/images/157.png",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 156,
    "name": "치토스 밀크쉐이크 아이스크림",
    "tags": [
      "이달의맛",
      "2024년",
      "11월"
    ],
    "kcal": 250,
    "imageUrl": "/images/156.png",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 155,
    "name": "우석이도 외계인",
    "tags": [
      "이달의맛",
      "2024년",
      "9월"
    ],
    "kcal": 250,
    "imageUrl": "/images/155.png",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 154,
    "name": "피치 Pang 망고 Pang",
    "tags": [
      "이달의맛",
      "2024년",
      "8월"
    ],
    "kcal": 250,
    "imageUrl": "/images/154.png",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 153,
    "name": "블루 서퍼 비치",
    "tags": [
      "이달의맛",
      "2024년",
      "7월"
    ],
    "kcal": 250,
    "imageUrl": "/images/153.png",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 38,
    "name": "우주 라이크 봉봉",
    "tags": [
      "이달의맛",
      "2024년",
      "6월"
    ],
    "imageUrl": "/images/38.png"
  },
  {
    "id": 152,
    "name": "이상한 나라의 슈팅스타",
    "tags": [
      "이달의맛",
      "2024년",
      "5월"
    ],
    "kcal": 250,
    "imageUrl": "/images/152.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 151,
    "name": "아이스 도쿄바나나",
    "tags": [
      "이달의맛",
      "2024년",
      "4월"
    ],
    "kcal": 250,
    "imageUrl": "/images/151.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 150,
    "name": "탕탕! 스트로베리",
    "tags": [
      "이달의맛",
      "2024년",
      "3월"
    ],
    "kcal": 250,
    "imageUrl": "/images/150.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 149,
    "name": "바삭한 쫀꾸렛",
    "tags": [
      "이달의맛",
      "2024년",
      "2월"
    ],
    "kcal": 250,
    "imageUrl": "/images/149.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 39,
    "name": "황치즈 드래곤 볼",
    "tags": [
      "이달의맛",
      "2024년",
      "1월"
    ],
    "imageUrl": "/images/39.webp"
  },
  {
    "id": 148,
    "name": "고디바 다크 크런치",
    "tags": [
      "이달의맛",
      "2023년",
      "12월"
    ],
    "kcal": 250,
    "imageUrl": "/images/148.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 147,
    "name": "도라에몽의 팥붕! 슈붕!",
    "tags": [
      "이달의맛",
      "2023년",
      "11월"
    ],
    "kcal": 250,
    "imageUrl": "/images/147.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 144,
    "name": "초코, 우리 이제 헤이즐넛",
    "tags": [
      "이달의맛",
      "2023년",
      "10월"
    ],
    "kcal": 250,
    "imageUrl": "/images/144.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 146,
    "name": "나는 딸기치오",
    "tags": [
      "이달의맛",
      "2023년",
      "10월"
    ],
    "kcal": 250,
    "imageUrl": "/images/146.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 142,
    "name": "초코 퐁당 쿠키런",
    "tags": [
      "이달의맛",
      "2023년",
      "9월"
    ],
    "kcal": 250,
    "imageUrl": "/images/142.png",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 40,
    "name": "아이스 노티드 우유 생크림",
    "tags": [
      "이달의맛",
      "2023년",
      "8월"
    ],
    "imageUrl": "/images/40.png"
  },
  {
    "id": 141,
    "name": "라이언 망고 마카롱",
    "tags": [
      "이달의맛",
      "2023년",
      "7월"
    ],
    "kcal": 250,
    "imageUrl": "/images/141.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 140,
    "name": "시카고 팝콘",
    "tags": [
      "이달의맛",
      "2023년",
      "6월"
    ],
    "kcal": 250,
    "imageUrl": "/images/140.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 41,
    "name": "구름 속 시나모롤",
    "tags": [
      "이달의맛",
      "2023년",
      "5월"
    ],
    "imageUrl": "/images/41.webp"
  },
  {
    "id": 139,
    "name": "복숭아로 피치 올려",
    "tags": [
      "이달의맛",
      "2023년",
      "4월"
    ],
    "kcal": 250,
    "imageUrl": "/images/139.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 137,
    "name": "러브미",
    "tags": [
      "이달의맛",
      "2023년",
      "3월"
    ],
    "kcal": 250,
    "imageUrl": "/images/137.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 138,
    "name": "딸기 연유 퐁당",
    "tags": [
      "이달의맛",
      "2023년",
      "3월"
    ],
    "kcal": 250,
    "imageUrl": "/images/138.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 136,
    "name": "아이스 기라델리 초콜릿",
    "tags": [
      "이달의맛",
      "2023년",
      "2월"
    ],
    "kcal": 250,
    "imageUrl": "/images/136.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 135,
    "name": "벅스 버니버니 당근당근",
    "tags": [
      "이달의맛",
      "2023년",
      "1월"
    ],
    "kcal": 250,
    "imageUrl": "/images/135.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 133,
    "name": "아이스 허쉬 앤 리세스",
    "tags": [
      "이달의맛",
      "2022년",
      "12월"
    ],
    "kcal": 250,
    "imageUrl": "/images/133.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 132,
    "name": "핑크스푼 비긴즈",
    "tags": [
      "이달의맛",
      "2022년",
      "11월"
    ],
    "kcal": 250,
    "imageUrl": "/images/132.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 131,
    "name": "짱구가 좋아하는 외계인의 바나나킥",
    "tags": [
      "이달의맛",
      "2022년",
      "10월"
    ],
    "kcal": 250,
    "imageUrl": "/images/131.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 130,
    "name": "내가 아인슈페너?!",
    "tags": [
      "이달의맛",
      "2022년",
      "9월"
    ],
    "kcal": 250,
    "imageUrl": "/images/130.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 129,
    "name": "아이스 초당옥수수",
    "tags": [
      "이달의맛",
      "2022년",
      "8월"
    ],
    "kcal": 250,
    "imageUrl": "/images/129.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 128,
    "name": "마우나로아 마카다미아",
    "tags": [
      "이달의맛",
      "2022년",
      "7월"
    ],
    "kcal": 250,
    "imageUrl": "/images/128.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 127,
    "name": "너로 정했다! 이브이",
    "tags": [
      "이달의맛",
      "2022년",
      "6월"
    ],
    "kcal": 250,
    "imageUrl": "/images/127.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 126,
    "name": "피카피카 피카츄",
    "tags": [
      "이달의맛",
      "2022년",
      "5월"
    ],
    "kcal": 250,
    "imageUrl": "/images/126.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 125,
    "name": "사랑에 빠진 외계인",
    "tags": [
      "이달의맛",
      "2022년",
      "4월"
    ],
    "kcal": 250,
    "imageUrl": "/images/125.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 124,
    "name": "오레오 쿠키 앤 스트로베리",
    "tags": [
      "이달의맛",
      "2022년",
      "3월"
    ],
    "kcal": 250,
    "imageUrl": "/images/124.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 123,
    "name": "아이스 로아커",
    "tags": [
      "이달의맛",
      "2022년",
      "2월"
    ],
    "kcal": 250,
    "imageUrl": "/images/123.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 122,
    "name": "기운 센 아이스 콘푸로스트",
    "tags": [
      "이달의맛",
      "2022년",
      "1월"
    ],
    "kcal": 250,
    "imageUrl": "/images/122.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 120,
    "name": "아이스 고디바 초콜릿",
    "tags": [
      "이달의맛",
      "2021년",
      "12월"
    ],
    "kcal": 250,
    "imageUrl": "/images/120.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 119,
    "name": "치즈나무숲",
    "tags": [
      "이달의맛",
      "2021년",
      "11월"
    ],
    "kcal": 250,
    "imageUrl": "/images/119.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 118,
    "name": "찰떡콩떡",
    "tags": [
      "이달의맛",
      "2021년",
      "9월"
    ],
    "kcal": 250,
    "imageUrl": "/images/118.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 117,
    "name": "꿀바망",
    "tags": [
      "이달의맛",
      "2021년",
      "7월"
    ],
    "kcal": 250,
    "imageUrl": "/images/117.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 116,
    "name": "오버더 레인보우 샤베트",
    "tags": [
      "이달의맛",
      "2021년",
      "6월"
    ],
    "kcal": 250,
    "imageUrl": "/images/116.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 115,
    "name": "아이스 홈런볼",
    "tags": [
      "이달의맛",
      "2021년",
      "5월"
    ],
    "kcal": 250,
    "imageUrl": "/images/115.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 114,
    "name": "민트 초코 봉봉",
    "tags": [
      "이달의맛",
      "2021년",
      "4월"
    ],
    "kcal": 250,
    "imageUrl": "/images/114.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 113,
    "name": "아이스 허니버터 아몬드",
    "tags": [
      "이달의맛",
      "2021년",
      "3월"
    ],
    "kcal": 250,
    "imageUrl": "/images/113.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 112,
    "name": "아이스 밀카 초콜릿",
    "tags": [
      "이달의맛",
      "2021년",
      "2월"
    ],
    "kcal": 250,
    "imageUrl": "/images/112.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 111,
    "name": "우유속에 끼인 소보로",
    "tags": [
      "이달의맛",
      "2021년",
      "1월"
    ],
    "kcal": 250,
    "imageUrl": "/images/111.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 110,
    "name": "아이스 촉촉한 초코칩",
    "tags": [
      "이달의맛",
      "2020년",
      "12월"
    ],
    "kcal": 250,
    "imageUrl": "/images/110.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 109,
    "name": "미찐 감자",
    "tags": [
      "이달의맛",
      "2020년",
      "10월"
    ],
    "kcal": 250,
    "imageUrl": "/images/109.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 108,
    "name": "매시업스 시리얼",
    "tags": [
      "이달의맛",
      "2020년",
      "9월"
    ],
    "kcal": 250,
    "imageUrl": "/images/108.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 107,
    "name": "보라보라",
    "tags": [
      "이달의맛",
      "2020년",
      "8월"
    ],
    "kcal": 250,
    "imageUrl": "/images/107.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 106,
    "name": "펭수 아슈크림",
    "tags": [
      "이달의맛",
      "2020년",
      "7월"
    ],
    "kcal": 250,
    "imageUrl": "/images/106.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 105,
    "name": "아몬드 봉봉봉",
    "tags": [
      "이달의맛",
      "2020년",
      "6월"
    ],
    "kcal": 250,
    "imageUrl": "/images/105.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 104,
    "name": "판타스틱 트롤",
    "tags": [
      "이달의맛",
      "2020년",
      "5월"
    ],
    "kcal": 250,
    "imageUrl": "/images/104.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 103,
    "name": "아이스 바나나킥",
    "tags": [
      "이달의맛",
      "2020년",
      "4월"
    ],
    "kcal": 250,
    "imageUrl": "/images/103.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 102,
    "name": "로투스 비스코프",
    "tags": [
      "이달의맛",
      "2020년",
      "3월"
    ],
    "kcal": 250,
    "imageUrl": "/images/102.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 101,
    "name": "아이스 킷캣",
    "tags": [
      "이달의맛",
      "2020년",
      "2월"
    ],
    "kcal": 250,
    "imageUrl": "/images/101.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 177,
    "name": "우리끼리",
    "tags": [
      "이달의맛",
      "2020년",
      "1월"
    ],
    "imageUrl": "/images/177.webp"
  },
  {
    "id": 181,
    "name": "아이스 초코파이 정",
    "tags": [
      "이달의맛",
      "2019년",
      "12월"
    ],
    "imageUrl": "/images/181.webp"
  },
  {
    "id": 178,
    "name": "오레오 쿠키 앤 크림치즈",
    "tags": [
      "이달의맛",
      "2019년",
      "11월"
    ],
    "imageUrl": "/images/178.webp"
  },
  {
    "id": 183,
    "name": "쌀떡궁합",
    "tags": [
      "이달의맛",
      "2019년",
      "9월"
    ],
    "imageUrl": "/images/183.webp"
  },
  {
    "id": 184,
    "name": "심슨에 반하나",
    "tags": [
      "이달의맛",
      "2019년",
      "8월"
    ],
    "imageUrl": "/images/184.webp"
  },
  {
    "id": 169,
    "name": "핑크 스타",
    "tags": [
      "이달의맛",
      "2019년",
      "7월"
    ],
    "imageUrl": "/images/169.webp"
  },
  {
    "id": 287,
    "name": "블랙 소르베",
    "englishName": "Black Sorbet",
    "kcal": 140,
    "tags": [
      "이달의맛",
      "2019년",
      "6월"
    ],
    "imageUrl": "/images/287.webp"
  },
  {
    "id": 182,
    "name": "아이스 죠리퐁",
    "tags": [
      "이달의맛",
      "2019년",
      "5월"
    ],
    "imageUrl": "/images/182.webp"
  },
  {
    "id": 286,
    "name": "스트로베리 아보카도",
    "englishName": "Strawberry Avocado",
    "kcal": 240,
    "tags": [
      "이달의맛",
      "2019년",
      "4월"
    ],
    "imageUrl": "/images/286.webp"
  },
  {
    "id": 285,
    "name": "베리 그래놀라",
    "englishName": "Berry Granola",
    "kcal": 250,
    "tags": [
      "이달의맛",
      "2019년",
      "3월"
    ],
    "imageUrl": "/images/285.webp"
  },
  {
    "id": 167,
    "name": "허쉬 마카다미아 넛",
    "tags": [
      "이달의맛",
      "2019년",
      "2월"
    ],
    "imageUrl": "/images/167.webp"
  },
  {
    "id": 196,
    "name": "꿀꿀허니",
    "tags": [
      "이달의맛",
      "2019년",
      "1월"
    ],
    "imageUrl": "/images/196.webp"
  },
  {
    "id": 195,
    "name": "누가 크런치",
    "tags": [
      "이달의맛",
      "2018년",
      "12월"
    ],
    "imageUrl": "/images/195.webp"
  },
  {
    "id": 179,
    "name": "오레오 쿠키 앤 카라멜",
    "tags": [
      "이달의맛",
      "2018년",
      "11월"
    ],
    "imageUrl": "/images/179.webp"
  },
  {
    "id": 193,
    "name": "몬스터 마시멜로",
    "tags": [
      "이달의맛",
      "2018년",
      "10월"
    ],
    "imageUrl": "/images/193.webp"
  },
  {
    "id": 175,
    "name": "쫀떡궁합",
    "tags": [
      "이달의맛",
      "2018년",
      "9월"
    ],
    "imageUrl": "/images/175.webp"
  },
  {
    "id": 284,
    "name": "베리 스윗 바이올렛",
    "tags": [
      "이달의맛",
      "2018년",
      "8월"
    ],
    "imageUrl": "/images/284.webp"
  },
  {
    "id": 168,
    "name": "핑크퐁 상어가족",
    "tags": [
      "이달의맛",
      "2018년",
      "7월"
    ],
    "imageUrl": "/images/168.webp"
  },
  {
    "id": 174,
    "name": "체리쥬빌레31",
    "tags": [
      "이달의맛",
      "2018년",
      "6월"
    ],
    "imageUrl": "/images/174.webp"
  },
  {
    "id": 192,
    "name": "미니미니 미니언즈",
    "tags": [
      "이달의맛",
      "2018년",
      "5월"
    ],
    "imageUrl": "/images/192.webp"
  },
  {
    "id": 180,
    "name": "야쿠르트 샤베트",
    "tags": [
      "이달의맛",
      "2018년",
      "4월"
    ],
    "imageUrl": "/images/180.webp"
  },
  {
    "id": 172,
    "name": "츄파춥스 스트로베리 앤 크림",
    "tags": [
      "이달의맛",
      "2018년",
      "3월"
    ],
    "imageUrl": "/images/172.webp"
  },
  {
    "id": 170,
    "name": "트리플 치즈 러브",
    "tags": [
      "이달의맛",
      "2018년",
      "2월"
    ],
    "imageUrl": "/images/170.webp"
  },
  {
    "id": 100,
    "name": "더블 바닐라 초콜릿",
    "tags": [
      "이달의맛",
      "2018년",
      "1월"
    ],
    "kcal": 250,
    "imageUrl": "/images/100.webp",
    "components": [],
    "nutrition": {
      "1회 제공량(g)": "115",
      "열량(kcal)": "250",
      "당류(g)": "20",
      "단백질(g)": "4",
      "포화지방(g)": "8",
      "나트륨(mg)": "100",
      "알레르기 성분": "우유"
    }
  },
  {
    "id": 283,
    "name": "보스톤 크림 파이",
    "tags": [
      "이달의맛",
      "2017년",
      "12월"
    ],
    "imageUrl": "/images/283.webp"
  },
  {
    "id": 282,
    "name": "밤이 옥수로 맛있구마",
    "tags": [
      "이달의맛",
      "2017년",
      "11월"
    ],
    "imageUrl": "/images/282.webp"
  },
  {
    "id": 281,
    "name": "너는 참 달고나",
    "tags": [
      "이달의맛",
      "2017년",
      "10월"
    ],
    "imageUrl": "/images/281.webp"
  },
  {
    "id": 280,
    "name": "허니 치즈트랩",
    "tags": [
      "이달의맛",
      "2017년",
      "9월"
    ],
    "imageUrl": "/images/280.webp"
  },
  {
    "id": 279,
    "name": "트로피칼 아일랜드",
    "tags": [
      "이달의맛",
      "2017년",
      "8월"
    ],
    "imageUrl": "/images/279.webp"
  },
  {
    "id": 278,
    "name": "스파이더맨 홈 커밍",
    "tags": [
      "이달의맛",
      "2017년",
      "7월"
    ],
    "imageUrl": "/images/278.webp"
  },
  {
    "id": 277,
    "name": "수퍼 펭귄 시리얼",
    "tags": [
      "이달의맛",
      "2017년",
      "6월"
    ],
    "imageUrl": "/images/277.webp"
  },
  {
    "id": 276,
    "name": "팝핑 슈렉",
    "tags": [
      "이달의맛",
      "2017년",
      "5월"
    ],
    "imageUrl": "/images/276.webp"
  },
  {
    "id": 275,
    "name": "스트라이크 캐슈넛",
    "tags": [
      "이달의맛",
      "2017년",
      "4월"
    ],
    "imageUrl": "/images/275.webp"
  },
  {
    "id": 274,
    "name": "봉쥬르 마카롱",
    "tags": [
      "이달의맛",
      "2017년",
      "3월"
    ],
    "imageUrl": "/images/274.webp"
  },
  {
    "id": 273,
    "name": "키스미 키세스",
    "tags": [
      "이달의맛",
      "2017년",
      "2월"
    ],
    "imageUrl": "/images/273.webp"
  },
  {
    "id": 272,
    "name": "초코초코 피스타치오",
    "tags": [
      "이달의맛",
      "2017년",
      "1월"
    ],
    "imageUrl": "/images/272.webp"
  },
  {
    "id": 271,
    "name": "민트 초코 홀릭",
    "tags": [
      "이달의맛",
      "2016년",
      "12월"
    ],
    "imageUrl": "/images/271.webp"
  },
  {
    "id": 270,
    "name": "호두밭의 파수꾼",
    "tags": [
      "이달의맛",
      "2016년",
      "11월"
    ],
    "imageUrl": "/images/270.webp"
  },
  {
    "id": 269,
    "name": "핑크 팬더",
    "tags": [
      "이달의맛",
      "2016년",
      "10월"
    ],
    "imageUrl": "/images/269.webp"
  },
  {
    "id": 268,
    "name": "콜드브루 카페브리즈",
    "tags": [
      "이달의맛",
      "2016년",
      "9월"
    ],
    "imageUrl": "/images/268.webp"
  },
  {
    "id": 267,
    "name": "골든 애플 요거트",
    "tags": [
      "이달의맛",
      "2016년",
      "8월"
    ],
    "imageUrl": "/images/267.webp"
  },
  {
    "id": 266,
    "name": "웰컴 투 더 정글",
    "tags": [
      "이달의맛",
      "2016년",
      "7월"
    ],
    "imageUrl": "/images/266.webp"
  },
  {
    "id": 265,
    "name": "다시 돌아온 아이엠 샘",
    "tags": [
      "이달의맛",
      "2016년",
      "6월"
    ],
    "imageUrl": "/images/265.webp"
  },
  {
    "id": 263,
    "name": "캡틴 아메리카",
    "tags": [
      "이달의맛",
      "2016년",
      "4월"
    ],
    "imageUrl": "/images/263.webp"
  },
  {
    "id": 262,
    "name": "러브 트레져 초코미키",
    "tags": [
      "이달의맛",
      "2016년",
      "3월"
    ],
    "imageUrl": "/images/262.webp"
  },
  {
    "id": 261,
    "name": "스위스 미스 코코아",
    "tags": [
      "이달의맛",
      "2016년",
      "2월"
    ],
    "imageUrl": "/images/261.webp"
  },
  {
    "id": 260,
    "name": "써리 원숭이",
    "tags": [
      "이달의맛",
      "2016년",
      "1월"
    ],
    "imageUrl": "/images/260.webp"
  },
  {
    "id": 259,
    "name": "스낵네이도",
    "tags": [
      "이달의맛",
      "2015년",
      "12월"
    ],
    "imageUrl": "/images/259.webp"
  },
  {
    "id": 258,
    "name": "아포가토",
    "tags": [
      "이달의맛",
      "2015년",
      "11월"
    ],
    "imageUrl": "/images/258.webp"
  },
  {
    "id": 257,
    "name": "우유 초코볼",
    "tags": [
      "이달의맛",
      "2015년",
      "10월"
    ],
    "imageUrl": "/images/257.webp"
  },
  {
    "id": 256,
    "name": "바나나 스플릿",
    "tags": [
      "이달의맛",
      "2015년",
      "9월"
    ],
    "imageUrl": "/images/256.webp"
  },
  {
    "id": 255,
    "name": "스윗 드롭 치즈케이크",
    "tags": [
      "이달의맛",
      "2015년",
      "8월"
    ],
    "imageUrl": "/images/255.webp"
  },
  {
    "id": 254,
    "name": "너티네이도",
    "tags": [
      "이달의맛",
      "2015년",
      "7월"
    ],
    "imageUrl": "/images/254.webp"
  },
  {
    "id": 253,
    "name": "알폰소 망고",
    "tags": [
      "이달의맛",
      "2015년",
      "6월"
    ],
    "imageUrl": "/images/253.webp"
  },
  {
    "id": 252,
    "name": "무비씨어터 팝콘",
    "tags": [
      "이달의맛",
      "2015년",
      "5월"
    ],
    "imageUrl": "/images/252.webp"
  },
  {
    "id": 251,
    "name": "어벤져스",
    "tags": [
      "이달의맛",
      "2015년",
      "4월"
    ],
    "imageUrl": "/images/251.webp"
  },
  {
    "id": 250,
    "name": "우유에 빠진 딸기",
    "tags": [
      "이달의맛",
      "2015년",
      "3월"
    ],
    "imageUrl": "/images/250.webp"
  },
  {
    "id": 249,
    "name": "핑크 미니",
    "tags": [
      "이달의맛",
      "2015년",
      "2월"
    ],
    "imageUrl": "/images/249.webp"
  },
  {
    "id": 248,
    "name": "순수(秀) 우유",
    "tags": [
      "이달의맛",
      "2015년",
      "1월"
    ],
    "imageUrl": "/images/248.webp"
  },
  {
    "id": 247,
    "name": "윈터베리 칩",
    "tags": [
      "이달의맛",
      "2014년",
      "12월"
    ],
    "imageUrl": "/images/247.webp"
  },
  {
    "id": 246,
    "name": "오페라의 유령",
    "tags": [
      "이달의맛",
      "2014년",
      "11월"
    ],
    "imageUrl": "/images/246.webp"
  },
  {
    "id": 245,
    "name": "초코나무 숲",
    "tags": [
      "이달의맛",
      "2014년",
      "10월"
    ],
    "imageUrl": "/images/245.webp"
  },
  {
    "id": 244,
    "name": "엄마는 외계인 10주년",
    "tags": [
      "이달의맛",
      "2014년",
      "9월"
    ],
    "imageUrl": "/images/244.webp"
  },
  {
    "id": 243,
    "name": "요고요고 석류",
    "tags": [
      "이달의맛",
      "2014년",
      "8월"
    ],
    "imageUrl": "/images/243.webp"
  },
  {
    "id": 242,
    "name": "31일간의 세계여행",
    "tags": [
      "이달의맛",
      "2014년",
      "7월"
    ],
    "imageUrl": "/images/242.webp"
  },
  {
    "id": 241,
    "name": "아빠의 싱싱농장",
    "tags": [
      "이달의맛",
      "2014년",
      "6월"
    ],
    "imageUrl": "/images/241.webp"
  },
  {
    "id": 240,
    "name": "우유나라 쿠키볼",
    "tags": [
      "이달의맛",
      "2014년",
      "5월"
    ],
    "imageUrl": "/images/240.webp"
  },
  {
    "id": 239,
    "name": "어메이징 스파이더맨 2",
    "tags": [
      "이달의맛",
      "2014년",
      "4월"
    ],
    "imageUrl": "/images/239.webp"
  },
  {
    "id": 238,
    "name": "미스 체리치즈",
    "tags": [
      "이달의맛",
      "2014년",
      "3월"
    ],
    "imageUrl": "/images/238.webp"
  },
  {
    "id": 237,
    "name": "미스터 체리초코",
    "tags": [
      "이달의맛",
      "2014년",
      "2월"
    ],
    "imageUrl": "/images/237.webp"
  },
  {
    "id": 236,
    "name": "화이트베리 유니콘",
    "tags": [
      "이달의맛",
      "2014년",
      "1월"
    ],
    "imageUrl": "/images/236.webp"
  },
  {
    "id": 235,
    "name": "샘의 초콜릿파이",
    "tags": [
      "이달의맛",
      "2013년",
      "12월"
    ],
    "imageUrl": "/images/235.webp"
  },
  {
    "id": 234,
    "name": "별빛 카페",
    "tags": [
      "이달의맛",
      "2013년",
      "11월"
    ],
    "imageUrl": "/images/234.webp"
  },
  {
    "id": 233,
    "name": "몬스터 쿠키",
    "tags": [
      "이달의맛",
      "2013년",
      "10월"
    ],
    "imageUrl": "/images/233.webp"
  },
  {
    "id": 232,
    "name": "나의 그리스식 요거트",
    "tags": [
      "이달의맛",
      "2013년",
      "9월"
    ],
    "imageUrl": "/images/232.webp"
  },
  {
    "id": 231,
    "name": "알래스카 모카",
    "tags": [
      "이달의맛",
      "2013년",
      "8월"
    ],
    "imageUrl": "/images/231.webp"
  },
  {
    "id": 230,
    "name": "쿨링쿨링 오션패밀리",
    "tags": [
      "이달의맛",
      "2013년",
      "7월"
    ],
    "imageUrl": "/images/230.webp"
  },
  {
    "id": 229,
    "name": "아빠와 팥빙수",
    "tags": [
      "이달의맛",
      "2013년",
      "6월"
    ],
    "imageUrl": "/images/229.webp"
  },
  {
    "id": 300,
    "name": "라빈스 선장의 보물상자",
    "tags": [
      "이달의맛",
      "2013년",
      "5월"
    ],
    "imageUrl": "/images/228.webp"
  },
  {
    "id": 299,
    "name": "그린티 티라미수",
    "tags": [
      "이달의맛",
      "2013년",
      "4월"
    ],
    "imageUrl": "/images/227.webp"
  },
  {
    "id": 298,
    "name": "천사의 밀푀유",
    "tags": [
      "이달의맛",
      "2013년",
      "3월"
    ],
    "imageUrl": "/images/226.webp"
  },
  {
    "id": 297,
    "name": "악마의 쇼콜라",
    "tags": [
      "이달의맛",
      "2013년",
      "2월"
    ],
    "imageUrl": "/images/225.webp"
  },
  {
    "id": 296,
    "name": "카라멜 커피 쿠키",
    "tags": [
      "이달의맛",
      "2013년",
      "1월"
    ],
    "imageUrl": "/images/224.webp"
  },
  {
    "id": 295,
    "name": "호두까기 인형",
    "tags": [
      "이달의맛",
      "2012년",
      "12월"
    ],
    "imageUrl": "/images/223.webp"
  },
  {
    "id": 294,
    "name": "다크 초코 나이트",
    "tags": [
      "이달의맛",
      "2012년",
      "11월"
    ],
    "imageUrl": "/images/222.webp"
  },
  {
    "id": 293,
    "name": "쿠키 부키",
    "tags": [
      "이달의맛",
      "2012년",
      "10월"
    ],
    "imageUrl": "/images/221.webp"
  },
  {
    "id": 292,
    "name": "아이스 카라멜 마끼아또",
    "tags": [
      "이달의맛",
      "2012년",
      "9월"
    ],
    "imageUrl": "/images/220.webp"
  },
  {
    "id": 291,
    "name": "바닐라 스카이",
    "tags": [
      "이달의맛",
      "2012년",
      "8월"
    ],
    "imageUrl": "/images/219.webp"
  },
  {
    "id": 290,
    "name": "마이 레몬 트리",
    "tags": [
      "이달의맛",
      "2012년",
      "7월"
    ],
    "imageUrl": "/images/218.webp"
  },
  {
    "id": 289,
    "name": "올라! 샹그리아",
    "tags": [
      "이달의맛",
      "2012년",
      "6월"
    ],
    "imageUrl": "/images/217.webp"
  },
  {
    "id": 216,
    "name": "디노 젤리",
    "tags": [
      "이달의맛",
      "2012년",
      "5월"
    ],
    "imageUrl": "/images/216.webp"
  },
  {
    "id": 214,
    "name": "솔티 카라멜라",
    "tags": [
      "이달의맛",
      "2012년",
      "3월"
    ],
    "imageUrl": "/images/214.webp"
  },
  {
    "id": 213,
    "name": "네 마음에 퐁당퐁당",
    "tags": [
      "이달의맛",
      "2012년",
      "2월"
    ],
    "imageUrl": "/images/213.webp"
  },
  {
    "id": 212,
    "name": "아이엠 샘",
    "tags": [
      "이달의맛",
      "2012년",
      "1월"
    ],
    "imageUrl": "/images/212.webp"
  },
  {
    "id": 211,
    "name": "스노우 화이트",
    "tags": [
      "이달의맛",
      "2011년",
      "12월"
    ],
    "imageUrl": "/images/211.webp"
  },
  {
    "id": 210,
    "name": "호두왕자",
    "tags": [
      "이달의맛",
      "2011년",
      "11월"
    ],
    "imageUrl": "/images/210.webp"
  },
  {
    "id": 209,
    "name": "미스테리 잭",
    "tags": [
      "이달의맛",
      "2011년",
      "10월"
    ],
    "imageUrl": "/images/209.webp"
  },
  {
    "id": 215,
    "name": "땅콩로켓",
    "tags": [
      "이달의맛",
      "2011년",
      "9월"
    ],
    "imageUrl": "/images/215.webp"
  },
  {
    "id": 208,
    "name": "빙글빙글 트위스터",
    "tags": [
      "이달의맛",
      "2011년",
      "8월"
    ],
    "imageUrl": "/images/208.webp"
  },
  {
    "id": 207,
    "name": "파핑 트로피카",
    "tags": [
      "이달의맛",
      "2011년",
      "7월"
    ],
    "imageUrl": "/images/207.webp"
  },
  {
    "id": 206,
    "name": "얌베리 요거트의 시크릿 넘버",
    "tags": [
      "이달의맛",
      "2011년",
      "6월"
    ],
    "imageUrl": "/images/206.webp"
  },
  {
    "id": 205,
    "name": "바나나몬스터",
    "tags": [
      "이달의맛",
      "2011년",
      "5월"
    ],
    "imageUrl": "/images/205.webp"
  },
  {
    "id": 203,
    "name": "블루베리 알로에",
    "tags": [
      "이달의맛",
      "2011년",
      "4월"
    ],
    "imageUrl": "/images/203.webp"
  },
  {
    "id": 202,
    "name": "줄리엣의 키스",
    "tags": [
      "이달의맛",
      "2011년",
      "3월"
    ],
    "imageUrl": "/images/202.webp"
  },
  {
    "id": 201,
    "name": "로미오의 하트",
    "tags": [
      "이달의맛",
      "2011년",
      "2월"
    ],
    "imageUrl": "/images/201.webp"
  },
  {
    "id": 200,
    "name": "럭키 래빗",
    "tags": [
      "이달의맛",
      "2011년",
      "1월"
    ],
    "imageUrl": "/images/200.webp"
  },
  {
    "id": 204,
    "name": "말차다미아",
    "tags": [
      "이달의맛",
      "2025년",
      "10월"
    ],
    "imageUrl": "/images/204.png"
  },
  {
    "id": 198,
    "name": "월넛",
    "imageUrl": "/images/198.webp"
  },
  {
    "id": 217,
    "name": "(Lessly Edition) 바 베 바",
    "tags": ["레슬리에디션", "바나나", "딸기", "바닐라", "저칼로리"],
    "imageUrl": "/images/217.png",
    "englishName": "(Lessly Edition) BA BE BA",
    "description": "바나나, 딸기, 바닐라 세 가지 맛을 담은 레슬리 에디션. 기존 맛보다 당과 칼로리를 줄인 저부담 아이스크림.",
    "components": ["바나나", "딸기", "바닐라"]
  },
  {
    "id": 218,
    "name": "아이 원-츄!",
    "tags": ["이달의맛", "2025년", "5월", "츄러스", "초콜릿", "우유"],
    "imageUrl": "/images/218.webp",
    "englishName": "I ONE-CHEW!",
    "description": "2025년 5월 이달의 맛. 우유 아이스크림에 바삭한 츄러스 조각과 초콜릿이 어우러진 맛.",
    "components": ["우유", "츄러스", "초콜릿"]
  },
  {
    "id": 219,
    "name": "아이스 칸탈로프 멜론",
    "tags": ["이달의맛", "2025년", "5월", "멜론", "과일"],
    "imageUrl": "/images/219.webp",
    "englishName": "CANTALOUPE MELON ICE CREAM",
    "description": "2025년 5월 이달의 맛. 달콤하고 향긋한 칸탈로프 멜론 아이스크림.",
    "components": ["칸탈로프멜론"]
  },
  {
    "id": 220,
    "name": "메롱멜론",
    "tags": ["멜론", "과일", "여름", "콜라보"],
    "imageUrl": "/images/220.jpg",
    "englishName": "MERONGMELON",
    "description": "2022년 6월 출시. 음원 플랫폼 멜론과 콜라보한 머스크멜론 아이스크림.",
    "components": ["머스크멜론"]
  },
  {
    "id": 221,
    "name": "프랄린 앤 크림",
    "tags": ["클래식", "바닐라", "캐러멜", "견과류"],
    "imageUrl": "/images/221.jpg",
    "englishName": "PRALINES 'N CREAM",
    "description": "전세계 배스킨라빈스 판매 1위 클래식 플레이버. 바닐라 아이스크림에 바삭한 프랄린 피칸과 캐러멜 시럽.",
    "components": ["바닐라", "프랄린피칸", "캐러멜"]
  },
  {
    "id": 222,
    "name": "루나 치즈 케이크",
    "tags": ["클래식", "치즈케이크"],
    "imageUrl": "/images/222.jpg",
    "englishName": "LUNAR CHEESECAKE",
    "description": "1969년 달 착륙 기념 출시. 미국 배스킨라빈스 치즈 플레이버 1위. 크리미한 치즈케이크와 크래커 조각.",
    "components": ["치즈케이크", "크래커"]
  },
  {
    "id": 223,
    "name": "파핑파핑 바나나",
    "tags": ["바나나", "팝핑캔디"],
    "imageUrl": "/images/223.jpg",
    "englishName": "POPPING POPPING BANANA",
    "description": "팡팡 터지는 팝핑캔디와 달콤한 바나나 아이스크림의 조합.",
    "components": ["바나나", "팝핑캔디"]
  },
  {
    "id": 224,
    "name": "팝핑 스타 라이즈",
    "tags": ["콜라보", "RIIZE", "블루소다", "팝핑캔디", "2023년"],
    "imageUrl": "/images/224.jpg",
    "englishName": "POPPING STAR RIIZE",
    "description": "2023년 RIIZE 콜라보. 블루 소다 샤베트와 우유 아이스크림에 블루 팝핑캔디. 출시 열흘 만에 완판.",
    "components": ["블루소다샤베트", "우유", "팝핑캔디"]
  },
  {
    "id": 225,
    "name": "골드 메달 리본",
    "tags": ["클래식", "초콜릿", "바닐라", "캐러멜"],
    "imageUrl": "/images/225.webp",
    "englishName": "GOLD MEDAL RIBBON",
    "description": "2018년 평창 동계올림픽 기념 재출시. 초콜릿·바닐라 아이스크림에 캐러멜 시럽 리본.",
    "components": ["초콜릿", "바닐라", "캐러멜"]
  }
];
