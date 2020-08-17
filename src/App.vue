<template>
  <div id="app">
    <div class="container">
      <SelectCurrency></SelectCurrency>
      <ExchangeRatesTable></ExchangeRatesTable>
      <Balance></Balance>
    </div>
  </div>
</template>

<script>
import SelectCurrency from "@/components/SelectCurrency";
import Balance from "@/components/Balance";
import ExchangeRatesTable from "@/components/ExchangeRatesTable";
export default {
  components: { SelectCurrency, Balance, ExchangeRatesTable },
  data: () => ({
  }),

  mounted(){
    this.getExchangeRatesData();
  },

  methods:{
    getExchangeRatesData() { 
       let promise = fetch('https://www.cbr-xml-daily.ru/daily_json.js');
       promise.then(
            response => {
                return response.json(); 
            }
        ).then(
            data => {
                this.$store.dispatch('updateExchangeRatesData', data);
            }
        );
    }
  }
};
</script>

<style>
*,
*::after,
*::before {
  box-sizing: border-box;
  outline: none;
}
body {
  font-family: PT Sans;
}
.container{
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
