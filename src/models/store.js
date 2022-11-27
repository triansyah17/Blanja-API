const db = require('../config/db');

const StoreModel = {
    insert: ({id, name, email, phonenumber, user_id, description}) =>{
        return new Promise((resolve, reject) =>{
            db.query(`INSERT INTO toko(id, name, email, phonenumber, user_id, description) VALUES($1, $2, $3, $4, $5, $6)`,[id, name, email, phonenumber, user_id, description], (err, result) =>{
                if(!err){
                    resolve(result)
                }else{
                    reject(err)
                }
            })
        })
    },
    getAll : () =>{
        return new Promise((resolve, reject) =>{
            db.query(`SELECT * FROM toko`, (err, result) =>{
                if(err){
                    reject(new Error(err))
                }else{
                    resolve(result.rows)
                }
            })
        })
    },
    getById: (id) =>{
        return new Promise((resolve, reject) =>{
            db.query(`SELECT * FROM toko WHERE user_id= $1`,[id], (err, result) =>{
                if(err){
                    reject(err)
                }else{
                    resolve(result)
                }
            })
        })
    },
    update: ({name, description, photo, email, phonenumber, id}) =>{
        return new Promise((resolve, reject) =>{
            db.query(`UPDATE toko SET name =$1, description=$2, phonenumber=$3, email=$4, photo=$5 WHERE user_id = $6`, [name, description, phonenumber, email, photo, id], (err, result) =>{
                if(!err){
                    resolve(result)
                }else{
                    reject(new Error(err))
                }
            })
        })
    }
}

module.exports = StoreModel;