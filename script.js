'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
    movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const accounts = [account1, account2, account3, account4];

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
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

//////////////// timer for logout

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    // Decrease 1s
    time--;
  };

  // Set time to 5 minutes
  let time = 120;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};




///////////////////
const calcDisplayBalance = (acc) => {
  acc.balance = acc.movements.reduce((accumulator, value)=>{
    return accumulator + value;
  }, 0);
  labelBalance.textContent = `${acc.balance} EURO`;
}

// calcDisplayBalance(account1.movements);

const calcDisplaySummary = (receivedAccount) => {
  const incomes = receivedAccount.movements.filter
  (function (value){return value > 0}).reduce(function(accumulator, value){
    return accumulator + value;
  }, 0);
  const out = receivedAccount.movements.filter
  (function (value){return value < 0}).reduce(function(accumulator, value){
    return accumulator + value;
  }, 0);

  const interest = receivedAccount.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * receivedAccount.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumIn.textContent = `${incomes}€`;
  labelSumOut.textContent = `${Math.abs(out)}€`;
  labelSumInterest.textContent = (`${Math.abs(interest)}€`);

  
}

// calcDisplaySummary(account1.movements);


const displayMovements = function (acc, sort = false){
  containerMovements.innerHTML = '';
  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (move, index){
    const type = move > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[index]);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    const displayDate = `${day}/${month}/${year}`;
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${index+1} ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${move}€</div>
      </div>
      `;
      containerMovements.insertAdjacentHTML('afterbegin', html);

  });
}

// displayMovements(account1.movements);




const createUsernames = (name) =>{
  name.forEach(accountName =>{
    accountName.username = accountName.owner.toLowerCase().split(' ').map(function (value){
    return value[0]
    }).join('');
  })
  
}


createUsernames(accounts);
console.log(accounts);
const updateUI = (currentAccount) =>{
  /// display UI and message
    labelWelcome.textContent = `Welcome Back ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    ////Display movements
    displayMovements(currentAccount);
    ///Display Balance
    calcDisplayBalance(currentAccount);
    ////Display summary
    calcDisplaySummary(currentAccount);
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
}

let currentAccount, timer;
btnLogin.addEventListener('click', function(e){
  e.preventDefault();
  currentAccount = accounts.find(function(acc){
    return acc.username === inputLoginUsername.value;
  });
  console.log(currentAccount);

  if(currentAccount && currentAccount.pin === Number(inputLoginPin.value)){   // (currentAccount?.pin ///optional channing === Number(inputLoginPin.value)) /// (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) check if current account exist
    console.log('loged in');
    if(timer) clearInterval(timer);
    timer = startLogOutTimer();
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    setTimeout(() => {
      currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
    }, 4000);
  }
  inputLoanAmount.value = '';
});


let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});





















/////////////////////////











const movements =  [200, 450, -400, 3000, -650, -130, 70, 1300];

const deposits = movements.filter(function(value){
  return value > 0;
});
console.log(deposits);

const withdrawal = movements.filter(value=> value < 0);
console.log(withdrawal);

const balancee = movements.reduce(function(sumValue, value, index, wholeArray){
  return sumValue + value;
}, 0);  /// 0 here is the sumvalue at the start it will be 0
console.log(balancee);

// const USDarry = movements.map((value)=>value * 1.1)
// const USDarr = movements.map((value, index)=>{
//   return `Movement :${index+1} You ${value > 0 ? 'Deposited': 'withdrew'} ${Math.abs(value)}`
// })
// console.log(USDarr);


// const dogAgeCheck = () =>{

// }

// const Julia = [3, 5, 2, 12, 7];
// const Kate = [4, 1, 15, 8, 3];

// const checkDogs = (dogsJulia, odgsKate) =>{
//   const juliaDogs = dogsJulia.slice(1, -2);
  // const juliaDogs = dogsJulia.slice();
  // juliaDogs.splice(0,1);
  // juliaDogs.splice(-2);
  // const allDogs = juliaDogs.concat(odgsKate);
  // allDogs.forEach(function(dogs, index){
  //   console.log(`${dogs > 3 ? `Dog Number ${index+1} is an adult and ${dogs} years old \n`: `Dog Number ${index+1} is a puppy and ${dogs} years old \n`}`)
  // })

  // juliaDogs.forEach(function(dogs, index){
  //   console.log(`${dogs > 3 ? `Julia Dog Number ${index+1} is an adult and ${dogs} years old \n`: `Dog Number ${index+1} is a puppy and ${dogs} years old \n`}`)
  // })
  // odgsKate.forEach(function(dogs, index){
  //   console.log(`${dogs > 3 ? `Kate Dog Number ${index+1} is an adult and ${dogs} years old \n`: `Dog Number ${index+1} is a puppy and ${dogs} years old \n`}`)
  // })
  
// }

// checkDogs(Julia, Kate);
/////////////////////////////////////////////////



// // /// Slice method

// // let arr = ['a', 'b', 'c', 'd', 'e'];

// // console.log(arr.slice());  // shallow copy
// // console.log(arr.slice(2)); // c,d,e
// // console.log(arr.slice(2,4)); // c,d
// // console.log(arr.slice(-1)); // e
// // //console.log(arr.slice(-1,-3)); // e,d,c
// // console.log(arr.slice(1,-3)); // a,b

// // //// Splice do the same functionality but mutate the original array

// // /// reverse

// // console.log(arr);
// // console.log(arr.reverse()); /// it reverse the array but also mutate the original array
// // console.log(arr);

// // /// Concat

// // let arr2 = ['a', 'b', 'c', 'd', 'e'];

// // const letter = arr.concat(arr2);
// // console.log(letter);
// // console.log([...arr, ...arr2]); /// give same result

// // /// join
// // console.log(letter.join('-'));

// // /// At method

// // console.log('array'.at(-1));
// // console.log(arr[arr.length-1]);
// // console.log(arr.at(-1));


// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for(const [index , values] of movements.entries()){
//   if(values > 0){
//     console.log(`Movement at ${index}, You deposited ${values}`);
//   }
//   else{
//     console.log(`Movement at ${index}, Nothing Deposited`);
//   }
// }


// console.log('-----------------forEach----------');
// movements.forEach(function(movement, index, array){ // array is whole array  ///call back function, higher order
//   if(movement > 0){
//     console.log(`Movement at ${index}, You deposited ${movement}`);
//   }
//   else{
//     console.log(`Movement at ${index}, Nothing Deposited`);
//   }
// });

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);