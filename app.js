var mysql = require ('mysql');
var express = require ('express');
var app = express();

var session = require('express-session');
app.use(session({secret: 'sssshhhh'}));
var sesss;

const crypto = require('crypto');
const secret = 'abcdefg';

app.set('view engine','ejs');

var bodyParser = require('body-parser')
var url = bodyParser.urlencoded({ extended: false})

var connection = mysql.createConnection
(
    {
        host: "localhost",
        port: 3306,
        database: "ecommerce",
        user: "root",
        password: "",
    }
);
//////////////////////////----------------------------------------------user--------------------------------//////////////////////////////////////

// react project login, product list, register, product detail
// app.get('/register', function(req, res)
// {
//     res.render(__dirname + '/views/register', 
// )});

// app.post('/register', url, function(req, res)
// {
//     //console.log(req.body);
    
//     var sql = 'SELECT * FROM userlogin WHERE username = ?';
//     connection.query(sql, [req.body.username], function (err, rows) {

//         if (rows.length > 0)
//         {
//             res.render(__dirname + '/views/login', 
//             {
//                 notif:'Username sudah terdaftar !'
//             });
//         }
//         else
//         {
//             const password = crypto.createHmac('sha256', secret)
//             .update(req.body.password)
//             .digest('hex');

//             //console.log(password);

//             connection.query("insert into userlogin set ? ",
//             {
//                 username : req.body.username,
//                 passwords : passwords,
//             });

//             connection.query("insert into userregis set ? ",
//             {
//                 nama : req.body.name,
//                 email : req.body.email,
//                 telp : req.body.phonenumber,
//             });

//             res.redirect('/homepage');
//         }
//     });
// })

// app.get('/login', function(req, res)
// {
//     res.render(__dirname + '/views/login', 
//     {
//         notif:''
//     });
// })

// app.post('/login', url, function(req, res)
// {
//     const password = crypto.createHmac('sha256', secret)
//     .update(req.body.password)
//     .digest('hex');

//     var sql = 'SELECT * FROM userlogin WHERE username = ? and password = ?';
//     connection.query(sql, [req.body.username, password], function (err, rows) {
//     //if (err) throw err;
//     //console.log(rows[0].userid);

//         if (rows.length > 0)
//         {
//             sess=req.session;
//             sess.userid = rows[0].id;
//             sess.username = rows[0].username;

//             res.redirect('/');
//         }
//         else
//         {
//             res.render(__dirname + '/views/login', 
//             {
//                 notif:'Username atau Password salah !'
//             });
//         }
//     });    
//     //res.end();
// })

//----------------------------------------------- USER HOME -------------------------------------------------------

app.get('/', function(req, res)
{
	 res.redirect('/seasons');
    });

app.get('/seasons', function(req,res)
{
    connection.query('select * from seasons', function (err,rows)
{
    // res.render(__dirname + '/views/seasons',{data:rows});
     res.json(rows);
});
});


//----------------------------------------------- USER category -------------------------------------------------------

app.get('/category/:idseason', function(req,res){
    var sql = 'SELECT * FROM categoryseason WHERE idseason = ?';
    connection.query(sql, [req.params.idseason], function (err, rows) {
    res.render(__dirname + '/views/category',{data:rows})
})
})

//----------------------------------------------- USER product -------------------------------------------------------

app.get('/product/:idcategory', function(req,res){
    var sql = 'SELECT * FROM productseason WHERE idcategory = ?';
    connection.query(sql, [req.params.idcategory], function (err, rows) {
// console.log(rows);
    res.render(__dirname + '/views/product',{data:rows})
})
})

//----------------------------------------------- USER product detail -------------------------------------------------------

app.get('/productdetail/:productname', function(req, res){
    var sql = 'select * from productseason where id = ?';
    var sql2 = 'select * from productcolor where idproduct = ?';
    var sql3 = 'select * from productsize where idcolor = ?';
    connection.query(sql,[req.params.productname], function(err,rows){
        // res.json(rows[0].id)
        connection.query(sql2,[rows[0].id], function(err,data){
            connection.query(sql3,[req.query.productsize], function(err,data1){
                if(err) throw err;
                // res.json({rows, data, data1})
                res.render(__dirname + '/views/productdetail', {
                    product : rows,
                    productcolor : data,
                    productsize : data1
                })
            })    
        })
    })
})



//////////////////////////////////////////////////////////////admin/////////////////////////////////////////////////////////////////////////


