frappe.query_reports["Monthly Attendance Sheet HRC"] = {
	filters: [
		{
			fieldname: "month",
			label: __("Month"),
			fieldtype: "Select",
			reqd: 1,
			options: [
				{ value: 1, label: __("Jan") },
				{ value: 2, label: __("Feb") },
				{ value: 3, label: __("Mar") },
				{ value: 4, label: __("Apr") },
				{ value: 5, label: __("May") },
				{ value: 6, label: __("June") },
				{ value: 7, label: __("July") },
				{ value: 8, label: __("Aug") },
				{ value: 9, label: __("Sep") },
				{ value: 10, label: __("Oct") },
				{ value: 11, label: __("Nov") },
				{ value: 12, label: __("Dec") }
			],
			default: new Date().getMonth() + 1
		},
		{
			fieldname: "year",
			label: __("Year"),
			fieldtype: "Select",
			reqd: 1
		},
		{
			fieldname: "employee",
			label: __("Employee"),
			fieldtype: "Link",
			options: "Employee",
			get_query: () => {
				var company = frappe.query_report.get_filter_value("company");
				return {
					filters: {
						company: company
					}
				};
			}
		},
		{
			fieldname: "reports_to",
			label: "Reports To",
			fieldtype: "Link",
			options: "Employee"
		},
		{
			fieldname: "company",
			label: __("Company"),
			fieldtype: "Link",
			options: "Company",
			default: frappe.defaults.get_user_default("Company"),
			reqd: 1
		},
		{
			fieldname: "group_by",
			label: __("Group By"),
			fieldtype: "Select",
			options: ["", "Branch", "Grade", "Department", "Designation", "Project"]
		},
		{
			fieldname: "summarized_view",
			label: __("Summarized View"),
			fieldtype: "Check",
			default: 0
		}
	],

	onload: function () {
		return frappe.call({
			method: "hrcinfra.hrc_infra.report.monthly_attendance_sheet_hrc.monthly_attendance_sheet_hrc.get_attendance_years",
			callback: function (r) {
				var year_filter = frappe.query_report.get_filter("year");
				year_filter.df.options = r.message;
				year_filter.df.default = r.message.split("\n")[0];
				year_filter.refresh();
				year_filter.set_input(year_filter.df.default);
			}
		});
	},

	formatter: function (value, row, column, data, default_formatter) {
		value = default_formatter(value, row, column, data);
		const summarized_view = frappe.query_report.get_filter_value("summarized_view");
		const group_by = frappe.query_report.get_filter_value("group_by");

		if (group_by && column.colIndex === 1) {
			value = "<b>" + value + "</b>";
		}

		if (!summarized_view) {
			if ((group_by && column.colIndex > 3) || (!group_by && column.colIndex > 2)) {
				if (value == "P" || value == "WFH") {
					value = '<span style="background-color: #d4edda; color: #155724; padding: 2px 6px; border-radius: 3px;">' + value + '</span>';
				} else if (value == "A") {
					value = '<span style="background-color: #f8d7da; color: #721c24; padding: 2px 6px; border-radius: 3px;">' + value + '</span>';
				} else if (value == "HD") {
					value = '<span style="background-color: #fff3cd; color: #856404; padding: 2px 6px; border-radius: 3px;">' + value + '</span>';
				} else if (value == "L") {
					value = '<span style="background-color: #cce7ff; color: #004085; padding: 2px 6px; border-radius: 3px;">' + value + '</span>';
				}
			}
		}

		return value;
	}
};
