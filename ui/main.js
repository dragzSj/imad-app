/*console.log('Loaded!');

//text Change of main_div
var element = document.getElementById('main-text');

element.innerHTML = 'NewerValue';

//move img
var img = document.getElementById('img');

var marginLeft=0; 

function moveRight () {
    marginLeft = marginLeft + 2;
    img.style.marginLeft = marginLeft + 'px';
}

img.onclick = function () {
    //img.style.marginLeft = '100px';
    var interval = setInterval(moveRight, 50);
}*/
//counter code

var button = document.getElementById('counter');

button.onclick = function () {
    //Make counter Endpoint Request
    var request = new XMLHttpRequest();
    
    //Capture response and store it in a variable
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE){
            //take action
            if (request.status === 200){
                var counter = request.responseText;
                var span = document.getElementById('count');
                span.innerHTML = counter.toString();
            }
        }
        //Not done yet
    };
    
    //Make the request
    request.open('GET', 'http://dragzsj.imad.hasura-app.io/counter', true);
    request.send(null);
};
