// ============================================
// Bible Palace - Prisma Seed Script
// 66권 성경 데이터 + 주요 구절 (개역개정)
// ============================================
import dotenv from "dotenv";
dotenv.config();

import { PrismaClient, Testament } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// ── Prisma Client 생성 ──
const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter } as any);

// ══════════════════════════════════════════════
// 66권 성경 책 데이터
// ══════════════════════════════════════════════
interface BookData {
  name: string;
  nameEn: string;
  abbreviation: string;
  testament: Testament;
  orderNum: number;
  chapterCount: number;
}

const BOOKS: BookData[] = [
  // ── 구약 (39권) ──
  { name: "창세기", nameEn: "Genesis", abbreviation: "창", testament: "OLD", orderNum: 1, chapterCount: 50 },
  { name: "출애굽기", nameEn: "Exodus", abbreviation: "출", testament: "OLD", orderNum: 2, chapterCount: 40 },
  { name: "레위기", nameEn: "Leviticus", abbreviation: "레", testament: "OLD", orderNum: 3, chapterCount: 27 },
  { name: "민수기", nameEn: "Numbers", abbreviation: "민", testament: "OLD", orderNum: 4, chapterCount: 36 },
  { name: "신명기", nameEn: "Deuteronomy", abbreviation: "신", testament: "OLD", orderNum: 5, chapterCount: 34 },
  { name: "여호수아", nameEn: "Joshua", abbreviation: "수", testament: "OLD", orderNum: 6, chapterCount: 24 },
  { name: "사사기", nameEn: "Judges", abbreviation: "삿", testament: "OLD", orderNum: 7, chapterCount: 21 },
  { name: "룻기", nameEn: "Ruth", abbreviation: "룻", testament: "OLD", orderNum: 8, chapterCount: 4 },
  { name: "사무엘상", nameEn: "1 Samuel", abbreviation: "삼상", testament: "OLD", orderNum: 9, chapterCount: 31 },
  { name: "사무엘하", nameEn: "2 Samuel", abbreviation: "삼하", testament: "OLD", orderNum: 10, chapterCount: 24 },
  { name: "열왕기상", nameEn: "1 Kings", abbreviation: "왕상", testament: "OLD", orderNum: 11, chapterCount: 22 },
  { name: "열왕기하", nameEn: "2 Kings", abbreviation: "왕하", testament: "OLD", orderNum: 12, chapterCount: 25 },
  { name: "역대상", nameEn: "1 Chronicles", abbreviation: "대상", testament: "OLD", orderNum: 13, chapterCount: 29 },
  { name: "역대하", nameEn: "2 Chronicles", abbreviation: "대하", testament: "OLD", orderNum: 14, chapterCount: 36 },
  { name: "에스라", nameEn: "Ezra", abbreviation: "스", testament: "OLD", orderNum: 15, chapterCount: 10 },
  { name: "느헤미야", nameEn: "Nehemiah", abbreviation: "느", testament: "OLD", orderNum: 16, chapterCount: 13 },
  { name: "에스더", nameEn: "Esther", abbreviation: "에", testament: "OLD", orderNum: 17, chapterCount: 10 },
  { name: "욥기", nameEn: "Job", abbreviation: "욥", testament: "OLD", orderNum: 18, chapterCount: 42 },
  { name: "시편", nameEn: "Psalms", abbreviation: "시", testament: "OLD", orderNum: 19, chapterCount: 150 },
  { name: "잠언", nameEn: "Proverbs", abbreviation: "잠", testament: "OLD", orderNum: 20, chapterCount: 31 },
  { name: "전도서", nameEn: "Ecclesiastes", abbreviation: "전", testament: "OLD", orderNum: 21, chapterCount: 12 },
  { name: "아가", nameEn: "Song of Solomon", abbreviation: "아", testament: "OLD", orderNum: 22, chapterCount: 8 },
  { name: "이사야", nameEn: "Isaiah", abbreviation: "사", testament: "OLD", orderNum: 23, chapterCount: 66 },
  { name: "예레미야", nameEn: "Jeremiah", abbreviation: "렘", testament: "OLD", orderNum: 24, chapterCount: 52 },
  { name: "예레미야애가", nameEn: "Lamentations", abbreviation: "애", testament: "OLD", orderNum: 25, chapterCount: 5 },
  { name: "에스겔", nameEn: "Ezekiel", abbreviation: "겔", testament: "OLD", orderNum: 26, chapterCount: 48 },
  { name: "다니엘", nameEn: "Daniel", abbreviation: "단", testament: "OLD", orderNum: 27, chapterCount: 12 },
  { name: "호세아", nameEn: "Hosea", abbreviation: "호", testament: "OLD", orderNum: 28, chapterCount: 14 },
  { name: "요엘", nameEn: "Joel", abbreviation: "욜", testament: "OLD", orderNum: 29, chapterCount: 3 },
  { name: "아모스", nameEn: "Amos", abbreviation: "암", testament: "OLD", orderNum: 30, chapterCount: 9 },
  { name: "오바댜", nameEn: "Obadiah", abbreviation: "옵", testament: "OLD", orderNum: 31, chapterCount: 1 },
  { name: "요나", nameEn: "Jonah", abbreviation: "욘", testament: "OLD", orderNum: 32, chapterCount: 4 },
  { name: "미가", nameEn: "Micah", abbreviation: "미", testament: "OLD", orderNum: 33, chapterCount: 7 },
  { name: "나훔", nameEn: "Nahum", abbreviation: "나", testament: "OLD", orderNum: 34, chapterCount: 3 },
  { name: "하박국", nameEn: "Habakkuk", abbreviation: "합", testament: "OLD", orderNum: 35, chapterCount: 3 },
  { name: "스바냐", nameEn: "Zephaniah", abbreviation: "습", testament: "OLD", orderNum: 36, chapterCount: 3 },
  { name: "학개", nameEn: "Haggai", abbreviation: "학", testament: "OLD", orderNum: 37, chapterCount: 2 },
  { name: "스가랴", nameEn: "Zechariah", abbreviation: "슥", testament: "OLD", orderNum: 38, chapterCount: 14 },
  { name: "말라기", nameEn: "Malachi", abbreviation: "말", testament: "OLD", orderNum: 39, chapterCount: 4 },

  // ── 신약 (27권) ──
  { name: "마태복음", nameEn: "Matthew", abbreviation: "마", testament: "NEW", orderNum: 40, chapterCount: 28 },
  { name: "마가복음", nameEn: "Mark", abbreviation: "막", testament: "NEW", orderNum: 41, chapterCount: 16 },
  { name: "누가복음", nameEn: "Luke", abbreviation: "눅", testament: "NEW", orderNum: 42, chapterCount: 24 },
  { name: "요한복음", nameEn: "John", abbreviation: "요", testament: "NEW", orderNum: 43, chapterCount: 21 },
  { name: "사도행전", nameEn: "Acts", abbreviation: "행", testament: "NEW", orderNum: 44, chapterCount: 28 },
  { name: "로마서", nameEn: "Romans", abbreviation: "롬", testament: "NEW", orderNum: 45, chapterCount: 16 },
  { name: "고린도전서", nameEn: "1 Corinthians", abbreviation: "고전", testament: "NEW", orderNum: 46, chapterCount: 16 },
  { name: "고린도후서", nameEn: "2 Corinthians", abbreviation: "고후", testament: "NEW", orderNum: 47, chapterCount: 13 },
  { name: "갈라디아서", nameEn: "Galatians", abbreviation: "갈", testament: "NEW", orderNum: 48, chapterCount: 6 },
  { name: "에베소서", nameEn: "Ephesians", abbreviation: "엡", testament: "NEW", orderNum: 49, chapterCount: 6 },
  { name: "빌립보서", nameEn: "Philippians", abbreviation: "빌", testament: "NEW", orderNum: 50, chapterCount: 4 },
  { name: "골로새서", nameEn: "Colossians", abbreviation: "골", testament: "NEW", orderNum: 51, chapterCount: 4 },
  { name: "데살로니가전서", nameEn: "1 Thessalonians", abbreviation: "살전", testament: "NEW", orderNum: 52, chapterCount: 5 },
  { name: "데살로니가후서", nameEn: "2 Thessalonians", abbreviation: "살후", testament: "NEW", orderNum: 53, chapterCount: 3 },
  { name: "디모데전서", nameEn: "1 Timothy", abbreviation: "딤전", testament: "NEW", orderNum: 54, chapterCount: 6 },
  { name: "디모데후서", nameEn: "2 Timothy", abbreviation: "딤후", testament: "NEW", orderNum: 55, chapterCount: 4 },
  { name: "디도서", nameEn: "Titus", abbreviation: "딛", testament: "NEW", orderNum: 56, chapterCount: 3 },
  { name: "빌레몬서", nameEn: "Philemon", abbreviation: "몬", testament: "NEW", orderNum: 57, chapterCount: 1 },
  { name: "히브리서", nameEn: "Hebrews", abbreviation: "히", testament: "NEW", orderNum: 58, chapterCount: 13 },
  { name: "야고보서", nameEn: "James", abbreviation: "약", testament: "NEW", orderNum: 59, chapterCount: 5 },
  { name: "베드로전서", nameEn: "1 Peter", abbreviation: "벧전", testament: "NEW", orderNum: 60, chapterCount: 5 },
  { name: "베드로후서", nameEn: "2 Peter", abbreviation: "벧후", testament: "NEW", orderNum: 61, chapterCount: 3 },
  { name: "요한일서", nameEn: "1 John", abbreviation: "요일", testament: "NEW", orderNum: 62, chapterCount: 5 },
  { name: "요한이서", nameEn: "2 John", abbreviation: "요이", testament: "NEW", orderNum: 63, chapterCount: 1 },
  { name: "요한삼서", nameEn: "3 John", abbreviation: "요삼", testament: "NEW", orderNum: 64, chapterCount: 1 },
  { name: "유다서", nameEn: "Jude", abbreviation: "유", testament: "NEW", orderNum: 65, chapterCount: 1 },
  { name: "요한계시록", nameEn: "Revelation", abbreviation: "계", testament: "NEW", orderNum: 66, chapterCount: 22 },
];

