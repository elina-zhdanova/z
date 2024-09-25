-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: exam
-- ------------------------------------------------------
-- Server version	8.0.39

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
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `books` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `about` text NOT NULL,
  `pub` varchar(50) NOT NULL,
  `author` varchar(50) NOT NULL,
  `pages` int NOT NULL,
  `skin` int NOT NULL,
  `year` year NOT NULL,
  PRIMARY KEY (`id`),
  KEY `skin` (`skin`),
  CONSTRAINT `Books_ibfk_1` FOREIGN KEY (`skin`) REFERENCES `skins` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books`
--

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
INSERT INTO `books` VALUES (3,'Гарри Потер и философский камень','Книга, покорившая мир, эталон литературы для читателей всех возрастов, синоним успеха. Книга, сделавшая Джоан Роулинг самым читаемым писателем современности. Книга, ставшая культовой уже для нескольких поколений. «Гарри Поттер и Философский камень» - история начинается.','Махаон','Дж. Роулинг',432,2,2023),(4,'Как поймать монстра','В Ирландии пропадают двое охотников за нечистью – сотрудников специального Бюро, которое занимается отловом сверхъестественных существ. На выручку к ним отправляются их коллеги: они приезжают в захолустный городок, в котором пропавших видели в последний раз. В первую же ночь в городе одной из охотников снится странный сон – первый из череды тех, что поведет группу в чащу векового леса, в котором обитает что-то давно забытое, скрытое в глубине ирландских холмов. Что-то, что наблюдает за ними – и терпеливо ждет момента, когда охотники превратятся в жертв.','Ман','Арина Цимеринг',605,3,2024),(6,'Смерть - единственный конец для злодейки','Игра с сумасшедшими правилами наконец окончена! Пенелопе Экхарт чудом удалось выжить. Но что ее до сих пор держит в виртуальной реальности? Может, чувства к кронпринцу? Каллисто признался в любви Пенелопе и мечтает на ней жениться, но девушка всякий раз отвечает отказом. Теперь она стоит перед выбором: вернуться домой или остаться в мире, полном опасностей, связав себя узами брака. Что же решит Пенелопа?..\n\nВ заключительном томе новеллы читателей ждут экстра-главы, повествующие о дальнейшей судьбе главных героев','Манн','Квон Геыль',400,5,2021),(7,'Коралина в стране кошмара','Издание на английском языке.\nИсследуя дом, в который только что переехала её семья, Коралина находит дверь, ведущую в никуда. Или, точнее, дверь, которая вела в никуда, пока её не открыли правильным ключом. Теперь за ней находится проход в другой мир, очень похожий на мир Коралины: здесь тот же дом, те же странные соседи, и даже её мама и папа! Только еда здесь вкуснее, игры веселее, а животные могут разговаривать. А раз здесь так хорошо, то почему бы не остаться здесь навсегда?\nИздание без адаптации. Наслаждайтесь талантом Нила Геймана в оригинале!','ACT','Нил Гейман',320,6,2020);
/*!40000 ALTER TABLE `books` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-25 16:52:48
