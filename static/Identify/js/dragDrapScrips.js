//selecting all required elements
const dropArea = document.querySelector(".drag-area"),
    dragText = dropArea.querySelector("p"),
    button = dropArea.querySelector("button"),
    input = dropArea.querySelector("input");
let file; //this is a global variable and we'll use it inside multiple functions
let imgTag;//this is a global variable to save image html tag
let tempTag = dropArea.innerHTML;//this is a global variable that has been declared to save base html format of form (for reseting)
alert(tempTag);
button.onclick = () => {
    input.click(); //if user click on the button then the input also clicked
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
    dragText.textContent = "Release to Upload File";
});

//If user leave dragged File from DropArea
dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("active");
    dragText.textContent = "Drag your files here.";
});

//If user drop File on DropArea
dropArea.addEventListener("drop", (event) => {
    event.preventDefault(); //preventing from default behaviour
    //getting user select file and [0] this means if user select multiple files then we'll select only the first one
    file = event.dataTransfer.files[0];
    showFile(); //calling function
});

function showFile() {
    let fileType = file.type; //getting selected file type
    let validExtensions = ["image/png", "image/jpg", "image/jpeg"]; //adding some valid image extensions in array
    if (validExtensions.includes(fileType)) { //if user selected file is an image file
        let fileReader = new FileReader(); //creating new FileReader object
        fileReader.onload = () => {
            let fileURL = fileReader.result; //passing user file source in fileURL variable
            imgTag = `<img src="${fileURL}" alt="image" id="imgUp" style="width:fit-content;height:fit-content;">`; //creating an img tag and passing user selected file source inside src attribute
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
//    alert("HEllo");
//    alert(document.getElementById(id_tag).value);
    dropArea.classList.remove("active");
    document.getElementById("imgUp").setAttribute("src", "");
    document.getElementById("imgUp").setAttribute("alt", "");
    dropArea.innerHTML = tempTag;
    dragText.textContent = "Drag your files here.";
}

let upload_frame = document.getElementById('upload-box');

function upload_image_ajax(id_tag){
            var counter = 0;
            var xhr = new XMLHttpRequest();
			var img_object = document.getElementById(id_tag);
			xhr.onreadystatechange = function()
		{
			if(xhr.readyState == 4 && xhr.status == 200){
                const identified_plant = xhr.responseText;
                const object_plant = JSON.parse(identified_plant);
                while(true){
                    if(counter==1000000000)break;
        			counter++;
                }
                show_result(object_plant);
			}
		}
        upload_frame.classList.add('align-content-center');
        waiting();
		xhr.open("get","http://127.0.0.1:8000/randomplant/",true);
		xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xhr.send(img_object);
}


function show_result(object){
        var image_address = "http://127.0.0.1:8000/" + object.image;
        document.getElementById('title_identify').style.display = "none";
        document.getElementById('title-waiting').style.display = "none";
        document.getElementById('title-detected').style.display = "inline";
        document.getElementById('waiting-gif').style.display = "none";
        document.getElementById('result').style.display = "flex";
        document.getElementById('result-image').src = image_address;
        document.getElementById('result-name').innerHTML = object.name;
        document.getElementById('result-morph').innerHTML = object.morphology;
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