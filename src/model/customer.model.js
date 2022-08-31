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
        const sql = `select customerID, customerName, phone,city
                     from customers `;
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

    async addCustomer(dataForm) {
        const sql = `insert into customers(customerName,phone,city)
        value('${dataForm.name}', '${dataForm.phone}', '${dataForm.city}')`;
        return await this.querySQL(sql);
    }

    async getCustomerID(dataForm) {
        const sql = `select customerID
                     from customers
                      where customerName = '${dataForm.name}' and phone = '${dataForm.phone}'`;
        return await this.querySQL(sql);
    }

    async addOrder(dataForm) {
        let ID = await this.getCustomerID(dataForm)
        let customerID = ID[0].customerID;
        console.log(customerID);
        const sql = `insert into orders(customerID,orderDate)
                         value(${customerID}, '${dataForm.date}')`;
        return await this.querySQL(sql);
    }

    async getOrderID(dataForm) {
        let ID = await this.getCustomerID(dataForm)
        let customerID = ID[0].customerID;
        const sql = `select orderID
                     from orders
                      where customerID = ${customerID} and orderDate = '${dataForm.date}'`;
        return await this.querySQL(sql);
    }

    async addOrderDetails(dataForm) {
        let ID = await this.getOrderID(dataForm)
        let orderID = ID[0].orderID;
        const sql = `insert into orderdetail(orderID,productID,orderQTY)
                         value(${orderID}, '${dataForm.productname}', '${dataForm.soluong}')`;
        return await this.querySQL(sql);
    }



}

module.exports = CustomerModel;