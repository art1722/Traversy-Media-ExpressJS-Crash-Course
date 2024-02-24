// Ref: geeksforgeeks

const express = require("express");
const path = require("path"); // a nodejs module to deal with file path
const exphbs = require('express-handlebars')

const app = express();

const members = require("./Members");




// This isn't ideal as we have to put a route manually for every single page
// If you want just a static server that serves just HTML CSS stuff
// Express comes with a functionality to make a folder a static folder
// like we can make this public folder static too
app.get('/demo1', (req, res) => {
    // (1.) res.send('<h1>Hello world</h1>');

    // (2.) we want to send file to the current directory
    // __dirname - get the current directory, go into a folder public, under a filename index.html
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



// (12) rendering templates using template engine
// template engine - ex express-handlebar
// Handlebars Middleware - so they'll know how to use handlebars
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set('view engine', 'handlebars');
// for the most part you're you're not really going to do this where you have a JSON API 
// - to have react or view on the frontend
// and also have server rendered templates
// - a complete server side app where you use templates
// it's usually going to be one or the other
// but in this file we're gonna show both of them
// NOTE: remember to put this before set static folder

// Homepage route - to render the index view
// you might have a form in one of the our HTML files that makes a post request whether it's to add to a
// database or something and then you know have like app.post('/contact') or
// NOTE: render can take a second parameter of object
app.get('/', (req, res) => {
    res.render("index", {
        title: "Member app",
        members
    }); // Pass someValue as data
});



// (13) create a form so we can make a request to our API
// to add a member from the form
// when dealing with template - you're gonna redirect - you're not gonna show JSON
// so we call res.redirect() instead of res.json



// (3) Set static folder
// this will set our 'public' folder to be a static folder
// now we set this directory as the root for serving static content
// so we just put the file in here and it will just work
app.use(express.static(path.join(__dirname, 'public')))




const logger = require("./middleware/logger");
// (5) (6) in order to initialize middleware - you have to include next();
// and to init we also do app.use();
// to test this go to post man and sent GET request 
// - everytime we make a request -> middleware is going to run
// - notice this function has to be before your app.get request in order to work
// now it will show in the console
app.use(logger);



// (4) For the most part, you're going to build a JSON api to connect from a frontend like react
// or you might want to render templates where you can insert dynamic data
// so you can create a dynamic app rather than just a static website
// so let's create a route
// create a simple REST api without dealing with a database
app.get('/api/members', (req, res) => {
    // return response -> members as JSON when we hit this route
    // so we can hit it with react or angular - we could hit it with postman
    // notice we don't have to do something like JSON.stringify - which also will convert param to JSON
    // as this function (res.json) will take care of it
    res.json(members);
});



// (7) get single member by ID (:id is a url parameter)
app.get('/api/members/:id', (req, res) => {
    // res.send(req.params.id);
    // member.id is a number
    // but req.params.id is a string
    // so we need to wrap using parseInt
    const found = members.some(member => member.id === parseInt(req.params.id));

    if (found) {
        // this will return 200 OK
        res.json(members.filter(member => member.id === parseInt(req.params.id)));
    } else {
        // (8) HTTP status -> 400 Bad request
        // They didn't give us the correct request information
        // res.status() to set the HTTP status
        // and we can use .json() to tack in some message
        res.status(400).json({ msg: `No member with the id of ${req.params.id}`});

    }
    
});



// (10) Body parser middleware - in this case to handle raw json
app.use(express.json());
// and to handle form submission - to handle url encoded data
app.use(express.urlencoded({ extended: false }));
// when sending a request matched with the route (9.1) /apirouter/members
// -> is routed to the (9.2) router.post in members -> (10) return the response



// (9) To be able to create a member
// we can use router to put all of our similar routes into a single file
// FOLDER: route -> api (cause not all routes are API where we're serving JSON
// we may have routes that are serving server side template)
// -> we implement route by adding second parameters to app.use()
// This line is: Members API Routes
app.use('/apirouter/members', require('./routes/api/members'))



const PORT = process.env.PORT || 5000;

// bind and listen to the connections on specific 'host' and 'port'
// >> app.listen(port[, host[, backlog]][callback])
// >>>> backlog specify the max length of the queue pending connections
// >>>> function to be executed once your app starts listening
app.listen(PORT, () => console.log(`Server start on port ${PORT}`));

