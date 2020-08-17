<template>
    <div id="selectBlock">
        <div class="label">Валюта:</div>
        <div v-bind:class="['select', activeClass  ? 'is-active' : '']">
            <div class="select__header" @click = "selectToggle">
                <span class="select__current">{{currentValue}}</span>
                <span v-if="activeClass" class="arrow">&#xf0d8;</span>
                <span v-else class="arrow">&#xf0dd;</span>
            </div>

            <div class="select__body"  @click = "selectChoose">
                <div  v-for="(valute, key) in exchangeTable"  :value="key"  :key="key"
                class="select__item" :data-symbol = "key">
                    {{valute.Name}} ({{valute.CharCode}})
                </div>
            </div>
        </div>

        <div class="label">Доступно:</div>
        <div id="balance">{{balance | toFixed2 | numFormat | changeDelimiter}} {{selectedSymbol}}</div>
        <div class="label">Хочу:</div>

        <button id="btn-buy-1" @click="selectBuyMode">Купить</button>
        <button id="btn-sell" @click="selectSellMode" >Продать</button>

         <p v-if="errors.length" class = "error">
            <ul>
                <li v-for="(error, ind) in errors" :key="ind">{{ error }}</li>
            </ul>
        </p>
        <input 
            ref="input"
            id="value-input"
            type="text"
            placeholder="0,000" 
            v-model="requestedAmount"
            @keyup="requestedAmountChangeHandler"
            @focus="requestedAmount=''"
            >

        <div v-if = "mode == 'buy'" class="label">Заплачу:</div>
        <div v-if = "mode == 'sell'" class="label">Получу:</div>

        <div id="sum">{{sum | toFixed2 | numFormat | changeDelimiter}}  &#8381;</div>

        <button v-if = "mode == 'buy'" class="mainBtn" @click = "mainBtnClickHandler">Купить</button>
        <button v-if = "mode == 'sell'" class="mainBtn" @click = "mainBtnClickHandler" >Продать</button>
    </div>
</template>

<script>
export default {
    data: () => ({
        requestedAmount : "0,00", //сумма, которую пользователь хочет купить или продать
        mode: "buy", //режим работы - покупка или продажа
        selectedSymbol : "AUD", //текущая выбранная валюта
        currentValue : "Австралийский доллар (AUD)",
        sum: 0, //сумма, которую получит или заплатит пользователь
        errors: [],
        activeClass : false,
        balance: 0,
    }),

    computed:{
        exchangeTable(){
            return this.$store.getters.exchangeTable;
        },
    },

    methods: {
        selectBuyMode: function () {
            this.mode = 'buy';
            this.errors = [];
        },
        selectSellMode: function () {
            this.mode = 'sell';
            this.errors = [];
        },
        requestedAmountChangeHandler(e){
            let value = e.target.value;
            //если в инпуте - целое число или с плавающей запятой(точкой)
             if(value.match(/^\d+(?:[\.,]\d+)?$/)){
                //меняем запятую на точку, чтобы не было ошибки при вычислениях
                 this.requestedAmount = this.requestedAmount.replace(',', '.');
                //этот код не даёт ввести более двух знаков после запятой
                 let arr = this.requestedAmount.split('.');
                 if(arr[1]){
                    if(arr[1].length>2){
                        arr[1]=arr[1][0]+arr[1][1];
                        this.requestedAmount = arr.join('.'); 
                    }
                 }
                //вычисляем необходимую сумму
                let rate = this.exchangeTable[this.selectedSymbol].Value;
                this.sum = this.requestedAmount*rate;
                //и меняем точку на запятую обратно, чтобы был правильный формат в инпуте
                this.requestedAmount = this.requestedAmount.replace('.', ',');
            }
            else{
                //если в инпуте некорректное значение - убираем все не числа, кроме точек или запятых
                this.requestedAmount = this.requestedAmount.replace(/[^0-9,.]/g, '');
                //чтобы нельзя было ввести цифру, потом запятую, потом снова цифру и снова запятую
                this.requestedAmount = this.requestedAmount.replace(/(\d+[,.]\d+)[.,].*/g, '$1');
                //чтобы нельзя было ввести несколько точек или запятых
                this.requestedAmount = this.requestedAmount.replace(/[.,]+/g, ',');  
            }
        },
        mainBtnClickHandler(){
            this.errors = [];
            let amount = this.requestedAmount.replace(',', '.');
            let obj = { sum: this.sum, 
                        selectedSymbol: this.selectedSymbol, 
                        amount: amount
                      };
            if(this.mode == 'buy'){
                if(this.$store.getters.balance['RUR'] >= this.sum){
                    this.$store.dispatch('buy', obj);
                    this.balance = this.$store.getters.balance[this.selectedSymbol];
                }
                else{
                    this.errors.push('У вас недостаточно средств для операции!');
                }
            }
            else{
                if(this.balance.toFixed(2) >= Number(this.requestedAmount.replace(',', '.'))){
                    this.$store.dispatch('sell', obj);
                    this.balance = this.$store.getters.balance[this.selectedSymbol];
                }
                else{
                    this.errors.push('У вас недостаточно средств для операции!');
                }
            }
            this.requestedAmount = 0;
            this.sum = 0;
        },
        selectToggle() {
                    this.activeClass = !this.activeClass;
                },
        selectChoose(e) {
                    this.selectedSymbol = e.target.dataset.symbol;
                    this.balance = this.$store.getters.balance[this.selectedSymbol];
                    this.currentValue = e.target.innerText;
                    this.activeClass = false; 
                    this.requestedAmount = 0;
                    this.sum = 0;
                    this.errors = [];
                }
    },
    filters:{
			numFormat(num){
				let numArr = String(num).split('').reverse();
				let res = [];
				for(let i = 0; i <= Math.ceil(numArr.length/3)+1; i++)
				{
					res.push(numArr.splice(0,3).reverse().join(''));
				}
				let rest = numArr.reverse().join('');
				return ([...res, rest]).reverse().join(' ');
            },
            changeDelimiter(num){
                return num.replace(' .', ',');
            },
			toFixed2(num){
				return num.toFixed(2);
            }
		},
    mounted(){
        let balance = localStorage.getItem('balance');
        if(balance){
            this.$store.dispatch('loadBalanceFromLocalStorage', balance);
        }
        this.balance = this.$store.getters.balance['AUD'];
    }
}
</script>

