/*
OVO JE JEDAN ZADATAK I  RADITE SVE U ISTOM FAJLU



Kreirati funkciju koja kreira Company objekat. Company objekat ima sljedece properties:
ID → number
name → string
location → string
numberOfEmployees → number
employees → array
hirePerson → function
fireEmployee → function

Svi objekti imaju ove properties, values prosljedjujete u funkciju.


Napisati funkciju koja nam kreira Person objekat. Person ima sljedece properties: 
ID → number
firstName → string
lastName → string
isEmployed → boolean
salary → number
companyID → number


Svi objekti imaju ove properties, values prosljedjujete u funkciju.


Kreirati prazne nizove: COMPANIES i PEOPLE globalno.
Kreirati 3 kompanije sa vrijednostima koje vi zelite.
PEOPLE niz popuniti sa 1000 objekata s tim da imena mozete naci u ovom fajlu: employees.txt, a ostale properties postaviti na defaultne 
vrijednosti.
U prvu kompaniju zaposliti 40% nezaposlenih ljudi, u drugu kompaniju zaposliti 33% a u trecu kompaniju 50%. S tim da ne smijete ici i 
redom zaposljavati ljude, jer ce vas tuziti ovi ljudi na kraj liste, tako da morate random ljude zaposljavati.
Kada se osoba zaposli dobija platu izmedju 1000 i 3000. Plata mora biti u inkrementima od 100, npr: 1300, 2400 itd ne moze biti 
1654, 2214 itd.
Izracunati koliko % je nezaposlenih.
Otpustiti ljude iz sve 3 kompanije koji imaju platu manju od 1500.
Ponovo prikazati postotak nezaposlenih ljudi.
 Zatim, identifikovati kompaniju koja ima najmanju prosjecnu platu i dodatno zaposliti 50 ljudi u tu kompaniju.
 Ispisati sve 3 kompanije, i prikazati broj zaposlenih i prosjecnu platu.
 */
 const COMPANIES = [];
 let PEOPLE = [];
 
 function createCompany(ID, name, location, numberOfEmployees, employees) {
     return {
         ID,
         name,
         location,
         numberOfEmployees,
         employees,
 // ne moze ovako.. mora se napraviti da prima niz ljudi koji je neko drugi izabrao..i treba da bude samo jedna osoba
 // moze druga funkcija koja ce zaposljavati vise oboba
         hirePerson(array, num = 1) { // num nam govori koliko radnika zelimo zaposliti u odredjenu kompaniju. Ako je prazno onda je 1
             let counterForHiringPeople = 0 // paramatar array je spisak svih imena radnika
             for (let i = 0; i < array.length; i++) {
                 const person = array[i];
                 if (person.isEmployed == false && counterForHiringPeople < num) {
                     person.isEmployed = true;
                     person.companyID = this.ID;
                     person.salary = paycheck();
                     this.employees.push(person);
                     this.numberOfEmployees = this.employees.length;
                     counterForHiringPeople++;
                 }
                 else continue;
             }
 
         },
         firePerson(numberOfPeopleToFire = 1) {  // parametar nam govori koliko radnika zelimo otpustiti, ako je prazno onda je to jedan randik
 
 
             for (let i = 0; i < numberOfPeopleToFire; i++) {
 
                 let number = Math.trunc(Math.random() * this.numberOfEmployees)
                 this.employees[number].isEmployed = false;
                 this.employees[number].companyID = undefined;
                 this.employees[number].salary = undefined;
                 this.employees.splice(this.employees[number], 1)
                 this.numberOfEmployees = this.employees.length;
 
             }
 
         }
     }
 }
 function createPerson(ID, firstName, lastName, isEmployed, salary, companyID) {
     return {
 
         ID,
         firstName,
         lastName,
         isEmployed,
         salary,
         companyID
     }
 }
 
 const company1 = createCompany(1, "Company1", "Tuzla");
 const company2 = createCompany(2, "Company2", "Mostar");
 const company3 = createCompany(3, "Company3", "Sarajevo");
 COMPANIES.push(company1, company2, company3);
 
 const importNamesAndCreateListOfPeople = (txtFile) => {
     let PEOPLE = [];
     let temp = [];
 
     const { count } = require('console');
     const { readFileSync, promises: fsPromises, copyFile } = require('fs');
     const { prependOnceListener } = require('process');
     const { addAbortSignal } = require('stream');
     const { threadId } = require('worker_threads');
     const contents = readFileSync(txtFile, 'utf-8');
     temp = contents.split(/\r?\n/);
     const index = [];
     while (index.length < 1000) {
         let num = Math.trunc(Math.random() * 1000);
         if (!index.includes(num)) {
             index.push(num);
         }
     }
     let ShufledListOfEmployees = [];
     for (let i = 0; i < 1000; i++) {
 
         ShufledListOfEmployees[index[i]] = temp[i];
     }
     let counterCreatingPersons = 0
     while (counterCreatingPersons <= 999) {
         PEOPLE.push(createPerson(counterCreatingPersons, ShufledListOfEmployees[counterCreatingPersons].split(" ")[0], ShufledListOfEmployees[counterCreatingPersons].split(" ")[1], false));
         ++counterCreatingPersons;
 
     }
     return PEOPLE;
 }
 PEOPLE = importNamesAndCreateListOfPeople("employees.txt")
 const paycheck = () => {
     const number = 1000;
     const koef = Math.trunc(Math.random() * 20);
     return number + koef * 100;
 }
 let numberOfEmployeesInFirstComp = Math.trunc(PEOPLE.length * 0.4);
 let numberOfEmployeesInSecondComp = Math.trunc((PEOPLE.length - PEOPLE.length * .4) * 0.33);
 let numberOfEmployeesInThirdComp = (PEOPLE.length - numberOfEmployeesInSecondComp - PEOPLE.length * 0.4) * 0.5;
 
 for (let i = 0; i < numberOfEmployeesInFirstComp; i++) {
     PEOPLE[i].isEmployed = true;
     PEOPLE[i].companyID = 1;
     PEOPLE[i].salary = paycheck();
 }
 let counter2Comp = 0
 for (let i = 0; i < PEOPLE.length; i++) {
     if (PEOPLE[i].isEmployed == false && counter2Comp <= numberOfEmployeesInSecondComp) {
         counter2Comp++
         PEOPLE[i].isEmployed = true;
         PEOPLE[i].companyID = 2;
         PEOPLE[i].salary = paycheck();
     }
     else continue;
 }
 let counter3Comp = 0;
 for (let i = 0; i < PEOPLE.length; i++) {
     if (PEOPLE[i].isEmployed == false && counter3Comp <= numberOfEmployeesInThirdComp) {
         counter3Comp++
         PEOPLE[i].isEmployed = true;
         PEOPLE[i].companyID = 3;
         PEOPLE[i].salary = paycheck();
     }
     else continue;
 }
 const counterForAllemployees = () => {
     let counterForAllemployees = 0;
     for (let i = 0; i < PEOPLE.length; i++) {
         if (PEOPLE[i].isEmployed == true) {
             counterForAllemployees++;
         }
     }
     return counterForAllemployees;
 }
 
 COMPANIES[0].numberOfEmployees = numberOfEmployeesInFirstComp;
 COMPANIES[1].numberOfEmployees = numberOfEmployeesInSecondComp;
 COMPANIES[2].numberOfEmployees = numberOfEmployeesInThirdComp;
 const arraysOfEmployeesInEachComp = (array, index) => {
     let employeesFirstComp = [];
     let employeesSecondComp = [];
     let employeesThirdComp = [];
     for (let i = 0; i < array.length; i++) {
         if (array[i].companyID == 1) { employeesFirstComp.push(array[i]) }
         else if (array[i].companyID == 2) { employeesSecondComp.push(array[i]) }
         else if (array[i].companyID == 3) { employeesThirdComp.push(array[i]) }
 
     }
     if (index == 0) return employeesFirstComp;
     else if (index == 1) return employeesSecondComp;
     else if (index == 2) return employeesThirdComp;
 }
 COMPANIES[0].employees = arraysOfEmployeesInEachComp(PEOPLE, 0);
 COMPANIES[1].employees = arraysOfEmployeesInEachComp(PEOPLE, 1);
 COMPANIES[2].employees = arraysOfEmployeesInEachComp(PEOPLE, 2);
 COMPANIES[0].numberOfEmployees = COMPANIES[0].employees.length
 COMPANIES[1].numberOfEmployees = COMPANIES[1].employees.length
 COMPANIES[2].numberOfEmployees = COMPANIES[2].employees.length
 
 const writeNumberOfUnpleyedPeople = (arrayOfAllPeople) => {
     let procentOfUneployed = 100 - counterForAllemployees() / arrayOfAllPeople.length * 100
     procentOfUneployed = procentOfUneployed.toFixed(2)
     return console.log("Broj nezaposlenih je " + procentOfUneployed + "%.")
 }
 writeNumberOfUnpleyedPeople(PEOPLE);
 
 for (let i = 0; i < PEOPLE.length; i++) {
     if (PEOPLE[i].salary < 1500) {
         PEOPLE[i].salary = undefined;
         PEOPLE[i].isEmployed = false
         PEOPLE[i].companyID = undefined;
     }
     arraysOfEmployeesInEachComp(PEOPLE);
     COMPANIES[0].employees = arraysOfEmployeesInEachComp(PEOPLE, 0);
     COMPANIES[1].employees = arraysOfEmployeesInEachComp(PEOPLE, 1);
     COMPANIES[2].employees = arraysOfEmployeesInEachComp(PEOPLE, 2);
     COMPANIES[0].numberOfEmployees = COMPANIES[0].employees.length;
     COMPANIES[1].numberOfEmployees = COMPANIES[1].employees.length;
     COMPANIES[2].numberOfEmployees = COMPANIES[2].employees.length;
 
 }
 
 writeNumberOfUnpleyedPeople(PEOPLE);
 let summ1 = 0;     // sume i prosjeci plata sa jednim brojem se odnose na statisticke podatke prije otpustana radniak sa platom manjom od 1500
 let summ2 = 0;
 let summ3 = 0;
 for (let i = 0; i < PEOPLE.length; i++) {
     if (PEOPLE[i].companyID == 1) summ1 += PEOPLE[i].salary
     else if (PEOPLE[i].companyID == 2) summ3 += PEOPLE[i].salary
     else if (PEOPLE[i].companyID == 3) summ2 += PEOPLE[i].salary
 }
 let avrSalary1Comp = Math.round(summ1 / company1.numberOfEmployees);
 let avrSalary2Comp = Math.round(summ2 / company2.numberOfEmployees);
 let avrSalary3Comp = Math.round(summ3 / company3.numberOfEmployees);
 
 const findCompWithSmallestAvrPay = (a, b, c) => {
     if (a < b && a < c) return 1;
     else if (b < a && b < c) return 2;
     else if (c < a && c < b) return 3;
 } // preko metode hirePerson sam zaposlio 50 ljudi
 if (findCompWithSmallestAvrPay(avrSalary1Comp, avrSalary2Comp, avrSalary3Comp) == 1) company1.hirePerson(PEOPLE, 50);
 else if (findCompWithSmallestAvrPay(avrSalary1Comp, avrSalary2Comp, avrSalary3Comp) == 2) company2.hirePerson(PEOPLE, 50);
 if (findCompWithSmallestAvrPay(avrSalary1Comp, avrSalary2Comp, avrSalary3Comp) == 3) company3.hirePerson(PEOPLE, 50);
 
 //  let counter50Peop = 0;
 //  let cnt = 0;                   // pronalazi pedeset radnika koji su nezaposleni i zaposljava ih u firmu koja ima najmanji prosjek
 //  while (counter50Peop < 50) {
 //      if (PEOPLE[cnt].isEmployed == false) {
 //          PEOPLE[cnt].isEmployed = true;
 //          PEOPLE[cnt].companyID = findCompWithSmallestAvrPay(avrSalary1Comp, avrSalary2Comp, avrSalary3Comp);
 //          PEOPLE[cnt].salary = paycheck();
 //          counter50Peop++;
 //      }
 //      cnt++;
 //  }
 counterForAllemployees();
 arraysOfEmployeesInEachComp(PEOPLE);
 const numberOfUnemployedPeople = (array) => {
     let peopleWithoutJob = 0
     for (let o = 0; o < array.length; o++) {
         const element = array[o];
         if (element.isEmployed == false)
             peopleWithoutJob++;
 
     }
     return peopleWithoutJob
 }
 COMPANIES[0].employees = arraysOfEmployeesInEachComp(PEOPLE, 0);
 COMPANIES[1].employees = arraysOfEmployeesInEachComp(PEOPLE, 1);
 COMPANIES[2].employees = arraysOfEmployeesInEachComp(PEOPLE, 2);
 COMPANIES[0].numberOfEmployees = COMPANIES[0].employees.length;
 COMPANIES[1].numberOfEmployees = COMPANIES[1].employees.length;
 COMPANIES[2].numberOfEmployees = COMPANIES[2].employees.length;
 
 
 let SummSalaryForAllComp = 0
 for (let i = 0; i < PEOPLE.length; i++) {
     if (PEOPLE[i].isEmployed == true) {
         SummSalaryForAllComp += PEOPLE[i].salary
     }
 }
 let avrSalaryforAllComp = SummSalaryForAllComp / counterForAllemployees();
 avrSalaryforAllComp = avrSalaryforAllComp.toFixed(2);
 
 let summ11 = 0; // sume sa dva broja kao prosjeci sa dva broja se odnose ne pojedinacno statisticne podatke po kompanijama nakon otpustanja 
 let summ22 = 0; // radnika sa platom manjom od 1500
 let summ33 = 0;
 for (let i = 0; i < PEOPLE.length; i++) {
     if (PEOPLE[i].companyID == 1) summ11 += PEOPLE[i].salary
     else if (PEOPLE[i].companyID == 2) summ33 += PEOPLE[i].salary
     else if (PEOPLE[i].companyID == 3) summ22 += PEOPLE[i].salary
 }
 let avrSalary1Comp1 = Math.round(summ11 / company1.numberOfEmployees);
 let avrSalary2Comp2 = Math.round(summ22 / company2.numberOfEmployees);
 let avrSalary3Comp3 = Math.round(summ33 / company3.numberOfEmployees);
 
 // console.log(company1, company2, company3)
 console.log("Prosjecna plata u prvoj kompaniji je " + avrSalary1Comp1)
 console.log("Prosjecna plata u drugoj kompaniji je " + avrSalary2Comp2)
 console.log("Prosjecna plata u trecoj kompaniji je " + avrSalary3Comp3)
 console.log("Prosjecna plata za sve kompanije je " + avrSalaryforAllComp)
 console.log("Broj zaposlenih u prvoj kompaniji je " + company1.numberOfEmployees)
 console.log("Broj zaposlenih u drugoj kompaniji je " + company2.numberOfEmployees)
 console.log("Broj zaposlenih u trecoj kompaniji je " + company3.numberOfEmployees)
 console.log("Broj zaposlenih u svim kompanijama je " + counterForAllemployees())
 console.log("Broj nezaposlenih radnika je " + numberOfUnemployedPeople(PEOPLE))
 
 