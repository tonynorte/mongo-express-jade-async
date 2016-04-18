$(document).ready(function (checkBoxObjects) {
    $.getJSON("/getData", function (checkBoxObjects) {//this is just one example about how to get data from a service from server
        console.log("Client Recieved Array from Server: ", checkBoxObjects);
    });
});