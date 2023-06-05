import {lang} from '{%}';

var coll = document.getElementsByClassName("collapsible");
var i;
let guidesBackup;

if( localStorage.getItem('lang') == 'en') document.getElementById('keyword').setAttribute('placeholder' , 'Search keywords');
else document.getElementById('keyword').setAttribute('placeholder' , 'کلمات کلیدی را جست و جو کنید');

document.getElementById("keyword").addEventListener("input", check_state_search_box);

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

let identify_guides ,explore_guides ,support_guides ,medicines_guides ,blog_guides ,growth_guides;

function make_text(){
	var lang = localStorage.getItem('lang');
	alert(lang);
    var len = lang.length - 1;
    var keys = Object.keys(lang)
    var values = Object.values(lang);
    alert(keys);
    alert(values);
    for(var i = 0; i <= keys.length - 1; i++){
        switch(keys[i]){
            case('hlp-tpc-idn'): identify_guides = identify_guides + values[i];break;
            case('hlp-tpc-exp'): explore_guides = explore_guides + values[i];break;
            case('hlp-tpc-sup'): support_guides = support_guides + values[i];break;
            case('hlp-tpc-med'): medicines_guides = medicines_guides + values[i];break;
            case('hlp-tpc-blg'): blog_guides = blog_guides + values[i];break;
            case('hlp-tpc-grw'): growth_guides = growth_guides + values[i];break;
            default:continue;
        }
    }
}


//var idetify_guides = `The ability to properly identify plants is critical to proper environmental analysis and management.
//In this course, designed for entry-level field biologists, botanists
//, environmental management professionals and ecologists,
// you will be introduced to the methods and best practices by which California plants are classified,
// specifically using The Jepson Manual –
// Vascular Plants of California.
//Through lecture, discussions and hands-on activities,
//you will learn how to overcome common challenges in plant identification by practicing the utilization of appropriate resources,
//tools and scientific language. You will learn terminology, abbreviations,
//use of dichotomous keys and use of dissection microscopes.
//You will also be trained to recognize the characteristics that identify major vascular plant groups,
//including characteristics at the Family, Genera and Species-level.
//By the end of this course, you will be able to independently identify major taxa of California vascular
// plants and successfully key out to Family and Genus.
//You will be equipped to identify and properly use the online resources, tools, abbreviations,
//and terminology necessary to accurately identify California plants in your day-to-day work.`;

//let explore_guides = `You can combine elements in the Simple search, for example, surname and significant word from the title, e.g.:
//Austen Pride Prejudice
//There is no need to include AND as this is assumed.
//If you want to narrow your search down, use NOT and OR (enter these in capital letters), e.g.:
//Pride NOT prejudice
//Pride OR prejudice
//Shakespeare (tragedy OR sonnet)
//NB: Use lower case letters for your search terms and uppercase for (AND, OR, NOT).
//If you use upper case, e.g ORANGES ARE NOT THE ONLY FRUIT the catalolgue will search for (oranges AND are) NOT (the AND only AND fruit)
//To search for a phrase, enclose your search terms in quotation marks, for example:
//“pride and prejudice”
//“global warming”
//NB: Use phrase searching to search for one word titles prefixed with ‘the’, e.g. “the Adelphi”, “the Lancet”.
//You can use wildcards to replace one or more characters:
//Use ? to replace one character, e.g. wom?n will search for woman and women
//Use * to replace more than one character, e.g. cultur* will search for culture, cultural and culturally
//To search for an ISBN enter the number without hyphens.
//To search for an ISSN enter the number with the hyphen. If you omit the hyphen you will find journal records that match the ISSN but you will not find matching article records.
//If you are searching for records in non-Roman scripts, it is recommended that you search both in the non-Roman script and Romanisation, for example, 香港 and Xianggang. (In a case such as this when a name has a form by which it is commonly known, also use that - in this case, Hong Kong.)
//Some, especially older, records lack non-Roman script and so they can only be found by searching using a standardised form in the Roman alphabet. To discover which transliteration system is in use, see www.loc.gov/catdir/cpso/roman.
//html or do a search for the name of your language in its non-Roman script, e.g., Русский for Russian.
//That should display many records and you will be able to see how they are Romanised,
//for example how any long vowels are represented.`;

