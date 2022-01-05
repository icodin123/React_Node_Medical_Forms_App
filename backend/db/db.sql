CREATE TABLE forms (
    id  varchar(255) PRIMARY KEY,
    name varchar(255),
    form text
);

CREATE TABLE answers (
    id  varchar(255) PRIMARY KEY,
    form_id varchar(255),
    question_id varchar(255),
    user_id varchar(255),
    session_id varchar(255),
    answer text
);

CREATE TABLE users (
    username  varchar(255) PRIMARY KEY,
    password varchar(255)
);

CREATE TABLE sessions (
    session_id varchar(255) PRIMARY KEY,
    form_id varchar(255),
    user_id varchar,
    submitted boolean,
    last_updated timestamp
);