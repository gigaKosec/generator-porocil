<template>
  <div id="daily-inputs">
    <b-container class="week" fluid>
      <b-form id="choose-report-type-form">
        <b-row>
          <!-- <b-input-group prepend="izberi mesec">
            <b-form-input type="month"></b-form-input> -->
          <!-- <b-select>

          </b-select> -->

          <b-input-group
            prepend="teden"
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
              @input="generateChosenDays"
            ></b-form-datepicker>
          </b-input-group>
          <b-button>izberi</b-button>
        </b-row>
      </b-form>

      <b-form id="daily-inputs-form">
        <!-- BUTTONS ROW -->
        <b-row class="buttons-row">
          <!-- datum -->

          <b-col
            ><b-button variant="primary" @click="storeReports()" size="lg"
              >SHRANI</b-button
            ></b-col
          >
          <b-col>
            <b-checkbox id="show-output" v-model="showOutput">
              prikaži output</b-checkbox
            >
            <b-button size="sm" variant="danger" @click="clearLocalStorage"
              >ZBRIŠI LOCAL STORAGE</b-button
            >
          </b-col>
        </b-row>

        <!-- VRSTICA ZA DNEVNI VNOS -->
        <p>{{ datesChosen }}</p>
        <b-row
          class="day"
          v-for="(day, index) in multipleDaysReports"
          v-bind:key="index"
        >
          <!-- 1. STOLPEC: ime dneva, lokacija, št ur -->
          <b-col cols="2" style="min-width: 160px">
            <!-- <b-row>  --><!-- ime dneva v tednu -->
            <!-- <h2 class="day-name">{{day.dayname}}</h2>
            </b-row>
            <b-row> -->
            <!-- datum -->
            <!-- <div class=date>{{day.date}}</div>
            </b-row> -->
            <b-row class="daily-location">
              <!-- lokacija -->
              <b-form-radio-group v-model="day.lokacijaDela" inline="true">
                <b-form-radio value="dom">dom</b-form-radio>
                <b-form-radio value="služba">služba </b-form-radio>
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
      chosenDate: null,  //new Date(),
      //days,
      //multipleDaysReports,
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

    /* multipleDaysReportsArray: function(){
      return Object.values(multipleDaysReports())
    }, */
  },

  mounted() {
    this.reportsStored = this.loadAllReports();
  },

  methods: {
    generateChosenDays () {
      let result = eachDayOfInterval({
        start: this.firstDayOfWeekDate,
        end: this.lastDayOfWeekDate,
      });

      this.datesChosen = result;
      console.log("dates chosen = ", this.datesChosen);
      console.log("Multiple days reports pred generiranjem:", this.multipleDaysReports)
      this.getMultipleDaysReportsForDatesChosen()
    },
    //loadDays
    //loadAllReports,
    //storeDays,

    //storeReports(multipleDaysReports),

    getMultipleDaysReportsForDatesChosen() {
      class SingleDayReport {
        constructor(datum = null, lokacijaDela = "dom", stUr = 8, opisDela = "") {
          this.datum = datum;
          this.lokacijaDela = lokacijaDela;
          this.stUr = stUr;
          this.opisDela = opisDela;
        }
      }
      this.multipleDaysReports = {}
      for (let date of this.datesChosen) {
        console.log("type od prvega datuma =", typeof date)
        console.log("type od drugega datuma = ", typeof (Object.keys(this.reportsStored)[0]) )
        
        if (date in Object.keys(this.reportsStored)) {
          console.log("datum najden v reportsStore");
          this.multipleDaysReports[date] = this.reportsStored[date];
        } else {
          console.log("NISEM našel datuma", date, "v", Object.keys(this.reportsStored));
          let dailyInput = new SingleDayReport(date);
          //console.log("daily Input =", dailyInput)
          this.multipleDaysReports[date] = dailyInput;
          
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
        let localReportsStored = {}
        let tempReportsStored =  JSON.parse(localStorage.getItem("reportsOfWork"));
        let prviKey = Object.keys(tempReportsStored)[0]
        console.log("v local storageu našel: ", tempReportsStored)
        console.log("keys = ", Object.keys(tempReportsStored))
        console.log("prvi key =", prviKey)
        console.log("type of key = ", typeof prviKey)
        console.log("pretvorjen key =", Fdate.parseISO(prviKey))
        /*reportsStored = {};
        for (const [key, value] of Object.entries(temp)) {
          reportsStored[parseJSON(key)] = value;
        }*/
        
        for (let [key,value] of Object.entries(tempReportsStored)) {
          localReportsStored[parseJSON(key)] = value
        }

        console.log("pretvoril local storage v: ", localReportsStored)
        console.log("Type od ključev sedaj: ", typeof Object.keys(localReportsStored)[0] )
        return localReportsStored;
      }
    },

    // DATE RELATED METHODS
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
  },
};
</script>

<style scoped>
#daily-inputs {
  margin-left: 20px;
}
</style>

