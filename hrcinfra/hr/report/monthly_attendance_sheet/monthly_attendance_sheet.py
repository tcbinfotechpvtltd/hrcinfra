import frappe
from frappe.query_builder import DocType
from itertools import groupby
from hrms.hr.report.monthly_attendance_sheet.monthly_attendance_sheet import execute as original_execute
from hrms.hr.report.monthly_attendance_sheet.monthly_attendance_sheet import Filters


def custom_get_employee_related_details(filters: Filters) -> tuple[dict, list]:
    Employee = DocType("Employee")
    query = (
        frappe.qb.from_(Employee)
        .select(
            Employee.name,
            Employee.employee_name,
            Employee.designation,
            Employee.grade,
            Employee.department,
            Employee.branch,
            Employee.company,
            Employee.holiday_list,
            Employee.reports_to,
        )
        .where(Employee.company == filters.company)
    )

    if filters.get('reports_to'):
        query = query.where(Employee.reports_to == filters.reports_to)
    
    if filters.employee:
        query = query.where(Employee.name == filters.employee)

    group_by = filters.group_by
    if group_by:
        group_by = group_by.lower()
        query = query.orderby(group_by)

    employee_details = query.run(as_dict=True)

    group_by_param_values = []
    emp_map = {}

    if group_by:
        group_key = lambda d: d[group_by]  # noqa
        for parameter, employees in groupby(sorted(employee_details, key=group_key), key=group_key):
            group_by_param_values.append(parameter)
            emp_map.setdefault(parameter, frappe._dict())
            for emp in employees:
                emp_map[parameter][emp.name] = emp
    else:
        for emp in employee_details:
            emp_map[emp.name] = emp

    return emp_map, group_by_param_values

@frappe.whitelist()
def custom_execute(filters=None):
    # Inject the "Reports To" field into filters
    if not frappe.local.form_dict.get('filters'):
        frappe.local.form_dict.filters = {}
    
    filters_dict = frappe.parse_json(frappe.local.form_dict.filters)
    
    if not any(f.get('fieldname') == 'reports_to' for f in filters_dict):
        company_index = next((i for i, f in enumerate(filters_dict) if f.get('fieldname') == 'company'), -1)
        
        if company_index != -1:
            filters_dict.insert(company_index, {
                "fieldname": "reports_to",
                "label": "Reports To",
                "fieldtype": "Link",
                "options": "Employee"
            })
        
        frappe.local.form_dict.filters = frappe.as_json(filters_dict)
    
    # Call the original execute function
    columns, data = original_execute(filters)
    
    # Replace the original get_employee_related_details with our custom version
    frappe.get_attr("hrms.hr.report.monthly_attendance_sheet.monthly_attendance_sheet.get_employee_related_details")
    frappe.get_attr("hrms.hr.report.monthly_attendance_sheet.monthly_attendance_sheet.get_employee_related_details")
    import hrms.hr.report.monthly_attendance_sheet.monthly_attendance_sheet as original_module
    original_module.get_employee_related_details = custom_get_employee_related_details
    
    # Call the original execute function
    columns, data = original_execute(filters)
        
    return columns, data