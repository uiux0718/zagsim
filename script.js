import React, { useState } from "react";
// 작성하신 CSS 파일명이 'zagsim_style.css'라고 가정하고 임포트합니다.
import "./zagsim_style.css"; 

export default function NotificationSettings() {
  // 1. 각 알림별 On/Off 상태 정의 (기본값 설정)
  const [remindNoti, setRemindNoti] = useState(false);   // 수확 리마인드 알림 (기본 꺼짐)
  const [penaltyNoti, setPenaltyNoti] = useState(true);  // 농장 시듦 주의 알림 (기본 켜짐)

  // 2. 상태 변경 토글 핸들러 함수
  const handleToggleRemind = () => setRemindNoti((prev) => !prev);
  const handleTogglePenalty = () => setPenaltyNoti((prev) => !prev);

  return (
    <div
      style={{
        maxWidth: "360px",
        margin: "0 auto",
        padding: "20px",
        background: "#ffffff",
      }}
    >
      {/* 알림 화면 컨테이너 영역 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        
        {/* 카드 1: 수확 리마인드 알림 */}
        <div className="noti-card">
          <div>
            <h4>수확 리마인드 알림</h4>
            <p>매일 저녁 잔디를 심을 수 있도록 리마인드해 드려요.</p>
          </div>
          {/* 리액트 상태(remindNoti)가 true일 때만 'on' 클래스가 동적으로 붙습니다 */}
          <div
            className={`toggle ${remindNoti ? "on" : ""}`}
            onClick={handleToggleRemind}
          >
            <div className="toggle-handle" />
          </div>
        </div>

        {/* 카드 2: 농장 시듦 주의 알림 */}
        <div className="noti-card">
          <div>
            <h4>농장 시듦 주의 알림</h4>
            <p>3회 연속 실패로 농장이 시들기 직전에 경고를 보내요.</p>
          </div>
          {/* 리액트 상태(penaltyNoti)가 true일 때만 'on' 클래스가 동적으로 붙습니다 */}
          <div
            className={`toggle ${penaltyNoti ? "on" : ""}`}
            onClick={handleTogglePenalty}
          >
            <div className="toggle-handle" />
          </div>
        </div>

      </div>
    </div>
  );
}
