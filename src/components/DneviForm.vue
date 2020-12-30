<template>
  <div id="daily-inputs">
    <b-container class="week" fluid>
      <b-form id="choose-report-type-form">
        <b-row>
          <b-col>
            <b-row>
              <b-form-radio-group id="type-of-report" v-model="typeOfReport" buttons>
                <b-form-radio value="weekly" button-variant="outline-primary"> teden </b-form-radio>
                <b-form-radio value="monthly" button-variant="outline-primary"> mesec </b-form-radio>
              </b-form-radio-group>
            </b-row>

            <b-row>
              <b-input-group
                prepend="ki vsebuje"
                style="width: 20rem"
                title="Izberi katerikoli dan iz tedna"
              >
                <b-form-datepicker
                  id="selected-date"
                  start-weekday="1"
                  :date-disabled-fn="dateDisabled"
                  :date-format-options="{
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                  }"
                  v-model="chosenDate"
                  value-as-date
                  size="sm"
                  style="width: 170px"
                  @input="renderNewReport"
                ></b-form-datepicker>
              </b-input-group>
              <!-- <b-button>pošlji</b-button> -->
            </b-row>
          </b-col>
        </b-row>
      </b-form>

      <b-form id="daily-inputs-form">
        <!-- BUTTONS ROW -->
        <b-row class="buttons-row">
          <!-- datum -->

          <b-col offset="2"
            ><b-button variant="primary" @click="storeReports()" size="lg"
              >SHRANI</b-button
            ></b-col
          >
          <b-col>
            <b-row><b-checkbox id="show-output" v-model="showOutput">
              prikaži output</b-checkbox
            >
            <b-button size="sm" variant="danger" v-if="showOutput" @click="clearLocalStorage"
              >ZBRIŠI LOCAL STORAGE</b-button
            >
            </b-row>
          </b-col>
        </b-row>

        <!-- VRSTICA ZA DNEVNI VNOS -->
        <!-- <p> IZBRANI DATUMI: {{ datesChosen.map(x => ISOdate(x)) }}</p> -->
        <b-row
          class="day"
          v-for="(day, index) in multipleDaysReports"
          v-bind:key="index"
        >
          <!-- 1. STOLPEC: PODATKI O DNEVU-->
          <b-col cols="2" style="min-width: 160px">
            <!-- ime dneva v tednu -->
            <b-row>  
              <h2 class="day-name">{{dayOfWeek(day.datum)}}</h2>
            </b-row>
            <!-- datum -->
            <b-row>
              <div class=date>{{ ISOdate(new Date(day.datum)) }}</div>
            </b-row>
            <b-row class="daily-location">
              <!-- lokacija -->
              <b-form-radio-group v-model="day.lokacijaDela" inline="true" buttons>
                <b-form-radio value="doma" button-variant="outline-secondary" >doma</b-form-radio>
                <b-form-radio value="služba" button-variant="outline-secondary">služba </b-form-radio>
              </b-form-radio-group>
            </b-row>
            <b-row class="daily-hours">
              <!-- št ur -->
              <label>št. ur:</label>
              <b-form-input
                type="number"
                v-model="day.stUr"
                style="width: 60px"
              ></b-form-input>
            </b-row>
          </b-col>
          <!-- 2. STOLPEC: opis dela -->
          <b-col class="daily-work-description">
            <b-textarea
              rows="5"
              :value="day.opisDela"
              v-model="day.opisDela"
            ></b-textarea>
          </b-col>
          <!-- 3. STOLPEC: output -->
          <b-col
            class="daily-output"
            cols="4"
            style="max-height: 200px; overflow: hidden"
            v-if="showOutput"
          >
            <b-row>{{ day }}</b-row>
          </b-col>
        </b-row>
      </b-form>
    </b-container>
  </div>
</template>

<script>
import { setDay, eachDayOfInterval, parseJSON, parseISO } from "date-fns";
import * as Fdate from "date-fns";
//import {loadDays,storeDays, days} from '@/services/storeToLocalStorage';
/* import {
  loadAllReports,
  storeReports,
  //SingleDayReport,
} from "@/services/storageAlter.js"; */

