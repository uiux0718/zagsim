// --- 수정된 Script 부분 ---
const STORAGE_KEY = "JAKSIM_DATA";

// 데이터 불러오기 또는 초기화
let userData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
    streak: 0,
    bestStreak: 0,
    failCount: 0,
    totalReports: 0,
    isCorrupted: false,
};

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
}

function nav(id, el) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    const target = document.getElementById(id);
    target.classList.add("active");
    
    // 화면 전환 시 최상단 이동
    target.scrollTop = 0;

    const tabs = document.getElementById("bottom-tabs");
    if (["v-main", "v-mypage"].includes(id)) tabs.style.display = "flex";
    else tabs.style.display = "none";

    if (el && el.classList.contains("tab-item")) {
        document.querySelectorAll(".tab-item").forEach((t) => t.classList.remove("active"));
        el.classList.add("active");
    }
    updateUI();
}

function saveRecord() {
    const input = document.getElementById("report-input");
    if (!input.value.trim()) return alert("요원, 보고 내용을 누락했습니다.");

    userData.streak++;
    userData.totalReports++;
    if (userData.streak > userData.bestStreak) userData.bestStreak = userData.streak;
    userData.isCorrupted = false;

    saveData(); // 데이터 저장
    input.value = "";
    showPush(`보고 승인. ${userData.streak}일 연속 임무 수행 중.`);
    nav("v-main");
}

function triggerFailure() {
    // 냉정한 논리에 근거한 확인 절차 추가
    if (!confirm("정말로 임무를 포기하시겠습니까? 모든 스트릭이 파괴됩니다.")) return;

    userData.streak = 0;
    userData.failCount++;
    userData.isCorrupted = true;
    
    saveData(); // 데이터 저장
    showPush("경고! 시스템 오염 발생. 생체 신호 불안정.");
    nav("v-mypage");
}

// 페이지 로드 시 UI 업데이트
window.onload = updateUI;
