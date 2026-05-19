import React, { useState } from "react";

export default function AdvancedZagsimFarm() {
  // --- 1. 기획 데이터 ---
  const comfortMessages = [
    "완벽하지 않아도 괜찮아요. 멈추지 않는 게 중요하니까요. ☕",
    "오늘 하루 바쁘셨죠? 시든 잎은 다시 가꾸면 그만이에요. 조급해하지 말아요.",
    "작심삼일은 새로운 작심을 시작할 수 있는 타이밍이라는 뜻이에요! 🌱",
    "지친 나를 위해 숨 한 번 크게 쉬고, 다시 한 걸음만 내딛어 볼까요? ✨",
  ];

  const recoveryMissions = [
    { id: "water", text: "💧 시원한 물 한 잔 마시고 오기", icon: "🥛" },
    { id: "walk", text: "🏃‍♂️ 1분 동안 가볍게 제자리 산책하기", icon: "👟" },
    { id: "breathe", text: "🧘‍♂️ 5초간 깊게 심호흡 3번 하기", icon: "🌬️" },
  ];

  // --- 2. 상태 관리 ---
  const [currentScreen, setCurrentScreen] = useState("HOME");
  const [failCount, setFailCount] = useState(0);
  const [isWithered, setIsWithered] = useState(false);
  const [randomMessage, setRandomMessage] = useState("");
  const [currentMission, setCurrentMission] = useState(recoveryMissions[0]);
  
  // 기존 5개에서 7칸 그리드로 가시성을 맞추기 위해 초기값 7개로 확장
  const [grassHistory, setGrassHistory] = useState([
    true, true, true, false, false, false, false
  ]);
  const [streak, setStreak] = useState(3); // 연속 수확 횟수 상태 추가

  // --- 3. 핵심 로직 ---
  const handleRecord = (isSuccess) => {
    if (isSuccess) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setFailCount(0);
      setIsWithered(false);
      
      // 앞에 성공(true)을 추가하고 최대 7개 유지
      setGrassHistory([true, ...grassHistory.slice(0, 6)]);
      setCurrentScreen("HOME");
    } else {
      setStreak(0); // 실패 시 연속 수확 초기화
      const nextFail = failCount + 1;
      setFailCount(nextFail);
      
      // 앞에 실패(false)를 추가하고 최대 7개 유지
      setGrassHistory([false, ...grassHistory.slice(0, 6)]);

      if (nextFail >= 3) {
        setIsWithered(true);
        setRandomMessage(
          comfortMessages[Math.floor(Math.random() * comfortMessages.length)],
        );
        setCurrentMission(
          recoveryMissions[Math.floor(Math.random() * recoveryMissions.length)],
        );
        setCurrentScreen("RECOVERY");
      } else {
        alert(`${nextFail}번 실패했습니다. 3번 연속 실패 시 농장이 시들어요!`);
        setCurrentScreen("HOME");
      }
    }
  };

  return (
    <div
      style={{
        maxWidth: "360px",
        margin: "0 auto",
        minHeight: "100vh",
        background: isWithered ? "#F0F0F5" : "#F8F9FA",
        padding: "20px",
        transition: "all 0.5s",
      }}
    >
      {/* 홈 화면 */}
      {currentScreen === "HOME" && (
        <div>
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <h1 style={{ fontSize: "22px", fontWeight: "bold" }}>작심농장</h1>
            <p
              style={{
                fontSize: "13px",
                color: isWithered ? "#FF6B6B" : "#5C5CFF",
                fontWeight: "bold",
                marginTop: "5px",
              }}
            >
              {isWithered
                ? "🥀 농장이 잠시 쉬고 있어요"
                : `🔥 성실하게 가꾸는 중!`}
            </p>
          </div>

          <div
            style={{ fontSize: "64px", textAlign: "center", margin: "30px 0" }}
          >
            {isWithered ? "🥀" : "🌱"}
          </div>

          {/* 🛠️ 대시보드 내 잔디 그리드 영역 (기존의 renderGrid 기능 대체) */}
          <div style={{ background: "#FFF", padding: "20px", borderRadius: "24px", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "12px", textAlign: "center" }}>
              {isWithered ? "잔디가 시들고 있어요" : `연속 수확 ${streak}회차`}
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "8px",
              }}
            >
              {grassHistory.map((status, i) => (
                <div
                  key={i}
                  style={{
                    aspectRatio: "1",
                    borderRadius: "8px",
                    //
