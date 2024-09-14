import { Router } from 'express';
import  ProductsManager  from '../dao/ProductsManager2.js';
export const router=Router()

router.get('/',async(req,res)=>{

    let products=await ProductsManager.getProducts()
    let result = {
        status: "success" ,
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage ? `http://localhost:8080/api/products?page=${products.prevPage}` : null,
        nextLink: products.hasNextPage ? `http://localhost:8080/api/products?page=${products.nextPage}` : null,
      }

    res.setHeader('Content-Type','text/html')
    res.status(200).render("home",{
        products: products.docs,
        data: result
    })
})

export default router