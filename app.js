const express = require("express");
const bodyParser = require('body-parser');
const { render } = require("ejs");
const app = express();
const morgan = require("morgan");

// Models
const items = require("./models/productModel");
const cart = require("./models/cartModel")
// Database Connect
require('./config/db')

// Port
const port = 8000


// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.json())
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(morgan('dev'));


// Render Add Product 
app.get("/additem",(req, res)=>{
    res.render("addItem")
})

// Add Item
app.post("/additem", async(req,res)=>{
    const {title, price} = req.body;
    const item = new items({
        title,
        price
    });
    const Productsave = await item.save();
    res.redirect("/")
})


// Get All Item
app.get("/", async(req, res)=>{
    const allitems = await items.find({})
    res.render("home",{allitems: allitems })
 })

//  Edit Page
 app.get("/edit", async(req, res)=>{
    const allitems = await items.find({})
    res.render("editpage",{allitems: allitems })
 })

//  Edit item according to the id
app.get("/edititem/:id", async(req, res)=>{
    const {id} = req.params;
    const item = await items.findById({_id:id});
    if(item==null){
        res.redirect('editpage')
    }else{
        res.render("edititem",{
            item:item
        })
    }
 })

//  Update item detail
app.post("/update/:id", async(req,res)=>{
    const {id} = req.params;
    const {title, price} = req.body;
    const item = await items.findByIdAndUpdate({_id:id}, {title,price}, {new:true})
    res.redirect("/edit")
})


// Cart Page
app.get("/cart", async(req, res)=>{
    const allitems = await cart.find({})
    res.render("cartpage",{ allitems: allitems })
 })


//  Add TO Cart
app.get("/addcart/:id", async(req, res)=>{
    const {id} =req.params;
    const item = await items.findById({_id:id});
    title = item.title;
    price = item.price;
    const additem = new cart({
        title,
        price
    });
    const itemsave = await additem.save();
    res.redirect("/cart") 
})

// Remove Item from Cart
app.get("/deleteCart/:id", async(req, res)=>{
    const {id} =req.params;
    const deleteitem = await cart.findByIdAndDelete({_id:id});
    res.redirect("/cart") 
})

app.listen(port, ()=>{
    console.log(`listening to the ${port}`);
})