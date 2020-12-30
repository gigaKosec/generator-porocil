<template>
  <div id="daily-inputs">
    <b-container class="week" fluid>
      <b-form id="choose-report-type-form">
        <b-row>
          <b-col>
            <b-row>
              <b-input-group prepend="Poročilo">
                <b-form-radio-group
                  id="type-of-report"
                  v-model="typeOfReport"
                  buttons
                  @change="renderNewReport"
                >
                  <b-form-radio value="weekly" button-variant="outline-primary">
                    tedensko
                  </b-form-radio>
                  <b-form-radio
                    value="monthly"
                    button-variant="outline-success"
                  >
                    mesečno
                  </b-form-radio>
                </b-form-radio-group>
              </b-input-group>
            </b-row>

            <b-row>
              <b-input-group
                prepend="Izberi"
                style="width: 20rem"
                title="Izberi katerikoli dan iz tedna/meseca"
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
                <!-- <div>OD: {{formatISO(firstOfSelectedDays,{<<})}} DO: {{ISOdate(lastOfSelectedDays)}} </div> -->
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
            <b-row
              ><b-checkbox id="show-output" v-model="showOutput" switch>
                prikaži output</b-checkbox
              >
              <b-button
                size="sm"
                variant="danger"
                v-if="showOutput"
                @click="clearLocalStorage"
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
          <b-col cols="2" style="min-width: 170px">
            
            <b-row>
              <h2 class="day-name"></h2>
              <h3>
                <!-- ime dneva v tednu -->
                {{new Date(day.datum).toLocaleDateString("sl", {
                    weekday: "short",
                  }).slice(0,3).toUpperCase()
                }}
                <!-- datum -->
                {{
                  new Date(day.datum).toLocaleDateString("sl", {
                    day: "2-digit",
                    month: "short",
                  })
                }}
              </h3>
            </b-row>
            <!-- lokacija -->
            <b-row class="daily-location">
              <b-form-radio-group
                v-model="day.lokacijaDela"
                inline="true"
                buttons
                :hidden="isWeekendDay(new Date(day.datum))"
              >
                <b-form-radio value="doma" button-variant="outline-secondary"
                  >od doma</b-form-radio
                >
                <b-form-radio value="služba" button-variant="outline-success"
                  >v službi
                </b-form-radio>
              </b-form-radio-group>
            </b-row>
            <b-row class="daily-hours">
              <!-- št ur -->
              <b-input-group prepend="št. ur" :hidden="isWeekendDay(new Date(day.datum))">
                <b-form-input type="number" v-model="day.stUr"></b-form-input>
              </b-input-group>
            </b-row>
          </b-col>
          <!-- 2. STOLPEC: opis dela -->
          <b-col class="daily-work-description">
            <b-form-textarea
              rows="4"
              max-rows="8"
              :value="day.opisDela"
              v-model="day.opisDela"
              :disabled="isWeekendDay(new Date(day.datum))"
              
              
            ></b-form-textarea>
          </b-col>

          <!-- 3. STOLPEC: (optionalen) output -->
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
import { setDay, eachDayOfInterval, parseISO } from "date-fns";
import * as Fdate from "date-fns";
import { sl } from "date-fns/locale";

