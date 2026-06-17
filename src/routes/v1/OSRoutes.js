const express = require("express");
const router = express.Router();
const Roles = require("../../utils/Roles");
const obrasSocialesController = require("../../controllers/OSController");
const { verifyToken } = require("../../middlewares/authMiddleware");
const { RestrictTo: restrictTo } = require("../../middlewares/roleMiddleware");
const { validateOS } = require("../../middlewares/OSValidator");

/**
 * @module ObrasSocialesRoutes
 * @description Endpoints seguros para la administración de obras sociales de la clínica.
 */

router.get("/", verifyToken, obrasSocialesController.getAll);
router.get("/:id", verifyToken, obrasSocialesController.getById);
router.post(
    "/",
    verifyToken,
    restrictTo(Roles.ADMIN),
    validateOS,
    obrasSocialesController.add
);
router.put(
    "/:id",
    verifyToken,
    restrictTo(Roles.ADMIN),
    validateOS,
    obrasSocialesController.modify
);
router.delete(
    "/:id",
    verifyToken,
    restrictTo(Roles.ADMIN),
    obrasSocialesController.softDelete
);

module.exports = router;