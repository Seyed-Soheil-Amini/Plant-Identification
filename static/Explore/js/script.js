document.querySelector(".input-search").addEventListener("focus",() => {
    document.querySelector(".btn-search").style.color = "#ffffff"
})
document.querySelector(".input-search").addEventListener("focusout",() => {
    document.querySelector(".btn-search").style.color = "#104600"
})
document.querySelector(".btn-search").addEventListener("focus",() => {
    document.querySelector(".btn-search").style.color = "#ffffff"
})
document.querySelector(".btn-search").addEventListener("focusout",() => {
    document.querySelector(".btn-search").style.color = "#104600"
})



window.addEventListener("scroll",() => {
    if(window.innerHeight + window.pageYOffset >= document.body.offsetHeight){
        for (let i = 0; i < 8; i++) {
            createCard();
        }
    }
})

const createCard = () => {
    const col = document.createElement("div");
    col.className = "col myCol"
    const card = document.createElement("div");
    card.className = "py-2 px-3 myCard";
    col.appendChild(card);
    document.getElementById("card-container").appendChild(col);
};