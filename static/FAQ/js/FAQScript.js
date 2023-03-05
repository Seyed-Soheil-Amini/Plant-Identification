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

function answer_identify(part_name) {
  if (part_name == `i-a-1`) {
  }
}

// function hideBorder() {
// var btn = document.getElementById("border-topics");
//   if (btn.onclick) {
//     count++;
//   }
//   if (count % 2 == 0) {
//     btn.style.borderBottom = "0.5mm solid darkgray";
//     btn.style.borderRadius = "1mm";
//     // btn.style.borderEndStartRadius = "10px";
//   } else if (count % 2 == 1) {
//     // btn.style.borderBottom = "none";
//     // btn.style.borderEndEndRadius = "0px";
//     // btn.style.borderEndStartRadius = "0px";
//   }
// }

function change_icon_topic(id_topic) {
  var btn = document.getElementById(id_topic);
  btn.classList.toggle("fa-angle-left");
  btn.classList.toggle("fa-angle-down");
}
