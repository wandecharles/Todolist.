import Database from 'better-sqlite3'
const db = new Database(':memory:')


db.exec(`CREATE TABLE users ( 
    Id INTEGER PRIMARY KEY AUTOINCREMENT, 
    username TEXT UNIQUE,
    password TEXT
    )
    `)


    db.exec(`CREATE TABLE todos ( 
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_Id INTEGER,
        task TEXT,
        completed BOOLEAN DEFAULT 0,
        FOREIGN KEY(user_Id) REFERENCES USERS(Id)

        )
        `)

        export default db


