// funkcija za importovanje fajla sa spiskom ljudi

const importNamesAndCreateListOfPeople = (txtFile) => {
    let temp = [];

    const { count } = require('console');
    const { readFileSync, promises: fsPromises, copyFile } = require('fs');
    const { prependOnceListener } = require('process');
    const { addAbortSignal } = require('stream');
    const { threadId } = require('worker_threads');
    const contents = readFileSync(txtFile, 'utf-8');
    temp = contents.split(/\r?\n/);
    for (let i = 0; i < temp.length; i++) {
        const element = temp[i];

    }
    return temp;
}
let listOfPeople = importNamesAndCreateListOfPeople("employees.txt")
const getTime = () => {
    const currentDate = new Date();
    return currentDate.toLocaleString();

}
// funkcija za slanje para u drugu banku
// const sendMoney = (bank,account_ID2, amount) => {
// bank.accounts[account_ID2].balance += amount
// bank.transactions.push(createTransactionForTransferingMoney( account.bank_ID,account.firstName, account.lastName, account1.firstName, account1.lastName, transactions.length, "transfer money", account.account_ID, account1.account_ID, account.JMBG, account1.JMBG, amount)) 


// }

// konstruktor za kreiranje objekta transakcije
const createTransaction = (firstName, lastName, ID, type, account_ID, JMBG, amount) => {
    return {
        time: getTime().substring(11),
        date: getTime().substring(0, 10),
        firstName,
        lastName,
        ID, // id transakcije
        type,
        account_ID, // id akounta sa kojeg se vrsi transakcija
        JMBG, // id osobe koji je ujedno i maticni broj
        amount

    }
}
const createTransactionForTransferingMoney = (bank_ID, firstNameSender, lastNameSender, firstNameReciever, lastNameReciever, ID, type, SenderAccount_ID, RecieverAccount_ID, JMBGSender, JMBGReciever, amount) => {
    return {
        time: getTime().substring(11),
        date: getTime().substring(0, 10),
        bank_ID,
        firstNameSender,
        lastNameSender,
        firstNameReciever,
        lastNameReciever,
        ID, // id transakcije
        type,
        SenderAccount_ID, // id akounta sa kojeg se salju pare
        RecieverAccount_ID, // id akounta na koji se salju pare
        JMBGSender,
        JMBGReciever, // id osobe koji je ujedno i maticni broj
        amount

    }
}