export default {
  data() {
    return {
      typeOfReport: "weekly",
      chosenDate: null, //new Date(), PAZI - moraš še odrezat ure itd.
      showOutput: false,
      datesChosen: [],
      reportsStored: {},
      multipleDaysReports: {},
    };
  },
  computed: {
    firstOfSelectedDays: function () {
      if (this.typeOfReport==="weekly"){
        return setDay(this.chosenDate, 1);
      }
      else if (this.typeOfReport==="monthly") {
        return Fdate.startOfMonth(this.chosenDate);
      }
      else {
        return "NAPAKA"
      }
    },
    lastOfSelectedDays: function () {
      if (this.typeOfReport==="weekly"){
        return setDay(this.chosenDate, 5);
      }
      else if (this.typeOfReport==="monthly") {
        return Fdate.lastDayOfMonth(this.chosenDate);
      
      } else {
        return "NAPAKA"
      }
    },
  },

  mounted() {
    this.reportsStored = this.loadAllReports();
    this.chosenDate = new Date();
    this.chosenDate.setHours(0, 0, 0, 0);
    this.renderNewReport();
    //this.generateChosenDays()
  },

  methods: {
    renderNewReport() {
      this.storeReports();
      this.generateChosenDays();
      this.getMultipleDaysReportsForDatesChosen();
    },

    generateChosenDays() {
      console.log("THE date chosen =", this.chosenDate);
      let result = eachDayOfInterval({
        start: this.firstOfSelectedDays,
        end: this.lastOfSelectedDays,
      });

      this.datesChosen = result;
      console.log("dates chosen = ", this.datesChosen);
      console.log(
        "Multiple days reports pred generiranjem:",
        this.multipleDaysReports
      );
    },
    //loadDays
    //loadAllReports,
    //storeDays,

    //storeReports(multipleDaysReports),

    getMultipleDaysReportsForDatesChosen() {
      class SingleDayReport {
        constructor(
          datum = null,
          lokacijaDela = "doma",
          stUr = 8,
          opisDela = ""
        ) {
          this.datum = datum;
          this.lokacijaDela = lokacijaDela;
          this.stUr = stUr;
          this.opisDela = opisDela;
        }
      }
      this.multipleDaysReports = {};
      for (let date of this.datesChosen) {
        const dateAsKey = this.ISOdate(date);
        console.log("type od prvega datuma =", typeof dateAsKey);
        console.log(
          "type od drugega datuma = ",
          typeof Object.keys(this.reportsStored)[0]
        );
        console.log("new key for date =", dateAsKey);

        if (Object.keys(this.reportsStored).includes(dateAsKey)) {
          console.log("datum najden v reportsStore");
          this.multipleDaysReports[dateAsKey] = this.reportsStored[dateAsKey];
        } else {
          console.log(
            "NISEM našel datuma",
            dateAsKey,
            "v",
            Object.keys(this.reportsStored)
          );
          let dailyInput = new SingleDayReport(date);

          console.log("generiram nov defaultni dnevni vnos");
          console.log("daily Input =", dailyInput);
          this.multipleDaysReports[dateAsKey] = dailyInput;
        }
      }
      console.log(
        "MultipleDaysReports po generiranju = ",
        this.multipleDaysReports
      );
    },

    // STORING METHODS

    clearLocalStorage() {
      if (confirm("Ali res želiš izbrisati vse vnose?")) {
        localStorage.clear();
        location.reload();
      }
    },
    storeReports() {
      console.log("SHRANJUJEM V LOCAL STORE");

      for (let [key, value] of Object.entries(this.multipleDaysReports)) {
        console.log("  key =", key);
        console.log("value =", value);
        this.reportsStored[key] = value;
        console.log("reports stored =", this.reportsStored);
      }
      console.log("KONČNI reports stored", this.reportsStored);
      localStorage.setItem("reportsOfWork", JSON.stringify(this.reportsStored));
    },

    loadAllReports() {
      if (localStorage.getItem("reportsOfWork") === null) {
        console.log("ni našel ničesar v local storage");
        return {};
      } else {
        //let localReportsStored = {}
        let tempReportsStored = JSON.parse(
          localStorage.getItem("reportsOfWork")
        );
        return tempReportsStored;
      }
    },

    // DATE RELATED METHODS
    ISOdate(date) {
      return Fdate.formatISO(date, { representation: "date" });
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
    isWeekendDay(date){
      if (Fdate.isWeekend(date)){
        return true
      }
      else {
        return false
      }
    }
    /* dayOfWeek(dateString) {
      return Fdate.format(new Date(dateString), "EEE", { locale: sl });
    }, */
  },
};
</script>

<style scoped>
#daily-inputs {
  margin-left: 20px;
}

.grey {
  background: lightgrey;
}
</style>

