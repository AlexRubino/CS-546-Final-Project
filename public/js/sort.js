$(document).ready(function() {
    function compare(option, b, i){
        switch(option){
            case "dl":
                return b[i].getAttribute("dl") > b[i+1].getAttribute("dl");
                break;
            case "de":
                return b[i].getAttribute("de") > b[i+1].getAttribute("de");
                break;
            case "al":
                return b[i].innerText.toLowerCase() > b[i + 1].innerText.toLowerCase();
                break;
            case "r-al":
                return b[i].innerText.toLowerCase() <= b[i + 1].innerText.toLowerCase();
                break;
            case "p":
                return b[i].getAttribute("p") > b[i + 1].getAttribute("p");
                break;
            case "r-p":
                return b[i].getAttribute("p") < b[i + 1].getAttribute("p");
                break;
            default:
                return false;
        }
    }
    
    $('#sort').on('change', function() {
        let option = $(this).val();
        console.log("changed to", option);
        let list, i, switching, b, shouldSwitch;
        list = document.getElementById("item_list");
        switching = true;
        while(switching) {
            switching = false;
            b = list.getElementsByTagName("article");
            for (i = 0; i < (b.length - 1); i++) {
                shouldSwitch = false;
                if (compare(option, b, i)) {
                  shouldSwitch = true;
                  break;
                }
            }
            if (shouldSwitch) {
                b[i].parentNode.insertBefore(b[i + 1], b[i]);
                switching = true;
            }
        }
        console.log("done");
    });
});