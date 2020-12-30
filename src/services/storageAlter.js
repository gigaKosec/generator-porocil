//import {chosenDate} from '@/components/DneviForm.vue'
import { parseJSON } from 'date-fns';

console.log('script zlovdan')
//console.log("magični chosen date =",chosenDate)

class SingleDayReport {
  constructor(date = null, lokacijaDela = "dom", stUr = 8, opisDela = "") {
    this.date = date;
    this.lokacijaDela = lokacijaDela;
    this.stUr = stUr;
    this.opisDela = opisDela;
  }
}

/* DUMMY STORED DATA */

/* let day1 = new SingleDayReport(new Date(2020, 11, 21), "služba", 5, "Učenje VueJS")
let day2 = new SingleDayReport(new Date(2020, 11, 23), "služba", 7, "Učenje VueJS, projekt 'generator porocil'")
let day3 = new SingleDayReport(new Date(2020, 11, 24), "služba", 3, "Učenje VueJS, sestanek oddelka")

let reportsStored = {
  [day1.date]: day1,
  [day2.date]: day2,
  [day3.date]: day3
}
 */

//let reportsStored = []

/* let datesChosen = [
  new Date(2020, 11, 21),
  new Date(2020, 11, 22),
  new Date(2020, 11, 23),
  new Date(2020, 11, 24),
  new Date(2020, 11, 25),
] */



/* function getMultipleDaysReportsForDatesChosen(datesChosen, reportsStored) {
  //let multipleDaysReports = {}
  console.log("reportsStored, ki jih pregledujemo:", reportsStored)
  for (let date of datesChosen) {
    if (date in reportsStored) {
      console.log("datum najden v reportsStore")
      multipleDaysReports[date]=reportsStored[date]


      /*določanje posameznih atributov:
        let dailyReport = new SingleDayReport(
        reportsStored[date].date,
        reportsStored[date].lokacijaDela,
        reportsStored[date].stUr,
        reportsStored[date].opisDela)
      multipleDaysReports.push({[date]:dailyReport}) */
    /*}
    else {

      console.log("NISEM našel datuma", date, "v", reportsStored)
      let dailyInput = new SingleDayReport(date)
      multipleDaysReports[date]=dailyInput
    }
  }
  //return multipleDaysReports
}
 */

 
function storeReportsToLocalStorage() {
  localStorage.setItem("reportsOfWork", JSON.stringify(multipleDaysReports))
}

function storeReports () {
  console.log("storing reports to local storage")
  storeReportsToLocalStorage()
}

function loadAllReportsFromLocalStorage() {
  if (localStorage.getItem("reportsOfWork") === null){
    console.log("ni našel ničesar v local storage")
    return {}
  }
  else {
    let reportsStored =  JSON.parse(localStorage.getItem("reportsOfWork"));
    /*reportsStored = {};
    for (const [key, value] of Object.entries(temp)) {
       reportsStored[parseJSON(key)] = value;
    }*/
    console.log("v local storageu našel: ", reportsStored)
    console.log(typeof Object.keys(reportsStored)[0] )
    return reportsStored;
  }
}

function loadAllReports () {
  return loadAllReportsFromLocalStorage();
}


// ZAGON
/* let multipleDaysReports = {
  "date1": {date: "", lokacijaDela: "dom", stUr: 2, opisDela: ""},
  "date2": {date: "", lokacijaDela: "dom", stUr: 4, opisDela: ""},
  "date3": {date: "", lokacijaDela: "dom", stUr: 5, opisDela: ""},
  "date4": {date: "", lokacijaDela: "dom", stUr: 6, opisDela: ""},
  "date5": {date: "", lokacijaDela: "dom", stUr: 8, opisDela: ""},
} */

//let multipleDaysReports = {}
//let reportsStored = {}


//reportsStored = loadAllReports()
//console.log("reportsStored po loadAllReports", reportsStored)
//multipleDaysReports = getMultipleDaysReportsForDatesChosen(datesChosen, reportsStored)
//console.log("STORAGEALTER: KONCNI Multiple days reports:", multipleDaysReports)
//storeReports(multipleDaysReports)

export {loadAllReports, storeReports}



/* 
TODO:
- Cancel vse vnose trenutne = znova zlovdaj stanje iz local storage
  × uporabniki bolj rabijo cancel posameznega vnosnega polja (s tem je več dela za narest)
*/