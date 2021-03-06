

const { timeStamp } = require("console")
const { createCipheriv } = require("crypto")
const { get } = require("http")
const { type } = require("os")

// array with all banks, all atms and all people
const BANKS = []
const ATMS = []
const PEOPLE = []
const DB = [BANKS, ATMS, PEOPLE]


// functions for generating birth date and jmbg using previusly generated birth date
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
    /*  
        I group day of birth (two digits)
        II group month of birth (two digits)
        III group year of birth (last three digits)
        IV group- place of birth, from 14 to 19 -  (two digits) 
        V group  (three digits) - male 000-499  female 500-999
        VI group control digit 
    FM
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
// class for creating person

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
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthDate = generateBirthDate();
        // this.jmbg = generateJMBG(this.birthDate, this.gender, this.birthPlace),
        this.jmbg = 1234;   // this is unique jmbg for all persons, for only testing purpose. In reality jmbg is generate in 
        this.gender = gender;   // real life format using generated birth date
        this.birthPlace = birthPlace;
        this.hasAccInBank = false;


    }
    addPersonToDB(person) {      // method for adding person into database
        PEOPLE.push(person)
    }
    insertCardInAtm() { console.log(`Hello ${this.firstName} ${this.lastName} please enter your pin code.`); }
    removeCardFromAtm() { console.log(`Thank you ${this.firstName} ${this.lastName} for being our customer. Please take card.`); }
}



// class for creating transaction inside bank
class Transaction_ID extends Person {
    static ID_transcation = 1;

    transaction_ID;
    type;
    bankAccount_ID;
    amount;
    hasAccInBank;
    constructor(firstName, lastName, type, bankAccount_ID, jmbg, gender, amount) {
        super(firstName, lastName, jmbg, gender)
        this.transaction_ID = "TransInBank_" + Transaction_ID.ID_transcation++;
        this.firstName = firstName;
        this.lastName = lastName;
        this.bankAccount_ID = bankAccount_ID;
        this.type = type;
        this.amount = amount
        this.jmbg = jmbg;
        this.gender = gender;
        this.hasAccInBank = true;
        this.time = getDateAndTime().substring(11);
        this.date = getDateAndTime().substring(0, 10);
    }

}

// function for deleting all values of properties which are eather empty array or undefined
const deleteUndefinedValuesInObject = (obj) => {
    Object.keys(obj).forEach(key => {
        if (obj[key] === undefined) {
            delete obj[key];
        }
        else if (obj[key].length === 0) {
            delete obj[key];
        }
    });
}

// class for creating transaction from atms

class ATMTransaction_ID extends Person {
    static ID_transcation = 1;
    transaction_ID;
    atmID;
    type;
    bankAccount_ID;
    amount;
    hasAccInBank;
    constructor(firstName, lastName, atmID, type, bankAccount_ID, jmbg, gender, amount) {
        super(firstName, lastName, jmbg)
        this.transaction_ID = "TransATM_" + Transaction_ID.ID_transcation++
        this.firstName = firstName;
        this.lastName = lastName;
        this.atmID = atmID;
        this.jmbg = jmbg;
        this.gender = gender;
        this.bankAccount_ID = bankAccount_ID;
        this.type = type;
        this.hasAccInBank = true;
        this.amount = amount;
        this.time = getDateAndTime().substring(11);
        this.date = getDateAndTime().substring(0, 10);
    }
}

// class for creating transactions between bank and employer
class EmployeeTransactions extends Person {
    static ID_employeeTranscation = 1;
    employeeTransaction_ID;
    type;
    constructor(firstName, lastName, type, birthDate, jmbg, gender) {
        super(firstName, lastName, jmbg, birthDate, gender)
        this.employeeTransaction_ID = "TransEmployee_" + EmployeeTransactions.ID_employeeTranscation++;
        this.firstName = firstName;
        this.lastName = lastName;
        this.jmbg = jmbg;
        this.type = type;
        this.birthDate = birthDate;
        this.gender = gender;
        this.time = getDateAndTime().substring(11);
        this.date = getDateAndTime().substring(0, 10);
    }
}


// class for adding money from bank to atms
class ATMTransaction {
    static ID_atmTranscation = 1;
    atmTransactionsID;
    bankName;
    atmID;
    atmLocation;
    amount;
    type;
    constructor(bankName, atmID, atmLocation, amount, type) {
        this.atmTransactionsID = "TransAddMoneyToAtm_" + ATMTransaction.ID_atmTranscation++;
        this.bankName = bankName;
        this.atmID = atmID;
        this.atmLocation = atmLocation;
        this.amount = amount;
        this.type = type;
        this.time = getDateAndTime().substring(11);
        this.date = getDateAndTime().substring(0, 10);
    }
}

// Class for creating all transactions regarding accounts
class AccountTransactions extends Person {
    static ID_accountTransaction = 1;
    accountTransactionsID;
    bankAccount_ID;
    pinCode;
    type;
    constructor(firstName, lastName, jmbg, bankAccount_ID, pinCode, type) {
        super(firstName, lastName, jmbg)
        this.accountTransactionsID = "TransAcc_" + AccountTransactions.ID_accountTransaction++;
        this.firstName = firstName;
        this.lastName = lastName;
        this.jmbg = jmbg
        this.bankAccount_ID = bankAccount_ID;
        this.pinCode = pinCode;
        this.type = type;
        this.time = getDateAndTime().substring(11);
        this.date = getDateAndTime().substring(0, 10);
    }
}

// class for creating all transactions regarids credit cards
class CardTransactions extends Person {
    static ID_cardTransaction = 1;
    cardTransactionsID;
    bankAccount_ID;
    cardID;     // id of card
    cardType;       // type of card: visa, maestro etc...
    pinCode;
    type;   // type of transaction

    constructor(firstName, lastName, bankAccount_ID, cardID, jmbg, cardType, pinCode, type) {
        super(firstName, lastName, jmbg)
        this.cardTransactionsID = "TransCreateCard_" + CardTransactions.ID_cardTransaction++;
        this.firstName = firstName;
        this.lastName = lastName;
        this.bankAccount_ID = bankAccount_ID;
        this.cardID = cardID;
        this.cardType = cardType;
        this.pinCode = pinCode;
        this.type = type;
        this.time = getDateAndTime().substring(11);
        this.date = getDateAndTime().substring(0, 10);
    }
}

// class for creating transactions when person change his/her pin 
class ChangePinTransaction extends Person {
    static ID_changePin = 1;
    changePinTransactionID;
    bankAccount_ID;
    type;
    oldPinCode;
    newPinCode;
    constructor(firstName, lastName, bankAccount_ID, type, oldPinCode, newPinCode) {
        super(firstName, lastName)
        this.changePinTransactionID = "TransChangePin" + ChangePinTransaction.ID_changePin++;
        this.firstName = firstName;
        this.lastName = lastName;
        this.bankAccount_ID = bankAccount_ID;
        this.type = type;
        this.oldPinCode = oldPinCode;
        this.newPinCode = newPinCode
        this.time = getDateAndTime().substring(11);
        this.date = getDateAndTime().substring(0, 10);
    }
}

// class for creating transactions between two accounts in bank
class TransactionBetweenAccounts {
    static ID_TransactionBetweenAcoounts = 1;
    transaction_ID;
    firstNameSender;
    lastNameSender;
    firstNameReciever;
    lastNameReciever;
    type;
    SenderAccount_ID;
    RecieverAccount_ID;
    JMBGSender;
    JMBGReciever;
    amount;
    constructor(firstNameSender, lastNameSender, firstNameReciever, lastNameReciever, type, SenderAccount_ID, RecieverAccount_ID, JMBGSender, JMBGReciever, amount) {
        this.transaction_ID = `TransBeetweenAcc_` + TransactionBetweenAccounts.ID_TransactionBetweenAcoounts++;
        this.firstNameSender = firstNameSender;
        this.lastNameSender = lastNameSender;
        this.firstNameReciever = firstNameReciever;
        this.lastNameReciever = lastNameReciever;
        this.type = type;
        this.SenderAccount_ID = SenderAccount_ID;
        this.RecieverAccount_ID = RecieverAccount_ID
        this.JMBGSender = JMBGSender;
        this.JMBGReciever = JMBGReciever;
        this.amount = amount;
        this.time = getDateAndTime().substring(11)
        this.date = getDateAndTime().substring(0, 10)
    }
}


// class for creating atms
class Atm {
    static atmID = 1;
    atm_ID;
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
                    const bankID = card.bank_ID;
                    if (person.pin == pin) {  // checking if pin is correct
                        for (let i = 0; i < BANKS.length; i++) {
                            const bank = BANKS[i];
                            if (bank.bankName == card.bankName) {   // checking if bank is correct
                                bank.bankAccounts.forEach(account => {
                                    if (account.bankAccount_ID == card.bankAccount_ID) {
                                        account.hasAccInBank = true;
                                        account.balance += amount;
                                        bank.bankBudget += amount;
                                        const transaction = new ATMTransaction_ID(account.firstName, account.lastName, this.atm_ID, "Deposit", account.bankAccount_ID, account.jmbg, account.gender, amount);
                                        deleteUndefinedValuesInObject(transaction);
                                        bank.atmTransactions.push(transaction);
                                        console.log(`${person.firstName} ${person.lastName} you have deposit ${amount} into your account using our ATM.`);

                                    }
                                });
                            }
                        }
                    }
                    else console.log(`${person.firstName} ${person.lastName} your information is not valid.`);
                }
            });
        }
        else console.log(`ATM is not working.`);
    }
    withdrawMoney(person, cardID, pin, amount) {
        if (this.isWorking) {
            if (person.pin = pin) {
                console.log(`Your pin code is accepted, welcome ${person.firstName} ${person.lastName}.`)
                person.cards.forEach(card => {
                    if (card.card_ID == cardID) {
                        const bankID = card.bank_ID;
                        for (let i = 0; i < BANKS.length; i++) {
                            const bank = BANKS[i];
                            bank.bankAccounts.forEach(account => {
                                if (account.bankAccount_ID == card.bankAccount_ID && account.balance >= amount && this.bank_ID == card.bank_ID) {
                                    account.balance -= amount;
                                    bank.bankBudget -= amount;
                                    const transaction = new ATMTransaction_ID(account.firstName, account.lastName, account.jmbg, this.atm_ID, "Withdraw", account.bankAccount_ID, account.gender, amount)
                                    account.hasAccInBank = true
                                    deleteUndefinedValuesInObject(transaction);
                                    bank.atmTransactions.push(transaction);
                                    console.log(`${person.firstName} ${person.lastName} you have withdraw ${amount} from your account using our ATM.`);
                                }
                                else if (account.bankAccount_ID == card.bankAccount_ID && amount < account.balance && card.bank_ID == this.bank_ID) {
                                        console.log(`Your transaction at our ATM is denided, you have insuficient money for this transaction.`);
                                        const transaction = new ATMTransaction_ID(account.firstName, account.lastName, account.jmbg, this.atm_ID, "Insufficient money on account. Transaction declined.",
                                            account.bankAccount_ID, account.gender, amount);
                                        deleteUndefinedValuesInObject(transaction);
                                        bank.atmTransactions.push(transaction);
                                    }
                                
                                                    else if (account.bankAccount_ID == card.bankAccount_ID && this.bank_ID != card.bank_ID && account.balance >= amount) {            // if not then 10% is added for transaction cost
                                                        account.balance -= amount * 1.1;
                                                        bank.bankBudget -= amount * 1.1;
                                                        const transaction = new ATMTransaction_ID(account.firstName, account.lastName, account.jmbg, this.atm_ID, "Withdraw", account.bankAccount_ID, account.gender, amount);
                                                        deleteUndefinedValuesInObject(transaction);
                                                        transaction.hasAccInBank = false;
                                                        transaction.jmbg = person.jmbg;
                                                        transaction.atmID = this.atm_ID;
                                                        console.log(`${person.firstName} ${person.lastName} you have withdraw ${amount} from your account using ATM from bank ${this.bankName}.You will be charged with 10% provision.`);
                                                        bank.atmTransactions.push(transaction);
                                                    }
                                                    else if (account.bankAccount_ID == card.bankAccount_ID && this.bank_ID != card.bank_ID && account.balance < amount) {
                                                        console.log(`You are using atm from bank ${this.bankName} .Your transaction is denided, you have insuficient money for this transaction.`)
                                                        const transaction = new ATMTransaction_ID(account.firstName, account.lastName, account.jmbg, this.atm_ID, "Insufficient money on account. Transaction declined.",
                                                            account.bankAccount_ID, account.gender, amount)
                                                        deleteUndefinedValuesInObject(transaction)
                                                        bank.atmTransactions.push(transaction);
                                                    }
                                //                 }
                                //                 )

                            })
                        }
                    }
                });
            }
            else console.log(`${person.firstName} ${person.lastName} your information is not valid.`);
        }
        else console.log(`ATM is not working.`)
    }
    checkBalance(person, cardID, pin) {
        if (this.isWorking) {
            person.cards.forEach(card => {
                if (card.card_ID = cardID) {
                    const bankID = card.bank_ID;
                    if (person.pin == pin && bankID == this.bank_ID) {
                        for (let i = 0; i < BANKS.length; i++) {
                            const bank = BANKS[i];
                            if (bank.bankName == card.bankName) {
                                bank.bankAccounts.forEach(account => {
                                    if (account.bankAccount_ID == card.bankAccount_ID) {
                                        console.log(`${person.firstName} ${person.lastName} your account balance is ${account.balance}`);
                                        const transaction = new ATMTransaction_ID(account.firstName, account.lastName, this.atm_ID, "CheckBalance", account.bankAccount_ID, account.jmbg, account.gender, account.balance)
                                        account.hasAccInBank = true;
                                        deleteUndefinedValuesInObject(transaction)
                                        bank.atmTransactions.push(transaction);
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
        console.log(`ATM is open.`)
    }
}

// class for creating accounts in bank
class Account extends Person {
    static accountid = 1;
    #pin;               // pin code
    bankAccount_ID;     // account number
    balance;               // balance on account
    accountCreated; // time and date when is acc created
    constructor(firstName, lastName, jmbg, gender, birthPlace) {
        super(firstName, lastName, jmbg, gender, birthPlace);
        this.bankAccount_ID = Account.accountid++;
        this.jmbg = jmbg;
        this.gender = gender;
        this.birthPlace = birthPlace;
        this.balance = 0;
        this.accountCreated = getDateAndTime() // time and date when acc is created
    }
    setPin(pin) {       // for purpose of testing code will be added manualy, but it is supposed to be random four numbers with
        this.#pin = pin;  // option for changing
    }
    getPin() {
        return this.#pin;
    }
}


// functions for creating  timestamps and date until card is valid
const getDateAndTime = () => {
    const currentDate = new Date();
    return currentDate.toLocaleString();
}
const getDateAndTimeForDateTo = () => {
    const date = getDateAndTime().split("");
    const number = Number(date[8]) + 1;
    date[8] = number;
    return date.slice(0, 9).join("");
}


// class for creating banks
class Bank {
    static bankID = 1;         // bank id
    static employeeID = 1;
    bank_ID;
    bankName;
    bankAccounts = []       // array with all accounts in bank
    bankTransactions = []      // array with all transaction in bank
    bankToAtmTransactions = []  // array with transactions from bank to atms
    atmTransactions = []           // array with all transaction in atms
    employeesTransactions = []                   // all transaction regarding employees
    accountTransactions = []        // all transactions regarding accounts and cards in bank
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
        BANKS.push(bank);
    }
    findAccount(accountID, jmbg, use = 1) { // type "use" if you want use account further
        this.bankAccounts.forEach(account => {
            if (accountID == account.bankAccount_ID && account.jmbg == jmbg) {
                if (use == "use") return account;
                else return console.log(account);
            }
        });
    }
    hireManager(person) {
        person.role = "Manager";
        person.employee_ID = Bank.employeeID++
        person.isEmployed = true;
        person.employeeBankID = this.bank_ID;
        person.employeeBankName = this.bankName;
        this.employees.push(person);
        this.hasAccInBank = person.hasAccInBank;
        const transaction = new EmployeeTransactions(person.firstName, person.lastName, "hired", person.birthDate, person.jmbg, person.gender);
        deleteUndefinedValuesInObject(transaction);
        this.employeesTransactions.push(transaction);
        console.log(`${person.firstName} ${person.lastName} is hired as manager in bank ${this.bankName}.`)
    }
    hireEmployee(person, manager) {
        if (manager.role == "Manager") {
            person.employee_ID = Bank.employeeID++;
            person.hasAccInBank = false;
            person.isEmployed = true;
            person.employeeBankID = this.bank_ID;
            person.employeeBankName = this.bankName;
            this.employees.push(person);
            const transaction = new EmployeeTransactions(person.firstName, person.lastName, "hired", person.birthDate, person.jmbg, person.gender);
            deleteUndefinedValuesInObject(transaction);
            this.employeesTransactions.push(transaction);
            console.log(`${person.firstName} ${person.lastName} is hired as employee in bank ${this.bankName}.`);
        }
        else console.log(`You can't hire people, you are not manager.`);
    }
    fireEmploye(person, manager) {
        this.employees.forEach(employee => {
            if (employee.employee_ID = manager && person.employee_ID == employee.employee_ID) {
                person.employee_ID = undefined;
                person.hasAccInBank = false;
                person.isEmployed = false;
                person.employeeBankID = undefined;
                person.employeeBankName = undefined;
                this.employees.splice(this.employees.indexOf(employee), 1);
                const transaction = new EmployeeTransactions(person.firstName, person.lastName, "fired", person.birthDate, person.jmbg, person.gender);
                deleteUndefinedValuesInObject(transaction);
                deleteUndefinedValuesInObject(person);
                this.employeesTransactions.push(transaction);
                console.log(`${person.firstName} ${person.lastName} is fired from bank ${this.bankName}.`);
            }
        });
    }
    getCreateAccount(person, cardType, employeeid) {    // method for retriving method for creating account
        this.employees.forEach(employee => {
            if (employee.employee_ID == employeeid) {   // only employee can create new account
                this.#CreateAccount(person, cardType);
            }
        });
    }
    #CreateAccount(person, cardType) {
        person.hasAccInBank = true;
        let account = new Account(person.firstName, person.lastName, person.jmbg, person.gender, person.birthPlace);
        console.log(`${person.firstName} ${person.lastName} you have account in bank ${this.bankName} with account id ${account.bankAccount_ID}.`);
        account.hasAccInBank = true // creating acc and adding
        let card = new Card(this.bankName, person.firstName, person.lastName, account.bankAccount_ID, cardType);
        console.log(`${person.firstName} ${person.lastName} you have new ${cardType} card in bank ${this.bankName}.`);
        // creating card, adding bank ID
        card.bank_ID = this.bank_ID;
        person.cards.push(card)      // adding card to person
        account.setPin(1111) // it should be first pin generated with 4 random number but for purpose of testing is 1111
        person.pin = account.getPin();
        account.cards.push(card);
        const transaction = new CardTransactions(person.firstName, person.lastName, account.bankAccount_ID, card.card_ID, card.cardType, person.pin, "new Card")
        deleteUndefinedValuesInObject(transaction);
        this.accountTransactions.push(transaction);
        account.bank_ID = this.bank_ID
        this.bankAccounts.push(account);
        this.bankCards.push(card);
        const transaction1 = new AccountTransactions(person.firstName, person.lastName, person.jmbg, account.bankAccount_ID, person.pin, "Created Account");
        deleteUndefinedValuesInObject(transaction1);
        this.accountTransactions.push(transaction1);
    }
    changePinCode(person, bankAccount_ID, newPinCode) { // method for changing pin code
        this.bankAccounts.forEach(account => {
            if (account.bankAccount_ID == bankAccount_ID && account.jmbg == person.jmbg &&
                newPinCode < 10000 && newPinCode > 999 && !isNaN(newPinCode)) {
                const oldPinCode = person.pin;
                account.setPin(newPinCode);
                person.pin = account.getPin();
                console.log(`Hello ${person.firstName} ${person.lastName}, you are succesfuly changed your pin code. 
                    Your new code is ${person.pin}. `);
                const transaction = new ChangePinTransaction(person.firstName, person.lastName, account.bankAccount_ID, "Change pin", oldPinCode, person.pin);
                deleteUndefinedValuesInObject(transaction);
                this.accountTransactions.push(transaction);
            }
            else console.log(`Pin code is invalid. Please enter pin code as combination of 4 numbers.`);
        });
    }
    getCloseAccount(account_ID, person, employeeid) {    // method for retriving method for closing account
        this.employees.forEach(employee => {
            if (employee.employee_ID == employeeid) {   // only employee can close  account
                this.#closeAccount(account_ID, person);
                console.log(`${person.firstName} ${person.lastName}  your account, account ID ${account_ID}, is closed in bank ${this.bankName}`);
            }
        });
    }
    #closeAccount(account_ID, person) {
        this.bankAccounts.forEach(account => {
            if (account_ID == account.bankAccount_ID) {
                const transaction = new AccountTransactions(person.firstName, person.lastName, account.bankAccount_ID, person.pin, "Closed Account");
                deleteUndefinedValuesInObject(transaction);
                this.accountTransactions.push(transaction);
                this.bankAccounts.splice(this.bankAccounts.indexOf(account), 1);
                person.hasAccInBank = false;
                person.pin = undefined;
                person.cards.forEach(card => {
                    if (card.bank_ID == this.bank_ID) {
                        person.cards.splice(person.cards.indexOf(card), 1);
                    }
                });
            }
        });
        deleteUndefinedValuesInObject(person);
    }
    getIssueCard(bankAccount_ID, person, cardType, employeeid) {    // method for retriving method for issuing  new cards
        this.employees.forEach(employee => {
            if (employee.employee_ID == employeeid) {   // only employee can issue new carad
                this.#issueCard(bankAccount_ID, person, cardType);
            }
        });
    }
    #issueCard(bankAccount_ID, person, cardType) {
        let card = new Card(this.bankName, person.firstName, person.lastName, bankAccount_ID, cardType);
        card.bank_ID = this.bank_ID;
        person.cards.push(card);      // adding card to person
        console.log(`${person.firstName} ${person.lastName} you have new card. Card ID is ${card.card_ID}, ${card.cardType} card. `);
        this.bankAccounts.forEach(account => {
            if (account.bankAccount_ID == bankAccount_ID) {
                account.cards.push(card);
                const transaction = new CardTransactions(person.firstName, person.lastName, account.bankAccount_ID, card.card_ID, card.cardType, person.pin, "new Card");
                deleteUndefinedValuesInObject(transaction);
                this.accountTransactions.push(transaction);
            }
        });
        this.bankCards.push(card);
    }
    getRevokeCard(card_ID, person, employeeid) {    // method for retriving method for revoking  new cards
        this.employees.forEach(employee => {
            if (employee.employee_ID == employeeid) {   // only employee can revoke carad
                this.#revokeCard(card_ID, person);
                console.log(`${person.firstName} ${person.lastName} your card with ID ${card_ID} is revoked.`)
            }
        });
    }
    #revokeCard(cardID, person) {
        this.bankCards.forEach(card => {
            if (card.card_ID == cardID) {
                this.bankCards.splice(this.bankCards.indexOf(card, 1));
                person.cards.splice(person.cards.indexOf(card, 1));
                const transaction = new CardTransactions(person.firstName, person.lastName, card.bankAccount_ID, card.card_ID, card.cardType, person.pin, "revoked card");
                deleteUndefinedValuesInObject(transaction);
                this.accountTransactions.push(transaction);
            }
            person.pin = undefined
            deleteUndefinedValuesInObject(person)
        });
    }
    getAddAtm(atmName, employeeid) {    // method for retriving method for adding atms
        this.employees.forEach(employee => {
            if (employee.employee_ID == employeeid && employee.role == "Manager") {   // only employee can add atm
                this.#addAtm(atmName);
            }
        });
    }
    #addAtm(atmName) {
        atmName.bankName = this.bankName;
        atmName.bank_ID = this.bank_ID;
        const transaction = new ATMTransaction(this.bankName, atmName.atm_ID, atmName.atmLocation, "", "Add ATM");
        deleteUndefinedValuesInObject(transaction);
        this.atmTransactions.push(transaction);
        console.log(`ATM ${atmName.atm_ID} is added to bank ${this.bankName}.`);
    }
    getAddMoneyAtm(atmID, amount, employeeid) {    // method for adding money to atm
        this.employees.forEach(employee => {
            if (employee.employee_ID == employeeid && employee.role == "Manager") {   // only manager can add money to atm
                this.#addMoneyToAtm(atmID, amount);
            }
        });
    }
    #addMoneyToAtm(atmID, amount) {
        ATMS.forEach(atm => {
            if (atm.atm_ID == atmID) {
                atm.balance += amount;
                this.bankBudget -= amount;
                const transaction = new ATMTransaction(this.bankName, atm.atm_ID, atm.atmLocation, amount, "Add money to ATM");
                deleteUndefinedValuesInObject(transaction);
                this.bankToAtmTransactions.push(transaction);
                console.log(`You are suscesfuly added ${amount} money to ATM ${atmID} from ${this.bankName}.`);
            }
        });
    }
    getCloseAtm(atmID, employeeid) {    // method for closing  atm
        this.employees.forEach(employee => {
            if (employee.employee_ID == employeeid && employee.role == "Manager") {   // only manager can close atm
                this.#closeAtm(atmID);
                console.log(`ATM with ATM ID ${atmID} is suscesfluy closed.`);
            }
        });
    }
    #closeAtm(atmID) {
        ATMS.forEach(atm => {
            if (atm.atm_ID == atmID) {
                this.bankBudget += atm.balance;
                atm.balance = 0;
                this.isWorking = false;
                const transaction = new TransactionToAtm(this.bankName, atm.atm_ID, atm.atmLocation, "", "closed ATM");
                deleteUndefinedValuesInObject(transaction);
                this.atmTransactions.push(transaction);
            }
        });
    }
    deposit(account_ID1, amount) {
        this.bankAccounts.forEach(account => {
            if (account.bankAccount_ID == account_ID1) {
                account.balance += amount;
                this.bankBudget += amount;
                const transaction = new Transaction_ID(account.firstName, account.lastName, "Deposit", account.bankAccount_ID, account.jmbg, account.gender, amount);
                deleteUndefinedValuesInObject(transaction);
                this.bankTransactions.push(transaction);
                console.log(`${account.firstName} ${account.lastName} you made deposit via bank ${this.bankName} amount ${amount} into your account. `);
            }
        });
    }
    withdraw(account_ID1, amount) {
        this.bankAccounts.forEach(account => {
            if (account.bankAccount_ID == account_ID1) {
                if (account.balance >= amount) {
                    account.balance -= amount;
                    const transaction = new Transaction_ID(account.firstName, account.lastName, "Withdraw", account.bankAccount_ID, account.jmbg, account.gender, amount);
                    deleteUndefinedValuesInObject(transaction);
                    this.bankTransactions.push(transaction);
                    console.log(`${account.firstName} ${account.lastName} you withdraw via bank ${this.bankName} amount ${amount} from your account. `);

                }
                else console.log(`${account.firstName} ${account.lastName} you don't have enough money on account ${account.bankAccount_ID}`);
            }

        });


    }
    checkBalance(account_ID1) {
        this.bankAccounts.forEach(account => {
            if (account.bankAccount_ID == account_ID1) {
                console.log(`${account.firstName} ${account.lastName} your balance is ${account.balance}.`);
                const transaction = new Transaction_ID(account.firstName, account.lastName, "CheckBalance", account.bankAccount_ID, account.jmbg, account.gender, account.balance);
                deleteUndefinedValuesInObject(transaction);
                this.bankTransactions.push(transaction);
            }
        });
    }
    transferMoney(account_ID1, account_ID2, amount) { // account1 is account from which are send money, account2 is acc to which are
        this.bankAccounts.forEach(account1 => {             // sent money
            this.bankAccounts.forEach(account2 => {
                if (account1.bankAccount_ID == account_ID1 && account2.bankAccount_ID == account_ID2) {
                    account1.balance -= amount;
                    account2.balance += amount;
                    const transaction = new TransactionBetweenAccounts(account1.firstName, account1.lastName, account2.firstName, account2.lastName, "Transfering Money", account1.bankAccount_ID, account2.bankAccount_ID, account1.jmbg, account2.jmbg, amount);
                    deleteUndefinedValuesInObject(transaction);
                    this.bankTransactions.push(transaction);
                    console.log(`${account1.firstName} ${account2.lastName} you are suscesfuly sent ${amount} amount of money to ${account2.firstName} ${account2.lastName} account.`);
                }
            });
        });
    }
}



// class for creating credit cards
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



// TESTING

// creating two banks and adding banks to DB
const novaBanka = new Bank("Nova Banka", "Tuzla", 100000);
novaBanka.addBankToDB(novaBanka);
const NLB = new Bank("NLB", "Tuzla", 100000);
NLB.addBankToDB(NLB);

// creating 5 persons and adding them to DB, and creating two employees

const adis = new Person("Adis", "Aljic", "M", "Tuzla");
adis.addPersonToDB(adis);
const john = new Person("John", "Doe", "M", "Tuzla");   // employeeID = 1
john.addPersonToDB(john);
const jane = new Person("Jane", "Doe", "F", "Tuzla");       // employeeID = 2
jane.addPersonToDB(jane);
const wick = new Person("John", "Wick", "M", "LA");
wick.addPersonToDB(wick);
novaBanka.hireManager(john);
NLB.hireManager(jane);
const saban = new Person("Saban", "Sabanic", "M", "Ozdrinje");
saban.addPersonToDB(saban);
novaBanka.hireEmployee(saban, john);
// console.log(saban)
// console.log(john)
// creating four atms and adding two atms to each bank

const atm1 = new Atm("Slatina");
atm1.OpenToBuissnesAtm();
novaBanka.getAddAtm(atm1, 1);
atm1.addAtmToDB(atm1);
const atm2 = new Atm("Brcanska Malta");
atm2.OpenToBuissnesAtm();
novaBanka.getAddAtm(atm2, 1);
atm2.addAtmToDB(atm2);
const atm3 = new Atm("Slatina");
atm3.OpenToBuissnesAtm();
NLB.getAddAtm(atm3, 2);
atm3.addAtmToDB(atm3);
const atm4 = new Atm("Sjenjak");
atm4.OpenToBuissnesAtm();
NLB.getAddAtm(atm4, 2);
atm4.addAtmToDB(atm4);


// creating accounts for adis and wick in two banks, issuing and revoking card

novaBanka.getCreateAccount(adis, "Visa", 1);
NLB.getCreateAccount(wick, "Maestro", 2);
// console.log(novaBanka.bankAccounts)
// console.log(NLB.bankAccounts)
novaBanka.getIssueCard(1, adis, "Maestro", 1);
// console.log(adis.cards)
// console.log(novaBanka.bankCards)
novaBanka.getRevokeCard(3, adis, 1);
// console.log(adis.cards)
// console.log(novaBanka.bankCards)

// changing pin code 

novaBanka.changePinCode(adis, 1, 5555);
// console.log(adis.pin)

// closing account and firing employee

// console.log(NLB.bankAccounts)       // account id  = 2 
NLB.getCloseAccount(2, wick, 2);
// console.log(NLB.bankAccounts)       
// console.log(wick)       
// console.log(NLB.employees)
novaBanka.fireEmploye(saban, 1);
// console.log(NLB.employees)

// adding money to atm

novaBanka.getAddMoneyAtm(1, 1000, 1);
// console.log(atm1)

// making transactions in bank

novaBanka.deposit(1, 100);
novaBanka.withdraw(1, 10);
novaBanka.checkBalance(1);

// making transactions in atm
adis.insertCardInAtm()
atm1.depositMoney(adis, 1, 5555, 200);
atm1.withdrawMoney(adis, 1, 5555, 10);
atm1.checkBalance(adis, 1, 5555);

// making transaction in atm from different bank and checking account in my bank
atm4.withdrawMoney(adis, 1, 5555, 1000);
atm4.withdrawMoney(adis, 1, 5555,20);
// console.log(adis.cards)

// checking if withdraw works

novaBanka.withdraw(1, 100);
atm1.withdrawMoney(adis, 1, 5555, 5);

// testing transactions
novaBanka.findAccount(1, 1234);

// console.log(novaBanka.atmTransactions)
// console.log(novaBanka.bankToAtmTransactions)
// console.log(novaBanka.bankTransactions)
// console.log(NLB.employeesTransactions)


// console.table(DB)

// console.log(novaBanka)