//let support_guides = `Online support is becoming increasingly important in today’s world.
//With the advent of the internet, people are now able to access support from all over the world,
//no matter where they are. Online support can come in the form of online forums,
//chat rooms, and other online communities.
//These online communities provide a safe space for people to talk about their problems,
//share their experiences, and get advice from others. With online support, people can find the help they need without having to leave
//the comfort of their own homes.
//Online support can be a great tool for those struggling with mental health issues,
//addiction, or any other issue they may be facing
//Email is the defacto way of connecting with customers.
//But email exchanges can take forever and inboxes are getting overwhelmed.
//But text messages are more user-friendly and they only have a 3% spam rate.
//Plus, 74% of consumers respond to texts from a business within an hour. Compare that to only 41% for email.
//So text messaging can be the better way to message customers.
//Especially when you need to deliver real-time updates and timely responses.
//Paying someone to answer phones gets costly. The average customer service phone call costs about $16.
//This is where SMS support is far cheaper and more scalable than answering phone calls.
//Keep in mind, there will always be a place for voice calls in your customer support process. A human voice can also make a world of difference when it comes to customer engagement.
//But text messaging can insulate your customer support staff or front desk from having to answer every phone call.
//You get to reserve the most valuable customer service requests for real-life employees and team members.`;

//let habitat_guides = `The natural habitat of a species is the environment in which it is naturally found.
//It is the source of food, water, shelter, and other resources necessary for its survival. Every species has specific needs and requirements that must be met in order for it to live and thrive in its habitat.
//When these needs are not met, the species may be threatened with extinction.
//It is therefore essential to protect and preserve habitats so that species can continue to survive and evolve.
//Wild plants are the fundamental building blocks of all habitats, and while many different habitats exist, most of the plants we're working to protect are found in a small number of key ones, such as woodland, grassland and wetland.
//Habitats often overlap one another and include complex networks of 'microhabitats',
//each with their own particular characteristics.
//Understanding how these specific environments work,
//how they relate to each other and how they've been looked after in the past,
//is key to caring for the plants that live there.
//`;

//let medicines_guides = `Plants have many medicinal properties that have been used for centuries to treat a variety of ailments.
//These properties include anti-inflammatory, antiseptic, antifungal, analgesic, and antiviral effects.
//Plants also contain compounds that can act as antioxidants, helping to reduce oxidative stress and protect cells from damage.
//Additionally, some plants have been found to have anti-cancer properties,
//with certain compounds found to reduce the risk of certain types of cancer.
//According to the World Health Organization (WHO),
//a variety of drugs are obtained from different medicinal plants and
//about 80% of the world’s developing population depends on traditional medicines for their primary health care needs.
//Myanmar has abundant plant resources and Myanmar peoples have used their own traditional medicines to maintain their health and treat various ailments,
//including malaria, diarrhea and fever over millennia of history.`;

//let growth_guides = `Plant growth is a complex process that is influenced by a variety of factors,
//including light, temperature, water, soil fertility, and the availability of nutrients.
//Plants require sunlight for photosynthesis,
//which is the process by which plants convert light energy into chemical energy.
//Light is also important for promoting the growth of stems, leaves, and other parts of the plant.
//Temperature is also a critical factor for plant growth,
//as it affects the rate of photosynthesis and the availability of water.
//Water is essential for the growth of plants, as it is necessary for photosynthesis and other metabolic processes.
//Water also helps to regulate the temperature of the plant and helps to transport nutrients and other materials throughout the plant.
//Soil fertility is also important for plant growth, as it provides the necessary nutrients for plant growth.
//Nutrients such as nitrogen, phosphorus, and potassium are essential for healthy plant growth.
//Plant growth is also affected by the availability of other materials such as carbon dioxide and oxygen.
//Carbon dioxide is necessary for photosynthesis, while oxygen is necessary for respiration.
//Plants also require certain trace elements such as iron, zinc, and copper for proper growth.
//Finally, the environment in which a plant is grown can also affect its growth.
//For example, certain plants may require specific temperatures or humidity levels in order to thrive.`;