export default {
  data() {
    return {
      typeOfReport: "weekly",
      chosenDate: null,  //new Date(), PAZI - moraš še odrezat ure itd.
      showOutput: false,
      datesChosen: [],
      reportsStored: {},
      multipleDaysReports: {},
    };
  },
  computed: {
    firstDayOfWeekDate: function () {
      return setDay(this.chosenDate, 1);
    },
    lastDayOfWeekDate: function () {
      /* console.log("last date of week =", this.addDays(this.firstDayOfWeekDate,5)) */
      return this.addDays(this.firstDayOfWeekDate, 4);
    },
  }, 

  mounted() {
    this.reportsStored = this.loadAllReports();
    this.chosenDate = new Date()
    this.chosenDate.setHours(0,0,0,0)
    this.renderNewReport()
    //this.generateChosenDays()
    
  },

  methods: {
    renderNewReport (){
      this.storeReports()
      this.generateChosenDays()
      this.getMultipleDaysReportsForDatesChosen()
    },
    
    generateChosenDays () {
      console.log("THE date chosen =", this.chosenDate)
      let result = eachDayOfInterval({
        start: this.firstDayOfWeekDate,
        end: this.lastDayOfWeekDate,
      });

      this.datesChosen = result;
      console.log("dates chosen = ", this.datesChosen);
      console.log("Multiple days reports pred generiranjem:", this.multipleDaysReports)
    },
    //loadDays
    //loadAllReports,
    //storeDays,

    //storeReports(multipleDaysReports),

    getMultipleDaysReportsForDatesChosen() {
      class SingleDayReport {
        constructor(datum = null, lokacijaDela = "doma", stUr = 8, opisDela = "") {
          this.datum = datum;
          this.lokacijaDela = lokacijaDela;
          this.stUr = stUr;
          this.opisDela = opisDela;
        }
      }
      this.multipleDaysReports = {}
      for (let date of this.datesChosen) {
        const dateAsKey=this.ISOdate(date)
        console.log("type od prvega datuma =", typeof dateAsKey)
        console.log("type od drugega datuma = ", typeof (Object.keys(this.reportsStored)[0]) )
        console.log("new key for date =",dateAsKey)
        
        if ((Object.keys(this.reportsStored)).includes(dateAsKey)) {
          console.log("datum najden v reportsStore");
          this.multipleDaysReports[dateAsKey] = this.reportsStored[dateAsKey];
        } else {
          console.log("NISEM našel datuma", dateAsKey, "v", Object.keys(this.reportsStored));
          let dailyInput = new SingleDayReport(date);
          
          console.log("generiram nov defaultni dnevni vnos")
          console.log("daily Input =", dailyInput)
          this.multipleDaysReports[dateAsKey] = dailyInput;
          
        }
      }
      console.log("MultipleDaysReports po generiranju = ", this.multipleDaysReports)
    },

    // STORING METHODS
    

    clearLocalStorage() {
      if (confirm("Ali res želiš izbrisati vse vnose?")) {
        localStorage.clear();
        location.reload();
      }
    },
    storeReports() {
      console.log("SHRANJUJEM V LOCAL STORE")
      
      for (let [key,value] of Object.entries(this.multipleDaysReports)) {
        console.log("  key =", key)
        console.log("value =",value)
        this.reportsStored[key] = value
        console.log("reports stored =",this.reportsStored)
      }
      console.log("KONČNI reports stored",this.reportsStored)
      localStorage.setItem("reportsOfWork", JSON.stringify(this.reportsStored))
      
    },

    loadAllReports() {
      if (localStorage.getItem("reportsOfWork") === null){
        console.log("ni našel ničesar v local storage")
        return {}
      }
      else {
        //let localReportsStored = {}
        let tempReportsStored =  JSON.parse(localStorage.getItem("reportsOfWork"));
        //let prviKey = Object.keys(tempReportsStored)[0]
        //console.log("v local storageu našel: ", tempReportsStored)
        //console.log("keys = ", Object.keys(tempReportsStored))
        //console.log("prvi key =", prviKey)
        //console.log("type of key = ", typeof prviKey)
        //console.log("pretvorjen key =", Fdate.parseISO(prviKey))
        /*reportsStored = {};
        for (const [key, value] of Object.entries(temp)) {
          reportsStored[parseJSON(key)] = value;
        }*/
        //
        //for (let [key,value] of Object.entries(tempReportsStored)) {
        //  localReportsStored[parseJSON(key)] = value
        //}

        //console.log("pretvoril local storage v: ", localReportsStored)
        //console.log("Type od ključev sedaj: ", typeof Object.keys(localReportsStored)[0] ) */
        return tempReportsStored;
      }
    },

    // DATE RELATED METHODS
    ISOdate(date){
      return Fdate.formatISO(date,{representation: "date"})
    },
    dateDisabled(ymd, date) {
      // Disable weekends (Sunday = `0`, Saturday = `6`)
      const weekday = date.getDay();
      // Return `true` if the date should be disabled
      return weekday === 0 || weekday === 6;
    },
    addDays(date, days) {
      let result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    },
    dayOfWeek (dateString) {
      return Fdate.format(new Date(dateString),'eee')
    },
  }
}
</script>

<style scoped>
#daily-inputs {
  margin-left: 20px;
}
</style>

