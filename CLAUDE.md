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
- UI: Use PrimeNG components.
- Theming: Use best practices of primeng's theming concept:
  https://primeng.org/theming/styled.md
- Themes: always adjust for light and dark themes.
- Standards: Standalone components, functional interceptors, inject(), input(),
  output() pattern.

Backend Rules

- Architecture: Controller-Service-Repository pattern.
- API: RESTful naming, JSON payloads, standard HTTP status codes.
- Validation: Use Joi for request body schema validation.
- Middleware: Centralized error handling and JWT-based Auth.

E2E Tests

- at the very end of a task, where you added code to fix bugs or add
  functionality, read the @TESTS.md
- and either adjust affected tests by the changed code and adjust @TESTS.md
- or add a new test if the new code is not tested yet and add a concise line
  describing the tests in @TESTS.md

Finishing

- run e2e tests to verify regression did not happen
- if they are failing, report and make a plan to fix them and ask for
  confirmation before editing
