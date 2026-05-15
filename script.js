
const API_KEY = "e3dee6ae43426283d1626602";


const bankFees = {
    ABC: { buy: 0.01,  sell: -0.005  },
    NEW: { buy: 0.02,  sell: -0.01   },
    AME: { buy: 0.015, sell: -0.015  },
    RED: { buy: 0.005, sell: -0.005  }
};

let fromCur = "RUB";
let toCur = "USD";
let rate = 0;
let selectedBank = "NEW";



const fromTabs = document.querySelectorAll("#fromTabs .tab");

for (let i = 0; i < fromTabs.length; i++) {
    fromTabs[i].addEventListener("click", function() {
        for (let j = 0; j < fromTabs.length; j++) {
            fromTabs[j].classList.remove("active");
        }
        this.classList.add("active");
        fromCur = this.textContent;
        fetchRate();
    });
}




const toTabs = document.querySelectorAll("#toTabs .tab");

for (let i = 0; i < toTabs.length; i++) {
    toTabs[i].addEventListener("click", function() {
        for (let j = 0; j < toTabs.length; j++) {
            toTabs[j].classList.remove("active");
        }
        this.classList.add("active");
        toCur = this.textContent;
        fetchRate();
    });
}


const bankTabs = document.querySelectorAll(".bank-tab");

for (let i = 0; i < bankTabs.length; i++) {
    bankTabs[i].addEventListener("click", function() {
        for (let j = 0; j < bankTabs.length; j++) {
            bankTabs[j].classList.remove("active");
        }
        this.classList.add("active");
        selectedBank = this.textContent;
        showBankRates();
    });
}


document.getElementById("fromInput").addEventListener("input", function() {
    convert();
});

document.getElementById("toInput").addEventListener("input", function() {
    convertReverse();
});


function fetchRate() {
    const url = "https://v6.exchangerate-api.com/v6/" + API_KEY + "/latest/" + fromCur;

    fetch(url).then(function(res) {
            if (!res.ok) {
                throw new Error("problem var");
            }
            else{
                return res.json();
            }
        })
        .then(function(data) {
            rate = data.conversion_rates[toCur];
            convert();
            showBankRates();
        })
        .catch(function(err) {
            console.log(err);
            alert("Məzənnə yüklənmədi, yenidən cəhd edin");
        });
}


function convert() {
    let amount = parseFloat(document.getElementById("fromInput").value);
    if (isNaN(amount)) {
        amount = 0;
    }

    const result = amount * rate;
    document.getElementById("toInput").value = result.toFixed(4);

    showInfo();
    showBankRates();
}



function convertReverse() {
    let amount = parseFloat(document.getElementById("toInput").value);

    if (isNaN(amount)) {
        amount = 0;
    }

    const result = amount / rate;
    document.getElementById("fromInput").value = result.toFixed(4);

    showInfo();
    showBankRates();
}




function showInfo() {
    const r1 = rate.toFixed(4);
    const r2 = (1 / rate).toFixed(4);

    document.getElementById("fromInfo").textContent = "1 " + fromCur + " = " + r1 + " " + toCur;
    document.getElementById("toInfo").textContent   = "1 " + toCur   + " = " + r2 + " " + fromCur;
}




function showBankRates() {
    let amount = parseFloat(document.getElementById("fromInput").value);

    if (isNaN(amount)) {
        amount = 0;
    }

    const fee = bankFees[selectedBank];

    const sellVal = amount * rate * (1 + fee.buy);
    const buyVal  = amount * rate * (1 + fee.sell);

    document.getElementById("sellRate").textContent = sellVal.toFixed(2);
    document.getElementById("buyRate").textContent  = buyVal.toFixed(2);
}


fetchRate();