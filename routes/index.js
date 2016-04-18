var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var async = require("async"); // to make more than one request at once

/* returns a dummy JSON from favorites collection*/
router.get('/getData', function(req, res) {
    var db = req.db
    var collection = db.get('favorites');
    collection.find({name: "Tool"},function(e,docs){
        if(docs){
            res.json(docs);
        }else{
            res.send(400, error);
        }
    });
});

/* GET restlist page. */
router.get('/band', function(req, res) {
    var db = req.db
    var collection = db.get('favorites');
    collection.find({},function(e,docs){
        if(docs){
            res.render('band', {
                "bandlist" : docs
            });
        }else{
            res.send(400, error);
        }
    });
});

/* GET New Band page. */
router.get('/newBand', function(req, res) {
    res.render('newBand', { title: 'Add New Band' });
});

/* POST to Add Band Service */
router.post('/band', function(req, res) {
    // Create a new ObjectID
    var objectId = new ObjectID();
    // Convert the object id to a hex string
    //var originalHex = objectId.toHexString();

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var name = req.body.name;

    // Set our collection
    var collection = db.get('favorites');

    // Submit to the DB
    collection.insert({
        "_id": objectId,// to create a new Id
        "name" : name
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("band");
        }
    });
});


/* GET to delete Band Service, delete the item by id */
router.get('/delete', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "id" attributes
    var id = req.query.id;

    // Set our collection
    var collection = db.get('favorites');

    // Submit to the DB
    collection.remove({
        "_id" : ObjectID(id)//its deleted by the Id
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("band");
        }
    });
});

//it's receive the id using the url and it makes two request at once
router.get('/edit', function(req, res) {
    var db = req.db
    var collection = db.get('favorites');

    // Get our form values. These rely on the "id" attributes
    var id = req.query.id,
        p = ObjectID.createFromHexString(id);

     async.parallel([
        function(callback){
            collection.find({"_id" : p }, function (err, data){
                callback(err, data);
            });
        },
        function(callback){
            collection.find({}, function (err, data){
                callback(err, data);
            });
        }
    ],
    function(err, results){
        console.log('tototy :'+results[0][0].name);
        
        //res.json(results)
        res.render('editBand', {
            "oldBand"  : results[0][0],//according with the order in the previous request the first position is the band to find by Id
            "bandlist" : results[1]//list of every band (object object ...)
        });
    });
});

/* GET to modify Band Service, modifying the item by id */
router.get('/update', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "id" attributes
    var id = req.query.id,
        name = req.query.name;

    console.log(id+"   /   "+name);
    // Set our collection
    var collection = db.get('favorites');

    // Submit to the DB
    collection.update(
        {"_id" : ObjectID(id)},//its updated by the Id
        { $set : { "name": name }}, function (err, doc) {
            if (err) {
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
            }
            else {
                // And forward to success page
                res.redirect("band");
            }
        },
    { upsert: true });
});

module.exports = router;