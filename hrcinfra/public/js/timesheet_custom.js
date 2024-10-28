frappe.ui.form.on('Timesheet',{
    before_save: function(frm) {
        if (!frm.doc.company) {
            frappe.db.get_single_value('Global Defaults', 'default_company')
                .then(company => {
                    frm.set_value('company', company);
                    frm.save();
                });
        }
    },
    refresh: function(frm){
        frm.fields_dict['time_logs'].grid.get_field('task').get_query= function(doc,cdt,cdn){
            let row= locals[cdt][cdn];
            return{
                filters:{
                    'Status':['!=','Cancelled'],
                    'custom_project_stage':row.activity_type,
                }
            }
        }
        frm.remove_custom_button('Start Timer');
        frm.remove_custom_button('Resume Timer');
        frm.fields_dict['time_logs'].grid.get_field('employee').get_query= function(doc,cdt,cdn){
            return {
                filters:{
                    'status':['!=','Left'],
                    'reports_to':frm.doc.employee,
                }
            }
        }
    },
})


frappe.ui.form.on('Timesheet Detail', {
    onload: function(frm) {
        if(frm.doc.time_logs && frm.doc.custom_activity_type) {
            frm.doc.time_logs.forEach(function(row) {
                row.activity_type = frm.doc.custom_activity_type;
            });
            frm.refresh_field('time_logs');
        }
    },
    // time_logs_add is an event that is triggered when a new row is added to the child table
    time_logs_add: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        let time_logs = frm.doc.time_logs;

        row.activity_type= frm.doc.custom_activity_type;
        
        if (time_logs.length > 1) {
            let previous_row = time_logs[time_logs.length - 2];
        
            row.project = previous_row.project;    

            frm.refresh_field('time_logs');
        }
    }
});