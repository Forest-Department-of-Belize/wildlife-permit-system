export type Permission =
	| 'applicants-view' | 'applicants-add' | 'applicants-edit' | 'applicants-delete'
	| 'parrots-view' | 'parrots-add' | 'parrots-edit' | 'parrots-delete'
	| 'permits-view' | 'permits-add' | 'permits-edit' | 'permits-delete'
	| 'applications-view' | 'applications-add' | 'applications-edit' | 'applications-delete'
	| 'inspections-view' | 'inspections-add' | 'inspections-edit' | 'inspections-delete'
	| 'calls-view' | 'calls-add' | 'calls-edit' | 'calls-delete'
	| 'offenses-view' | 'offenses-add' | 'offenses-edit' | 'offenses-delete'
	| 'comments-view' | 'comments-add' | 'comments-edit' | 'comments-delete'
	| 'species-view' | 'species-add' | 'species-edit' | 'species-delete'
	| 'districts-view' | 'districts-add' | 'districts-edit' | 'districts-delete'
	| 'ranges-view' | 'ranges-add' | 'ranges-edit' | 'ranges-delete'
	| 'users-view' | 'users-add' | 'users-edit' | 'users-delete'
	| 'import-data';

export function hasPermission(permissions: string[], permission: Permission): boolean {
	return permissions.includes(permission);
}

export function isAdmin(role: string): boolean {
	return role === 'Wildlife Program Manager';
}

export function isAdminOrOIC(role: string): boolean {
	return role === 'Wildlife Program Manager' || role === 'Range OIC';
}

export interface SessionUser {
	id: number;
	uuid: string;
	firstName: string;
	lastName: string;
	email: string;
	role: string;
	roleId: number;
	rangeId: number | null;
	rangeName: string | null;
	permissions: string[];
}
