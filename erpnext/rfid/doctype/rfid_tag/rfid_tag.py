# Copyright (c) 2025, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class RFIDTag(Document):
    # begin: auto-generated types
    # This code is auto-generated. Do not modify anything in this block.

    from typing import TYPE_CHECKING

    if TYPE_CHECKING:
        from erpnext.rfid.doctype.rfid_detail.rfid_detail import RFIDDetail
        from frappe.types import DF

        amended_from: DF.Link | None
        brand: DF.Literal["City Petro", "Vina Pacific Petro", "Vimeco"]
        color: DF.Data | None
        customer: DF.Link | None
        ip_address: DF.Data | None
        item: DF.Link | None
        reinspection_date: DF.Date | None
        rfid_reader_name: DF.Link | None
        rfid_reading_time: DF.Datetime | None
        rfid_user: DF.Link | None
        rfids: DF.Table[RFIDDetail]
        serial_no: DF.Data | None
        tag: DF.Data | None
        warehouse: DF.Link | None
    # end: auto-generated types
    pass
