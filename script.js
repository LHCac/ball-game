// 狀態記錄
let currentStep = 1;
let selectedDepartment = "";
let selectedDoctor = "";
let selectedDate = "";
let selectedTime = "";
let visitStatus = "";

const progressEl = document.getElementById('progress');
const backBtn = document.getElementById('backBtn');
const steps = [];

// 共 7 個步驟
for (let i = 1; i <= 7; i++) {
  steps[i] = document.getElementById(`step-${i}`);
}

function goToStep(step) {
  currentStep = step;

  // 更新進度條顯示，總共 7 關
  progressEl.textContent = `${step}/7`;

  for (let i = 1; i <= 7; i++) {
    if (i === step) {
      steps[i].classList.add('active');
    } else {
      steps[i].classList.remove('active');
    }
  }

  // 第一步不顯示返回按鈕
  if (step > 1) {
    backBtn.classList.remove('hidden');
  } else {
    backBtn.classList.add('hidden');
  }

  // 回到醫師選擇頁面時，根據已選醫師狀態調整按鈕顯示與訊息
  if (step === 4) {
    if (selectedDoctor) {
      if (doctorInterval) {
        clearInterval(doctorInterval);
        doctorInterval = null;
      }

      doctorItems.forEach(item => {
        if (item.getAttribute('data-name') === selectedDoctor) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      startDoctorBtn.classList.add('hidden');
      stopDoctorBtn.classList.add('hidden');
      doctorConfirmBtn.classList.remove('hidden');
      restartDoctorBtn.classList.remove('hidden');
      doctorMsg.textContent = '您選擇了醫師：' + selectedDoctor;
    } else {
      doctorItems.forEach(item => item.classList.remove('active'));
      startDoctorBtn.classList.remove('hidden');
      stopDoctorBtn.classList.add('hidden');
      doctorConfirmBtn.classList.add('hidden');
      restartDoctorBtn.classList.add('hidden');
      doctorMsg.textContent = '';
      currentDoctorIndex = 0;

      if (doctorInterval) {
        clearInterval(doctorInterval);
        doctorInterval = null;
      }
    }
  }
}

// 返回上一頁
backBtn.addEventListener('click', () => {
  if (currentStep > 1) {
    goToStep(currentStep - 1);
  }
});

// 第 1 關
const idInput = document.getElementById('idInput');
const dobInput = document.getElementById('dobInput');
const autoFillBtn = document.getElementById('autoFillBtn');
const nextBtn1 = document.getElementById('nextBtn1');

function checkFormFilled() {
  if (idInput.value.trim() && dobInput.value.trim()) {
    nextBtn1.classList.remove('hidden');
  } else {
    nextBtn1.classList.add('hidden');
  }
}

idInput.addEventListener('input', checkFormFilled);
dobInput.addEventListener('input', checkFormFilled);

autoFillBtn.addEventListener('click', () => {
  idInput.value = 'A123456789';
  dobInput.value = '0400101';
  checkFormFilled();
});

nextBtn1.addEventListener('click', () => {
  goToStep(2);
});

// 第 1 關：拼圖拖曳組合
const puzzleSection = document.getElementById('puzzleSection');
const inputSection1 = document.getElementById('inputSection1');
const dropSlots = document.querySelectorAll('#step-1 .drop-slot');
const dragItems = document.querySelectorAll('#step-1 .drag-item');
const puzzleMsg = document.getElementById('puzzleMsg');

// 設定拖曳開始事件：將字串值存入 dataTransfer
dragItems.forEach(item => {
  item.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', item.getAttribute('data-value'));
  });
});

// 設定拖曳到目標區域的事件
dropSlots.forEach(slot => {
  slot.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  slot.addEventListener('drop', (e) => {
    e.preventDefault();

    const value = e.dataTransfer.getData('text/plain');

    if (slot.classList.contains('filled')) return;

    if (value === slot.getAttribute('data-target')) {
      slot.textContent = value;
      slot.classList.add('filled');

      const draggedEl = document.querySelector(`#step-1 .drag-item[data-value='${value}']`);

      if (draggedEl) {
        draggedEl.classList.add('hidden');
      }

      puzzleMsg.textContent = '';

      const allFilled = Array.from(dropSlots).every(s => s.classList.contains('filled'));

      if (allFilled) {
        puzzleSection.classList.add('hidden');
        inputSection1.classList.remove('hidden');
      }
    } else {
      puzzleMsg.textContent = '放錯了，請重新嘗試！';
    }
  });
});

// 第 2 關：掛號方式配對
const methodItem = document.getElementById('methodItem');
const methodDrops = document.querySelectorAll('.method-drop');
const methodConfirmBtn = document.getElementById('methodConfirmBtn');
const methodMsg = document.getElementById('methodMsg');
let selectedMethod = '';

methodItem.addEventListener('dragstart', (e) => {
  e.dataTransfer.setData('text/plain', 'method');
});

methodDrops.forEach(drop => {
  drop.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  drop.addEventListener('drop', (e) => {
    e.preventDefault();

    methodDrops.forEach(d => d.classList.remove('selected-method'));

    drop.classList.add('selected-method');
    selectedMethod = drop.getAttribute('data-value');

    methodMsg.textContent = '您選擇了：' + selectedMethod;
    methodConfirmBtn.classList.remove('hidden');
  });
});

