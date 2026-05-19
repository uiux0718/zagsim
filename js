/* ==========================================================================
   1. 문서 로드 완료 후 실행할 스크립트 (DOM 이벤트 바인딩 및 옵저버)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  // 1-1. 카드 스르륵 나타나는 애니메이션 (기존 기능 유지)
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.1 },
  );

  document.querySelectorAll(".work-item, .small-card").forEach((item) => {
    if (item) fadeObserver.observe(item);
  });

  // 1-2. 스크롤 위치에 따른 네비게이션 메뉴 활성화 (.menu a 기준)
  const navItems = document.querySelectorAll('.menu a:not([href="#contact"])');
  const sections = document.querySelectorAll("#about, #works"); // 실제 HTML의 섹션 ID 매칭

  const menuObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");

          navItems.forEach((item) => {
            item.classList.remove("active");
            if (item.getAttribute("href") === `#${id}`) {
              item.classList.add("active");
            }
          });
        }
      });
    },
    {
      root: null,
      rootMargin: "-20% 0px -60% 0px", // 스크롤 시 더 안정적으로 감지되도록 보정
      threshold: 0,
    },
  );

  sections.forEach((section) => {
    if (section) menuObserver.observe(section);
  });

  // 1-3. CONTACT 버튼 클릭 시 모달 열기 이벤트 연결
  const contactBtn = document.querySelector('.menu a[href="#contact"]');
  if (contactBtn) {
    contactBtn.addEventListener("click", openContactModal);
  }
});

/* ==========================================================================
   2. CONTACT 모달 제어 함수 (글로벌 스코프 정의)
   ========================================================================== */
// 모달 열기
function openContactModal(event) {
  if (event) event.preventDefault(); // href="#" 스크롤 튀는 현상 방지
  const modal = document.getElementById("contactModal");
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden"; // 모달 뒤 본문 스크롤 잠금
  }
}

// 모달 닫기
function closeContactModal() {
  const modal = document.getElementById("contactModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto"; // 본문 스크롤 복원
  }
}

// 모달 바깥 딤(dim) 배경 클릭 시 닫기
function closeContactModalOutside(event) {
  const modal = document.getElementById("contactModal");
  if (modal && event.target === modal) {
    closeContactModal();
  }
}
function renderGrid(isWithered = false) {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  for (let i = 0; i < 7; i++) {
    const cell = document.createElement("div");
    const isActive = i < state.streak % 8;

    // 기본 스타일링
    cell.style.cssText = `aspect-ratio: 1; border-radius: 8px; transition: all 0.5s ease;`;

    if (isActive) {
      if (isWithered) {
        cell.classList.add("withered"); // 시든 상태 클래스 추가
      } else {
        cell.style.background = "var(--grass)";
        cell.style.boxShadow = "0 4px 10px rgba(76, 217, 100, 0.3)";
      }
    } else {
      cell.style.background = "#ffffff";
    }
    grid.appendChild(cell);
  }

  // 텍스트 로직: 죄책감 부여가 아닌 '상황 진단'과 '해결책' 제시
  const streakTxt = document.getElementById("streak-txt");
  if (isWithered) {
    streakTxt.innerHTML = `<span style="color: #FF6B6B;">농장이 목말라하고 있어요!</span><br>
                           <span style="font-size:14px; font-weight:500; color:var(--gray);">오늘 기록하면 다시 파라질 거예요.</span>`;
  } else {
    streakTxt.innerText = `연속 수확 ${state.streak}회차`;
  }
}
function renderGrid(isWithered = false) {
  const grid = document.getElementById("grid");
  const streakTxt = document.getElementById("streak-txt");
  grid.innerHTML = "";

  for (let i = 0; i < 7; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";

    // 현재 연속 횟수에 해당하는 잔디들
    const isActive = i < state.streak % 8;

    if (isActive) {
      if (isWithered) {
        cell.classList.add("withered");
      } else {
        cell.classList.add("active");
      }
    }
    grid.appendChild(cell);
  }

  // 재진입 UX: 사용자의 감정을 배려한 텍스트 설계
  if (isWithered) {
    streakTxt.innerHTML = `
      <span style="color: #FF6B6B;">농장이 비를 기다리고 있어요</span>
      <p style="font-size: 13px; font-weight: 500; color: var(--gray); margin-top:4px;">
        지금 기록하면 다시 파라질 거예요!
      </p>`;
  } else {
    streakTxt.innerHTML = `연속 수확 ${state.streak}회차`;
  }
}
