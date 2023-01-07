const express = require('express')
const urlController = require('../controller/urlController')

const router = express.Router();


router.post("/url/shorten", urlController.urlShorter)
router.get("/:urlCode", urlController.redirectUrl)



router.all("/****", function (req, res) {
    return res.status(404).send({
        status: false,
        message: "Make Sure Your Endpoint is Correct or Not!"
    })
})


module.exports = router