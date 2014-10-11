var player;
var videoIdToPlay = "z2XUgE6g7XU"; // default, if all else fails
var playedVideos = [];
var toPlayVideos = [];

// Start finding videos as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
    $("img").attr("src", "conan-pull.gif");
    getStoredValues();
    if(toPlayVideos.length > 0) {
        getVideosToPlay(50);
    } else {
        loadAndPlayVideo();
    }
});

function getStoredValues() {
    // initialize stored values
    chrome.storage.local.get('playedVideos', function(result) {
        if (result.testVar1 === undefined) {
            console.log('playedVideos not set');
        } else {
            playedVideos = result;
            console.log('playedVideos initialized');
        }
    });

    chrome.storage.local.get('toPlayVideos', function(result) {
        if (result.testVar1 === undefined) {
            console.log('toPlayVideos not set');
        } else {
            toPlayVideos = result;
            console.log('toPlayVideos initialized');
        }
    });
}

function getIdToPlay() {
    console.log(toPlayVideos.length + " videos remaining in queue");
    if(toPlayVideos.length > 0) {
        videoIdToPlay = toPlayVideos.pop();
        playedVideos.push(videoIdToPlay);
    }

    chrome.storage.local.set({ 'playedVideos' : playedVideos }, function() {
        if (chrome.extension.lastError) {
            alert('An error occurred setting playedVideos: ' + chrome.extension.lastError.message);
        }
    });
    chrome.storage.local.set({ 'toPlayVideos' : toPlayVideos }, function() {
        if (chrome.extension.lastError) {
            alert('An error occurred seeting toPlayVideos: ' + chrome.extension.lastError.message);
        }
    });
    return videoIdToPlay;
}

// Get the videos and figure out which one to play
function getVideosToPlay(pagingSize) {
    var searchUrl = "https://gdata.youtube.com/feeds/api/videos?"+
                    "q=%22walker+texas+ranger%22+-parody+-conan+-%22late+night%22+-%22dead+walker+texas+ranger%22+-theme+-sigla+-tribute+-remix"+
                    "&v=2&alt=jsonc"+
                    "&max-results=50"+
                    "&duration=short&orderby=viewCount&format=5"+
                    "&category=Entertainment%7CMovies%7CShows"+
                    "&start-index=";

    $.getJSON(searchUrl+Math.ceil((Math.random()*450)), function(data) {
        $.each(data.data.items, function() {
            if(!$.inArray(this.id, playedVideos)) {
                toPlayVideos.push(this.id);
            }
        });
        console.log("Retrieved " + toPlayVideos.length + " videos");
        loadAndPlayVideo();
      }).fail(function(data) {
            console.log("Error getting video list: " + data);
    });
}

// Load the specified video and play it
function loadAndPlayVideo() {
    getIdToPlay();
    console.log("Playing " + videoIdToPlay);
    var tag = document.createElement('script');

    var e = document.createElement("embed");
    e.setAttribute("src", "https://www.youtube.com/v/"+videoIdToPlay+"?version=3&autoplay=1");

    // var c = 'http://www.youtube.com/embed/' + videoIdToPlay + "?autoplay=1";
    // var e = document.createElement("iframe");
    document.getElementById("player").appendChild(e);
    e.setAttribute("seamless", "");
    e.setAttribute("height", "100%");
    e.setAttribute("width", "100%");
    // e.setAttribute("src", c);



    // tag.src = "https://www.youtube.com/iframe_api";
    // var firstScriptTag = document.getElementsByTagName('script')[0];
    // firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// // The API will call this function when the page has finished downloading the JavaScript for the player API, which enables you to then use the API on your page.
// // Thus, this function might create the player objects that you want to display when the page loads.
// function onYouTubeIframeAPIReady() {
//     player = new YT.Player('player', {
//         videoId: videoIdToPlay,
//         playerVars: { 'autoplay': 1, 'controls': 0 }
//     });
// }