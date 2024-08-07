import express from 'express';
import productsRouter from './routes/products.router.js';

const PORT=8080;

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api/products", productsRouter)


const server=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});