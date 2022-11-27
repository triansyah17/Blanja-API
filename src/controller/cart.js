const cartModel = require("../models/cart");
const {v4: uuid4} = require("uuid")
const commonHelper = require('../helper/common')

const cartControllers = {
    allCart : (req, res, next)=>{
        const {id} = req.decoded
        cartModel.transaksiDetail(id)
        .then(result => {
            // console.log(result)
            res.json(result.rows)
        })
        .catch(err => {
            console.log(err)
            res.send(err) });
    },
    insert : (req, res) =>{
        const { product_id, user_id } = req.body;
        const data = {
            id: uuid4(),
            product_id,
            user_id,
            qty: 1
        }
        cartModel.insert(data)
        .then(res.json("add Bag"))
        .catch(err => res.send(err));
    },
    add : async(req, res) =>{
        try {
            const id = req.params.id;
            // console.log(id)
            const qty = await cartModel.selectQty(id)
            // console.log(qty.rows)
    
            let add = Number(qty.rows[0].qty) + 1
            // const { qty } = req.body;
            cartModel.update(id, add)
            .then(res.json("add qty"))
            
        } catch (error) {
            console.log(error)
            // .catch(err => res.send(err));
            
        }
    },
    min : async(req, res) =>{
        try {
            const id = req.params.id;
            console.log(id)
            const qty = await cartModel.selectQty(id)
            console.log(qty.rows)
    
            let add = Number(qty.rows[0].qty) - 1
            console.log(add)
            if(add > 0){
                cartModel.update(id, add)
                .then(res.json("add qty"))
            }else{
                commonHelper.response(res, null, 200, 'minimal buying 1 qty')
            }
            
        } catch (error) {
            console.log(error)
            // .catch(err => res.send(err));
            
        }
    },
    delete : async(req, res) =>{
        try {
            const id = req.params.id;
            const result = await cartModel.deleted(id)
            commonHelper.response(res, result, 200, 'deleted')
        }catch (error) {
            console.log(error)
        }
    }
};

module.exports = cartControllers;