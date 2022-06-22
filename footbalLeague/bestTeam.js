/*
1. Kreirajte funkciju koja uzima niz fudbalskih klubova sa sljedecim properties: ime,
brojPobjeda, brojPoraza, brojNerjesenih, brojPostignutihGolova,
brojPrimljenihGolova i vraća naziv kluba sa najvećim brojem poena. Ako dvije ekipe
imaju isti broj bodova, vrati se tim sa najvećom gol razlikom.
Za pobjedu tim dobija 3 boda, za poraz dobija 0 bodova i za nerjesenu dobija 1 poen.
Testirati funkciju sa najmanje 5 klubova.
*/


class FudbalskiTim {
    ime;
    brojPobjeda = 0;
    brojPoraza = 0;
    brojNerjesenih = 0;
    brojPostignutihGolova = 0;
    brojPrimjljenihGolova = 0;
    brojBodovaTimova = 0
    constructor(ime) {
        this.ime = ime;
    }

}
const Francuska = new FudbalskiTim("Francuska")
const Ukrajna = new FudbalskiTim("Ukrajna")
const Finska = new FudbalskiTim("Finska")
const BiH = new FudbalskiTim("Bosna i Hercegovina")
const Kazahstan = new FudbalskiTim("Kazahstan")
// console.log(Francuska)
const timovi = [];
timovi.push(Francuska, Ukrajna, Finska, BiH, Kazahstan)

// liga
for (let i = 0; i < timovi.length; i++) {
    const domaciTim = timovi[i];
    for (let j = 0; j < timovi.length; j++) {
        const gostujuciTim = timovi[j];
        if (i != j) {

            const brojGolovaDomacegTima = Math.trunc(Math.random() * 5);
            const brojGolovaGostujucegTima = Math.trunc(Math.random() * 5);
            if (brojGolovaDomacegTima > brojGolovaGostujucegTima) {
            domaciTim.brojPostignutihGolova += brojGolovaDomacegTima
            domaciTim.brojPobjeda += 1
            gostujuciTim.brojPrimjljenihGolova += brojGolovaGostujucegTima
            gostujuciTim.brojPoraza += 1
            console.log(`${domaciTim.ime}  ${brojGolovaDomacegTima}:${brojGolovaGostujucegTima}  ${gostujuciTim.ime}`)
        }
        else if (brojGolovaDomacegTima == brojGolovaGostujucegTima) {
            domaciTim.brojPostignutihGolova += brojGolovaDomacegTima
            domaciTim.brojNerjesenih +=1
            gostujuciTim.brojNerjesenih +=1
            gostujuciTim.brojPrimjljenihGolova += brojGolovaGostujucegTima
            console.log(`${domaciTim.ime}  ${brojGolovaDomacegTima}:${brojGolovaGostujucegTima}  ${gostujuciTim.ime}`)
            
        }
        else {
            domaciTim.brojPostignutihGolova += brojGolovaDomacegTima
            domaciTim.brojPoraza += 1
            gostujuciTim.brojPobjeda += 1
            gostujuciTim.brojPrimjljenihGolova += brojGolovaGostujucegTima
            console.log(`${domaciTim.ime}  ${brojGolovaDomacegTima}:${brojGolovaGostujucegTima}  ${gostujuciTim.ime}`)
            
        }
    }

    }

}


const pronadjiGolRazlikuIBodove = (array) => {
    for (let i = 0; i < array.length; i++) {
        const tim = array[i];
        tim.golRazlika = tim.brojPostignutihGolova - tim.brojPrimjljenihGolova
                tim.brojBodova = tim.brojPobjeda * 3  + tim.brojNerjesenih * 1
    }
}
pronadjiGolRazlikuIBodove(timovi)
// console.log(tim1)
// console.log(tim2)
// console.log(tim3)

pronadjiNajboljiTim = (array) => {
    let brojBodovaTimova = [];
    for (let i = 0; i < array.length; i++) {
        const tim = array[i];
        brojBodovaTimova.push(tim.brojBodova)
    }

    const NajvecimBrojBodova = Math.max(...brojBodovaTimova)
    const indexTimaSaNajvecimBrojembodova = brojBodovaTimova.indexOf(NajvecimBrojBodova)
    let cnt = 0
    for (let i = 0; i < brojBodovaTimova.length; i++) {
        const element = brojBodovaTimova[i];
        if (element == NajvecimBrojBodova) cnt++

    }
    if (cnt == 1) return timovi[indexTimaSaNajvecimBrojembodova].ime
    else {
        const NajvecimBrojBodova = Math.max(...brojBodovaTimova)
        const indexTimaSaNajvecimBrojembodova = brojBodovaTimova.indexOf(NajvecimBrojBodova)
        const timoviSaIstimBrojemBodova = []
        for (let i = 0; i < array.length; i++) {
            const tim = array[i];
            if (tim.brojBodova == NajvecimBrojBodova) timoviSaIstimBrojemBodova.push(tim)
        }
        const golRazlikaTimovaSaIstimBrojemBodova = [];
        for (let i = 0; i < timoviSaIstimBrojemBodova.length; i++) {
            const tim = timoviSaIstimBrojemBodova[i];
            golRazlikaTimovaSaIstimBrojemBodova.push(tim.golRazlika)
        }
        const najvecaGoldRazlika = Math.max(...golRazlikaTimovaSaIstimBrojemBodova)
        const IndexClanasaNajvecomGolRazlikom = golRazlikaTimovaSaIstimBrojemBodova.indexOf(najvecaGoldRazlika)

        return timoviSaIstimBrojemBodova[IndexClanasaNajvecomGolRazlikom].ime

    }

}
console.table(timovi)

console.log(pronadjiNajboljiTim(timovi))