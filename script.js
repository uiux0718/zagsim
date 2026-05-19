import React, { useState } from 'react';

export default function AdvancedZagsimFarm() {
  // --- 1. 기획 데이터 ---
  const comfortMessages = [
    "완벽하지 않아도 괜찮아요. 멈추지 않는 게 중요하니까요. ☕",
    "오늘 하루 바쁘셨죠? 시든 잎은 다시 가꾸면 그만이에요. 조급해하지 말아요.",
    "작심삼일은 새로운 작심을 시작할 수 있는 타이밍이라는 뜻이에요! 🌱",
    "지친 나를 위해 숨 한 번 크게 쉬고, 다시 한 걸음만 내딛어 볼까요? ✨"
  ];

  const recoveryMissions = [
    { id: 'water', text: '💧 시원한 물 한 잔 마시고 오기', icon: '🥛' },
    { id: 'walk', text: '🏃‍♂️ 1분 동안 가볍게 제자리 산책하기', icon: '👟' },
    { id: 'breathe', text: '🧘‍♂️ 5초간 깊게 심호흡 3번 하기', icon: '🌬️' }
  ];

  // --- 2. 상태 관리 ---
  const [currentScreen, setCurrentScreen] = useState('HOME');
  const [failCount, setFailCount] = useState(0);
  const [isWithered, setIsWithered] = useState(false);
  const [randomMessage, setRandomMessage] = useState('');
  const [currentMission, setCurrentMission] = useState(recoveryMissions[0]);
  const [grassHistory, setGrassHistory] = useState([true, true, true, true, true]);

  // --- 3. 핵심 로직 ---
  const handleRecord = (isSuccess) => {
    if (isSuccess) {
      setFailCount(0);
      setIsWithered(false);
      setGrassHistory([true, ...grassHistory.slice(0, 4)]);
      setCurrentScreen('HOME');
    } else {
      const nextFail = failCount + 1;
      setFailCount(nextFail);
      setGrassHistory([false, ...grassHistory.slice(0, 4)]);

      if (nextFail >= 3) {
        setIsWithered(true);
        // 랜덤 위로 문구 및 회복 미션 세팅
        setRandomMessage(comfortMessages[Math.floor(Math.random() * comfortMessages.length)]);
        setCurrentMission(recoveryMissions[Math.floor(Math.random() * recoveryMissions.length)]);
        setCurrentScreen('RECOVERY'); 
      } else {
        alert(`${nextFail}번 실패했습니다. 3번 연속 실패 시 농장이 시들어요!`);
        setCurrentScreen('HOME');
      }
    }
  };

  return (
    <div style={{ maxWidth: '360px', margin: '0 auto', minHeight: '100vh', background: isWithered ? '#F0F0F5' : '#F8F9FA', padding: '20px', transition: 'all 0.5s' }}>
      
      {/* 홈 화면 */}
      {currentScreen === 'HOME' && (
        <div>
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold' }}>작심농장</h1>
            <p style={{ fontSize: '13px', color: isWithered ? '#FF6B6B' : '#5C5CFF', fontWeight: 'bold', marginTop: '5px' }}>
              {isWithered ? "🥀 농장이 잠시 쉬고 있어요" : `🔥 성실하게 가꾸는 중!`}
            </p>
          </div>

          <div style={{ fontSize: '64px', textAlign: 'center', margin: '30px 0' }}>{isWithered ? '🥀' : '🌱'}</div>

          <div style={{ display: 'flex', gap: '8px', background: '#FFF', padding: '15px', borderRadius: '16px', marginBottom: '20px' }}>
            {grassHistory.map((status, i) => (
              <div key={i} style={{ flex: 1, height: '25px', borderRadius: '6px', background: status ? '#5C5CFF' : '#D1D1D1' }} />
            ))}
          </div>

          <button onClick={() => setCurrentScreen('ADD')} style={{ width: '100%', padding: '16px', background: '#5C5CFF', color: '#FFF', border: 'none', borderRadius: '12px', fontWeight: 'bold' }}>
            오늘의 습관 기록하기
          </button>
        </div>
      )}

      {/* 기록 추가 화면 */}
      {currentScreen === 'ADD' && (
        <div style={{ paddingTop: '40px' }}>
          <div style={{ background: '#FFF', padding: '25px', borderRadius: '24px' }}>
            <h3>오늘의 기록</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
              <button onClick={() => handleRecord(true)} style={{ padding: '16px', background: '#5C5CFF', color: '#fff', border: 'none', borderRadius: '12px' }}>성공 완료! 🎉</button>
              <button onClick={() => handleRecord(false)} style={{ padding: '16px', background: '#F5F5F5', color: '#333', border: 'none', borderRadius: '12px' }}>아쉽게 실패.. 😢</button>
            </div>
          </div>
        </div>
      )}

      {/* 🚨 회복 UX 화면 */}
      {currentScreen === 'RECOVERY' && (
        <div style={{ paddingTop: '20px' }}>
          <div style={{ background: '#FFF', padding: '25px', borderRadius: '24px', border: '2px solid #5C5CFF', textAlign: 'center' }}>
            <div style={{ fontSize: '40px' }}>{currentMission.icon}</div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '10px 0' }}>농장 심폐소생 중..</h2>
            
            <p style={{ fontSize: '13px', color: '#666', background: '#F8F9FA', padding: '12px', borderRadius: '10px' }}>
              {randomMessage}
            </p>

            <div style={{ margin: '20px 0', padding: '15px', border: '1px dashed #5C5CFF', borderRadius: '12px', background: '#F5F5FF' }}>
              <span style={{ fontSize: '11px', color: '#5C5CFF', fontWeight: 'bold' }}>오늘의 회복 미션</span>
              <div style={{ fontWeight: 'bold', fontSize: '15px', marginTop: '5px' }}>{currentMission.text}</div>
            </div>

            <button onClick={() => {
              setFailCount(0);
              setIsWithered(false);
              setCurrentScreen('HOME');
            }} style={{ width: '100%', padding: '16px', background: '#5C5CFF', color: '#FFF', border: 'none', borderRadius: '12px', fontWeight: 'bold' }}>
              미션 완료하고 농장 살리기 💧
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
