const paymentModel = require("../models/payment");

const paymentController = {
    allPayment : (req, res) =>{
        paymentModel.selectAll()
        .then(result =>res.json(result.rows))
        .catch(err => res.send(err));
    },
    insert: (req, res) =>{
        const { id, paying } = req.body;
        paymentModel.insert(id, paying)
        .then(res.json("created payment"))
        .catch(err => res.send(err));
    },
    update : (req, res) =>{
        const id = Number(req.params.id);
        const paying = req.body.paying;
        paymentModel.update(id, paying)
        .then(res.json("Updated Payment"))
        .catch(err => res.send(err));
    },
    delete : (req, res) =>{
        const id = req.params.id;
        paymentModel.deleted(id)
        .then(res.json("deleted payment"))
        .catch(err => res.send(err));
    }
};

module.exports = paymentController;