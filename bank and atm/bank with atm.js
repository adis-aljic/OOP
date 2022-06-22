// array with all banks, all atms and all people
const DB = []
const BANKS = []
const ATMS = []
const PEOPLE = []


const generateBirthDate = () => {
    //check for leapYear
    function isLeapYear(year) {
        return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
    }

    let dateOfBirth = '';
    //get current year to generate a valid year of birth
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    //generate a random year that is in the range of the current year and 100 years ago
    const year = Math.floor(Math.random() * (currentYear - (currentYear - 100) + 1) + (currentYear - 100));
    let month = Math.floor(Math.random() * 12 + 1);
    let day = 0;

    //generate a valid value for day 
    //if odd month then it has 31 days
    if (month % 2 !== 0) {
        //31 days
        day = Math.floor(Math.random() * 31 + 1);
    }
    //if even month than either 30 or 28/29 days 
    else if (month % 2 === 0) {
        //if february than 28 or 29 day depending on if it's a leap year or not
        if (month === 2) {
            if (isLeapYear(year)) {
                day = Math.floor((Math.random() * 29) + 1);
            } else {
                day = Math.floor((Math.random() * 28) + 1);
            }
        } else {
            //if it's not february and an even month then it has 30 days
            day = Math.floor((Math.random() * 30) + 1);
        }
    }

    //append 0 if day and/or month are one digit
    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }

    //format for date
    dateOfBirth = day + '.' + month + '.' + year;

    return dateOfBirth;
} 
const generateJMBG = (date) => {
    /*  JMBG je individualna i neponovljiva oznaka identifikacionih podataka o licu i sastoji se od 13 cifara svrstanih u 6 grupa, i to:
        I grupa dan rođenja (dvije cifre)
        II grupa mjesec rođenja (dvije cifre)
        III grupa godina rođenja (tri cifre)
        IV grupa broj registra JMB - registraciona područja (dvije cifre)
        V grupa kombinacija pola i rednog broja za lica rođena istog dana (tri cifre) - muškarci 000-499 - žene 500-999
        VI grupa kontrolni broj (jedna cifra). 
        Zakon on JMBG BiH: https://advokat-prnjavorac.com/zakoni/Zakon-o-JMB-BiH.pdf 
    */
    let JMBG = '';

    //I, II and III group of JMBG
    let dateOfBirthArray = date.split(".");
    const dayOfBirth = dateOfBirthArray[0];
    const monthOfBirth = dateOfBirthArray[1];
    //substring method gives us only the last three digits of yearOfBirth
    const yearOfBirth = dateOfBirthArray[2].slice(1);

    //add day, month and year to JMBG
    JMBG += dayOfBirth;
    JMBG += monthOfBirth;
    JMBG += yearOfBirth;

    //IV group of JMBG
    JMBG += Math.floor(Math.random() * (19 - 14 + 1)) + 14;

    //V group of JMBG
    JMBG += Math.floor(Math.random()*899 + 100)

    //VI group of JMBG
    JMBG += Math.floor(Math.random() * 9 + 1);

   
    return JMBG;
}


class Person {
    firstName;
    lastName;
    jmbg;
    birthDate;
    hasAccInBank;  
    constructor(firstName, lastName) {
        this.firstName = firstName,
            this.lastName = lastName,
            // this.jmbg = 1234,   // this is unique jmbg for all persons, for only testing purpose. In reality jmbg is randomly generate
            this.birthDate = generateBirthDate(),
            this.jmbg  = generateJMBG(this.birthDate), 
            this.hasAccInBank = false

    }

    insertCardInAtm() { console.log(`Hello ${this.firstName} ${this.lastName} please enter your pin code.`); }
    removeCardFromAtm(person) { console.log(`Thank you ${this.firstName} ${this.lastName} for being our customer. Please take card.`); }
}


class Atm {
    bankName;
    bank_ID;
    atmLocation;
    isWorking;      
    constructor(atmLocation) {
      
            this.atmLocation = atmLocation
        this.isWorking = false
    }
    depositMoney(person, pin, amount) {
        if (this.isWorking) {
            if (person.pin == pin && person.card.bank_ID == this.bank_ID) {
                for (let i = 0; i < BANKS.length; i++) {
                    const bank = BANKS[i];
                    if (bank.bankName == person.card.bankName) {
                        bank.bankAccounts.forEach(account => {
                            if (account.bankAccount_ID == person.card.bankAccount_ID) {
                                account.balance += amount
                            }
                        });
                    }
                }
            }
            else console.log(`${person.firstName} ${person.lastName} your information is not valid.`)
        }
        else console.log("ATM is not working.")
    }

    witdrawMoney(person, pin, bankName) { }
    checkBalance(person, pin, bankName) { }
    OpenToBuissnesAtm(bank) {
        this.isWorking = true;
    }
}


class User extends Person {             // object user only is created in purpose of having records of all users of bank
    bankName;
    constructor(firstName, lastName, jmbg, birthDate, bankName) {
        super(firstName, lastName, jmbg, birthDate);
        this.bankName = bankName;
    }
}


