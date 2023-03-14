//selecting all required elements
const dropArea = document.querySelector(".drag-area"),
    dragText = dropArea.querySelector("p"),
    button = dropArea.querySelector("button"),
    input = dropArea.querySelector("input");
let file; //this is a global variable and we'll use it inside multiple functions
let imgTag;//this is a global variable to save image html tag
let tempTag = dropArea.innerHTML;//this is a global variable that has been declared to save base html format of form (for reseting)

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
function restored() {
    dropArea.classList.remove("active");
    let img = document.getElementById("imgUp").remove();
    dropArea.innerHTML = tempTag;
    dragText.textContent = "Drag your files here.";
}
function upload_image_ajax(id_tag){
            var counter = 0;
            var xhr = new XMLHttpRequest();
			var img_object = document.getElementById(id_tag);
    		var upload_frame = document.getElementById('upload-box');
			xhr.onreadystatechange = function()
		{
			if(xhr.readyState == 4 && xhr.status == 200){
                const identified_plant = xhr.responseText;
                const object_plant = JSON.parse(identified_plant);
                while(true){
                    if(counter==1000000000)break;
        			counter++;
                }
                    document.getElementById('title_identify').innerHTML = `<h1 class="display-5 mb-5 fadeInBig font"
                    style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif"
                    data-wow-delay="0.1s"
                    id="title_identify">
                    Result
                    </h1>
                `;
                  var image_address = "http://127.0.0.1:8000/" + object_plant.image;
//                  upload_frame.classList.add("");
                  upload_frame.innerHTML = `
                    <div class="row g-5 align-items-end mb-lg-5 my-2 p-4"
                     style="background-image:url('../static/Identify/img/backR2esults.jpg');border-radius:2.5mm;">
                    <div class="col-lg-3 col-md-5 wow fadeInLeft my-auto w-50"
                        data-wow-delay="0.1s">
                        <img class="img-fluid rounded mx-auto my-2"
                            data-wow-delay="0.1s" src=${image_address}>
                    </div>
                    <div class="col-lg-5 col-md-7 w-50 wow fadeInUp text-center mx-auto my-auto" data-wow-delay="0.3s">
                        <h1 class="display-5 mb-4 text-white">${object_plant.name}</h1>
                        <p class="mb-4 text-white">${object_plant.morphology}</p>
                        <a class="btn btn-primary py-3 px-4"
                            href="#">Know more</a>
                    </div>
                </div>
                  `;
			}
		}
        upload_frame.classList.add('align-content-center');
        document.getElementById('title_identify').innerHTML = `<h1 class="display-5 mb-5 fadeInBig"
        style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif"
        data-wow-delay="0.1s"
        id="title_identify">
        Waiting to Identify...
        </h1>
`;
        upload_frame.innerHTML = `
        <div class="h-75 w-50 align-content-center mx-auto my-auto" style="border-radius:2.5mm;border-style:hidden;">
            <img class="container h-100" data-wow-delay="0.1s" src="../static/Identify/img/gif2.gif">
        </div>
        `;
		xhr.open("get","http://127.0.0.1:8000/randomplant/",true);
		xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xhr.send(img_object);
}