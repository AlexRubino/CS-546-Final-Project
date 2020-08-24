let endDate = document.getElementById("endDate").innerHTML;
endDate = endDate.replace("End Date:","");
const countDownDate = new Date(endDate).getTime();

// Update the count down every 1 second
let x = setInterval(function() {
// Find the distance between now and the count down date
let distance = countDownDate - new Date().getTime();

// Time calculations for days, hours, minutes and seconds
let days = Math.floor(distance / (1000 * 60 * 60 * 24));
let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
let seconds = Math.floor((distance % (1000 * 60)) / 1000);

// Display the result in the element with id="timer"
try {
    document.getElementById("days").innerHTML = days;
    document.getElementById("hours").innerHTML =  hours;
    document.getElementById("minutes").innerHTML = minutes;
    document.getElementById("seconds").innerHTML = seconds;
} catch (e) {}

// If the count down is finished, write some text
if (distance < 0 ) {
    clearInterval(x);
    try {
        document.getElementById("days").innerHTML = 0;
        document.getElementById("hours").innerHTML =  0;
        document.getElementById("minutes").innerHTML = 0;
        document.getElementById("seconds").innerHTML = 0;
        document.getElementById("new_bid_form").innerHTML = "Bidding is now over. This item has been sold";
    } catch (e) {}
    
    
// If the count down is finished, write some text
}
}, 1000);