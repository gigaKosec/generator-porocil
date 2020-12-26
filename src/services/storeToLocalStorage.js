let days = [
  { id: 0, dayname: "PON", date: "", lokacijaDela: "dom", stUr: 2, opisDela: ""},
  { id: 1, dayname: "TOR", date: "", lokacijaDela: "dom", stUr: 4, opisDela: ""},
  { id: 2, dayname: "SRE", date: "", lokacijaDela: "dom", stUr: 5, opisDela: ""},
  { id: 3, dayname: "ČET", date: "", lokacijaDela: "dom", stUr: 6, opisDela: ""},
  { id: 4, dayname: "PET", date: "", lokacijaDela: "dom", stUr: 8, opisDela: ""},
]

function loadDays (){
  console.log("zagnal LoadDays");
  if (localStorage.getItem('days')) {
    try {
      days = JSON.parse(localStorage.getItem('days'));
      console.log("zlovdal 'days' from local storage");
      /* return days */
    }
    catch (e) {
      console.log('ERROR:',e)
    }
  }
  return days
  
}

function storeDays () {
    console.log("saving 'days' to local storage")
    const daysJson = JSON.stringify(this.days);
    localStorage.setItem('days', daysJson)
}

export {days, loadDays,storeDays}
