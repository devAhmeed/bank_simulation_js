'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2021-06-25T17:12:01.424Z',
    '2021-07-05T17:12:01.424Z',
    '2021-07-06T17:12:01.424Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2021-06-29T17:12:01.424Z',
    '2021-07-01T17:12:01.424Z',
    '2021-07-06T17:12:01.424Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};
const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions
const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, a) {
    return acc + a;
  });
  labelBalance.textContent = displayCurrency(acc.balance, acc);
};
const setLogOutTimer = function () {
  let time = 300;
  const countDown = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to Check Your Account Again';
    }
    time--;
  };
  const timer = setInterval(countDown, 1000);
  return timer;
};

const displayCurrency = function (value, main) {
  return new Intl.NumberFormat(main.locale, {
    style: 'currency',
    currency: main.currency,
  }).format(value);
};
const displayDate = function (date, locale) {
  const calcDays = (date1, date2) =>
    Math.round(Math.abs((date1 - date2) / (1000 * 60 * 60 * 24)));
  const days = calcDays(new Date(), date);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days <= 7) return `${days} days ago`;
  else {
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }).format(date);
  }
};

const displayMov = function (acc, sort = false) {
  const mova = sort
    ? acc.movements.slice().sort((a, b) => b - a)
    : acc.movements;
  containerMovements.innerHTML = '';
  mova.forEach(function (mov, i) {
    const date = new Date(acc.movementsDates[i]);
    const disDates = displayDate(date, acc.locale);

    const formatedCurr = displayCurrency(mov, acc);

    const status = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
<div class="movements__type movements__type--${status}">${i + 1} ${status}</div>
<div class="movements__date">${disDates}</div>
<div class="movements__value">${formatedCurr}€</div>
</div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
const calcDisplay = function (acc) {
  acc.totalIncome = acc.movements
    .filter(mov => mov >= 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = displayCurrency(acc.totalIncome, acc);

  acc.totalOutput = acc.movements
    .filter(mov => mov <= 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = displayCurrency(Math.abs(acc.totalOutput), acc);

  acc.interest = acc.movements
    .filter(mov => mov >= 0)
    .map(int => (int * acc.interestRate) / 100)
    .filter(ints => ints >= 1)
    .reduce((acc, intse) => acc + intse);
  labelSumInterest.textContent = displayCurrency(Math.floor(acc.interest), acc);
};

const updateUI = function (acc) {
  displayBalance(acc);
  calcDisplay(acc);
  displayMov(acc);
};
const creatUsers = function (accs) {
  accs.forEach(function (x) {
    x.username = x.owner
      .split(' ')
      .map(l => l[0])
      .join('')
      .toLowerCase();
  });
};
creatUsers(accounts);

let currentAcc, timer;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAcc = accounts.find(acc => acc.username === inputLoginUsername.value);
  if (currentAcc?.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `Welcome Back , ${
      currentAcc.owner.split(' ')[0]
    }`;
    //Date&Time
    const now = new Date();
    // const localLang = navigator.language;
    // console.log(localLang);
    const opt = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      weekday: 'long',
    };
    labelDate.textContent = Intl.DateTimeFormat(currentAcc.locale, opt).format(
      now
    );
    if (timer) clearInterval(timer);
    timer = setLogOutTimer();
    updateUI(currentAcc);
    inputLoginPin.blur();
    inputLoginPin.value = inputLoginUsername.value = '';
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recivngPerson = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  if (
    amount >= 0 &&
    currentAcc.balance >= amount &&
    recivngPerson?.username !== currentAcc.username
  ) {
    currentAcc.movements.push(-amount);
    recivngPerson.movements.push(amount);
    currentAcc.movementsDates.push(new Date().toISOString());
    recivngPerson.movementsDates.push(new Date().toISOString());
    updateUI(currentAcc);

    clearInterval(timer);
    timer = setLogOutTimer();

    inputTransferAmount.value = inputTransferTo.value = '';
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAcc.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAcc.movements.push(amount);

      // Add loan date
      currentAcc.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAcc);
    }, 2500);
  }
  clearInterval(timer);
  timer = setLogOutTimer();

  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (x) {
  x.preventDefault();
  if (
    inputCloseUsername.value === currentAcc.username &&
    Number(inputClosePin.value) === currentAcc.pin
  ) {
    const del = accounts.findIndex(acc => acc.username === currentAcc.username);
    accounts.splice(del, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});
let sort = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMov(currentAcc, !sort);
  sort = !sort;
});
