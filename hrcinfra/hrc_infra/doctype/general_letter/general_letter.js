// Copyright (c) 2024, TCB InfoTech and contributors
// For license information, please see license.txt
frappe.ui.form.on("General Letter", {
  refresh: function (frm) {
    frm.set_value("date", new Date());
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