app.get('/encrypt', function(req, res)
{
    const secret = 'abcdefg';
    const hash = crypto.createHmac('sha256', secret)
    .update('test')
    .digest('hex');

    console.log(hash);

    res.end();
})

app.get('/admin', function(req, res)
{
	res.render(__dirname + '/views/formlogin', 
    {
        notif:''
    });
})

app.get('/formregister', function(req, res)
{
    res.render(__dirname + '/views/formregister', 
    {

    });
})

app.post('/register', url, function(req, res)
{
    //console.log(req.body);
    
    var sql = 'SELECT * FROM users WHERE username = ?';
    connection.query(sql, [req.body.username], function (err, rows) {

        if (rows.length > 0)
        {
            res.render(__dirname + '/views/formlogin', 
            {
                notif:'Username sudah terdaftar !'
            });
        }
        else
        {
            const password = crypto.createHmac('sha256', secret)
            .update(req.body.password)
            .digest('hex');

            //console.log(password);

            connection.query("insert into users set ? ",
            {
                username : req.body.username,
                password : password,
            });

            connection.query("insert into register set ? ",
            {
                nama : req.body.name,
                email : req.body.email,
                telepon : req.body.phonenumber,
            });

            res.redirect('/admin');
        }
    });
})

app.get('/formlogin', function(req, res)
{
    res.render(__dirname + '/views/formlogin', 
    {
        notif:''
    });
})

app.post('/login', url, function(req, res)
{
    const password = crypto.createHmac('sha256', secret)
    .update(req.body.password)
    .digest('hex');

    var sql = 'SELECT * FROM users WHERE username = ? and password = ?';
    connection.query(sql, [req.body.username, password], function (err, rows) {
    //if (err) throw err;
    //console.log(rows[0].userid);

        if (rows.length > 0)
        {
            sess=req.session;
            sess.userid = rows[0].id;
            sess.username = rows[0].username;

            res.redirect('/adminseasons');
        }
        else
        {
            res.render(__dirname + '/views/formlogin', 
            {
                notif:'Username atau Password salah !'
            });
        }
    });    
    //res.end();
})

app.get('/adminseasons', function(req,res)
{
    sess = req.session;
    if(sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        connection.query("select * from seasons", function(err,rows,field){
            if (err) throw err;
            res.render(__dirname + '/views/adminseasons',
        {
            data : rows,
            username : sess.username
        })
        })
    }
})

//////////////////////////////////////////////////////////////logout/////////////////////////////////////////////////////////////////////////

app.get('/logout',function(req,res)
{
    req.session.destroy(function(err) 
    {
        if(err) 
        {
            console.log(err);
        } 
        else {
            res.redirect('/admin');
        }
    });
});

//////////////////////////////////////////////////////////////insert/////////////////////////////////////////////////////////////////////////

app.get('/admininsertseasons',function(req,res){
    sess = req.session;
    if (sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        res.render(__dirname + '/views/admininsertseasons',
    {
        username : sess.username
    })
    }
})

app.post ('/admininsertseasons', url, function(req,res)
{
    sess = req.session;
    if (sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        connection.query("insert into seasons set ? ",
    {
        season : req.body.seasons,
    })
    res.redirect('/adminseasons');
    }
})

//////////////////////////////////////////////////////////////delete/////////////////////////////////////////////////////////////////////////

app.get('/admdeleteseason/:id', function(req,res)
{
    sess = req.session;
    if (sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        connection.query("delete FROM seasons WHERE ? ",
    {
        id : req.params.id,
    });
    res.redirect('/adminseasons');
    }
})

//////////////////////////////////////////////////////////////edit/////////////////////////////////////////////////////////////////////////

app.get('/admineditseasons/:id',function(req,res){
    sess = req.session;
    if (sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        res.render(__dirname + '/views/admineditseasons',
    {
        id : req.params.id,
        username : sess.username,
    })
    }
})

app.post ('/updateseason/:id', url, function(req,res)
{
    sess = req.session;
    if (sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        connection.query("update seasons set ? WHERE ? ",
        [
            {
                season : req.body.seasons,
            },
            {
                id : req.params.id,
            }
        ]);
        
        res.redirect('/adminseasons');
    }
})


//////////////////////////////////////////////////////////////category/////////////////////////////////////////////////////////////////////////

