# Copyright (c) 2024, TCB InfoTech and contributors
# For license information, please see license.txt

import frappe


def after_insert(self, *args, **kwargs):
    frappe.get_doc(
        {
            "doctype": "Warehouse",
            "warehouse_name": self.project_name,
            "custom_project": self.project_name,
        }
    ).insert()

    frappe.get_doc(
        {
            "doctype": "Warehouse",
            "warehouse_name": self.project_name + " - scrap",
            "custom_warehouse__type": "Scrap",
            "custom_project": self.project_name,
        }
    ).insert()
