"""
Data Moat - Multi-Tenancy & Role-Based Access Control (RBAC) Service
Enforces strict logical tenant boundaries and role-based permissions across
Institutes, Owners, Teachers, Students, and Parents.
"""

from typing import Dict, List, Optional
from src.config import settings

class RBACManager:
    # Permissions definition
    PERMISSIONS = {
        settings.ROLE_PLATFORM_ADMIN: {
            "can_switch_tenant": True,
            "can_view_all_institutes": True,
            "can_view_financials": True,
            "can_import_data": True,
            "can_assign_interventions": True,
            "can_view_triage_roster": True,
            "can_view_model_eval": True,
            "can_export_data": True,
            "can_delete_data": True
        },
        settings.ROLE_INSTITUTE_OWNER: {
            "can_switch_tenant": False,
            "can_view_all_institutes": False,
            "can_view_financials": True,
            "can_import_data": True,
            "can_assign_interventions": True,
            "can_view_triage_roster": True,
            "can_view_model_eval": True,
            "can_export_data": True,
            "can_delete_data": False
        },
        settings.ROLE_TEACHER: {
            "can_switch_tenant": False,
            "can_view_all_institutes": False,
            "can_view_financials": False,
            "can_import_data": True,
            "can_assign_interventions": True,
            "can_view_triage_roster": True,
            "can_view_model_eval": True,
            "can_export_data": False,
            "can_delete_data": False
        },
        settings.ROLE_STUDENT: {
            "can_switch_tenant": False,
            "can_view_all_institutes": False,
            "can_view_financials": False,
            "can_import_data": False,
            "can_assign_interventions": False,
            "can_view_triage_roster": False,  # Zero shaming: no peer triage access
            "can_view_model_eval": False,
            "can_export_data": False,
            "can_delete_data": False
        },
        settings.ROLE_PARENT: {
            "can_switch_tenant": False,
            "can_view_all_institutes": False,
            "can_view_financials": False,
            "can_import_data": False,
            "can_assign_interventions": False,
            "can_view_triage_roster": False,  # Zero shaming: only see child's report
            "can_view_model_eval": False,
            "can_export_data": False,
            "can_delete_data": False
        }
    }

    @classmethod
    def check_permission(cls, role: str, permission: str) -> bool:
        """Returns True if role possesses requested permission."""
        role_perms = cls.PERMISSIONS.get(role, {})
        return role_perms.get(permission, False)

    @classmethod
    def verify_tenant_access(cls, active_institute_id: str, record_institute_id: str) -> bool:
        """
        Validates that access to an institute-owned record matches the active tenant session.
        Prevents cross-tenant leaks.
        """
        if not active_institute_id or not record_institute_id:
            return False
        return active_institute_id == record_institute_id

rbac = RBACManager()
