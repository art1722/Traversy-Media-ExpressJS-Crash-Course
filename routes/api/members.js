const express = require("express");
const uuid = require("uuid");
const router = express.Router();

const members = require("../../Members"); // .. is to go outside of this api folder

// (9) Router
// we use router from express.Router();
// instead of using app from express();
router.get('/', (req, res) => res.json(members));

router.get('/:id', (req, res) => {
    const found = members.some(member => member.id === parseInt(req.params.id));

    if (found) {
        res.json(members.filter(member => member.id === parseInt(req.params.id)));
    } else {
        res.status(400).json( { msg: `No members with the id of ${req.params.id}`});
    }
});



// (10) create members - handle a post request
// whether it's a form submission or a fetch API or Axios or something
// we can use the same route as long as they're different methods
// we want to be able to send data, and when we get that data it's in the request object

// e.g. SENDING: header: Content-Type -> application/json
// body: raw -> content
// to parse the data we're sending in the body - use body parser
// with older version of express: you still have to install a third party package body parser
// with newer version: just initialize it with middleware
router.post('/', (req, res) => {
    // When dealing with IDs in a database like MongoDB, MySQL, Postgres
    // They usually create an ID for you
    // But if you're not using a database - install something like UUID to generate random ID
    const newMember = {
        id: uuid.v4(),
        name: req.body.name,
        email: req.body.email,
        status: "active"
    };

    // make sure that name and email are sent with the request
    if (!newMember.name || !newMember.email) {
        // if we don't do return and do and else in if else here
        // error -> header are already set (so we have to include return)
        return res.status(400).json({ msg:"Please include a name and email" });
    }

    members.push(newMember);

    // you can response with the new member itself
    // or you can just return the entire members array that include the new one

    // (13) create a form so we can make a request to our API
    // to add a member from the form
    // when dealing with template - you're gonna redirect - you're not gonna show JSON
    // so we call res.redirect() instead of res.json
    res.json(members);
    //res.redirect('/');

    // as far as authentication: for the most part - you'll have some kind of database
    // let's say mongoDB with mongoose
    // you're gonna create a user 's with a login, a register, 
    // and if you're building a fullstack app like you have view or react on the frontend
    // you're probably going to deal with json web tokens
    // where you pass a token back and forth to authenticate

    // if you're using a template engine like we're doing here
    // you can use passportjs
    // in fact you can use passport with a fullstack as well
    // >> passport-local is what you're gonna use if you're dealing with just express
    // just a server side app
    // e.g. myrn stack...
    // KW: there's no built in authentication


});



// (11) to update a members - when you're dealing with a real API
// you'll have a database
// you're not just going to have a file with your data and the author don't want to get into that because
// the author just want to stick with express as much as I can
// if you install a package like mongoose which is an object relational / object data mapper for mongoDB
// instead of members.push() -> you might do sth like members.save(newMember)
router.put('/:id', (req, res) => {
    const found = members.some(member => member.id === parseInt(req.params.id));

    if (found) {
        const updMember = req.body; // get the name and email from req.body

        // then loop through the id -> check to see if it matches this ID
        // if it does -> update
        members.forEach(member => {
            if (member.id === parseInt(req.params.id)) {
                member.name = updMember.name ? updMember.name : member.name;
                member.email = updMember.email ? updMember.email : member.email;

                res.json({ msg: "Member updated", member }) // this is equal to member: member
            }
        });

    } else {
        res.status(400).json( { msg: `No members with the id of ${req.params.id}`});
    }
});



// (12) delete member
router.delete('/:id', (req, res) => {

    const found = members.some(member => member.id === parseInt(req.params.id));

    if (found) {
        res.json({
            msg: "Member deleted",
            members: members.filter(member => member.id !== parseInt(req.params.id))
        });
    } else {
        res.status(400).json({ msg:"Member not found" })
    }

});

module.exports = router;