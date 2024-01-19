class MoneyPot{
    constructor(){
        this.money = 0;
    }

    AddMoney(amount){
        this.money += amount;
    }

    GetMoney(){
        return this.money;
    }
}

export default MoneyPot;