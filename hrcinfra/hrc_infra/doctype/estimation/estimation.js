frappe.ui.form.on('Estimation', {
    refresh: function(frm) {
        calculate_total(frm);
    },
    overhead: function(frm) {
        update_overhead_percentage(frm);
        calculate_total(frm);
    },
    profit_perc: function(frm) {
        update_profit_percentage(frm);
        calculate_total(frm);
    }
});

function update_overhead_percentage(frm) {
    let overhead = frm.doc.overhead;
    if (frm.doc.product_table && frm.doc.product_table.length) {
        frm.doc.product_table.forEach(function(item) {
            frappe.model.set_value(item.doctype, item.name, 'overhead_percentage', overhead);
            calculate_selling_rate_and_amount(frm, item.doctype, item.name);
        });
    }
    frm.refresh_field('product_table');
}

function update_profit_percentage(frm) {
    let profit = frm.doc.profit_perc;
    if (frm.doc.product_table && frm.doc.product_table.length) {
        frm.doc.product_table.forEach(function(item) {
            frappe.model.set_value(item.doctype, item.name, 'profit_percentage', profit);
            calculate_selling_rate_and_amount(frm, item.doctype, item.name);
        });
    }
    frm.refresh_field('product_table');
}

frappe.ui.form.on('Estimation Item', {
    quantity: function(frm, cdt, cdn) {
        calculate_amount(frm, cdt, cdn);
        calculate_selling_rate_and_amount(frm, cdt, cdn);
        calculate_total(frm);
    },
    rate: function(frm, cdt, cdn) {
        calculate_amount(frm, cdt, cdn);
        calculate_selling_rate_and_amount(frm, cdt, cdn);
        calculate_total(frm);
    },
    overhead_percentage: function(frm, cdt, cdn) {
        calculate_selling_rate_and_amount(frm, cdt, cdn);
        calculate_total(frm);
    },
    profit_percentage: function(frm, cdt, cdn) {
        calculate_selling_rate_and_amount(frm, cdt, cdn);
        calculate_total(frm);
    },
    amount: function(frm, cdt, cdn) {
        calculate_total(frm);
    },
    selling_amount: function(frm, cdt, cdn) {
        calculate_total(frm);
    },
    product_table_remove: function(frm) {
        calculate_total(frm);
    },
    product_table_add: function(frm) {
        update_overhead_percentage(frm);
        update_profit_percentage(frm);
    }
});

function calculate_selling_rate_and_amount(frm, cdt, cdn) {
    let row = locals[cdt][cdn];
    if (row.rate && row.quantity) {
        // Calculate base amount
        let base_amount = flt(row.rate) * flt(row.quantity);
        frappe.model.set_value(cdt, cdn, 'amount', base_amount);

        // Calculate amount with overhead
        let amount_with_overhead = base_amount;
        if (row.overhead_percentage) {
            amount_with_overhead *= (1 + flt(row.overhead_percentage) / 100);
        }

        // Set selling rate and amount before profit
        let selling_rate = amount_with_overhead / flt(row.quantity);
        frappe.model.set_value(cdt, cdn, 'selling_rate', selling_rate);
        frappe.model.set_value(cdt, cdn, 'selling_amount', amount_with_overhead);

        // Calculate profit amount
        let profit_amount = 0;
        if (row.profit_percentage) {
            profit_amount = amount_with_overhead * (flt(row.profit_percentage) / 100);
            // Update selling amount with profit
            let final_selling_amount = amount_with_overhead + profit_amount;
            frappe.model.set_value(cdt, cdn, 'selling_amount', final_selling_amount);
            // Update selling rate
            selling_rate = final_selling_amount / flt(row.quantity);
            frappe.model.set_value(cdt, cdn, 'selling_rate', selling_rate);
        }

        // Store profit amount for later use in calculate_total
        row.profit_amount = profit_amount;
    } else {
        frappe.model.set_value(cdt, cdn, 'amount', 0);
        frappe.model.set_value(cdt, cdn, 'selling_rate', 0);
        frappe.model.set_value(cdt, cdn, 'selling_amount', 0);
        row.profit_amount = 0;
    }
}

