# Copyright (c) 2025, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document
import frappe


class RFIDBucket(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		create_time: DF.Datetime | None
		rfid_reader_name: DF.Link | None
		tag: DF.Data | None
	# end: auto-generated types
	pass

	def validate(self):
		current_user = frappe.session.user
		now = frappe.utils.now_datetime()

		if not self.create_time:
			self.create_time = now

		reader_name = frappe.get_value(
			"RFID Reader", {"rfid_user": current_user, "docstatus": 1}
		)
		if not self.rfid_reader and reader_name:
			self.rfid_reader = reader_name