function search_in_text(text, keyword, subject, num_search) {
  guidesBackup = document.getElementById('display-guides').innerHTML;
  let result = ``;
  let first_index_of_dot = text.indexOf(".");
  let first_index = 0,
    index = 0,
    last_index = 0,
    sentence,
    index_of_keyword;
  while (last_index < text.length) {
    index_of_keyword = text.indexOf(keyword, last_index);
    if (index_of_keyword == -1) {
      break;
    }
    if (index_of_keyword < first_index_of_dot) {
      first_index = 0;
      last_index = first_index_of_dot;
    } else {
      first_index = text.substring(0, index_of_keyword).lastIndexOf(".");
      last_index = text.indexOf(".", index_of_keyword);
    }
    index++;
    sentence = text.substring(first_index + 1, last_index + 1);
    result = result.concat(`<div class="collapsible fadeIn" style="font-family:Verdana, Geneva, Tahoma, sans-serif;">
    <strong>Result ${index} :</strong> &nbsp
    <p class=" bg-light text-center mb-0 p-4">${sentence}</p>
    </div>`);
  }
  if (result == ``) return ``;
  var result_topic = '';
  if(localStorage.getItem('lang') == 'en'){
//  alert("test");
      result_topic = `<button class="wow fadeInLeft btn-outline-success py-2 my-2"  data-wow-delay="0.05s" style="border-radius: 1.5mm;border-color : darkgreen;text-align: left;font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode';"
      data-toggle="collapse" data-target="#${num_search}demo"><b>Topic </b>: ${subject}
      <i class=" bi-arrow-down-circle fa-2x float-end"></i>
      </button>
      <div id="${num_search}demo" class="collapse">${result}</div>`;
  }else{
      result_topic = `<button class="wow fadeInRight btn-outline-success py-2 my-2"  data-wow-delay="0.05s" style="border-radius: 1.5mm;border-color : darkgreen;text-align: left;font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode';"
      data-toggle="collapse" data-target="#${num_search}demo"><b>Topic </b>: ${subject}
      <i class=" bi-arrow-down-circle fa-2x float-end"></i>
      </button>
      <div id="${num_search}demo" class="collapse">${result}</div>`;
  }
  return result_topic;
}

function search_help_ajax(keyword) {
  let responsive = ``;
  responsive = responsive.concat(
    search_in_text(idetify_guides, keyword, "Identification", 6)
  );
  responsive = responsive.concat(
    search_in_text(explore_guides, keyword, "Explore", 5)
  );
  responsive = responsive.concat(
    search_in_text(support_guides, keyword, "Online Supporting", 4)
  );
  responsive = responsive.concat(
    search_in_text(habitat_guides, keyword, "Find Habitat", 3)
  );
  responsive = responsive.concat(
    search_in_text(midcine_guides, keyword, "Finding Medicinal Properties", 2)
  );
  responsive = responsive.concat(
    search_in_text(growth_guides, keyword, "Help In Growth", 1)
  );
  if (responsive == ``) {
    responsive = `
      <h3 class="text-center">No results found  <i class=" bi-clock-history"></i> </h3>`;
  }
  responsive = responsive.concat(`
    <form action="" method="get" class="align-center mx-auto my-0 px-2 w-25">
    <button class="btn-dark my-2 mx-auto p-3 w-100" style="border-radius: 1mm;" onclick="
        document.getElementById('keyword').innerHTML = "";
        check_state_search_box();
    ">
    Back to Help
    </button>
    </form>
    `);
    responsive = responsive.replaceAll(`${keyword}`,`<b style="background-color: chartreuse;">${keyword}</b>`);
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      const response_ajax = responsive;
      document.getElementById("display-guides").innerHTML = response_ajax;
      document.getElementById("display-guides").style.display = "flex";
      document.getElementById("display-guides").style.flexDirection = "column";
      document.getElementById("display-guides").style.margin = "1.8%";
    }
  };
  xhr.open("get", "#", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send();
}

function check_state_search_box(){
    const input = document.getElementById("keyword").value;
    if(input === ""){
        document.getElementById('display-guides').innerHTML = guidesBackup;
    }else return
}