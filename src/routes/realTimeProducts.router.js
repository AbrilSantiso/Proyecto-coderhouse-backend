import { Router } from 'express';
import  ProductsManager  from '../dao/ProductsManager2.js';
export const router=Router()

router.get('/',async(req,res)=>{

    let products=await ProductsManager.getProducts()

    res.setHeader('Content-Type','text/html')
    res.status(200).render("realTimeProducts",{
        products: products.docs
    })
})

export default router