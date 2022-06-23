// transakcije za sve u banci i u atmu
// skontat da se automatski pusha u glavni array bp
// zavrsiti transfermoney u banci
//testirati close acc close atm

// array with all banks, all atms and all people
const DB = []
const BANKS = []
const ATMS = []
const PEOPLE = []

const addAllToDB = () =>{       // function for add all into database
    DB.push(BANKS,ATMS,PEOPLE)
}

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
const generateJMBG = (date, gender, birthPlace) => {
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
    if (birthPlace == "Tuzla") {
        JMBG += 18
    }
    else {
        JMBG += Math.trunc(Math.random() * (19 - 14 + 1)) + 14;
    }

    //V group of JMBG
    if (gender == "M") {

        JMBG += Math.trunc(Math.random() * 499)
    }
    else if (gender = "F") {
        JMBG += Math.trunc(Math.random() * 999 + 500)

    }

    //VI group of JMBG
    JMBG += Math.floor(Math.random() * 9);


    return JMBG;
}


class Person {
    firstName;
    lastName;
    jmbg;
    birthDate;
    hasAccInBank;
    gender;
    birthPlace;
    cards = [] // list of cards person have
    constructor(firstName, lastName, gender, birthPlace) {
        this.firstName = firstName,
            this.lastName = lastName,
            this.birthDate = generateBirthDate(),
            // this.jmbg = generateJMBG(this.birthDate, this.gender, this.birthPlace),
            this.jmbg = 1234,   // this is unique jmbg for all persons, for only testing purpose. In reality jmbg is randomly generate
            this.gender = gender
        this.birthPlace = birthPlace
        this.hasAccInBank = false


    }
    addPersonToDB(person) {      // method for adding person into database
        PEOPLE.push(person)
    }
    insertCardInAtm() { console.log(`Hello ${this.firstName} ${this.lastName} please enter your pin code.`); }
    removeCardFromAtm(person) { console.log(`Thank you ${this.firstName} ${this.lastName} for being our customer. Please take card.`); }
}


class Atm {
    static atmID = 1;
    bankName;
    bank_ID;
    balance = 0;
    atmLocation;
    isWorking;
    constructor(atmLocation) {
        this.atm_ID = Atm.atmID++;
        this.atmLocation = atmLocation
        this.isWorking = false
    }
    addAtmToDB(atm) {
        ATMS.push(atm)
    }
    depositMoney(person, cardID, pin, amount) {
        if (this.isWorking) {       // first condition is that atm is working
            person.cards.forEach(card => {
                if (card.card_ID = cardID) {    // after that condition is that right card is used
                    const bankID = card.bank_ID
                    if (person.pin == pin && bankID == this.bank_ID) {  // checking if pin is correct
                        for (let i = 0; i < BANKS.length; i++) {
                            const bank = BANKS[i];
                            if (bank.bankName == card.bankName) {   // checking if bank is correct
                                bank.bankAccounts.forEach(account => {
                                    if (account.bankAccount_ID == card.bankAccount_ID) {
                                        account.balance += amount
                                        bank.bankBudget += amount
                                    }
                                });
                            } else {            // if not then 10% is added for transaction cost
                                bank.bankAccounts.forEach(account => {
                                    if (account.bankAccount_ID == card.bankAccount_ID) {
                                        account.balance += amount * 1.1
                                        bank.bankBudget += amount * 1.1
                                    }
                                });

                            }
                        }
                    }
                    else console.log(`${person.firstName} ${person.lastName} your information is not valid.`)
                }
            });
        }
        else console.log("ATM is not working.")
    }

    witdrawMoney(person,cardID, pin, amount) {
            if (this.isWorking) {
                person.cards.forEach(card => {
                    if (card.card_ID = cardID) {    
                        const bankID = card.bank_ID
                        if (person.pin == pin && bankID == this.bank_ID) { 
                            for (let i = 0; i < BANKS.length; i++) {
                                const bank = BANKS[i];
                                if (bank.bankName == card.bankName) {   
                                    bank.bankAccounts.forEach(account => {
                                        if (account.bankAccount_ID == card.bankAccount_ID && account.balance >= amount) {
                                            account.balance -= amount
                                            bank.bankBudget -= amount
                                        }
                                        else console.log(`Nemate dovoljno sredstava na racunu`)
                                    });
                                } else {            // if not then 10% is added for transaction cost
                                    bank.bankAccounts.forEach(account => {
                                        if (account.bankAccount_ID == card.bankAccount_ID) {
                                            account.balance += amount * 1.1
                                            bank.bankBudget += amount * 1.1
                                        }
                                    });
    
                                }
                            }
                        }
                        else console.log(`${person.firstName} ${person.lastName} your information is not valid.`)
                    }
                });
            }
            else console.log("ATM is not working.")

    }
    checkBalance(person,cardID, pin) {
            if (this.isWorking) {
                person.cards.forEach(card => {
                    if (card.card_ID = cardID) {    
                        const bankID = card.bank_ID
                        if (person.pin == pin && bankID == this.bank_ID) { 
                            for (let i = 0; i < BANKS.length; i++) {
                                const bank = BANKS[i];
                                if (bank.bankName == card.bankName) {   
                                    bank.bankAccounts.forEach(account => {
                                        if (account.bankAccount_ID == card.bankAccount_ID) {
                                            console.log(`${person.firstName} ${person.lastName} vas racun iznosi ${account.balance}`);
                                        }
                                    });
                                } 
                            }
                        }
                        else console.log(`${person.firstName} ${person.lastName} your information is not valid.`)
                    }
                });
            }
            else console.log("ATM is not working.")

    }
    OpenToBuissnesAtm() {
        this.isWorking = true;
    }
}


