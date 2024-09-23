"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var router = (0, express_1.Router)();
router.get("/", function (req, res) {
    try {
        res.json({
            success: true,
            time_stamp: Date.now(),
            message: "Assignment_Ragilly server up and running"
        });
    }
    catch (err) {
        res.json({ Error: err });
    }
});
exports.default = router;
