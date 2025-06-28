let pollingInterval = null;

function clear_interval() {
	clearInterval(pollingInterval);
	pollingInterval = null;
}

function tagReportingDataAndIndex(frm, cb) {
	fetch(`${frm.doc.ip_address}/InventoryController/tagReportingDataAndIndex`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((res) => {
			if (!res.ok) {
				// Không phải 2xx (ví dụ 500, 400)
				throw new Error(`HTTP ${res.status}`);
			}
			return res.json();
		})
		.then((response) => {
			const epcArray = response.data.map((item) => item.epcHex);

			return cb(epcArray);
		})
		.catch((err) => {
			clear_interval();
			frappe.show_alert({
				message: `Lỗi ${err.message}, vui lòng liên hệ kỹ thuật!`,
				indicator: "red",
			});
		});
}

function start_getting_rfid(frm, cb) {
	if (pollingInterval) {
		frappe.msgprint("Already polling...");
		return;
	}

	pollingInterval = setInterval(() => {
		tagReportingDataAndIndex(frm, cb);
	}, 200);
}

function start_scan_rfid(frm, cb) {
	fetch(`${frm.doc.ip_address}/InventoryController/startInventoryRequest`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			type: "Reader-startInventoryRequest",
			backgroundInventory: "false",
			tagFilter: {
				tagMemoryBank: "epc",
				bitOffset: 0,
				bitLength: 0,
				hexMask: null,
			},
		}),
	})
		.then((res) => {
			if (!res.ok) {
				// Không phải 2xx (ví dụ 500, 400)
				throw new Error(`HTTP ${res.status}`);
			}
			return res.json();
		})
		.then(cb)
		.catch((err) => {
			clear_interval();
			frappe.show_alert({
				message: `Lỗi ${err.message}, vui lòng liên hệ kỹ thuật!`,
				indicator: "red",
			});
		});
}

function stop_scan_rfid(frm, cb) {
	fetch(`${frm.doc.ip_address}/InventoryController/stopInventoryRequest`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ type: "Reader-stopInventoryRequest" }),
	})
		.then((res) => {
			if (!res.ok) {
				// Không phải 2xx (ví dụ 500, 400)
				throw new Error(`HTTP ${res.status}`);
			}
			return res.json();
		})
		.then((data) => {
			clear_interval();
			cb(data);
		})
		.catch((err) => {
			clear_interval();
			frappe.show_alert({
				message: `Lỗi ${err.message}, vui lòng liên hệ kỹ thuật!`,
				indicator: "red",
			});
		});
}

function clear_cache_rfid(frm, cb = () => {}) {
	fetch(`${frm.doc.ip_address}/InventoryController/clearCacheTagAndIndex`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((res) => {
			if (!res.ok) {
				// Không phải 2xx (ví dụ 500, 400)
				throw new Error(`HTTP ${res.status}`);
			}
			return res.json();
		})
		.then(cb)
		.catch((err) => {
			clear_interval();
			frappe.show_alert({
				message: `Lỗi ${err.message}, vui lòng liên hệ kỹ thuật!`,
				indicator: "red",
			});
		});
}
