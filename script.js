"use strict";

//Selecting elements
const inputDiscription = document.querySelector("#discription");
const inputType = document.querySelector("#traits");
const inputRating = document.querySelector("#rating");
const inputName = document.querySelector(".name");
const inputTraits = document.querySelector(".traits");
const inputGender = document.querySelector(".gender");
const inputFile = document.querySelector(".choose-file");

//Selecting buttons
const btnHome = document.querySelector(".home");
const btnGallery = document.querySelector(".gallery-btn");
const btnAddPlushie = document.querySelector(".add-plushie");

const btnViewCollection = document.querySelector(".btn-view-collection");

const btnSubmit = document.querySelector(".btn-submit");

// gallery div
const gallery = document.querySelector(".gallery-preview");

/*
 
*/

// creating database
let db;
const dbName = "rio";
const storeName = "cards";
const dbVersion = 1;

const request = indexedDB.open(dbName, dbVersion);

request.onupgradeneeded = function (e) {
    db = e.target.result;
    if (!db.objectStoreNames.contains(storeName)) {
        const store = db.createObjectStore(storeName, {
            keyPath: "id",
            autoIncrement: true
        });
        store.createIndex("timestamp", "timestamp", { unique: false });
    }
};

request.onsuccess = function (e) {
    db = e.target.result;
    console.log("Database created", e.target.result);
    displayCards();
};

request.onerror = function () {
    console.error("error creating Database :", e.target.result);
};

//

let url;
if (inputFile) {
  inputFile.addEventListener("change", async e => {
    url = e.target.files[0];
});
}

if (btnSubmit) {
  btnSubmit.addEventListener("click", function (e) {
    e.preventDefault();

    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);

    store.add({
        name: inputName.value,
        gender: inputGender.value,
        traits: inputTraits.value,
        file: url,
        discription: inputDiscription.value,
        type: inputType.value,
        rating: inputRating.value,
        timestamp: new Date()
    });

    tx.oncomplete = function (e) {
        console.log("success rio");
    };
    console.log(db);

    displayCards();
});
}


// Display cards

const displayCards = function () {
  let a = 0
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = function (e) {
        request.result.forEach(function (val) {
           a++;
            const card = ` 
            <div class="card-container">
            <div class="card card${val.id}">
  <h1 class="name">RIO</h1>
  <p class="description">
    ${val.discription}.
  </p>

  <h2 class="plushie-name">${val.name}</h2>
  <div class="image-box">
    <img src="${URL.createObjectURL(
        val.file
    )}" class="card-img" alt="Rio Plushie" />
  </div>

  <h2 class="subtitle">${val.name}'s Stats</h2>


<!-- new style -->
  <div class="stats-container">
    
        <div class="lower-stats stats">
          
    <div class="stat-item ">
      <span class="stat-icon">Traits</span>:
      <span class="stat-value">${val.traits}</span>
    </div>
    <div class="stat-item ">
      <span class="stat-icon">Type</span>:
      <span class="stat-value">${val.type}</span>
    </div>
    </div>
    
    <div class="upper-stats stats">
          <div class="stat-item">
      <span class="stat-icon">Gender</span>:<span class="stat-value">${
          val.gender
      }</span>
    </div>
    <div class="stat-item">
      <span class="stat-icon">Rating</span>:<span class="stat-value">${
          val.rating
      }</span>
    </div>
    </div>



  </div>



</div>
                <div class="card-btns">
                <a class="btn btn-download${val.id}">Download</a>
                <button class="btn btn-edit">Button</button>
                </div>
</div>
`;

            gallery.insertAdjacentHTML("afterbegin", card);

        });
          for (let i = 1; i<=a; i++) {
    let card = document.querySelector(`.card${i}`);
    let btn = document.querySelector(`.btn-download${i}`);
    html2canvas(card).then(canvas => {     
      const imgURL = canvas.toDataURL();  
      btn.href = imgURL;      
      btn.download = "card.png"; 
      })
  }
        
    };
  


};

// gallery
const main = document.querySelector(".main");
const sectionGallery = document.querySelector('.gallery');








        
  


