// ==================================================================
//  webcore.js — логика PUNCHDRUNK'S HOMEPAGE
//  Счётчик посещений, дата обновления, гостевая, скрытая страница
// ==================================================================

(function () {
  "use strict";

  // ---------- СЧЁТЧИК ПОСЕЩЕНИЙ ----------
  // Растёт при каждом заходе. При первом заходе — стартует с 1024.
  function updateCounter() {
    let count = parseInt(localStorage.getItem("pd_counter") || "0", 10);
    if (count === 0) {
      count = 1024 + Math.floor(Math.random() * 500);
    }
    count += 1;
    localStorage.setItem("pd_counter", count.toString());

    const el = document.getElementById("counter-digits");
    if (el) {
      el.textContent = String(count).padStart(6, "0");
    }
  }

  // ---------- ДАТА ПОСЛЕДНЕГО ОБНОВЛЕНИЯ ----------
  // Всегда СЕГОДНЯ. Как будто сайт обновляется сам.
  function updateLastDate() {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();

    const el = document.getElementById("last-updated");
    if (el) el.textContent = dd + "." + mm + "." + yyyy;

    // Даты новостей — тоже рандомные в последние дни
    const d1 = new Date(Date.now() - 1 * 86400000);
    const d2 = new Date(Date.now() - 3 * 86400000);
    const d3 = new Date(Date.now() - 7 * 86400000);

    const fdate = (dd) =>
      String(dd.getDate()).padStart(2, "0") + "." +
      String(dd.getMonth() + 1).padStart(2, "0") + "." +
      dd.getFullYear();

    const el1 = document.getElementById("date1");
    const el2 = document.getElementById("date2");
    const el3 = document.getElementById("date3");

    if (el1) el1.textContent = fdate(d1);
    if (el2) el2.textContent = fdate(d2);
    if (el3) el3.textContent = fdate(d3);
  }

  // ---------- СКРЫТАЯ СТРОКА В КОНСОЛИ ----------
  function consoleMessage() {
    const visits = parseInt(localStorage.getItem("pd_counter") || "0", 10);
    if (visits > 5) {
      console.log(
        "%cпривет, " + (localStorage.getItem("pd_name") || "friend") + ".",
        "color:#000080;font-family:Times New Roman;font-size:20px;font-style:italic;"
      );
      console.log(
        "%cты возвращаешься сюда слишком часто.",
        "color:#808080;font-family:Times New Roman;font-size:14px;"
      );
    }
  }

  // ---------- ФЕЙКОВЫЕ "ДРУГИЕ ПОСЕТИТЕЛИ" ----------
  // Каждые 30 секунд счётчик сам растёт — как будто кто-то ещё зашёл.
  function startAutoCounter() {
    setInterval(() => {
      if (Math.random() < 0.4) {
        let count = parseInt(localStorage.getItem("pd_counter") || "0", 10);
        count += 1;
        localStorage.setItem("pd_counter", count.toString());

        const el = document.getElementById("counter-digits");
        if (el) {
          el.textContent = String(count).padStart(6, "0");
        }
      }
    }, 30000);
  }

  // ---------- СЛУЧАЙНЫЕ GIF-АНИМАЦИИ (CSS) ----------
  // Добавляем мигающие элементы на страницу
  function addBlinkers() {
    // Добавляем в заголовок "NEW!"
    const news = document.querySelectorAll(".box-header");
    news.forEach((h) => {
      if (h.textContent.includes("WHAT'S NEW")) {
        const newSpan = document.createElement("span");
        newSpan.textContent = " ★NEW★";
        newSpan.style.color = "#ff0000";
        newSpan.style.animation = "title-blink 1s infinite";
        h.appendChild(newSpan);
      }
    });
  }

  // ---------- СЛУЧАЙНЫЕ "ОБНОВЛЕНИЯ" ----------
  // Иногда в новостях появляется новая строка.
  function addRandomNews() {
    const newsList = document.querySelector(".news");
    if (!newsList) return;

    setInterval(() => {
      if (Math.random() < 0.15) {
        const li = document.createElement("li");
        const d = new Date();
        const fdate = String(d.getDate()).padStart(2, "0") + "." +
                      String(d.getMonth() + 1).padStart(2, "0") + "." +
                      d.getFullYear();

        const newsItems = [
          "Updated my <a href='music.html'>music page</a>. New track.",
          "Signed my <a href='guestbook.html'>guestbook</a> please.",
          "Working on something new. Can't say yet.",
          "Someone sent me an email today. Strange one.",
          "The site is loading slower. Sorry.",
          "I heard something last night. Probably nothing.",
          "Do not click <a href='punchdrunk'>this link</a>.",
          "The counter is wrong. I don't know why.",
        ];

        li.innerHTML = "<span class='date'>" + fdate + "</span> " +
                       newsItems[Math.floor(Math.random() * newsItems.length)];
        newsList.insertBefore(li, newsList.firstChild);

        // не даём списку расти слишком сильно
        while (newsList.children.length > 8) {
          newsList.removeChild(newsList.lastChild);
        }
      }
    }, 45000);
  }

  // ---------- ЗАПОМНИТЬ "ИМЯ" ИГРОКА ----------
  function rememberName() {
    // спрашиваем имя при первом заходе
    let name = localStorage.getItem("pd_name");
    if (!name) {
      name = "friend";
      localStorage.setItem("pd_name", name);
    }
  }

  // ---------- ЗАПУСК ----------
  function init() {
    updateCounter();
    updateLastDate();
    consoleMessage();
    startAutoCounter();
    addBlinkers();
    addRandomNews();
    rememberName();
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }

  // ---------- ЭКСПОРТ ДЛЯ ОТЛАДКИ ----------
  window._pdReset = () => {
    localStorage.removeItem("pd_counter");
    localStorage.removeItem("pd_name");
    location.reload();
  };
  window._pdCounter = () => localStorage.getItem("pd_counter");
})();
