/* =====================================
   MOVEBEM — INTERAÇÕES EM JAVASCRIPT
   Há variáveis, funções, eventos, validação
   e alteração de conteúdo na página.
   ===================================== */

// Estado da dica (variável JavaScript solicitada na atividade)
let currentTip = 0;

const tips = [
  {
    text: "Troque uma viagem curta de carro por uma caminhada. Seu corpo e o planeta agradecem.",
    category: "Movimento no dia a dia",
    icon: "↗"
  },
  {
    text: "Levante-se por alguns minutos entre períodos longos sentado e movimente braços e pernas.",
    category: "Pausa ativa",
    icon: "↟"
  },
  {
    text: "Escolha uma música animada e dance até ela terminar. Diversão também é movimento.",
    category: "Movimento com prazer",
    icon: "♫"
  },
  {
    text: "Combine uma caminhada com alguém. Companhia pode deixar o hábito mais leve e constante.",
    category: "Conexão",
    icon: "☺"
  },
  {
    text: "Deixe tênis e roupa separados na noite anterior. Reduzir obstáculos ajuda a começar.",
    category: "Organização",
    icon: "✓"
  }
];

const tipText = document.querySelector("#tip-text");
const tipCount = document.querySelector("#tip-count");
const tipCategory = document.querySelector("#tip-category");
const tipIcon = document.querySelector("#tip-icon");
const newTipButton = document.querySelector("#new-tip");

// Função que altera o conteúdo da página ao clicar no botão
function showNextTip() {
  currentTip = (currentTip + 1) % tips.length;
  const tip = tips[currentTip];

  tipText.textContent = tip.text;
  tipCategory.textContent = tip.category;
  tipIcon.textContent = tip.icon;
  tipCount.textContent = `${String(currentTip + 1).padStart(2, "0")} / ${String(tips.length).padStart(2, "0")}`;

  tipIcon.classList.remove("spin");
  void tipIcon.offsetWidth;
  tipIcon.classList.add("spin");
}

newTipButton.addEventListener("click", showNextTip);

// Menu responsivo
const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");

function closeMenu() {
  mainNav.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Abrir menu");
  document.body.classList.remove("menu-open");
}

navToggle.addEventListener("click", () => {
  const willOpen = navToggle.getAttribute("aria-expanded") === "false";
  mainNav.classList.toggle("open", willOpen);
  navToggle.setAttribute("aria-expanded", String(willOpen));
  navToggle.setAttribute("aria-label", willOpen ? "Fechar menu" : "Abrir menu");
  document.body.classList.toggle("menu-open", willOpen);
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 820) closeMenu();
});

// Calculadora de minutos semanais
const activityForm = document.querySelector("#activity-form");
const nameInput = document.querySelector("#name");
const minutesInput = document.querySelector("#minutes");
const daysInput = document.querySelector("#days");
const intensityInput = document.querySelector("#intensity");
const formError = document.querySelector("#form-error");
const result = document.querySelector("#result");
const resetButton = document.querySelector("#reset-button");

const resultStatus = document.querySelector("#result-status");
const resultTitle = document.querySelector("#result-title");
const weeklyMinutes = document.querySelector("#weekly-minutes");
const progressText = document.querySelector("#progress-text");
const progressTrack = document.querySelector("#progress-track");
const progressFill = document.querySelector("#progress-fill");
const resultMessage = document.querySelector("#result-message");
const resultGoal = document.querySelector("#result-goal");

function clearValidation() {
  formError.hidden = true;
  formError.textContent = "";
  [nameInput, minutesInput, daysInput, intensityInput].forEach((field) => {
    field.classList.remove("is-invalid");
    field.removeAttribute("aria-invalid");
  });
}

function showValidation(message, field) {
  formError.textContent = message;
  formError.hidden = false;
  field.classList.add("is-invalid");
  field.setAttribute("aria-invalid", "true");
  field.focus();
}

// Função de validação do formulário
function validateForm(name, minutes, days) {
  clearValidation();

  if (name.length < 2) {
    showValidation("Digite um nome com pelo menos 2 letras.", nameInput);
    return false;
  }

  if (!Number.isFinite(minutes) || minutes < 5 || minutes > 300) {
    showValidation("Informe um tempo entre 5 e 300 minutos por dia.", minutesInput);
    return false;
  }

  if (!Number.isInteger(days) || days < 1 || days > 7) {
    showValidation("Informe uma quantidade de 1 a 7 dias por semana.", daysInput);
    return false;
  }

  return true;
}

// Função que define a mensagem de acordo com o cálculo
function getFeedback(ratio) {
  if (ratio < 0.4) {
    return {
      status: "Um bom começo",
      message: "Todo movimento conta. Escolha uma meta pequena e possível para ganhar consistência antes de aumentar o tempo."
    };
  }

  if (ratio < 1) {
    return {
      status: "Você está no caminho",
      message: "Sua rotina já soma movimento. Tente acrescentar alguns minutos ou mais um dia, sempre de forma gradual."
    };
  }

  if (ratio < 2) {
    return {
      status: "Referência alcançada",
      message: "Muito bem! Seu planejamento atinge a referência semanal geral. Lembre-se de incluir descanso e atividades de fortalecimento."
    };
  }

  return {
    status: "Ritmo avançado",
    message: "Seu volume planejado está acima da referência mínima. Respeite a recuperação e os sinais do seu corpo."
  };
}

// Evento de envio: valida, calcula e modifica a interface
activityForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const minutes = Number(minutesInput.value);
  const days = Number(daysInput.value);
  const intensity = intensityInput.value;

  if (!validateForm(name, minutes, days)) return;

  const total = minutes * days;
  const target = intensity === "vigorosa" ? 75 : 150;
  const ratio = total / target;
  const percentage = Math.round(ratio * 100);
  const barPercentage = Math.min(percentage, 100);
  const missing = Math.max(target - total, 0);
  const feedback = getFeedback(ratio);

  resultStatus.textContent = feedback.status;
  resultTitle.textContent = `${name}, este é o seu ritmo:`;
  weeklyMinutes.textContent = total;
  progressText.textContent = `${percentage}%`;
  resultMessage.textContent = feedback.message;
  resultGoal.textContent = missing > 0
    ? `Para chegar à referência de ${target} min, faltam ${missing} min por semana.`
    : `Você alcançou a referência de ${target} min para atividade ${intensity}.`;

  progressTrack.setAttribute("aria-valuemax", String(target));
  progressTrack.setAttribute("aria-valuenow", String(Math.min(total, target)));
  progressFill.style.width = "0%";

  activityForm.hidden = true;
  result.hidden = false;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      progressFill.style.width = `${barPercentage}%`;
    });
  });
});

resetButton.addEventListener("click", () => {
  result.hidden = true;
  activityForm.hidden = false;
  progressFill.style.width = "0%";
  clearValidation();
  nameInput.focus();
});

// Remove o aviso visual assim que a pessoa corrige um campo
[nameInput, minutesInput, daysInput, intensityInput].forEach((field) => {
  field.addEventListener("input", () => {
    field.classList.remove("is-invalid");
    field.removeAttribute("aria-invalid");
    if (!document.querySelector(".is-invalid")) {
      formError.hidden = true;
    }
  });
});