<style scoped>

     @font-face {
        font-family: 'icomoon';
        src: url('../assets/fonts/icomoon.eot?nycwe4');
        src:  url('../assets/fonts/icomoon.eot?nycwe4');
        src:  url('../assets/fonts/icomoon.eot?nycwe4#iefix') format('embedded-opentype'),
            url('../assets/fonts/icomoon.ttf?nycwe4') format('truetype'),
            url('../assets/fonts/icomoon.woff?nycwe4') format('woff'),
            url('../assets/fonts/icomoon.svg?nycwe4#icomoon') format('svg');
        font-weight: normal;
        font-style: normal;
        font-display: block;
    }

    [class^="icon-"], [class*=" icon-"] {
        /* use !important to prevent issues with browser extensions that change fonts */
        font-family: 'icomoon' !important;
        font-style: normal;
        font-weight: normal;
        font-variant: normal;
        text-transform: none;
        line-height: 1;

        /* Better Font Rendering =========== */
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .icon-caret-up:before {
         content: "\f0d8";
    }
    .icon-sort-desc:before {
        content: "\f0dd";
    }
    .icon-sort-down:before {
        content: "\f0dd";
    }

    .select {
        font-weight: bold;
        font-size: 16px;
        line-height: 24px;
        color: #000000;
    
        width: 100%;
        border: 1px solid #D8D8D8;
        background-color: #fff;
    }
    .select.is-active .select__body {
        display: block;
        box-shadow: 0px 8px 28px rgba(0, 0, 0, 0.36);
    }

    .select__header{
        cursor: pointer;
        display: flex;
        position: relative;
    }

    .arrow{
        font-family: 'icomoon';
        position: absolute;
        right: 10px;
        top: 8px;
        color: #1b1b1b;
        z-index: 5;
    }

    .select__current {
        font-size: 18px;
        line-height: 24px;
        padding: 8px;
    }
    .select__icon {
        align-items: center;
        display: flex;
        flex-shrink: 0;
        justify-content: center;
        height: 40px;
        margin-left: auto;
        text-align: center;
        width: 40px;
    }

    .select__body {
        border: 1px solid #cccccc;
        border-top: 0;
        display: none;
        left: 0;
        height: 100vh;
       overflow-y: scroll;
    }
    .select__item {
        cursor: pointer;
        font-size: 16px;
        line-height: 24px;
        padding: 8px;
        background-color: #fff;
    }
    
    .select__item:hover {
        background:#EDEDED;;
    }

    #selectBlock{
        padding: 32px 16px;
        max-width: 330px;
        background: #F6F6F6;
    }

    #value-input, #sum, #balance{
        font-weight: bold;
        font-size: 16px;
        line-height: 24px;
        color: #000000;
    }
    #value-input, #value-input2{
        width: 100%;
        border: 1px solid #D8D8D8;
    }
    .label{
        margin: 16px 0 8px;
        font-size: 13px;
        line-height: 16px;
        color: rgba(51, 51, 51, 0.5);
    }
    button{
        font-weight: bold;
        font-size: 13px;
        line-height: 16px;
    }

    #btn-buy-1, #btn-sell{
        margin-bottom: 8px;
        width: 50%;
        background-color: #fff;
        border: 1px solid #D8D8D8;
        transition: all .5s;
    }

    #btn-buy-1:hover,
    #btn-sell:hover{
        color: #34AAF2;
    }

    button, select, input{
        padding: 8px 16px;
    }
    .mainBtn{
        color:white;
        border: none;
        background: #00B956;
        width: 100%;
        margin-top: 16px;
    }

    .error ul{
        list-style: none;
        background-color: #ffdddd;
        padding: 20px;
    }
</style>