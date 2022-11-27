const createError = require("http-errors");
const { v4: uuid4 } = require("uuid");
const {
  selectAll,
  select,
  countData,
  findId,
  insert,
  update,
  deleteData,
  searching,
} = require("../models/products");
const commonHelper = require("../helper/common");
// const client = require('../config/redis')
const {
  uploadGoogleDrive,
  uploadGoogleDriveProduct,
} = require("../utils/uploadGoogleDrive");
const deleteFile = require("../utils/delete");
const deleteDrive = require("../utils/deleteDrive");

const productController = {
  getAllProduct: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "name";
      const sort = req.query.sort || "ASC";
      const {
        rows: [count],
      } = await countData();
      const search = req.query.search;
      let querySearch;
      if (search) {
        querySearch = `LEFT JOIN category on product.id_category = category.id 
          LEFT JOIN toko ON product.id_toko = toko.id
          where product.name ILIKE '%${search}%'`;
      } else if (search === undefined || search === "") {
        querySearch = `LEFT JOIN category on product.id_category = category.id 
        LEFT JOIN toko ON product.id_toko = toko.id`;
      }
      // const cari = querySearch.toLowerCase();

      const result = await selectAll({
        limit,
        offset,
        sort,
        sortby,
        querySearch,
      });
      const totalData = parseInt(count.count);
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        currentPage: page,
        limit: limit,
        totalData: totalData,
        totalPage: totalPage,
      };
      commonHelper.response(
        res,
        result.rows,
        200,
        "get data success",
        pagination
      );
    } catch (error) {
      console.log(error);
    }
  },
  // searching: (req, res)=>{
  //   const search = req.query.search ||"";
  //       searching(search)
  //       .then(result => res.json(result.rows))
  //       .catch(err => res.send(err));
  // },
  getProduct: (req, res) => {
    const id = req.params.id;
    select(id)
      .then((result) => {
        // client.setEx(`product/${id}`, 60 * 60,JSON.stringify(result.rows))
        commonHelper.response(
          res,
          result.rows,
          200,
          "get data success from database"
        );
      })
      .catch((err) => res.send(err));
  },
  insertProduct: async (req, res) => {
    const urls = [];
    const files = req.files.image;
    console.log(files);
    for (let file of files) {
      const result = await uploadGoogleDriveProduct(file);
      console.log(result);
      await deleteFile(file.path);
      urls.push(result);
    }
    const {
      name,
      stock,
      price,
      merk,
      description,
      id_category,
      id_toko,
      condition,
    } = req.body;
    const id = uuid4();

    const data = {
      id,
      name,
      description,
      stock,
      price,
      merk,
      condition,
      id_category,
      id_toko,
      photo: urls.map(
        (url) => `https://drive.google.com/thumbnail?id=${url.id}&sz=s1080`
      ),
    };
    insert(data)
      .then((result) =>
        commonHelper.response(res, data, 201, "Product created")
      )
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  },
  updateProduct: async (req, res) => {
    try {
      const id = req.params.id;
      console.log(id);
      const { rowCount, rows } = await findId(id);
      console.log(rows[0].photo);
      const { name, stock, price, id_category, merk, id_toko, description } =
        req.body;
      const urls = [];
      const files = req.files.image;
      let img;
      if (!rowCount) {
        return next(createError(403, "ID is Not Found"));
      }
      if (files) {
        if (rows.photo) {
          for (let img of rows.photo) {
            let id_drive = img.split("id=")[1].split("&sz")[0];
            console.log("ini photo", img);
            await deleteDrive(id_drive);
            // let link_drive = img.split('id=')[1]
            // let id_drive = link_drive.split("&sz")[0]
            // await deleteDrive(id_drive)
          }
        }
        for (let file of files) {
          img = await uploadGoogleDrive(file);
          console.log(file);
          await deleteFile(file.path);
          urls.push(img);
        }
      }
      console.log(urls);
      const data = {
        id,
        name,
        description,
        stock,
        price,
        merk,
        id_category,
        id_toko,
        photo: urls.map(
          (url) => `https://drive.google.com/thumbnail?id=${url.id}&sz=s1080`
        ),
      };
      update(data)
        .then((result) =>
          commonHelper.response(res, data, 200, "Product updated")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
  deleteProduct: async (req, res, next) => {
    try {
      const id = req.params.id;
      const { rowCount, rows } = await findId(id);
      if (!rowCount) {
        return next(createError(403, "ID is Not Found"));
      }
      console.log(rows);
      // if(rows){
      //   if(rows.photo){
      //   }
      // }
      for (let img of rows[0].photo) {
        let link_drive = img.split("id=")[1].split("&sz")[0];
        console.log(link_drive);
        await deleteDrive(link_drive);
      }
      deleteData(id)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Product deleted")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = productController;
