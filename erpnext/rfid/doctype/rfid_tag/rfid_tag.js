// Copyright (c) 2025, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt
ONSITE_MODULE_PATH = "/assets/erpnext/js/rfid-utilities.js";
OFFSITE_MODULE_PATH = "/assets/erpnext/js/offsite-rfid-utilities.js";

frappe.ui.form.on("RFID Tag", {
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

		frm.fields_dict["rfids"].grid.add_custom_button(
			__("Tag"),
			function () {
				const selected = frm.fields_dict["rfids"].grid.get_selected()?.[0];

				console.log("selected: ", selected);

				if (selected) {
					const maxRfid = frm.doc.rfids.find((e) => e.name === selected);
					frm.set_value("tag", maxRfid.rfid_tag);

					frappe.show_alert({
						message: `Tag: ${maxRfid.rfid} đã được thiết lập!`,
						indicator: "green",
					});
				} else {
					frappe.show_alert({ message: `Không có dòng nào trong bảng RFID.`, indicator: "red" });
				}
			},
			"bottom"
		);
	},

	scan_RFID(frm, module_path) {
		frappe.require(module_path).then(() => {
			const success_cb = () => {
				frappe.show_alert({ message: "Máy bắt đầu quét...!", indicator: "green" });

				start_getting_rfid(frm, (epcArray) => {
					epcArray.forEach((rfid) => {
						const rfid_found = frm.doc.rfids.find((r) => r.rfid_tag === rfid);

						if (rfid_found) {
							const count = rfid_found.count + 1;
							frappe.model.set_value(rfid_found.doctype, rfid_found.name, "count", count);
						} else {
							const rfid_row = frm.fields_dict.rfids.grid.add_new_row();
							frappe.model.set_value(rfid_row.doctype, rfid_row.name, "rfid_tag", rfid);
							frappe.model.set_value(rfid_row.doctype, rfid_row.name, "count", 1);
						}
					});

					frm.events.get_default_tag(frm);
				});

				console.log("success_cb!!");
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
				frm.clear_table("rfids");
				frm.refresh_field("rfids");
				frappe.show_alert({ message: "Đã xóa RFID cache!", indicator: "green" });
			};
			clear_cache_rfid(frm, success_cb);
		});
	},

	get_default_tag(frm) {
		if (frm.doc.rfids?.length === 0) return;

		const maxRfid = frm.doc.rfids?.reduce((prev, current) => {
			return current.count > prev.count ? current : prev;
		});

		if (maxRfid) frm.set_value("tag", maxRfid.rfid_tag);
	},
});