createBank = (bank_ID, name, location, accounts = [], transactions = []) => {
    return {
        bank_ID,
        name,
        location,
        accounts,
        transactions,

        openAccount(account) {

            account.bank_ID = this.bank_ID
            this.accounts.push(account);
            return account;
        },
        // orginalno su bila dva uslova da se moze vrsiti transakcija kao i zatvarati racun, drugi uslov je bio maticni broj
        // ali kako su uvijek generisani random prilikom svako pokretanja programa morao sam to izbaciti 
        closeAccount(person) {
            this.accounts.forEach(account => {
                if (person.account_ID == account.account_ID) {
                    accounts.splice(accounts.indexOf(account), 1)
                    person.hasAcc = false;
                    person.account_ID = undefined;
                    
                }

            });
        },  // index 1 refers to bank and account from which we send money, index 2 refers to bank and acc which recive money
        transferMoney(account_ID1, account_ID2, amount) {
            this.accounts.forEach(account => {
                this.accounts.forEach(account1 => {

                    if (account.account_ID == account_ID1 && account1.account_ID == account_ID2) {

                        this.accounts[account_ID1].balance -= amount;
                        this.accounts[account_ID2].balance += amount;
                        this.transactions.push(createTransactionForTransferingMoney( account.bank_ID,account.firstName, account.lastName, account1.firstName, account1.lastName, transactions.length, "transfer money", account.account_ID, account1.account_ID, account.JMBG, account1.JMBG, amount)) 
                }                
                });

            });
        },
        // sendMoneyToDiffrentBank(account_ID1, amount, bank, account_ID2) {
        //     this.accounts.forEach(account => {
        //         this.accounts.forEach(account1 => {

        //             if (account.account_ID == account_ID1 ) {

        //                 this.accounts[account_ID1].balance -= amount;
        //                 this.accounts[account_ID2].balance += amount;
        //                 this.transactions.push(createTransactionForTransferingMoney( account.bank_ID,account.firstName, account.lastName, account1.firstName, account1.lastName, transactions.length, "transfer money", account.account_ID, account1.account_ID, account.JMBG, account1.JMBG, amount)) 
        //                 sendMoney(bank,account_ID2,amount)
        //             }                
        //         });

        //     });
        // },

        deposit(account_ID1, deposit) {
            this.accounts.forEach(account => {
                if (account.account_ID == account_ID1) {
                    account.balance += deposit;
                    this.transactions.push(createTransaction( account.firstName, account.lastName, transactions.length, "deposit", account.account_ID, account.JMBG, deposit));
                }

            });


        },
        withdraw(account_ID1, withdraw) {
            this.accounts.forEach(account => {
                if (account.account_ID == account_ID1) {
                    if (account.balance >= withdraw) {
                        account.balance -= withdraw;
                        this.transactions.push(createTransaction(account.firstName, account.lastName, transactions.length, "withdraw", account.account_ID, account.JMBG, withdraw));
                    }
                    else console.log("Na  akauntu broj " + account.account_ID + " nemate dovoljno sredstava na racunu");
                }

            });


        },
        checkBalance(account_ID1) {
            this.accounts.forEach(account => {
                if (account.account_ID == account_ID1) {
                    console.log("Vas racun iznosi " + account.balance);
                    this.transactions.push(createTransaction(account.firstName, account.lastName, transactions.length, "check Balance", account.account_ID, account.JMBG, account.balance));
                }
            });
        },
    }
}

createPerson = (firstName, lastName, birthDate, JMBG, account) => {
    return {
        firstName,
        lastName,
        birthDate,
        JMBG,  // id korisnika je maticni broj korisnika
        hasAcc: false, // da li osoba ima otvoren acc u bilo kojoj firmi
        account_ID: undefined, // ako ima otvoren da se zna koji mu je id, u stvarnom zivotu to je kartica
        // orginalno sam htio staviti da akount id bude broj od 16 cifara koji je random generisan ali ne bi mogao praiti onda koji je
        // broj racuna koje oosbe pa sam presao na klasicno 1 2 3 itd
        account: undefined
    }
}

// funkcije koje generisu datum rodjena osobe i njegov jmbg
const generateBirthDate = () => {
    const leapYears = [1940, 1944, 1948, 1952, 1956, 1960, 1964, 1968, 1972, 1976, 1980, 1984, 1988, 1992, 1996, 2000, 2004]
    let year = Math.trunc(Math.random() * 65 + 1939)        //1939 do 2004 od 18god do 65 godina
    let month = Math.trunc(Math.random() * 11 + 1)
    let day = 0;
    if (month == 2) {
        for (let i = 0; i < leapYears.length; i++) {
            const leapYear = leapYears[i];
            if (leapYear == year) {
                day = Math.trunc(Math.random() * 28 + 1)
            }
            else day = Math.trunc(Math.random() * 27 + 1)
        }
    }
    else if (month == 4 || 6 || 9 || 11) day = Math.trunc(Math.random() * 29 + 1)
    else day = Math.trunc(Math.random() * 23 + 1)
    if (day < 10) { day = "0" + day }
    if (month < 10) { month = "0" + month }
    return "" + day + "." + month + "." + year

}
let JMBGS = [];
const generateJMBG = (date) => {
    firstPartOfJMBG = ""
    for (let i = 0; i < date.length; i++) {
        const element = date[i];
        if (element == ".") continue
        else firstPartOfJMBG += element
    }
    let secondPartOfJMBG = Math.trunc(Math.random() * 899999 + 100000)
    let jmbg = 0

    if (!JMBGS.includes(secondPartOfJMBG)) {
        jmbg = firstPartOfJMBG + secondPartOfJMBG
    }
    JMBGS.push(secondPartOfJMBG)
    return jmbg
}
const numberOfCustomores = [];
const addCustomers = (array, number) => {
    // dio koji dodaje 100 ljudi koji ce imati racun u nekoj od banaka
    for (let i = 0; i < number; i++) {
        const person = array[i].split(" ");
        let date = generateBirthDate();
        numberOfCustomores.push(createPerson(person[0], person[1], date, generateJMBG(date),));
    }
}

