import React, { useState } from "react";
import "./zagsim_style.css"; 

export default function NotificationSettings() {
  // 데이터 기반 구조 체계화: 알림 목록을 설정 배열로 분리 (향후 API 연동 용이)
  const [notiSettings, setNotiSettings] = useState({
    remind: false, // 수확 리마인드 알림
    penalty: true, // 농장 시듦 주의 알림
  });

  // 단일 통합 핸들러 함수로 모든 토글 제어 (확장성 확보)
  const handleToggleNoti = (type) => {
    setNotiSettings((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  // UI 렌더링 최적화를 위한 설정 데이터 맵
  const configList = [
    {
      id: "remind",
      title: "수확 리마인드 알림",
      desc: "매일 저녁 잔디를 심을 수 있도록 리마인드해 드려요.",
    },
    {
      id: "penalty",
      title: "농장 시듦 주의 알림",
      desc: "3회 연속 실패로 농장이 시들기 직전에 경고를 보내요.",
    },
  ];

  return (
    <div
      style={{
        maxWidth: "360px",
        margin: "0 auto",
        padding: "20px",
        background: "#ffffff",
        userSelect: "none", // 고속 터치 시 텍스트 블록 지정 방지 방어 코드
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        
        {configList.map((item) => {
          const isCurrentOn = notiSettings[item.id];
          
          return (
            <div className="noti-card" key={item.id}>
              <div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
              
              {/* 웹 표준 접근성 지침(WAI-ARIA) 만족 스펙 적용 */}
              <div
                className={`toggle ${isCurrentOn ? "on" : ""}`}
                onClick={() => handleToggleNoti(item.id)}
                role="switch"
                aria-checked={isCurrentOn}
                tabIndex={0} // 키보드 포커싱 진입 허용
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    handleToggleNoti(item.id);
                  }
                }}
              >
                <div className="toggle-handle" />
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}
