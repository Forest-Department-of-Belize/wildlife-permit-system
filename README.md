# Captive Wildlife Permit Management System
### Forest Department of Belize — Wildlife Program

**Original Developer:** Jevon Teul  
**SvelteKit Migration:** Immanuel Garcia  
**Supervisor:** Mrs. Victoria Chi  
**Organization:** Forest Department of Belize  

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | SvelteKit 2 + Svelte 5 (runes) |
| ORM | Drizzle ORM |
| Database | PostgreSQL (Neon) |
| Database Driver | postgres.js |
| Architecture | CQRS (queries/commands separation) |
| Email | Resend API |
| Styling | Custom CSS |
| Hosting | Vercel (adapter-vercel) |

---

## Project Structure

```
wildlife-permit-system/
  src/
    app.css                           # Global styles
    app.html                          # HTML shell
    app.d.ts                          # App type declarations
    hooks.server.ts                   # Auth guard + session parsing
    lib/
      server/
        db/
          index.ts                    # Drizzle + postgres.js connection
          schema.ts                   # Full Drizzle schema (all tables)
        queries/                      # CQRS read side
          applicants.ts
          calls.ts
          common.ts                   # Districts, ranges, species, roles, users
          dashboard.ts
          inspections.ts
          offenses.ts
          parrots.ts
          permits.ts
        commands/                     # CQRS write side
          applicants.ts
          auth.ts
          calls.ts
          inspections.ts
          offenses.ts
          parrots.ts
          permits.ts
          users.ts                    # Users, districts, ranges, species
        services/
          email.ts                    # Resend integration
      components/
        Alert.svelte                  # Flash message component
        Pagination.svelte
        StatCard.svelte
      utils/
        permissions.ts               # RBAC helpers + SessionUser type
        range-filter.ts              # Range scoping for non-admin users
    routes/
      (auth)/                         # Public auth pages
        login/
        forgot-password/
        reset-password/[token]/
        setup-account/[token]/
      (app)/                          # Authenticated pages (sidebar layout)
        dashboard/
        applicants/
        parrots/
        permits/
        inspections/
        calls/
        offenses/
        species/
        users/
        districts/
        ranges/
        import/
      api/                            # JSON endpoints
      logout/
  drizzle.config.ts
  svelte.config.js
  vite.config.ts
```

---

## Environment Variables

```
DATABASE_URL=<neon-connection-string>
RESEND_API_KEY=<resend-api-key>
APP_URL=<deployed-url>
```

---

## Database

Hosted on **Neon**.

### Tables

| Table | Description |
|-------|-------------|
| users | System users (rangers, OICs, managers) |
| roles | Role definitions with JSON permissions array |
| ranges | Forest stations |
| districts | Belize districts |
| applicants | Permit applicants (main table) |
| permits | Issued permits |
| parrots | Birds registered to applicants |
| parrot_species | Species reference table |
| inspections | Site visit records |
| calls | Phone call logs |
| compound_offenses | Wildlife offense records |
| audit_logs | System activity log |

### Key Columns in Applicants

- `range_id` — which forest station manages this applicant
- `process_status` — workflow stage (Pending Call -> Called -> Inspection Booked -> Inspection Done -> Pending Compliance -> Approved Awaiting Banding -> Approved)
- `applicant_notes` — free text internal notes

---

## Roles & Permissions

| Role | Access |
|------|--------|
| Wildlife Program Manager | Full access to everything including users, districts, stations |
| Range OIC | Full access to their station's records + species management |
| Range Staff | View/add/edit records for their station only |
| Intern | View/add/edit applicants, parrots, permits, inspections |

Permissions are stored as a JSON array in the `roles` table. Example:
```json
["applicants-view", "applicants-add", "applicants-edit", "parrots-view"]
```

---

## Forest Stations & Districts

| Station | Districts Covered |
|---------|-------------------|
| Orange Walk Forest Station | Corozal + Orange Walk |
| Belmopan Headquarters | Belize District |
| San Ignacio Forest Station | Cayo |
| Douglas D Silva Forest Station | Cayo (Mountain Pine Ridge) |
| Savanna Forest Station | Stann Creek |
| Machaca Forest Station | Toledo |

