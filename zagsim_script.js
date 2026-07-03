

// 1. 상태 객체 정의
let state = JSON.parse(localStorage.getItem('zagsim_farm_state')) || {
  total: 0,
  lands: 1,
  streak: 0,
  history: [],
  lastHarvest: new Date().toISOString(),
  notiRemind: true,
  notiPenalty: true,
};

function getLastHarvestDate() {
  return new Date(state.lastHarvest);
}

function saveState() {
  localStorage.setItem('zagsim_farm_state', JSON.stringify(state));
}

// ... (기존에 작성했던 go, harvest, renderGrid 등 모든 함수 코드 포함) ...

// 첫 구동 시 격자 로드
checkSystem();
