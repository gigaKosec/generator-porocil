<template>
  <div id = "weekly-form">
    <b-container class="week" fluid>
      <b-form>
        <b-row class = "buttons-row">
          <b-col cols="6"><b-button variant="primary" @click="saveDays" size="lg">SHRANI</b-button></b-col>
          <b-col>
            <b-checkbox id="show-output" v-model="showOutput"> prikaži output</b-checkbox>
          </b-col>
          <b-col cols="4"><b-button size="sm" variant="danger" @click="clearLocalStorage">ZBRIŠI LOCAL STORAGE</b-button></b-col>
        </b-row>

        <b-row class="day" v-for="day in days" v-bind:key="day.id" > 
          <b-col cols="2" style="max-width: 170px">
            <b-row>
              <h2>{{day.dayname}}</h2>
            </b-row>
            <b-row class="daily-location"> 
              <b-form-radio-group v-model="day.lokacijaDela" inline="true">
                  <b-form-radio value="dom">dom</b-form-radio>
                  <b-form-radio value="služba">služba</b-form-radio>
              </b-form-radio-group>
            </b-row>
            <b-row class="daily-hours">
              <label>št. ur:</label>
              <b-form-input type="number" v-model="day.stUr" style="width: 60px"></b-form-input>
            </b-row>
            
          </b-col>
          <b-col class="daily-work-description"> <b-textarea rows="5" :value="day.opisDela" v-model="day.opisDela"></b-textarea> </b-col>
          <b-col class="daily-output" cols="4" style="max-height:200px; overflow: hidden" v-if="showOutput">
            <b-row> OUTPUTS:</b-row>
            <b-row>{{day}}</b-row>
          </b-col>
        </b-row>
      </b-form>
    </b-container>
  </div>
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
      showOutput: false
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
    },
    clearLocalStorage () {
      localStorage.clear()
      location.reload()
    }
  }
};
</script>

<style scoped>
  #weekly-form {
    margin-left: 20px
  }
</style>