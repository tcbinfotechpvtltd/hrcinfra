frappe.ui.form.on('Asset', {
    setup: function(frm) {
        // Restrict the custom_asset_type field to only allow 'Item' and 'Vehicle'
        frm.set_query('custom_asset_type', function() {
            return {
                filters: [
                    ['name','in', ['Item', 'Vehicle']]
                ],
            };
        });
    },
    

    // Clear the 'custom_asset' field if 'custom_asset_type' changes
    custom_asset_type: function(frm) {
        frm.set_value('custom_asset', null);
    },

});