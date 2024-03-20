const express = require('express')
const app = express()

require('dotenv').config();
const port = process.env.APP_PORT || 3000 // lay port trong evn
const { executeQuery } = require("./App/SQLServer/SqlServerConnect")
const sqldata = require("./App/SQLServer/SqlServerConnect")


app.get('/', (req, res) => {
  res.send('Hello World!45577')
  console.log("hahaha")
})

app.get('/data', (req, res) => {
    Sqlstring = " Select * from Student where id = ?"
    id = 3
    getdata = async () => {data = await sqldata.executeQuery(Sqlstring,id)}
    getdata()
    console.log(data)
    res.send(JSON.stringify(data))

  })


  // cách 1 dùng Function để thêm async và await
  app.get('/student', (req, res) => {

    Sqlstring = "Select * from Student"
    getdata = async () => {data = await sqldata.executeQuery(Sqlstring)}
    getdata()
    console.log(data)
    res.send(JSON.stringify(data))
  })
  

    // cách 1 dùng IIFE Function để thêm async và await bắt buộc thêm dấu ; trước và sau hàm IIFE Function thì mới chạy được
  app.get('/student2', (req, res) => {
    Sqlstring = "Select * from Student";// bắt buộc thêm dấu ; thì mới chạy được
    (async ()=> {
      // code trong này sẽ được thực thi ngay lập tức
      data = await sqldata.executeQuery(Sqlstring)
  })();
    console.log(data)
    res.send(JSON.stringify(data))
  })


  app.get('/students', (req, res) => {

       //Sqlstring = "Select * from Student"
    Sqlstring = "INSERT INTO student (id, name, email, phone) VALUES (2000, N'John Doe123', N'123john@example.com', N'12345678902')"
    executeQuery(Sqlstring)
    .then(response => {
        // Truy cập vào kết quả và thông báo từ Promise
            console.log(response);
            res.send(JSON.stringify(response))

    })
    .catch(error => {
        // Xử lý lỗi từ Promise
        console.error("Promise Error:", error);
    });
  })



  

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})