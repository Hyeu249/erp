# Copyright (c) 2025, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document
import frappe


class RFIDReader(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		amended_from: DF.Link | None
		ip_address: DF.Data | None
		length: DF.Int
		reader_type: DF.Literal["Onsite", "Offsite"]
		rfid_reader_name: DF.Data | None
		rfid_reading_time: DF.Datetime | None
		rfid_user: DF.Link | None
		rfids: DF.LongText | None
	# end: auto-generated types
	pass

	def validate(self):
		if self.rfid_user and self.ip_address:
			frappe.throw("Chỉ được nhập 1 trong 2 trường: User hoặc IP Address!!")