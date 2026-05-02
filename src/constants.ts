import { ThoughtPattern } from "./types";

export const LIVE_COUPON_CODE = "K365OPEN";

export const THOUGHT_PATTERNS = [
  { id: ThoughtPattern.JUDGMENT, label: "판단", description: "나도 모르게 '옳고 그름'을 따지며 상대를 가두고 있나요?" },
  { id: ThoughtPattern.CRITICISM, label: "비난", description: "나 혹은 상대방에게 화살을 돌리며 탓하고 있지는 않나요?" },
  { id: ThoughtPattern.DEMAND, label: "강요", description: "'무조건 이래야 해'라는 압박으로 숨이 막히지는 않나요?" },
  { id: ThoughtPattern.COMPARISON, label: "비교", description: "다른 사람과 비교하며 내 가치를 깎아내리고 있나요?" },
  { id: ThoughtPattern.DESERVE, label: "당연시", description: "상대가 당연히 해줘야 한다는 생각에 서운함이 쌓였나요?" },
  { id: ThoughtPattern.RATIONALIZATION, label: "합리화", description: "내 진짜 마음을 숨기려 핑계를 찾고 있지는 않나요?" },
];

export const CORE_NEEDS = [
  "따뜻한 연결", "충분한 존중", "나만의 자율성", "있는 그대로의 수용", "마음의 평화",
  "안전함", "공감과 이해", "함께하는 즐거움", "정직한 소통", "충분한 휴식",
  "성장하는 기분", "존재의 의미"
];

export const EMOTIONS = [
  "서글픔", "불안함", "울컥함", "답답함", "무력함", "억울함",
  "외로움", "두려움", "지루함", "몽글몽글함", "편안함", "벅참"
];

export const STABILIZATION_TECHNIQUES = [
  {
    title: "복식호흡",
    description: "코로 숨을 깊게 들이마시고, 배가 부풀어 오르는 것을 느끼며 입으로 천천히 내뱉습니다.",
    steps: ["4초간 숨 들이마시기", "2초간 멈추기", "6초간 천천히 내뱉기"],
  },
  {
    title: "그라운딩",
    description: "현재 있는 공간의 사물들을 보며 감각에 집중해 뇌의 과부하를 줄입니다.",
    steps: ["보이는 것 5가지 말하기", "들리는 것 4가지 말하기", "느껴지는 것 3가지 말하기"],
  },
];
