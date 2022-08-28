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
                html += `<td><a href="/customers/orders?id=${item.customerNumber}" class="btn btn-success">Xem đơn hàng</a></td>`;
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

    Login(req, res) {
        fs.readFile('./login/index.html', 'utf8', (err, data) => {
            if(err) {
                throw new Error(err.message)
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        })
    }

    LoginSuccess(req, res) {

        let data = ''
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end',async () => {
            let dataForm = qs.parse(data);
            let users = await this.customerModel.getUser();
            let passwordUser = parseInt(dataForm.password)

          for(let i = 0; i < users.length; i++) {
              if (dataForm.email === users[i].email && passwordUser === users[i].password) {
                  res.writeHead(301, { Location: '/'})
              }else {
                  res.writeHead(301, { Location: '/login'})
              }
              res.end()
          }

        })
    }

}

module.exports=CustomerController;