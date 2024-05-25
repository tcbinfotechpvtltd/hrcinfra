# Copyright (c) 2024, TCB InfoTech and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Site(Document):
    def after_insert(self):
        frappe.get_doc({
            'doctype':'Warehouse',
            'warehouse_name':self.site_name,
        }).insert()

        frappe.get_doc({
            'doctype':'Warehouse',
            'warehouse_name':self.site_name+" - Scrap",
            'custom_warehouse__type':"Scrap"
        }).insert()
        

    