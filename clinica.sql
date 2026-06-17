CREATE DATABASE  IF NOT EXISTS `clinica_prog3` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `clinica_prog3`;
-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: clinica_prog3
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auditoria_turnos`
--

DROP TABLE IF EXISTS `auditoria_turnos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditoria_turnos` (
  `id_auditoria` int NOT NULL AUTO_INCREMENT,
  `id_turno` int DEFAULT NULL,
  `fecha_cancelacion` datetime DEFAULT NULL,
  `usuario_mysql` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_auditoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditoria_turnos`
--

LOCK TABLES `auditoria_turnos` WRITE;
/*!40000 ALTER TABLE `auditoria_turnos` DISABLE KEYS */;
/*!40000 ALTER TABLE `auditoria_turnos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `especialidades`
--

DROP TABLE IF EXISTS `especialidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `especialidades` (
  `id_especialidad` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(120) NOT NULL,
  `activo` tinyint DEFAULT '1',
  PRIMARY KEY (`id_especialidad`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `especialidades`
--

LOCK TABLES `especialidades` WRITE;
/*!40000 ALTER TABLE `especialidades` DISABLE KEYS */;
INSERT INTO `especialidades` VALUES (1,'Cirugia estetica',1),(3,'Odontologia',1);
/*!40000 ALTER TABLE `especialidades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicos`
--

DROP TABLE IF EXISTS `medicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicos` (
  `id_medico` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_especialidad` int NOT NULL,
  `matricula` int NOT NULL,
  `descripcion` text,
  `valor_consulta` decimal(10,2) NOT NULL,
  `activo` tinyint DEFAULT '1',
  PRIMARY KEY (`id_medico`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_especialidad` (`id_especialidad`),
  CONSTRAINT `medicos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `medicos_ibfk_2` FOREIGN KEY (`id_especialidad`) REFERENCES `especialidades` (`id_especialidad`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicos`
--

LOCK TABLES `medicos` WRITE;
/*!40000 ALTER TABLE `medicos` DISABLE KEYS */;
INSERT INTO `medicos` VALUES (1,2,1,98765,'Cirugia integral. Tratamientos ambulatorios',100000.00,0),(2,5,1,12345,'Odontopediatra',35000.50,1);
/*!40000 ALTER TABLE `medicos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicos_obras_sociales`
--

DROP TABLE IF EXISTS `medicos_obras_sociales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicos_obras_sociales` (
  `id_medico_obra_social` int NOT NULL AUTO_INCREMENT,
  `id_medico` int NOT NULL,
  `id_obra_social` int NOT NULL,
  `activo` tinyint DEFAULT '1',
  PRIMARY KEY (`id_medico_obra_social`),
  KEY `id_medico` (`id_medico`),
  KEY `id_obra_social` (`id_obra_social`),
  CONSTRAINT `medicos_obras_sociales_ibfk_1` FOREIGN KEY (`id_medico`) REFERENCES `medicos` (`id_medico`),
  CONSTRAINT `medicos_obras_sociales_ibfk_2` FOREIGN KEY (`id_obra_social`) REFERENCES `obras_sociales` (`id_obra_social`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicos_obras_sociales`
--

LOCK TABLES `medicos_obras_sociales` WRITE;
/*!40000 ALTER TABLE `medicos_obras_sociales` DISABLE KEYS */;
INSERT INTO `medicos_obras_sociales` VALUES (1,1,1,1);
/*!40000 ALTER TABLE `medicos_obras_sociales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `obras_sociales`
--

DROP TABLE IF EXISTS `obras_sociales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `obras_sociales` (
  `id_obra_social` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(120) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `porcentaje_descuento` decimal(9,2) DEFAULT '0.00',
  `es_particular` tinyint DEFAULT '0',
  `activo` tinyint DEFAULT '1',
  PRIMARY KEY (`id_obra_social`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `obras_sociales`
--

LOCK TABLES `obras_sociales` WRITE;
/*!40000 ALTER TABLE `obras_sociales` DISABLE KEYS */;
INSERT INTO `obras_sociales` VALUES (1,'OSDE',NULL,0.40,0,1),(3,'Particular',NULL,0.00,1,1),(4,'Medife',NULL,0.30,0,1);
/*!40000 ALTER TABLE `obras_sociales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pacientes`
--

DROP TABLE IF EXISTS `pacientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pacientes` (
  `id_paciente` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_obra_social` int NOT NULL,
  PRIMARY KEY (`id_paciente`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_obra_social` (`id_obra_social`),
  CONSTRAINT `pacientes_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `pacientes_ibfk_2` FOREIGN KEY (`id_obra_social`) REFERENCES `obras_sociales` (`id_obra_social`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pacientes`
--

LOCK TABLES `pacientes` WRITE;
/*!40000 ALTER TABLE `pacientes` DISABLE KEYS */;
INSERT INTO `pacientes` VALUES (2,2,1);
/*!40000 ALTER TABLE `pacientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `turnos_reservas`
--

DROP TABLE IF EXISTS `turnos_reservas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `turnos_reservas` (
  `id_turno_reserva` int NOT NULL AUTO_INCREMENT,
  `id_medico` int NOT NULL,
  `id_paciente` int NOT NULL,
  `id_obra_social` int NOT NULL,
  `fecha_hora` datetime NOT NULL,
  `valor_total` decimal(10,2) NOT NULL,
  `atendido` tinyint DEFAULT '0',
  `activo` tinyint DEFAULT '1',
  PRIMARY KEY (`id_turno_reserva`),
  KEY `id_medico` (`id_medico`),
  KEY `id_paciente` (`id_paciente`),
  KEY `id_obra_social` (`id_obra_social`),
  CONSTRAINT `turnos_reservas_ibfk_1` FOREIGN KEY (`id_medico`) REFERENCES `medicos` (`id_medico`),
  CONSTRAINT `turnos_reservas_ibfk_2` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`),
  CONSTRAINT `turnos_reservas_ibfk_3` FOREIGN KEY (`id_obra_social`) REFERENCES `obras_sociales` (`id_obra_social`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `turnos_reservas`
--

LOCK TABLES `turnos_reservas` WRITE;
/*!40000 ALTER TABLE `turnos_reservas` DISABLE KEYS */;
INSERT INTO `turnos_reservas` VALUES (2,1,2,1,'2026-06-15 10:30:00',60000.00,0,1);
/*!40000 ALTER TABLE `turnos_reservas` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `tr_auditoria_cancelacion` AFTER UPDATE ON `turnos_reservas` FOR EACH ROW BEGIN
    -- Si el estado activo pasó de 1 a 0 (Se canceló/borró)
    IF NEW.activo = 0 AND OLD.activo = 1 THEN
        INSERT INTO auditoria_turnos (id_turno, fecha_cancelacion, usuario_mysql)
        VALUES (OLD.id_turno_reserva, NOW(), CURRENT_USER());
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `documento` varchar(20) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contrasenia` varchar(255) NOT NULL,
  `foto_path` varchar(255) DEFAULT NULL,
  `rol` tinyint NOT NULL,
  `activo` tinyint DEFAULT '1',
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `documento` (`documento`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'38131111','Admin','General','admin@gmail.com','$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36Xvy96P.vQByZ3fEDs4Kpy',NULL,3,1),(2,'17712345','Di Maria','Angel','angeldimaria@gmail.com','$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36Xvy96P.vQByZ3fEDs4Kpy',NULL,1,1),(3,'94567432','Marcos','Ruben','marcosRuben@gmail.com','$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36Xvy96P.vQByZ3fEDs4Kpy',NULL,2,1),(4,'99999999','Mammana','Florencia','floremammana@gmail.com','$2b$10$Xx04QdExlQx.JQ9EGhSrGu2Y2y7hcwkFsGIIMJKf/dYPg.U0aXD.K',NULL,3,1),(5,'35453231','Malcorra','Ignacio','ignaciomalcorra@gmail.com','$2b$10$SXdDAfUbFy5tGwCGIYFpZ.3wTQieJF5mcIJsA59UI/T0jEbE4nXHy',NULL,1,1),(6,'22345121','Cantizano','Giovanni','giovannicantizano@gmail.com','$2b$10$RZpsEqi2v5U2tsDpD2sMieIw4XInN4hlLNxDWMcLKuMly38zZ1xmO',NULL,2,1);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'clinica_prog3'
--
/*!50003 DROP PROCEDURE IF EXISTS `generar_estadisticas` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `generar_estadisticas`()
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM turnos_reservas WHERE activo = 1) AS total_turnos,
        (SELECT COUNT(*) FROM turnos_reservas WHERE atendido = 1 AND activo = 1) AS turnos_atendidos,
        (SELECT COUNT(*) FROM pacientes WHERE activo = 1) AS total_pacientes,
        (IFNULL((SELECT SUM(valor_total) FROM turnos_reservas WHERE atendido = 1 AND activo = 1), 0)) AS recaudacion_total;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_reporte_recaudacion_medico` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_reporte_recaudacion_medico`(IN p_id_medico INT)
BEGIN
    SELECT 
        m.id_medico, 
        u.apellido AS medico_apellido, 
        u.nombres AS medico_nombre,
        COUNT(tr.id_turno_reserva) AS cantidad_turnos_atendidos,
        SUM(tr.valor_total) AS total_facturado
    FROM medicos m
    INNER JOIN usuarios u ON m.id_usuario = u.id_usuario
    INNER JOIN turnos_reservas tr ON m.id_medico = tr.id_medico
    WHERE m.id_medico = p_id_medico 
      AND tr.atentido = 1 -- Solo contamos los turnos que ya se atendieron
      AND tr.activo = 1
    GROUP BY m.id_medico;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-16 18:40:55
