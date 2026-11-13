const crops = [
  { name: '해바라기', icon: '🌻', hue: 'gold' },
  { name: '분홍 데이지', icon: '🌸', hue: 'pink' },
  { name: '초록 완두', icon: '🫛', hue: 'mint' }
];
const storageKey = 'jaksim-farm-v1';
const app = document.querySelector('#app');
const feedback = document.querySelector('#farm-status');
let goals = [];
try {
  goals = JSON.parse(localStorage.getItem(storageKey)) || [];
  if (!Array.isArray(goals)) goals = [];
} catch {}
let goal;
let screen = goals.length ? 'choose' : 'new';
let celebration = '';

function dateKey(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map(value => String(value).padStart(2, '0')).join('-');
}

function streakFor(item) {
  let offset = item.days.includes(dateKey()) ? 0 : -1;
  const last = offset;
  while (item.days.includes(dateKey(offset))) offset--;
  return last - offset;
}

function save(next) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(next));
    goals = next;
    return true;
  } catch {
    feedback.textContent = '기록을 저장할 수 없어요. 브라우저 저장 공간을 확인한 뒤 다시 시도해 주세요.';
    return false;
  }
}

const escapeHtml = value => value.replace(/[&<>"']/g, char =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

function garden(stage, animated = false) {
  return `<div class="garden ${crops[goal?.crop]?.hue || 'gold'} stage-${stage} ${animated ? 'animated ' + animated : ''}" aria-hidden="true">
    <div class="sun"></div><div class="hill"></div><div class="hill second"></div>
    <div class="plant"><div class="stem"></div><i class="leaf left"></i><i class="leaf right"></i><i class="leaf top"></i>
    <div class="flower">${Array.from({length:12}, (_,i)=>`<i style="--r:${i*30}deg"></i>`).join('')}<b></b></div></div>
    <div class="soil"></div><div class="seed"></div><div class="waterfall"></div>
    ${Array.from({length:20},(_,i)=>`<i class="spark" style="--x:${8+(i*29)%84}%;--y:${9+(i*17)%67}%;--delay:${(i%8)*0.09}s;--rise:${30+(i%5)*14}px;--turn:${i*37}deg"></i>`).join('')}
  </div>`;
}

function render() {
  const streak = goal ? streakFor(goal) : 0;
  const stage = streak >= 3 ? 'bloom' : streak === 2 ? 'leaves' : streak === 1 ? 'sprout' : 'seed';
  const recorded = goal?.days.includes(dateKey());
  let panel;
  if (screen === 'new') {
    panel = `<h1>${goals.length ? '새 씨앗을 심어요' : '첫 씨앗을 심어요'}</h1><p>매일 하고 싶은 습관을 정해 주세요. 3일 연속 실천하면 작물이 활짝 자라요.</p>
      <form id="plant-form"><label>습관 이름<input name="name" required maxlength="60" placeholder="예: 독서 10분"></label>
      <fieldset><legend>심을 작물</legend><div class="crop-options">${crops.map((crop, index) =>
        `<label><input type="radio" name="crop" value="${index}" ${index === 0 ? 'checked' : ''}><span>${crop.icon} ${crop.name}</span></label>`).join('')}</div></fieldset>
      <button class="primary">씨앗 심기</button></form>
      ${goals.length ? '<button class="back" data-action="choose">농장으로 돌아가기</button>' : ''}`;
  } else if (screen === 'choose') {
    panel = `<h1>내 작심농장</h1><p>습관을 골라 오늘의 실천을 기록해 보세요.</p><div class="options">${goals.map(item =>
      `<button class="option" data-goal="${item.id}"><span aria-hidden="true">${crops[item.crop].icon}</span><span><strong>${escapeHtml(item.name)}</strong><small>${streakFor(item)}일 연속 · ${item.harvests}회 수확</small></span><span aria-hidden="true">↗</span></button>`).join('')}</div>
      <button class="primary" data-action="new">＋ 새 씨앗 심기</button>`;
  } else {
    const crop = crops[goal.crop];
    const title = celebration === 'bloom' ? '3일 연속 성공!' : celebration === 'water' ? '오늘도 한 뼘 자랐어요!' : escapeHtml(goal.name);
    const message = celebration === 'bloom' ? `${crop.name}이 활짝 자라 수확했어요!` :
      recorded ? '오늘의 실천을 기록했어요. 내일 다시 물을 주세요.' :
      streak ? '오늘도 실천을 마쳤다면 물을 주세요.' : '오늘의 실천부터 시작해 보세요. 수확 기록은 농장에 남아요.';
    panel = `<p class="eyebrow">${crop.name} · 누적 수확 ${goal.harvests}회</p><h1>${title}</h1><p>${message}</p>
      <div class="streak" aria-label="연속 실천 ${streak}일">${[1, 2, 3].map(n =>
        `<span class="${n <= streak ? 'filled' : ''}">${n}일${n <= streak ? ' ✓' : ''}</span>`).join('')}</div>
      <button class="primary" data-action="record" ${recorded ? 'disabled' : ''}>${recorded ? '오늘 물 주기 완료' : '💧 실천 완료 · 물 주기'}</button>
      <button class="back" data-action="choose">농장 둘러보기</button>`;
  }
  app.innerHTML = `<section class="layout">${garden(screen === 'farm' ? stage : 'bloom', celebration)}<div class="panel">${panel}</div></section>`;
  const title = app.querySelector('h1');
  title.tabIndex = -1;
  return title;
}

app.addEventListener('submit', event => {
  if (event.target.id !== 'plant-form') return;
  event.preventDefault();
  const fields = new FormData(event.target);
  const name = fields.get('name').trim();
  if (!name) {
    feedback.textContent = '습관 이름을 입력해 주세요.';
    return;
  }
  const item = { id: crypto.randomUUID?.() || String(Date.now()), name, crop: Number(fields.get('crop')), days: [], harvests: 0 };
  if (!save([...goals, item])) return;
  goal = item;
  screen = 'farm';
  feedback.textContent = '씨앗을 심었어요.';
  render().focus();
});

document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  celebration = '';
  if (button.dataset.goal) {
    goal = goals.find(item => item.id === button.dataset.goal);
    screen = 'farm';
  } else if (button.dataset.action === 'record' && screen === 'farm') {
    const today = dateKey();
    if (goal.days.includes(today)) return;
    const updated = { ...goal, days: [...goal.days, today] };
    const streak = streakFor(updated);
    if (streak === 3) updated.harvests++;
    if (!save(goals.map(item => item.id === updated.id ? updated : item))) return;
    goal = updated;
    celebration = streak === 3 ? 'bloom' : 'water';
    feedback.textContent = streak === 3 ? '3일 연속 성공! 작물을 수확했어요.' : '오늘의 실천을 기록했어요.';
  } else if (button.dataset.action === 'choose' || button.dataset.action === 'new') {
    goal = undefined;
    screen = button.dataset.action === 'new' || !goals.length ? 'new' : 'choose';
  } else return;
  render().focus();
});

let shownDate = dateKey();
function refreshDay() {
  if (dateKey() === shownDate || screen === 'new') return;
  shownDate = dateKey();
  celebration = '';
  render();
}
document.addEventListener('visibilitychange', refreshDay);
setInterval(refreshDay, 30000);
render();
