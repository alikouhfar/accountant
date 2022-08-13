/* DOM Elements */
const labelDate = document.querySelector(".date");
const labelTime = document.querySelector(".time");
const pricesParentEl = document.querySelector(".prices__users");
const priceBtns = document.querySelectorAll(".users__types");
const tableParentEl = document.querySelector(".table__body");
const rowsEl = document.querySelectorAll("tr");
const prevTotalEl = document.querySelector(".previous_total--fee");
const finalTotalEl = document.querySelector(".final_total--fee");
const logTotalEl = document.querySelector(".log__total--fee");
const briefFullEl = document.querySelector(".brief_full--count");
const briefOthersEl = document.querySelector(".brief_others--count");
const briefPremiumEl = document.querySelector(".brief_premium--count");
const briefMassageEl = document.querySelector(".brief_massage--count");

const logParentEl = document.getElementById("log");
const logDetailsEl = document.querySelector(".log__details--body");
const appParentEl = document.getElementById("app_page");

const checkBtn = document.querySelector(".btn_good");
const clearBtn = document.querySelector(".btn_bad");
const showLogBtn = document.querySelector(".btn_warning");
const closeLogBtn = document.querySelector(".log__close");

/* Today */
labelDate.textContent = new Intl.DateTimeFormat("fa-IR", {
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(new Date());

/* Clock */
setInterval(() => {
  labelTime.textContent = new Intl.DateTimeFormat("fa-IR", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(new Date());
}, 1000);

/* Prices */
const now = Date.now().toString();

const state = {
  counts: new Array(priceBtns.length).fill(0),
  rows: new Map(),
  fullCounts: {},
  briefCounts: {
    full: 0,
    half: [],
    premium: [],
    massage: [],
  },
  prevTotal: 0,
  currTotal: new Map(),
};

const generateRow = function (index, title, count, price, total = +price) {
  return {
    code: index + 1,
    title: title,
    count: count,
    price: price,
    total,
  };
};

const generateMarkup = function (row) {
  return `
    <tr>
      <td>${row.code}</td>
      <td>${row.title}</td>
      <td>${row.count}</td>
      <td>${row.price}</td>
      <td>${row.total}</td>
    </tr>
  `;
};

const generateLogMarkup = function (row) {
  return `
    <tr>
      <td class="log__detail--code">${row.code}</td>
      <td class="log__detail--title">${row.title}</td>
      <td class="log__detail--count">${row.count}</td>
    </tr>
  `;
};

priceBtns.forEach((element, index) => {
  // Store Counts
  state.fullCounts[index] = [];

  element.addEventListener("click", function (e) {
    const id = now.slice(0, 6) + index;
    const btn = e.target.closest("button");
    const title = btn.querySelector(".btn__title").textContent;
    const price = btn.querySelector(".btn__price").textContent;
    btn.dataset.title = title;
    btn.dataset.price = price;
    btn.dataset.code = index;

    // Check the Existance of ID
    if (!state.rows.has(id)) {
      state.rows.set(
        id,
        generateRow(index, title, state.counts[index] + 1, price)
      );
      state.counts[index]++;
    } else {
      const currBtn = state.rows.get(id);
      state.counts[index]++;
      currBtn.count = state.counts[index];
      currBtn.total = currBtn.count * currBtn.price;
    }

    // Store Totals
    state.currTotal.set(id, state.rows.get(id).total);

    // Sum Totals
    const totals = [...state.currTotal.values()];
    const total = totals.reduce(
      (previousValue, currentValue) => previousValue + currentValue,
      0
    );

    // Show Total on DOM
    finalTotalEl.textContent = new Intl.NumberFormat("fa-IR").format(total);

    // Render Rows
    tableParentEl.textContent = "";
    state.rows.forEach((row) => {
      tableParentEl.insertAdjacentHTML("beforeend", generateMarkup(row));
    });
  });
});

checkBtn.addEventListener("click", function () {
  const values = [...state.rows.values()];
  values.forEach((value) => {
    const code = value.code - 1;
    state.fullCounts[code].push(state.counts[code]);
    state.fullCounts[code] = [
      state.fullCounts[code].reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        0
      ),
    ];

    // Set Brief Counts
    if (code === 0) {
      state.briefCounts.full = state.fullCounts[code];
      briefFullEl.textContent = state.briefCounts.full;
    }
    if (code > 0 && code <= 7) {
      state.briefCounts.half.push(state.counts[code]);
      state.briefCounts.half = [
        state.briefCounts.half.reduce(
          (previousValue, currentValue) => previousValue + currentValue,
          0
        ),
      ];
      briefOthersEl.textContent = state.briefCounts.half;
    }
    if (code > 7 && code <= 11) {
      state.briefCounts.premium.push(state.counts[code]);
      state.briefCounts.premium = [
        state.briefCounts.premium.reduce(
          (previousValue, currentValue) => previousValue + currentValue,
          0
        ),
      ];
      briefPremiumEl.textContent = state.briefCounts.premium;
    }
    if (code > 11) {
      state.briefCounts.massage.push(state.counts[code]);
      state.briefCounts.massage = [
        state.briefCounts.massage.reduce(
          (previousValue, currentValue) => previousValue + currentValue,
          0
        ),
      ];
      briefMassageEl.textContent = state.briefCounts.massage;
    }
  });

  // Clear Recipt
  tableParentEl.textContent = "";
  state.rows.clear();

  // Set Previous Total
  const prevTotals = [...state.currTotal.values()];
  const prevTotal = prevTotals.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    0
  );
  prevTotalEl.textContent = new Intl.NumberFormat("fa-IR").format(prevTotal);

  // Clear Current Total
  state.currTotal.clear();
  finalTotalEl.textContent = state.currTotal.size;
  state.counts = new Array(priceBtns.length).fill(0);
});

clearBtn.addEventListener("click", function () {
  // Clear Recipt
  state.currTotal.clear();
  state.rows.clear();
  tableParentEl.textContent = "";

  // Clear Current Total
  finalTotalEl.textContent = state.currTotal.size;
  state.counts = new Array(priceBtns.length).fill(0);
});

showLogBtn.addEventListener("click", function () {
  logDetailsEl.textContent = "";
  const logTotal = [];
  logParentEl.classList.toggle("hidden");
  appParentEl.classList.toggle("blur");
  for (const key in state.fullCounts) {
    if (
      state.fullCounts.hasOwnProperty.call(state.fullCounts, key) &&
      state.fullCounts[key].length !== 0
    ) {
      const row = {
        code: +key + 1,
        title: priceBtns[key].dataset.title,
        count: state.fullCounts[key],
        total: 0,
      };
      row.total = priceBtns[key].dataset.price * row.count;
      logDetailsEl.insertAdjacentHTML("beforeend", generateLogMarkup(row));
      logTotal.push(row.total);
      const total = logTotal.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        0
      );
      logTotalEl.textContent = new Intl.NumberFormat("fa-IR").format(total);
    }
  }
});

closeLogBtn.addEventListener("click", function () {
  logParentEl.classList.toggle("hidden");
  appParentEl.classList.toggle("blur");
});
