# Copyright (c) 2024, TCB InfoTech and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class MiscellaneousExpense(Document):

    def after_insert(self):
        self.create_journal_entry()

    def on_submit(self):
        self.submit_journal_entry()


    def create_journal_entry(self):
        try:
            default_company = frappe.defaults.get_user_default("Company")
            hrc = frappe.get_doc("Company", default_company)

            je = frappe.new_doc("Journal Entry")
            je.voucher_type = "Journal Entry"
            je.posting_date = self.date
            je.custom_site = self.site

            # Credit Entry
            je.append(
                "accounts",
                {
                    "account": f"Miscellaneous Expenses - {hrc.abbr}",
                    "debit_in_account_currency": 0,
                    "credit_in_account_currency": self.amount,
                    "cost_center": f"Main - {hrc.abbr}",
                },
            )

            # Debit Entry
            je.append(
                "accounts",
                {
                    "account": f"Cash - {hrc.abbr}",
                    "debit_in_account_currency": self.amount,
                    "credit_in_account_currency": 0,
                    "cost_center": f"Main - {hrc.abbr}",
                },
            )

            je.insert()

        except Exception as e:
            frappe.throw(f"Error creating journal entry: {str(e)}")

    def submit_journal_entry(self):
        try:
            je = frappe.get_last_doc("Journal Entry")

            if je.docstatus == 0:
                je.submit()

        except Exception as e:
            frappe.throw(f"Error submitting journal entry: {str(e)}")