// ══════════════════════════════════════════════
// 주요 구절 데이터 (개역개정)
// key: "책이름:장번호"
// value: { verseNum: text } 맵
// ══════════════════════════════════════════════
type VerseMap = Record<number, string>;
type ChapterVerses = Record<string, VerseMap>;

const SEEDED_VERSES: ChapterVerses = {
  // ── 시편 23편 (전체 6절) ──
  "시편:23": {
    1: "여호와는 나의 목자시니 내게 부족함이 없으리로다",
    2: "그가 나를 푸른 풀밭에 누이시며 쉴 만한 물 가로 인도하시는도다",
    3: "내 영혼을 소생시키시고 자기 이름을 위하여 의의 길로 인도하시는도다",
    4: "내가 사망의 음침한 골짜기로 다닐지라도 해를 두려워하지 않을 것은 주께서 나와 함께 하심이라 주의 지팡이와 막대기가 나를 안위하시나이다",
    5: "주께서 내 원수의 목전에서 내게 상을 차려 주시고 기름을 내 머리에 부으셨으니 내 잔이 넘치나이다",
    6: "내 평생에 선하심과 인자하심이 반드시 나를 따르리니 내가 여호와의 집에 영원히 살리로다",
  },

  // ── 시편 1편 (전체 6절) ──
  "시편:1": {
    1: "복 있는 사람은 악인의 꾀를 따르지 아니하며 죄인의 길에 서지 아니하며 오만한 자의 자리에 앉지 아니하고",
    2: "오직 여호와의 율법을 즐거워하여 그의 율법을 주야로 묵상하는도다",
    3: "그는 시냇가에 심은 나무가 철을 따라 열매를 맺으며 그 잎사귀가 마르지 아니함 같으니 그가 하는 모든 일이 다 형통하리로다",
    4: "악인들은 그렇지 아니함이여 오직 바람에 나는 겨와 같도다",
    5: "그러므로 악인들은 심판을 견디지 못하며 죄인들이 의인들의 모임에 들지 못하리로다",
    6: "대저 의인들의 길은 여호와께서 인정하시나 악인들의 길은 망하리로다",
  },

  // ── 요한복음 15장 (1-12절) ──
  "요한복음:15": {
    1: "나는 참포도나무요 내 아버지는 농부라",
    2: "무릇 내게 붙어 있어 열매를 맺지 아니하는 가지는 아버지께서 그것을 제거해 버리시고 무릇 열매를 맺는 가지는 더 열매를 맺게 하려 하여 그것을 깨끗하게 하시느니라",
    3: "너희는 내가 일러 준 말로 이미 깨끗하여졌으니",
    4: "내 안에 거하라 나도 너희 안에 거하리라 가지가 포도나무에 붙어 있지 아니하면 스스로 열매를 맺을 수 없음 같이 너희도 내 안에 있지 아니하면 그러하리라",
    5: "나는 포도나무요 너희는 가지라 그가 내 안에 내가 그 안에 거하면 사람이 열매를 많이 맺나니 나를 떠나서는 너희가 아무 것도 할 수 없음이라",
    6: "사람이 내 안에 거하지 아니하면 가지처럼 밖에 버려져 마르나니 사람들이 그것을 모아다가 불에 던져 사르느니라",
    7: "너희가 내 안에 거하고 내 말이 너희 안에 거하면 무엇이든지 원하는 대로 구하라 그리하면 이루리라",
    8: "너희가 열매를 많이 맺으면 내 아버지께서 영광을 받으실 것이요 너희는 내 제자가 되리라",
    9: "아버지께서 나를 사랑하신 것 같이 나도 너희를 사랑하였으니 나의 사랑 안에 거하라",
    10: "내가 아버지의 계명을 지켜 그의 사랑 안에 거하는 것 같이 너희도 내 계명을 지키면 내 사랑 안에 거하리라",
    11: "내가 이것을 너희에게 이름은 내 기쁨이 너희 안에 있어 너희 기쁨을 충만하게 하려 함이라",
    12: "내 계명은 곧 내가 너희를 사랑한 것 같이 너희도 서로 사랑하라 하는 이것이니라",
  },

  // ── 빌립보서 4장 (4-13절) ──
  "빌립보서:4": {
    4: "주 안에서 항상 기뻐하라 내가 다시 말하노니 기뻐하라",
    5: "너희 관용을 모든 사람에게 알게 하라 주께서 가까우시니라",
    6: "아무 것도 염려하지 말고 다만 모든 일에 기도와 간구로 너희 구할 것을 감사함으로 하나님께 아뢰라",
    7: "그리하면 모든 지각에 뛰어난 하나님의 평강이 그리스도 예수 안에서 너희 마음과 생각을 지키시리라",
    8: "끝으로 형제들아 무엇에든지 참되며 무엇에든지 경건하며 무엇에든지 옳으며 무엇에든지 정결하며 무엇에든지 사랑 받을 만하며 무엇에든지 칭찬 받을 만하며 무슨 덕이 있든지 무슨 기림이 있든지 이것들을 생각하라",
    9: "너희는 내게 배우고 받고 듣고 본 바를 행하라 그리하면 평강의 하나님이 너희와 함께 계시리라",
    10: "내가 주 안에서 크게 기뻐함은 너희가 나를 생각하던 것이 이제 다시 싹이 남이니 너희가 또한 이를 위하여 생각은 하였으나 기회가 없었느니라",
    11: "내가 궁핍하므로 말하는 것이 아니니라 어떠한 형편에든지 나는 자족하기를 배웠노니",
    12: "나는 비천에 처할 줄도 알고 풍부에 처할 줄도 알아 모든 일 곧 배부름과 배고픔과 풍부와 궁핍에도 처할 줄 아는 일체의 비결을 배웠노라",
    13: "내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라",
  },

  // ── 창세기 1장 (1-10절) ──
  "창세기:1": {
    1: "태초에 하나님이 천지를 창조하시니라",
    2: "땅이 혼돈하고 공허하며 흑암이 깊음 위에 있고 하나님의 영은 수면 위에 운행하시니라",
    3: "하나님이 이르시되 빛이 있으라 하시니 빛이 있었고",
    4: "빛이 하나님이 보시기에 좋았더라 하나님이 빛과 어둠을 나누사",
    5: "하나님이 빛을 낮이라 부르시고 어둠을 밤이라 부르시니라 저녁이 되고 아침이 되니 이는 첫째 날이니라",
    6: "하나님이 이르시되 물 가운데에 궁창이 있어 물과 물로 나뉘라 하시고",
    7: "하나님이 궁창을 만드사 궁창 아래의 물과 궁창 위의 물로 나뉘게 하시니 그대로 되니라",
    8: "하나님이 궁창을 하늘이라 부르시니라 저녁이 되고 아침이 되니 이는 둘째 날이니라",
    9: "하나님이 이르시되 천하의 물이 한 곳으로 모이고 뭍이 드러나라 하시니 그대로 되니라",
    10: "하나님이 뭍을 땅이라 부르시고 모인 물을 바다라 부르시니 하나님이 보시기에 좋았더라",
  },

  // ── 잠언 3장 (1-6절) ──
  "잠언:3": {
    1: "내 아들아 나의 법을 잊어버리지 말고 네 마음으로 나의 명령을 지키라",
    2: "그리하면 그것이 네가 장수하여 많은 해를 누리게 하며 평강을 더하게 하리라",
    3: "인자와 진리가 네게서 떠나지 말게 하고 그것을 네 목에 매며 네 마음판에 새기라",
    4: "그리하면 네가 하나님과 사람 앞에서 은총과 귀중히 여김을 받으리라",
    5: "너는 마음을 다하여 여호와를 신뢰하고 네 명철을 의지하지 말라",
    6: "너는 범사에 그를 인정하라 그리하면 네 길을 지도하시리라",
  },

  // ── 마태복음 5장 (1-12절, 팔복) ──
  "마태복음:5": {
    1: "예수께서 무리를 보시고 산에 올라가 앉으시니 제자들이 나아온지라",
    2: "입을 열어 가르쳐 이르시되",
    3: "심령이 가난한 자는 복이 있나니 천국이 그들의 것임이요",
    4: "애통하는 자는 복이 있나니 그들이 위로를 받을 것임이요",
    5: "온유한 자는 복이 있나니 그들이 땅을 기업으로 받을 것임이요",
    6: "의에 주리고 목마른 자는 복이 있나니 그들이 배부를 것임이요",
    7: "긍휼히 여기는 자는 복이 있나니 그들이 긍휼히 여김을 받을 것임이요",
    8: "마음이 청결한 자는 복이 있나니 그들이 하나님을 볼 것임이요",
    9: "화평하게 하는 자는 복이 있나니 그들이 하나님의 아들이라 일컬음을 받을 것임이요",
    10: "의를 위하여 박해를 받은 자는 복이 있나니 천국이 그들의 것임이라",
    11: "나로 말미암아 너희를 욕하고 박해하고 거짓으로 너희를 거슬러 모든 악한 말을 할 때에는 너희에게 복이 있나니",
    12: "기뻐하고 즐거워하라 하늘에서 너희의 상이 큼이라 너희 전에 있던 선지자들도 이같이 박해하였느니라",
  },

  // ── 로마서 8장 (28-39절) ──
  "로마서:8": {
    28: "우리가 알거니와 하나님을 사랑하는 자 곧 그의 뜻대로 부르심을 입은 자들에게는 모든 것이 합력하여 선을 이루느니라",
    29: "하나님이 미리 아신 자들을 또한 그 아들의 형상을 본받게 하기 위하여 미리 정하셨으니 이는 그로 많은 형제 중에서 맏아들이 되게 하려 하심이니라",
    30: "또 미리 정하신 그들을 또한 부르시고 부르신 그들을 또한 의롭다 하시고 의롭다 하신 그들을 또한 영화롭게 하셨느니라",
    31: "그런즉 이 일에 대하여 우리가 무슨 말 하리요 만일 하나님이 우리를 위하시면 누가 우리를 대적하리요",
    32: "자기 아들을 아끼지 아니하시고 우리 모든 사람을 위하여 내주신 이가 어찌 그 아들과 함께 모든 것을 우리에게 은사로 주지 아니하시겠느냐",
    33: "누가 능히 하나님께서 택하신 자들을 고발하리요 의롭다 하신 이는 하나님이시니",
    34: "누가 정죄하리요 죽으실 뿐 아니라 다시 살아나신 이는 그리스도 예수시니 그는 하나님 우편에 계신 자요 우리를 위하여 간구하시는 자시니라",
    35: "누가 우리를 그리스도의 사랑에서 끊으리요 환난이나 곤고나 박해나 기근이나 적신이나 위험이나 칼이랴",
    36: "기록된 바 우리가 종일 주를 위하여 죽임을 당하게 되며 도살당할 양 같이 여김을 받았나이다 함과 같으니라",
    37: "그러나 이 모든 일에 우리를 사랑하시는 이로 말미암아 우리가 넉넉히 이기느니라",
    38: "내가 확신하노니 사망이나 생명이나 천사들이나 권세자들이나 현재 일이나 장래 일이나 능력이나",
    39: "높음이나 깊음이나 다른 어떤 피조물이라도 우리를 우리 주 그리스도 예수 안에 있는 하나님의 사랑에서 끊을 수 없으리라",
  },

  // ── 이사야 40장 (28-31절) ──
  "이사야:40": {
    28: "너는 알지 못하였느냐 듣지 못하였느냐 영원하신 하나님 여호와 땅 끝까지 창조하신 이는 피곤하지 않으시며 곤비하지 않으시며 그의 명철은 헤아릴 수 없으며",
    29: "피곤한 자에게는 능력을 주시며 무능한 자에게는 힘을 더하시나니",
    30: "소년이라도 피곤하며 곤비하며 젊은이라도 넘어지며 자빠지되",
    31: "오직 여호와를 앙망하는 자는 새 힘을 얻으리니 독수리가 날개치며 올라감 같을 것이요 달려도 곤비하지 아니하겠고 걸어도 피곤하지 아니하리로다",
  },
};

