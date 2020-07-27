//Peyton

var express = require('express')
var path = require('path');
var ejs = require('ejs');
var bodyparser = require('body-parser');
var Blockchain = require('./blockchain');
var app =express()
const carTitle = new Blockchain();


app.set("view engine","ejs");
app.use(bodyparser.urlencoded({
    extended: true
}))

//Homepage of the application
app.get('/', function (req, res) {
    console.log("client request");
    res.render("Home.ejs");//Renders the Home.ejs page on the web browser
})

//Opens when when the user hit the "Exchange" button at the top
app.get('/exchange', function(req, res){
    console.log("exchange request");
    res.render("exchange.ejs");//Renders the exchange.ejs page on the web browser
})


//Opens when the user hits the "Your Owned Titles" button at the top
app.get('/search', function(req,res){
    console.log("search")
    res.render("search.ejs"); //Renders the search.ejs page on the web browser
})

//Posts once the user enter SSnum on search.ejs page
app.post("/results", function (req,res){
    var Snum = req.body.SSnum; //Gets the SSnum from the search.ejs page

    //Gets the index from the searchChain function
    index = searchChain(Snum);

    //Uses the index to get the transaction data for
    transaction = carTitle.getTransactionData(index);

    //Stores all the transaction data as variables 
    var SSnum = transaction[0].SSnum;
    var make= transaction[0].make;
    var model= transaction[0].model;
    var year = transaction[0].year;
    var odometer= transaction[0].odometer;
    var Sname= transaction[0].Sname;
    var Rname= transaction[0].Rname;
    var message= transaction[0].message;

    //Renders the page with all the variables as arguments
    res.render("results.ejs", {SSnum:SSnum, make: make, model: model, year: year, odometer: odometer,
        Sname: Sname, Rname: Rname, message: message});
})

//Pulls up "done.ejs" after user confirms 
app.get('/complete', function (req, res) {
    res.render("done");     //renders done.ejs page

    prevHash = carTitle.chain[carTitle.chain.length -1].previousBlockHash; //pulls prevoius hash from the

    curBlockData = carTitle.pendingTransaction[carTitle.chain.length -1] //pulls the transaction block made last page

    nonce = carTitle.proofOfWork(prevHash, curBlockData); //Runs proof of work to get nonce

    hash = carTitle.hashBlock(prevHash, curBlockData, nonce); //Runs hashBlock 

    carTitle.createNewBlock(nonce,prevHash,hash) //Finally processes block

    console.log(carTitle)
})


//Pulls up "confirmation.ejs" after fourm on home page is filled out
app.post('/posttransaction', function(req,res){
    
    //Pulls all the variables from the exchange.ejs page and stores them as variables 
    var SSnum= req.body.SSnum;
    var make= req.body.make;
    var model= req.body.model;
    var year = req.body.year;
    var odometer= req.body.odometer;
    var Sname= req.body.Sname;
    var Rname= req.body.Rname;
    var message= req.body.message;

    //Renders Confirmation.ejs
    res.render("confirmation", {SSnum:SSnum, make: make, model: model, year: year, odometer: odometer,
                                 Sname: Sname, Rname: Rname, message: message});
                                 
    //Creates new pending transaction waiting to be proccessed through POW and Creation
    carTitle.createNewTransaction(SSnum, make, model, year, odometer, Sname, Rname,message);   
})

//Uses a given SSnum as an argument and returns the index of the block with that SSnum in the transaction data
function searchChain(SSnum){
    for(var i = 1;i<carTitle.chain.length;i++){
        if (SSnum == carTitle.getTransactionSSnum(i)){
            return i;
        }
        else {return null;}
    }
}

var port =3000;
app.listen(port, function () {
    console.log(`listening on port ${port}...`)
})

