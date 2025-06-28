import frappe
from frappe import _


@frappe.whitelist()
def disable_user(user):
    user = frappe.get_doc("User", user)
    user.enabled = 0
    user.save()
    return 200

@frappe.whitelist()
def enable_user(user):
    user = frappe.get_doc("User", user)
    user.enabled = 1
    user.save()

@frappe.whitelist()
def clean_before_scan_rfid(user, rfid_reader_name):
    enable_user(user)
    frappe.db.delete("RFID Bucket", {"rfid_reader_name": rfid_reader_name})

    return 200

@frappe.whitelist()
def get_rfid_by_reader(rfid_reader_name, rfid_reading_time):
    rfids = frappe.get_all(
        "RFID Bucket",
        filters={
            "rfid_reader_name": rfid_reader_name,
            "create_time": [">", rfid_reading_time],
        },
        fields=["tag"],  # thêm field tùy bạn
    )

    return [r["tag"] for r in rfids]