console.log("javaScript")
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
// Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

// Format the minutes and seconds with leading zeros if necessary
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

// Return the formatted time
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder){
    currFolder = folder;
let a= await fetch(`/Spotify clone/${folder}/`) 
let response = await a.text();
console.log(response)
let div = document.createElement("div")
div.innerHTML = response;
let as = div.getElementsByTagName("a")
songs = []
for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if(element.href.endsWith(".mp3")){
        songs.push(element.href.split(`/${folder}/`)[1])
    }
    
}


//show all the songs in a playlist
let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
songUL.innerHTML=""
for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + `<li>
    <img class="invert" src="images/music.svg" alt="">
           <div class="info">
               <div>${song.replaceAll("%20"," ")}</div>
               
               <div>Artist</div>
           </div>
           <div class="playnow">
               <span>Play Now</span>
               <img  class="invert" src="images/play.svg" alt="">
           </div>
           </li>`;
    
}
//Attach An event listner to each song
Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e =>{
    e.addEventListener("click", element=>{
        console.log(e.querySelector(".info").firstElementChild.innerHTML)
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })
})
return songs
}

const playMusic = (track , pause = false) =>{
    // let audio = new Audio("/Spotify clone/music/" + track)
    currentSong.src = `/Spotify clone/${currFolder}/` + track
    if (!pause){
currentSong.play()
play.src = "images/pause.svg"
    }
    document.querySelector(".songsinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function displayAlbums(){
    let a= await fetch(`/Spotify clone/music/`) 
let response = await a.text();
console.log(response)
let div = document.createElement("div")
div.innerHTML = response;
let anchors = div.getElementsByTagName("a")
let cardcontainer = document.querySelector(".cardcontainer")
let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
    
    if(e.href.includes("/music") && !e.href.includes(".htaccess")){
        let folder = e.href.split("/").slice(-2)[0]
        //get the metadata of the folder
        let a= await fetch(`/Spotify clone/music/${folder}/info.json`) 
let response = await a.json(); 
cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="${folder}" class="card">
                <div class="play">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 20V4L19 12L5 20Z" fill="#000" stroke="#141B34" stroke-width="1.5" stroke-linejoin="round" />
                      </svg>
                      
                </div>
                <img src="/Spotify clone/music/${folder}/cover.png" alt="">
                <h2>${response.title}</h2>
                <p>${response.description}</p> 
            </div>`  
}
}

//load the playlist when a card is clicked
Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click",async item=>{
    songs = await getSongs(`music/${item.currentTarget.dataset.folder}`)
    playMusic(songs[0])
    })
})


}

async function main(){ 
    //Get the list of all the songs
await getSongs("music/beats")
playMusic(songs[0] , true)
console.log(songs)

//Display all the albums on the page
await displayAlbums()

//Attach an event listner to play , next and previous
play.addEventListener("click" , ()=>{
if(currentSong.paused){
    currentSong.play()
    play.src = "images/pause.svg"
}
else{
    currentSong.pause()
    play.src = "images/play.svg"
}
})

//Listen for time update event
currentSong.addEventListener("timeupdate" , () =>{
console.log(currentSong.currentTime , currentSong.duration);
document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration)*100 +"%";
})

//add an event listner to seekbar
document.querySelector(".seekbar").addEventListener("click" , e => {
    let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
    document.querySelector(".circle").style.left = percent + "%";

    //for updating time duration when we move that circle .
    currentSong.currentTime = ((currentSong.duration)*percent)/100
})  

//Add an event listner for hamburger
document.querySelector(".hamburger").addEventListener("click" ,()=>{
    document.querySelector(".left").style.left="0"
 })
 
 //Add an event listner for close button
 document.querySelector(".close").addEventListener("click" ,()=>{
    document.querySelector(".left").style.left="-150%"; 
 })

 
// Add an event listener to the previous button
previous.addEventListener("click", ()=>{
    console.log("Previous clicked")
    console.log(currentSong)
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if(index-1 >= 0){
        playMusic(songs[index-1])
    }
})

// Add an event listener to the next button
next.addEventListener("click", ()=>{
    console.log("Next clicked")
    console.log(currentSong)
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if(index+1 < songs.length){
        playMusic(songs[index+1])
    }
})

//Add an Event to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    console.log("Setting volume to", e.target.value, "/100")
    currentSong.volume = parseInt(e.target.value)/100
    })

    //Add Event listner to Mute the track
document.querySelector(".songvolume>img").addEventListener("click",e=>{

    if(e.target.src.includes("volume.svg")){
        e.target.src=e.target.src.replace("volume.svg","mute.svg")
        currentSong.volume=0;
        document.querySelector(".range").getElementsByTagName("input")[0].value=0;
    }
    else{
        e.target.src= e.target.src.replace("mute.svg","volume.svg")
        currentSong.volume=0.1;
        document.querySelector(".range").getElementsByTagName("input")[0].value=10;
    }

})


} 

main()