methodConfirmBtn.addEventListener('click', () => {
  goToStep(3);
});

// 第 3 關：翻牌選擇科別
const flipCards = document.querySelectorAll('#departmentsFlip .flip-card');
const deptConfirmBtn = document.getElementById('deptConfirmBtn');

flipCards.forEach(card => {
  card.addEventListener('click', () => {
    flipCards.forEach(c => {
      if (c !== card) {
        c.classList.remove('flipped');
        c.classList.remove('selected');
      }
    });

    card.classList.add('flipped');
    card.classList.add('selected');

    selectedDepartment = card.getAttribute('data-dept');
    deptConfirmBtn.classList.remove('hidden');
  });
});

deptConfirmBtn.addEventListener('click', () => {
  goToStep(4);
});

// 第 4 關：選擇醫師
const doctorItems = document.querySelectorAll('#doctorList .doctor-item');
const startDoctorBtn = document.getElementById('startDoctorBtn');
const stopDoctorBtn = document.getElementById('stopDoctorBtn');
const doctorConfirmBtn = document.getElementById('doctorConfirmBtn');
const restartDoctorBtn = document.getElementById('restartDoctorBtn');
const doctorMsg = document.getElementById('doctorMsg');
let doctorInterval = null;
let currentDoctorIndex = 0;

startDoctorBtn.addEventListener('click', () => {
  startDoctorBtn.classList.add('hidden');
  stopDoctorBtn.classList.remove('hidden');
  doctorConfirmBtn.classList.add('hidden');
  restartDoctorBtn.classList.add('hidden');

  doctorMsg.textContent = '';
  currentDoctorIndex = 0;

  doctorInterval = setInterval(() => {
    doctorItems.forEach(item => item.classList.remove('active'));

    doctorItems[currentDoctorIndex].classList.add('active');
    currentDoctorIndex = (currentDoctorIndex + 1) % doctorItems.length;
  }, 600);
});

stopDoctorBtn.addEventListener('click', () => {
  if (doctorInterval) {
    clearInterval(doctorInterval);
  }

  doctorInterval = null;

  const index = (currentDoctorIndex - 1 + doctorItems.length) % doctorItems.length;

  doctorItems.forEach(item => item.classList.remove('active'));

  const selectedItem = doctorItems[index];
  selectedItem.classList.add('active');

  selectedDoctor = selectedItem.getAttribute('data-name');

  stopDoctorBtn.classList.add('hidden');
  doctorConfirmBtn.classList.remove('hidden');
  restartDoctorBtn.classList.remove('hidden');

  doctorMsg.textContent = '您選擇了醫師：' + selectedDoctor;
});

doctorConfirmBtn.addEventListener('click', () => {
  restartDoctorBtn.classList.add('hidden');
  goToStep(5);
});

// 重新選擇醫師
restartDoctorBtn.addEventListener('click', () => {
  if (doctorInterval) {
    clearInterval(doctorInterval);
    doctorInterval = null;
  }

  doctorItems.forEach(item => item.classList.remove('active'));

  selectedDoctor = '';
  doctorMsg.textContent = '';

  startDoctorBtn.classList.remove('hidden');
  stopDoctorBtn.classList.add('hidden');
  doctorConfirmBtn.classList.add('hidden');
  restartDoctorBtn.classList.add('hidden');

  currentDoctorIndex = 0;
});

// 第 5 關：日期與時間輸入
const dateInput = document.getElementById('dateInput');
const timeButtons = document.querySelectorAll('#timeOptions .time-btn');
const timeConnection = document.getElementById('timeConnection');
const nextBtn5 = document.getElementById('nextBtn5');

function updateConnection() {
  if (selectedDate && selectedTime) {
    timeConnection.textContent = '日期：' + selectedDate + ' ───▶ 時間：' + selectedTime;
    timeConnection.classList.remove('hidden');
  }
}

function checkDateTime() {
  if (dateInput.value && selectedTime) {
    selectedDate = dateInput.value;
    nextBtn5.classList.remove('hidden');
    updateConnection();
  } else {
    nextBtn5.classList.add('hidden');
    timeConnection.classList.add('hidden');
  }
}

dateInput.addEventListener('change', () => {
  selectedDate = dateInput.value;
  checkDateTime();
});

timeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    timeButtons.forEach(b => b.classList.remove('selected'));

    btn.classList.add('selected');
    selectedTime = btn.getAttribute('data-time');

    checkDateTime();
  });
});

nextBtn5.addEventListener('click', () => {
  goToStep(6);
});

// 第 6 關：按鍵盤選擇初診或複診
const keyboardMsgEl = document.getElementById('keyboardMsg');
const visitConfirmBtn = document.getElementById('visitConfirmBtn');
const visitRenewBtn = document.getElementById('visitRenewBtn');

