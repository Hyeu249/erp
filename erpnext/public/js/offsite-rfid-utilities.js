let pollingInterval2 = null;

function clear_interval() {
	clearInterval(pollingInterval2);
	pollingInterval2 = null;
}

function start_getting_rfid(frm, cb) {
	if (pollingInterval2) {
		frappe.msgprint("Already polling...");
		return;
	}

	pollingInterval2 = setInterval(() => {
		frappe.call({
			method: "erpnext.rfid.api.get_rfid_by_reader",
			args: {
				rfid_reading_time: frm.doc.rfid_reading_time,
				rfid_reader_name: frm.doc.rfid_reader_name,
			},
			callback: function (r) {
				cb(r.message);
			},
		});
	}, 200);
}

function start_scan_rfid(frm, cb) {
	frappe.call({
		method: "erpnext.rfid.api.clean_before_scan_rfid",
		args: {
			user: frm.doc.rfid_user,
			rfid_reader_name: frm.doc.rfid_reader_name,
		},
		callback: function (r) {
			if (r.message === 200) {
				frm.set_value("rfid_reading_time", frappe.datetime.now_datetime());
				cb();
			} else {
				clear_interval();
				frappe.show_alert({
					message: `Lỗi ${err.message}, vui lòng liên hệ kỹ thuật!`,
					indicator: "red",
				});
			}
		},
	});
}

function stop_scan_rfid(frm, cb) {
	frappe.call({
		method: "erpnext.rfid.api.disable_user",
		args: {
			user: frm.doc.rfid_user,
		},
		callback: function (r) {
			if (r.message === 200) {
				cb();
			} else {
				frappe.show_alert({
					message: `Lỗi ${err.message}, vui lòng liên hệ kỹ thuật!`,
					indicator: "red",
				});
			}
			clear_interval();
		},
	});
}

function clear_cache_rfid(frm, cb = () => {}) {
	cb();
}
