const BaseModel = require('./base.model');

class UserModel extends BaseModel{
    async findUserLogin(data){
        const sql = `select * from user where Email = "${data.email}" and Password = "${data.password}"`;
        return await this.querySQL(sql);
    }
    async addUser(data){
        const sql = `insert into user(userName,Email,Password) value("${data.username}","${data.email}","${data.password}")`;
        return await this.querySQL(sql);
    }
    async showUser(){
        const sql = `select * from user`;
        return await this.querySQL(sql);
    }
    async updateUser(dataForm,index){
        const sql = `update user set Email = "${dataForm.email}",userName = "${dataForm.username}",password = "${dataForm.password}"
            where userID =${index}`;
        return await this.querySQL(sql);
    }

    async deleteUser(index){
        const sql = `delete from user where userID =${index}`;
        return await this.querySQL(sql);
    }
}

module.exports = UserModel