function handleKeySelection(e) {
  if (currentStep !== 6) return;

  const key = e.key.toLowerCase();

  if (key === 'a') {
    visitStatus = '初診';
    keyboardMsgEl.textContent = '您選擇了：初診 (A 鍵)';
  } else if (key === 'l') {
    visitStatus = '複診';
    keyboardMsgEl.textContent = '您選擇了：複診 (L 鍵)';
  } else {
    return;
  }

  visitConfirmBtn.classList.remove('hidden');
  visitRenewBtn.classList.remove('hidden');
}

document.addEventListener('keydown', handleKeySelection);

visitRenewBtn.addEventListener('click', () => {
  visitStatus = '';
  keyboardMsgEl.textContent = '';
  visitConfirmBtn.classList.add('hidden');
  visitRenewBtn.classList.add('hidden');
});

visitConfirmBtn.addEventListener('click', () => {
  goToStep(7);

  const successMsgEl = document.getElementById('successMsg');

  successMsgEl.innerHTML = `
    您掛了 <strong>${selectedDepartment}</strong>，看診號碼是 <strong>8</strong> 號。<br>
    醫師：<strong>${selectedDoctor}</strong>。<br>
    日期：<strong>${selectedDate}</strong>，時間：<strong>${selectedTime}</strong>。<br>
    狀態：<strong>${visitStatus}</strong>
  `;
});

// 第 7 關
const screenshotBtn = document.getElementById('screenshotBtn');
const flashEl = document.getElementById('flash');
const confettiContainer = document.getElementById('confetti-container');
const finalMsg = document.getElementById('finalMsg');
const restartBtn = document.getElementById('restartBtn');

function createConfetti() {
  const colors = ['#FFCDD2', '#F8BBD0', '#C5E1A5', '#FFF59D', '#81D4FA', '#FFAB91'];

  const el = document.createElement('div');
  el.classList.add('confetti');
  el.style.left = Math.random() * 100 + '%';

  const size = Math.floor(Math.random() * 8) + 8;

  el.style.width = size + 'px';
  el.style.height = size * 1.4 + 'px';
  el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

  return el;
}

function playConfetti() {
  confettiContainer.innerHTML = '';

  for (let i = 0; i < 40; i++) {
    confettiContainer.appendChild(createConfetti());
  }

  setTimeout(() => {
    confettiContainer.innerHTML = '';
  }, 3500);
}

function flashScreen() {
  flashEl.style.opacity = '1';
  flashEl.style.transition = 'opacity 0.5s ease-out';

  setTimeout(() => {
    flashEl.style.opacity = '0';
  }, 100);
}

screenshotBtn.addEventListener('click', () => {
  flashScreen();
  playConfetti();
  finalMsg.style.display = 'block';
  restartBtn.classList.remove('hidden');
});

restartBtn.addEventListener('click', () => {
  idInput.value = '';
  dobInput.value = '';

  selectedDepartment = '';
  selectedDoctor = '';
  selectedDate = '';
  selectedTime = '';
  visitStatus = '';

  nextBtn1.classList.add('hidden');
  finalMsg.style.display = 'none';
  restartBtn.classList.add('hidden');
  confettiContainer.innerHTML = '';

  dropSlots.forEach(slot => {
    slot.textContent = '';
    slot.classList.remove('filled');
  });

  dragItems.forEach(item => item.classList.remove('hidden'));

  puzzleMsg.textContent = '';
  puzzleSection.classList.remove('hidden');
  inputSection1.classList.add('hidden');

  methodDrops.forEach(d => d.classList.remove('selected-method'));
  methodConfirmBtn.classList.add('hidden');
  methodMsg.textContent = '';
  selectedMethod = '';

  methodItem.classList.remove('hidden');

  flipCards.forEach(card => {
    card.classList.remove('flipped');
    card.classList.remove('selected');
  });

  deptConfirmBtn.classList.add('hidden');

  doctorItems.forEach(item => item.classList.remove('active'));

  startDoctorBtn.classList.remove('hidden');
  stopDoctorBtn.classList.add('hidden');
  doctorConfirmBtn.classList.add('hidden');

  if (doctorInterval) {
    clearInterval(doctorInterval);
  }

  doctorInterval = null;
  currentDoctorIndex = 0;
  doctorMsg.textContent = '';
  restartDoctorBtn.classList.add('hidden');

  dateInput.value = '';
  selectedDate = '';
  selectedTime = '';

  const timeConnectionEl = document.getElementById('timeConnection');

  if (timeConnectionEl) {
    timeConnectionEl.classList.add('hidden');
  }

  const timeBtns = document.querySelectorAll('#timeOptions .time-btn');

  timeBtns.forEach(btn => btn.classList.remove('selected'));

  nextBtn5.classList.add('hidden');

  const keyboardMsgDiv = document.getElementById('keyboardMsg');

  if (keyboardMsgDiv) {
    keyboardMsgDiv.textContent = '';
  }

  const visitConfirm = document.getElementById('visitConfirmBtn');

  if (visitConfirm) {
    visitConfirm.classList.add('hidden');
  }

  const visitRenew = document.getElementById('visitRenewBtn');

  if (visitRenew) {
    visitRenew.classList.add('hidden');
  }

  goToStep(1);
});

goToStep(1);