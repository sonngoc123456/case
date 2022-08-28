const DatabaseConnect = require('./databaseConnect');

class CustomerModel {
    constructor() {
        let database = new DatabaseConnect();
        this.conn = database.connect();
    }

    querySQL(sql){
        return new Promise((resolve, reject)=>{
            this.conn.query(sql,(err,results)=>{
                if(err){
                    reject(err);
                }
                resolve(results);
            })
        })
    }
    async getCustomer(){
        const sql = `select customerName, phone from customers`;
        return await this.querySQL(sql);
    }

    async findByName(name) {
        const sql = `SELECT customerName, phone
                 FROM customers WHERE customerName LIKE '%${name}%'`;
        return await this.querySQL(sql)
    }
    async getListOrderOfCustomer(customerId) {
        const sql = `select `;
        return await this.querySQL(sql)
    }

    async getUser() {
        const sql = `select email,password from user`;
        return await this.querySQL(sql);
    }
}

module.exports = CustomerModel;