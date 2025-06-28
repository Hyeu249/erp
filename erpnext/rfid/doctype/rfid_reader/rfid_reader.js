// Copyright (c) 2025, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt
ONSITE_MODULE_PATH = "/assets/erpnext/js/rfid-utilities.js";
OFFSITE_MODULE_PATH = "/assets/erpnext/js/offsite-rfid-utilities.js";

frappe.ui.form.on("RFID Reader", {
	onload: function (frm) {
		frm.toggle_display("rfid_user", frm.doc.reader_type === "Offsite");
		frm.toggle_display("ip_address", frm.doc.reader_type === "Onsite");
	},
	reader_type: function (frm) {
		frm.toggle_display("rfid_user", frm.doc.reader_type === "Offsite");
		frm.toggle_display("ip_address", frm.doc.reader_type === "Onsite");
	},
	refresh(frm) {
		frm.add_custom_button("Scan RFID", function () {
			if (frm.doc.ip_address) {
				frm.events.scan_RFID(frm, ONSITE_MODULE_PATH);
			} else if (frm.doc.rfid_user) {
				frm.events.scan_RFID(frm, OFFSITE_MODULE_PATH);
			} else {
				frappe.show_alert({ message: "Vui lòng chọn IP Address hoặc User!", indicator: "red" });
			}
		});

		frm.add_custom_button("Stop Scan", function () {
			if (frm.doc.ip_address) {
				frm.events.stop_scan_RFID(frm, ONSITE_MODULE_PATH);
			} else if (frm.doc.rfid_user) {
				frm.events.stop_scan_RFID(frm, OFFSITE_MODULE_PATH);
			} else {
				frappe.show_alert({ message: "Vui lòng chọn IP Address hoặc User!", indicator: "red" });
			}
		});

		frm.add_custom_button("Clear Cache RFID", function () {
			if (frm.doc.ip_address) {
				frm.events.clear_cache_RFID(frm, ONSITE_MODULE_PATH);
			} else if (frm.doc.rfid_user) {
				frm.events.clear_cache_RFID(frm, OFFSITE_MODULE_PATH);
			} else {
				frappe.show_alert({ message: "Vui lòng chọn IP Address hoặc User!", indicator: "red" });
			}
		});
	},

	validate(frm) {
		if (frm.doc.rfid_user && frm.doc.ip_address) {
			frappe.throw(__("Chỉ được nhập 1 trong 2 trường: User hoặc IP Address!"));
		}
	},

	scan_RFID(frm, module_path) {
		frappe.require(module_path).then(() => {
			const success_cb = (data) => {
				frappe.show_alert({ message: "Máy bắt đầu quét...!", indicator: "green" });

				start_getting_rfid(frm, (epcArray) => {
					const current = frm.doc.rfids || ""; // dùng chuỗi rỗng nếu null
					const currentEpcs = current
						.split("\n")
						.map((s) => s.trim())
						.filter((s) => s); // array từ rfids cũ

					// Lọc các epc mới chưa có trong currentEpcs
					const newEpcs = epcArray.filter((epc) => !currentEpcs.includes(epc));

					if (newEpcs.length > 0) {
						const updated = current + (current ? "\n" : "") + newEpcs.join("\n");
						frm.set_value("rfids", updated);
						frm.set_value("length", currentEpcs.length + newEpcs.length);
					}
					console.log("hello...!");
				});
			};
			start_scan_rfid(frm, success_cb);
		});
	},

	stop_scan_RFID(frm, module_path) {
		frappe.require(module_path).then(() => {
			const success_cb = (data) => {
				frappe.show_alert({ message: "Đã dừng quét RFID!", indicator: "green" });
			};
			stop_scan_rfid(frm, success_cb);
		});
	},

	clear_cache_RFID(frm, module_path) {
		frappe.require(module_path).then(() => {
			const success_cb = (data) => {
				frm.set_value("rfids", "");
				frm.set_value("length", 0);
				frappe.show_alert({ message: "Đã xóa RFID cache!", indicator: "green" });
			};
			clear_cache_rfid(frm, success_cb);
		});
	},
});
