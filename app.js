const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

//const rootDir = require('./util/path');

const { get404 } = require("./controllers/errors");
const sequelize = require("./util/database"); //database connect
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

//express app
const app = express();

//use templating engine
app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin"); //import admin routes
const shopRoutes = require("./routes/shop");
const res = require("express/lib/response");

//body parser
app.use(bodyParser.urlencoded({ extended: false }));

//access files statically
app.use(express.static(path.join(__dirname, "public"))); //access css, images, js and other files

// add middleware
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user; //get user id
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes); //use the admin router
app.use(shopRoutes); //use the shop router

//404 pages
app.use(get404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" }); //user created this product (like add to cart)
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

//call the sequelize obj here and create table
sequelize
  .sync()
  //.sync({ force: true })
  .then((result) => {
    return User.findByPk(1);
    //server
  })
  .then((user) => {
    if (!user) {
      User.create({ name: "Max", email: "test@test.com" });
    }
    return user;
  })
  .then((user) => {
    //console.log(user);
    return user.createCart();
  })
  .then((cart) => {
    //listen to server
    app.listen(3000);
  })
  .then(() => {
    res.redirect("/cart");
  })
  .catch((err) => {
    err;
  });
