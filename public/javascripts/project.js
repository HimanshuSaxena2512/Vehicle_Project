function showPicture()
{
    const file=vehiclepicture.files[0]
    vp.width=50
    vp.src=URL.createObjectURL(file)
}
$(document).ready(function(){

$.get('/vehicle/fillcategory',function(response){
 
    response.data.map((item)=>{
        $('#categoryid').append($('<option>').text(item.categoryname).val(item.categoryid))
    })

})

 $('#categoryid').change(function(){

    $.get('/vehicle/fillsubcategory',{categoryid:$('#categoryid').val()},function(response){

        $('#subcategoryid').empty()

        $('#subcategoryid').append($('<option>').text("-Select Sub-Category-"))

        response.data.map((item)=>{
       $('#subcategoryid').append($('<option>').text(item.subcategoryname).val(item.subcategoryid))
        })
    })
 })

})