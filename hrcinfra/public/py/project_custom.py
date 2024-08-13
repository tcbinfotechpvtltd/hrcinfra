import frappe

def after_insert(doc, method):
    frappe.get_doc({
        'doctype':'Warehouse',
        'warehouse_name':doc.project_name,
        'custom_project':doc.project_name,
    }).insert()
    frappe.msgprint("Warehouse Succesfully Created.")
