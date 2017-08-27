//counter code
/*
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
*/
 
//Submit username/password to login
var submit = document.getElementById('submit_btn');
submit.onclick = function (){
    //Make counter Endpoint Request
    var request = new XMLHttpRequest();
    
    //Capture response and store it in a variable
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE){
            //take action
            if (request.status === 200){
                console.log('user logged in!');
                alert('Login Complete!');
                
                /* //capture name list and render as a list
                //var names = ['name1', 'name2', 'name3', 'name4'];
                var names = request.responseText;
                names = JSON.parse(names);
                var list = '';
                for (var i=0; i< names.length; i++){
                    list += '<li>' + names[i] + '</li>'; 
                }
            var ul = document.getElementById('namelist');
            ul.innerHTML = list;*/
            }else if (request.status === 403){
                alert('U/P invalid!');
            }else if (request.status === 500){
                alert('ERROR ON SERVER');
            }
        }
        //Not done yet
    };
    
    //Make the request
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    console.log(username);
    console.log(password);
    request.open('POST', 'http://dragzsj.imad.hasura-app.io/login', true);
    request.setRequestHeader('Content-type', 'application/json'); 
    request.send(JSON.stringify({username: username, password: passsword}));
    //make req to ser and send name
    
   
};