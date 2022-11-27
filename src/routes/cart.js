const express = require("express");
const router = express.Router();
const cartControllers = require("../controller/cart");
const {protect} = require('../middlewares/auth')


router.get("/",protect, cartControllers.allCart);
router.post("/",cartControllers.insert);
router.put("/add/:id", cartControllers.add);
router.put("/min/:id", cartControllers.min);
router.delete("/:id", cartControllers.delete);


module.exports = router;