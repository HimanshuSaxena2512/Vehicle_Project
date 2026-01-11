var express = require('express');
var router = express.Router();
var {LocalStorage} = require("node-localstorage")
var localStorage = new LocalStorage('./scratch')
var pool=require('./pool')

/* GET home page. */
  
router.get('/admin_login',function(req,res){
  try{
  var admin=JSON.parse(localStorage.getItem('Admin'))
  if(admin==null)
  
  res.render('adminlogin',{message:''})
  
  else
    res.render('dashboard',{data:admin,status:true,message:'Login Successfully'})
}
catch
{
  res.render('adminlogin',{message:''})
}
})

router.post('/check_login',function(req,res){
pool.query("select * from admins where(emailid=? or mobileno=?) and password=?",[req.body.emailid,req.body.mobileno,req.body.password],function(error,result){

  if(error)
  {
    res.render('adminlogin',{data:[],status:false,message:'Database error...Pls contact with admin'})
  }
  else
  {
    if(result.length==1)
    {
      localStorage.setItem("Admin",JSON.stringify(result[0]))
       res.render('dashboard',{data:result[0],status:true,message:'Login Successfully'})
    }
    else
    {
      res.render('adminlogin',{data:[],status:false,message:'Invalid EmailId/Mobile Number/Password'})
    }
  }
})
})

router.get('/admin_logout',function(req,res){
  localStorage.clear()
  res.redirect('/admin/admin_login')
})


 

module.exports = router;