---

## Default Login Credentials

| User | Email | Password | Role |
|------|-------|----------|------|
| Admin | admin@forestry.gov.bz | Admin@2026 | Wildlife Program Manager |
| Mrs. Chi | Chivr@gobmail.gov.bz | Forestry@2026 | Wildlife Program Manager |

---

## How the App Works

### Workflow for a New Applicant

1. **Create Applicant** — Go to Applicants, click Add Applicant
2. **Add Parrots** — Open applicant profile, Parrots tab, Add Parrot
3. **Issue Permit** — Permits tab, Add Permit
4. **Schedule Inspection** — Inspections tab, Schedule Inspection
5. **Log Calls** — Calls tab, Log Call
6. **Update Status** — Use the progress tracker dropdown on the profile

### Process Status Flow

```
Pending Call -> Called -> Inspection Booked -> Inspection Done
-> Pending Compliance -> Approved Awaiting Banding -> Approved
```

---

## Key Features

- Role-based access control with range isolation
- Mobile responsive sidebar layout
- 10-minute auto logout on inactivity
- Dashboard with chart data
- Progress tracker on applicant profile
- Filter by district, letter, status on applicants
- Pre-select applicant when adding parrot/permit/inspection/call/offense
- Pagination on list pages
- Notes tab on applicant profile
- User invitation system with setup link

---

## Running Locally

```bash
git clone <repo-url>
cd wildlife-permit-system
npm install
# Create .env file with variables above
npm run dev
```

---

## Deployment

Hosted on **Vercel** with `adapter-vercel`. Pushes to `main` branch auto-deploy.

Environment variables are set in the Vercel dashboard.

---

## Adding New Features

### Adding a new field to an existing form

1. Add the column in `src/lib/server/db/schema.ts`
2. Run `npm run db:push` to sync the schema to the database
3. Update the query in `src/lib/server/queries/` if needed
4. Update the command in `src/lib/server/commands/` to handle the new field
5. Add the input to the relevant `+page.svelte` form
6. Add the field to the form action in `+page.server.ts`

### Adding a new module

1. Define the table in `src/lib/server/db/schema.ts`
2. Create `src/lib/server/queries/newModule.ts` with list and get functions
3. Create `src/lib/server/commands/newModule.ts` with create, update, delete functions
4. Create route files under `src/routes/(app)/newModule/`:
   - `+page.server.ts` + `+page.svelte` (list)
   - `create/+page.server.ts` + `create/+page.svelte`
   - `[uuid]/+page.server.ts` + `[uuid]/+page.svelte` (view)
   - `[uuid]/edit/+page.server.ts` + `[uuid]/edit/+page.svelte`
5. Add permissions to roles in the database
6. Add the link to the sidebar in `src/routes/(app)/+layout.svelte`

### Database changes

Use Drizzle Kit to manage schema changes:
```bash
npm run db:push      # Push schema changes to the database
npm run db:generate  # Generate migration files
npm run db:migrate   # Run pending migrations
npm run db:studio    # Open Drizzle Studio to browse data
```

---

## 9 Parrot Species

| Common Name | Scientific Name |
|-------------|-----------------|
| Scarlet Macaw | Ara macao |
| Yellow-headed Parrot | Amazona oratrix |
| Mealy Parrot | Amazona farinosa |
| Red-lored Parrot | Amazona autumnalis |
| White-fronted Parrot | Amazona albifrons |
| White-crowned Parrot | Pionus senilis |
| Yellow-lored Parrot | Amazona xantholora |
| Brown-hooded Parrot | Pyrilia haematotis |
| Olive-throated Parakeet | Eupsittula nana |

---

## Email

Resend API is used for password reset and invitation emails. Restricted to verified sender until domain is verified. Workaround: copy setup link button on users list page for sharing invite links via WhatsApp.

---

## Contact

**Original Developer:** Jevon Teul  
**Migration:** Immanuel Garcia  
