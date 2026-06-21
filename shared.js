import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

import { firebaseConfig, USER_ID } from "./firebase-config.js";

/*
  핵심 구조
  - missions: 매일 반복되는 미션 목록
  - dailyDone: 날짜별 완료 기록
    예: dailyDone["2026-06-20"] = { "1": true, "2": true }
  - dailyBadges: 날짜별 배지 기록
    예: dailyBadges["2026-06-20"] = [{icon:"⚡", text:"완료"}]
  그래서 오늘 누른 버튼은 오늘만 완료되고, 내일은 다시 누를 수 있습니다.
*/

export const defaultMissions = [
  { id: 1, title: "전기기능사 CBT 20문제 풀기", level: "보통", category: "전기기능사" },
  { id: 2, title: "전기기기 강의 1개 보기", level: "보통", category: "전기기능사" },
  { id: 3, title: "GITC 영상 아이디어 1개 적기", level: "쉬움", category: "GITC" },
  { id: 4, title: "CapCut 10분 연습하기", level: "쉬움", category: "영상편집" },
  { id: 5, title: "학교 준비물 확인하기", level: "쉬움", category: "학교" }
];

export const badgeIcons = ["⚡", "💻", "🎬", "📚", "🏆", "⭐", "🔧", "🌍"];
export const cheers = [
  "좋아! 한 걸음 성공!",
  "포기하지 않고 해냈어!",
  "오늘 미션 완료!",
  "찬 최고! 계속 가보자!",
  "멋져! 배지 획득!"
];

export function pad(n) {
  return String(n).padStart(2, "0");
}

export function todayInfo() {
  const d = new Date();
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    date: d.getDate(),
    monthKey: `${d.getFullYear()}-${pad(d.getMonth() + 1)}`,
    dateKey: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  };
}

export function monthKey(y, m) {
  return `${y}-${pad(m)}`;
}

export function dateKey(y, m, d) {
  return `${y}-${pad(m)}-${pad(d)}`;
}

export function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function categoryIcon(cat) {
  const map = {
    "전기기능사": "⚡",
    "GITC": "💻",
    "영상편집": "🎬",
    "학교": "📚",
    "기능대회": "🏆",
    "생활": "🌿"
  };
  return map[cat] || "🎯";
}

export function freshMonthData() {
  return {
    missions: JSON.parse(JSON.stringify(defaultMissions)),
    dailyDone: {},
    dailyBadges: {},
    rewards: {
      small: "좋아하는 간식",
      big: "유튜브 20분"
    },
    updatedAt: new Date().toISOString()
  };
}

export function normalizeData(data) {
  const fresh = freshMonthData();
  data = data || fresh;

  // 예전 버전의 m.done 때문에 버튼이 영구 완료되는 문제를 제거합니다.
  data.missions = Array.isArray(data.missions)
    ? data.missions.map(m => ({
        id: m.id,
        title: m.title || "이름 없는 미션",
        level: m.level || "쉬움",
        category: m.category || "생활"
      }))
    : fresh.missions;

  data.dailyDone = data.dailyDone || {};

  // 예전 dailyLights 이름을 썼던 데이터도 새 구조로 읽을 수 있게 보정합니다.
  data.dailyBadges = data.dailyBadges || data.dailyLights || {};

  data.rewards = data.rewards || fresh.rewards;
  data.updatedAt = data.updatedAt || new Date().toISOString();

  return data;
}

export function getDoneMap(data, dkey) {
  data.dailyDone = data.dailyDone || {};
  if (!data.dailyDone[dkey]) data.dailyDone[dkey] = {};
  return data.dailyDone[dkey];
}

export function getBadges(data, dkey) {
  data.dailyBadges = data.dailyBadges || {};
  if (!data.dailyBadges[dkey]) data.dailyBadges[dkey] = [];
  return data.dailyBadges[dkey];
}

export function isMissionDone(data, dkey, missionId) {
  return !!(data?.dailyDone?.[dkey]?.[String(missionId)] || data?.dailyDone?.[dkey]?.[missionId]);
}

export function getTodayDoneCount(data, dkey) {
  const map = data?.dailyDone?.[dkey] || {};
  return Object.values(map).filter(Boolean).length;
}

export function getMonthBadgeCount(data) {
  if (!data?.dailyBadges) return 0;
  return Object.values(data.dailyBadges).reduce((sum, arr) => {
    return sum + (Array.isArray(arr) ? arr.length : 0);
  }, 0);
}

export function getLevel(total) {
  if (total >= 80) return { level: 5, name: "글로벌 성장러" };
  if (total >= 50) return { level: 4, name: "영상 크리에이터" };
  if (total >= 25) return { level: 3, name: "IT 챌린저" };
  if (total >= 10) return { level: 2, name: "전기 도전자" };
  return { level: 1, name: "도전 시작" };
}

export function isFirebaseConfigured() {
  return (
    firebaseConfig?.apiKey &&
    !firebaseConfig.apiKey.includes("여기에") &&
    firebaseConfig?.projectId &&
    !firebaseConfig.projectId.includes("여기에")
  );
}

let app = null;
let db = null;

export function getDb() {
  if (!isFirebaseConfigured()) {
    throw new Error("firebase-config.js 설정값을 넣어주세요.");
  }
  if (!app) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
  return db;
}

export function getMonthDocRef(key = todayInfo().monthKey) {
  return doc(getDb(), "chanStageUsers", USER_ID, "months", key);
}

export async function saveMonthData(key, data) {
  const clean = normalizeData(data);
  clean.updatedAt = new Date().toISOString();
  await setDoc(getMonthDocRef(key), clean);
}

export function watchMonthData(key, callback, errorCallback) {
  return onSnapshot(
    getMonthDocRef(key),
    async (snap) => {
      if (snap.exists()) {
        callback(normalizeData(snap.data()));
      } else {
        const fresh = freshMonthData();
        await setDoc(getMonthDocRef(key), fresh);
        callback(fresh);
      }
    },
    (error) => {
      console.error(error);
      if (errorCallback) errorCallback(error);
    }
  );
}
