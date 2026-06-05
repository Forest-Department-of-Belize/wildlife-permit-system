CREATE TABLE "applicants" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"eri_applicant_id" varchar(50),
	"first_name" varchar(100) NOT NULL,
	"middle_name" varchar(100),
	"last_name" varchar(100) NOT NULL,
	"date_of_birth" date,
	"address1" varchar(255),
	"address2" varchar(255),
	"district_id" integer,
	"range_id" integer,
	"contact_number" varchar(20),
	"contact_number_whatsapp" boolean DEFAULT false,
	"contact_number_secondary" varchar(20),
	"contact_number_secondary_whatsapp" boolean DEFAULT false,
	"email" varchar(255),
	"occupation" varchar(100),
	"company" varchar(100),
	"government_id_type" varchar(50),
	"government_id_number" varchar(100),
	"applicant_status" varchar(50),
	"info_source" varchar(100),
	"parrot_diet" text,
	"enclosure_type" varchar(100),
	"cage_location" varchar(100),
	"cage_size_feet" varchar(50),
	"shared_separate" varchar(50),
	"does_fly_free" boolean DEFAULT false,
	"fly_free_when" varchar(100),
	"are_wings_cut" boolean DEFAULT false,
	"applicant_comments" text,
	"ownership_comments" text,
	"process_status" varchar(100) DEFAULT 'Pending Call',
	"applicant_notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"applicant_id" integer,
	"range_id" integer,
	"status" varchar(50) DEFAULT 'Pending',
	"application_date" date,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"action" varchar(100),
	"table_name" varchar(100),
	"record_id" integer,
	"details" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "calls" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"applicant_id" integer,
	"officer_id" integer,
	"officer_name" text,
	"number_called" varchar(20),
	"call_date" date,
	"language" varchar(50),
	"is_functional" boolean DEFAULT false,
	"is_answered" boolean DEFAULT false,
	"is_applicant" boolean DEFAULT false,
	"is_fully_completed" boolean DEFAULT false,
	"call_now_consent" boolean DEFAULT false,
	"call_later_consent" boolean DEFAULT false,
	"call_later_date" date,
	"consents_digital_resources" boolean DEFAULT false,
	"num_neighbors_parrots" integer DEFAULT 0,
	"neighborhood_description" text,
	"call_comments" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "compound_offenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"applicant_id" integer,
	"officer_id" integer,
	"officer_name" text,
	"range_id" integer,
	"offense_date" date,
	"illegal_wildlife" text,
	"cage_size_feet" varchar(50),
	"cage_location" varchar(100),
	"reason_confiscated" text,
	"hand_tame" boolean DEFAULT false,
	"prior_history" boolean DEFAULT false,
	"cage_confiscated" boolean DEFAULT false,
	"signed_officer" boolean DEFAULT false,
	"signed_offender" boolean DEFAULT false,
	"signed_date" date,
	"health_issues" text,
	"diet_notes" text,
	"offense_comments" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "districts" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "inspections" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"applicant_id" integer,
	"range_id" integer,
	"inspector_name" text,
	"inspection_date" date,
	"inspection_status" varchar(50) DEFAULT 'scheduled',
	"notes" text,
	"followup_date" date,
	"followup_notes" text,
	"birds_described" text,
	"hand_tame" boolean DEFAULT false,
	"instructions_for_applicant" text,
	"expected_recheck" date,
	"preconditions_comments" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "parrot_species" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"common_name" varchar(100) NOT NULL,
	"scientific_name" varchar(100),
	"image_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "parrots" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"applicant_id" integer,
	"species_id" integer,
	"permit_id" integer,
	"range_id" integer,
	"band_number" varchar(100),
	"pet_name" varchar(100),
	"sex" varchar(20),
	"parrot_age_months" integer,
	"method_obtained" varchar(100),
	"period_of_ownership_months" integer,
	"housing_details" text,
	"has_parrot" varchar(20),
	"why_no_parrot" text,
	"is_healthy" boolean DEFAULT true,
	"health_comments" text,
	"stories" text,
	"bird_comments" text,
	"info_source" varchar(100),
	"eri_bird_id" varchar(50),
	"confiscated" boolean DEFAULT false,
	"inspection_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "permits" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"applicant_id" integer,
	"range_id" integer,
	"application_id" integer,
	"info_source" varchar(100),
	"permit_number" varchar(100),
	"reference_number" varchar(100),
	"application_date" date,
	"issue_date" date,
	"number_of_pets" integer DEFAULT 0,
	"status" varchar(50) DEFAULT 'Processing',
	"housing" text,
	"picture_url" text,
	"permit_comments" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ranges" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"district_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"permissions" json DEFAULT '[]'::json,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255),
	"role_id" integer,
	"range_id" integer,
	"is_active" boolean DEFAULT true,
	"first_login" boolean DEFAULT true,
	"setup_token" varchar(255),
	"setup_token_expires" timestamp,
	"invite_token" varchar(255),
	"invite_token_expires" timestamp,
	"reset_token" varchar(255),
	"reset_token_expires" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "applicants" ADD CONSTRAINT "applicants_district_id_districts_id_fk" FOREIGN KEY ("district_id") REFERENCES "public"."districts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applicants" ADD CONSTRAINT "applicants_range_id_ranges_id_fk" FOREIGN KEY ("range_id") REFERENCES "public"."ranges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_applicant_id_applicants_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."applicants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_range_id_ranges_id_fk" FOREIGN KEY ("range_id") REFERENCES "public"."ranges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calls" ADD CONSTRAINT "calls_applicant_id_applicants_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."applicants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calls" ADD CONSTRAINT "calls_officer_id_users_id_fk" FOREIGN KEY ("officer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compound_offenses" ADD CONSTRAINT "compound_offenses_applicant_id_applicants_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."applicants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compound_offenses" ADD CONSTRAINT "compound_offenses_officer_id_users_id_fk" FOREIGN KEY ("officer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compound_offenses" ADD CONSTRAINT "compound_offenses_range_id_ranges_id_fk" FOREIGN KEY ("range_id") REFERENCES "public"."ranges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_applicant_id_applicants_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."applicants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_range_id_ranges_id_fk" FOREIGN KEY ("range_id") REFERENCES "public"."ranges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parrots" ADD CONSTRAINT "parrots_applicant_id_applicants_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."applicants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parrots" ADD CONSTRAINT "parrots_species_id_parrot_species_id_fk" FOREIGN KEY ("species_id") REFERENCES "public"."parrot_species"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parrots" ADD CONSTRAINT "parrots_permit_id_permits_id_fk" FOREIGN KEY ("permit_id") REFERENCES "public"."permits"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parrots" ADD CONSTRAINT "parrots_range_id_ranges_id_fk" FOREIGN KEY ("range_id") REFERENCES "public"."ranges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "permits" ADD CONSTRAINT "permits_applicant_id_applicants_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."applicants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "permits" ADD CONSTRAINT "permits_range_id_ranges_id_fk" FOREIGN KEY ("range_id") REFERENCES "public"."ranges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ranges" ADD CONSTRAINT "ranges_district_id_districts_id_fk" FOREIGN KEY ("district_id") REFERENCES "public"."districts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_range_id_ranges_id_fk" FOREIGN KEY ("range_id") REFERENCES "public"."ranges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_applicants_range" ON "applicants" USING btree ("range_id");--> statement-breakpoint
CREATE INDEX "idx_applicants_district" ON "applicants" USING btree ("district_id");--> statement-breakpoint
CREATE INDEX "idx_calls_applicant" ON "calls" USING btree ("applicant_id");--> statement-breakpoint
CREATE INDEX "idx_offenses_applicant" ON "compound_offenses" USING btree ("applicant_id");--> statement-breakpoint
CREATE INDEX "idx_inspections_applicant" ON "inspections" USING btree ("applicant_id");--> statement-breakpoint
CREATE INDEX "idx_parrots_applicant" ON "parrots" USING btree ("applicant_id");--> statement-breakpoint
CREATE INDEX "idx_permits_applicant" ON "permits" USING btree ("applicant_id");--> statement-breakpoint
CREATE INDEX "idx_permits_range" ON "permits" USING btree ("range_id");