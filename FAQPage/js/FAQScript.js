document.getElementById("identify-faq").style.display = "flex";
document.getElementById("button-faq-first").style.border = "solid darkgray";
document.getElementById("button-faq-first").style.borderRadius = "1.2mm";
document.getElementById("button-faq-second").style.border = "none";
document.getElementById("button-faq-third").style.border = "none";
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

function IdnetificationFAQ() {
  document.getElementById("identify-faq").style.display = "flex";
  document.getElementById("explore-faq").style.display = "none";
  document.getElementById("growth-faq").style.display = "none";
  document.getElementById("button-faq-first").style.border = "solid darkgray";
  document.getElementById("button-faq-first").style.borderRadius = "1.2mm";
  document.getElementById("button-faq-second").style.border = "none";
  document.getElementById("button-faq-third").style.border = "none";
}

function ExploreFAQ() {
  document.getElementById("identify-faq").style.display = "none";
  document.getElementById("explore-faq").style.display = "flex";
  document.getElementById("growth-faq").style.display = "none";
  document.getElementById("button-faq-second").style.border = "solid darkgray";
  document.getElementById("button-faq-second").style.borderRadius = "1.2mm";
  document.getElementById("button-faq-first").style.border = "none";
  document.getElementById("button-faq-third").style.border = "none";

}

function GrowthFAQ() {
  document.getElementById("identify-faq").style.display = "none";
  document.getElementById("explore-faq").style.display = "none";
  document.getElementById("growth-faq").style.display = "flex";
  document.getElementById("button-faq-third").style.border = "solid darkgray";
  document.getElementById("button-faq-third").style.borderRadius = "1.2mm";
  document.getElementById("button-faq-first").style.border = "none";
  document.getElementById("button-faq-second").style.border = "none";
}

function answer_identify(part_name){
  if(part_name==`i-a-1`){
    
  }
}