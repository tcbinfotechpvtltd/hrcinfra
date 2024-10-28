// Copyright (c) 2024, TCB InfoTech and contributors
// For license information, please see license.txt

frappe.ui.form.on("Teams", {
	refresh(frm) {
        frm.set_query('gangleader',()=>{
            return{
                filters:{
                    'designation':['!=','Labour']
                }
            }
        });
        frm.fields_dict['table_vwhe'].grid.get_field('labour_name').get_query = (doc,cdt,cdn)=>{
            return{
                filters:{
                    'reports_to':doc.gangleader
                },
                // Give this query to the db
                // query:function(){
                //     frappe.new_doc('Employee',{
                //         'designation':'Labour',
                //         'reports_to':doc.gangleader
                //     })
                // }
            }
        }
        if (frm.doc.gangleader) {
            frm.add_custom_button('Fetch All Labourers', () => {
                console.log('Fetching Labourers for Gangleader:', frm.doc.gangleader); 
                frappe.call({
                    method: 'frappe.client.get_list',
                    args: {
                        doctype: 'Employee',
                        filters: [
                            ['designation', '=', 'Labour'],
                            ['reports_to', '=', frm.doc.gangleader]
                        ],
                        fields: ['employee_name', 'cell_number'],
                
                    },
                    callback: (r) => {
                        console.log('Response from get_list:', r); 
                        if (r.message && r.message.length > 0) {
                            frm.clear_table('table_vwhe');

                            r.message.forEach(function (emp) {
                                let row = frm.add_child('table_vwhe'); 
                                row.labour_name = emp.employee_name;
                                row.labour_contact = emp.cell_number; 
                            });

                            frm.refresh_field('table_vwhe');
                        } else {
                            console.log('No Labourers found.'); 
                            frappe.msgprint(__('No Labourers found for this Gangleader.')); 
                        }
                    },
                    error: (err) => {
                        console.error('Error fetching labourers:', err);
                        frappe.msgprint(__('An error occurred while fetching Labourers.')); 
                    }
                });
            });
        }

	},  
});

