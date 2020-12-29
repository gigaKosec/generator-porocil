let days = {
  "date1": {date: "", lokacijaDela: "dom", stUr: 2, opisDela: ""},
  "date2": {date: "", lokacijaDela: "dom", stUr: 4, opisDela: ""},
  "date3": {date: "", lokacijaDela: "dom", stUr: 5, opisDela: ""},
  "date4": {date: "", lokacijaDela: "dom", stUr: 6, opisDela: ""},
  "date5": {date: "", lokacijaDela: "dom", stUr: 8, opisDela: ""},
}

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

export { days, loadDays, storeDays };

