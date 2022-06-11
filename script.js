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
// console.log(arr);

arr.forEach(n => n.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
}))


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
            top:6800,
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
            top:6300,
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




let msgForm = document.querySelector("#msg-form")
function submitForm() {
    let newName = document.getElementById("name")
    let newEmail = document.getElementById("email")
    let newMessage = document.getElementById("message")
    let send_msg_btn = document.getElementById("send_msg_btn")
    send_msg_btn.disabled = true;
    
    // console.log(name);
    // let subject = name;
    if(newName.value>0 && newEmail.value>0 && newMessage.value>0){
        const data = {source:'portfolio',  name: newName.value, email : newEmail.value, message:newMessage.value};
        newName.value = "";
        newEmail.value = "";
        newMessage.value = "";
        setTimeout(()=>{
            sendMsg(data);
            send_msg_btn.disabled = false;
        },3000);        
    }
    
    else{
        console.log("All Fields are required!");
    }


}


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
        console.log('Success:', "Message sent successfully");
      })
      .catch((error) => {
        console.error('Error:', error);
      });
      
}

window.addEventListener('scroll', scrollPos);
function scrollPos() {
    // console.log(this.scrollY);
}

// console.log(screen.width);