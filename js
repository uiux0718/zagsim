// 기존 renderGrass 내부 로직 수정
function getStreak(data) {
  let streak = 0;
  // 배열의 끝(오늘)부터 역순으로 확인
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i]) streak++;
    else break; // 중간에 실패가 있으면 멈춤
  }
  return streak;
}

// renderGrass 함수 내 적용
const currentStreak = getStreak(habitData);
document.getElementById("streak-count").innerText = `${currentStreak}일째`;
// 28일치 빈 데이터 생성 (실제 앱이라면 날짜 키값을 사용하는 것이 안전함)
if (!localStorage.getItem("habit_records")) {
  const initialData = Array.from({ length: 28 }, () => false);
  localStorage.setItem("habit_records", JSON.stringify(initialData));
  habitData = initialData;
}
function renderDashboard() {
  const grid = document.getElementById("grass-grid");
  grid.innerHTML = "";

  habitData.forEach((level, index) => {
    const cell = document.createElement("div");
    cell.className = "cell";

    if (level > 0) {
      cell.classList.add("active-grass");
      cell.style.backgroundColor = "var(--p)";
      cell.style.opacity = level * 0.25;

      // 순차적 등장 효과: 인덱스에 따라 지연 시간 부여
      cell.style.animationDelay = `${index * 0.02}s`;

      if (isDeserted) cell.classList.add("penalty");
    }
    grid.appendChild(cell);
  });
}
