import { Router } from 'express';
import  ProductsManager  from '../dao/ProductsManager.js';
export const router=Router()

router.get('/',async(req,res)=>{

    let products=await ProductsManager.getProducts()

    res.setHeader('Content-Type','text/html')
    res.status(200).render("layouts/realTimeProducts",{
        products
    })
})

export default router