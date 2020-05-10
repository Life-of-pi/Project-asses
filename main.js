const globalObj = {};

document.addEventListener("DOMContentLoaded", () => {

    // create click events for all anchor tags in navbar
    var allNavAnchors = document.querySelectorAll('a[class^=nav-custom-class]');
    // create click event on all anchor tags
    let anchorIDs = ["world-anchor", "us-anchor", "technology-anchor", "arts-anchor", "science-anchor", "business-anchor", "politics-anchor", "books-anchor"];
    for (var i = 0; i < allNavAnchors.length; i++) {

        allNavAnchors[i].addEventListener('click', function () {
            console.clear();
            document.getElementById("div-for-container").innerHTML = "";

            // this.className will return string of multiples classes on custom-card
            var string = this.className;
            string = string.split(" ");
            let numIndex = string[1].match(/\d+/g);
            numIndex = parseInt(numIndex);    // determine the index of clicked section from string1 split
            globalObj.numIndex = numIndex;

            // create container for sepearte section
            let container2 = document.createElement("div");
            container2.id = "cardContainer";

            // apppend container2 to div-for-container
            document.getElementById("div-for-container").appendChild(container2);

            // create fetch data function
            // display loader
            

            async function fetchJson(a) {
                
                let topicsArray2 = ["world", "us", "technology", "arts", "science", "business", "politics", "books"];
                let resultResponse = await fetch("https://api.nytimes.com/svc/topstories/v2/" + topicsArray2[a] + ".json?api-key=WsOCtTq7AoDFslivWkOM4g77HfGofHZI");
                let data = await resultResponse.json();
                let len = data.results.length;
                globalObj.result = data;
                document.getElementById("loader").setAttribute("style","display: none;");   
                for (let newsCount = 0; newsCount < len; newsCount++) {
                    createRow(newsCount);
                    createCard(newsCount);
                }
                
            }
            // check if aria attribute of anchor tag  is expanded
            let x = document.getElementById(anchorIDs[numIndex]).getAttribute("aria-expanded");
            if (x == "false") {
                document.getElementById("loader").setAttribute("style","display: inline-block;");
                fetchJson(numIndex);
                }

        }) // event listner function ends here

    } // event listner for loop ends here

}) // document eventlistner on DOMContentsLoaded

// loader
function hideLoader() {
    $('#loading').hide();   
    // document.getElementById("loader").style.display = "inline:block";
}



// Create row function
async function createRow(newsCount) {
    try {
        // console.log("numIndex from row function",nlet mainRow = document.createElement("div");
        let mainRow = document.createElement("div");
        mainRow.classList.add("row");
        document.getElementById("cardContainer").appendChild(mainRow);

        // col-lg-6 takes up news count
        let mainCol = document.createElement("div");
        mainCol.classList.add("col-lg-12");
        mainCol.id = "main-col-id" + newsCount;
        mainRow.appendChild(mainCol);

        // return mainCol;
    }
    catch (error) {
        console.error(error);
    }
}

// function to create new card
async function createCard(newsCount) {
    try {
        let cardDiv = document.createElement("div");
        cardDiv.classList.add("row", "no-gutters", "border", "rounded", "overflow-hidden", "flex-md-row", "mb-4", "shadow-sm", "h-md-250", "position-relative");

        // ***********************left half ********************************/
        let leftHalf = document.createElement("div");
        leftHalf.classList.add("col", "p-4", "d-flex", "flex-column", "position-static");
        cardDiv.appendChild(leftHalf);

        // section of card world, politics etc
        let category = document.createElement("strong");
        category.classList.add("d-inline-block", "mb-2", "text-success");
        category.innerHTML = globalObj.result.results[newsCount].section;
        leftHalf.appendChild(category);

        // Title heading 
        let heading = document.createElement("h3");
        heading.classList.add("mb-0");
        heading.innerHTML = globalObj.result.results[newsCount].title;
        leftHalf.appendChild(heading);

        //Date of creatation
        let date = document.createElement("div");
        date.classList.add("mb-1", "text-muted");
        let dateInJS = formatDate((globalObj.result.results[newsCount].created_date).slice(0, 10));

        date.innerHTML = dateInJS;
        leftHalf.appendChild(date);

        // abstract 
        let abstract = document.createElement("p");
        abstract.classList.add("card-text", "mb-auto");
        abstract.innerHTML = globalObj.result.results[newsCount].abstract;
        leftHalf.appendChild(abstract);

        // url for full article
        let url = document.createElement("a");
        url.classList.add("stretched-link")
        url.href = globalObj.result.results[newsCount].short_url;
        url.target = "_blank";
        url.innerHTML = "Continue reading"
        leftHalf.appendChild(url);

        //*********************Right half of image******************************//
        let image = document.createElement("div");
        image.classList.add("col-auto", "d-none", "d-lg-block");
        cardDiv.appendChild(image);

        // Image source
        let imgSrc = document.createElement("img");
        imgSrc.src = globalObj.result.results[newsCount].multimedia[4].url;
        imgSrc.setAttribute("style", "width:200; height:250;");
        image.appendChild(imgSrc);

        document.getElementById("main-col-id" + newsCount).appendChild(cardDiv);

    }
    catch (error) {
        console.error(error);
    }
}

// function to convert date in DD month-name yyyy
function formatDate(d) {
    var date = new Date(d);

    if (isNaN(date.getTime())) {
        return d;
    }
    else {

        var month = new Array();
        month[0] = "Jan";
        month[1] = "Feb";
        month[2] = "Mar";
        month[3] = "Apr";
        month[4] = "May";
        month[5] = "Jun";
        month[6] = "Jul";
        month[7] = "Aug";
        month[8] = "Sept";
        month[9] = "Oct";
        month[10] = "Nov";
        month[11] = "Dec";

        day = date.getDate();

        if (day < 10) {
            day = "0" + day;
        }

        return day + " " + month[date.getMonth()] + " " + date.getFullYear();
    }
}
