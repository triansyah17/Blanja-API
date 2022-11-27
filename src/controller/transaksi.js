const transaksiModel = require("../models/transaksi")
const { v4 : uuid4 } = require('uuid')
const commonHelper = require('../helper/common')


const transakasiController = {
    allTransaksi: async(req, res)=>{
        try{
            const currentPage = Number(req.query.currentPage) || 1;
            const numberPerPage = Number(req.query.numberPerPage) || 5;
            const startPages = (currentPage - 1) * numberPerPage;
            const sortby = req.query.sortby || "id";
            const sort = req.query.sort || "ASC";
            const result = await  transaksiModel.selectAll(numberPerPage,startPages,sort,sortby);
            const {rows: [count]} = await transaksiModel.countTransaksi();
            const totalData = parseInt(count.count);
            const totalPages = Math.ceil(totalData/numberPerPage);
            res.status(200).json({
              pagination:
                      {
                        currentPage: currentPage,
                        numberPerPage: numberPerPage,
                        totalData: totalData,
                        totalPages: totalPages
                      },
                        data:result.rows,
                      });
        }catch(err){
            console.log(err);
        }
    },
    getTransaksi : (req, res) =>{
      // const id = req.params.id; 
      transaksiModel.All()
      .then(result => res.json(result.rows))
      .catch(err => res.send(err));
    },
    insert: (req, res) =>{
      const { transaksi_status, shipping_price, total_price, id_user, id_product, quantity, paymen } = req.body;
      const id = uuid4()
      const data = {
        id, 
        transaksi_status, 
        shipping_price, 
        total_price, 
        id_user, 
        id_product, 
        quantity, 
        paymen
      }
      transaksiModel.insert(data)
      .then(result => commonHelper.response(res, data, 200, "succes"))
      .catch(err => res.send(err));
    },
    update: (req, res) =>{
      const id = req.params.id;
      const { transaksi_status, shipping_price, total_price, id_user, id_product, quantity, paymen } = req.body;
      const data = {
        id,
        transaksi_status, 
        shipping_price, 
        total_price, 
        id_user, 
        id_product, 
        quantity, 
        paymen
      }
      transaksiModel.update(data)
      .then(res.json("Updated transaksion"))
      .catch(err => res.send(err.message));
    },
    delete: (req, res) =>{
      const id = req.params.id;
      transaksiModel.deleteTransaksi(id)
      .then(res.json("Deleted transaksi"))
      .catch(err => res.send(err));
    }
};



module.exports = transakasiController;