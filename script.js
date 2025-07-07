let songs = [];
let song = [];
let player = null;
let i = 0;
let n;
let a;
let currfolder;
async function getsongs(folder) {
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}`);
    // console.log(a);
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = []
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href);
        }
    }
}
let song1;

function addsong() {
    song = [];
    let ul = document.querySelector(".songlist ul");
    ul.innerHTML = "";
    for (let i = 0; i < songs.length; i++) {
        const element = songs[i];
        song1 = element;
        let songname = element.split("/").pop();
        let clean = decodeURIComponent(songname);
        song.push(currfolder + clean);
        let ext = clean.replace(".mp3", "");
        // adding songs in html document.
        let li = document.createElement("li");
        let img = document.createElement("img");
        img.src = "img/song-icon.jpg";
        img.alt = "song-icon";
        li.textContent = ext;
        ul.appendChild(img);
        ul.appendChild(li);
    }
}
// To display cards dynamically
async function display() {
    let a = await fetch(`http://127.0.0.1:3000/songs`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let anc = Array.from(anchors);
    let i = 0;
    anc.forEach(e => {
        if (e.href.includes("songs")) {
            i = i + 1;
            let cards = document.querySelector(".cards");
            let card = document.createElement("div");
            card.className = "card bg-grey rounded"
            card.dataset.folder = e.href.split("/").filter(Boolean).pop();
            card.innerHTML = `<img src="img/Shape_of_You_Single.webp" alt="song img">
                        <button class="flex"><img src="img/playbutton.png" alt="play btn"></button>
                        <h4>This is a heading</h4>
                        <p>This is para</p>`
            cards.appendChild(card);
        }
    });
}
async function main() {
    await getsongs("songs/folder1/");
    // console.log(s1);
    addsong();
    // display all albums on page
    display();
    player = new Audio(song[i]);
    songname();
    player.pause();
    player.currentTime = 0;
    let a = document.querySelector(".left");

    document.querySelector(".ham").addEventListener("click", () => {
        a.style.left = "0%";
    });
    document.querySelector(".icon").addEventListener("click", () => {
        a.style.left = "-100%";
    })
    let vol = player.volume;

    let v = document.querySelector("#volume");
    document.querySelector(".volume").addEventListener("click", () => {
        let a = document.querySelector(".volume img");
        if (player.volume == 0) {
            a.src = "img/volume-full.svg";
            player.volume = vol;
        }
        else {
            a.src = "img/volume-muted.svg";
            vol = player.volume;
            player.volume = 0;
            console.log(player.volume);
        }
    });
    document.querySelector("#volume").addEventListener("change", () => {
        player.volume = (v.value / 100);
    })
    // Adding event lister to all the card
    document.querySelector(".cards").addEventListener("click", async (event) => {
        player.pause();
        player.currentTime = 0;
        let card = event.target.closest(".card");
        if (card && document.querySelector(".cards").contains(card)) {

            let data = `songs/${card.dataset.folder}/`;
            console.log(data);
            await getsongs(data);
            addsong();
            i = 0;
            player = new Audio(song[i]);
            player.play();
            // player.currentTime = 0;
            seeker()
            songname();
            document.querySelector("#progressbar").value = "0";
        }
    })
}
main();

function playsong() {
    document.querySelector(".songlist ul").addEventListener("click", function (e) {
        if (e.target.tagName === "LI") {
            if (player) {
                player.pause();
                player.currentTime = 0;
            }
            // song = "songs/" + e.target.innerText + ".mp3";
            let s = `${currfolder}${e.target.innerText}${".mp3"}`;
            i = song.indexOf(s);
            player = new Audio(song[i]);
            songname();
            player.play();
            seeker();
            console.log("now playing " + s);
        }
    })
}
playsong();

