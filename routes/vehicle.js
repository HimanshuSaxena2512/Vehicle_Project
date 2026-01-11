const express = require('express')
const upload = require('./multer')
const pool = require('./pool')
const { render } = require('ejs')
const fs = require('fs')
var {LocalStorage} = require("node-localstorage")
var localStorage = new LocalStorage('./scratch')
const router = express.Router()

router.get('/vehicle_interface',function(req,res,next){
  try{
  var admin=JSON.parse(localStorage.getItem('Admin'))
  if(admin==null)
  
  res.render('adminlogin',{message:''})
  
  else
      res.render('vehicleinterface',{message:''})
}
catch
{
  res.render('adminlogin',{message:''})
}

})

router.post('/submit_vehicle',upload.single('vehiclepicture'),function(req,res){
    try{
      pool.query("insert into vehicle(categoryid, subcategoryid, vehiclename, features, description, price, offerprice, vehicletype, status, vehiclepicture) values(?,?,?,?,?,?,?,?,?,?)",[req.body.categoryid, req.body.subcategoryid, req.body.vehiclename, req.body.features, req.body.description, req.body.price, req.body.offerprice, req.body.vehicletype, req.body.status, req.file.filename],function(error,result){

      if(error)
      {
        console.log('Error',error)
          res.render('vehicleinterface',{message:'There is a issue in database..Pls contact with data administrator'})
      }
      else
      {
          res.render('vehicleinterface',{message:'Vehicle details submitted successfully..'})
      }

      })
       
    }
    catch(e)
    {
         res.render('vehicleinterface',{message:'Server Error..Pls contact with backend team'})
    }
})

router.get('/fillcategory',function(req,res){
    try
    {
        pool.query("select * from category",function(error,result){
        if(error)
        {
          res.json({data:[],status:false,message:'Database Error..Pls contact with database admin'})
        }
        else
        {
          res.json({data:result,status:true,message:'Success'})
        }

        })
    }
    catch
    {
     res.json({data:[],status:false,message:'Server Error..Pls contact with backend team'})
    }
  })
 

router.get('/fillsubcategory',function(req,res){
    try
    {
        pool.query("select * from subcategory where categoryid=?",[req.query.categoryid],function(error,result){
        if(error)
        {
          res.json({data:[],status:false,message:'Database Error..Pls contact with database admin'})
        }
        else
        {
          res.json({data:result,status:true,message:'Success'})
        }

        })
    }
    catch
    {
     res.json({data:[],status:false,message:'Server Error..Pls contact with backend team'})
    }
  })

  router.get('/display_all_vehicle',function(req,res){
   try{
  var admin=JSON.parse(localStorage.getItem('Admin'))
  if(admin==null)
  
  res.render('adminlogin',{message:''})
  
  else
   {   

   try{
    pool.query("select V.*,(select C.categoryname from category C where C.categoryid=V.categoryid) as categoryname, (select S.subcategoryname from subcategory S where S.subcategoryid=V.subcategoryid)as subcategoryname from vehicle V",function(error,result){

      if(error)
      {
        res.render('displayallvehicle',{status:false,data:[]})
      }
      else
      {
        res.render('displayallvehicle',{status:true,data:result})
      }

    })
  }
  catch(e)
  {
    res.render('displayallvehicle',{status:false,data:[]})
  }
  }
}
catch
{
  res.render('adminlogin',{message:''})
}

  })

  router.get('/show_vehicle',function(req,res){
   try{
    pool.query("select V.*,(select C.categoryname from category C where C.categoryid=V.categoryid) as categoryname, (select S.subcategoryname from subcategory S where S.subcategoryid=V.subcategoryid)as subcategoryname from vehicle V where V.vehicleid=?",[req.query.vehicleid],function(error,result){

      if(error)
      {
        res.render('showvehicle',{status:false,data:[]})
      }
      else
      {
        res.render('showvehicle',{status:true,data:result[0]})
      }

    })
  }
  catch(e)
  {
      res.render('showvehicle',{status:false,data:[]})
  }
  })


  router.post('/update_vehicle_data',function(req,res){
  if(req.body.btn=="Edit")
  {
    pool.query("update vehicle set categoryid=?, subcategoryid=?, vehiclename=?, features=?, description=?, price=?, offerprice=?, vehicletype=?, status=? where vehicleid=?",[req.body.categoryid,req.body.subcategoryid, req.body.vehiclename, req.body.features, req.body.description, req.body.price, req.body.offerprice, req.body.vehicletype, req.body.status, req.body.vehicleid],function(error,result){

      if(error)
      {
        res.redirect('/vehicle/display_all_vehicle')
      }
      else
      {
      res.redirect('/vehicle/display_all_vehicle')
      }

    })
  }
  else
  {
     pool.query("delete from vehicle where vehicleid=?",[req.body.vehicleid],function(error,result){

      if(error)
      {
        res.redirect('/vehicle/display_all_vehicle')
      }
      else
      {
        fs.unlink(`F:/vehicleproject/public/images/${req.body.vehiclepicture}`,function(err){
         if(err)
          {
            console.log(err)
          }
          else
          {
            console.log("Deleted")
          }
        })
      res.redirect('/vehicle/display_all_vehicle')
      
      }

    })
  }
   
  })

  router.get('/show_picture',function(req,res){
   
    res.render("showPicture",{data:req.query})
  })

  router.post('/edit_picture',upload.single('vehiclepicture'),function(req,res){
   
    pool.query("update vehicle set vehiclepicture=? where vehicleid=?",[req.file.filename,req.body.vehicleid],function(error,result){
      if(error)
      {
         res.redirect('/vehicle/display_all_vehicle')
      }
      else
      {
        fs.unlink(`F:/vehicleproject/public/images/${req.body.oldvehiclepicture}`,function(err){

          if(err)
          {
            console.log(err)
          }
          else
          {
            console.log("Deleted")
          }
        })
        res.redirect('/vehicle/display_all_vehicle')
        
      }
    })
  })

 


  

module.exports=router