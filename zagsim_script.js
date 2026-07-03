// ==========================================
// 작심농장 핵심 비즈니스 로직 및 UX 시스템
// ==========================================

// 1. 상태 객체 초기화 (LocalStorage 연동)
let state = JSON.parse(localStorage.getItem('zagsim_farm_state')) || {
  total: 0,          // 총 수확 횟수
  lands: 1,          // 보유 중인 토지 수
  streak: 0,         // 현재 연속 수확 회차 (잔디 개수)
  history: [],       // 수확 타임라인 기록
  lastHarvest: new Date().toISOString(), // 마지막 수확 시간
  notiRemind: true,  // 수확 리마인더 토글 상태
  notiPenalty: true, // 패널티 경고 토글 상태
};

// 헬퍼 함수: 마지막 수확일을 Date 객체로 반환
function getLastHarvestDate() {
  return new Date(state.lastHarvest);
}

// 헬퍼 함수: 현재 상태를 로컬 스토리지에 저장
function saveState() {
  localStorage.setItem('zagsim_farm_state', JSON.stringify(state));
}

// 2. 화면 이동 제어 함수
function go(id) {
  if (id === 's-home' && document.getElementById('s-login').classList.contains('active')) {
    const email = document.querySelector('#s-login input[type="email"]').value;
    if (!email.includes('@')) {
      showToast("올바른 이메일 형식을 입력해주세요.");
      return;
    }
  }

  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  const isAuth = id === "s-login" || id === "s-join";
  document.getElementById("main-nav").style.display = isAuth ? "none" : "flex";

  const navItems = document.querySelectorAll(".nav-item");
  if (id === "s-home") {
    navItems[0].classList.add("active");
    navItems[1].classList.remove("active");
    navItems[0].querySelector(".nav-dot").style.opacity = 1;
    navItems[1].querySelector(".nav-dot").style.opacity = 0;
    checkSystem(); // 홈 화면 진입 시 시스템 상태 체크 및 알림 트리거
  } else if (id === "s-mypage") {
    navItems[1].classList.add("active");
    navItems[0].classList.remove("active");
    navItems[1].querySelector(".nav-dot").style.opacity = 1;
    navItems[0].querySelector(".nav-dot").style.opacity = 0;
    renderMypage();
  } else if (id === "s-noti") {
    renderNotiToggleUI();
  }
}

// 3. 커스텀 습관 카드 생성 함수
function createNewHabit() {
  const input = document.getElementById("habit-input");
  const name = input.value.trim();
  if (!name) return;

  const container = document.getElementById("habit-container");
  const card = document.createElement("div");
  card.className = "habit-card";
  card.onclick = () => harvest(name);
  card.innerHTML = `<div class="habit-icon-box"><div class="habit-dot"></div></div><p class="habit-name">${name}</p>`;

  container.appendChild(card);
  input.value = "";
  closeAddModal();
  showToast("기록 카드가 추가되었습니다. 🃏");
}

// 4. [기능 구현] 습관 수확 처리 함수 (성공 주기 및 토지 보상)
function harvest(name) {
  const now = new Date();
  const hoursSinceLastHarvest = (now - getLastHarvestDate()) / (1000 * 60 * 60);
  
  // [룰 변형 및 복구 로직] 3일(72시간) 이상 지나 시들어있던 상태였다면?
  // 완벽주의자의 자괴감을 깨고 "새로운 시작"을 부드럽게 연결
  if (hoursSinceLastHarvest >= 72) {
    state.streak = 0; // 시든 상태에서 물을 주면 0부터 다시 파릇파릇하게 시작
    showToast("💧 시든 잔디에 물을 주어 다시 살려냈습니다!");
  }

  // 1) 매일 기록하면 잔디가 한 칸씩 자라남
  state.total++;
  state.streak++;
  state.lastHarvest = now.toISOString();
  
  // 2) 30회 수확마다 새로운 토지를 보상받음
  let isLandExpanded = false;
  if (state.total > 0 && state.total % 30 === 0) {
    state.lands++;
    isLandExpanded = true;
  }

  // 타임라인 데이터 포맷팅
  const logHours = String(now.getHours()).padStart(2, '0');
  const logMinutes = String(now.getMinutes()).padStart(2, '0');
  state.history.unshift({
    name,
    time: `${now.getMonth() + 1}월 ${now.getDate()}일 ${logHours}:${logMinutes}`,
  });
  
  saveState();
  checkSystem(); // 그리드 리렌더링 및 상태 최신화

  // 애니메이션 트리거: 방금 자란 잔디 세포에 팝핑 효과 부여
  let activeCount = state.streak % 7;
  if (state.streak > 0 && activeCount === 0) activeCount = 7;
  const cells = document.querySelectorAll("#grid > div");
  if(cells[activeCount - 1]) {
    cells[activeCount - 1].classList.add("cell-grow");
  }

  // 토지 보상 달성 시 대시보드 확장 애니메이션 실행
  if (isLandExpanded) {
    const dashboard = document.querySelector(".dashboard-card");
    dashboard.classList.add("dashboard-expand");
    setTimeout(() => {
      dashboard.classList.remove("dashboard-expand");
      alert(`🎉 대단해요! 30회 수확을 달성하여 새로운 토지(${state.lands}호 차)를 개간했습니다!`);
    }, 800);
  } else {
    showToast(`${name} 수확 완료! 🌿`);
  }
}

