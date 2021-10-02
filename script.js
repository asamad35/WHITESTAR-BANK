"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// WHITESTAR BANK APP

// Data
const account1 = {
  owner: "Abdus Samad",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300, -1000],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2021-09-19T17:01:17.194Z",
    "2021-09-20T23:36:17.929Z",
    "2021-09-23T10:51:36.790Z",
    "2021-09-29T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Sahil Khanna",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2]; //, account3, account4

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
/////////////////////////////////////////////////

// 1.
// CREATE USERNAMES

// The split() method divides a String into an ordered list of substrings, puts these substrings into an array, and returns the array.
// The join() method creates and returns a new string by concatenating all of the elements in an array
function createUserNames(accounts) {
  accounts.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
}
createUserNames(accounts);
// console.log(accounts);
// END OF CREATE USERNAMES

// 2.
// EVENT LISTENERS
let currentAccount, timer;
//LOGIN BUTTON start
btnLogin.addEventListener("click", (e) => {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  // ?. OPTIONAL CHAINING RETURNS UNDEFINED IF REFRENCE DOES NOT EXIST
  if (currentAccount?.pin == inputLoginPin.value) {
    // DISPLAY UI MESSAGE
    labelWelcome.innerText = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = "1";
    //CREATE CURRENT TIME AND DATE

    const now = new Date();
    const options = {
      minute: "numeric",
      hour: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };
    // const locale = navigator.language;
    labelDate.innerText = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    inputLoginPin.value = inputLoginUsername.value = "";
    inputLoginPin.blur();
    // IF SOME TIMER IS ALREADY RUNNING CLEAR IT
    if (timer) {
      clearInterval(timer);
    }
    // NEW TIMER
    timer = startLogOutTimer();
    updateUI(currentAccount);
  } else alert("Invalid username or password");
});
//LOGIN BUTTON end

//TRANSFER BUTTON start
btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  // + sign before inputTransferAmount.value covert it into a number by type coercion.
  const amount = +inputTransferAmount.value;
  const recieverAcc = accounts.find(
    (acc) => acc.username == inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";
  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    recieverAcc &&
    recieverAcc.username !== currentAccount.username
  ) {
    //DOING THE  TRANSFER
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(
      recieverAcc.currency === "USD" ? amount * 1.1 : amount * 0.86
    );
    console.log(recieverAcc.movements);

    //ADD TRANSFER DATE
    currentAccount.movementsDates.push(new Date().toISOString());
    recieverAcc.movementsDates.push(new Date().toISOString());
    //RESET TIMER
    clearInterval(timer);
    timer = startLogOutTimer();
    //UPDATE UI
    updateUI(currentAccount);
  }
});
//TRANSFER BUTTON end

// LOGOUT BUTTON START
btnClose.addEventListener("click", (e) => {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    containerApp.style.opacity = "0";
  } else alert("Invalid username or password");
  inputCloseUsername.value = inputClosePin.value = "";
});
// LOGOUT BUTTON END

// LOAN BUTTON START
btnLoan.addEventListener("click", (e) => {
  e.preventDefault();
  const amount = Math.round(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    //wait for loan to be approved
    setTimeout(function () {
      // ADD MOVEMENT
      currentAccount.movements.push(amount);
      //ADD LOAN DATE
      currentAccount.movementsDates.push(new Date());
      // UPDATE UI
      updateUI(currentAccount);
    }, 2500);
  }
  inputLoanAmount.value = "";
  //RESET TIMER
  clearInterval(timer);
  timer = startLogOutTimer();
});
// LOAN BUTTON START

// SORT MOVEMENTS IN DESCENDING ORDER
let sorted = false;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();
  displayMovements(currentAccount, (sorted = sorted ? false : true));
});
// SORT MOVEMENTS END

// END OF EVENT LISTENERS

