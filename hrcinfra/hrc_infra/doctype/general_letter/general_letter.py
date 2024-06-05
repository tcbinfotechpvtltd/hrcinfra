# Copyright (c) 2024, TCB InfoTech and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from datetime import date
from hrcinfra.hrc_infra.constants import letter_types


class GeneralLetter(Document):
    pass


@frappe.whitelist()
def generate_ref_no(company, letter_type):
    # create ref_no for letter

    curr_year = str(date.today().year)[2:]
    next_year = str(int(curr_year) + 1)
    letter_type_abbr = ""

    total_letter_num = frappe.db.count("General Letter", {"company": company})
    insp_letter_num = frappe.db.count(
        "General Letter",
        {
            "company": company,
            "letter_type": letter_type,
        },
    )

    if letter_type and letter_type == letter_types[0]:
        letter_type_abbr = "INSP/"
        letter_num = insp_letter_num
    else:
        letter_num = total_letter_num - insp_letter_num + 1

    if letter_num == 0:
        letter_num = 1

    ref_no = (
        company
        + "/"
        + curr_year
        + "-"
        + next_year
        + "/"
        + letter_type_abbr
        + str(letter_num)
    )
    return ref_no
