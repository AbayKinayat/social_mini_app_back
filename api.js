const { Router } = require("express");
const auth = require("./api/auth.api");

const router = Router();

router.use("/auth", auth);

module.exports = router;