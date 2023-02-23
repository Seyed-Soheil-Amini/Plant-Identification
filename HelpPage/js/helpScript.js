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

var guides_text = `Lorem, ipsum dolor sit amet consectetur adipisicing elit.
Eos nobis debitis non. Eos, deserunt optio. Corrupti tempora
non libero eligendi iste doloribus saepe obcaecati. Est eum
quis fugiat reprehenderit. Explicabo voluptas consequatur
porro eaque ex a maxime. Non quod molestias necessitatibus
aut provident. Nesciunt quo facere eligendi quod placeat
laboriosam neque voluptate molestiae blanditiis voluptatibus
sit porro error veritatis iure voluptatum, deleniti
architecto eveniet amet exercitationem vitae dicta!
Repellendus saepe ratione voluptates praesentium velit. Enim
quibusdam aspernatur, numquam veritatis recusandae facere
qui, optio error totam cum quisquam fugiat ipsa asperiores.
Reiciendis, saepe, perferendis ex unde ut omnis aliquam
necessitatibus voluptatem voluptates ab aperiam animi sint
vitae vel iusto laudantium dicta deserunt veritatis vero
optio quo, ipsa eveniet. Necessitatibus rem perspiciatis
unde accusantium optio quo obcaecati consequatur, facere,
amet nisi voluptas quia veritatis saepe? Temporibus ducimus
vero ratione, numquam eligendi molestias voluptatum est,
architecto a nulla ipsam, qui exercitationem odio adipisci
natus ab! Sapiente rem maxime impedit provident quidem
dolores esse quas culpa nihil debitis optio doloremque
necessitatibus, ex voluptatum quia, nemo excepturi ipsam
voluptas omnis alias soluta ea? Molestiae rem cumque
perferendis sunt neque doloribus vero veritatis iusto
itaque, suscipit delectus adipisci vel sapiente ex minima
quo unde accusantium commodi similique omnis deleniti
inventore laboriosam repellendus? Ipsa, quis. Consequuntur,
ab, neque accusantium illo nesciunt earum recusandae ea
sunt, eos non pariatur officiis qui eveniet ex cumque
dignissimos. Repudiandae, esse. Distinctio aspernatur
cupiditate quisquam quibusdam voluptas itaque cum, eum
officia libero veritatis optio, illo tenetur corrupti, nihil
ipsa temporibus facere illum?`;
function search_help_ajax(keyword) {
  let responsive = ``;
  let first_index = 0,
    index = 0,
    last_index = 0,
    sentence,
    index_of_keyword;
  while (last_index < guides_text.length) {
    index_of_keyword = guides_text.indexOf(keyword, last_index);
    if (index_of_keyword == -1) {
      break;
    }
    if (index_of_keyword < 56) {
      first_index = 0;
      last_index = 56;
    } else {
      first_index = guides_text.substring(0, index_of_keyword).lastIndexOf(".");
      last_index = guides_text.indexOf(".", index_of_keyword);
    }
    index++;
    sentence = guides_text.substring(first_index, last_index + 1);
    responsive = responsive.concat(`<button data-toggle="collapse" data-target="#${index}demo">Collapsible</button>
    <div id="${index}demo" class="collapse">
    <p class="text-center">${sentence}</p>
    </div>`);
  }
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      const response_ajax = responsive;
      document.getElementById("display-guides").innerHTML = response_ajax;
      document.getElementById("display-guides").style.display = "flex";
      document.getElementById("display-guides").style.flexDirection = "column";
      alert(responsive)
    }
  };
  xhr.open("get", "#", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send();
}
