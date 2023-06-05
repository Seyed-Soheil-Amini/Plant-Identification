if(localStorage.getItem('lang') == 'en') document.getElementById('search-btn-exp').setAttribute('placeholder' , 'What are you looking for?');
else document.getElementById('search-btn-exp').setAttribute('placeholder' , 'به دنبال چه می گردید؟');

document.querySelector(".input-search").addEventListener("focus", () => {
    document.querySelector(".btn-search").style.color = "#ffffff"
})
document.querySelector(".input-search").addEventListener("focusout", () => {
    document.querySelector(".btn-search").style.color = "#104600"
})
document.querySelector(".btn-search").addEventListener("focus", () => {
    document.querySelector(".btn-search").style.color = "#ffffff"
})
document.querySelector(".btn-search").addEventListener("focusout", () => {
    document.querySelector(".btn-search").style.color = "#104600"
})

document.querySelector(".input-search").addEventListener("input", search)
let lastShowedPlant = -1
let plants
let cards = []
const cardContainerContentBackUp = document.getElementById("card-container").innerHTML
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function()
{
        if(xhr.readyState == 4 && xhr.status == 200){
        const all_plants = xhr.responseText;
        plants = JSON.parse(all_plants);
        createCards()
        extendPage()
        window.addEventListener("scroll", scrollCheck)
    }else if(xhr.readyState == 4 && xhr.status == 401){
        show_401_error()
    }
}

xhr.open("get",location.origin + "/plants/data",true);
xhr.send();

function search() {
    const input = document.querySelector(".input-search").value
    if(input === ""){
        document.querySelector("#card-container").innerHTML = cardContainerContentBackUp
        return
    }
    const regex = new RegExp(input, 'i')
    let foundPlantsCards = []
    for (let i = 0; i < plants.length; i++){
        const p = plants[i]
        if (p.persian_name.search(regex) > -1 || p.scientific_name.search(regex) > -1
            || p.family.search(regex) > -1) {
            foundPlantsCards.push(cards[i])
        }
    }
    document.querySelector("#card-container").innerHTML = ""
    for (const c of foundPlantsCards) {
        document.querySelector("#card-container").appendChild(c)
    }
}

function createCards() {
    for (let i = 0; i < plants.length; i++) {
        let p = plants[i]
        cards[i] = createCard(p.id ,p.persian_name, p.scientific_name, p.family, p.morphology, p.image)
    }
}

function scrollCheck() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10) {
        extendPage()
    }
}

function createCard(id , perName, sciName, family, morph, img) {
    if (perName.includes(",")) {
        perName = perName.substring(0, perName.indexOf(","))
    }
    const col = document.createElement("div");
    col.className = "col myCol"
    col.innerHTML = `
         <div class="py-2 px-3 myCard h-100">
            <div class="container-fluid mt-2 h-100">
<!--            <div class="row h-50 mt-2" style="width: fit-content">-->
            <img src="${location.origin + img}" class="myImg mx-auto px-0">
<!--            </div>-->
            <div class="row h-50">
            <h1 class="flower-name mt-3 mb-1 my-auto h-auto">${perName}</h1>
            <p class="flower-info mb-4 mt-1 my-auto h-auto">نام انگلیسی : ${sciName}<br>نام علمی : ${family}<br>تیره : ${morph}</p>
            </div>
            </div>
         </div>
    `
    // document.getElementById("card-container").appendChild(col);
    return col
}

function extendPage() {
    if(document.querySelector(".input-search").value !== ""){
        return
    }
    if (lastShowedPlant < plants.length - 1) {
        if (lastShowedPlant + 12 <= plants.length - 1) {
            for (let i = lastShowedPlant + 1; i <= lastShowedPlant + 12; i++) {
                // let p = plants[i]
                // createCard(p.name, p.english_name, p.scientific_name, p.family, p.main_image)
                document.getElementById("card-container").appendChild(cards[i])
            }
            lastShowedPlant += 12
        } else {
            for (let i = lastShowedPlant + 1; i < plants.length; i++) {
                document.getElementById("card-container").appendChild(cards[i])
            }
            lastShowedPlant += 12
        }
//        cardContainerContentBackUp = document.getElementById("card-container").innerHTML
    } else {
        window.removeEventListener("scroll", scrollCheck)
    }
}

function show_401_error(){
    document.getElementById("search-box-divax").style.display = "none";
    document.getElementById("image401").style.display = "block";
}


