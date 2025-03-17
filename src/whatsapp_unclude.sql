-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Янв 11 2024 г., 12:43
-- Версия сервера: 10.4.32-MariaDB
-- Версия PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `whatsapp unclude`
--

-- --------------------------------------------------------

--
-- Структура таблицы `enda_account`
--

CREATE TABLE `enda_account` (
  `id` int(60) NOT NULL,
  `cascade_id` varchar(255) NOT NULL,
  `api_key` varchar(355) NOT NULL,
  `working` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `enda_account`
--

INSERT INTO `enda_account` (`id`, `cascade_id`, `api_key`, `working`) VALUES
(1, '2007', '2c12de9c-ec51-4929-ad16-96e7fb02e6ad', 1);

-- --------------------------------------------------------

--
-- Структура таблицы `send_wa`
--

CREATE TABLE `send_wa` (
  `id` int(60) NOT NULL,
  `date` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `telefone` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `id_user` int(60) NOT NULL,
  `name_user` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `role_user` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `NameSample` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `sender_name` varchar(200) NOT NULL,
  `message` varchar(355) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `Error` int(1) NOT NULL,
  `requestId` varchar(355) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `send_wa`
--

INSERT INTO `send_wa` (`id`, `date`, `telefone`, `id_user`, `name_user`, `role_user`, `NameSample`, `sender_name`, `message`, `Error`, `requestId`) VALUES
(8, '10.01.2024 20:59:13', '79795956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(9, '10.01.2024 20:59:13', '79755956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 0, 'null'),
(10, '10.01.2024 20:59:13', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(11, '12.01.2024 20:59:14', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 0, 'null'),
(12, '11.01.2024 20:59:14', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(13, '10.01.2024 20:59:15', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 0, 'null'),
(14, '05.01.2024 20:59:15', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 0, 'null'),
(15, '10.01.2024 20:59:15', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 0, 'null'),
(16, '10.01.2024 20:59:15', '79795956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(17, '10.01.2024 20:59:16', '79785956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(18, '10.01.2024 20:59:16', '79765956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(19, '08.01.2024 20:59:16', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(20, '10.01.2024 20:59:17', '79775956855', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 0, 'null'),
(21, '01.12.2023 20:59:17', '79778956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(22, '10.01.2024 20:59:17', '79785956854', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 0, 'null'),
(23, '02.01.2024 20:59:18', '79775956854', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(24, '09.01.2024 20:59:18', '79775956859', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 0, 'null'),
(25, '15.01.2024 20:59:18', '79775956850', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(26, '10.01.2024 20:59:18', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(27, '10.01.2024 20:59:19', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(28, '10.01.2024 20:59:19', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(29, '10.01.2024 20:59:19', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(30, '10.01.2024 20:59:20', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(31, '10.01.2024 20:59:20', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(32, '10.01.2024 20:59:20', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(33, '10.01.2024 20:59:20', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(34, '10.01.2024 20:59:21', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(35, '10.01.2024 20:59:21', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(36, '10.01.2024 20:59:21', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(37, '10.01.2024 20:59:22', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(38, '10.01.2024 20:59:22', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(39, '10.01.2024 20:59:22', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(40, '10.01.2024 20:59:22', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(41, '10.01.2024 20:59:23', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(42, '10.01.2024 20:59:23', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(43, '10.01.2024 20:59:23', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(44, '10.01.2024 20:59:23', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(45, '10.01.2024 20:59:24', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(46, '10.01.2024 20:59:25', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(47, '10.01.2024 20:59:25', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(48, '10.01.2024 20:59:25', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(49, '10.01.2024 20:59:25', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(50, '10.01.2024 20:59:26', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(51, '10.01.2024 20:59:26', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(52, '10.01.2024 20:59:26', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(53, '10.01.2024 20:59:26', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(54, '10.01.2024 20:59:27', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(55, '10.01.2024 20:59:27', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(56, '10.01.2024 20:59:27', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null'),
(57, '10.01.2024 20:59:28', '79775956853', 1, 'Лашин Александр Александрович', 'system_admin', ' Налоговый Вычет', 'Карие', 'Здравствуйте! \nСпасибо за ваше доверие к сети медицинских центров «Альтамед»!\nНаправляем Вам ссылку на инструкцию по получению налогового вычета. Выберите центр, где вы получали медицинскую помощь и пройдите по ссылке.\n\n*1. Медицинский центр «Альтамед »*\nАдрес: г.Одинцово, Союзная, 32Б.\nhttps://www.altamedplus.ru/about/nalogovyy-vychet/\n\n*2. Клиника «Од', 1, 'null');

-- --------------------------------------------------------

--
-- Структура таблицы `unclude`
--

CREATE TABLE `unclude` (
  `id` int(60) NOT NULL,
  `name` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `telefone` varchar(150) NOT NULL,
  `role` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `autetificator` varchar(355) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `old` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `unclude`
--

INSERT INTO `unclude` (`id`, `name`, `password`, `telefone`, `role`, `autetificator`, `old`) VALUES
(2, 'Лашин Александр Александрович', '3a31e92ea9b39f868269dea7474223da', '79775956853', 'system_admin/admin/senior_admin/marketing/doctor', 'g1Cr7egN3o8hnqSTF3ZLi6zqdsCaNK41/1QXh8ObAU/RsnuJkPDEatE4B1meXweS9jrOj26krFAE368GtulIfJJNxXfzLTfXGRbUBoALq0dW91Ks/YJU6yAapUZkIOpuHBaIa44yFrQBSFBJe/KvWju/ZX7I1VIe5qr2hp/tlityVcaZ+onHi3MJ6vyTdc04XVwlkpuRUev0jtxpNB2xEw==', 1);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `enda_account`
--
ALTER TABLE `enda_account`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `send_wa`
--
ALTER TABLE `send_wa`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `unclude`
--
ALTER TABLE `unclude`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `enda_account`
--
ALTER TABLE `enda_account`
  MODIFY `id` int(60) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT для таблицы `send_wa`
--
ALTER TABLE `send_wa`
  MODIFY `id` int(60) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT для таблицы `unclude`
--
ALTER TABLE `unclude`
  MODIFY `id` int(60) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
