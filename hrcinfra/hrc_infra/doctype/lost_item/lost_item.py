# Copyright (c) 2024, TCB InfoTech and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import nowdate, nowtime


class LostItem(Document):
	pass

@frappe.whitelist()
def material_issue_from_lost_item(document):

	today= nowdate()
	now= nowtime()

	lost_item_doc= frappe.get_doc('Lost Item',document)

	stock_entry_doc= frappe.new_doc('Stock Entry')

	stock_entry_doc.stock_entry_type= 'Lost Item'
	stock_entry_doc.posting_date= today
	stock_entry_doc.posting_time= now
	stock_entry_doc.from_warehouse= lost_item_doc.location_lost

	stock_entry_doc.append('items', {
        'item_code': lost_item_doc.item,
        'qty': lost_item_doc.quantity_lost,
    })		

	stock_entry_doc.insert()
	stock_entry_doc.submit()
