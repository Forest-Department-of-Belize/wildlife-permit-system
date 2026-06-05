import { sql } from 'drizzle-orm';
import {
	boolean,
	date,
	index,
	integer,
	json,
	pgTable,
	serial,
	text,
	timestamp,
	uuid,
	varchar
} from 'drizzle-orm/pg-core';

export const roles = pgTable('roles', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 100 }).notNull().unique(),
	permissions: json('permissions').$type<string[]>().default([]),
	createdAt: timestamp('created_at').defaultNow()
});

export const districts = pgTable('districts', {
	id: serial('id').primaryKey(),
	uuid: uuid('uuid').notNull().default(sql`gen_random_uuid()`),
	name: varchar('name', { length: 100 }).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const ranges = pgTable('ranges', {
	id: serial('id').primaryKey(),
	uuid: uuid('uuid').notNull().default(sql`gen_random_uuid()`),
	name: varchar('name', { length: 100 }).notNull(),
	districtId: integer('district_id').references(() => districts.id),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	uuid: uuid('uuid').notNull().default(sql`gen_random_uuid()`),
	firstName: varchar('first_name', { length: 100 }).notNull(),
	lastName: varchar('last_name', { length: 100 }).notNull(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	password: varchar('password', { length: 255 }),
	roleId: integer('role_id').references(() => roles.id),
	rangeId: integer('range_id').references(() => ranges.id),
	isActive: boolean('is_active').default(true),
	firstLogin: boolean('first_login').default(true),
	setupToken: varchar('setup_token', { length: 255 }),
	setupTokenExpires: timestamp('setup_token_expires'),
	inviteToken: varchar('invite_token', { length: 255 }),
	inviteTokenExpires: timestamp('invite_token_expires'),
	resetToken: varchar('reset_token', { length: 255 }),
	resetTokenExpires: timestamp('reset_token_expires'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const applicants = pgTable(
	'applicants',
	{
		id: serial('id').primaryKey(),
		uuid: uuid('uuid').notNull().default(sql`gen_random_uuid()`),
		eriApplicantId: varchar('eri_applicant_id', { length: 50 }),
		firstName: varchar('first_name', { length: 100 }).notNull(),
		middleName: varchar('middle_name', { length: 100 }),
		lastName: varchar('last_name', { length: 100 }).notNull(),
		dateOfBirth: date('date_of_birth'),
		address1: varchar('address1', { length: 255 }),
		address2: varchar('address2', { length: 255 }),
		districtId: integer('district_id').references(() => districts.id),
		rangeId: integer('range_id').references(() => ranges.id),
		contactNumber: varchar('contact_number', { length: 20 }),
		contactNumberWhatsapp: boolean('contact_number_whatsapp').default(false),
		contactNumberSecondary: varchar('contact_number_secondary', { length: 20 }),
		contactNumberSecondaryWhatsapp: boolean('contact_number_secondary_whatsapp').default(false),
		email: varchar('email', { length: 255 }),
		occupation: varchar('occupation', { length: 100 }),
		company: varchar('company', { length: 100 }),
		governmentIdType: varchar('government_id_type', { length: 50 }),
		governmentIdNumber: varchar('government_id_number', { length: 100 }),
		applicantStatus: varchar('applicant_status', { length: 50 }),
		infoSource: varchar('info_source', { length: 100 }),
		parrotDiet: text('parrot_diet'),
		enclosureType: varchar('enclosure_type', { length: 100 }),
		cageLocation: varchar('cage_location', { length: 100 }),
		cageSizeFeet: varchar('cage_size_feet', { length: 50 }),
		sharedSeparate: varchar('shared_separate', { length: 50 }),
		doesFlyFree: boolean('does_fly_free').default(false),
		flyFreeWhen: varchar('fly_free_when', { length: 100 }),
		areWingsCut: boolean('are_wings_cut').default(false),
		applicantComments: text('applicant_comments'),
		ownershipComments: text('ownership_comments'),
		processStatus: varchar('process_status', { length: 100 }).default('Pending Call'),
		applicantNotes: text('applicant_notes'),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at').defaultNow()
	},
	(table) => [
		index('idx_applicants_range').on(table.rangeId),
		index('idx_applicants_district').on(table.districtId)
	]
);

export const parrotSpecies = pgTable('parrot_species', {
	id: serial('id').primaryKey(),
	uuid: uuid('uuid').notNull().default(sql`gen_random_uuid()`),
	commonName: varchar('common_name', { length: 100 }).notNull(),
	scientificName: varchar('scientific_name', { length: 100 }),
	imageUrl: text('image_url'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const permits = pgTable(
	'permits',
	{
		id: serial('id').primaryKey(),
		uuid: uuid('uuid').notNull().default(sql`gen_random_uuid()`),
		applicantId: integer('applicant_id').references(() => applicants.id),
		rangeId: integer('range_id').references(() => ranges.id),
		applicationId: integer('application_id'),
		infoSource: varchar('info_source', { length: 100 }),
		permitNumber: varchar('permit_number', { length: 100 }),
		referenceNumber: varchar('reference_number', { length: 100 }),
		applicationDate: date('application_date'),
		issueDate: date('issue_date'),
		numberOfPets: integer('number_of_pets').default(0),
		status: varchar('status', { length: 50 }).default('Processing'),
		housing: text('housing'),
		pictureUrl: text('picture_url'),
		permitComments: text('permit_comments'),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at').defaultNow()
	},
	(table) => [
		index('idx_permits_applicant').on(table.applicantId),
		index('idx_permits_range').on(table.rangeId)
	]
);

export const parrots = pgTable(
	'parrots',
	{
		id: serial('id').primaryKey(),
		uuid: uuid('uuid').notNull().default(sql`gen_random_uuid()`),
		applicantId: integer('applicant_id').references(() => applicants.id),
		speciesId: integer('species_id').references(() => parrotSpecies.id),
		permitId: integer('permit_id').references(() => permits.id),
		rangeId: integer('range_id').references(() => ranges.id),
		bandNumber: varchar('band_number', { length: 100 }),
		petName: varchar('pet_name', { length: 100 }),
		sex: varchar('sex', { length: 20 }),
		parrotAgeMonths: integer('parrot_age_months'),
		methodObtained: varchar('method_obtained', { length: 100 }),
		periodOfOwnershipMonths: integer('period_of_ownership_months'),
		housingDetails: text('housing_details'),
		hasParrot: varchar('has_parrot', { length: 20 }),
		whyNoParrot: text('why_no_parrot'),
		isHealthy: boolean('is_healthy').default(true),
		healthComments: text('health_comments'),
		stories: text('stories'),
		birdComments: text('bird_comments'),
		infoSource: varchar('info_source', { length: 100 }),
		eriBirdId: varchar('eri_bird_id', { length: 50 }),
		confiscated: boolean('confiscated').default(false),
		inspectionId: integer('inspection_id'),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at').defaultNow()
	},
	(table) => [index('idx_parrots_applicant').on(table.applicantId)]
);

export const applications = pgTable('applications', {
	id: serial('id').primaryKey(),
	uuid: uuid('uuid').notNull().default(sql`gen_random_uuid()`),
	applicantId: integer('applicant_id').references(() => applicants.id),
	rangeId: integer('range_id').references(() => ranges.id),
	status: varchar('status', { length: 50 }).default('Pending'),
	applicationDate: date('application_date'),
	notes: text('notes'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const inspections = pgTable(
	'inspections',
	{
		id: serial('id').primaryKey(),
		uuid: uuid('uuid').notNull().default(sql`gen_random_uuid()`),
		applicantId: integer('applicant_id').references(() => applicants.id),
		rangeId: integer('range_id').references(() => ranges.id),
		inspectorName: text('inspector_name'),
		inspectionDate: date('inspection_date'),
		inspectionStatus: varchar('inspection_status', { length: 50 }).default('scheduled'),
		notes: text('notes'),
		followupDate: date('followup_date'),
		followupNotes: text('followup_notes'),
		birdsDescribed: text('birds_described'),
		handTame: boolean('hand_tame').default(false),
		instructionsForApplicant: text('instructions_for_applicant'),
		expectedRecheck: date('expected_recheck'),
		preconditionsComments: text('preconditions_comments'),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at').defaultNow()
	},
	(table) => [index('idx_inspections_applicant').on(table.applicantId)]
);

export const calls = pgTable(
	'calls',
	{
		id: serial('id').primaryKey(),
		uuid: uuid('uuid').notNull().default(sql`gen_random_uuid()`),
		applicantId: integer('applicant_id').references(() => applicants.id),
		officerId: integer('officer_id').references(() => users.id),
		officerName: text('officer_name'),
		numberCalled: varchar('number_called', { length: 20 }),
		callDate: date('call_date'),
		language: varchar('language', { length: 50 }),
		isFunctional: boolean('is_functional').default(false),
		isAnswered: boolean('is_answered').default(false),
		isApplicant: boolean('is_applicant').default(false),
		isFullyCompleted: boolean('is_fully_completed').default(false),
		callNowConsent: boolean('call_now_consent').default(false),
		callLaterConsent: boolean('call_later_consent').default(false),
		callLaterDate: date('call_later_date'),
		consentsDigitalResources: boolean('consents_digital_resources').default(false),
		numNeighborsParrots: integer('num_neighbors_parrots').default(0),
		neighborhoodDescription: text('neighborhood_description'),
		callComments: text('call_comments'),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at').defaultNow()
	},
	(table) => [index('idx_calls_applicant').on(table.applicantId)]
);

export const compoundOffenses = pgTable(
	'compound_offenses',
	{
		id: serial('id').primaryKey(),
		uuid: uuid('uuid').notNull().default(sql`gen_random_uuid()`),
		applicantId: integer('applicant_id').references(() => applicants.id),
		officerId: integer('officer_id').references(() => users.id),
		officerName: text('officer_name'),
		rangeId: integer('range_id').references(() => ranges.id),
		offenseDate: date('offense_date'),
		illegalWildlife: text('illegal_wildlife'),
		cageSizeFeet: varchar('cage_size_feet', { length: 50 }),
		cageLocation: varchar('cage_location', { length: 100 }),
		reasonConfiscated: text('reason_confiscated'),
		handTame: boolean('hand_tame').default(false),
		priorHistory: boolean('prior_history').default(false),
		cageConfiscated: boolean('cage_confiscated').default(false),
		signedOfficer: boolean('signed_officer').default(false),
		signedOffender: boolean('signed_offender').default(false),
		signedDate: date('signed_date'),
		healthIssues: text('health_issues'),
		dietNotes: text('diet_notes'),
		offenseComments: text('offense_comments'),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at').defaultNow()
	},
	(table) => [index('idx_offenses_applicant').on(table.applicantId)]
);

export const auditLogs = pgTable('audit_logs', {
	id: serial('id').primaryKey(),
	userId: integer('user_id').references(() => users.id),
	action: varchar('action', { length: 100 }),
	tableName: varchar('table_name', { length: 100 }),
	recordId: integer('record_id'),
	details: text('details'),
	createdAt: timestamp('created_at').defaultNow()
});