function calculate_total(frm) {
    let total_amount = 0;
    let total_selling_amount = 0;
    let total_overhead_amount = 0;
    let total_profit_margin_amount = 0;
    
    let items = frm.doc.product_table || [];

    items.forEach(function(item) {
        let base_amount = flt(item.amount);
        total_amount += base_amount;

        // Calculate overhead amount for this row
        let overhead_amount = base_amount * (flt(item.overhead_percentage) / 100);
        total_overhead_amount += overhead_amount;

        // Add profit amount (calculated in calculate_selling_rate_and_amount)
        total_profit_margin_amount += flt(item.profit_amount);

        // Use the calculated selling_amount
        total_selling_amount += flt(item.selling_amount);
    });

    // Set overhead amount
    frm.set_value('overhead_amount', total_overhead_amount);

    // Set profit margin amount
    frm.set_value('profit_margin_amount', total_profit_margin_amount);

    // Set total estimated amount
    frm.set_value('total_estimated_amount', total_selling_amount);

    frm.refresh_fields(['overhead_amount', 'profit_margin_amount', 'total_estimated_amount']);
}
function calculate_amount(frm, cdt, cdn) {
    let row = locals[cdt][cdn];
    if (row.quantity && row.rate) {
        let amount = flt(row.quantity) * flt(row.rate);
        frappe.model.set_value(cdt, cdn, 'amount', amount);
    } else {
        frappe.model.set_value(cdt, cdn, 'amount', 0);
    }
}

frappe.ui.form.on('Estimation', {
    refresh: function (frm) {
        frm.add_custom_button(__("Create Quotation"), function () {
            let promises = frm.doc.product_table.map(row => {
                return new Promise((resolve) => {
                    frappe.db.get_value('Item', row.item, ['item_name', 'stock_uom'], (r) => {
                        resolve({
                            itemData: {
                                item_name: row.item,
                                item_name: r.item_name,
                                uom: r.stock_uom,
                                qty: row.quantity,
                                rate: row.selling_rate,
                                amount: row.selling_amount,
                            },
                            customItemData: {
                                item: row.item,
                                item_name: r.item_name,
                                uom: r.stock_uom,
                                quantity: row.quantity,
                                selling_rate: row.selling_rate,
                                selling_amount: row.selling_amount,
                            }
                        });
                    });
                });
            });

            Promise.all(promises).then(itemsData => {
                console.log('Items to be added:', itemsData);
                frappe.model.with_doctype('Quotation', function () {
                    let doc = frappe.model.get_new_doc('Quotation');
                    doc.quotation_to = 'Customer';
                    doc.party_name = frm.doc.customer;
                    doc.custom_estimation_id = frm.doc.name;

                    let total_qty = 0;
                    let total_amount = 0;

                    itemsData.forEach(data => {
                        let itemRow = frappe.model.add_child(doc, 'items');
                        Object.assign(itemRow, data.itemData);

                        let customItemRow = frappe.model.add_child(doc, 'custom_estimated_items');
                        Object.assign(customItemRow, data.customItemData);

                        // Update totals
                        total_qty += flt(data.customItemData.quantity);
                        total_amount += flt(data.customItemData.selling_amount);
                    });

                    // Set the calculated totals
                    doc.total_qty = total_qty;
                    doc.total = total_amount;

                    frappe.set_route('Form', 'Quotation', doc.name);
                });
            }).catch(error => {
                console.error('Error creating quotation:', error);
                frappe.throw(__('Error creating quotation. Please check the console for details.'));
            });
        });
    }
});
frappe.ui.form.on('Quotation', {
    refresh: function(frm) {
        // Function to toggle visibility
        function toggleTables() {
            if (frm.doc.custom_estimation_id) {
                frm.set_df_property('custom_estimated_items', 'hidden', 0);
                frm.set_df_property('items', 'hidden', 1);
            } else {
                frm.set_df_property('custom_estimated_items', 'hidden', 1);
                frm.set_df_property('items', 'hidden', 0);
            }
        }

        // Call the function on refresh
        toggleTables();

        // Also toggle when custom_estimation_id changes
        frm.fields_dict['custom_estimation_id'].df.onchange = function() {
            toggleTables();
        };
    },

    // Handle visibility when a new doc is loaded or created
    onload: function(frm) {
        if (frm.doc.custom_estimation_id) {
            frm.set_df_property('custom_estimated_items', 'hidden', 0);
            frm.set_df_property('items', 'hidden', 1);
        } else {
            frm.set_df_property('custom_estimated_items', 'hidden', 1);
            frm.set_df_property('items', 'hidden', 0);
        }
    }
});






























// Adding a new project adds a new warehourse.
