// transakcije za sve u banci i u atmu
// skontat da se automatski pusha u glavni array bp
// zavrsiti transfermoney u banci
//testirati close acc close atm

const { timeStamp } = require("console")
const { type } = require("os")

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
// creaing transaction
class Transaction_ID {
    static ID_transcation = 1  ;
    transaction_ID;
    firstName;
    lastName;
    type;
    bankAccount_ID;
    JMBG;
    amount;
    constructor (firstName, lastName,  type, bankAccount_ID, JMBG, amount)  {
        this.transaction_ID = "TransInBank" + Transaction_ID.ID_transcation++ 
        this.firstName = firstName;
        this.lastName = lastName;
        this.bankAccount_ID = bankAccount_ID;
        this.type = type;
        this.amount = amount
        this.JMBG = JMBG, 
        this.time= getDateAndTime().substring(11);
        this.date= getDateAndTime().substring(0, 10);
    }
}
class ATMTransaction_ID {
    static ID_transcation = 1  ;
    transaction_ID;
    firstName;
    lastName;
    atmID;
    type;
    bankAccount_ID;
    JMBG;
    amount;
    constructor (firstName, lastName, atmID, type, bankAccount_ID, JMBG, amount)  {
        this.transaction_ID = "TransATM" + Transaction_ID.ID_transcation++ 
        this.firstName = firstName;
        this.lastName = lastName;
        this.bankAccount_ID = bankAccount_ID;
        this.atmID = atmID
        this.type = type;
        this.amount = amount
        this.JMBG = JMBG, 
        this.time= getDateAndTime().substring(11);
        this.date= getDateAndTime().substring(0, 10);
    }
}
class EmployeeTransactions {
    static ID_employeeTranscation = 1;
    employeeTransaction_ID;
    firstName;
    lastName;
    type;
    birthDate;
    JMBG;
    gender;
    constructor (firstName, lastName, type, birthDate, JMBG, gender)  {
        this.employeeTransaction_ID = "TransEmployee" + EmployeeTransactions.ID_employeeTranscation++ 
        this.firstName = firstName;
        this.lastName = lastName;
        this.type = type;
        this.birthDate = birthDate;
        this.JMBG = JMBG;
        this.gender = gender;
        this.time= getDateAndTime().substring(11);
        this.date= getDateAndTime().substring(0, 10);
    }
}
class ATMTransaction {          // class for adding money from bank to atms
    static ID_atmTranscation = 1  ;
    atmTransactionsID;
    bankName;
    atmID;
    atmLocation;
    amount;
    type;
    constructor (bankName, atmID, atmLocation, amount, type)  {
        this.atmTransactionsID = "TransAddMoneyToAtm" + ATMTransaction.ID_atmTranscation++ 
        this.bankName = bankName;
        this.atmID = atmID;
        this.atmLocation = atmLocation;
        this.amount = amount;
        this.type = type;
        this.time= getDateAndTime().substring(11);
        this.date= getDateAndTime().substring(0, 10);
    }
}
class AccountTransactions {
    static ID_accountTransaction = 1;
    accountTransactionsID;
    firstName;
    lastName;
    bankAccount_ID;
    pinCode;
    type;
    
    constructor (firstName, lastName,bankAccount_ID, pinCode,type) {
        this.accountTransactionsID = "TransCreateAcc" + AccountTransactions.ID_accountTransaction++;
        this.firstName = firstName;
        this.lastName = lastName;
        this.bankAccount_ID = bankAccount_ID;
        this.pinCode = pinCode;
        this.type = type;
        this.time= getDateAndTime().substring(11);
        this.date= getDateAndTime().substring(0, 10);
        
    }

}
class CardTransactions {
    static ID_cardTransaction = 1;
    cardTransactionsID;
    firstName;
    lastName;
    bankAccount_ID;
    cardID
    cardType;
    pinCode;
    type;
    
