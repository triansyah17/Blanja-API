const Pool = require("../config/db");

const selectAll = () =>{
    return Pool.query("SELECT * FROM payment");
};

const insert = (id, paying) =>{
    return Pool.query(`insert into payment values(${id}, '${paying}')`);
};

const update = (id, paying) =>{
    return Pool.query(`UPDATE payment SET paying='${paying}' WHERE id=${id}`);
};

const deleted = (id) =>{
    return Pool.query(`DELETE FROM payment WHERE id=${id}`);
};

module.exports = { selectAll, insert, update, deleted };