// 5. [기능 구현] 시스템 시간 체크 및 시뮬레이션 알림(푸시) 트리거
function checkSystem() {
  const now = new Date();
  const hoursSinceLastHarvest = (now - getLastHarvestDate()) / (1000 * 60 * 60);
  
  // 3일(72시간) 이상 미수확 시 잔디 시듦 여부 판정
  const isWithered = hoursSinceLastHarvest >= 72;
  
  // 그리드 화면 리렌더링
  renderGrid(isWithered);

  // [푸시 알림 구현] 실제 앱 환경의 푸시 알림을 브라우저 토스트/인앱 메시지로 정교하게 시뮬레이션
  setTimeout(() => {
    // 1) 패널티 경고: 3일간 미수확 시 경고 알림 (토글이 켜져있을 때만)
    if (isWithered && state.notiPenalty) {
      showToast("🚨 [패널티 경고] 3일간 수확이 없어 잔디가 시들고 있어요! 물을 주세요!");
      return;
    }
    
    // 2) 수확 리마인더: 24시간 동안 수확이 없을 때 매일 잊지 않도록 푸시 (토글이 켜져있을 때만)
    if (hoursSinceLastHarvest >= 24 && hoursSinceLastHarvest < 72 && state.notiRemind) {
      showToast("⏰ [수확 리마인더] 오늘 아직 수확하지 않았어요! 오늘의 잔디를 심어보세요.");
    }
  }, 1000);
}

// 6. 메인 대시보드 잔디 격자 렌더링 함수
function renderGrid(isWithered = false) {
  const grid = document.getElementById("grid");
  if (!grid) return;
  grid.innerHTML = "";
  
  let activeCount = state.streak % 7;
  if (state.streak > 0 && activeCount === 0) {
    activeCount = 7; 
  }

  for (let i = 0; i < 7; i++) {
    const cell = document.createElement("div");
    const isActive = i < activeCount;
    
    // 반응형 스퀘어 격자 스타일 빌딩
    cell.style.cssText = `
      aspect-ratio: 1; 
      border-radius: 10px; 
      background: ${isActive ? (isWithered ? "var(--withered)" : "var(--grass)") : "#ffffff"}; 
      border: 1.5px solid var(--light-gray);
      transition: background 0.3s ease, transform 0.2s ease;
    `;

    // 3일 주기(3번째 칸), 6일 주기(6번째 칸), 완공(7번째 칸)에 감성적 후광 효과 바인딩
    if (isActive && !isWithered && (i === 2 || i === 5 || i === 6)) {
      cell.classList.add("milestone-glow");
    }

    grid.appendChild(cell);
  }
  
  // 상단 헤더 텍스트 변경을 통한 심리적 압박 완화 코드
  document.getElementById("streak-txt").innerText = isWithered
    ? "잠시 잔디가 시든 상태예요 💧"
    : `연속 수확 ${state.streak}회차`;
  document.getElementById("val-land-home").innerText = `관리 중인 토지 ${state.lands}`;
}

// 7. 마이페이지 정보 갱신 함수
function renderMypage() {
  document.getElementById("val-total").innerText = state.total;
  document.getElementById("val-land").innerText = state.lands;
  const list = document.getElementById("history-list");
  list.innerHTML =
    state.history
      .map(
        (h) => `
      <div style="background:var(--light-gray); padding:20px; border-radius:20px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; animation: slideUp 0.3s ease-out;">
          <span style="font-weight:800; font-size:15px;">${h.name}</span>
          <span style="font-size:12px; color:var(--gray); font-weight:600;">${h.time}</span>
      </div>
  `,
      )
      .join("") ||
    '<p style="text-align:center; color:var(--gray); margin-top:40px; font-weight:600;">아직 수확 기록이 없습니다.</p>';
}

// 8. 알림 설정 토글 동기화 UI 제어 함수
function renderNotiToggleUI() {
  const remindToggle = document.getElementById("t-remind");
  const penaltyToggle = document.getElementById("t-penalty");

  if (state.notiRemind) remindToggle.classList.add("on");
  else remindToggle.classList.remove("on");

  if (state.notiPenalty) penaltyToggle.classList.add("on");
  else penaltyToggle.classList.remove("on");
}

function toggleNoti(type) {
  const target = type === "remind" ? "notiRemind" : "notiPenalty";
  state[target] = !state[target];
  document.getElementById(`t-${type}`).classList.toggle("on");
  saveState();
  
  const statusTxt = state[target] ? "켜졌습니다" : "꺼졌습니다";
  showToast(`${type === 'remind' ? '수확 리마인더' : '패널티 경고'}가 ${statusTxt}.`);
}

// 모달 및 토스트 헬퍼 함수
function openAddModal() { document.getElementById("add-modal").style.display = "flex"; }
// 본문 입력창 비우기 포함 인터랙션
function closeAddModal() { 
  document.getElementById("add-modal").style.display = "none"; 
  document.getElementById("habit-input").value = "";
}
function openRules() { document.getElementById("rules-modal").style.display = "flex"; }
function closeRules() { document.getElementById("rules-modal").style.display = "none"; }
 
function showToast(msg) {
  const t = document.getElementById("toast");
  t.innerText = msg;
  t.style.display = "block";
  // 중복 타이머 버그 방지 처리가 포함된 2초 노출 후 클로징
  if(t.timeoutId) clearTimeout(t.timeoutId);
  t.timeoutId = setTimeout(() => (t.style.display = "none"), 2500);
}

// 최초 구동 및 상태 동기화 검사 실행
checkSystem();
