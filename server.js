var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

var config = {
    user: 'dragzsj',
    database: 'dragzsj',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'randomSecretValue',
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30}
}));

function createTemplate (data){
    var title = data.title;
    var date = data.date;
    var heading = data.heading;
    var content = data.content;
    
    var htmlTemplate = `
    <html>
      <head>
          <title>
              ${title}
          </title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link href="/ui/style.css" rel="stylesheet" />
      </head> 
      <body>
          <div class="container">
              <div>
                  <a href="/">Home</a>
              </div>
              <hr/>
              <h3>
                  ${heading}
              </h3>
              <div>
                  ${date.toDateString()}
              </div>
              <div>
                ${content}
              </div>
              <hr/>
              <h4>Comments</h4>
              <div id="comment_form">
              </div>
              <div id="comments">
                <center>Loading comments from serverJS...</center>
              </div>
          </div>
          <script type="text/javascript" src="/ui/articlescript.js"></script>
      </body>
    </html>
    `;
    return htmlTemplate;
}
//
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function hash (input, salt) {
  //create a hash
  var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
  return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');    
}

app.get('/hash/:input', function(req, res) {
  var hashedString = hash(req.params.input,'salt-string-value');
  res.send(hashedString);
});

app.post('/create-user', function (req, res) {
  //username, password
  //{"username": "DragzSj", "password": "password "}
  //JSON
  var username = req.body.username;
  var password = req.body.password;
  
  var salt = crypto.randomBytes(128).toString('hex');
  var dbString= hash(password, salt);
  pool.query('INSERT INTO "user" (username, password) values ($1, $2)', [username, dbString], function (err, result) {
    if(err){
        res.status(500).send(err.toString());
    }else{
        res.send('User Created:' + username);
    }
  });
});

app.post('/login', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  
  pool.query('SELECT * FROM "user" WHERE username = $1', [username], function (err, result) {
    if(err){
        res.status(500).send(err.toString());
    }else{
        if (result.rows.length === 0){
            res.send(403).send('username or password is invalid!');
        }else{
            //Match password 
            var dbString = result.rows[0].password;
            var salt = dbString.split('$')[2];
            var hashedPassword = hash(password, salt); // creating hash based on password submitted & original salt
            if (hashedPassword === dbString){
                //set Session
                req.session.auth = {userId: result.rows[0].id};
                //set cookie with a session id
                // internally, on the serverside, it maps the session id to an object
                //{auth: {userId}}
                
                res.send('Login Success');
            }else {
                res.send(403).send('username or password is invalid!');
            }
        }
    }
  });
});

app.get('/check-login', function (req, res){
  if (req.session && req.session.auth && req.session.auth.userId){
      res.send('You are logged in: ' + req.session.auth.userId.toString());
  }else{
      res.send('You are Not logged in!!!');
  }
});

app.get('/logout', function (req, res) {
  delete req.session.auth;
  res.send('Logged out! <hr/> <a href="/">HOME</a>');
});

var pool = new Pool(config);
app.get('/get-article', function (req, res) {
   // make a select request
   // return a response with the results
   pool.query('SELECT * FROM article ORDER BY date DESC', function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));
      }
   });
});

app.get('/get-comments/:articleName', function (req, res) {
   // make a select request
   // return a response with the results
   pool.query('SELECT comment.*, "user".username FROM article, comment, "user" WHERE article.title = $1 AND article.id = comment.article_id AND comment.user_id = "user".id ORDER BY comment.timestamp DESC', [req.params.articleName], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));
      }
   });
});

app.post('/submit-comment/:articleName', function (req, res) {
   // Check if the user is logged in
    if (req.session && req.session.auth && req.session.auth.userId) {
        // First check if the article exists and get the article-id
        pool.query('SELECT * from article where title = $1', [req.params.articleName], function (err, result) {
            if (err) {
                res.status(500).send(err.toString());
            } else {
                if (result.rows.length === 0) {
                    res.status(400).send('Article not found');
                } else {
                    var articleId = result.rows[0].id;
                    // Now insert the right comment for this article
                    pool.query(
                        "INSERT INTO comment (comment, article_id, user_id) VALUES ($1, $2, $3)",
                        [req.body.comment, articleId, req.session.auth.userId],
                        function (err, result) {
                            if (err) {
                                res.status(500).send(err.toString());
                            } else {
                                res.status(200).send('Comment inserted!');
                            }
                        });
                }
            }
       });     
    } else {
        res.status(403).send('Only logged in users can comment');
    }
});

var counter = 0;
app.get('/counter', function (req, res) {
    counter = counter + 1;
    res.send(counter.toString());
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

var names = [];
app.get('/submit-name', function (req, res){ // URL: /submit-name?name=xxxxx
  // Get name from request object
  var name = req.query.name;
  
  names.push(name);
  // JSON
  res.send(JSON.stringify(names));//todo
});

app.get('/article/:articleName', function (req, res) {
  //var articleName = req.params.articleName;    
  pool.query("SELECT * FROM article WHERE title = $1", [req.params.articleName], function(err, result){
      if(err){
          res.status(500).send(err.toString());
      }else{
          if(result.rows.length === 0){
              res.status(400).send('Article not found');
          }else{
              var articleData = result.rows[0];
              res.send(createTemplate(articleData));
          }
      }
  });
  //res.send(createTemplate(articles[articleName]));    
});

// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
