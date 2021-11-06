DROP DATABASE smlk;
CREATE DATABASE IF NOT EXISTS smlk;

USE smlk;

CREATE TABLE IF NOT EXISTS users (
    userNick VARCHAR(20) NOT NULL,
    password CHAR(60) NOT NULL,
    PRIMARY KEY (userNick)
);

CREATE TABLE IF NOT EXISTS collections (
    collectionId INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(20) NOT NULL,
    userNick VARCHAR(20) NOT NULL,
    PRIMARY KEY (collectionId),
    FOREIGN KEY (userNick) REFERENCES users (userNick)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS items (
    itemId INT NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT 0,
    type ENUM('story', 'comment') NOT NULL,
    `by` VARCHAR(255) DEFAULT NULL,
    time DATETIME NOT NULL,
    text TEXT,
    dead BOOLEAN NOT NULL DEFAULT 0,
    url VARCHAR(255),
    score MEDIUMINT UNSIGNED,
    title VARCHAR(255),
    descendants SMALLINT UNSIGNED,
    PRIMARY KEY (itemId)
);

CREATE TABLE IF NOT EXISTS collectionItems (
    collectionItemId INT AUTO_INCREMENT NOT NULL,
    collectionId INT NOT NULL,
    itemId INT NOT NULL,
    PRIMARY KEY (collectionItemId),
    FOREIGN KEY (collectionId) REFERENCES collections (collectionId)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (itemId) REFERENCES items (itemId)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS itemHierarchies (
    `hierarchyId` INT AUTO_INCREMENT NOT NULL,
    itemId INT NOT NULL,
    parentId INT DEFAULT NULL,
    PRIMARY KEY (`hierarchyId`),
    FOREIGN KEY (itemId) REFERENCES items (itemId)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (parentId) REFERENCES items (itemId)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);