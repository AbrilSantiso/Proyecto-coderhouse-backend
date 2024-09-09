import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2"

const productSchema=new mongoose.Schema(
    {
        title: String, 
        code: {
            type: String, unique: true
        }, 
        description: String, 
        price: Number, 
        stock: Number, 
        category: String, 
        thumbnails: [String]
    },
    {
        timestamps:true
    }
)

productSchema.plugin(paginate)

export const productsModel=mongoose.model(
    "products", productSchema
)