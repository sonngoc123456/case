const DatabaseConnect = require("./databaseConnect");

class BaseModel{
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
}
module.exports=BaseModel;