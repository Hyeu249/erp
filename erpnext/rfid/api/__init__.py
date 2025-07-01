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
    rfids_bucket = frappe.get_all(
        "RFID Bucket",
        filters={
            "rfid_reader_name": rfid_reader_name,
            "create_time": [">", rfid_reading_time],
            "selected": False,
        },
        fields=["name", "tag"],  # thêm field tùy bạn
    )

    if rfids_bucket:
        RFIDBucket = frappe.qb.DocType("RFID Bucket")
        names = [r["name"] for r in rfids_bucket]

        (
            frappe.qb.update(RFIDBucket)
            .set(RFIDBucket.selected, 1)
            .where(RFIDBucket.name.isin(names))
        ).run()

    return [r["tag"] for r in rfids_bucket]