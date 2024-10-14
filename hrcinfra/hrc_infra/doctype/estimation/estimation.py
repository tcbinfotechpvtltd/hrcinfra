# Copyright (c) 2024, TCB InfoTech and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


@frappe.whitelist()
def get_estimation(estimation_doc):
    
	estimation= frappe.get_doc('Estimation',estimation_doc)

	quotation_doc= frappe.new_doc('Quotation')
	quotation_doc.party_name= estimation.customer

	for item in estimation.product_table:
		quotation_doc.append('items',{
			'item_code':item.item,
			'qty':item.quantity,
			'rate':item.selling_rate,
		})

	quotation_doc.save()

	return quotation_doc.name

class Estimation(Document):
	pass
