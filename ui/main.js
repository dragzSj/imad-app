console.log('Loaded!');

//text Change of main_div
var element = document.getElementById('main-text');

element.innerHTML = 'NewerValue';

//move img
var img = document.getElementById('img');

img.onclick = function (){
    img.style.marginLeft = '100px';
}