if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const port = process.env.port || 3000;
const fs = require("fs");
const express = require("express");
const stripe = require("stripe")(stripeSecretKey);
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

app.get("/store", (req,res)=>{
    fs.readFile("items.json", (error,data)=>{
        if(error){
            res.status(500).end("error");
        }else{
            res.render("store", {
                items: JSON.parse(data),
                stripePublicKey: stripePublicKey
            })
        }
    })
})

app.post("/create-checkout-session", async(req,res)=>{
    console.log("post request received");
    console.log(req.body.finalItems);
    const session = await stripe.checkout.sessions.create({
        success_url: "http://localhost:3000/success.html",
        cancel_url: "http://localhost:3000/cancel.html",
        payment_method_types: ["card"],
        line_items: req.body.finalItems,
        mode: 'payment',
        shipping_address_collection: {allowed_countries: ["IN"]}
    })
    res.send({id:session.id});
    console.log(line_items);
    console.log(id);
})

app.listen(3000);