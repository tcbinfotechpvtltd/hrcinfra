import frappe


def validate(self, *args, **kwargs):

    valid_doctypes = ["Item", "Vehicle"]
    if self.custom_asset_type not in valid_doctypes:
        frappe.throw(
            f"Invalid Asset Type: {self.custom_asset_type}. Allowed asset types are {', '.join(valid_doctypes)}"
        )
