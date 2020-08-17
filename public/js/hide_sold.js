$(document).ready(function () {
    $('#hide-form-checkbox').change(function(){
        list = document.getElementById("item_list");
        let items = list.getElementsByTagName("article");
        if(this.checked) {
            for(item of items) {
                if(item.getAttribute("sold") == "true"){
                    item.hidden = true;
                }
            }
        } else {
            for(item of items) {
                item.hidden = false;
            }
        }
        $('#sort').value=$('#sort').value;
    });
});