addCustomers(listOfPeople, 100);


const prvaBanka = createBank(1, "Prva Banka", "Tuzla");
const drugaBanka = createBank(2, "Druga Banka", "Tuzla");
const trecaBanka = createBank(3, "Treca Banka", "Tuzla");




function createAccount(person, account_ID) {
    return {
        bank_ID: undefined,
        firstName: person.firstName,
        lastName: person.lastName,
        JMBG: person.JMBG,
        account_ID,
        balance: 0,
        password: person.JMBG.slice(-6)
        // pasword osobe je zamisljen kao zadnjih sest brojeva jmbg jer su oni unikatni za svaku osobu
    }
}


const gotCustomers = (bank, array, number) => {
    let cnt = 0;
    for (let i = 0; i < array.length; i++) {
        if (array[i].hasAcc == false && cnt < number) {
            const person = array[i]
            // console.log(person)
            const account = bank.openAccount(createAccount(person, i))
            person.account = account;
            person.hasAcc = true
            person.account_ID = bank.accounts[cnt].account_ID
            cnt++

        }
        else continue
    }

}

gotCustomers(prvaBanka, numberOfCustomores, 20)
gotCustomers(drugaBanka, numberOfCustomores, 50)
gotCustomers(trecaBanka, numberOfCustomores, 30)


for (let i = 0; i < 10; i++) {
    // transakcije
    for (let i = 1; i < 100; i++) {
        trecaBanka.deposit(i, 100)
        prvaBanka.deposit(i, 100)

    }
    for (let i = 1; i < 100; i++) {

        drugaBanka.checkBalance(i)
        trecaBanka.checkBalance(i)
    }
    for (let i = 0; i < 100; i++) {
        trecaBanka.withdraw(i, 1)
        prvaBanka.withdraw(i, 1,)
        drugaBanka.withdraw(i, 1)
    }
}

// funkcija koja pronalazi odredjeni acc u odredjenoj banci i ispisuje sve njegove transakcije
const findAccount = (account_ID, bank) => {
    bank.accounts.forEach(account => {
        if (account_ID == account.account_ID) console.log(account);
    });
    bank.transactions.forEach(transaction => {
        if (account_ID == transaction.account_ID) console.log(transaction);
    })
}


// findAccount(1, trecaBanka)
console.log(trecaBanka.accounts)
console.log(numberOfCustomores[99])
// console.log(trecaBanka.accounts[1])
// console.log(numberOfCustomores[1])

const fs = require('fs');

const data_Base = {
    BANKS: [],
    CUSTOMERS: []
}
data_Base.BANKS.push(prvaBanka, drugaBanka, trecaBanka)
data_Base.CUSTOMERS.push(numberOfCustomores)

fs.writeFile("DataBase.json", JSON.stringify(data_Base), function (err) {
    if (err) throw err;
});

console.log(prvaBanka.transactions.length)
console.log(drugaBanka.transactions.length)
console.log(trecaBanka.transactions.length)
// console.log(numberOfCustomores[1])
const aaaa =prvaBanka.transferMoney(10,16,50)
console.log( prvaBanka.transactions[prvaBanka.transactions.length-1])

