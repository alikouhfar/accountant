/* DOM Elements */
const labelDate = document.querySelector(".date");
const labelTime = document.querySelector(".time");
const logoutBtn = document.querySelector(".logout");
let labelPriceBtns = document.querySelectorAll(".btn_price");
let labelPreviousFee = document.querySelector(".final_previous--fee");
let labelTotalFee = document.querySelector(".final_total--fee");
const appPage = document.getElementById("app_page");
const printBtn = document.querySelector(".btn_good");
const clearBtn = document.querySelector(".btn_bad");
const fullLogBtn = document.querySelector(".btn_warning");

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

/* Functions */
const localizeNumberFormat = function (locale, number) {
  number.textContent = new Intl.NumberFormat(locale).format(number.textContent);
};

/* Prices */
labelPriceBtns.forEach((price) => {
  localizeNumberFormat("fa-IR", price);
});
localizeNumberFormat("fa-IR", labelTotalFee);
