const koa=require('koa')
const router=require('./router')
const middleware=require('./middleware')
const path = require("path");
const fs = require("fs");
const sequelize=require('./db')
const port = 3000;
const app = new koa();

middleware(app)
router(app)
app.listen(port, () => console.log(`Example app listening on port:${port}`));