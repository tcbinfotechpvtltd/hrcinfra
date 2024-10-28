frappe.ui.form.on('Warehouse', {
    refresh: function(frm) {
        frm.add_custom_button('Stock Ledger', function() {
            const filters = { 'warehouse': frm.doc.name };
            console.log('Navigating to:', 'query-report', 'Stock Ledger', filters); // Log route info
            frappe.set_route('query-report', 'Stock Ledger', filters);
        });
    }
});