class Account extends Person {
    static accountid = 1;
    #pin;               // pin code
    bankAccount_ID;     // account number
    balance;               // balance on account
    accountCreated; // time and date when is acc created
    constructor(firstName, lastName, gender, birthPlace) {
        super(firstName, lastName, gender, birthPlace);
        this.bankAccount_ID = Account.accountid++,
            this.balance = 0;
        this.hasAccInBank = true
        this.accountCreated = getDateAndTime() // time and date when acc is created
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
    static employeeID = 1;
    bank_ID;
    bankName;
    bankAccounts = []       // array with all accounts in bank
    bankTransactions = []      // array with all transaction in bank
    bankToAtmTransactions = []  // array with transactions from bank to atms
    atmTransactions = []           // array with all transaction in atms
    allUsers = []                   // all users in bank
    bankLocation;
    bankBudget;         // starting budget for banks
    bankCards = [];          // array with all cards in bank
    employees = []              // array with all employees in bank
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
        this.employees = []

    }
    addBankToDB(bank) {
        BANKS.push(bank)
    }
    findAccount(accountID,jmbg, use = 1) { // type "use" if you want use account further
        this.bankAccounts.forEach(account => {
            if(accountID == account.bankAccount_ID && account.jmbg == jmbg) {
              if (use == "use")  return account
                 else  return console.log(account) 
            }
        });
    }

    hireEmployee(person) {
        person.employee_ID = Bank.employeeID++
        person.hasAccInBank = false
        person.isEmployed = true
        person.employeeBankID = this.bank_ID
        person.employeeBankName = this.bankName
        this.employees.push(person)
    }
    fireEmploye(person) {
        this.employees.forEach(employee => {
            if (person.employee_ID = employee.employee_ID)
                this.employees.slice(this.employees.indexOf(employee), 1)
        });
        person.employee_ID = undefined;
        person.hasAccInBank = false
        person.isEmployed = false
        person.employeeBankID = undefined
        person.employeeBankName = undefined

    }
    getCreateAccount(person, cardType, employeeid) {    // method for retriving method for creating account
        this.employees.forEach(employee => {
            if (employee.employee_ID == employeeid) {   // only employee can create new account
                console.log("employee")
                this.#CreateAccount(person, cardType)
            }
        });
    }
    #CreateAccount(person, cardType) {

