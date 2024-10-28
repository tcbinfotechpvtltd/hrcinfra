import frappe


def after_insert(doc, method):

# get_doc is used for two purposed, to fetch existing documents or create a new document
# When you pass a dictionary of values with the 'doctype' key, 
# it creates a new document instance but does not save it until you call .insert() or .save()
    parent_warehouse_doc= frappe.get_doc({
        'doctype':'Warehouse',
        'warehouse_name':doc.project_name,
        'custom_project':doc.name, 
        'is_group': 1,
    })

    parent_warehouse_doc.insert()

    
    store_warehouse_doc= frappe.get_doc({
        'doctype':'Warehouse',
        'warehouse_name':f"{doc.project_name}-Store",
        'custom_project':doc.name, 
        'parent_warehouse': parent_warehouse_doc.name
    })

    store_warehouse_doc.insert()



    frappe.msgprint("Warehouse Successfully Created")