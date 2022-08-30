const DatabaseConnect = require('./databaseConnect');

class CustomerModel {
    constructor() {
        let database = new DatabaseConnect();
        this.conn = database.connect();
    }

    querySQL(sql) {
        return new Promise((resolve, reject) => {
            this.conn.query(sql, (err, results) => {
                if (err) {
                    reject(err);
                }
                resolve(results);
            })
        })
    }

    async getCustomer() {
        const sql = `select customerID, customerName, phone
                     from customers`;
        return await this.querySQL(sql);
    }

    async findByName(name) {
        const sql = `SELECT customerName, phone
                     FROM customers
                     WHERE customerName LIKE '%${name}%'`;
        return await this.querySQL(sql)
    }

    async getListOrderOfCustomer(customerId) {
        const sql = `select customers.customerName
                          , customers.phone
                          , orders.*
                          from customers
                          join orders on customers.customerID = orders.customerID
                     where customers.customerID = '${customerId}' `;
        return await this.querySQL(sql)
    }

    async getUser() {
        const sql = `select email, password
                     from user`;
        return await this.querySQL(sql);
    }

    async deleteOrder(index,id) {
        const sql = `delete from orders
       join orderdetail on orderdetail.orderID = orders.orderID
       where orders.orderID = '${index}'`;
        return await this.querySQL(sql);
    }

    async getOrderDetail(orderID) {
        const sql = `select product.productName, orderdetail.orderQTY, product.productPrice
                     from orderdetail
                     join product on orderdetail.productID = product.productID
                     where orderdetail.orderID = '${orderID}'`;
        return await this.querySQL(sql);
    }

    async findCustomer(customerID) {
        const sql = `select customerName, phone
                     from customers
                      where customerID = '${customerID}'`;
        return await this.querySQL(sql);
    }

}

module.exports = CustomerModel;