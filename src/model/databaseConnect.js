const mysql = require('mysql');

class DatabaseConnect{
    constructor() {
        this.host = 'localhost';
        this.port = 3306;
        this.user = 'root';
        this.password = '0976177897son'
        this.database = 'quanlybanhang'
    }
    connect(){
        return mysql.createConnection({
            host:this.host,
            port:this.port,
            user: this.user,
            password:this.password,
            database:this.database
        })
    }
}

module.exports = DatabaseConnect;