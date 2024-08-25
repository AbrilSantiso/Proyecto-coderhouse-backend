import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import homeRouter from "./routes/home.router.js"
import realTimeProductsRouter from "./routes/realTimeProducts.router.js"
import {engine} from "express-handlebars"
import {Server} from "socket.io"


const PORT=8080;

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")
app.use("/api/carts", cartsRouter)
app.use("/products", homeRouter)
app.use("/realtimeproducts", realTimeProductsRouter)

app.use(express.static('./src/public'));


const server=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});
export const io=new Server(server)
app.use("/api/products", productsRouter(io))

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });

});