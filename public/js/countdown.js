let endDate = document.getElementById("endDate").innerHTML;
endDate = endDate.replace("End Date:","");
const countDownDate = new Date(endDate).getTime();

// Update the count down every 1 second
let x = setInterval(function() {

// Get today's date and time
let now = new Date().getTime();

// Find the distance between now and the count down date
let distance = countDownDate - now;

// Time calculations for days, hours, minutes and seconds
let days = Math.floor(distance / (1000 * 60 * 60 * 24));
let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
let seconds = Math.floor((distance % (1000 * 60)) / 1000);

// Display the result in the element with id="demo"
document.getElementById("timer").innerHTML = days + "d " + hours + "h "
+ minutes + "m " + seconds + "s ";

// If the count down is finished, write some text
if (distance < 0) {
 clearInterval(x);
 document.getElementById("timer").innerHTML = "This item is now off the market!";
}
}, 1000);