    constructor (firstName, lastName, bankAccount_ID, cardID , cardType,pinCode,type) {
        this.cardTransactionsID = "TransCreateCard" + CardTransactions.ID_cardTransaction++;
        this.firstName = firstName;
        this.lastName = lastName;
        this.bankAccount_ID = bankAccount_ID;
        this.cardID = cardID;
        this.cardType = cardType;
        this.pinCode= pinCode;
        this.type = type;
        this.time= getDateAndTime().substring(11);
        this.date= getDateAndTime().substring(0, 10);
        
    }
}

class ChangePinTransaction {
    static ID_changePin = 1;
    changePinTransactionID;
    firstName;
    lastName;
    bankAccount_ID;
    type;
    oldPinCode;
    newPinCode;
    
    constructor (firstName, lastName, bankAccount_ID, type , oldPinCode,newPinCode) {
        this.changePinTransactionID = "TransChangePin" + ChangePinTransaction.ID_changePin++;
        this.firstName = firstName;
        this.lastName = lastName;
        this.bankAccount_ID = bankAccount_ID;
        this.type = type;
        this.oldPinCode = oldPinCode;
        this.newPinCode = newPinCode
        this.time= getDateAndTime().substring(11);
        this.date= getDateAndTime().substring(0, 10);
        
    }
}
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
     constructor (firstNameSender, lastNameSender, firstNameReciever, lastNameReciever, type, SenderAccount_ID, RecieverAccount_ID, JMBGSender, JMBGReciever, amount) {
           this.transaction_ID = `TransBeetweenAcc` + TransactionBetweenAccounts.ID_TransactionBetweenAcoounts++
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
            this.date = getDateAndTime().substring(0,10)
        
        }
    
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
                    const bankID = card.bank_ID
                    if (person.pin == pin) {  // checking if pin is correct
                        for (let i = 0; i < BANKS.length; i++) {
                            const bank = BANKS[i];
                            if (bank.bankName == card.bankName) {   // checking if bank is correct
                                bank.bankAccounts.forEach(account => {
                                    if (account.bankAccount_ID == card.bankAccount_ID) {
                                        account.balance += amount
                                        bank.bankBudget += amount
                                        bank.atmTransactions.push(new ATMTransaction_ID(account.firstName,account.lastName,this.atm_ID,"Deposit",account.bankAccount_ID,account.jmbg,amount));
                                    }
                                    });
                            } 
                            else {            // if not then 10% is added for transaction cost
                                bank.bankAccounts.forEach(account => {
                                    if (account.bankAccount_ID == card.bankAccount_ID) {
                                        account.balance += (amount * 1.1)
                                        bank.bankBudget += (amount * 1.1)
                                        bank.atmTransactions.push(new ATMTransaction_ID(account.firstName,account.lastName,this.atm_ID,"Deposit",account.bankAccount_ID,account.jmbg,amount));

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

    withdrawMoney(person,cardID, pin, amount) {
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
                                            bank.atmTransactions.push(new ATMTransaction_ID(account.firstName,account.lastName,this.atm_ID,"Withdraw",account.bankAccount_ID,account.jmbg,amount));

                                        }
                                        else console.log(`Nemate dovoljno sredstava na racunu`)
                                        bank.atmTransactions.push(new ATMTransaction_ID(account.firstName,account.lastName,this.atm_ID,"Insufficient money on account. Transaction declined.",account.bankAccount_ID,account.jmbg,amount));

                                    });
                                } else {            // if not then 10% is added for transaction cost
                                    bank.bankAccounts.forEach(account => {
                                        if (account.bankAccount_ID == card.bankAccount_ID) {
                                            account.balance += amount * 1.1
                                            bank.bankBudget += amount * 1.1
                                            bank.atmTransactions.push(new ATMTransaction_ID(account.firstName,account.lastName,this.atm_ID,"Withdraw",account.bankAccount_ID,account.jmbg,amount));

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
                                            bank.atmTransactions.push(new ATMTransaction_ID(account.firstName,account.lastName,this.atm_ID,"CheckBalance",account.bankAccount_ID,account.jmbg,account.balance));

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
        this.employeesTransactions.push(new EmployeeTransactions (person.firstName,person.lastName,"hired",person.birthDate,person.jmbg,person.gender))
    }
    fireEmploye(person) {
        this.employees.forEach(employee => {
            if (person.employee_ID = employee.employee_ID)
            this.employees.splice(this.employees.indexOf(employee), 1)
            this.employeesTransactions.push(new EmployeeTransactions (person.firstName,person.lastName,"fired",person.birthDate,person.jmbg,person.gender))
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
        this.accountTransactions.push(new CardTransactions(person.firstName,person.lastName,account.bankAccount_ID,card.card_ID,card.cardType,person.pin,"new Card"))
        account.bank_ID = this.bank_ID
        this.bankAccounts.push(account)
        this.bankCards.push(card)

        this.accountTransactions.push(new AccountTransactions(person.firstName,person.lastName,account.bankAccount_ID,person.pin,"Created Account"))
        
    }
    changePinCode(person, bankAccount_ID, newPinCode) { // method for changing pin code
        this.bankAccounts.forEach(account => {
            if (account.bankAccount_ID == bankAccount_ID && account.jmbg == person.jmbg &&
                newPinCode < 10000 && newPinCode > 999 && !isNaN(newPinCode)) {
                    const oldPinCode = person.pin;
                    account.setPin(newPinCode)
                    person.pin = account.getPin()
                    console.log(`Hello ${person.firstName} ${person.lastName}, you are succesfuly changed your pin code. 
                    Your new code is ${person.pin} `)
                    this.accountTransactions.push(new ChangePinTransaction(person.firstName,person.lastName,account.bankAccount_ID,"Change pin",oldPinCode,person.pin))
            }
            else console.log(`Pin code is invalid. Please enter pin code as combination of 4 numbers.`)
        });

    }
    getCloseAccount(account_ID,person , employeeid) {    // method for retriving method for closing account
        this.employees.forEach(employee => {
            if (employee.employee_ID == employeeid) {   // only employee can close  account
                this.#closeAccount(account_ID, person)
            }
        });
    }
    #closeAccount(account_ID, person) {
        this.bankAccounts.forEach(account => {
            if (account_ID == account.bankAccount_ID) {
                this.accountTransactions.push(new AccountTransactions(person.firstName,person.lastName,account.bankAccount_ID,person.pin,"Closed Account"))
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
    getIssueCard(bankAccount_ID, person, cardType, employeeid) {    // method for retriving method for issuing  new cards
        this.employees.forEach(employee => {
            if (employee.employee_ID == employeeid) {   // only employee can issue new carad
                this.#issueCard(bankAccount_ID, person, cardType) 
            }
        });
    }
    #issueCard(bankAccount_ID, person, cardType) {
        let card = new Card(this.bankName, person.firstName, person.lastName, bankAccount_ID, cardType)
        card.bank_ID = this.bank_ID
        person.cards.push(card)      // adding card to person
        this.bankAccounts.forEach(account => {
            if (account.bankAccount_ID == bankAccount_ID) {
                account.cards.push(card)
                this.accountTransactions.push(new CardTransactions(person.firstName,person.lastName,account.bankAccount_ID,card.card_ID,card.cardType,person.pin,"new Card"))
            }
        });
        this.bankCards.push(card)


    }
    getRevokeCard(card_ID, person, employeeid) {    // method for retriving method for revoking  new cards
        this.employees.forEach(employee => {
            if (employee.employee_ID == employeeid) {   // only employee can revoke carad
                this.#revokeCard(card_ID, person) 
            }
        });}
    #revokeCard(cardID, person) {
        this.bankCards.forEach(card => {
            if (card.card_ID == cardID) {
                this.bankCards.splice(this.bankCards.indexOf(card, 1))
                person.cards.splice(person.cards.indexOf(card,1))
                this.accountTransactions.push(new CardTransactions(person.firstName,person.lastName,card.bankAccount_ID,card.card_ID,card.cardType,person.pin,"revoked card"))

            }
            person.pin = undefined
        });

    }
    getAddAtm(atmName, employeeid) {    // method for retriving method for adding atms
        this.employees.forEach(employee => {
            if (employee.employee_ID == employeeid) {   // only employee can add atm
                this.#addAtm(atmName) 
            }
        });}
    #addAtm(atmName) {
        atmName.bankName = this.bankName
        atmName.bank_ID = this.bank_ID
        this.atmTransactions.push(new ATMTransaction(this.bankName, atmName.atm_ID,atmName.atmLocation,"","Add ATM"))

    }
    getAddMoneyAtm(atmID,amount ,employeeid) {    // method for adding money to atm
        this.employees.forEach(employee => {
            if (employee.employee_ID == employeeid) {   // only employee can add money to atm
                this.#addMoneyToAtm(atmID,amount) 
            }
        });}
    #addMoneyToAtm(atmID, amount) {
        ATMS.forEach(atm => {
            if (atm.atm_ID == atmID) {
                atm.balance += amount
                this.bankBudget -= amount
                this.bankToAtmTransactions.push(new ATMTransaction(this.bankName, atm.atm_ID,atm.atmLocation,amount,"Add money to ATM"))
            }

        });
    }

    getCloseAtm(atmID ,employeeid) {    // method for closing  atm
        this.employees.forEach(employee => {
            if (employee.employee_ID == employeeid) {   // only employee can close atm
                this.#closeAtm(atmID) 
            }
        });}
    #closeAtm(atmID) {
        ATMS.forEach(atm => {
            if (atm.atm_ID == atmID) {
                this.bankBudget += atm.balance
                atm.balance = 0
                this.isWorking = false
                this.atmTransactions.push(new TransactionToAtm(this.bankName, atm.atm_ID,atm.atmLocation,"","closed ATM"))

            }
        });
    }
    deposit(account_ID1, amount) {
        this.bankAccounts.forEach(account => {
            if (account.bankAccount_ID == account_ID1) {
                account.balance += amount;
                this.bankBudget += amount
                this.bankTransactions.push(new Transaction_ID(account.firstName,account.lastName,"Deposit",account.bankAccount_ID,account.jmbg,amount));
            }

        });


    }
    withdraw(account_ID1, amount) {
        this.bankAccounts.forEach(account => {
            if (account.bankAccount_ID == account_ID1) {
                if (account.balance >= amount) {
                    account.balance -= amount;
                    this.bankTransactions.push(new Transaction_ID(account.firstName,account.lastName,"Withdraw",account.bankAccount_ID,account.jmbg,amount));
                }
                else console.log(`${account.firstName} ${account.lastName}  you don't have enough money on account ${account.bankAccount_ID}`);
            }

        });


    }
    checkBalance(account_ID1) {
        this.bankAccounts.forEach(account => {
            if (account.bankAccount_ID == account_ID1) {
                console.log(`${account.firstName} ${account.lastName} your balance is ${account.balance}`);
                this.bankTransactions.push(new Transaction_ID(account.firstName,account.lastName,"CheckBalance",account.bankAccount_ID,account.jmbg,account.balance));
            }
        });
    }
    transferMoney(account_ID1, account_ID2, amount) { // account1 is account from which are send money, account2 is acc to which are
        this.bankAccounts.forEach(account1 => {             // sent money
            this.bankAccounts.forEach(account2 => {

                if (account1.bankAccount_ID == account_ID1 && account2.bankAccount_ID == account_ID2) {

                    account1.balance -= amount;
                    account2.balance += amount;
                    this.bankTransactions.push(new TransactionBetweenAccounts(account1.firstName,account1.lastName,account2.firstName,account2.lastName,"Transfering Money",account1.bankAccount_ID,account2.bankAccount_ID,account1.jmbg,account2.jmbg,amount)) 
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

// TESTING

// creating two banks and adding banks to DB
const novaBanka = new Bank("Nova Banka", "Tuzla", 100000)
novaBanka.addBankToDB(novaBanka)
const NLB = new Bank("NLB", "Tuzla", 100000)
NLB.addBankToDB(NLB)

// creating 4 person and adding them to DB, and creating two employees

const adis = new Person("Adis", "Aljic", "M", "Tuzla")
adis.addPersonToDB(adis)
const john = new Person("John", "Doe", "M", "Tuzla")    // employeeID = 1
john.addPersonToDB(john)
const jane = new Person("Jane","Doe","F","Tuzla")       // employeeID = 2
jane.addPersonToDB(jane)
const wick = new Person ("John","Wick","M","LA")
wick.addPersonToDB(wick)
novaBanka.hireEmployee(john)
NLB.hireEmployee(jane)

// creating four atms and adding two atms to each bank

const atm1 = new Atm("Slatina")
atm1.OpenToBuissnesAtm()
novaBanka.getAddAtm(atm1,1)
atm1.addAtmToDB(atm1)
const atm2 = new Atm("Brcanska Malta")
atm2.OpenToBuissnesAtm()
novaBanka.getAddAtm(atm2,1)
atm2.addAtmToDB(atm2)
const atm3 = new Atm("Slatina")
atm3.OpenToBuissnesAtm()
NLB.getAddAtm(atm3,2)
atm3.addAtmToDB(atm3)
const atm4 = new Atm("Sjenjak")
atm4.OpenToBuissnesAtm()
NLB.getAddAtm(atm4,2)
atm4.addAtmToDB(atm4)


// creating accounts for adis and wick in two banks, issuing and revoking card

novaBanka.getCreateAccount(adis,"Visa",1)
NLB.getCreateAccount(wick,"Maestro",2)
// console.log(novaBanka.bankAccounts)
// console.log(NLB.bankAccounts)
novaBanka.getIssueCard(1,adis,"Maestro",1)
// console.log(adis.cards)
// console.log(novaBanka.bankCards)
novaBanka.getRevokeCard(3,adis,1)
// console.log(adis.cards)
// console.log(novaBanka.bankCards)

// changing pin code 

novaBanka.changePinCode(adis,1,5555)
// console.log(adis.pin)

// closing account and firing employee

// console.log(NLB.bankAccounts)       // account id  = 2 
NLB.getCloseAccount(2,wick,2)
// console.log(NLB.bankAccounts)       
// console.log(wick)       
// console.log(NLB.employees)
NLB.fireEmploye(jane)
// console.log(NLB.employees)

// adding money to atm

novaBanka.getAddMoneyAtm(1,1000,1)
// console.log(atm1)

// making transactions in bank

novaBanka.deposit(1,100)
novaBanka.withdraw(1,50)
novaBanka.checkBalance(1)

// making transactions in atm

atm1.depositMoney(adis,1,5555,20)
atm1.withdrawMoney(adis,1,5555,10)
atm1.checkBalance(adis,1,5555)

// making transaction in atm from different bank and checking account in my bank
// atm3.depositMoney(adis,1,5555,100)
// atm1.checkBalance(adis,1,5555)
// console.log(adis.cards)

// novaBanka.findAccount(1,1234)

// checking if withdraw works

// novaBanka.withdraw(1,1000)
// atm1.witdrawMoney(adis,1,5555,1000)

// testing transactions

// console.log(novaBanka.atmTransactions)
// console.log(novaBanka.bankToAtmTransactions)
// console.log(novaBanka.bankTransactions)
console.log(NLB.employeesTransactions)