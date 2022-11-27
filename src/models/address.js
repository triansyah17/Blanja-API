const db = require('../config/db')

const modelsAddress = {
    insert: ({id, address, user_id}) =>{
        return new Promise((resolve, reject) =>{
            db.query(`INSERT INTO address(id, address, user_id) VALUES($1, $2, $3)`, [id, address, user_id],(err, result) =>{
                if(err){
                    reject(err)
                }else{
                resolve(result)
                }
            })
        })
    },
    update: ({ address, user_id}) =>{
        return new Promise((resolve, reject) =>{
            db.query(`UPDATE address SET address = $1 WHERE user_id = $2`, [ address, user_id],(err, result) =>{
                if(err){
                    reject(err)
                }else{
                resolve(result)
                }
            })
        })
    },
    getAddress: (user_id) =>{
        return new Promise((resolve, reject) =>{
            db.query(`SELECT * FROM address WHERE user_id = $1`, [user_id], (err, result) =>{
                if(err){
                    reject(new Error(err))
                }else{
                    resolve(result)
                }
            })
        })
    }
}

module.exports = modelsAddress