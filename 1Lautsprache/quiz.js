/*-----------------------Event Listener----------------------*/
document.getElementById("btn_quiz").addEventListener("click", showOrder());
/*-----------------------------------------------------------*/


/*-----------------------Funktionen--------------------------*/
order = [];
count = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function showOrder(){
    randomOrder();
    window.alert(order);
}

function randomOrder(){
    for (let i = 0; i < 5; i++) {
        order[i] = getRandomInt(1, 10);    
    }
    
    for (let j = 0; j < order.length; j++) {
        for (let x = 0; x < count.length; x++){
            if (order[j] == count[x]){
                count[x] = 0;
            } 
        }
    }
    
    for (let v = 0; v < order.length; v++) {
        for (let y = 0; v < order.length; y++){
            if (order[v] == count[y]){
                order[v] = "x";
            } 
        }
    }

    for (let index = 0; index < order.length; index++) {
        if(order[index] == "x"){
            for (let m = 0; m < count.length; m++) {
                if( count[m] == 0){
                    continue
                }
                else{
                    order[index] = count[m];
                    count[m] = 0;
                }
            }
        }   
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
/*-------------------------------------------------------------*/

