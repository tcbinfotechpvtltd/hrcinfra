// frappe.ui.form.on('Project', {
//     refresh: function(frm) {
//         console.log('Project form refreshed');
//     },
    
//     before_save: function(frm) {
//         console.log('Before saving Project');
        
//         if (frm.is_new()) {
//             console.log('This is a new Project, will create Warehouse');
            
//             frappe.call({
//                 method: 'frappe.client.insert',
//                 args: {
//                     doc: {
//                         doctype: 'Warehouse',
//                         warehouse_name: frm.doc.project_name
//                         // Add any other required fields for Warehouse
//                     }
//                 },
//                 callback: function(r) {
//                     console.log('Response from warehouse creation:', r);
//                     if (r.message) {
//                         frappe.show_alert({
//                             message: __('Warehouse created successfully'),
//                             indicator: 'green'
//                         });
//                     } else {
//                         console.error('Failed to create Warehouse');
//                         frappe.show_alert({
//                             message: __('Failed to create Warehouse'),
//                             indicator: 'red'
//                         });
//                     }
//                 }
//             });
//         } else {
//             console.log('This is an existing Project, not creating Warehouse');
//         }
//     }
// });