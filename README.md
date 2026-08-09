# BrAInstorm

BrAInstorm is a full-stack prototype for organizing financial-advisor client
workflows: client records, timelines, notes, forms, and draft AI-assisted
summaries. It grew from workflow problems Henry Barrientos observed while
helping organize advisor-office information.

The repository demonstrates a broad application architecture, not a
production-ready financial system. It must not be used with real client data
until an independent security, privacy, compliance, and access-control review
has been completed.

## Current capabilities

- Next.js and TypeScript interface
- NextAuth authentication routes
- Prisma/PostgreSQL data model
- client timeline, goals, forms, summaries, and audit-log concepts
- CSV intake and CRM-matching prototypes
- server-side OpenAI API routes for draft analysis
- successful production build and static/type validation

Some integrations remain simulated or incomplete. Generated text is a draft
for advisor review, not financial, legal, tax, or compliance advice.

## Local setup

Requirements: Node.js 20 or newer and PostgreSQL.

    npm ci
    cp .env.example .env.local
    npm run generate
    npm run typecheck
    npm run build
    npm run dev

Fill the environment values before exercising authentication, database, or
OpenAI routes. Never commit .env files, databases, customer exports, or build
logs.

## Verification

    npm run typecheck
    npm run build
    npm audit --audit-level=critical

The dependency audit currently has no critical findings. Remaining noncritical
transitive findings and the migration to the next Next.js major version are
tracked release work; this prototype should not be treated as production-ready.

## Data boundary

The public repository contains no populated client database. Local Prisma
database files and build logs are excluded. Do not use real names, email
addresses, account information, transcripts, or documents in public issues or
fixtures.

## AI disclosure

AI-assisted development contributed substantially to this prototype. Henry is
responsible for understanding, testing, and accurately representing the
current behavior and limitations.

## License

MIT. See LICENSE.
