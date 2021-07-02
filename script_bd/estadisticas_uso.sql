-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-06-2021 a las 05:58:12
-- Versión del servidor: 10.4.18-MariaDB
-- Versión de PHP: 7.3.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bd_bibliometria`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estadisticas_uso`
--

--
-- Volcado de datos para la tabla `estadisticas_uso`
--

INSERT INTO `estadisticas_uso` (`id_base_datos_digital`, `año`, `mes`, `numero_busquedas`, `descripcion`) VALUES
(4, 2020, 'Enero', 1061, NULL),
(4, 2020, 'Febrero', 393, NULL),
(4, 2020, 'Marzo', 637, NULL),
(4, 2020, 'Abril', 1444, NULL),
(4, 2020, 'Mayo', 1954, NULL),
(4, 2020, 'Junio', 1111, NULL),
(4, 2020, 'Julio', 1279, NULL),
(4, 2020, 'Agosto', 336, NULL),
(4, 2020, 'Septiembre', 380, NULL),
(4, 2020, 'Octubre', 525, NULL),
(4, 2020, 'Noviembre', 1117, NULL),
(4, 2020, 'Diciembre', 718, NULL);

INSERT INTO `estadisticas_uso` (`id_base_datos_digital`, `año`, `mes`, `numero_busquedas`, `descripcion`) VALUES
(5, 2020, 'Enero', 2241, NULL),
(5, 2020, 'Febrero', 1322, NULL),
(5, 2020, 'Marzo', 1911, NULL),
(5, 2020, 'Abril', 3781, NULL),
(5, 2020, 'Mayo', 3153, NULL),
(5, 2020, 'Junio', 2833, NULL),
(5, 2020, 'Julio', 1935, NULL),
(5, 2020, 'Agosto', 1951, NULL),
(5, 2020, 'Septiembre', 982, NULL),
(5, 2020, 'Octubre', 1078, NULL),
(5, 2020, 'Noviembre', 2738, NULL),
(5, 2020, 'Diciembre', 616, NULL);

INSERT INTO `estadisticas_uso` (`id_base_datos_digital`, `año`, `mes`, `numero_busquedas`, `descripcion`) VALUES
(1, 2019, 'Julio', 26631, NULL),
(1, 2019, 'Agosto', 3120, NULL),
(1, 2019, 'Septiembre', 20470, NULL),
(1, 2019, 'Octubre', 35062, NULL),
(1, 2019, 'Noviembre', 17835, NULL),
(1, 2019, 'Diciembre', 5821, NULL),
(1, 2020, 'Enero', 14425, NULL),
(1, 2020, 'Febrero', 2013, NULL),
(1, 2020, 'Marzo', 12579, NULL),
(1, 2020, 'Abril', 3931, NULL),
(1, 2020, 'Mayo', 8612, NULL),
(1, 2020, 'Junio', 4323, NULL);

INSERT INTO `estadisticas_uso` (`id_base_datos_digital`, `año`, `mes`, `numero_busquedas`, `descripcion`) VALUES
(11, 2019, 'Julio', 3166, NULL),
(11, 2019, 'Agosto', 1120, NULL),
(11, 2019, 'Septiembre', 2781, NULL),
(11, 2019, 'Octubre', 4395, NULL),
(11, 2019, 'Noviembre', 4938, NULL),
(11, 2019, 'Diciembre', 2758, NULL),
(11, 2020, 'Enero', 2182, NULL),
(11, 2020, 'Febrero', 2330, NULL),
(11, 2020, 'Marzo', 4290, NULL),
(11, 2020, 'Abril', 2904, NULL),
(11, 2020, 'Mayo', 4261, NULL),
(11, 2020, 'Junio', 1684, NULL);

INSERT INTO `estadisticas_uso` (`id_base_datos_digital`, `año`, `mes`, `numero_busquedas`, `descripcion`) VALUES
(3, 2019, 'Julio', 745, NULL),
(3, 2019, 'Agosto', 38687, NULL),
(3, 2019, 'Septiembre', 39862, NULL),
(3, 2019, 'Octubre', 21749, NULL),
(3, 2019, 'Noviembre', 30514, NULL),
(3, 2019, 'Diciembre', 53850, NULL),
(3, 2020, 'Enero', 110469, NULL),
(3, 2020, 'Febrero', 67994, NULL),
(3, 2020, 'Marzo', 47403, NULL),
(3, 2020, 'Abril', 26155, NULL),
(3, 2020, 'Mayo', 42725, NULL),
(3, 2020, 'Junio', 5924, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `estadisticas_uso`
--
ALTER TABLE `estadisticas_uso`
  ADD PRIMARY KEY (`id_estadisticas_uso`),
  ADD KEY `id_base_datos_digital` (`id_base_datos_digital`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `estadisticas_uso`
--
ALTER TABLE `estadisticas_uso`
  MODIFY `id_estadisticas_uso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `estadisticas_uso`
--
ALTER TABLE `estadisticas_uso`
  ADD CONSTRAINT `estadisticas_uso_ibfk_1` FOREIGN KEY (`id_base_datos_digital`) REFERENCES `base_datos_digital` (`id_base_datos_digital`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
