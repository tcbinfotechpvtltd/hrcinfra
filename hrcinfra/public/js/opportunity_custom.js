frappe.ui.form.on('Opportunity',{
    refresh: function(frm){
        frm.add_custom_button('Estimation',()=>{
            frappe.call({
                method:'hrcinfra.public.py.opportunity_custom.items_from_opportunity_to_estimation',
                args:{
                    opportunity:frm.doc.name,
                },
                callback: (r)=>{
                    if(r.message){
                        // frappe.set_route(view_type, doctype, docname);
                        frappe.set_route('Form','Estimation',r.message)
                    }
                }
            })
        },'Create')
       
    }
})

