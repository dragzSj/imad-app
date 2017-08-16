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
var counter = 0;

button.onclick = function () {
    //Make counter Endpoint Request
    var request = new XMLHttpRequest();
    
    //Capture response and store it in a variable
   // request.onreadystatechange = function () {
     //   if (){
            
     //   }
   // }
    
    //Render variable in corrent span
    counter = counter + 1;
    var span = document.getElementById('count');
    span.innerHTML = counter.toString();
};
