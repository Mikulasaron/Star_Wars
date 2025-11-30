// Megfelel az előírásnak: külön JS fájl, validálás + saját interaktív programok

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initRebelForm();
  initWatchOrderTool();
  initTimelineFilter();
  initCharacterSearch();
  initQuiz();
});

/**
 * Mobil menü nyitása/zárása
 */
function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("mainNav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

/**
 * Űrlap validálása (legalább 7 mező)
 */
function initRebelForm() {
  const form = document.getElementById("rebelForm");
  if (!form) return;

  const successMessage = document.getElementById("formSuccess");

  form.addEventListener("submit", (event) => {
    
    clearErrors();

    const name = form.elements["name"];
    const email = form.elements["email"];
    const password = form.elements["password"];
    const birthdate = form.elements["birthdate"];
    const faction = form.elements["faction"];
    const experience = form.elements["experience"];
    const message = form.elements["message"];
    const terms = form.elements["terms"];

    let isValid = true;

    // Név
    if (!name.value.trim()) {
      showError("name", "A név megadása kötelező.");
      isValid = false;
    }

    // Email
    if (!email.value.trim()) {
      showError("email", "Az e-mail megadása kötelező.");
      isValid = false;
    } else if (!isValidEmail(email.value)) {
      showError("email", "Kérlek, érvényes e-mail címet adj meg.");
      isValid = false;
    }

    // Jelszó
    if (!password.value.trim()) {
      showError("password", "A jelszó megadása kötelező.");
      isValid = false;
    } else if (password.value.length < 6) {
      showError("password", "A jelszónak legalább 6 karakter hosszúnak kell lennie.");
      isValid = false;
    }

    // Születési dátum
    if (!birthdate.value) {
      showError("birthdate", "A születési dátum megadása kötelező.");
      isValid = false;
    } else {
      const birth = new Date(birthdate.value);
      const today = new Date();
      if (birth > today) {
        showError("birthdate", "A születési dátum nem lehet a jövőben.");
        isValid = false;
      }
    }

    // Faction
    if (!faction.value) {
      showError("faction", "Válassz egy oldalt.");
      isValid = false;
    }

    // Experience (radio group)
    const experienceValue = form.querySelector("input[name='experience']:checked");
    if (!experienceValue) {
      showError("experience", "Válaszd ki a tapasztalati szinted.");
      isValid = false;
    }

    // Message
    if (!message.value.trim()) {
      showError("message", "Írj legalább egy rövid üzenetet.");
      isValid = false;
    } else if (message.value.trim().length < 10) {
      showError("message", "Az üzenet legyen legalább 10 karakter.");
      isValid = false;
    }

    // Terms (checkbox)
    if (!terms.checked) {
      showError("terms", "El kell fogadnod a feltételeket.");
      isValid = false;
    }

    if (!isValid) {
            event.preventDefault(); // Megállítjuk a küldést, ha hiba van
            
        } 

  });
}

function isValidEmail(value) {
  // Egyszerű e-mail regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function showError(fieldName, message) {
  const errorElement = document.querySelector(`.error-message[data-error-for="${fieldName}"]`);
  if (errorElement) {
    errorElement.textContent = message;
  }
}

function clearErrors() {
  document.querySelectorAll(".error-message").forEach((el) => {
    el.textContent = "";
  });
}

/**
 * Watch-order generátor – lista létrehozása a választott logika alapján
 */
function initWatchOrderTool() {
  const select = document.getElementById("orderType");
  const button = document.getElementById("generateOrder");
  const resultList = document.getElementById("orderResult");

  if (!select || !button || !resultList) return;

  const orders = {
    release: [
      "IV. rész – Egy új remény (1977)",
      "V. rész – A Birodalom visszavág (1980)",
      "VI. rész – A Jedi visszatér (1983)",
      "I. rész – Baljós árnyak (1999)",
      "II. rész – A klónok támadása (2002)",
      "III. rész – A Sithek bosszúja (2005)",
      "VII. rész – Az ébredő Erő (2015)",
      "VIII. rész – Az utolsó Jedik (2017)",
      "IX. rész – Skywalker kora (2019)"
    ],
    chronological: [
      "I. rész – Baljós árnyak (32 BBY)",
      "II. rész – A klónok támadása (22 BBY)",
      "III. rész – A Sithek bosszúja (19 BBY)",
      "Zsivány Egyes – Egy Star Wars-történet (0 BBY)",
      "IV. rész – Egy új remény (0 ABY)",
      "V. rész – A Birodalom visszavág (3 ABY)",
      "VI. rész – A Jedi visszatér (4 ABY)",
      "VII. rész – Az ébredő Erő (34 ABY)",
      "VIII. rész – Az utolsó Jedik (34 ABY)",
      "IX. rész – Skywalker kora (35 ABY)"
    ]
  };

  button.addEventListener("click", () => {
    const type = select.value;
    const list = orders[type] || [];
    resultList.innerHTML = "";

    list.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      resultList.appendChild(li);
    });
  });

  
  
}

/**
 * Idővonal szűrés korszak szerint
 */
function initTimelineFilter() {
  const filter = document.getElementById("eraFilter");
  const items = document.querySelectorAll(".timeline-item");

  if (!filter || items.length === 0) return;

  filter.addEventListener("change", () => {
    const value = filter.value;

    items.forEach((item) => {
      const era = item.getAttribute("data-era");
      if (value === "all" || value === era) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });
  });
}

/**
 * Karakter keresés név szerint
 */
function initCharacterSearch() {
  const input = document.getElementById("characterSearch");
  const cards = document.querySelectorAll(".character-card");

  if (!input || cards.length === 0) return;

  input.addEventListener("input", () => {
    const term = input.value.trim().toLowerCase();

    cards.forEach((card) => {
      const name = card.getAttribute("data-name") || "";
      const visible = name.toLowerCase().includes(term);
      card.style.display = visible ? "" : "none";
    });
  });
}




function initQuiz() {
  const form = document.getElementById("quizForm");
  if (!form) return;

  const resetBtn = document.getElementById("quizReset");
  const resultEl = document.getElementById("quizResult");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // előző színezés törlése
    form.querySelectorAll(".quiz-option").forEach((opt) => {
      opt.classList.remove("correct", "incorrect");
    });

    let correctCount = 0;
    const questions = form.querySelectorAll(".quiz-question");

    questions.forEach((question) => {
      const options = question.querySelectorAll(".quiz-option input[type='radio']");
      const name = options[0]?.name;
      if (!name) return;

      const checked = form.querySelector(`input[name="${name}"]:checked`);

      if (!checked) {
        // nincs válasz – semmi színezés, csak kihagyjuk
        return;
      }

      const label = checked.closest(".quiz-option");
      const isCorrect = checked.dataset.correct === "true";

      if (isCorrect) {
        label.classList.add("correct");
        correctCount++;
      } else {
        label.classList.add("incorrect");
      }
    });

    if (resultEl) {
      resultEl.textContent = `Eredményed: ${correctCount} / ${questions.length} helyes válasz.`;
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      // rádiók törlése
      form.querySelectorAll("input[type='radio']").forEach((input) => {
        input.checked = false;
      });

      // színezés törlése
      form.querySelectorAll(".quiz-option").forEach((opt) => {
        opt.classList.remove("correct", "incorrect");
      });

      // eredmény kiürítése
      if (resultEl) {
        resultEl.textContent = "";
      }
    });
  }
}
