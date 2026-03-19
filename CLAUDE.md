Amapet | Dev Context Core Concept

Q&A Platform: Users create Circles (topics) to post questions & answers.

Documentation of libraries

- Use context7 where possible, if gathering information about a library to
  retrieve up-to-date information.

Tech Stack

- Frontend: Angular 20+, PrimeNG 20+, Tailwind CSS 4+
- Backend: Node.js, Express, Mongoose, MongoDB (REST API)
- Structure: /frontend/src/app | /backend

Frontend Rules

- Logic: Use Signals over RxJS where possible.
- API Calls: Use promise based where possible (simple http requests), use
  observables only if really needed (complex RxJS pipelines, integrating with
  other observable streams).
- Styling: Strict Tailwind utility classes; no custom CSS.
- UI: Use PrimeNG components; align with Design Tokens (theming).
- Standards: Standalone components, functional interceptors, inject(), input(),
  output() pattern.

Backend Rules

- Architecture: Controller-Service-Repository pattern.
- API: RESTful naming, JSON payloads, standard HTTP status codes.
- Validation: Use Joi for request body schema validation.
- Middleware: Centralized error handling and JWT-based Auth.
