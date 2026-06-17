const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const usersRoutes = require("./usersRoutes");
const specialtiesRoutes = require("./specialtiesRoutes");
const doctorsRoutes = require("./doctorsRoutes");
const patientsRoutes = require("./patientsRoutes");
const appointmentsRoutes = require("./appointmentsRoutes");
const obrasSocialesRoutes = require("./OSRoutes");

/**
 * @module IndexRoutes 
 * @description Enrutador central de la API
 */

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/specialties", specialtiesRoutes);
router.use("/doctors", doctorsRoutes);
router.use("/patients", patientsRoutes);
router.use("/appointments", appointmentsRoutes);
router.use("/obras-sociales", obrasSocialesRoutes);

module.exports = router;