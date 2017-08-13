console.log('Loaded!');

//text Change of main_div
var element = document.getElementById('main-text');

element.innerHTML = 'NewerValue';

//move img
var img = document.getElementById('img');

var marginLeft=0; 

function moveRight () {
    marginLeft = marginLeft + 10;
    img.style.marginLeft = marginLeft + 'px';
}

img.onclick = function () {
    //img.style.marginLeft = '100px';
    var interval = setInterval(moveRight, 50);
}