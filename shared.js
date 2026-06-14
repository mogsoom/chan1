
const APP_PREFIX = "chan_stage_kpop_v1_";
const ADMIN_PASSWORD = "790822";

const defaultMissions = [
  { id: 1, title: "전기기능사 CBT 20문제", level: "NORMAL", category: "ELECTRIC", done: false },
  { id: 2, title: "전기기기 강의 1개", level: "NORMAL", category: "ELECTRIC", done: false },
  { id: 3, title: "CapCut 10분 연습", level: "EASY", category: "GITC", done: false },
  { id: 4, title: "GITC 영상 아이디어 1개", level: "EASY", category: "GITC", done: false }
];

const lights = ["💜", "🩵", "💚", "⭐", "🎤", "✨"];
const cheers = [
  "오늘의 무대 성공!",
  "연습 완료! 한 걸음 성장!",
  "팬라이트 ON!",
  "멋져! 계속 무대 위로!",
  "MISSION CLEAR!"
];

function pad(n){ return String(n).padStart(2, "0"); }
function todayInfo(){
  const d = new Date();
  return {
    year: d.getFullYear(),
    month: d.getMonth()+1,
    date: d.getDate(),
    monthKey: `${d.getFullYear()}-${pad(d.getMonth()+1)}`,
    dateKey: `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
  };
}
function monthKey(y,m){ return `${y}-${pad(m)}`; }
function dateKey(y,m,d){ return `${y}-${pad(m)}-${pad(d)}`; }

function freshMonthData(){
  return {
    missions: JSON.parse(JSON.stringify(defaultMissions)),
    dailyLights: {},
    rewards: {
      small: "좋아하는 간식",
      big: "유튜브 20분"
    }
  };
}
function loadMonthData(key=todayInfo().monthKey){
  const saved = localStorage.getItem(APP_PREFIX + key);
  if(saved) return JSON.parse(saved);
  const fresh = freshMonthData();
  localStorage.setItem(APP_PREFIX + key, JSON.stringify(fresh));
  return fresh;
}
function saveMonthData(key, data){
  localStorage.setItem(APP_PREFIX + key, JSON.stringify(data));
}
function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function getTodayLights(data, dkey=todayInfo().dateKey){
  if(!data.dailyLights[dkey]) data.dailyLights[dkey] = [];
  return data.dailyLights[dkey];
}
function getMonthLightCount(data){
  return Object.values(data.dailyLights).reduce((s, arr)=>s+arr.length, 0);
}
function getLevel(totalLights){
  if(totalLights >= 80) return {name:"STAR", level:5};
  if(totalLights >= 50) return {name:"MAIN DANCER", level:4};
  if(totalLights >= 25) return {name:"PERFORMER", level:3};
  if(totalLights >= 10) return {name:"ROOKIE", level:2};
  return {name:"TRAINEE", level:1};
}
function categoryIcon(cat){
  const map = { ELECTRIC:"⚡", GITC:"🎬", SCHOOL:"🏫", LIFE:"🌿", CONTEST:"🏆" };
  return map[cat] || "🎯";
}