//DISPLAY MOVEMENTS
function displayMovements(currentAccount, sort) {
  containerMovements.innerHTML = "";

  // sort transforms the original array hence we made a copy by using slice()
  // to sort array of string simply use array.sort() bs kaam khtm
  const movs = sort
    ? currentAccount.movements.slice().sort((a, b) => a - b)
    : currentAccount.movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";
    //CREATE CURRENT TIME AND DATE
    const date = new Date(currentAccount.movementsDates[i]);
    const displayDate = formatMovementDate(date, currentAccount.locale);
    //End of CREATE CURRENT TIME AND DATE

    //FORMAT CURRENCY
    const fromattedMov = formatCur(
      mov,
      currentAccount.locale,
      currentAccount.currency
    );
    //END OF FORMAT CURRENCY

    const html = `
<div class="movements__row">
<div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
<div class="movements__date">${displayDate}</div>
<div class="movements__value">${fromattedMov}</div>
</div>
`;
    containerMovements.insertAdjacentHTML("afterbegin", html); // insert at the beginning of ContainerMovements
  });
}
//END OF DISPLAY MOVEMENTS

//FORMAT CURRENCY
function formatCur(value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
}
//END OF FORMAT CURRENCY

//CREATE CURRENT TIME AND DATE
function formatMovementDate(date, locale) {
  const calDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

  const daysPassed = calDaysPassed(new Date(), date);
  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else return new Intl.DateTimeFormat(locale).format(date);
}
//End of CREATE CURRENT TIME AND DATE

//DISPLAY CURRENT BALANCE
function calcDisplayBalance(account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.innerText = formatCur(
    account.balance,
    account.locale,
    account.currency
  );
}
//END OF DISPLAY CURRENT BALANCE

// DISPLAY SUMMARY

function calcDisplaySummary(account) {
  const incomes = account.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  const formattedIncome = formatCur(incomes, account.locale, account.currency);
  labelSumIn.innerText = `${formattedIncome}`;

  const out = account.movements
    .filter((mov) => mov <= 0)
    .reduce((acc, mov) => acc + mov, 0);
  const formattedOut = formatCur(
    Math.abs(out),
    account.locale,
    account.currency
  );
  labelSumOut.innerText = `${formattedOut}`;

  const intrest = account.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .reduce((acc, intrest) => acc + intrest, 0);
  const formattedIntrest = formatCur(intrest, account.locale, account.currency);

  labelSumInterest.innerText = `${formattedIntrest}`;
}
// END OF DISPLAY SUMMARY

//UPDATE UI
function updateUI(currentAccount) {
  //DISPLAY MOVEMENTS
  displayMovements(currentAccount);

  //DIPSLAY BALANCE
  calcDisplayBalance(currentAccount);

  //DISPLAY SUMMARY
  calcDisplaySummary(currentAccount);
}
//END OF UPDATE UI

//////////////////////
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    //In each call update the timer to UI
    labelTimer.innerText = `${min}:${sec}`;
    //when 0 seconds stop the timer
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }
    // reduce 1s
    time--;
  };
  // Set time to 5 min
  let time = 6 * 60;
  //call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
///////////////////////////////////////

// const euroToUsd = 1.1;
// const totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * euroToUsd)
//   .reduce((acc, mov) => acc + mov, 0);
// // console.log(totalDepositsUSD);

// const movementsUsd = movements.map(mov => mov * euroToUsd);

// const movementsDescriptions = movements.map(
//   (mov, i) =>
//     `Movement ${i + 1}: You ${mov > 0 ? 'deposit' : 'withdrew'} ${Math.abs(
//       //Math.abs returns the absolute value (-5 will be treated as 5)
//       mov
//     )}`
// );

// // FAKE ACCOUNT LOGIN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = '1';

// const now = new Date();
// const day = `${now.getDate()}`.padStart(2, 0); //pad start will add 0 to remaining places from the start
// const month = `${now.getMonth()}`.padStart(2, 0);
// const year = now.getFullYear();
// console.log(year);
// const hour = now.getHours();
// const min = now.getMinutes();
// const sec = now.getSeconds();
// labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
// const withdrawals = movements.filter(mov => mov < 0);
// console.log(withdrawals);