class Account extends User {
    #pin;               // pin code
    bankAccount_ID;     // account number
    balance;               // balance on account
    accountCreated; // time and date when is acc created
    constructor(firstName, lastName, jmbg, birthDate, bankName) {
        super(firstName, lastName, jmbg, birthDate, bankName);
        this.balance = 0;
        this.hasAccInBank = "Active Account"
        this.accountCreated = getDateAndTime()
    }
    setPin(pin) {       // for purpose of testing code will be added manualy, but it is supposed to be random four numbers with
        this.#pin = pin  // option for changing
    }
    getPin() {
        return this.#pin
    }
}
const getDateAndTime = () => {     //  for generating timestamp, time and date 
    const currentDate = new Date();
    return currentDate.toLocaleString();
}
const getDateAndTimeForDateTo = () => {         // generating date until card is valid (1year)
    const date = getDateAndTime().split("")
    const number = Number(date[8]) + 1
    date[8] = number
    return date.slice(0, 9).join("")

}

class Bank {

    static bankID = 1;         // bank id
    bankName;
    bankAccounts = []       // array with all accounts in bank
    bankTransactions = []      // array with all transaction in bank
    bankToAtmTransactions = []  // array with transactions from bank to atms
    atmTransactions = []           // array with all transaction in atms
    allUsers = []                   // all users in bank
    bankLocation;
    bankBudget;         // starting budget for banks
    bankCards;          // array with all cards in bank
    empleyees = []
    constructor(bankName, bankLocation, bankBudget) {
        this.bank_ID = Bank.bankID++,
            this.bankName = bankName,
            this.bankLocation = bankLocation,
            this.bankBudget = bankBudget,
            this.bankTransactions = [],
            this.bankToAtmTransactions = [],
            this.atmTransactions = [],
            this.bankAccounts = [],
            this.bankCards = []
            this.empleyees = [{name:"emplye" , employeeID: 1}]

    }
    getCreateAccount (person,cardType, employeeID){
        this.empleyees.forEach(employee => {
            
            if (employee.employeeID == employeeID)
            this.#CreateAccount(person,cardType)
        });
    }
    #CreateAccount(person, cardType) {   
        // let user = new User(person.firstName, person.lastName, person.jmbg, person.birthDate, this.bankName) // creating user and pushing it in array in bank
        let account = new Account(person.firstName, person.lastName, person.jmbg, person.birthDate, this.bankName) // creating acc and adding
        account.bankAccount_ID = this.bankAccounts.length + 1    // account id, set pin code and bank id to account, and pushing it into array in bank
        let card = new Card(this.bankName, person.firstName, person.lastName, account.bankAccount_ID, cardType) // creating card, adding bank ID
        card.bank_ID = this.bank_ID
        person.hasAccInBank = true;
        person.card = card      // adding card to person
        // user.hasAccInBank = true        //chancing users/persons status to having account in bank
        account.setPin(1111) // it should be first pin generated with 4 random number but for purpose of testing is 1111
        person.pin = account.getPin()
        // user.bankAccount_ID = account.bankAccount_ID
        account.bank_ID = this.bank_ID
        // this.allUsers.push(user)
        this.bankAccounts.push(account)
        this.bankCards.push(card)
    }
    changePinCode(person, bankAccount_ID, newPinCode) { // method for changing pin code
        this.bankAccounts.forEach(account => {
            if (account.bankAccount_ID == bankAccount_ID && account.jmbg == person.jmbg &&
                 newPinCode < 10000 && newPinCode > 999 && !isNaN(newPinCode)) {
                account.setPin(newPinCode)
                person.pin = account.getPin()
                console.log(`Hello ${person.firstName} ${person.lastName}, you are succesfuly changed your pin code. 
                Your new code is ${person.pin} `)
            }
            else console.log(`Pin code is invalid. Please enter pin code as combination of 4 numbers.`)
        });

    }
    closeAccount(user) { }
    revokeCard(account_ID) {

    }
    addAtm(atm) {
        atm.bankName = this.bankName
        atm.bank_ID = this.bank_ID
    }
    #addMoneyToAtm() { }
    #closeAtm(amount, bank) {
        this.isWorking = false
    }
    depositMoney(user, accountID) { }
    witdrawMoney(user, accountID) { }
    checkBalance(user, accountID) { }
    transferMoney(user, fromAccountID1, toAccountID2, amount) { }

}


class Card {
    bankName;
    firstName;
    lastName;
    bankAccount_ID;
    cardType;
    validFrom; // date when card is created
    validTo;     // date until card is valid
    constructor(bankName, firstName, lastName, bankAccount, cardType) {
        this.bankName = bankName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.bankAccount_ID = bankAccount;
        this.cardType = cardType;   // type : maestro, visa 
        this.validFrom = getDateAndTime().slice(0, 9);  // dates for issuing card and until card is valid
        this.validTo = getDateAndTimeForDateTo();
    }

}
const bank1 = new Bank( "banka", "tuzla", 111)
const bank2 = new Bank( "banka1", "tuzla", 111)
BANKS.push(bank1)
const adis = new Person("Adis", "Aljic")
bank1.getCreateAccount(adis, "Maestro",1)
// bank1.changePinCode(adis, 1, 7759)
const atm1 = new Atm("tyzla")
atm1.OpenToBuissnesAtm()
bank1.addAtm(atm1)
adis.insertCardInAtm()
// console.log(adis.pin)
atm1.depositMoney(adis, 1111, 100)

// console.log(adis)

console.log(bank1)