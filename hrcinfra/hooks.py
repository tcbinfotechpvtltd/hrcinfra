app_name = "hrcinfra"
app_title = "HRC Infra"
app_publisher = "TCB InfoTech"
app_description = "HRC Infra"
app_email = "ajay.mahiwal@tcbinfotech.co.in"
app_license = "mit"
# required_apps = []

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/hrcinfra/css/hrcinfra.css"
# app_include_js = "/assets/hrcinfra/js/hrcinfra.js"

# include js, css files in header of web template
# web_include_css = "/assets/hrcinfra/css/hrcinfra.css"
# web_include_js = "/assets/hrcinfra/js/hrcinfra.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "hrcinfra/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
doctype_js = {"Asset": "public/js/asset.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "hrcinfra/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "hrcinfra.utils.jinja_methods",
# 	"filters": "hrcinfra.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "hrcinfra.install.before_install"
# after_install = "hrcinfra.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "hrcinfra.uninstall.before_uninstall"
# after_uninstall = "hrcinfra.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "hrcinfra.utils.before_app_install"
# after_app_install = "hrcinfra.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "hrcinfra.utils.before_app_uninstall"
# after_app_uninstall = "hrcinfra.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "hrcinfra.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

doc_events = {
    "Asset": {"validate": "hrcinfra.doc_events_hooks.asset.validate"}
    # "*": {
    # 	"on_update": "method",
    # 	"on_cancel": "method",
    # 	"on_trash": "method"
    # }
}

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"hrcinfra.tasks.all"
# 	],
# 	"daily": [
# 		"hrcinfra.tasks.daily"
# 	],
# 	"hourly": [
# 		"hrcinfra.tasks.hourly"
# 	],
# 	"weekly": [
# 		"hrcinfra.tasks.weekly"
# 	],
# 	"monthly": [
# 		"hrcinfra.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "hrcinfra.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "hrcinfra.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "hrcinfra.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["hrcinfra.utils.before_request"]
# after_request = ["hrcinfra.utils.after_request"]

# Job Events
# ----------
# before_job = ["hrcinfra.utils.before_job"]
# after_job = ["hrcinfra.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"hrcinfra.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app. # noqa: 501
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }

fixtures = ["Letter Head"]
doctype_js={
    'Project':'public/js/project_custom.js',
}

doc_events={
    "Project":{
        "after_insert":"hrcinfra.public.py.project_custom.after_insert"
    }
}