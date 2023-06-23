let allCoinsURL = 'https://api.coingecko.com/api/v3/coins';
let coinsArray = [];
let selectedCoins = [];
let searchInputDV = document.getElementById('coinInput');
let coinsDV = document.getElementById('coinsContainer');
let modalOfCoins = document.getElementById('modalDV');
let selectedContainerDV = document.getElementById('modalSelectedCoinsContainer');

let getCoinsFromLS = JSON.parse(localStorage.getItem('selectedCoins'));

console.log(getCoinsFromLS);


function showAjax(urlOfCoins, callbackFunction) {
    $.ajax({
        type: 'GET',
        datatype: 'json',
        url: urlOfCoins,
        success: function (data) {
            callbackFunction(data)
        },
        error: function (error) {
            console.log('error : ', error)
        },
    })
}


let printHomeCoins = (coinsData) => 
{
    coinsDV.innerHTML = '';

    coinsArray = coinsData;

    for (let i = 0; i < 50; i++) 
    {
        coinsArray[i].selected = false;
        printSingleCoinToHTML(coinsArray[i], i);
    }
    console.log(coinsArray);
}


function ifCoinInLocalStorage(sCoin) {
    getCoinsFromLS = JSON.parse(localStorage.getItem('selectedCoins'));

    if (getCoinsFromLS) {
        for (let i = 0; i < getCoinsFromLS.length; i++) {
            if (sCoin.symbol == getCoinsFromLS[i]) {
                sCoin.selected = true;
                console.log(sCoin.selected);
                return true;
            }
        }
    }
}



let ifChecked = (coinId) =>
{
    if ($("#" + coinId)[0].checked) //when we check a coin
    {
        if (selectedCoins.length == 5) 
        {
            console.log(selectedCoins);
            myModal.style.display = 'block';
            modalSelectedCoins();
        }

        else
        {
            coinId.selected = true;
            selectedCoins.push(coinId);
            localStorage.setItem('selectedCoins', JSON.stringify(selectedCoins));
            getCoinsFromLS = JSON.parse(localStorage.getItem('selectedCoins'));
            console.log('selected array:', selectedCoins, 'local storage coins:', getCoinsFromLS);
        }
    }

    //when we uncheck a coin
    else if (!$("#" + coinId)[0].checked)
    {
        let specificIndexOfCoin = selectedCoins.indexOf(coinId);
        selectedCoins.splice(specificIndexOfCoin, 1);
        localStorage.setItem('selectedCoins', JSON.stringify(selectedCoins));
        getCoinsFromLS = JSON.parse(localStorage.getItem('selectedCoins'));
        console.log(selectedCoins, 'local storage:', getCoinsFromLS);
    }
}


let printSingleCoinToHTML = (singleCoin, index) => {

    let coinCard = '';

    coinCard += '<div class="card col-3 m-auto ms-1 mt-5 mb-5" style = "width: 23rem; height: 18rem;">';
    coinCard += '<div class="card-body">';

    if (ifCoinInLocalStorage(singleCoin)) {
        singleCoin.selected = true;
        coinCard += `<label class="switch mt-3" style = "float: right;"><input type="checkbox" onclick = "ifChecked(id)" id = "${singleCoin.symbol}" checked><span class="slider round"></span></label>`;
    }

    else {
        coinCard += `<label class="switch mt-3" style = "float: right;"><input type="checkbox" onclick = "ifChecked(id)" id = "${singleCoin.symbol}"><span class="slider round"></span></label>`;
    }

    coinCard += `<h5 class="card-title" style = "font-size: 25px;">${singleCoin.symbol}</h5>`;
    coinCard += `<h6 class="card-subtitle mb-2 text-muted">${singleCoin.id}</h6>`;
    coinCard += '<hr/>';
    coinCard += `<div class="accordion accordion-flush" id="accordion${index}" style = "width: 18rem; height: 10rem;">
    <div class="accordion-item">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse${index}" aria-expanded="false" aria-controls="flush-collapse${index}">
            More Info
        </button>
        <div id="flush-collapse${index}" class="accordion-collapse collapse" aria-labelledby="flush-heading${index}" data-bs-parent="#accordion${index}">
        <div class="accordion-body">
        <div class = "row d-flex">
            <div class = "col-9" style = "float: left;">
                <div style = "font-size: 13px;"><span style = "text-decoration: underline;">USD:</span> ${singleCoin.market_data.current_price.usd}$</div>
                <div style = "font-size: 13px;"><span style = "text-decoration: underline;">EUR:</span> ${singleCoin.market_data.current_price.eur}€</div>
                <div style = "font-size: 13px;"><span style = "text-decoration: underline;">ILS:</span> ${singleCoin.market_data.current_price.ils}₪</div>
            </div>
            <div class = "col-3" style = "float: right;">
                <div class = "text-center mt-3 m-auto" style = "float:right;"><img src = ${singleCoin.image.thumb}</div>
            </div>
        </div>
        </div>
        </div>
    </div>
    </div>`;
    coinCard += '</div>';
    coinCard += '</div>';

    coinsDV.innerHTML += coinCard;
}


function searchCoinsByInput(searchInputValue) {
    coinsDV.innerHTML = '';

    if (searchInputValue) {
        for (let coin of coinsArray) {
            if (coin.symbol == searchInputValue.toLowerCase()) {
                printSingleCoinToHTML(coin);
                searchInputDV.value = '';
                return;
            }
        }
    }

    searchInputDV.value = '';
    alert('there are no results, please try again.');
    printHomeCoins();
}


function printSelectedCoinCard(selectedCoinFromLS) {
    let selectedCoinCard = '';

    selectedCoinCard += '<div class="card col-3 m-auto ms-1 mt-5 mb-5" style = "width: 15rem; height: 10rem;">';
    selectedCoinCard += '<div class="card-body">';

    selectedCoinCard += `<label class="switch mt-3" style = "float: right;"><input type="checkbox" onclick = "ifChecked(id)" id = "${selectedCoinFromLS}" checked><span class="slider round"></span></label>`;

    selectedCoinCard += `<h5 class="card-title" style = "font-size: 25px;">${selectedCoinFromLS}</h5>`;

    selectedCoinCard += '</div>';
    selectedCoinCard += '</div>';

    selectedContainerDV.innerHTML += selectedCoinCard;
}


function modalSelectedCoins() {
    selectedContainerDV.innerHTML = '';

    getCoinsFromLS = JSON.parse(localStorage.getItem('selectedCoins'));

    for (let everyC of getCoinsFromLS) {
        printSelectedCoinCard(everyC);
    }
}

function closeClick() {
    myModal.style.display = "none";
    printHomeCoins();
    getCoinsFromLS = JSON.parse(localStorage.getItem('selectedCoins'));
    console.log(getCoinsFromLS);
}

showAjax(allCoinsURL, printHomeCoins);
