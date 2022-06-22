/*
1. Kreirajte funkciju koja uzima niz fudbalskih klubova sa sljedecim properties: ime,
brojPobjeda, brojPoraza, brojNerjesenih, brojPostignutihGolova,
brojPrimljenihGolova i vraća naziv kluba sa najvećim brojem poena. Ako dvije ekipe
imaju isti broj bodova, vrati se tim sa najvećom gol razlikom.
Za pobjedu tim dobija 3 boda, za poraz dobija 0 bodova i za nerjesenu dobija 1 poen.
Testirati funkciju sa najmanje 5 klubova.
*/

const kreirajFudbalskiTim = (ime, brojPobjeda, brojPoraza, brojNerjesenih, brojPostignutihGolova, brojPrimjljenihGolova) => {
    return {
        ime,
        brojPobjeda,
        brojPoraza,
        brojNerjesenih,
        brojPostignutihGolova,
        brojPrimjljenihGolova,
        golRazlika: 0,
        brojBodova: 0
    }
}
const Francuska = kreirajFudbalskiTim("Francuska", 5, 0, 3, 18, 3)
const Ukrajna = kreirajFudbalskiTim("Ukrajna", 2, 0, 6, 11, 8)
const Finska = kreirajFudbalskiTim("Finska", 3, 3, 2, 10, 10)
const BiH = kreirajFudbalskiTim("Bosna i Hercegovina", 1, 3, 4, 9, 12)
const Kazahstan = kreirajFudbalskiTim("Kazahstan", 0, 3, 5, 5, 20)
const timovi = [];
timovi.push(Francuska, Ukrajna, Finska, BiH, Kazahstan)
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