function presong() {
    document.querySelector(".previous").addEventListener("click", function () {
        if (player) {
            player.pause();
            player.currentTime = 0;
        }
        i = (i - 1)
        console.log(i);
        if (i < 0) {
            i = (song.length - 1);
            console.log("last song");
        }
        player = new Audio(song[i])
        songname();
        player.play();
        seeker();
        console.log("previous");
    })
}
presong();

function play() {
    document.querySelector(".playpause").addEventListener("click", function () {
        seeker();
        if (player.paused) {
            img2();
            player.play();

        }
        else {
            img1();
            player.pause();
        }
    })
}
play();

function img1() {
    let img = document.querySelector(".playpause img");
    img.src = "img/play.svg"
}
img1();

function img2() {
    let img = document.querySelector(".playpause img");
    img.src = "img/pause.svg"
}

function nextsong() {
    document.querySelector(".next").addEventListener("click", function () {
        if (player) {
            player.pause();
            player.currentTime = 0;
        }

        i = (i + 1)
        console.log(i);
        if (i == song.length) {
            i = 0;
        }
        shuffle();
        player = new Audio(song[i])
        songname();
        player.play();
        seeker();
        console.log("next");

    })
}
nextsong();

let sname;
function songname() {
    n = song[i];
    let a = n.split("/").pop();
    let name = a.replace(".mp3", "");
    sname = document.querySelector(".songname");
    sname.innerText = name;
}

let s = false;
let l = false;
function value1() {
    document.querySelector(".shuffle").addEventListener("click", () => {
        s = !s;
        document.querySelector(".shuffle img").classList.toggle("on");
        console.log("value of s changed to " + s);
    })
}
value1();
function value2() {
    document.querySelector(".loop").addEventListener("click", () => {
        l = !l;
        document.querySelector(".loop img").classList.toggle("on");
        console.log("value of l changed to " + l);
    })
}
value2();

function seeker() {
    img2();
    whileplaying();
    let p = document.querySelector("#progressbar");
    player.addEventListener("timeupdate", function () {
        p.value = player.currentTime;
        p.max = player.duration;
        let min1 = Math.floor(player.currentTime / 60);
        let sec1 = Math.floor(player.currentTime % 60);
        min1 = min1 < 10 ? "0" + min1 : min1;
        sec1 = sec1 < 10 ? "0" + sec1 : sec1;
        let time1 = `${min1}:${sec1}`

        let min2 = Math.floor(player.duration / 60);
        let sec2 = Math.floor(player.duration % 60);
        min2 = min2 < 10 ? "0" + min2 : min2;
        sec2 = sec2 < 10 ? "0" + sec2 : sec2;
        let time2 = `${min2}:${sec2}`
        // console.log("This is time"+time);
        document.querySelector(".time1").innerText = time1;
        document.querySelector(".time2").innerText = time2;
    })

    p.addEventListener("input", function () {
        player.currentTime = p.value;
    })

    player.addEventListener("timeupdate", function () {
        if (player.currentTime == player.duration) {
            i = (i + 1)
            loop();
            if (i == song.length) {
                i = 0;
            }
            shuffle();
            player = new Audio(song[i])
            songname();
            player.play();
            seeker();

        }
    });
}

function whileplaying() {
    let li = document.querySelectorAll(".songlist ul li");
    let img = document.querySelectorAll(".songlist ul img");
    li.forEach(element => {
        element.classList.remove("playing");
    });
    img.forEach(element => {
        element.classList.remove("playing1");
    });
    document.querySelectorAll(".songlist ul li")[i].classList.add("playing");
    document.querySelectorAll(".songlist ul img")[i].classList.add("playing1");
    document.querySelector(".player").style.border = "2px solid #a64ca6";
    let nodelist = document.querySelectorAll(".player img");
    for (let i = 0; i < nodelist.length; i++) {
        nodelist[i].style.border = "3px solid rgb(139, 195, 134)";

    }
}

function shuffle() {
    if (s == true) {
        let a = Math.floor(Math.random() * song.length);
        i = a;
    }
}
function loop() {
    if (l == true) {
        i = i - 1;
    }
}