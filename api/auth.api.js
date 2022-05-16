const { Router } = require("express");
const controller = require("../controller/auth.controller");
const router = Router();

router.post("/", controller.auth); 
router.post("/registration", controller.registration);
router.post("/logout", controller.logout);  
router.get("/refresh", controller.refresh);  

module.exports = router;
