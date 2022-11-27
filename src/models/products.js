const Pool = require('../config/db');

const selectAll = ({ limit, offset, sort, sortby, querySearch }) => {
  return Pool.query(`SELECT product.id, product.name , product.price, product.stock, product.description,
  product.merk, product.photo, product.condition, category.name AS categori, toko.name AS toko
  FROM product ${querySearch} ORDER BY product.name ${sort} LIMIT ${limit} OFFSET ${offset}`)
}


const select = (id) => {
  return Pool.query(`SELECT product.id, product.name , product.price, product.stock, product.description,
  product.merk, product.photo, product.condition, category.name AS categori, toko.name AS toko FROM product LEFT JOIN category on product.id_category = category.id 
  LEFT JOIN toko ON product.id_toko = toko.id WHERE product.id=$1`,[id])
}

const insert = (data) => {
  const { id, name, stock, price, id_category, merk, id_toko, photo, description, condition } = data
  return Pool.query(`INSERT INTO product(id, name,  stock, price, id_category,  description, photo, merk, condition, id_toko) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, [id, name, stock, price, id_category, description, photo, merk, condition, id_toko])
}

const update = (data) => {
  const { id,name,stock,price, id_category, id_toko, photo, description, merk} = data
  return Pool.query(`UPDATE product SET name=$1, stock=$2, price=$3, photo=$4 ,description=$5, id_category=$6, id_toko=$7,
  merk=$8  WHERE id=$9`, [name, stock, price, photo, description, id_category, id_toko, merk, id])
}

const deleteData = (id) => {
  return Pool.query(`DELETE FROM product WHERE id=$1`,[id])
}

const countData = () =>{
  return Pool.query('SELECT COUNT(*) FROM product')
}

const findId =(id)=>{
  return new Promise ((resolve,reject) => 
  Pool.query(`SELECT * FROM product WHERE id=$1`,[id],(error,result)=>{
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
  // searching
}
