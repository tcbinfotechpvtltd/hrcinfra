frappe.ui.form.on('Project', {
	refresh: function(frm) {
		$('.row.form-dashboard-section.form-heatmap').hide();
	}
});
frappe.ui.form.on('Project',{
	onload (frm) {
	setTimeout(() => {
		// $("[data-doctype='BOM']").hide();
		// $("[data-doctype='Timesheet']").hide()
		$("[data-doctype='Task']").hide()
		}, 10);
	}
})
