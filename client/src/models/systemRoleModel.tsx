export interface SystemRoleFormModel {
  id: number;
  roleName: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canApprove: boolean;
  canReport: boolean;
  recordStatusId: number;
}

