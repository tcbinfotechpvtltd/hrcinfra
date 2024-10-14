import frappe

def execute(filters=None):
    columns = get_columns()
    data = get_data(filters)
    chart = get_chart(data)
    return columns, data, None, chart

def get_columns():
    return [
        {
            "label": "Project",  # This is the project name
            "fieldname": "project",
            "fieldtype": "Link",
            "options": "Project",
            "width": 180
        },
        {
            "label": "Project Stage",  # This is now fetched from Activity Type
            "fieldname": "custom_project_stage",
            "fieldtype": "Link",
            "options": "Activity Type",  # Linking to Activity Type
            "width": 180
        },
        {
            "label": "Custom Project Status",  # This is the numeric status field from Activity Type
            "fieldname": "stage_occurence",  # This will now refer to custom_project_status
            "fieldtype": "Int",  # Since this is an integer field
            "width": 100
        }
    ]


def get_data(filters):
    return frappe.db.sql("""
        SELECT 
            p.project_name as project,
            at.custom_project_stage as custom_project_stage,
            at.custom_project_stage as stage_occurence
        FROM `tabProject` p
        LEFT JOIN `tabActivity Type` at 
        ON p.custom_project_stage = at.name
        ORDER BY p.name
    """, as_dict=1)

def get_chart(data):
    return {
        "data": {
            "labels": [d.get("project") for d in data],  # X-axis: Project names
            "datasets": [
                {
                    "name": "Stage",  
                    "values": [d.get("stage_occurence") for d in data],  # Y-axis: stage values
                    "chartType": 'bar'  
                }
            ]
        },
        "type": "bar", 
        "height": 300,
        "colors": ["#7cd6fd"] 
    }
