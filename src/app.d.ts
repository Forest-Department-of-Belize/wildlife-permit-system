import type { SessionUser } from '$lib/utils/permissions';

declare global {
	namespace App {
		interface Locals {
			user: SessionUser | null;
		}
	}
}

export {};
