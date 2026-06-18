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
	lastName: varchar('last_name', { length: 100 }),
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
		eriBirdId: varchar('eri_bird_id', { length: 50 }),
		eriApplicationId: varchar('eri_application_id', { length: 50 }),
		applicantId: integer('applicant_id').references(() => applicants.id),
		speciesId: integer('species_id').references(() => parrotSpecies.id),
		permitId: integer('permit_id').references(() => permits.id),
		rangeId: integer('range_id').references(() => ranges.id),
		infoSource: varchar('info_source', { length: 100 }),
		banded: boolean('banded').default(false),
		bandNumber: varchar('band_number', { length: 100 }),
		parrotStatus: varchar('parrot_status', { length: 50 }),
		endDate: date('end_date'),
		hasParrot: boolean('has_parrot').default(false),
		whyNoParrot: text('why_no_parrot'),
		whenNoParrot: text('when_no_parrot'),
		whereNoParrot: text('where_no_parrot'),
		dateParrotLossInfoProvided: date('date_parrot_loss_info_provided'),
		newOwner: varchar('new_owner', { length: 100 }),
		newOwnerAddress: varchar('new_owner_address', { length: 255 }),
		newOwnerContact: varchar('new_owner_contact', { length: 20 }),
		speciesDescripByApplicant: text('species_descrip_by_applicant'),
		parrotPicture: text('parrot_picture'),
		petName: varchar('pet_name', { length: 100 }),
		sex: varchar('sex', { length: 20 }),
		justificationSexByApplicant: text('justification_sex_by_applicant'),
		parrotAgeDescription: text('parrot_age_description'),
		parrotAgeMonths: integer('parrot_age_months'),
		dateParrotAgeDescribed: date('date_parrot_age_described'),
		methodObtained: varchar('method_obtained', { length: 100 }),
		townObtained: varchar('town_obtained', { length: 100 }),
		districtObtain: varchar('district_obtain', { length: 100 }),
		periodOfOwnership: text('period_of_ownership'),
		periodOfOwnershipMonths: integer('period_of_ownership_months'),
		datePeriodProvided: date('date_period_provided'),
		housingDetails: text('housing_details'),
		isHealthy: boolean('is_healthy').default(true),
		healthComments: text('health_comments'),
		healthCommsByProfessional: text('health_comms_by_professional'),
		stories: text('stories'),
		birdComments: text('bird_comments'),
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
	eriApplicationId: varchar('eri_application_id', { length: 50 }),
	applicantId: integer('applicant_id').references(() => applicants.id),
	rangeId: integer('range_id').references(() => ranges.id),
	infoSource: varchar('info_source', { length: 100 }),
	status: varchar('status', { length: 50 }).default('Pending'),
	applicationDate: date('application_date'),
	applicationSigned: boolean('application_signed').default(false),
	followupDone: boolean('followup_done').default(false),
	followupDetails: text('followup_details'),
	appliedPreviously: boolean('applied_previously').default(false),
	appliedPreviouslyDate: date('applied_previously_date'),
	previouslyApproved: boolean('previously_approved').default(false),
	applicationExperience: text('application_experience'),
	applicationComments: text('application_comments'),
	notes: text('notes'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const inspections = pgTable(
	'inspections',
	{
		id: serial('id').primaryKey(),
		uuid: uuid('uuid').notNull().default(sql`gen_random_uuid()`),
		eriInspectionId: varchar('eri_inspection_id', { length: 50 }),
		eriPreconditionsId: varchar('eri_preconditions_id', { length: 50 }),
		applicantId: integer('applicant_id').references(() => applicants.id),
		officerId: integer('officer_id').references(() => users.id),
		rangeId: integer('range_id').references(() => ranges.id),
		inspectorName: text('inspector_name'),
		inspectionDate: date('inspection_date'),
		approxReportDate: date('approx_report_date'),
		whenApproxReportDateProvided: date('when_approx_report_date_provided'),
		inspectionStatus: varchar('inspection_status', { length: 50 }).default('scheduled'),
		notes: text('notes'),
		followupDate: date('followup_date'),
		followupNotes: text('followup_notes'),
		birdsDescribed: text('birds_described'),
		handTame: boolean('hand_tame').default(false),
		dateAcquired: date('date_acquired'),
		approxDateAcquired: varchar('approx_date_acquired', { length: 100 }),
		lessTwelveMonthsAcquired: boolean('less_12_months_acquired').default(false),
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
		eriCallId: varchar('eri_call_id', { length: 50 }),
		applicantId: integer('applicant_id').references(() => applicants.id),
		officerId: integer('officer_id').references(() => users.id),
		officerName: text('officer_name'),
		numberCalled: varchar('number_called', { length: 20 }),
		callDate: date('call_date'),
		language: varchar('language', { length: 50 }),
		isFunctional: boolean('is_functional').default(false),
		isAnswered: boolean('is_answered').default(false),
		isApplicant: boolean('is_applicant').default(false),
		knowApplicant: boolean('know_applicant').default(false),
		relationApplicant: varchar('relation_applicant', { length: 100 }),
		newApplicantContact: varchar('new_applicant_contact', { length: 20 }),
		callNowConsent: boolean('call_now_consent').default(false),
		callLaterConsent: boolean('call_later_consent').default(false),
		callLaterDate: date('call_later_date'),
		isFullyCompleted: boolean('is_fully_completed').default(false),
		scheduledFollowup: boolean('scheduled_followup').default(false),
		followupDate: date('followup_date'),
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
		eriConfiscationId: varchar('eri_confiscation_id', { length: 50 }),
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
		approxDateAcquired: varchar('approx_date_acquired', { length: 100 }),
		lessTwelveMonthsAcquired: boolean('less_12_months_acquired').default(false),
		priorHistory: boolean('prior_history').default(false),
		healthIssues: text('health_issues'),
		dietNotes: text('diet_notes'),
		cageConfiscated: boolean('cage_confiscated').default(false),
		signedOfficer: boolean('signed_officer').default(false),
		signedOffender: boolean('signed_offender').default(false),
		signedDate: date('signed_date'),
		offenseComments: text('offense_comments'),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at').defaultNow()
	},
	(table) => [index('idx_offenses_applicant').on(table.applicantId)]
);

export const comments = pgTable(
	'comments',
	{
		id: serial('id').primaryKey(),
		uuid: uuid('uuid').notNull().default(sql`gen_random_uuid()`),
		eriCommentId: varchar('eri_comment_id', { length: 50 }),
		applicantId: integer('applicant_id').references(() => applicants.id),
		commentDate: date('comment_date'),
		commentComments: text('comment_comments'),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at').defaultNow()
	},
	(table) => [index('idx_comments_applicant').on(table.applicantId)]
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
