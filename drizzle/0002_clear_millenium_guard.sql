CREATE TABLE "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"eri_comment_id" varchar(50),
	"applicant_id" integer,
	"comment_date" date,
	"comment_comments" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "applicants" RENAME COLUMN "contact_number_secondary" TO "contact_secondary";--> statement-breakpoint
ALTER TABLE "applicants" RENAME COLUMN "contact_number_secondary_whatsapp" TO "contact_secondary_whatsapp";--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "eri_application_id" varchar(50);--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "info_source" varchar(100);--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "application_signed" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "followup_done" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "followup_details" text;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "applied_previously" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "applied_previously_date" date;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "previously_approved" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "application_experience" text;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "application_comments" text;--> statement-breakpoint
ALTER TABLE "calls" ADD COLUMN "eri_call_id" varchar(50);--> statement-breakpoint
ALTER TABLE "calls" ADD COLUMN "know_applicant" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "calls" ADD COLUMN "relation_applicant" varchar(100);--> statement-breakpoint
ALTER TABLE "calls" ADD COLUMN "new_applicant_contact" varchar(20);--> statement-breakpoint
ALTER TABLE "calls" ADD COLUMN "scheduled_followup" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "calls" ADD COLUMN "followup_date" date;--> statement-breakpoint
ALTER TABLE "compound_offenses" ADD COLUMN "eri_confiscation_id" varchar(50);--> statement-breakpoint
ALTER TABLE "compound_offenses" ADD COLUMN "approx_date_acquired" varchar(100);--> statement-breakpoint
ALTER TABLE "compound_offenses" ADD COLUMN "less_12_months_acquired" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "inspections" ADD COLUMN "eri_inspection_id" varchar(50);--> statement-breakpoint
ALTER TABLE "inspections" ADD COLUMN "eri_preconditions_id" varchar(50);--> statement-breakpoint
ALTER TABLE "inspections" ADD COLUMN "officer_id" integer;--> statement-breakpoint
ALTER TABLE "inspections" ADD COLUMN "approx_report_date" date;--> statement-breakpoint
ALTER TABLE "inspections" ADD COLUMN "when_approx_report_date_provided" date;--> statement-breakpoint
ALTER TABLE "inspections" ADD COLUMN "date_acquired" date;--> statement-breakpoint
ALTER TABLE "inspections" ADD COLUMN "approx_date_acquired" varchar(100);--> statement-breakpoint
ALTER TABLE "inspections" ADD COLUMN "less_12_months_acquired" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "parrots" ADD COLUMN "eri_application_id" varchar(50);--> statement-breakpoint
ALTER TABLE "parrots" ADD COLUMN "banded" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "parrots" ADD COLUMN "parrot_status" varchar(50);--> statement-breakpoint
ALTER TABLE "parrots" ADD COLUMN "end_date" date;--> statement-breakpoint
ALTER TABLE "parrots" ADD COLUMN "when_no_parrot" text;--> statement-breakpoint
ALTER TABLE "parrots" ADD COLUMN "where_no_parrot" text;--> statement-breakpoint
ALTER TABLE "parrots" ADD COLUMN "date_parrot_loss_info_provided" date;--> statement-breakpoint
ALTER TABLE "parrots" ADD COLUMN "new_owner" varchar(100);--> statement-breakpoint
ALTER TABLE "parrots" ADD COLUMN "new_owner_address" varchar(255);--> statement-breakpoint
ALTER TABLE "parrots" ADD COLUMN "new_owner_contact" varchar(20);--> statement-breakpoint
ALTER TABLE "parrots" ADD COLUMN "species_descrip_by_applicant" text;--> statement-breakpoint
ALTER TABLE "parrots" ADD COLUMN "parrot_picture" text;--> statement-breakpoint
ALTER TABLE "parrots" ADD COLUMN "justification_sex_by_applicant" text;--> statement-breakpoint
ALTER TABLE "parrots" ADD COLUMN "parrot_age_description" text;--> statement-breakpoint
ALTER TABLE "parrots" ADD COLUMN "date_parrot_age_described" date;--> statement-breakpoint
ALTER TABLE "parrots" ADD COLUMN "town_obtained" varchar(100);--> statement-breakpoint
ALTER TABLE "parrots" ADD COLUMN "district_obtain" varchar(100);--> statement-breakpoint
ALTER TABLE "parrots" ADD COLUMN "period_of_ownership" text;--> statement-breakpoint
ALTER TABLE "parrots" ADD COLUMN "date_period_provided" date;--> statement-breakpoint
ALTER TABLE "parrots" ADD COLUMN "health_comms_by_professional" text;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_applicant_id_applicants_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."applicants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_comments_applicant" ON "comments" USING btree ("applicant_id");--> statement-breakpoint
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_officer_id_users_id_fk" FOREIGN KEY ("officer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;