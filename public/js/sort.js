$(document).ready(function() {
    
    
    $('#sort').on('change', function() {
        console.log("changed!");
        let list, i, switching, b, shouldSwitch;
        list = document.getElementById("item_list");
        console.log(list);
        switching = true;
        while(switching) {
            switching = false;
            b = list.getElementsByTagName("article");
            console.log(b);
            for (i = 0; i < (b.length - 1); i++) {
                shouldSwitch = false;
                console.log(b[i].innerHTML);
                if (b[i].innerText.toLowerCase() > b[i + 1].innerText.toLowerCase()) {
                  shouldSwitch = true;
                  break;
                }
            }
            if (shouldSwitch) {
                b[i].parentNode.insertBefore(b[i + 1], b[i]);
                switching = true;
            }
        }
        // document.forms["sort-form"].submit();
    });
});