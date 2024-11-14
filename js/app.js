import axios from "axios";
import { goHomeFunc } from "./goToHomePage";
import { darkMode } from "./darkMode";

// dark mode
darkMode();

// go to the home page
goHomeFunc();

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const videoContainer = document.querySelector('.video-container');

const API_KEY = "AIzaSyCvny8BgZliBGVdkYVUSVHl7vMtgjta3kE";

const SEARCH_API_URL = "https://www.googleapis.com/youtube/v3/search";
const VIDEO_API_URL = "https://www.googleapis.com/youtube/v3/videos";
const CHANNEL_API_URL = "https://www.googleapis.com/youtube/v3/channels";
async function fetchVideos() {
    videoContainer.innerHTML = "";
    videoContainer.innerHTML = "Loading...";
    try {
        const response = await axios.get(VIDEO_API_URL, {
            params: {
                key: API_KEY,
                chart: "mostPopular",
                part: "snippet",
                regionCode: "US",
                maxResults: 7
            }
        });
        videoContainer.innerHTML = "";
        const videos = response.data.items; // array


        videos.forEach(video => {
            getChannelInfo(video) //here video is an object
        });


    } catch (error) {
        console.error(" Ye gadbad hein: ", error);
        videoContainer.innerHTML = `
            <div class="error">
                <p>Something went wrong.</p>
                <p>${error.message}. Please try again.</p>
            </div>
        `;

    }

}

async function getChannelInfo(video) {
    try {
        let response = await axios.get(CHANNEL_API_URL, {
            params: {
                id: video.snippet.channelId,
                key: API_KEY,
                part: "snippet"
            }
        });
        const channelData = response.data.items[0].snippet.thumbnails;

        video.channelIcon = channelData;

        console.log(video);

        displayVideo(video)
    } catch (error) {
        console.error("channel error dekho: ", error);

    }
}

// display each video
function displayVideo(video) {
    videoContainer.innerHTML += `
            <div class="video-card">

                <img class="thumbnails" src="${video.snippet.thumbnails.maxres.url}" alt="${video.snippet.description}" class="thumbnail">

                <div class="icon-title">
                        <img class="channel-icon" src="${video.channelIcon.default.url}" alt="channel-logo">
                        
                        <div class="title-div">
                            <h3 class="title">${video.snippet.title}</h3>
                            <p class="channel-name">${video.snippet.channelTitle}</p>
                        </div>

                </div>
                
            </div>
        `;
}



// initial load
document.addEventListener("DOMContentLoaded", () => {
    fetchVideos();
})



searchButton.addEventListener("click", carryTextFunc)
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        carryTextFunc();
    }
})

function carryTextFunc() {
    const searchText = searchInput.value.trim();
    if (searchText) {
        localStorage.setItem("searchText", JSON.stringify(searchText))
        // we can use function to carry the searchvalue as well

        // window.location.href = goToSearch;
        window.location.href = "pages/searchPage.html";
    }
}