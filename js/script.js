const catContainer = document.getElementById("categories-container");
const cardContainer = document.getElementById("cards-container");
const spinner = document.getElementById("spinner");
const noDataSection = document.getElementById("no-data-section");
const sortBtn = document.getElementById("sort-btn");

function activeBtn(element) {
  for (let item of catContainer.children) {
    if (element != item) item.classList = "btn btn-active btn-ghost";
    else item.classList = "btn btn-primary";
  }
}

function secondToHourMinute(second) {
  let result = "";
  if (second) {
    if (second >= 3600) {
      result += Math.floor(second / 3600) + " hrs ";
      second %= 3600;
    }
    if (second >= 60) {
      result += Math.floor(second / 60) + " min";
      second %= 60;
    }
    result += " ago";
  }
  return result;
}

function catDisplayer() {
  fetch("https://openapi.programming-hero.com/api/videos/categories")
    .then((res) => res.json())
    .then((data) => {
      data.data.forEach((item, index) => {
        const btn = document.createElement("button");
        btn.classList = "btn btn-active btn-ghost";
        btn.id = item.category_id;
        btn.innerHTML = item.category;
        catContainer.appendChild(btn);
        btn.addEventListener("click", function () {
          if (!this.classList.contains("btn-primary")) cardDisplayer(this);
        });
        if (!index) cardDisplayer(btn);
      });
    });
}
catDisplayer();

function cardDisplayer(categoryBtn, sortByView) {
  noDataSection.style.display = "none";
  cardContainer.innerHTML = "";
  spinner.style.display = "block";
  fetch(
    `https://openapi.programming-hero.com/api/videos/category/${categoryBtn.id}`
  )
    .then((res) => res.json())
    .then((data) => {
      const dataArray = data.data;
      if (dataArray.length === 0) noDataSection.style.display = "block";
      else if (sortByView) {
        dataArray.sort(
          (a, b) => parseFloat(b?.others?.views) - parseFloat(a?.others?.views)
        );
      } else {
        sortBtn.innerText = "Sort by view";
        sortBtn.removeAttribute("disabled");
      }
      dataArray.forEach((item) => {
        const card = document.createElement("div");
        card.classList = "rounded-lg border shadow";
        card.innerHTML = `
          <div class="relative w-full">
            <img class="w-full aspect-[4/3] object-cover rounded-lg" src="${
              item.thumbnail
            }" alt="Thumbnail">
            ${
              secondToHourMinute(item.others.posted_date)
                ? `<span class="absolute right-2 bottom-2 bg-gray-800 text-white py-1 px-2 rounded-md">${secondToHourMinute(
                    item.others.posted_date
                  )}</span>`
                : ""
            }
          </div>
          <div class="flex justify-start items-start gap-4 p-4">
            <img class="w-10 h-10 object-cover rounded-full" src="${
              item.authors[0].profile_picture
            }" alt="Profile Picture">
            <div class="flex-1">
              <h2 class="text-xl font-bold text-black mb-1">${item.title}</h2>
              <div class="flex justify-start items-center gap-2 mb-1">
                <span class="text-gray-500">${
                  item.authors[0].profile_name
                }</span>
                ${
                  item.authors[0].verified
                    ? '<img class="w-4" src="images/varification_check_mark.jpg" alt="Verification Icon">'
                    : ""
                }
              </div>
              <span class="text-gray-500">${item.others.views} views</span>
            </div>
          </div>
        `;
        cardContainer.appendChild(card);
      });
    })
    .then(() => {
      spinner.style.display = "none";
    });
  activeBtn(categoryBtn);
}

sortBtn.addEventListener("click", function () {
  const activeCatBtn = document.querySelector(
    "#categories-container .btn-primary"
  );
  sortBtn.innerText = "Sorted by view";
  sortBtn.setAttribute("disabled", "true");
  cardDisplayer(activeCatBtn, true);
});
