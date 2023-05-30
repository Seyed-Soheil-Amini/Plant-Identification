//selecting all required elements
let dropArea = document.querySelector(".drag-area"),
    dragPar = dropArea.querySelector("p"),
    dragText = dragPar.querySelector("span"),
    button = dropArea.querySelector("button"),
    input = dropArea.querySelector("input");
let file; //this is a global variable and we'll use it inside multiple functions
let imgTag, tempTag = dropArea.innerHTML;;//this is a global variable to save image html tag
//this is a global variable that has been declared to save base html format of form (for reseting)

function simultaneously_clicked(){
    input.click();
}

input.addEventListener("change", function () {
    //getting user select file and [0] this means if user select multiple files then we'll select only the first one
    file = this.files[0];
    dropArea.classList.add("active");
    showFile(); //calling function
});

//If user Drag File Over DropArea
dropArea.addEventListener("dragover", (event) => {
    event.preventDefault(); //preventing from default behaviour
    dropArea.classList.add("active");
});

//If user leave dragged File from DropArea
dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("active");
});

//If user drop File on DropArea
dropArea.addEventListener("drop", (event) => {
    event.preventDefault(); //preventing from default behaviour
    //getting user select file and [0] this means if user select multiple files then we'll select only the first one
    file = event.dataTransfer.files[0];
    showFile(); //calling function
});

function showFile() {
//    tempTag = dropArea.innerHTML;
    let fileType = file.type; //getting selected file type
    let validExtensions = ["image/png", "image/jpg", "image/jpeg"]; //adding some valid image extensions in array
    if (validExtensions.includes(fileType)) { //if user selected file is an image file
        let fileReader = new FileReader(); //creating new FileReader object
        fileReader.onload = () => {
            let fileURL = fileReader.result; //passing user file source in fileURL variable
            imgTag = `<img src="${fileURL}" class="mx-auto my-auto"  alt="image" id="imgUp">`; //creating an img tag and passing user selected file source inside src attribute
            dropArea.innerHTML = imgTag; //adding that created img tag inside dropArea container
        }
        fileReader.readAsDataURL(file);
    } else {
        alert("This is not an Image File!");
        dropArea.classList.remove("active");
        dragText.textContent = "Drag your files here.";
    }
}
//this function for reset picture data 
function restored(id_tag) {
    if(input.value != ''){
        dropArea.classList.remove("active");
        dropArea.innerHTML = tempTag;
        input.value = '';
        dragText.textContent = "Drag your files here.";
    }
}

let upload_frame = document.getElementById('upload-box');

function upload_image_ajax(id_tag){
        if(document.getElementById('drag-area').children.length==1){
        var counter = 0;
        var xhr = new XMLHttpRequest();
        var img_object = document.getElementById(id_tag);
        xhr.onreadystatechange = function()
    {
        if(xhr.readyState == 4 && xhr.status == 200){
            const identified_plant = xhr.responseText;
            const object_plant = JSON.parse(identified_plant);
            console.log(object_plant);
            while(true){
                if(counter==1000000000)break;
                counter++;
            }
            show_result(object_plant);
        }
    }
    upload_frame.classList.add('align-content-center');
    waiting();
    xhr.open("post","http://127.0.0.1:8000/plants/randomplant/",true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.send(img_object);
    }else{
        alert("Please enter an image!");
//        popup_caution();
    }
}


function show_result(object){
        var link_detail = "http://127.0.0.1:8000/identify/detailResult/" + object.id;
        var image_address = "http://127.0.0.1:8000" + object.main_image;
        document.getElementById('title_identify').style.display = "none";
        document.getElementById('title-waiting').style.display = "none";
        document.getElementById('title-detected').style.display = "inline";
        document.getElementById('waiting-gif').style.display = "none";
        document.getElementById('result').style.display = "flex";
        document.getElementById('result-image').src = image_address;
        document.getElementById('result-name').innerHTML = object.name;
        document.getElementById('result-morph').innerHTML = object.morphology;
        document.getElementById('link-know-more').setAttribute("href", link_detail);
        document.getElementById('btn-back').style.display = "block";
}

function waiting(){
        document.getElementById('title_identify').style.display = "none";
        document.getElementById('title-waiting').style.display = "inline";
        document.getElementById('title-detected').style.display = "none";
        document.getElementById('upload-image').style.display = "none";
        document.getElementById('waiting-gif').style.display = "flex";
}

function back_to_upload(){
        document.getElementById('title_identify').style.display = "inline";
        document.getElementById('title-detected').style.display = "none";
        document.getElementById('upload-image').style.display = "grid";
        document.getElementById('result').style.display = "none";
        document.getElementById('btn-back').style.display = "none";
}

//function popup_caution(){
//    document.getElementById('body-part').blur();
//    document.getElementById('popup').style.display = "flex";
//}
//
//function popup_caution(){
//
//    alert("test");
//    document.getElementById('popup-box').classList.toggle('fadeIn');
//    document.getElementById('popup-box').removeClass('transform-out').addClass('transform-in');
//    document.getElementById('popup-close').addEventListener("click", (event) => {
//        document.getElementById('popup-wrap').classList.toggle('fadeOut');
//        document.getElementById('popup-box').removeClass('transform-in').addClass('transform-out');
//        event.preventDefault();
//    }
//}

