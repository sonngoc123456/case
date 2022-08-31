const fs = require('fs');
const qs = require('qs');
const url = require('url');
const CustomerModel = require('../model/customer.model');

class CustomerController{

    constructor() {
        this.customerModel = new CustomerModel();
    }

    async showList(req,res){
        let customers = await this.customerModel.getCustomer();
        fs.readFile('./templates/homePage.html','utf8',(err,data)=>{
            if(err){
                throw new Error(err.message)
            }
            let html='';
            customers.forEach((value,index)=>{
                html+=`<tr>`;
                html+=`<td>${index+1}</td>`;
                html+=`<td>${value.customerName}</td>`;
                html+=`<td>${value.phone}</td>`;
                html+=`<td>${value.city}</td>`;
                html+= `<td><a href="/customers/orders?id=${value.customerID}" class="btn btn-warning">Đơn hàng</a></td>`;
                html+= `<td><a href="/customers/update?id=${value.customerID}" class="btn btn-info">Update</a></td>`;
                html+=`</tr>`;
            })
            data=data.replace('{list-customers}',html);
            res.writeHead(200,{'Content-Type':'text/html'});
            res.write(data);
            res.end();
        })
    }

    async searchCustomer(req, res) {
        let keyword = qs.parse(url.parse(req.url).query).keyword;
        let customers = await this.customerModel.findByName(keyword);
        let html = '';
        if (customers.length > 0) {
            customers.forEach((item, index) => {
                html += "<tr>";
                html += `<td>${index + 1}</td>`;
                html += `<td>${item.customerName}</td>`;
                html += `<td>${item.phone}</td>`;
                html += "</tr>";
            })
        } else {
            html += "<tr>";
            html += `<td colspan="4" class="text-center">Không có dữ liệu</td>`;
            html += "</tr>";
        }
        fs.readFile('./templates/homePage.html', 'utf8', ((err, data) =>  {
            if (err) {
                throw new Error(err.message)
            }

            data = data.replace('{list-customers}', html)
            data = data.replace(' <input type="text" name="keyword" placeholder="Enter your name" class="form-control">', `<input type="text" name="keyword" value="${keyword}" placeholder="Enter your name" class="form-control">`)
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.write(data)
            res.end();
        }))
    }

    async showListOrder(req, res) {
        let customerID = qs.parse(url.parse(req.url).query).id;
        let customer = await this.customerModel.findCustomer(customerID);
        let nameCustomer = customer[0].customerName;
        let phone =customer[0].phone;
        let result = await this.customerModel.getListOrderOfCustomer(customerID)
        let html = '';
        if (result.length > 0) {
            result.forEach((item, index) => {
                html += "<tr>";
                html += `<td>${index + 1}</td>`;
                html += `<td>${item.orderID}</td>`;
                html += `<td>${item.customerID}</td>`;
                html += `<td>${item.orderDate}</td>`;
                html += `<td><a href="/customers/orders/detail?index=${item.orderID}" class="btn btn-primary">Chi tiết</a></td>`;
                html += `<td><a href="/customers/orders/delete?index=${item.orderID}&id=${item.customerID}" class="btn btn-danger">Xóa</a></td>`;
                html += "</tr>";
            })
        }else {
            html += "<tr>";
            html += `<td colspan="4" class="text-center">Không có dữ liệu</td>`;
            html += "</tr>";
        }
        fs.readFile('./templates/Order.html', 'utf8', (err, data) => {
            data = data.replace('{name}', nameCustomer)
            data = data.replace('{phone}', phone)
            data = data.replace('{list-orders}', html)
            res.end(data);
        })
    }

    async deleteOrder(req, res) {
        let index = qs.parse(url.parse(req.url).query).index;
        let id = qs.parse(url.parse(req.url).query).id;
        await this.customerModel.deleteOrderDetail(index);
        await this.customerModel.deleteOrders(index);
        res.writeHead(301,{'Location':`/customers/orders?id=${id}`})
        res.end();
    }

    async getListOrderDetail(req, res) {
        let orderId = qs.parse(url.parse(req.url).query).index
        let result =  await this.customerModel.getOrderDetail(orderId);
        let html = '';
        if (result.length > 0) {
            result.forEach((item, index) => {
                html += "<tr>";
                html += `<td>${index + 1}</td>`;
                html += `<td>${item.productName}</td>`;
                html += `<td>${item.orderQTY}</td>`;
                html += `<td>${item.productPrice}</td>`;
                html += "</tr>";
            })
        }else {
            html += "<tr>";
            html += `<td colspan="4" class="text-center">Không có dữ liệu</td>`;
            html += "</tr>";
        }
        fs.readFile('./templates/orderdetail.html', 'utf8', (err, data) => {
            data = data.replace('{list-orders}', html)
            res.end(data);
        })
    }



    showFormUpdate(req, res) {
        fs.readFile('./templates/UpdateCustomer.html', 'utf8', (err, data) => {
            if(err) {
                throw new Error(err.message)
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        })
    }
    updateCustomer(req, res) {
        let data = ''
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end',async () => {
            let customerID = qs.parse(url.parse(req.url).query).id
            let dataForm = qs.parse(data);
            let customerName = dataForm.customerName;
            let phone = dataForm.phone;
            await this.customerModel.updateCustomer(customerID, customerName, phone);
            res.writeHead(301,{'Location':'/'})
            res.end();
        })
    }

    showFormAddOrder(req, res) {
        fs.readFile('./templates/form.html', 'utf8', (err, data) => {
            if(err) {
                throw new Error(err.message)
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        })
    }

    createOrder(req, res) {
        let data = ''
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end',async () => {
            let dataForm = qs.parse(data);
            await this.customerModel.addCustomer(dataForm);
            await this.customerModel.addOrder(dataForm);
            await this.customerModel.addOrderDetails(dataForm);
            res.writeHead(301,{'Location':'/'})
            res.end();
        })
    }

}

module.exports=CustomerController;