
// Hamburger Menu Items *********************************
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
    // console.log("clicked!")
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
})

let menuLinks = document.getElementsByClassName("nav-link");
let arr;
arr = Array.from(menuLinks);

arr.forEach(n => n.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
}))



// Srroll Smoothly *****************************
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
            top:840,
            behavior:"smooth"
        })
    }
}

function toExperience() {

    if(screen.width<480) {
        window.scroll({
            top:6400,
            behavior:"smooth"
        })
    }
    else {

        window.scroll({
            top:4200,
            behavior:"smooth"
        })
    }
}

function toSkills() {


    if(screen.width<480) {
        window.scroll({
            top:5900,
            behavior:"smooth"
        })
    }
    else {

        window.scroll({
            top:4600,
            behavior:"smooth"
        })
    }
}

function toContacts() {

    if(screen.width<480) {
        window.scroll({
            top:7950,
            behavior:"smooth"
        })
    }
    else {

        window.scroll({
            top:5400,
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
send_msg_btn.addEventListener('click', function(e) {
    e.preventDefault();
    // console.log(newName.value+" "+newEmail.value+ " "+newMessage.value)
    if(newName.value.length==0){
        newName.focus();
    }        

    if(newEmail.value.length==0){
        newName.focus();
    }

    if(newMessage.value.length==0){
        newName.focus();
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
function scrollPos() {
    // console.log(this.scrollY);
}

// console.log(screen.width);