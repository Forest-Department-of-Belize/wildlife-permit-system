import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { createPasswordResetToken } from '$lib/server/commands/auth';
import { sendPasswordResetEmail } from '$lib/server/services/email';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email') as string;

		if (!email) return fail(400, { error: 'Email is required' });

		const token = await createPasswordResetToken(email);
		if (token) {
			try {
				await sendPasswordResetEmail(email, token);
			} catch (e) {
				console.error('Email send failed:', e);
			}
		}

		return { success: 'If that email exists, a reset link has been sent' };
	}
};