var tempIDkat= '';
app.get('/admincategory/:id', function(req,res)
{
    tempIDkat = req.params.id
    sess = req.session;
    if(sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        var sql = "select * from categoryseason WHERE idseason = ? " 
        connection.query(sql,[req.params.id],function(err,rows,field)
        {
              
            res.render(__dirname + '/views/admincategory',
        {
            data : rows,
            username : sess.username
        });
        })
    }
})

//////////////////////////////////////////////////////////////editcategory/////////////////////////////////////////////////////////////////////////

app.get('/admineditcategory/:id',function(req,res){
    sess = req.session;
    if (sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        res.render(__dirname + '/views/admineditcategory',
    {
        id : req.params.id,
        username : sess.username,
    })
    }
})

app.post ('/updatecategory/:id', url, function(req,res)
{
    sess = req.session;
    if (sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        connection.query("update categoryseason set ? WHERE ? ",
        [
            {
                category : req.body.category,
                idseason : `${tempIDkat}`
            },
            {
                id : req.params.id,
            }
        ]);
        
        res.redirect(`/admincategory/${tempIDkat}`);
    }
})

//////////////////////////////////////////////////////////////deletecategory/////////////////////////////////////////////////////////////////////////

app.get('/admdeletecategory/:id', function(req,res)
{
    sess = req.session;
    if (sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        connection.query("delete FROM categoryseason WHERE ? ",
    {
        id : req.params.id,
    });
    res.redirect(`/admincategory/${tempIDkat}`);
    }
})

//////////////////////////////////////////////////////////////insertcategory/////////////////////////////////////////////////////////////////////////

app.get('/admininsertcategory',function(req,res){
    sess = req.session;
    if (sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        res.render(__dirname + '/views/admininsertcategory',
    {
        username : sess.username
    })
    }
})

app.post ('/nambahcategory', url, function(req,res)
{
    sess = req.session;
    if (sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        connection.query("insert into categoryseason set ? ",
    {
        category : req.body.category,
        idseason : `${tempIDkat}`
    })
    res.redirect(`/admincategory/${tempIDkat}`);
    }
})


/////////////////////////////////////////////////////////Product//////////////////////////////////////////////////////////////////////////////////

var tempIDpro ='';
app.get('/adminproduct/:id', function(req,res)
{
    tempIDpro = req.params.id
    sess = req.session;
    if(sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        var sql = "select * from productseason WHERE idcategory = ? " 
        connection.query(sql,[req.params.id],function(err,rows,field){
            res.render(__dirname + '/views/adminproduct',
        {
            data : rows,
            username : sess.username,
            id : req.params.id
        })
        })
    }
})

/////////////////////////////////////////////////////////Delete Product//////////////////////////////////////////////////////////////////////////////////

app.get('/admdeleteproduct/:id', function(req,res)
{
    sess = req.session;
    if (sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        connection.query("delete FROM productseason WHERE ? ",
    {
        id : req.params.id,
    });
    res.redirect(`/adminproduct/${tempIDpro}`);
    }
})

/////////////////////////////////////////////////////////edit Product//////////////////////////////////////////////////////////////////////////////////

app.get('/admineditproduct/:id',function(req,res){
    sess = req.session;
    {
        res.render(__dirname + '/views/admineditproduct',
    {
        id : req.params.id,
        username : sess.username,
    })
    }
})

app.post ('/updateproduct/:id', url, function(req,res)
{
    sess = req.session;
    {
        connection.query("update productseason set ? WHERE ? ",
        [
            {
                productname : req.body.productname,
                productdetail : req.body.productdetail,
                price : req.body.price
            },
            {
                id : req.params.id,
            }
        ]);
        
        res.redirect(`/adminproduct/${tempIDpro}`);
    }
})

//////////////////////////////////////////////////////////////////////insert product//////////////////////////////////////////////////////////////

app.get('/admininsertproduct',function(req,res){
    sess = req.session;
    if (sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        res.render(__dirname + '/views/admininsertproduct',
    {
        username : sess.username
    })
    }
})

app.post ('/nambahproduct', url, function(req,res)
{
    sess = req.session;
    if (sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        connection.query("insert into productseason set ? ",
    {
        productname : req.body.product,
        idcategory : `${tempIDpro}`,
        productdetail : req.body.detail,
        price : req.body.price
    })
    res.redirect(`/adminproduct/${tempIDpro}`);
    }

})

/////////////////////////////////////////////////// warna product ////////////////////////////////////////////////////////////////////////////////

