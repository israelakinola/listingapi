/********************************************************************************
* WEB422 – Assignment 1
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Israel Akinola Student ID: 123101172 Date:May 14, 2024
*
* Published URL: 
*
********************************************************************************/



const express = require('express'); // "require" the Express module
var cors = require('cors')
const app = express(); // obtain the "app" object
const HTTP_PORT = process.env.PORT || 8080; // assign a port
const ListingsDB = require("./modules/listingsDB.js");
const db = new ListingsDB();
app.use(express.static(__dirname + '/public'));

require('dotenv').config()


app.use(cors()) 
app.use(express.json()) //Allow JSON to be passed in the Req body

app.get('/', (req, res) => {
    const data ={
        message : "API Listening"
    }
    res.send(data);
  });


app.post('/api/listings', (req, res)=>{
    const data = req.body;
    db.addNewListing(data).then((listing)=>{
        res.status(201).json(listing)
    })
    .catch((err)=>{
        res.status(500).json({error:err.message})
    })
});

app.get("/api/listings", (req, res)=>{
    const {page, perPage, name} = req.query;
    db.getAllListings(Number(page), Number(perPage), name).then((listings)=>{
        res.json(listings);
    })
    .catch((err)=>{
        res.status(501).json({error: err.message});
    })
});

app.get("/api/listings/:id", (req,res)=>{
    db.getListingById(req.params.id).then((listing)=>{
        if(listing){
            res.json(listing);
        }
        else{
            res.status(404).json({Error: "Listing not found"});
        }

    })
    .catch((err)=>{
        res.status(501).json({error: err.message});
    })
})


app.put("/api/listings/:id", (req, res)=>{
    db.updateListingById(req.body, req.params.id).then((listing)=>{
        if(listing){
            res.json(listing);
        }
        else{
            res.status(404).json({Error: "Listing not found"});
        }
    })
    .catch((err)=>{
        res.status(501).json({Error: err.message})
    });
});

app.delete("/api/listings/:id", (req, res)=>{
    db.deleteListingById(req.params.id).then(()=>{
       res.status(204).send();
    })
    .catch((err)=>{
        res.status(501).json({Error: err.message})
    })
})

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    // start the server on the port and output a confirmation to the console
    app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
}).catch((err)=>{
    console.log(err);
})

