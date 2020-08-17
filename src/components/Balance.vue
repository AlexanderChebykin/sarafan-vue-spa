<template>
    <div class="balance-block">
        <div class="balance-block__title">Баланс</div>
        <div>
                <ul v-for="(curr, key) in balance" :key="key">
                    <li v-if="curr.toFixed(2) > 0" class="balance-block__container balance-block__list-item">
                        <div class="balance-block__currency-symbol">{{key}}</div>
                        <div class="balance-block__currency-value">{{curr.toFixed(2)}}</div>
                    </li>
                </ul>
        </div>
    </div>
</template>

<script>
export default {
    computed:{
        balance(){
            return this.$store.getters.balance;
        },
    }
}
</script>

<style scoped>
    ul{
        padding: 0;
        margin: 0;
    }
   .balance-block{
       background: #F6F6F6;
       min-height: 200px;
       width: 320px;
       padding: 32px 16px;
   }
   .balance-block__title{
       margin-bottom: 24px;
       font-weight: bold;
        font-size: 16px;
        line-height: 24px;
        color: #000000;
   }
   .balance-block__container{
       display: flex;
       justify-content: space-between;
   }

   .balance-block__list-item{
        padding: 8px 0px;
    }
</style>