const Pool = require('../config/db');

const AllCategory = () => {
  return new Promise((resolve, reject) =>{
    Pool.query(`SELECT * FROM category`, (err, result) =>{
      if(!err){
        resolve(result)
      }else{
        reject(err)
      }
    })
  })
  return Pool.query(`SELECT * FROM category ${querySearch} ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`)
}

const selectAll = ({ limit, offset, sort, sortby, querySearch }) => {
  return Pool.query(`SELECT product.id, product.name , product.price, product.stock, product.description,
  product.merk, product.photo, product.condition, category.name AS categori, toko.name AS toko
  FROM product ${querySearch} ORDER BY product.name ${sort} LIMIT ${limit} OFFSET ${offset}`)
}

const searching = (search) =>{
  return Pool.query( "SELECT * FROM category WHERE name ILIKE $1", [`%${search}%`] );
};
const select = (id) => {
  return Pool.query(`SELECT * FROM category WHERE id='${id}'`)
}
const insert = (id, name) => {
  return Pool.query(`INSERT INTO category(id,name) VALUES ('${id}','${name}')`)
}
const update = (id, name) => {
  return Pool.query(`UPDATE category SET name='${name}' WHERE id='${id}'`)
}
const deleteData = (id) => {
  return Pool.query(`DELETE FROM category WHERE id='${id}'`)
}

const countData = () =>{
  return Pool.query('SELECT COUNT(*) FROM category')
}

const findId =(id)=>{
  return  new Promise ((resolve,reject)=> 
  Pool.query(`SELECT id FROM category WHERE id='${id}'`,(error,result)=>{
    if(!error){
      resolve(result)
    }else{
      reject(error)
    }
  })
  )
}

module.exports = {
  selectAll,
  select,
  insert,
  update,
  deleteData,
  countData,
  findId,
  searching,
  AllCategory
}
