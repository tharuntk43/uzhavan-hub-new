# Test script for Uzhavan Hub Auth and Multi-Plot Land Management System
import json
import sys
import database

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

def run_tests():
    print("=" * 60)
    print("RUNNING UZHAVAN HUB AUTH & LAND MANAGEMENT SYSTEM TESTS")
    print("=" * 60)

    # 1. Initialize DB
    database.init_db()
    print("✔ Step 1: Database initialized")

    # 2. Test Demo Accounts
    ok, res = database.login_farmer("murugan@uzhavan.hub", "Farmer@123")
    assert ok, f"Demo farmer login failed: {res}"
    user1 = res["user"]
    token1 = res["token"]
    assert user1["profile"]["full_name"] == "Murugan P.", "Murugan name mismatch"
    assert len(user1["plots"]) == 2, f"Murugan plots count mismatch: {len(user1['plots'])}"
    assert user1["total_acres"] == 5.5, f"Murugan acreage mismatch: {user1['total_acres']}"
    print(f"✔ Step 2: Murugan demo login verified (2 plots, {user1['total_acres']} acres)")

    # 3. Test Authentication of session token
    auth_user = database.authenticate_session(token1)
    assert auth_user is not None, "Failed to authenticate valid session token"
    assert auth_user["email"] == "murugan@uzhavan.hub"
    print("✔ Step 3: Session token authentication verified")

    # 4. Test Farmer Registration with multi-plot land details
    test_email = "selvam.farm@test.com"
    # Ensure clean state if previously run
    conn = database.get_connection()
    conn.execute("DELETE FROM users WHERE email = ?", (test_email,))
    conn.commit()
    conn.close()

    reg_payload = {
        "email": test_email,
        "password": "FarmPassword#456",
        "confirm_password": "FarmPassword#456",
        "full_name": "Selvam Kumar",
        "mobile_number": "9443312345",
        "preferred_language": "ta",
        "state": "Tamil Nadu",
        "district": "Coimbatore",
        "village": "Pollachi",
        "farmer_type": "Owner",
        "farming_experience": 12,
        "primary_activity": "Coconut & Spices Cultivation",
        "plots": [
            {
                "plot_name": "Pollachi Coconut Grove",
                "area": 5.0,
                "area_unit": "acres",
                "soil_type": "Red Loam",
                "soil_ph": "6.5",
                "irrigation_source": "Drip / Borewell",
                "water_availability": "Abundant / Year-round",
                "current_crop": "Coconut",
                "planned_crop": "Turmeric Intercrop",
                "farming_budget": 120000
            },
            {
                "plot_name": "South Well Paddy Patch",
                "area": 200.0,
                "area_unit": "cents",  # 200 cents = 2.0 acres
                "soil_type": "Clay Soil",
                "irrigation_source": "Canal",
                "water_availability": "Moderate",
                "current_crop": "Rice",
                "farming_budget": 40000
            }
        ]
    }

    ok_reg, reg_res = database.register_farmer(reg_payload)
    assert ok_reg, f"Registration failed: {reg_res}"
    selvam_user = reg_res["user"]
    selvam_token = reg_res["token"]
    assert len(selvam_user["plots"]) == 2, f"Expected 2 plots, got {len(selvam_user['plots'])}"
    # 5.0 acres + 2.0 acres = 7.0 acres
    assert selvam_user["total_acres"] == 7.0, f"Expected 7.0 acres total, got {selvam_user['total_acres']}"
    print(f"✔ Step 4: Multi-plot registration verified (Total Acres: {selvam_user['total_acres']})")

    # 5. Duplicate Email Rejection
    ok_dup, dup_res = database.register_farmer(reg_payload)
    assert not ok_dup, "Duplicate email registration should be rejected"
    assert "already exists" in dup_res["error"], f"Unexpected error message: {dup_res}"
    print("✔ Step 5: Duplicate registration prevention verified")

    # 6. Password Mismatch Rejection
    bad_pwd_payload = dict(reg_payload)
    bad_pwd_payload["email"] = "badpwd@test.com"
    bad_pwd_payload["confirm_password"] = "Mismatch123"
    ok_bad, bad_res = database.register_farmer(bad_pwd_payload)
    assert not ok_bad, "Password mismatch should fail"
    print("✔ Step 6: Password matching validation verified")

    # 7. Login with bad password rejection
    ok_bad_login, bad_login_res = database.login_farmer(test_email, "WrongPassword")
    assert not ok_bad_login, "Wrong password should fail"
    print("✔ Step 7: Invalid credentials rejection verified")

    # 8. Add a third plot for Selvam
    ok_add, new_plot = database.add_land_plot(selvam_user["id"], {
        "plot_name": "East Meadow Nursery",
        "area": 1.0,
        "area_unit": "hectare", # 1 hectare = 2.47 acres
        "soil_type": "Sandy Loam",
        "irrigation_source": "Borewell",
        "water_availability": "High",
        "current_crop": "Vegetables",
        "farming_budget": 30000
    })
    assert ok_add, f"Failed to add plot: {new_plot}"
    assert new_plot["area_acres"] == 2.47, f"Hectare conversion failed: {new_plot['area_acres']}"
    print("✔ Step 8: Additional plot addition with Hectare conversion verified (2.47 acres)")

    # 9. Update the plot
    ok_upd, updated_plot = database.update_land_plot(selvam_user["id"], new_plot["id"], {
        "plot_name": "East Meadow Organic Garden",
        "state": "Tamil Nadu",
        "district": "Coimbatore",
        "village": "Pollachi",
        "location_address": "Near River Road",
        "coordinates": "",
        "area": 1.5,
        "area_unit": "hectare", # 1.5 * 2.47105 = 3.71
        "ownership_status": "owned",
        "soil_type": "Sandy Loam",
        "soil_ph": "6.8",
        "fertility_details": "High organic carbon",
        "irrigation_source": "Drip",
        "water_availability": "High",
        "current_crop": "Organic Vegetables",
        "previous_crop": "Fallow",
        "planned_crop": "Tomato & Chilli",
        "planting_date": "2026-11-15",
        "farming_budget": 45000
    })
    assert ok_upd, f"Plot update failed: {updated_plot}"
    assert updated_plot["plot_name"] == "East Meadow Organic Garden"
    print("✔ Step 9: Land plot update verified")

    # 10. Multi-Tenant Authorization Isolation Check
    # Murugan should NOT be able to update or delete Selvam's plot
    ok_unauth_upd, unauth_res = database.update_land_plot(user1["id"], new_plot["id"], {"plot_name": "Hacked Name"})
    assert not ok_unauth_upd, "Security breach: User 1 updated User 2's land plot!"
    print("✔ Step 10: Multi-tenant cross-account isolation verified (Update denied)")

    ok_unauth_del, unauth_del_res = database.delete_land_plot(user1["id"], new_plot["id"])
    assert not ok_unauth_del, "Security breach: User 1 deleted User 2's land plot!"
    print("✔ Step 11: Multi-tenant cross-account isolation verified (Delete denied)")

    # 11. Delete Plot by authorized owner
    ok_del, del_res = database.delete_land_plot(selvam_user["id"], new_plot["id"])
    assert ok_del, f"Authorized plot deletion failed: {del_res}"
    print("✔ Step 12: Authorized land plot deletion verified")

    # 12. Update Farmer Profile
    ok_prof, prof_res = database.update_farmer_profile(selvam_user["id"], {
        "full_name": "Selvam K. (Organic Farmer)",
        "mobile_number": "9443312345",
        "preferred_language": "ta",
        "state": "Tamil Nadu",
        "district": "Coimbatore",
        "village": "Pollachi North",
        "farmer_type": "Owner",
        "farming_experience": 14,
        "primary_activity": "Certified Organic Spices & Coconuts"
    })
    assert ok_prof, f"Profile update failed: {prof_res}"
    assert prof_res["profile"]["full_name"] == "Selvam K. (Organic Farmer)"
    print("✔ Step 13: Farmer profile update verified")

    # 13. Logout
    database.logout_session(selvam_token)
    assert database.authenticate_session(selvam_token) is None, "Session still valid after logout"
    print("✔ Step 14: Session revocation & logout verified")

    print("=" * 60)
    print("ALL 14 BACKEND TESTS PASSED SUCCESSFULLY! 🌾")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
