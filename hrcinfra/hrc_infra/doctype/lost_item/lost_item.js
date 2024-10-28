// Copyright (c) 2024, TCB InfoTech and contributors
// For license information, please see license.txt

frappe.ui.form.on("Lost Item", {
	quantity_lost: function(frm) {
        if (frm.doc.item && frm.doc.quantity_lost){
            frappe.db.get_doc('Item',frm.doc.item)
            .then(i=>{
                let valuation = i.valuation_rate || 0;
                let quantity_lost = frm.doc.quantity_lost || 0;
                let approximate_value= valuation * quantity_lost
                frm.set_value('approximate_value',approximate_value)
            })
        }
	},
    item: function(frm){
        frappe.set_value('approximate_value',0)
    },
    refresh: function(frm){
        if(frm.doc.docstatus==1){
            frm.add_custom_button('Material Issue',()=>{
                frappe.call({
                    method:'hrcinfra.hrc_infra.doctype.lost_item.lost_item.material_issue_from_lost_item',
                    args:{
                        document: frm.doc.name,
                    },
                    callback: (r)=>{
                        frappe.msgprint("Item Lost Record Added")
                    }
                })
            },"Create")
        }

        // frm.set_query('location_lost',()=>{
        //     return{
        //         filters:{
        //             'custom_project_link':frm.doc.custom_project
        //         }
        //     }
        // })
        // frappe.call({
        //     method:'frappe.client.get_list',
        //     args:{
        //         doctype:'Warehouse',
        //         filters:{
        //             'custom_project_link':frm.doc.custom_project,
        //         },
        //         fields:['warehouse_name'],
        //         limit:1
        //     },
        //     callback: function(r) {
        //         if (r.message && r.message.length > 0) {
        //             frm.set_value('location_lost', r.message[0].warehouse_name);
        //         }
        //     }
        // })
    },
    reported_by: function(frm){
        fetch_employee_contacts(frm,'reported_by','contact_reported_by')
    },
    supervisor: function(frm){
        fetch_employee_contacts(frm,'supervisor','contact_supervisor')
    },
    
    
});

function fetch_employee_contacts(frm,employee_field,contact_field){
    if(frm.doc[employee_field]){
        frappe.call({
            method:'frappe.client.get',
            args:{
                doctype:'Employee',
                // Bracket notation instead of dot notation is used for dynamic property access
                name:frm.doc[employee_field]
            },
            callback: (r)=>{
                if(r.message){
                    frappe.set_value(frm.doc[contact_field],r.message.cell_number)
                }
            }
        })
    }
    else{
        frappe.set_value(frm.doc[contact_field],'')
    }
}