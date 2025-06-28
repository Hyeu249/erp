// Copyright (c) 2025, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt
ONSITE_MODULE_PATH = "/assets/erpnext/js/rfid-utilities.js";
OFFSITE_MODULE_PATH = "/assets/erpnext/js/offsite-rfid-utilities.js";

frappe.ui.form.on("RFID Tag", {
	refresh(frm) {
		frm.add_custom_button("Get RFID", function () {
			if (frm.doc.ip_address) {
				frm.events.get_RFID(frm, ONSITE_MODULE_PATH);
			} else if (frm.doc.rfid_user) {
				frm.events.get_RFID(frm, OFFSITE_MODULE_PATH);
			} else {
				frappe.show_alert({ message: "Vui lòng chọn IP Address hoặc User!", indicator: "red" });
			}
		});
	},

	get_RFID(frm, module_path) {
		frappe.require(module_path).then(() => {
			const success_cb = (data) => {
				start_getting_rfid(frm, (epcArray) => {
					if (epcArray.length > 0) {
						frm.set_value("tag", epcArray[0]);
						frm.events.stop_scan_RFID(frm, module_path);
					}
				});
			};
			start_scan_rfid(frm, success_cb);
		});
	},

	stop_scan_RFID(frm, module_path) {
		frappe.require(module_path).then(() => {
			const success_cb = (data) => {};
			stop_scan_rfid(frm, success_cb);
		});
	},
});
