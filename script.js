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
    let name = document.getElementById("name").value
    let email = document.getElementById("email").value
    let message = document.getElementById("message").value
    // let subject = name;
}


window.addEventListener('scroll', scrollPos);
function scrollPos() {
    // console.log(this.scrollY);
}

// console.log(screen.width);