var tempIDwar ='';
app.get('/adminwarna/:id', function(req,res)
{
    tempIDwar = req.params.id
    sess = req.session;
    if(sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        var sql = "select * from productcolor WHERE idproduct = ? " 
        connection.query(sql,[req.params.id],function(err,rows)
        { if(err) throw err;
            res.render(__dirname + '/views/adminwarna',
        {
            data : rows,
            username : sess.username,
        })
        })
    }
})

/////////////////////////////////////// edit warna ////////////////////////////////////////////////////////////////////////////////////////////

app.get('/admineditwarna/:id',function(req,res){
    sess = req.session;
    {
        res.render(__dirname + '/views/admineditwarna',
    {
        id : req.params.id,
        username : sess.username,
    })
    }
})

app.post ('/updatewarna/:id', url, function(req,res)
{
    sess = req.session;
    {
        connection.query("update productcolor set ? WHERE ? ",
        [
            {
                idproduct : `${tempIDwar}`,
                color : req.body.color
            },
            {
                id : req.params.id,
            }
        ]);
        
        res.redirect(`/adminwarna/${tempIDwar}`);
    }
})

//////////////////////////////////////////////////////////////////////insert warna//////////////////////////////////////////////////////////////

app.get('/admininsertwarna',function(req,res){
    sess = req.session;
    if (sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        res.render(__dirname + '/views/admininsertwarna',
    {
        username : sess.username
    })
    }
})

app.post ('/nambahwarna', url, function(req,res)
{
    sess = req.session;
    if (sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        connection.query("insert into productcolor set ? ",
    {
        idproduct : `${tempIDwar}`,
        color : req.body.warna
    })
    res.redirect(`/adminwarna/${tempIDwar}`);
    }
})

//////////////////////////////////////////////////////////////////////delete warna//////////////////////////////////////////////////////////////

app.get('/admdeletewarna/:id', function(req,res)
{
    sess = req.session;
    if (sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        connection.query("delete FROM productcolor WHERE ? ",
    {
        id : req.params.id,
    });
    res.redirect(`/adminwarna/${tempIDwar}`);
    }
})

//////////////////////////////////////////////////////////////////////size//////////////////////////////////////////////////////////////

var tempIDsiz ='';
app.get('/adminsize/:id', function(req,res)
{
    tempIDsiz = req.params.id
    sess = req.session;
    if(sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        var sql = "select * from productsize WHERE idcolor = ? " 
        connection.query(sql,[req.params.id],function(err,rows,field){
            res.render(__dirname + '/views/adminsize',
        {
            data : rows,
            username : sess.username,
            idsize : req.params.idsize
        })
        })
    }
})

//////////////////////////////////////////////////////////////////////edit size//////////////////////////////////////////////////////////////

app.get('/admineditsize/:idsize',function(req,res){
    sess = req.session;
    {
        res.render(__dirname + '/views/admineditsize',
    {
        idsize : req.params.idsize,
        username : sess.username,
    })
    }
})

app.post ('/updatesize/:idsize', url, function(req,res)
{
    sess = req.session;
    {
        connection.query("update productsize set ? WHERE ? ",
        [
            {
                idcolor : `${tempIDsiz}`,
                size : req.body.size,
                stock : req.body.stock
            },
            {
                idsize : req.params.idsize,
            }
        ]);
        
        res.redirect(`/adminsize/${tempIDsiz}`);
    }
})

//////////////////////////////////////////////////////////////////////delete size//////////////////////////////////////////////////////////////

app.get('/admdeletesize/:idsize', function(req,res)
{
    sess = req.session;
    if (sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        connection.query("delete FROM productsize WHERE ? ",
    {
        idsize : req.params.idsize,
    });
    res.redirect(`/adminsize/${tempIDsiz}`);
    }
})

//////////////////////////////////////////////////////////////////////insert size//////////////////////////////////////////////////////////////

app.get('/admininsertsize',function(req,res){
    sess = req.session;
    if (sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        res.render(__dirname + '/views/admininsertsize',
    {
        username : sess.username
    })
    }
})

app.post ('/nambahsize', url, function(req,res)
{
    sess = req.session;
    if (sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        connection.query("insert into productsize set ? ",
    {
        idcolor : `${tempIDsiz}`,
        size : req.body.ukuran,
        stock : req.body.stok
    })
    res.redirect(`/adminsize/${tempIDsiz}`);
    }
})

app.listen(3001);
