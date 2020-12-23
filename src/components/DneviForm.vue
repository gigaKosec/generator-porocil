<template>
  <b-container class="week" fluid>
    <b-form>
      <b-button @click="saveDays">SHRANI</b-button>
      <b-row class="day" v-for="day in days" v-bind:key="day.id" > 
        <b-col cols="2">
          <b-row>
            {{day.dayname}}
          </b-row>
          <b-row class="daily-location"> 
            <b-form-radio-group v-model="day.lokacijaDela" :name="day.lokacijaDela" inline="true">
                <b-form-radio value="dom">dom</b-form-radio>
                <b-form-radio value="služba">služba</b-form-radio>
            </b-form-radio-group>
          </b-row>
          <b-row class="daily-hours">
            <label>št. ur:</label>
            <b-form-input type="number" :value="day.st-ur" v-model="day.stUR" style="width: 60px"></b-form-input>
          </b-row>
          
        </b-col>
        <b-col class="daily-work-description"> <b-textarea rows="5" :value="day.opisDela" v-model="day.opisDela"></b-textarea> </b-col>
        <b-col class="daily-output" cols="4" style="max-height:200px; overflow: hidden">
          <b-row> OUTPUTS:</b-row>
          <b-row>{{day}}</b-row>
        </b-col>
      </b-row>
    </b-form>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      days: [
        { id: 0, dayname: "PON", lokacijaDela: "dom", stUr: 8, opisDela: ""},
        { id: 1, dayname: "TOR", lokacijaDela: "dom", stUr: 8, opisDela: ""},
        { id: 2, dayname: "SRE", lokacijaDela: "dom", stUr: 8, opisDela: ""},
        { id: 3, dayname: "ČET", lokacijaDela: "dom", stUr: 8, opisDela: ""},
        { id: 4, dayname: "PET", lokacijaDela: "dom", stUr: 8, opisDela: ""},
      ],
    };
  },
  mounted (){
    if (localStorage.getItem('days')) {
      try {this.loadDays(this.days)}
      catch (e) {
        console.log('ERROR:',e)
      }
    }
  },
  methods: {
    loadDays (days){
      console.log("loading 'days' from local storage");
      this.days = JSON.parse(localStorage.getItem('days'));
    },
    
    saveDays (days) {
      console.log("saving 'days' to local storage")
      const daysJson = JSON.stringify(this.days);
      localStorage.setItem('days', daysJson)
    }
  }
};
</script>

<style>
</style>