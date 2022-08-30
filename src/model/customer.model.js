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

    async deleteOrderDetail(index) {
        const sql = `delete from orderdetail
       where orderID = '${index}'`;
        return await this.querySQL(sql);
    }
    async deleteOrders(index) {
        const sql = `delete from orders
       where orderID = '${index}'`;
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

    async updateCustomer(customerID,customerName,phone) {
        const sql = `UPDATE customers SET customerName='${customerName}', phone='${phone}'
                      where customerID = '${customerID}'`;
        return await this.querySQL(sql);
    }

    async createOrder(customerID,date) {
        const sql = `insert into orders(customerID,orderDate)
        value(${customerID}, '${date}')`;
        return await this.querySQL(sql);
    }



}

module.exports = CustomerModel;