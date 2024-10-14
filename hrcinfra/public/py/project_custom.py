import frappe


def after_insert(doc, method):

# get_doc is used for two purposed, to fetch existing documents or create a new document
# When you pass a dictionary of values with the 'doctype' key, 
# it creates a new document instance but does not save it until you call .insert() or .save()
    warehouse_doc= frappe.get_doc({
        'doctype':'Warehouse',
        'warehouse_name':doc.project_name,
        'custom_project_link':doc.name,
    })

    warehouse_doc.insert()

    frappe.msgprint("Warehouse Successfully Created")