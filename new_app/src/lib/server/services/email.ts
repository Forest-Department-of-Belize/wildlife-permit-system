import { Resend } from 'resend';
import { env } from '$env/dynamic/private';

const resend = new Resend(env.RESEND_API_KEY || 'placeholder');

export async function sendPasswordResetEmail(email: string, token: string) {
	const resetUrl = `${env.APP_URL}/reset-password/${token}`;
	await resend.emails.send({
		from: 'Wildlife Permit System <onboarding@resend.dev>',
		to: email,
		subject: 'Password Reset - Wildlife Permit System',
		html: `
			<h2>Password Reset Request</h2>
			<p>Click the link below to reset your password. This link expires in 1 hour.</p>
			<a href="${resetUrl}" style="background:#2E7D32;color:white;padding:12px 24px;text-decoration:none;border-radius:5px;display:inline-block;margin:10px 0;">
				Reset My Password
			</a>
			<p>If you did not request this, please ignore this email.</p>
			<p>Belize Forestry Department</p>
		`
	});
}

export async function sendInviteEmail(email: string, token: string, name: string) {
	const setupUrl = `${env.APP_URL}/setup-account/${token}`;
	await resend.emails.send({
		from: 'Wildlife Permit System <onboarding@resend.dev>',
		to: email,
		subject: 'Account Invitation - Wildlife Permit System',
		html: `
			<h2>Welcome, ${name}!</h2>
			<p>You've been invited to the Wildlife Permit System. Click below to set up your account. This link expires in 48 hours.</p>
			<a href="${setupUrl}" style="background:#2E7D32;color:white;padding:12px 24px;text-decoration:none;border-radius:5px;display:inline-block;margin:10px 0;">
				Set Up My Account
			</a>
			<p>Belize Forestry Department</p>
		`
	});
}
