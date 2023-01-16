// API KEY DA PAXELS
const API_KEY = "563492ad6f91700001000001fed0d4ed1c9e4be0bbd573714a813a76";

const formElement = document.querySelector("#searchForm");
const resultContainerElement = document.querySelector("#resultContainer");

formElement.addEventListener("submit", getInputValues);

let currentPage = 1;

// Usando api
function useApi() {
  const baseUrl = "https://api.pexels.com/";

  async function doFetch(url, query) {
    const response = await fetch(url + query, {
      method: "GET",
      headers: {
        Authorization: API_KEY,
      },
    });
    const result = await response.json();
    return result;
  }

  return {
    searchQuery: async function (searchOptions, itemsPerPage) {
      const query = `${searchOptions.route}/search?query=${searchOptions.text}&page=${currentPage}&per_page=${itemsPerPage}`;
      return await doFetch(baseUrl, query);
    },
  };
}

const api = useApi();

const searchOptions = {
  contentType: "",
  text: "",
  route: "",
};

// Pegando valores do input
async function getInputValues(event) {
  event.preventDefault();

  const selectElement = document.querySelector("#searchSelect");
  const textInputElement = document.querySelector("#searchInput");

  searchOptions.contentType = selectElement.value;
  searchOptions.text = textInputElement.value;
  searchOptions.route = selectElement.value === "video" ? "videos" : "v1";

  doTheSearch(searchOptions);
  resultContainerElement.innerHTML = "";
}

async function doTheSearch(searchOptions) {
  const searchResult = await api.searchQuery(searchOptions, 6);
  mountHtml(searchOptions.contentType, searchResult);
}

function mountHtml(contentType, searchResult) {
  showButton();

  if (contentType === "image") {
    searchResult.photos.forEach((image) => {
      const imageContainer = `
                <div class="imageBox--container">
                <div class="imageBox--imgContainer">
                <img class="imageBox--img" src="${image.src.tiny}" alt="${image.alt}" />
                </div>
                <div class="imageBox--informationContainer">
                <span class="imageBox--informationTitle">
                    ${image.photographer}
                </span>
                <a
                    href="${image.src.original}"
                    class="imageBox--downloadLink"
                    target="_blank"
                >
                    Download
                    <img src="./assets/images/icons/ic-download.svg" />
                </a>
                </div>
            </div>
            `;
      resultContainerElement.innerHTML += imageContainer;
    });
    return;
  }

  if (contentType === "video") {
    searchResult.videos.forEach((video) => {
      const imageContainer = `
                <div class="imageBox--container">
                <div class="imageBox--imgContainer">
                <img class="imageBox--img" src="${video.image}"/>
                </div>
                <div class="imageBox--informationContainer">
                <span class="imageBox--informationTitle">
                    ${video.user.name}
                </span>
                <a
                    href="${video.video_files[0].link}"
                    class="imageBox--downloadLink"
                    target="_blank"
                >
                    Download
                    <img src="./assets/images/icons/ic-download.svg" />
                </a>
                </div>
            </div>
            `;
      resultContainerElement.innerHTML += imageContainer;
    });
    return;
  }
}

function showButton() {
  const showButtonElement = document.querySelector(
    ".showMoreButton--container"
  );
  const containsShowMoreButtonIntoHtml =
    document.querySelector("#showMore--button");

  if (!containsShowMoreButtonIntoHtml) {
    const createButtonElement = document.createElement("button");
    createButtonElement.setAttribute("id", "showMore--button");
    createButtonElement.textContent = "Show More";

    showButtonElement.appendChild(createButtonElement);

    showButtonElement.addEventListener("click", function() {
      currentPage += 1;
      doTheSearch(searchOptions);
    });
  }
}
