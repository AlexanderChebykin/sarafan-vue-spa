<template>
    <div class="exchange-rates-block">
        <div class="exchange-rates__title">Курс валют на {{currentDate}}</div>
        <div class="exchange-rates__thead">
            <div class="exchange-rates__thead-coltitle">Код</div>
            <div class="exchange-rates__thead-coltitle">Единиц</div>
            <div class="exchange-rates__thead-coltitle">Курс</div>
        </div>
        <div class="exchange-rates__tbody">
            <div class="exchange-rates__tbody-row" v-for="(valute, key) in exchangeTable" :key="key">
                <div class="exchange-rates__col">{{key}}</div>
                <div class="exchange-rates__col">{{valute.Nominal}}</div>
                <div class="exchange-rates__col" v-bind:class="[
                        (valute.Value < valute.Previous)  ? 'red' : 'black',
                        (valute.Value > valute.Previous)  ? 'green' : 'black']">  
                    {{valute.Value | toFixed2 | changeDelimiter}} 
                    ({{valute.Value - valute.Previous | toFixed2 | addOrRemovePlusMinus| changeDelimiter  }})
                    
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {

    data: () => ({
     
    }),
    computed:{
        currentDate(){
            let date = new Date();
            return  ('0' + date.getDate()).slice(-2) + '.' 
            + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear();
        },

       exchangeTable(){
            return this.$store.getters.exchangeTable;
        },
    },
    filters:{
            changeDelimiter(num){
                if(num){
                    return num.replace('.', ',');
                }
                return num;
            },
			toFixed2(num){
				return num.toFixed(2);
            },
            addOrRemovePlusMinus(num){
                if(num > 0){
                    return "+" + num;
                }
                else if(num < 0) return num;
                else return "0,00";

            }
		},
    mounted(){
    }
}
</script>

<style scoped>
   .exchange-rates-block{
       min-height: 200px;
       width: 400px;
       padding: 32px 16px;
       height: 100vh;
       overflow-y: scroll;
   }
   .exchange-rates__title{
       margin-bottom: 24px;
       font-weight: bold;
       font-size: 16px;
       line-height: 24px;
       color: #000000;
       margin-left:20px;
   }
    .red{
        color: #F62434;
    }
    .green{
       color: #00B956;
    }

    .exchange-rates__thead{
        padding-bottom: 16px;
        border-bottom: 1px solid #E5E5E5;
        font-size: 13px;
        line-height: 16px;
        color: rgba(51, 51, 51, 0.5);
    }

    .exchange-rates__thead-coltitle{
         width: 33%;
    }

    .exchange-rates__thead,
    .exchange-rates__tbody-row{
        display: flex;
        justify-content: space-between;
        text-align: center;
    }

    .exchange-rates__col{
         padding: 8px 0px;
         width: 33%;
    }
</style>

