import type { SessionUser } from './permissions';

export function getRangeFilter(user: SessionUser): number | null {
	if (user.role === 'Wildlife Program Manager') {
		return null;
	}
	return user.rangeId;
}