        let account = new Account(person.firstName, person.lastName, person.gender, person.birthPlace) // creating acc and adding
        let card = new Card(this.bankName, person.firstName, person.lastName, account.bankAccount_ID, cardType)
        // creating card, adding bank ID
        card.bank_ID = this.bank_ID
        person.hasAccInBank = true;
        person.cards.push(card)      // adding card to person
        account.setPin(1111) // it should be first pin generated with 4 random number but for purpose of testing is 1111
        person.pin = account.getPin()
        account.cards.push(card)
        account.bank_ID = this.bank_ID
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
    closeAccount(account_ID, person) {
        this.bankAccounts.forEach(account => {
            if (account_ID = account.bankAccount_ID) {
                this.bankAccounts.splice(this.bankAccounts.indexOf(account), 1)
                person.hasAccInBank = false
                person.pin = undefined
                person.cards.forEach(card => {
                    if (card.bank_ID == this.bank_ID) {
                        person.cards.splice(person.cards.indexOf(card), 1)
                    }
                });
            }
        });
    }
    issueCard(bankAccount_ID, person, cardType) {
        let card = new Card(this.bankName, person.firstName, person.lastName, bankAccount_ID, cardType)
        card.bank_ID = this.bank_ID
        person.cards.push(card)      // adding card to person
        this.bankAccounts.forEach(account => {
            if (account.bankAccount_ID == bankAccount_ID) {
                account.cards.push(card)
            }
        });
        this.bankCards.push(card)

    }
    revokeCard(cardID, person) {
        this.bankCards.forEach(card => {
            if (card.card_ID == cardID) {
                this.bankCards.splice(this.bankCards.indexOf(card, 1))
            }
            person.pin = undefined
        });

    }
    addAtm(atm) {
        atm.bankName = this.bankName
        atm.bank_ID = this.bank_ID
    }
    addMoneyToAtm(atmID, amount) {
        ATMS.forEach(atm => {
            if (atm.atm_ID == atmID) {
                atm.balance += amount
                this.bankBudget -= amount
            }

        });
    }
    closeAtm(atmID) {
        ATMS.forEach(atm => {
            if (atm.atm_ID == atmID) {
                this.bankBudget += atm.balance
                atm.balance = 0
                this.isWorking = false
            }
        });
    }
    deposit(account_ID1, amount) {
        this.accounts.forEach(account => {
            if (account.account_ID == account_ID1) {
                account.balance += amount;
                this.bankBudget += amount
                // this.transactions.push(createTransaction( account.firstName, account.lastName, transactions.length, "deposit", account.account_ID, account.JMBG, deposit));
            }

        });


    }
    withdraw(account_ID1, amount) {
        this.accounts.forEach(account => {
            if (account.account_ID == account_ID1) {
                if (account.balance >= amount) {
                    account.balance -= amount;
                    // this.transactions.push(createTransaction(account.firstName, account.lastName, transactions.length, "withdraw", account.account_ID, account.JMBG, withdraw));
                }
                else console.log("Na  akauntu broj " + account.account_ID + " nemate dovoljno sredstava na racunu");
            }

        });


    }
    checkBalance(account_ID1) {
        this.accounts.forEach(account => {
            if (account.account_ID == account_ID1) {
                console.log(`Vas racun iznosi ${account.balance}`);
                // this.transactions.push(createTransaction(account.firstName, account.lastName, transactions.length, "check Balance", account.account_ID, account.JMBG, account.balance));
            }
        });
    }
    transferMoney(account_ID1, account_ID2, amount) { // account1 is account from which are send money, account2 is acc to which are
        this.accounts.forEach(account1 => {             // sent money
            this.accounts.forEach(account2 => {

                if (account1.account_ID == account_ID1 && account2.account_ID == account_ID2) {

                    this.account1.balance -= amount;
                    this.account2.balance += amount;
                    // this.transactions.push(createTransactionForTransferingMoney( account.bank_ID,account.firstName, account.lastName, account1.firstName, account1.lastName, transactions.length, "transfer money", account.account_ID, account1.account_ID, account.JMBG, account1.JMBG, amount)) 
            }                
            });

        });
    }
}




class Card {
    static cardId = 1;
    card_ID;
    bank_ID;
    firstName;
    lastName;
    bankName;
    bankAccount_ID; // account in bank
    cardType;   // type of card, maestro, visa etc
    validFrom; // date when card is created
    validTo;     // date until card is valid
    constructor(bankName, firstName, lastName, bankAccount, cardType) {
        this.card_ID = Card.cardId++
        this.bankName = bankName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.bankAccount_ID = bankAccount;
        this.cardType = cardType;   // type : maestro, visa 
        this.validFrom = getDateAndTime().slice(0, 9);  // dates for issuing card and until card is valid
        this.validTo = getDateAndTimeForDateTo();
    }

}
const bank1 = new Bank("banka", "tuzla", 10000)
const bank2 = new Bank("banka1", "tuzla", 111)
BANKS.push(bank1)
const adis = new Person("Adis", "Aljic", "M", "Tuzla")
adis.addPersonToDB(adis)
const radnik = new Person("radnik", "prezime", "F", "Tuzla")
const radnik1 = new Person("radnik", "prezime", "F", "Tuzla")
bank1.hireEmployee(radnik)
bank1.getCreateAccount(adis, "Maestro", 1)
// bank1.changePinCode(adis, 1, 7759)
const atm1 = new Atm("Tuzla")
ATMS.push(atm1)

// PEOPLE.push(adis,radnik,radnik1)
atm1.OpenToBuissnesAtm()
bank1.addAtm(atm1)
bank1.addMoneyToAtm(1, 1000)
adis.insertCardInAtm()
// console.log(adis)
// bank1.issueCard(1, adis, "visa")
atm1.depositMoney(adis, 1, 1111, 100)
atm1.witdrawMoney(adis, 1, 1111, 1000)
atm1.checkBalance(adis, 1, 1111)
// console.log(bank1.bankAccounts)
// 
// const emp = new Employee(radnik)
// console.log(adis)
// bank1.hireEmployee(radnik1)
// console.log(bank1.bankAccounts)
// console.log(adis)
// console.log(atm1)
// console.log(bank1.bankAccounts)
bank1.findAccount(1,1234)