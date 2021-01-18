var http = require('http');
var path = require('path');
var express = require('express');
var logger = require('morgan');
//因为需要实现留言新建动作，所以这里需要使用 body-parser 对 POST 请求进行解析。
var bodyParse = require('body-parser');

var app = express();

// 告诉express 视图存在于名叫views的文件夹中
app.set('views', path.resolve(__dirname, 'views'));
//设置引擎
app.set('view engine', 'ejs');

//设置留言的全局变量
var entries = [];
//将变量设置到app.locals对象下面，这个数据在所有的模板中都可以获取到
app.locals.entries = entries;

//使用Morgan进行日志记录
app.use(logger('dev'));

//设置用户表单提交动作信息的中间件，所有信息会保存在req.body中
app.use(bodyParse.urlencoded({ extended: false }));

//当访问了网站根目录，就渲染主页(主页模版位于 views/index.ejs);
app.get('/', function (req, res) {
    res.render('index');
});

//当get访问/new-entry时候， 渲染‘新留言’页面  
app.get('/new-entry', function (req, res) {
    res.render('new-entry');
});

//post 进行留言新建的路由处理
app.post('/new-entry', function (req, res) {
    //如果用户提交的表单没有标题或者内容，返回 400 错误
    // if (!req.body.title || !req.body.body) {
    //     res.status(400).send('Entries must have a title and a body');
    //     return;
    // };

    //400 bad request，请求报文存在语法错误
    if (req.body.title.trim() == 0 || req.body.body.trim() == 0) {
        // window.alert('error');
        // res.redirect('/')
        res.status(400).send('Entries must have a title and a body');
        // window.location.href="http://localhost:3000";
        return;
    };

    //添加新留言到entries中
    entries.push({
        title: req.body.title,
        content: req.body.body,
        published: new Date()
    });

    //重定向到主页来查看新建条目
    res.redirect('/');
});

//404 not found 处理，表示在服务器上没有找到请求的资源
app.use(function (req, res) {
    res.status(404).render('404');
});

//在3000端口启动服务器
app.listen(3000, function () {
    console.log('Guestbook app started on port 3000');
});