// ══════════════════════════════════════════════
// 각 책별 각 장의 실제 절 수 (참조 데이터)
// 주요 장들만 실제 절 수를 기록
// ══════════════════════════════════════════════
const VERSE_COUNTS: Record<string, Record<number, number>> = {
  // 시편 - 150편 중 주요편 절 수
  "시편": { 1: 6, 23: 6 },
  // 요한복음 15장
  "요한복음": { 15: 27 },
  // 빌립보서 4장
  "빌립보서": { 4: 23 },
  // 창세기 1장
  "창세기": { 1: 31 },
  // 잠언 3장
  "잠언": { 3: 35 },
  // 마태복음 5장
  "마태복음": { 5: 48 },
  // 로마서 8장
  "로마서": { 8: 39 },
  // 이사야 40장
  "이사야": { 40: 31 },
};

// ══════════════════════════════════════════════
// 메인 시드 함수
// ══════════════════════════════════════════════
async function main() {
  console.log("🌱 Bible Palace 시드 시작...\n");

  // ── 1. 66권 책 생성 ──
  console.log("📖 66권 성경 책 생성 중...");
  const bookMap = new Map<string, number>(); // name -> bookId

  for (const bookData of BOOKS) {
    const book = await prisma.book.upsert({
      where: { id: bookData.orderNum }, // orderNum을 id 힌트로 사용하되, 실제로는 unique 필드 필요
      update: {
        name: bookData.name,
        nameEn: bookData.nameEn,
        abbreviation: bookData.abbreviation,
        testament: bookData.testament,
        orderNum: bookData.orderNum,
        chapterCount: bookData.chapterCount,
      },
      create: {
        name: bookData.name,
        nameEn: bookData.nameEn,
        abbreviation: bookData.abbreviation,
        testament: bookData.testament,
        orderNum: bookData.orderNum,
        chapterCount: bookData.chapterCount,
      },
    });
    bookMap.set(bookData.name, book.id);
    process.stdout.write(`  ✅ ${bookData.name} (${bookData.nameEn})\r`);
  }
  console.log(`\n  => ${bookMap.size}권 완료\n`);

  // ── 2. 각 책의 장(Chapter) 생성 ──
  console.log("📑 장(Chapter) 생성 중...");
  const chapterMap = new Map<string, number>(); // "책이름:장번호" -> chapterId
  let totalChapters = 0;

  for (const bookData of BOOKS) {
    const bookId = bookMap.get(bookData.name)!;

    for (let chNum = 1; chNum <= bookData.chapterCount; chNum++) {
      const chapter = await prisma.chapter.upsert({
        where: {
          bookId_chapterNum: { bookId, chapterNum: chNum },
        },
        update: {},
        create: {
          bookId,
          chapterNum: chNum,
        },
      });
      chapterMap.set(`${bookData.name}:${chNum}`, chapter.id);
      totalChapters++;
    }
    process.stdout.write(`  📑 ${bookData.name}: ${bookData.chapterCount}장 완료\r`);
  }
  console.log(`\n  => 총 ${totalChapters}장 완료\n`);

  // ── 3. 주요 구절 (실제 개역개정 텍스트) 삽입 ──
  console.log("✍️  주요 구절 삽입 중 (실제 개역개정 텍스트)...");
  let seededVerseCount = 0;

  for (const [key, verses] of Object.entries(SEEDED_VERSES)) {
    const chapterId = chapterMap.get(key);
    if (!chapterId) {
      console.warn(`  ⚠️  장을 찾을 수 없음: ${key}`);
      continue;
    }

    for (const [verseNumStr, text] of Object.entries(verses)) {
      const verseNum = parseInt(verseNumStr);
      await prisma.verse.upsert({
        where: {
          chapterId_verseNum: { chapterId, verseNum },
        },
        update: { text },
        create: {
          chapterId,
          verseNum,
          text,
        },
      });
      seededVerseCount++;
    }
    console.log(`  ✅ ${key} (${Object.keys(verses).length}절)`);
  }
  console.log(`  => 주요 구절 ${seededVerseCount}개 완료\n`);

  // ── 4. 나머지 장들에 플레이스홀더 1절 삽입 ──
  console.log("📝 나머지 장에 플레이스홀더 삽입 중...");
  const placeholderText = "이 장의 본문은 아직 추가되지 않았습니다.";
  let placeholderCount = 0;

  // seeded 된 장 키 목록
  const seededChapterKeys = new Set(Object.keys(SEEDED_VERSES));

  for (const bookData of BOOKS) {
    for (let chNum = 1; chNum <= bookData.chapterCount; chNum++) {
      const key = `${bookData.name}:${chNum}`;
      const chapterId = chapterMap.get(key);
      if (!chapterId) continue;

      // 이미 실제 구절이 삽입된 장은 건너뜀
      if (seededChapterKeys.has(key)) continue;

      // 플레이스홀더 1절만 삽입
      await prisma.verse.upsert({
        where: {
          chapterId_verseNum: { chapterId, verseNum: 1 },
        },
        update: {},
        create: {
          chapterId,
          verseNum: 1,
          text: placeholderText,
        },
      });
      placeholderCount++;
    }
    process.stdout.write(`  📝 ${bookData.name} 플레이스홀더 완료\r`);
  }
  console.log(`\n  => 플레이스홀더 ${placeholderCount}장 완료\n`);

  // ── 요약 ──
  const bookCount = await prisma.book.count();
  const chapterCount = await prisma.chapter.count();
  const verseCount = await prisma.verse.count();

  console.log("══════════════════════════════════════");
  console.log("🎉 시드 완료!");
  console.log(`  📖 책: ${bookCount}권`);
  console.log(`  📑 장: ${chapterCount}장`);
  console.log(`  ✍️  절: ${verseCount}절`);
  console.log("══════════════════════════════════════");
}

// ── 실행 ──
main()
  .catch((e) => {
    console.error("❌ 시드 실패:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
