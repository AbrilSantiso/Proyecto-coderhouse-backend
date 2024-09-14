import { Router } from 'express';
import  ProductsManager  from '../dao/ProductsManager2.js';
export const router=Router()

router.get('/:cid',async(req,res)=>{
    let { cid } = req.params;

    await fetch(`http://localhost:8080/api/carts/${cid}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
            res.setHeader('Content-Type','text/html')
            res.status(200).render("cart",{
                cart: data.payload
            })
        })
        .catch((error) => {
          console.error("Error al cargar los productos:", error);
        });

    
})

export default router