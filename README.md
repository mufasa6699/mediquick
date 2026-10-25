# MediQuick – Online Pharmacy & Medicine Delivery System

**Course:** CS4002 Fundamentals of Software Project Management (Section 9C)
**Jira project:** MOPDS – MediQuick - Online Pharmacy & Delivery System

## Project purpose
MediQuick connects patients and everyday customers with licensed local pharmacies.
Users can search a digital medicine catalogue, upload a doctor's prescription for
pharmacist verification, place orders, pay online or by cash on delivery, and track
their order in real time from placement to doorstep delivery. Partner pharmacies get
a dashboard to manage inventory and incoming orders.

## Group members
| Name | Role |
|------|------|
| Mustafa Haider | Backend Developer |
| Ahsan Elahi | Frontend Developer |

## Main technologies
- **Backend:** Node.js, Express (REST API)
- **Frontend:** HTML, CSS, vanilla JavaScript (served from `public/`)
- **Data:** JSON seed data (`src/data/`) for the prototype; relational DB planned
- **Testing:** Node.js built-in test runner (`node --test`)
- **Project management:** Jira (Scrum) integrated with GitHub

## Project structure
```
mediquick/
├── src/
│   ├── app.js          # Express app and route registration
│   ├── server.js       # Entry point
│   ├── routes/         # One router per feature (auth, catalogue, orders ...)
│   └── data/           # JSON seed data
├── public/             # Static frontend
├── tests/              # Automated tests
├── docs/               # Project documentation
└── package.json
```

## Getting started
```bash
npm install
npm start          # http://localhost:3000
npm test
```

## Development workflow (Jira ↔ GitHub)
- One branch per Jira issue: `MOPDS-<n>-short-description`
- Every commit message starts with the Jira key, e.g. `MOPDS-14 Add register endpoint`
- Every pull request title references the Jira key and is reviewed by the other member before merge