// CHALLENGE 2
// const array1 = [5, 2, 4, 1, 15, 8, 3];
// function dogToHumanAge(ageArray) {
//   const dogHumanAge = ageArray.map(dogAge =>
//     dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4
//   );
//   console.log(dogHumanAge);

//   const adultDogs = dogHumanAge.filter(dogAge => dogAge >= 18);
//   console.log(adultDogs);

//   const avgHumanDogAge = adultDogs.reduce(
//     (acc, age, i, arr) => acc + age / arr.length,
//     0
//   );

//   console.log(avgHumanDogAge);
// }
// dogToHumanAge(array1);
// END OF CHALLENGE 2

//flat gives a single array from nested  array of n level
// const arr = [1, 2, 3, 4, [5, 6, [22, 4, 55, [67, [87, [765]]]], 7], 9, 67];
// console.log(arr.flat(5));

// flatMap is combination of flat and map methods

// const totalAccountsBalance = accounts
//   .flatMap(account => account.movements)
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(totalAccountsBalance);

// console.log(
//   Array.from({ length: 100 }, (_, i) => Math.floor(i * Math.random()))
// );

// challenge 1
// const numDeposit1000 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((count, curr) => (curr >= 1000 ? ++count : count), 0);
// console.log(numDeposit1000);

// challenge 2
// const dep$with = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sum, curr) => {
//       // curr >= 0 ? (sum.deposit += curr) : (sum.withdrawal += curr);
//       //Object Bracket Notation
//       sum[curr > 0 ? 'deposit' : 'withdrawal'] += curr;
//       return sum;
//     },
//     { deposit: 1, withdrawal: 2 }
//   );
// console.log(dep$with);

// challenge 3

// function convertTitleCase(title) {
//   const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];
//   function capitalize(word) {
//     return word[0].toUpperCase() + word.slice(1);
//   }

//   return capitalize(
//     title
//       .toLowerCase()
//       .split(' ')
//       .map(word => (exceptions.includes(word) ? word : capitalize(word)))
//       .join(' ')
//   );
// }

// console.log(convertTitleCase('and here is another titlw with an example'));

// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];
// //1
// dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));
// console.log(dogs);
// //2
// const sarahsDog = dogs.find(dog => dog.owners.includes('Sarah'));
// const sarahDogApetite =
//   sarahsDog.recFood > sarahsDog.curFood
//     ? 'Eating too much'
//     : 'Eating too little';
// console.log(sarahDogApetite);
// //3
// const ownersEatTooLittle = dogs
//   .filter(dog => dog.recFood > dog.curFood)
//   .map(dog => dog.owners)
//   .flat();
// console.log(ownersEatTooLittle);
// const ownersEatTooMuch = dogs
//   .filter(dog => dog.recFood < dog.curFood)
//   .map(dog => dog.owners)
//   .flat();
// console.log(ownersEatTooMuch);
// //4
// console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
// console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);
// //5
// console.log(dogs.some(dog => dog.curFood === dog.recFood));
// //6
// console.log(
//   dogs.some(
//     dog => dog.curFood <= 1.1 * dog.recFood && dog.curFood >= 0.9 * dog.recFood
//   )
// );
// //7
// const goodApetite = dogs.filter(
//   dog => dog.curFood <= 1.1 * dog.recFood && dog.curFood >= 0.9 * dog.recFood
// );
// console.log(goodApetite);
// //8
// const sortedDogs = dogs.slice().sort((d1, d2) => d1.recFood - d2.recFood);

// console.log(sortedDogs);

// conversions
// console.log(Number('23'));
// console.log(+'23');

// //Parsing
// console.log(Number.parseInt('30px', 10));
// console.log(Number.parseInt('er30px', 10)); // 10 is decimal number base

// //chekcing is value is finite
// console.log(Number.isFinite('20'));
// console.log(Number.isFinite(20));
// console.log(Number.isFinite('hello12'));
// console.log(Number.isFinite(16 / 0));

// //chekcing is value is integer
// console.log(Number.isInteger('20'));
// console.log(Number.isInteger(20));
// console.log(Number.isInteger('hello12'));
// console.log(Number.isInteger(16 / 0));
