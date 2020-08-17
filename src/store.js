import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        balance : {AMD: 0, AUD: 0, AZN: 0, BGN: 0, BRL: 0, BYN: 0, CAD: 0, CHF: 0, CNY: 0, CZK: 0, DKK: 0, EUR: 0, GBP: 0,
                   HKD: 0, HUF: 0, INR: 0, JPY: 0, KGS: 0, KRW: 0, KZT: 0, MDL: 0, NOK: 0, PLN: 0, RON: 0, RUR: 10000,
                   SEK: 0, SGD: 0, TJS: 0, TMT: 0, TRY: 0, UAH: 0, USD: 0,  UZS: 0, XDR: 0, ZAR: 0},        
        exchangeTable : {},
    },
    mutations:{
        buy(state, obj){
            state.balance.RUR -= +obj.sum;
            state.balance[obj.selectedSymbol] += +obj.amount;
            localStorage.setItem('balance', JSON.stringify(state.balance));
        },
        sell(state, obj){
            state.balance.RUR += +obj.sum;
            state.balance[obj.selectedSymbol] -= +obj.amount;
            localStorage.setItem('balance', JSON.stringify(state.balance));
        },
        updateExchangeRatesData(state, data){
            state.exchangeTable = data.Valute;
        },
        loadBalanceFromLocalStorage(state, balance){
            state.balance = JSON.parse(localStorage.getItem('balance'));
        }
    },
    actions:{
        buy({commit}, obj){
            commit('buy', obj);
        },
        sell({commit}, obj){
            commit('sell', obj);
        },
        updateExchangeRatesData({commit}, data){
            commit('updateExchangeRatesData', data);
        },
        loadBalanceFromLocalStorage({commit}, balance){
            commit('loadBalanceFromLocalStorage', balance);
        },
    },

    getters: {
        tasks: s => s.tasks,
        taskById: s => id => s.tasks.find(t => t.id === id),
        balance: s => s.balance,
        exchangeTable: s => s.exchangeTable
      }
})