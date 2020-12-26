<template>
  <div id = "weekly-form">
    <b-container class="week" fluid>
      <b-form id="choose-report-type-form">
        
      </b-form>
      <b-form id="daily-inputs-form">
        <!-- BUTTONS ROW -->
        <b-row class = "buttons-row">
          <!-- datum -->
            <label> Izberi prvi dan v tednu: </label>
            <b-form-datepicker
            start-weekday="1" 
            :date-disabled-fn="dateDisabled"
            :date-format-options="{ year: 'numeric', month: 'short', day: '2-digit'}"
            v-model="firstDayOfWeekDate"
            value-as-date
            size="sm"
            style="width: 170px"
            @input="generateDates"
            ></b-form-datepicker>
          
          <b-col><b-button variant="primary" @click="storeDays" size="lg">SHRANI</b-button></b-col>
          <b-col>
            <b-checkbox id="show-output" v-model="showOutput"> prikaži output</b-checkbox>
            <b-button size="sm" variant="danger" @click="clearLocalStorage">ZBRIŠI LOCAL STORAGE</b-button>
          </b-col>
        </b-row>

        <!-- VRSTICA ZA DNEVNI VNOS -->
        <b-row class="day" v-for="day in days" v-bind:key="day.id" > 
          
          <!-- 1. STOLPEC: ime dneva, lokacija, št ur -->
          <b-col cols="2" style="min-width: 160px">
            <b-row> <!-- ime dneva v tednu -->
              <h2 class="day-name">{{day.dayname}}</h2>
            </b-row>
            <b-row> <!-- datum -->
              <div class=date>{{addDays(firstDayOfWeekDate,day.id).toDateString()}}</div>
            </b-row>
            <b-row class="daily-location"> <!-- lokacija -->
              <b-form-radio-group v-model="day.lokacijaDela" inline="true">
                  <b-form-radio value="dom">dom</b-form-radio>
                  <b-form-radio value="služba">služba </b-form-radio>
              </b-form-radio-group>
            </b-row>
            <b-row class="daily-hours"> <!-- št ur -->
              <label>št. ur:</label>
              <b-form-input type="number" v-model="day.stUr" style="width: 60px"></b-form-input>
            </b-row>
            
          </b-col>
          <!-- 2. STOLPEC: opis dela -->
          <b-col class="daily-work-description"> <b-textarea rows="5" :value="day.opisDela" v-model="day.opisDela"></b-textarea> </b-col>
          <!-- 3. STOLPEC: output -->
          <b-col class="daily-output" cols="4" style="max-height:200px; overflow: hidden" v-if="showOutput">
            <b-row>{{day}}</b-row>
          </b-col>
        </b-row>
      </b-form>
    </b-container>
  </div>
</template>

<script>
import {loadDays,storeDays, days} from '@/services/storeToLocalStorage';

export default {
  data() {
    return {
      firstDayOfWeekDate: new Date(),
      days,
      showOutput: false,
      
    };
  },
  
  mounted (){
    this.days = loadDays()
  },
  methods: {
    generateDates( firstDay ) {/* se sproži ko izberemo datum in doda datume itemom v days */
       for (let i=0;i<5;i++) {
         this.days[i].date = this.addDays(firstDay, i);
       }
    },
    loadDays,
    storeDays,

    clearLocalStorage () {
      localStorage.clear()
      location.reload()
    },
    dateDisabled(ymd, date) {
        // Disable weekends (Sunday = `0`, Saturday = `6`)
        const weekday = date.getDay()
        // Return `true` if the date should be disabled
        return weekday === 0 || weekday === 6
    },
    addDays(date, days) {
      let result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    }
  },
};
</script>

<style scoped>
  #weekly-form {
    margin-left: 20px
  }
</style>