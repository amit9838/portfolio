
// Hamburger Menu Items *********************************
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
    // console.log("clicked!")
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
})

let menuLinks = document.getElementsByClassName("nav-link");
let menu_links;
menu_links = Array.from(menuLinks);

menu_links.forEach(n => n.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
}))


async function render_card(data) {
    let p_container = document.getElementById("p_container");
    console.log(p_container)
    let cards = ""
    data.forEach(item=> {
    let card = "";
    let tech_stack = "";
    let features = "";
    let links = "";

    item.tech_stack.forEach((tech) => {
    tech_stack +=  `
            <div class="tech_stack">
                <span class="tech_stack-text">${tech}</span>
            </div>
    `})

    item.features.forEach((feat) =>{
    features +=  `<li>${feat}</li>`})
        // console.log(features)
    item.links.forEach((link) =>{
    links +=  `<div class="p-btn">
                    <a class="p-btn-link" href="${link.link}">${link.icon} ${link.name}</a>
                </div>`})
  
    card += `
            <div class="p-card">
            <div class="p-title-bg" style = "background:${item.background}">
            <div class="bg-icon">
                ${item.icon?item.icon:''}
            </div>
                <h3 class="p-title">${item.title}</h3>
            </div>

            <div class="content">
            <div class="tech_stack-container">
                ${tech_stack}
            </div>
            <div class="p-description">
                ${item.description}
            </div>
            <div class="p-features">
                <h5>FEATURES</h5>
                <ul class="features" type="bullet">
                    ${features}
                </ul>
            </div>
            </div>
            <div class="p-action-btn">
                ${links}
            </div>
        </div> `
    cards +=card;
    })
    p_container.innerHTML = cards;
}

function render_exp(exp) {
    let container = document.getElementById("experience")
    let experiences = `<div class="section-title">
                        <h1>Experience</h1>
                        </div>`;
    exp.forEach(exp=> {
        experiences += `
                <div class="experience-item">
                    <div class = "tags">
                        <div class="tag">${exp.role}</div>
                        <div class="tag">${exp.date}</div>
                    </div>
                    <div class="title">
                        ${exp.organization}
                    </div>
                    <div class="info">
                        ${exp.description}
                    </div>
                </div>
        `
    })
    container.innerHTML = experiences;
}

// Fetch data from json file
async function fetch_data(){
    const response = await fetch('./data.json');
    data = await response.json()
    return data;
}

fetch_data().then((data)=> {
    render_card(data.projects);
    render_exp(data.experience);
}
);


// Scroll Smoothly to internal links *****************************
window.scroll ({
    behavior : "smooth",
})

function toHome() {
    window.scroll({
        top:0,
        behavior:"smooth"
    })
}

function toProjects(){
    if(screen.width<480) {
        window.scroll({
            top:640,
            behavior:"smooth"
        })
    }
    else {

        window.scroll({
            top:600,
            behavior:"smooth"
        })
    }
}

function toExperience() {

    if(screen.width<480) {
        window.scroll({
            top:4050,
            behavior:"smooth"
        })
    }
    else {

        window.scroll({
            top:1800,
            behavior:"smooth"
        })
    }
}

function toSkills() {


    if(screen.width<480) {
        window.scroll({
            top:3500,
            behavior:"smooth"
        })
    }
    else {

        window.scroll({
            top:2100,
            behavior:"smooth"
        })
    }
}

function toContacts() {

    if(screen.width<480) {
        window.scroll({
            top:5000,
            behavior:"smooth"
        })
    }
    else {

        window.scroll({
            top:2900,
            behavior:"smooth"
        })
    }
}


// Display Message Delivery status ***************************** 
let sent_alert = document.getElementById("msg-sent-alert")
function msgAlert(msg){
    sent_alert.style.visibility = "visible";
    sent_alert.innerHTML = msg;

    setTimeout(()=>{
        sent_alert.style.visibility = "hidden";
    },2000);
}


let send_msg_btn = document.getElementById("send-msg-btn")
let newName = document.getElementById("name")
let newEmail = document.getElementById("email")
let newMessage = document.getElementById("message")
let active = true;

