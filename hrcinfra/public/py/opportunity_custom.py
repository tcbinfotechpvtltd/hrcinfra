import frappe

@frappe.whitelist()
def items_from_opportunity_to_estimation(opportunity):

    opportunity_doc= frappe.get_doc('Opportunity',opportunity)

    estimation_doc= frappe.new_doc('Estimation')

    if opportunity_doc.opportunity_from=='Lead':
        estimation_doc.customer=''
    elif opportunity_doc.opportunity_from=='Customer':
        estimation_doc.customer=opportunity_doc.party_name

    for item in opportunity_doc.items:
        estimation_doc.append('product_table',{
            'item':item.item_code,
            'quantity':item.qty,            
        })

    estimation_doc.save()

    return estimation_doc.name
