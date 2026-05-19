import React, { useState } from "react";

export default function AdvancedZagsimFarm() {
  // --- 상태 관리 ---
  const [currentScreen, setCurrentScreen] = useState("HOME"); // HOME, ADD, RECOVERY, SIGNUP
  
  // ... 기존 기획 데이터 및 handleRecord 로직 생략 ...

  return (
    <div style={{ maxWidth: "360px", margin: "0 auto", minHeight: "100vh", padding: "20px" }}>
      
      {/* 1. 홈 화면 */}
      {currentScreen === "HOME" && (
        <div>
          {/* ... 기존 홈 화면 UI ... */}
          
          {/* 하단에 회원가입 버튼이 배치된다는 가정 */}
          <button
            onClick={() => setCurrentScreen("SIGNUP")} /* 클릭 시 SIGNUP 화면으로 상태 전환 */
            style={{
              width: "100%",
              padding: "16px",
              background: "#1c1c1e",
              color: "#FFF",
              border: "none",
              borderRadius: "12px",
              fontWeight: "bold",
              marginTop: "12px",
              cursor: "pointer"
            }}
          >
            처음이신가요? 회원가입하기
          </button>
        </div>
      )}

      {/* 2. 기록 추가 화면 */}
      {currentScreen === "ADD" && (
        <div>{/* 기존 기록 추가 UI */}</div>
      )}

      {/* 3. 회복 UX 화면 */}
      {currentScreen === "RECOVERY" && (
        <div>{/* 기존 회복 UI */}</div>
      )}

      {/* 🚨 4. 회원가입 화면 (새로 추가되어야 하는 영역) */}
      {currentScreen === "SIGNUP" && (
        <div style={{ paddingTop: "40px" }}>
          <div style={{ background: "#FFF", padding: "25px", borderRadius: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "20px" }}>회원가입</h3>
            
            {/* 임시 폼 요소 예시 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input type="text" placeholder="아이디" style={{ padding: "12px", borderRadius: "8px", border: "1px solid #E5E5EA" }} />
              <input type="password" placeholder="비밀번호" style={{ padding: "12px", borderRadius: "8px", border: "1px solid #E5E5EA" }} />
              
              <button
                onClick={() => {
                  alert("회원가입이 완료되었습니다!");
                  setCurrentScreen("HOME"); // 가입 완료 후 홈으로 이동
                }}
                style={{ padding: "16px", background: "#7c6dff", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "bold" }}
              >
                가입 완료
              </button>
              
              <button
                onClick={() => setCurrentScreen("HOME")} // 취소 시 홈으로 이동
                style={{ padding: "12px", background: "none", color: "#8e8e93", border: "none" }}
              >
                취소하고 돌아가기
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
