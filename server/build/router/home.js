"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
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