// Handling On click event to send message *******************************************
send_msg_btn.addEventListener('click', function() {
    // e.preventDefault();
    // console.log(newName.value+" "+newEmail.value+ " "+newMessage.value)
    if(newName.value.length==0){
        newName.focus();
    }        

    else if(newEmail.value.length==0){
        newEmail.focus();
    }

    else if(newMessage.value.length==0){
        newMessage.focus();
    }

    if(newName.value.length>0 && newEmail.value.length>0 && newMessage.value.length>0){
        const data = {source:'portfolio',  name: newName.value, email : newEmail.value, message:newMessage.value};
 
        if(active){            
            sendMsg(data);     
            // console.log("sending message")
            active = false;
            send_msg_btn.classList.toggle("btn-loading")
            // console.log("Link Deactivated")
        }
        else {
            // console.log("Waiting to send message.")
        }    
    } 
    else{
        console.log("All Fields are required!");
    } 
})

let msgForm = document.querySelector("#msg-form")


// Sending Message Asyncronously ****************************************
function sendMsg(data) {
    fetch('https://marca-msgapi.herokuapp.com/messages', {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then(response => response.json())
      .then(data => {
        // console.log('Success:', "Message sent successfully");
        setTimeout(()=>{
            newName.value = "";
            newEmail.value = "";
            newMessage.value = "";
        
        active = true;
        send_msg_btn.classList.toggle("btn-loading")
        msgAlert("Message Sent!")
        // console.log("Link active")
        },3000);
      })
      .catch((error) => {
        // console.error('Error:', error);
        setTimeout(()=>{
        active = true;
        send_msg_btn.classList.toggle("btn-loading")
        msgAlert("Message not sent! Try again.");
        // console.log("Link active")
        },3000);
      });
}

// window.addEventListener('scroll', scrollPos);
// function scrollPos() {
//     console.log(this.scrollY);
// }

// console.log(screen.width);

let tags = document.getElementsByClassName("skill-item");

let tag_col = [{col:"#ff3d7f", bg:"#49393c"},
                {col:"#4fc0e8", bg:"#374456"},
                {col:"#20d200", bg:"#354432"},
                {col:"#FF7600", bg:"#4e3c2e"},
                {col:"#e0a1ff", bg:"#413548"},
                {col:"#FFD371", bg:"#484338"},
                {col:"#D8F8B7", bg:"#4a5342"},
                {col:"#37E2D5", bg:"#314644"},
                {col:"#5585FF", bg:"#2f5ac833"},
                {col:"#8DE826", bg:"#8ee82627"},
                {col:"#D82E3B", bg:"#be353e39"},
                ];
let tags_arr = Array.from(tags);
let cnt=0;
tags_arr.forEach(function(n){
    let random_idx = cnt%tag_col.length;
    cnt+=1;
    n.style.color = tag_col[random_idx].col;
    n.style.background = tag_col[random_idx].bg;
})
const item=document.getElementById('amit')
const item_cursor=document.getElementById('amit-cursor')
const text=item.innerText;
item.innerText="";
let i=0;
let arr=text.split('')

let temp="";
const time=setInterval(()=>{
    item.innerHTML=temp+arr[i]
    temp+=arr[i];
    i++;
if(i>=arr.length){
    clearInterval(time)
    item_cursor.style.display = "none";
}
},120)

let roles = document.getElementById("roles")
let blink_cursor = document.getElementById("blink_cursor")
let roles_arr=["Computer Software Engineer ", "Backend Developer "]
let ind=0;


function timerUp(str,ind){
    blink_cursor.classList.remove('blink')
    let temp2="";
    let ind2=0;
    const time2=setInterval(()=>{
        roles.innerHTML=temp2+str[ind2]
        temp2+=str[ind2];
        ind2++;
    if(ind2>=str.length){
        clearInterval(time2)
        blink_cursor.classList.add('blink')
        setTimeout(()=>{
            blink_cursor.classList.remove('blink')
            timerDown(str,ind);
        },2000)
    }
},120)
}
function timerDown(str,ind){
    let temp2=str.join('');
    let ind2=str.length-1;
    const time2=setInterval(()=>{
        roles.innerHTML=temp2
        temp2=temp2.substring(0,ind2)
        ind2--;
        if(ind2<-1){
            clearInterval(time2)
        if(ind+1<roles_arr.length){
            let tempArr=roles_arr[ind+1].split('')
            timerUp(tempArr,ind+1)
        }else{
            let tempArr=roles_arr[0].split('')
            timerUp(tempArr,0)
        }
    }
    },55)
}
let tempArr=roles_arr[0].split('')
blink_cursor.classList.add('blink')
setTimeout(()=>timerUp(tempArr,0),2600)


