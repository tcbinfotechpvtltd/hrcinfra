frappe.query_reports["Project-Stage"] = {
    "filters": [
        // {
        //     "fieldname": "status",
        //     "label": "Project Status",
        //     "fieldtype": "Select",
        //     "options": ["Active", "Completed", "Cancelled"],
        //     "default": "Active"
        // }
    ],
    chart: {
        type: 'bar',  // Change to 'bar' for a bar chart
        height: 300,
        data: {
            labels: [],  // Stages will be filled here
            datasets: [{
                name: "Projects",
                values: []  // Project counts will be filled here
            }]
        }
    },
    before_render: function(report) {
        let data = report.data; // Get the report data
        let labels = data.map(d => d.custom_project_stage); // Get stage names
        let values = data.map(d => d.project_count); // Get project counts

        // Populate the chart data
        report.chart.data.labels = labels;
        report.chart.data.datasets[0].values = values; // Set values for the bar chart
    }
};
