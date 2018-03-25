// express js server
/*
    Express js is framework for node it is most common framwork used among js backend developers
*/

const express = require('express');
const bodyparser = require('body-parser');
const path = require('path'); // a buitin module 
const mysql = require('mysql'); // it specifies that it requires mysql module
const expressValidator = require('express-validator'); // express validator for validatiing the forms
const db = mysql.createConnection({
    host: 'sql100.byethost.com',
    user: 'b4_21835853',
    pasword: 'engINeerINg',
    database: 'b4_21835853_expressdb'
});
db.connect((err) => {
    /* if (err) {
         throw err;
     }*/
    console.log('MySQL Connected....');
});
const app = express();  // 
/*
const logger = (req, res, next) => {
    console.log('logging...');   
}

//...................................................
app.use(logger); // middle where function
//..................................................
*/
// middelware for express-validator
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        let namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));
// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Body parser middle where
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
// set static path
/* contains all the static content of the web applicationor website like html,css, javascript
app.use(express.static(path.join(__dirname, 'Public')));*/
// gets request to registration form
app.get('/', (req, res) => {
    res.render('index', {
        message: ''
    });
});
// gets request to login form
app.get('/login', (req, res) => {
    res.render('login');
});
// gets request to access all users (must require authentication)
app.get('/allusers', (req, res) => {
    res.render('validate');
});
//validation request
app.post('/admin/validate', (req, res) => {
    req.checkBody('Name', 'Name is required').notEmpty();
    req.checkBody('Pass', 'Password is required').notEmpty();
    let admin = {
        Name: req.body.name,
        Pass: req.body.password
    }
    let sql = 'SELECT * FROM admin';
    let query = db.query(sql, (err, results) => {
        if (err) {
            throw err;
        }
        let adminFlag = false;
        results.forEach((element) => {
            if (element.Name == admin.Name && element.Pass == admin.Pass) {
                adminFlag = true;
            }
        });
        if (adminFlag) {
            console.log('Authentication matched!');
            let Sql = 'SELECT * FROM userdata';
            let quer_y = db.query(Sql, (err, result) => {
                if (err) {
                    throw err;
                }
                res.render('allusers', {
                    users: result
                });
            });
        }
        else {
            res.render('invalid');
        }
    });
});
// registration request
app.post('/users/add', (req, res) => {
    let newUser = {
        Name: req.body.name,
        Fname: req.body.Fname,
        Email: req.body.email,
        Pass: req.body.password,
        Address: req.body.address,
        Age: req.body.age
    }
    console.log(newUser);
    let sql = 'INSERT INTO userdata SET ?';
    let query = db.query(sql, newUser, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.render('index', {
            message: 'Form Submitted'
        });
    });
});
// login request
app.post('/users/access', (req, res) => {
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        console.log('Errors');
    } else {
        console.log('Success');
        let oldUser = {
            Name: req.body.name,
            Pass: req.body.password
        }
        let sql = 'SELECT * FROM  userdata WHERE Pass=' + mysql.escape(oldUser.Pass) + 'AND Name=' + mysql.escape(oldUser.Name);
        let query = db.query(sql, (err, result) => {
            if (err) {
                throw err;
            }
            else {
                console.log('Query Successful');
                res.render('welcome', {
                    Name: result[0].Name,
                    Fname: result[0].Fname,
                    Email: result[0].Email,
                    Address: result[0].Address,
                    Age: result[0].Age
                });
                console.log(result[0].Name);
            }
        });
    }
});
// listen to port 3000
// the function/method below runs whenever someone trires to reach this system on port 3000
app.listen(8080, () => {
    console.log('Express server started on port 8080');
});
