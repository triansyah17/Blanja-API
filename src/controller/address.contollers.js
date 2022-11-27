const { v4: uuidv4 } = require('uuid')
const modelsAddress = require('../models/address')
const commonHelper = require('../helper/common')


const controllersAddress = {
    create: async(req, res, next) =>{
        try {
            const id_user = req.decoded.id
            const { address } = req.body
            const data = {
                id: uuidv4(),
                address,
                user_id: id_user
            }
            await modelsAddress.insert(data)
            commonHelper.response(res, data, 200, 'success add address')

        } catch (error) {
            console.log(error)
        }
    },
    updateAddress: async(req, res, next) =>{
        try {
            const id_user = req.decoded.id
            const { address } = req.body
            const data = {
                address,
                user_id: id_user
            }
            await modelsAddress.update(data)
            commonHelper.response(res, data, 200, 'success update address')

        } catch (error) {
            console.log(error)
        }
    },
    getAddressUser : async(req, res, next) =>{
        try {
            const user_id = req.decoded.id
            const result = await modelsAddress.getAddress(user_id)
            commonHelper.response(res, result.rows, 200, 'success get Address')
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = controllersAddress;