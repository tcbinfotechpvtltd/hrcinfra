# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt


import datetime
import json

import frappe
from frappe.model.document import Document
from frappe.utils import getdate
from frappe.custom.doctype.custom_field.custom_field import create_custom_field


class EmployeeAttendanceTool(Document):
	pass

def create_reports_field():
    column_break = {
        'fieldname': 'new_column_break',
        'fieldtype': 'Column Break',
        'insert_after': 'branch', 
    }
    create_custom_field('Employee Attendance Tool', column_break)

    custom_field = {
        'fieldname': 'reports_to',
        'label': 'Reports To',
        'fieldtype': 'Link',
        'options':'Employee',
        'insert_after': 'new_column_break', 
        'translatable': 0
    }
    create_custom_field('Employee Attendance Tool', custom_field)

create_reports_field()


# def remove_reports_field_and_column():
#     doctype = "Employee Attendance Tool"
#     fields_to_remove = ["reports_to", "new_column_break"]

#     for field_name in fields_to_remove:
#         if frappe.get_meta(doctype).has_field(field_name):
#             custom_field = frappe.get_doc("Custom Field", {
#                 "dt": doctype,
#                 "fieldname": field_name
#             })
#             custom_field.delete()
#             frappe.db.commit()
#             print(f"Custom field '{field_name}' has been removed from {doctype}")
#         else:
#             print(f"Custom field '{field_name}' does not exist in {doctype}")

# remove_reports_field_and_column()


@frappe.whitelist()
def get_employees(
	date: str | datetime.date,
	department: str | None = None,
	branch: str | None = None,
	company: str | None = None,
	reports_to: str | None = None,
) -> dict[str, list]:
	filters = {"status": "Active", "date_of_joining": ["<=", date]}

	for field, value in {"department": department, "branch": branch, "company": company, "reports_to": reports_to}.items():
		if value:
			filters[field] = value
	
	# Print the filters to debug
	print("Filters applied:", filters)

	employee_list = frappe.get_list(
		"Employee", fields=["employee", "employee_name", "reports_to"], filters=filters, order_by="employee_name"
	)

	# Print the employee list to debug
	print("Employees fetched:", employee_list)

	attendance_list = frappe.get_list(
		"Attendance",
		fields=["employee", "employee_name", "status"],
		filters={
			"attendance_date": date,
			"docstatus": 1,
		},
		order_by="employee_name"
	)

	unmarked_attendance = _get_unmarked_attendance(employee_list, attendance_list)

	return {"marked": attendance_list, "unmarked": unmarked_attendance}

def _get_unmarked_attendance(employee_list: list[dict], attendance_list: list[dict]) -> list[dict]:
	marked_employees = [entry.employee for entry in attendance_list]
	unmarked_attendance = []

	for entry in employee_list:
		if entry.employee not in marked_employees:
			unmarked_attendance.append(entry)

	return unmarked_attendance


@frappe.whitelist()
def mark_employee_attendance(
	employee_list: list | str,
	status: str,
	date: str | datetime.date,
	leave_type: str | None = None,
	company: str | None = None,
	late_entry: int | None = None,
	early_exit: int | None = None,
	shift: str | None = None,
) -> None:
	if isinstance(employee_list, str):
		employee_list = json.loads(employee_list)

	for employee in employee_list:
		leave_type = None
		if status == "On Leave" and leave_type:
			leave_type = leave_type

		attendance = frappe.get_doc(
			dict(
				doctype="Attendance",
				employee=employee,
				attendance_date=getdate(date),
				status=status,
				leave_type=leave_type,
				late_entry=late_entry,
				early_exit=early_exit,
				shift=shift,
			)
		)
		attendance.insert()
		attendance.submit()


