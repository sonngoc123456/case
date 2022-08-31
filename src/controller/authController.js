const fs = require('fs')
const BaseModel = require('../model/base.model');
const qs = require("qs");
const UserModel = require('../model/user.model');
const cookie = require('cookie');
const url = require('url')
let userModel = new UserModel();

class AuthController extends BaseModel {
    showFormLogin(req, res) {
        // let cookieUserLogin = {
        //     'username': '',
        //     'password': ''
        // }
        // if (req.headers.cookie) {
        //     let cookies = cookie.parse(req.headers.cookie);
        //     if (cookies && cookies.username) {
        //         cookieUserLogin = JSON.parse(cookies.username);
                fs.readFile('./login-form-20/index.html', 'utf8', (err, data) => {
                    if (err) {
                        throw new Error(err.message)
                    }
                    // data = data.replace('{usernames}', cookieUserLogin.username);
                    // data = data.replace('{passwords}', cookieUserLogin.password);
                    res.write(data);
                    res.end();
                })
            // }
        }
        // else {
            // fs.readFile('./login-form-20/index.html', 'utf8', (err, data) => {
            //     if (err) {
            //         throw new Error(err.message)
            //     }
            //     data = data.replace('{usernames}', cookieUserLogin.username);
            //     data = data.replace('{passwords}', cookieUserLogin.password);
            //     res.writeHead(200,{'Content-type':'text/html'})
            //     res.write(data);
            //     res.end();
            // })
        // }
    // }

    login(req, res) {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        })
        req.on('end', async () => {
            let dataForm = qs.parse(data);
            let isValidAccount = await userModel.findUserLogin(dataForm);

            const setCookie = cookie.serialize('username', JSON.stringify(dataForm));
            res.setHeader('Set-Cookie', setCookie);


            if (isValidAccount.length > 0) {
                res.writeHead(301, {location: '/'});
                return res.end();
            } else {
                res.writeHead(301, {location: '/login'});
                return res.end();
            }
        })
    }

    formRegister(req,res){
        fs.readFile('./signUpForm/signUp.html','utf8',(err,data)=>{
            if(err){
                throw new Error(err.message);
            }
            res.writeHead(200,{'Content-type':'text/html'});
            res.write(data);
            return res.end()
        })
    }

    Register(req,res){
        let data = '';
        req.on('data',chunk=>{
            data += chunk;
        });
        req.on('end',async ()=> {
            let dataForm = qs.parse(data);
            if (dataForm.username !== '' && dataForm.password !== ''&& dataForm.email !== '') {
                await userModel.addUser(dataForm);
                res.writeHead(301, {location: '/userLogin'});
               res.end();
            } else {
                res.writeHead(301, {location: '/user/add'});
                res.end();
            }
        })
    }

    async showUserLogin(req,res){
        let customers = await userModel.showUser();
        fs.readFile('./userLogin/showUserLogin.html','utf8',(err,data)=>{
            if(err){
                throw new Error(err.message)
            }
            let html='';
            customers.forEach((value,index)=>{
                html+=`<tr>`;
                html+=`<td>${index+1}</td>`;
                html+=`<td>${value.userName}</td>`;
                html+=`<td>${value.Email}</td>`;
                html+=`<td>${value.Password}</td>`;
                html+=`<td><a href="/deleteuser?index=${value.userID}" class="btn btn-danger">Delete</a></td>`;
                html+=`<td><a href="/formupdateuser?index=${value.userID}" class="btn btn-primary">Edit</a></td>`;
                html+=`</tr>`;
            })
            data=data.replace('{user-login}',html);
            res.writeHead(200,{'Content-Type':'text/html'});
            res.write(data);
            res.end();
        })
    }

    formupdateUser(req, res) {
        fs.readFile('./signUpForm/updateuser.html', 'utf8',(err, data) => {
            if(err) {
                throw new Error(err.message)
            }
            res.writeHead(200,{'Content-Type':'text/html'})
            res.write(data);
            res.end();
        })

    }

    async updateUsers(req,res){
        let index = qs.parse(url.parse(req.url).query).index
        console.log(index);
        let data = '';
        req.on('data',chunk=>{
            data += chunk;
        });
        req.on('end',async ()=> {
            let dataForm = qs.parse(data);
            console.log(dataForm)
            await userModel.updateUser(dataForm,index)
            res.writeHead(301, {location: '/userLogin'});
            res.end();
        })
    }

    async deleteUser(req, res) {
       let index = qs.parse(url.parse(req.url).query).index
        await userModel.deleteUser(index)
        res.writeHead(301,{'Location':'/userLogin'})
        res.end();
    }


}

module.exports = AuthController;