CREATE TABLE users(
    id int (15) NOT NULL AUTO_INCREMENT,
    email VARCHAR(55) NOT NULL UNIQUE,
    user VARCHAR(25) NOT NULL UNIQUE,
    password VARCHAR(70) NOT NULL,
    borned DATE NOT NULL,
    fName VARCHAR(25) NOT NULL,
    lName VARCHAR(25) NOT NULL,
    sexy CHAR(1) NOT NULL,
    country VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    createTime TIMESTAMP,
    PRIMARY KEY(id)
);