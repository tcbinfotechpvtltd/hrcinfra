# Copyright (c) 2024, TCB InfoTech and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class MiscellaneousExpense(Document):

    def after_insert(self):
        create_journal_entry(self)

    def on_submit(self):
        submit_journal_entry(self)



def create_journal_entry(self):
    try:

        je = frappe.new_doc('Journal Entry')
        je.voucher_type = 'Journal Entry'
        je.posting_date = self.date
        je.custom_site = self.site

        # Credit Entry
        je.append('accounts', {
            'account': 'Miscellaneous Expenses - HRC',
            'debit_in_account_currency': 0,
            'credit_in_account_currency': self.amount,
            'name': self.name,
            'cost_center': 'Main - HRC' 
        })

        # Debit Entry
        je.append('accounts', {
            'account': 'Cash - HRC',
            'debit_in_account_currency': self.amount,
            'credit_in_account_currency': 0,
            'name': self.name,
            'cost_center': 'Main - HRC' 
        })

        je.insert()
        
    except Exception as e:
        frappe.throw(f"Error creating journal entry: {str(e)}")

def submit_journal_entry(self):
    try:
            je = frappe.get_last_doc('Journal Entry')

            if je.docstatus == 0: 
                je.submit()
                
    except Exception as e:
        frappe.throw(f"Error submitting journal entry: {str(e)}")

