#  Captive Wildlife Permit Management System
### Belize Forestry Department — Wildlife Program

**Developer:** Jevon Teul  
**Supervisor:** Mrs. Victoria Chi  
**Organization:** Belize Forestry Department  
**Live URL:** https://wildlife-permit-system.onrender.com  
**GitHub:** https://github.com/JevonTeul/-wildlife-permit-system  

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js + Express.js |
| Views | EJS + express-ejs-layouts |
| Styling | Bootstrap 5 + custom CSS |
| Database | PostgreSQL (Supabase cloud) |
| Email | Resend API |
| Hosting | Render.com (free tier) |
| Charts | Chart.js 4.4.0 |

---

## Project Structure

```
wildlife-permit-system/
 app.js                          # Main entry point
 .env                            # Environment variables (never commit!)
 db/
    index.js                    # Database connection pool
    schema.sql                  # Full database schema
    seed.sql                    # Seed data (roles, districts, species)
 controllers/                    # Route handlers
    applicantController.js
    parrotController.js
    permitController.js
    inspectionController.js
    callController.js
    offenseController.js
    speciesController.js
    districtController.js
    rangeController.js
    userController.js
    dashboardController.js
    authController.js
 models/                         # Database queries
    applicantModel.js
    parrotModel.js
    permitModel.js
    inspectionModel.js
    callModel.js
    offenseModel.js
    speciesModel.js
    districtModel.js
    rangeModel.js
    userModel.js
    roleModel.js
 routes/                         # Express routes
    [same modules as controllers]
 middleware/
    auth.js                     # isLoggedIn check
    permissions.js              # hasPermission check
    rangeFilter.js              # getRangeFilter helper
 views/
    layouts/
       main.ejs                # Main app layout with sidebar
       auth.ejs                # Login/reset layout
    dashboard/index.ejs
    applicants/                 # index, view, create, edit
    parrots/
    permits/
    inspections/
    calls/
    offenses/
    species/
    districts/
    ranges/
    users/
 public/
     css/style.css
     js/main.js
     images/species/             # Uploaded species images
```

---

## Environment Variables

Create a `.env` file in the root with:

```
DATABASE_URL=postgresql://postgres.ilsgioeaeystqyjtnrqk:Forestry%402026-2@aws-1-us-east-1.pooler.supabase.com:5432/postgres
SESSION_SECRET=wildlife_super_secret_key_change_this_later
NODE_ENV=production
RESEND_API_KEY=re_3QUeMXb6_ErW1wXS78oedBPbKQgs5qJT3
APP_URL=https://wildlife-permit-system.onrender.com
MAIL_USER=2022215700@ub.edu.bz
MAIL_PORT=587
```

---

## Database

Hosted on **Supabase**. Connection string above.

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
| session | Express session storage |

### Key Columns in Applicants

- `range_id` — which forest station manages this applicant
- `process_status` — workflow stage (Pending Call → Called → Inspection Booked → Inspection Done → Pending Compliance → Approved Awaiting Banding → Approved)
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

| Station | Districts Covered | range_id |
|---------|-------------------|----------|
| Orange Walk Forest Station | Corozal + Orange Walk | 1 |
| Belmopan Headquarters | Belize District | 2 |
| San Ignacio Forest Station | Cayo | 3 |
| Douglas D Silva Forest Station | Cayo (Mountain Pine Ridge) | 4 |
| Savanna Forest Station | Stann Creek | 5 |
| Machaca Forest Station | Toledo | 6 |

---

## Default Login Credentials

| User | Email | Password | Role |
|------|-------|----------|------|
| Admin | admin@forestry.gov.bz | Admin@2026 | Wildlife Program Manager |
| Mrs. Chi | Chivr@gobmail.gov.bz | Forestry@2026 | Wildlife Program Manager |

---

## How the App Works

### Workflow for a New Applicant

1. **Create Applicant** → Go to Applicants → Add Applicant
2. **Add Parrots** → Open applicant profile → Parrots tab → Add Parrot
3. **Issue Permit** → Permits tab → Add Permit
4. **Schedule Inspection** → Inspections tab → Schedule Inspection
5. **Log Calls** → Calls tab → Log Call
6. **Update Status** → Use the progress tracker dropdown on the profile

### Process Status Flow

```
Pending Call → Called → Inspection Booked → Inspection Done 
→ Pending Compliance → Approved Awaiting Banding → Approved
```

---

## Key Features

-  Role-based access control with range isolation
-  Mobile responsive sidebar layout
-  10-minute auto logout on inactivity
-  Dashboard with 4 Chart.js charts
-  Inspection calendar view
-  Progress tracker on applicant profile
-  Filter by district, letter, status on applicants
-  Separate search and filter on all list pages
-  Double-click rows to open records
-  Pre-select applicant when adding parrot/permit/inspection/call/offense
-  Pagination on applicants and permits
-  Notes tab on applicant profile
-  User invitation system with copy setup link

---

## Running Locally

```bash
git clone https://github.com/JevonTeul/-wildlife-permit-system
cd wildlife-permit-system
npm install
# Create .env file with variables above
node app.js
```

App runs on http://localhost:10000

---

## Deployment

Hosted on **Render.com** free tier. Pushes to `main` branch auto-deploy.

- Build command: `npm install`
- Start command: `node app.js`
- Environment variables set in Render dashboard

**Note:** Free tier spins down after 15 minutes of inactivity. First load may take 30-60 seconds to wake up.

---

## Adding New Features — For Interns

### Adding a new field to an existing form

1. Add the column to the database via psql
2. Update the model's `create` and `update` functions to include the new field
3. Update the view's form to include the new input
4. Test locally then push to GitHub

### Adding a new module

1. Create `models/newModel.js` with getAll, findByUuid, create, update, remove
2. Create `controllers/newController.js` with index, view, create, store, edit, update
3. Create `routes/new.js` with isLoggedIn and hasPermission middleware
4. Register the route in `app.js`
5. Add permissions to roles in the database
6. Create views in `views/new/` folder (index, view, create, edit)
7. Add to sidebar in `views/layouts/main.ejs` if needed

### Database changes

Always run schema changes via psql:
```bash
psql "DATABASE_URL" -c "ALTER TABLE tablename ADD COLUMN ..."
```

Never edit the Supabase dashboard directly as it can cause issues with the connection pool.

---

## 9 Parrot Species

| ID | Common Name | Scientific Name |
|----|-------------|-----------------|
| - | Scarlet Macaw | Ara macao |
| - | Yellow-headed Parrot | Amazona oratrix |
| - | Mealy Parrot | Amazona farinosa |
| - | Red-lored Parrot | Amazona autumnalis |
| - | White-fronted Parrot | Amazona albifrons |
| - | White-crowned Parrot | Pionus senilis |
| - | Yellow-lored Parrot | Amazona xantholora |
| - | Brown-hooded Parrot | Pyrilia haematotis |
| - | Olive-throated Parakeet | Eupsittula nana |

---

## Email Notes

Render.com blocks SMTP. Resend API is integrated but restricted to verified sender until domain is verified. Workaround: copy setup link button on users list page for sharing invite links via WhatsApp.

---

## Contact

**Developer:** Jevon Teul  
**Email:** 2022215700@ub.edu.bz  
**GitHub:** https://github.com/JevonTeul  