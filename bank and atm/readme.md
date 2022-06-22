
Kreirati funkciju koja kreira Bank objekat. Bank objekat ima sljedece properties:
ID → number
name → string
location → string
accounts → array
transactions → array
createAccount → function
deleteAccount → function
deposit → function
withdraw → function
checkBalance → function


 	     RESTRIKCIJE:
Svaka uplata, isplata i provjera stanja se mora pratiti.	


Napisati funkciju koja nam kreira Person objekat. Person ima sljedece properties: 
ID → number
firstName → string
lastName → string
JMBG → string


      RESTRIKCIJE:
Za imena koristiti imena iz ovog fajla: employees.txt


Napisati funkciju koja kreira Account objekat. Account ima sljedece properties:
ID → number
owner → number
bank → number
balance → number
deposit → function
withdraw → function



Napisati funkciju koja kreira Transaction objekat. Transaction ima sljedece properties:
ID → number
type → string
account → number
person → number
amount → number

      RESTRIKCIJE:

      
Type moze biti jedna od 3 opcije: DEPOSIT, WITHDRAW i BALANCE_CHECK.


Kreirati globalni objekat koji ce nam igrati ulogu baze podataka.

TESTIRANJE APLIKACIJE

Kreirati 3 Bank objekata.
Kreirati 100 Person objekata.
Kreirati 100 Account objekata, s tim da ih mozete rasporediti po Bank-ama kako god zelite.
Izvrsiti najmanje po 10 transakcija nad svakim Account-om. S tim da morate iskoristiti sve 3 tipa transakcije.
Napisati funkciju koja ispisuje odredjeni Account iz neke banke, i ispisuje sve njegove transakcije i to na nacin da su informacije jasno prezentovane.
Svaki unos u ovom dijelu testiranja aplikacije tretirati kao da korisnik unosi podatke.  
