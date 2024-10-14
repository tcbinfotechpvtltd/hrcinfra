frappe.ui.form.on('Activity Type',{
    refresh: function(frm){
        frm.add_custom_button('Task',()=>{
            frappe.new_doc('Task',{
                'custom_project_stage':frm.doc.name
            })
         
        },'Create')
    }
})