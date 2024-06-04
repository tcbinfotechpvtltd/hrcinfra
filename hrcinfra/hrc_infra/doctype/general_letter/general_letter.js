// Copyright (c) 2024, TCB InfoTech and contributors
// For license information, please see license.txt
frappe.ui.form.on("General Letter", {
  refresh: function (frm) {
    frm.trigger("toggle_fields");
    frm.trigger("update_ref_no");
  },

  // This function runs when the value of the 'letter_type' field changes
  letter_type: function (frm) {
    frm.trigger("toggle_fields");
    frm.trigger("update_ref_no");
  },
  company: function (frm) {
    frm.trigger("update_ref_no");
  },

  // Function to toggle visibility of fields
  toggle_fields: function (frm) {
    if (frm.doc.letter_type === "Inspection Insulator") {
      frm.set_df_property("table_insp", "hidden", 0);
      frm.set_df_property("insp_message", "hidden", 0);
      frm.set_df_property("place_of_inspection", "hidden", 0);
      frm.set_df_property("no_of_days_for_inspection", "hidden", 0);
      frm.set_df_property("contact_person", "hidden", 0);
      frm.set_df_property("weekly_off_day", "hidden", 0);
      frm.set_df_property("shutdown_message", "hidden", 1);
      frm.set_df_property("shutdown_return_message", "hidden", 1);
    } else if (frm.doc.letter_type === "Shutdown") {
      frm.set_df_property("table_insp", "hidden", 1);
      frm.set_df_property("insp_message", "hidden", 1);
      frm.set_df_property("place_of_inspection", "hidden", 1);
      frm.set_df_property("no_of_days_for_inspection", "hidden", 1);
      frm.set_df_property("contact_person", "hidden", 1);
      frm.set_df_property("weekly_off_day", "hidden", 1);
      frm.set_df_property("shutdown_message", "hidden", 0);
      frm.set_df_property("shutdown_return_message", "hidden", 1);
    } else {
      frm.set_df_property("table_insp", "hidden", 1);
      frm.set_df_property("insp_message", "hidden", 1);
      frm.set_df_property("place_of_inspection", "hidden", 1);
      frm.set_df_property("no_of_days_for_inspection", "hidden", 1);
      frm.set_df_property("contact_person", "hidden", 1);
      frm.set_df_property("weekly_off_day", "hidden", 1);
      frm.set_df_property("shutdown_message", "hidden", 1);
      frm.set_df_property("shutdown_return_message", "hidden", 0);
    }
  },

  // get ref_no
  update_ref_no: function (frm) {
    frappe.call({
      method:
        "hrcinfra.hrc_infra.doctype.general_letter.general_letter.generate_ref_no",
      args: {
        company: frm.doc.company,
        letter_type: frm.doc.letter_type,
      },
      callback: function (r) {
        if (r.message) {
          // Set the generated reference number in the form
          frm.set_value("ref_no", r.message);
        }
      },
    });
  },
});
