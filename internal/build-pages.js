/**
 * Generate the 16 missing public pages from a shared template.
 * Run once: `node internal/build-pages.js`
 * Stays in internal/ so it doesn't get deployed.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('docs');

// ─── Per-page data ────────────────────────────────────────────
const PRODUCTS = [
  {
    slug: 'virtus-lever', cat: 'AI · Productivity', color: '#0066FF',
    title: 'Virtus Lever',
    h1: 'Stop the email firehose.',
    lede: 'AI that drafts replies, triages threads, and surfaces the tasks hiding inside them. Stays in your voice, stays in your inbox.',
    p1: 'Knowledge workers lose three hours a day to email. Most of those hours are mechanical — triaging, acknowledging, scheduling, forwarding. Virtus Lever automates the mechanical part without making people feel managed.',
    p2: 'It reads your thread history, your calendar, and your tracker, and proposes the next action — a reply in your tone, a meeting slot that fits, a task in the right project. You approve, edit, or dismiss. Every accept teaches it your voice.',
    p3: 'Hooks into Gmail, Microsoft 365, and any IMAP. Runs in your tenant; never sees email that you don\'t explicitly let it see.',
    feats: [
      ['Smart drafting', 'Replies in your voice with full thread + calendar context.'],
      ['Triage', 'Auto-buckets inbox into act / wait / archive. One-click corrections.'],
      ['Task extraction', 'POs, action items, and follow-ups end up in your tracker, not your head.'],
      ['Calendar awareness', 'Suggests meeting times that actually fit your week.'],
      ['Multi-account', 'One assistant across Gmail, Outlook, and any IMAP.'],
      ['Privacy-first', 'Runs in your tenant. You choose which mailboxes it sees.'],
    ],
    related: ['virtus-agents', 'virtus-ged'],
  },
  {
    slug: 'virtus-fleet', cat: 'ERP · Vertical', color: '#00BFA5',
    title: 'Virtus Fleet',
    h1: 'Every vehicle, one screen.',
    lede: 'ERP built from the ground up for transport and logistics operators — dispatch, drivers, maintenance, compliance, invoicing.',
    p1: 'Most fleet ERPs are horizontal ERPs with a transport module bolted on. Virtus Fleet inverts that — the data model starts from vehicles, drivers, and routes, and finance follows from there.',
    p2: 'Dispatch boards show live position, hours-of-service, fuel level, and ETA. Driver app handles checklists, paperwork capture, and proof of delivery. Maintenance schedules surface before they bite.',
    p3: 'Works for freight, last-mile, fleet rental, and cold chain. Integrates with major telematics, customs, and accounting systems.',
    feats: [
      ['Live dispatch', 'Route view with ETA, fuel, and HOS overlaid on real positions.'],
      ['Driver app', 'Checklists, document capture, POD, and trip log on a phone.'],
      ['Maintenance', 'Service schedules and breakdown tickets in the same flow.'],
      ['Compliance', 'HOS, customs, and customer SLAs tracked automatically.'],
      ['Telematics', 'Connectors for the top providers — no swivel-chair.'],
      ['Invoicing', 'Per-trip and per-customer billing with your accounting system.'],
    ],
    related: ['virtus-erp', 'virtus-ged'],
  },
  {
    slug: 'virtus-ai-factory', cat: 'AI · Manufacturing', color: '#FF6B35',
    title: 'Virtus AI Factory',
    h1: 'Apriso, Opcenter, with an AI co-pilot.',
    lede: 'A code-aware assistant for MES/MOM engineers and a natural-language assistant for operators. Two modes, one model trained on your plant.',
    p1: 'MES/MOM customization eats months. The work isn\'t hard, it\'s just specific — BPM steps, scripting in a vendor-DSL, reading half-undocumented schemas. Virtus AI Factory writes that code with you and reviews it before you check it in.',
    p2: 'For shop-floor operators, it answers questions in plain language — in their dialect — drawing on work instructions, alarms, and historical records. Adoption stops being a battle.',
    p3: 'Runs on Delmia Apriso, Siemens Opcenter, and other major MOM platforms. On-prem or hybrid deploy options — your IP stays in your plant.',
    feats: [
      ['Code-aware engineer mode', 'AI that knows your BPM, scripts, and schema. Generates and reviews changes.'],
      ['Operator mode', 'Natural-language Q&A on the floor — in the dialect they actually speak.'],
      ['Apriso + Opcenter native', 'Built around the major MOM platforms, not bolted on.'],
      ['On-prem / hybrid', 'Deploy where your data is allowed to live.'],
      ['Audit log', 'Every suggestion accepted or rejected is traced.'],
      ['IP protection', 'Your code never leaves your tenant. No vendor model training on your data.'],
    ],
    related: ['virtus-agents', 'virtus-ged'],
  },
  {
    slug: 'virtus-agents', cat: 'AI · Platform', color: '#8B5CF6',
    title: 'Virtus Agents',
    h1: 'Automation operators trust.',
    lede: 'A low-code canvas to build agents that read, decide, and act on real systems. Human-in-the-loop on day one, autonomous when you trust it.',
    p1: 'Most automation tools assume the world has clean APIs. Real operations have PDFs, scans, emails, and people. Virtus Agents starts from those — extracting structure, routing decisions, posting results into your ERP or MES with a human checkpoint when it should.',
    p2: 'Build flows visually. Each step is a model, a tool, or a person. Test against past runs. Promote to production when the eval score is good enough.',
    p3: 'Model-agnostic — pick the LLM that fits each step. Connect via our tool library or write your own.',
    feats: [
      ['Visual flow builder', 'Nodes for triggers, models, tools, and human approvals. No hidden YAML.'],
      ['Tool library', 'Pre-built connectors for ERPs, MES, document stores, email, REST APIs.'],
      ['Human-in-the-loop', 'First-class. Default for new flows; opt-out when trusted.'],
      ['Model-agnostic', 'Per-step model choice. OpenAI, Anthropic, local, whatever fits.'],
      ['Eval suite', 'Replay past runs against new versions before promoting.'],
      ['Audit log', 'Every decision, every input, every output. Reviewable.'],
    ],
    related: ['virtus-lever', 'virtus-ai-factory'],
  },
  {
    slug: 'virtus-ged', cat: 'EDM · Documents', color: '#F59E0B',
    title: 'Virtus GED',
    h1: 'Find the file in two seconds.',
    lede: 'Electronic document management that finally feels modern. Smart classification, semantic search, retention rules — built for compliance teams who hate compliance software.',
    p1: 'Most GED platforms make filing easy and finding hard. Virtus GED inverts that — classifies on upload, indexes content semantically, and lets you search the way you actually think.',
    p2: 'Workflow approvals, retention rules, and signature flows live in the same product. Integrations with Office, email, your ERP, and your MES mean the documents are already where they need to be.',
    p3: 'Compliance-grade by design — audit trail per file, retention policies enforced, ISO/QMS-ready out of the box.',
    feats: [
      ['AI classification', 'Tagged on upload — no manual taxonomy work.'],
      ['Semantic search', 'Finds what you mean, not just keywords. Across PDFs, scans, emails.'],
      ['Workflows', 'Approvals, signatures, and retention in one engine.'],
      ['Audit-grade', 'Per-file audit trail. Compliance teams approve at the demo.'],
      ['Integrations', 'Office, Gmail, ERP, MES — documents arrive where they\'re used.'],
      ['Migration', 'Imports from legacy GED systems without losing tags or history.'],
    ],
    related: ['virtus-erp', 'virtus-ai-factory'],
  },
  {
    slug: 'virtus-erp', cat: 'ERP · Horizontal', color: '#1E3A8A',
    title: 'Virtus ERP',
    h1: 'The back office, finally legible.',
    lede: 'Finance, sales, purchase, inventory, HR, projects — one data model, one UI, one place. Modular adoption, no five-year migration.',
    p1: 'Legacy ERPs got bigger as their customers got bigger. Then they stopped getting better. Virtus ERP starts modern: modular, API-first, modules adopt in days instead of quarters.',
    p2: 'Real-time dashboards over actual transactions — not yesterday\'s extract. Finance closes faster, sales sees pipeline as it moves, ops watches inventory turn live.',
    p3: 'Pairs naturally with the rest of the catalogue — Lever for the back-office inbox, GED for attachments, Fleet for the transport vertical.',
    feats: [
      ['Finance', 'GL, AP, AR, cash, multi-currency, multi-entity.'],
      ['Sales & CRM', 'Pipeline, quotes, orders, invoices in one chain.'],
      ['Purchase', 'POs, receipts, three-way match. AP matching with AI.'],
      ['Inventory', 'Multi-warehouse, batch/lot, real-time stock visibility.'],
      ['HR & Payroll', 'Employees, contracts, leave, payroll integration.'],
      ['Projects', 'Time, expenses, billing, margin per project.'],
    ],
    related: ['virtus-fleet', 'virtus-ged'],
  },
];

const INDUSTRIES = [
  {
    slug: 'manufacturing', cat: 'Industry', color: '#FF6B35',
    title: 'Manufacturing',
    h1: 'Built for plants that don\'t tolerate downtime.',
    lede: 'MES/MOM operations, shop-floor AI, factory document control. Built for the operators who actually run Apriso, Opcenter, and other MOM platforms.',
    p1: 'Manufacturing software is dominated by big platforms with deep, expensive customization paths. The cost isn\'t the license — it\'s the eighteen-month integration project that ages out in a year.',
    p2: 'Our manufacturing stack is built around that pain. AI Factory speeds up MES customization to weeks. Agents automate the workflows your platform doesn\'t cover. GED replaces the network share where quality docs go to die. ERP fills the back-office gap.',
    p3: 'Drop in one product at a time. Each one shows ROI inside ninety days or we walk.',
    products: ['virtus-ai-factory', 'virtus-agents', 'virtus-ged', 'virtus-erp'],
    metrics: [
      ['9 months', 'avg. MES customization → cut to 3 weeks with AI Factory'],
      ['80%', 'of QMS documents found in 2s with GED semantic search'],
      ['ROI in 90 days', 'or you walk. Written into pilot contracts.'],
    ],
  },
  {
    slug: 'transport-logistics', cat: 'Industry', color: '#00BFA5',
    title: 'Transport & Logistics',
    h1: 'Every vehicle, every driver, every load — one screen.',
    lede: 'Fleet dispatch, compliance, freight, last-mile, cold chain. The full operations stack — one place, no spreadsheet middleware, no swivel-chair.',
    p1: 'Most transport operators run on a stack of spreadsheets glued to a vendor TMS. Drivers carry paper. Dispatch lives on WhatsApp. Compliance gets reconstructed at month-end.',
    p2: 'Our transport stack closes the loop. Fleet handles dispatch + driver app + maintenance + compliance. ERP handles invoicing and finance. GED stores the customs paper, automatically tagged.',
    p3: 'Used by freight carriers, last-mile, fleet rental, and cold chain operators.',
    products: ['virtus-fleet', 'virtus-erp', 'virtus-ged'],
    metrics: [
      ['3 weeks', 'avg. dispatch team stops opening spreadsheets'],
      ['20%', 'fuel savings via live route + driver behaviour data'],
      ['Zero paper', 'in the driver-to-finance chain'],
    ],
  },
  {
    slug: 'professional-services', cat: 'Industry', color: '#0066FF',
    title: 'Professional Services',
    h1: 'Knowledge work, finally legible.',
    lede: 'Knowledge work, back-office automation, proposal flow. Hours back per week without forcing your team into a new platform.',
    p1: 'Consulting, agency, and professional-services teams live in email, Office, and one or two SaaS tools. Adoption of "transformation platforms" goes poorly — your billable people don\'t have time.',
    p2: 'Our services stack meets people where they already work. Lever automates email. Agents automate proposals and intake. GED makes documents searchable. ERP handles projects, billing, and margin.',
    p3: 'Hours back per week per knowledge worker. Measured.',
    products: ['virtus-lever', 'virtus-agents', 'virtus-ged', 'virtus-erp'],
    metrics: [
      ['6 hours/week', 'back per knowledge worker (Lever pilot data)'],
      ['40%', 'faster proposal cycles with Agents'],
      ['No new platform', 'to learn. Lives where work already happens.'],
    ],
  },
  {
    slug: 'cross-industry', cat: 'Industry', color: '#8B5CF6',
    title: 'Cross-industry',
    h1: 'Pick the building blocks that fit.',
    lede: 'Horizontal stack for organizations whose needs don\'t map cleanly to one vertical. Compose from the catalogue.',
    p1: 'Some teams sit between industries — a multi-business group, a public-sector arm, a holding with mixed ops. The vertical stacks don\'t fit cleanly.',
    p2: 'Our horizontal building blocks compose to the shape you need. ERP for the back office. GED for documents. Lever for productivity. Agents for the in-between.',
    p3: 'Start with one. Add the rest when the business asks.',
    products: ['virtus-erp', 'virtus-ged', 'virtus-lever', 'virtus-agents'],
    metrics: [
      ['Modular adoption', 'no big-bang migration'],
      ['Shared data model', 'across every product'],
      ['One contract', 'one support line, one quarterly review'],
    ],
  },
];

const SINGLES = [
  {
    out: 'solutions.html', relCss: 'assets/site.css', backDir: '',
    navActive: 'solutions',
    title: 'Solutions — Virtus Operandi',
    description: 'Bundled outcomes that combine multiple products around a real operational goal.',
    eyebrow: 'Bundled outcomes',
    h1: 'Solutions, not modules.',
    lede: 'When you know the outcome but not the stack: three pre-composed solutions that bundle products around a goal you can name.',
    body: `
    <section>
      <h2>AI-Powered Smart Factory</h2>
      <p>For tier-1 and tier-2 manufacturers running Delmia Apriso, Siemens Opcenter, or another MOM platform. Cut customization time from quarters to weeks, automate the workflows your MES doesn't cover, and make QMS documents findable.</p>
      <p><strong>Includes:</strong> Virtus AI Factory + Virtus Agents + Virtus GED.</p>
      <p><strong>Typical outcome:</strong> 9-month customization → 3 weeks. Operator adoption stops being a battle.</p>
    </section>
    <section>
      <h2>Logistics Command Center</h2>
      <p>For freight carriers, last-mile operators, and fleet-rental businesses. Replace the spreadsheets-and-WhatsApp stack with a real dispatch board, a driver app, and back-office automation that closes the paper-to-finance loop.</p>
      <p><strong>Includes:</strong> Virtus Fleet + Virtus ERP + Virtus Lever.</p>
      <p><strong>Typical outcome:</strong> Zero paper between driver and finance. Dispatchers stop opening spreadsheets within three weeks.</p>
    </section>
    <section>
      <h2>Office Automation Suite</h2>
      <p>For consulting, professional services, and back-office teams. Hours back per knowledge worker, faster proposal cycles, fewer dropped follow-ups — without forcing anyone onto a new platform.</p>
      <p><strong>Includes:</strong> Virtus Lever + Virtus Agents + Virtus GED.</p>
      <p><strong>Typical outcome:</strong> 6 hours/week back per knowledge worker. Proposal cycles 40% shorter.</p>
    </section>
    <p class="note">Solutions are starting points, not lock-ins. Drop a module, add another, scale up — the catalogue composes to the shape you need.</p>
    `,
  },
  {
    out: 'insights.html', relCss: 'assets/site.css', backDir: '',
    navActive: 'insights',
    title: 'Insights — Virtus Operandi',
    description: 'Notes, write-ups, and case studies from the team — what we learned shipping software inside real operations.',
    eyebrow: 'Insights · launching Q3',
    h1: 'From the operating room.',
    lede: 'Field notes, engineering write-ups, and customer stories. Currently a placeholder — first articles drop with the launch cohort in Q3 2026.',
    body: `
    <section>
      <h2>Coming soon.</h2>
      <p>We're holding off on insights content until the first launch-partner pilots ship. When they do, the page fills with three categories of post:</p>
      <ul>
        <li><strong>Field notes</strong> — what we saw on the floor, in the dispatch room, or at the back-office. Specific, dated, written by the engineer who shipped it.</li>
        <li><strong>Engineering write-ups</strong> — deeper technical pieces about how the catalogue is built. AI eval methodology, MES integration patterns, document classification approaches.</li>
        <li><strong>Case studies</strong> — what a launch partner shipped, what it cost, what they got back. Real metric, real name.</li>
      </ul>
    </section>
    <section>
      <h2>Want to be in the first case study?</h2>
      <p>We're working with the first ten organisations to roll the catalogue out. <a href="contact.html">Talk to us.</a></p>
    </section>
    <p class="note">Page reserved. <a href="insights/case-studies.html">Case studies index</a> follows the same launch schedule.</p>
    `,
  },
  {
    out: 'insights/case-studies.html', relCss: '../assets/site.css', backDir: '../',
    navActive: 'insights',
    title: 'Case studies — Virtus Operandi',
    description: 'Customer stories from launch partners.',
    eyebrow: 'Insights · case studies',
    h1: 'Customer stories.',
    lede: 'Pilots starting Q3 2026 — case studies will live here as plants come online.',
    body: `
    <section>
      <h2>Reserved spots.</h2>
      <p>Three case-study slots are reserved for our first launch partners. As pilots ship, each gets a long-form write-up with real metrics, real names, and the architecture that got them there.</p>
    </section>
    <section>
      <h2>What's in a Virtus case study?</h2>
      <ul>
        <li><strong>Before</strong> — the operation as it was, in numbers.</li>
        <li><strong>What we built</strong> — which products, how they connected, who did what.</li>
        <li><strong>After</strong> — the numbers again. Honestly, including what didn't move.</li>
        <li><strong>What we'd do differently</strong> — every project earns one.</li>
      </ul>
    </section>
    <p class="note">No fabricated social proof. Real cases publish when real customers ship.</p>
    `,
  },
  {
    out: 'team.html', relCss: 'assets/site.css', backDir: '',
    navActive: 'company',
    title: 'Team — Virtus Operandi',
    description: 'The team behind Virtus Operandi.',
    eyebrow: 'Company · team',
    h1: 'The people behind the catalogue.',
    lede: 'Small team, deep operator background. Public team page goes live with the production site — for now, you can meet us on a demo call.',
    body: `
    <section>
      <h2>How we hire.</h2>
      <p>We hire engineers who have shipped software inside real operations — manufacturing plants, dispatch rooms, back offices. Not engineers who understand operations in theory; engineers who have been called at 3 AM when an MES update broke a shift handover.</p>
      <p>If that's you, we're hiring. See <a href="careers.html">open roles</a>.</p>
    </section>
    <section>
      <h2>Meet us.</h2>
      <p>The fastest way to meet the team is on a demo call. We don't farm those out — when you book, you get the engineer who would actually own your account.</p>
      <p><a class="btn-pill" href="contact.html">Book a 15-minute call <span class="arr" aria-hidden="true">→</span></a></p>
    </section>
    <p class="note">Public team page (photos, bios, LinkedIn) ships with the production release. Treat this as a preview.</p>
    `,
  },
  {
    out: 'careers.html', relCss: 'assets/site.css', backDir: '',
    navActive: 'company',
    title: 'Careers — Virtus Operandi',
    description: 'Open roles at Virtus Operandi.',
    eyebrow: 'Company · careers',
    h1: 'We\'re hiring operators who code.',
    lede: 'Small, distributed team. We hire engineers who have shipped inside real operations — not just understood them.',
    body: `
    <section>
      <h2>How we work.</h2>
      <ul>
        <li><strong>Remote-first</strong> — quarterly week together in Casablanca.</li>
        <li><strong>Ship over plan</strong> — small PRs, fast review, ship before lunch.</li>
        <li><strong>Talk to customers</strong> — every engineer joins customer calls weekly.</li>
        <li><strong>Own a product</strong> — each engineer is on point for one of the six.</li>
      </ul>
    </section>
    <section>
      <h2>Open roles.</h2>
      <p>Currently hiring across the catalogue:</p>
      <ul>
        <li>Senior MES Engineer (Apriso / Opcenter) — Casablanca or remote.</li>
        <li>AI Engineer — agent orchestration, eval, RAG.</li>
        <li>Full-stack Engineer — ERP / GED platform.</li>
        <li>Founding Designer — design system + product UI across all 6 apps.</li>
        <li>Sales Engineer — launch-partner acquisition.</li>
      </ul>
      <p>Email <a href="mailto:careers@virtusoperandi.com">careers@virtusoperandi.com</a> with what you've shipped. No cover letter; no take-home until we've talked.</p>
    </section>
    <p class="note">Detailed JDs go up once production launches. For now, mail us — fastest path.</p>
    `,
  },
  {
    out: 'partners.html', relCss: 'assets/site.css', backDir: '',
    navActive: 'company',
    title: 'Partners — Virtus Operandi',
    description: 'Technology partners, system integrators, and resellers.',
    eyebrow: 'Company · partners',
    h1: 'Built to fit your stack.',
    lede: 'Technology partners we integrate with, integrators we work alongside, and the partner program for both.',
    body: `
    <section>
      <h2>Technology partners.</h2>
      <p>The products in the catalogue connect to the systems your operation already runs on:</p>
      <ul>
        <li><strong>MES / MOM</strong> — Dassault Systèmes Delmia Apriso, Siemens Opcenter.</li>
        <li><strong>ERP</strong> — SAP, Microsoft Dynamics, Salesforce.</li>
        <li><strong>Productivity</strong> — Microsoft 365, Google Workspace, Slack.</li>
        <li><strong>Telematics</strong> — major providers via our Fleet integration layer.</li>
      </ul>
    </section>
    <section>
      <h2>System integrators.</h2>
      <p>If you're a regional SI or a vertical specialist (manufacturing, transport, services) and want to resell, deliver, or co-build on the Virtus catalogue, we want to talk. Margins are healthy, training is fast, and we don't compete with our partners on delivery.</p>
      <p><a class="btn-pill" href="contact.html">Become a partner <span class="arr" aria-hidden="true">→</span></a></p>
    </section>
    <p class="note">Public partner directory and named tech-partner badges ship with the production site.</p>
    `,
  },
];

// ─── Shared chrome ────────────────────────────────────────────
const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&family=Open+Sans:wght@300;400;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />`;

function metaStrip(label) {
  return `<div class="meta">
  <div class="meta-inner">
    <span class="meta-left"><span class="meta-dot" aria-hidden="true"></span>${label}</span>
  </div>
</div>`;
}

function nav(active, back) {
  const cur = (k) => active === k ? ' aria-current="page"' : '';
  return `<header class="nav" id="nav">
  <div class="nav-inner">
    <a href="${back}home.html" class="brand" aria-label="Virtus Operandi home">
      <span class="brand-mark" aria-hidden="true"></span>
      <span class="brand-word">Virtus <span class="lo">Operandi</span></span>
    </a>
    <nav class="nav-links" aria-label="Primary">
      <a class="nav-link" href="${back}home.html#products"${cur('products')}>Products</a>
      <a class="nav-link" href="${back}home.html#industries"${cur('industries')}>Industries</a>
      <a class="nav-link" href="${back}solutions.html"${cur('solutions')}>Solutions</a>
      <a class="nav-link" href="${back}pricing.html"${cur('pricing')}>Tarifs</a>
      <a class="nav-link" href="${back}about.html"${cur('company')}>Company</a>
      <a class="nav-link" href="${back}insights.html"${cur('insights')}>Insights</a>
      <a class="nav-link" href="${back}contact.html"${cur('contact')}>Contact</a>
      <a class="nav-cta" href="${back}contact.html">Book a demo</a>
    </nav>
    <button class="hamburger" id="ham" aria-label="Open menu" aria-expanded="false"><span class="bars" aria-hidden="true"></span></button>
  </div>
</header>

<aside class="mobile-menu" id="mobile-menu" aria-hidden="true">
  <a href="${back}home.html#products"${cur('products')}>Products</a>
  <a href="${back}home.html#industries"${cur('industries')}>Industries</a>
  <a href="${back}solutions.html"${cur('solutions')}>Solutions</a>
  <a href="${back}pricing.html"${cur('pricing')}>Tarifs</a>
  <a href="${back}about.html"${cur('company')}>Company</a>
  <a href="${back}insights.html"${cur('insights')}>Insights</a>
  <a href="${back}contact.html"${cur('contact')}>Contact</a>
  <a href="${back}contact.html" class="mob-cta">Book a demo</a>
</aside>`;
}

function footer(back) {
  return `<footer>
  <div class="foot-inner">
    <div class="foot-top">
      <div class="brand-col">
        <a href="${back}home.html" class="brand">
          <span class="brand-mark" aria-hidden="true"></span>
          <span class="brand-word">Virtus <span class="lo">Operandi</span></span>
        </a>
        <p>Software that codifies the way real operations get done. Built by operators for operators — across manufacturing, transport, and the back office.</p>
      </div>
      <div class="foot-col">
        <h4>Products</h4>
        <a href="${back}products/virtus-lever.html">Virtus Lever</a>
        <a href="${back}products/virtus-fleet.html">Virtus Fleet</a>
        <a href="${back}products/virtus-ai-factory.html">Virtus AI Factory</a>
        <a href="${back}products/virtus-agents.html">Virtus Agents</a>
        <a href="${back}products/virtus-ged.html">Virtus GED</a>
        <a href="${back}products/virtus-erp.html">Virtus ERP</a>
      </div>
      <div class="foot-col">
        <h4>Industries</h4>
        <a href="${back}industries/manufacturing.html">Manufacturing</a>
        <a href="${back}industries/transport-logistics.html">Transport &amp; Logistics</a>
        <a href="${back}industries/professional-services.html">Professional Services</a>
        <a href="${back}industries/cross-industry.html">Cross-industry</a>
      </div>
      <div class="foot-col">
        <h4>Company</h4>
        <a href="${back}about.html">About</a>
        <a href="${back}team.html">Team</a>
        <a href="${back}careers.html">Careers</a>
        <a href="${back}partners.html">Partners</a>
        <a href="${back}contact.html">Contact</a>
        <a href="${back}security.html">Security</a>
      </div>
      <div class="foot-col">
        <h4>Legal</h4>
        <a href="${back}terms.html">Terms</a>
        <a href="${back}privacy.html">Privacy</a>
        <a href="${back}cookies.html">Cookies</a>
      </div>
    </div>
    <div class="foot-bottom">
      <span>© 2026 Virtus Operandi · v0.3 preview</span>
      <span><a href="${back}terms.html">Terms</a><a href="${back}privacy.html">Privacy</a><a href="${back}cookies.html">Cookies</a></span>
    </div>
  </div>
</footer>`;
}

const NAV_JS = `<script>
  const nav = document.getElementById('nav');
  const ham = document.getElementById('ham');
  const mob = document.getElementById('mobile-menu');
  addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 8), { passive: true });
  ham.addEventListener('click', () => {
    const open = nav.classList.toggle('menu-open');
    ham.setAttribute('aria-expanded', open ? 'true' : 'false');
    mob.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.style.overflow = open ? 'hidden' : '';
  });
</script>`;

// ─── Per-page wrappers ────────────────────────────────────────
function shell({ title, description, relCss, metaLabel, navActive, back, hero, main, extraStyles = '' }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<meta name="description" content="${description}" />
${FONTS}
<link rel="stylesheet" href="${relCss}" />
${extraStyles ? `<style>${extraStyles}</style>` : ''}
</head>
<body>

<a class="skip" href="#main">Skip to content</a>

${metaStrip(metaLabel)}

${nav(navActive, back)}

${hero}

<main id="main">
  <div class="container">
${main}
  </div>
</main>

${footer(back)}

${NAV_JS}
</body>
</html>
`;
}

// ─── Page renderers ───────────────────────────────────────────
const productExtraStyles = `
  .pcat { display: inline-block; font-family: var(--mono); font-size: 11px; padding: 4px 10px; border-radius: 999px; background: var(--paper-2); border: 1px solid var(--border); color: var(--c, var(--blue)); letter-spacing: 0.10em; text-transform: uppercase; font-weight: 600; margin-bottom: 14px; }
  .feats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; margin: 28px 0 8px; }
  @media (max-width: 720px) { .feats { grid-template-columns: 1fr; } }
  .feat { padding: 18px 18px 16px; background: var(--paper-2); border: 1px solid var(--border); border-radius: 12px; }
  .feat h3 { font-size: 16px; margin-bottom: 6px; }
  .feat p { font-size: 14px; color: var(--muted); margin: 0; }
  .rel { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; margin: 18px 0 0; }
  @media (max-width: 720px) { .rel { grid-template-columns: 1fr; } }
  .rel a { padding: 16px 18px; background: #fff; border: 1px solid var(--border); border-radius: 12px; display: flex; flex-direction: column; gap: 4px; color: var(--ink); transition: border-color .15s ease, transform .15s ease; }
  .rel a:hover { border-color: var(--blue); transform: translateY(-2px); }
  .rel a .lbl { font-family: var(--mono); font-size: 10.5px; letter-spacing: 0.10em; text-transform: uppercase; color: var(--blue); font-weight: 600; }
  .rel a .ttl { font-weight: 600; font-size: 15px; }
  .cta-block { margin-top: 36px; padding: 32px 28px; background: var(--ink); color: #fff; border-radius: 18px; display: grid; grid-template-columns: 1.4fr 1fr; gap: 24px; align-items: center; }
  @media (max-width: 700px) { .cta-block { grid-template-columns: 1fr; } }
  .cta-block h3 { color: #fff; font-size: 24px; margin-bottom: 8px; letter-spacing: -0.8px; }
  .cta-block p { color: rgba(255,255,255,0.7); margin: 0; font-size: 15px; }
  .cta-block .btn-pill { background: #fff; color: var(--ink); box-shadow: none; justify-self: end; }
  @media (max-width: 700px) { .cta-block .btn-pill { justify-self: start; } }
  .cta-block .btn-pill:hover { background: var(--blue); color: #fff; }
`;

function renderProduct(p) {
  const productNames = {
    'virtus-lever': 'Virtus Lever',
    'virtus-fleet': 'Virtus Fleet',
    'virtus-ai-factory': 'Virtus AI Factory',
    'virtus-agents': 'Virtus Agents',
    'virtus-ged': 'Virtus GED',
    'virtus-erp': 'Virtus ERP',
  };
  const productDesc = {
    'virtus-lever': 'AI email productivity assistant',
    'virtus-fleet': 'ERP for transport &amp; logistics',
    'virtus-ai-factory': 'MES/MOM AI co-pilot',
    'virtus-agents': 'AI agent &amp; automation builder',
    'virtus-ged': 'Electronic document management',
    'virtus-erp': 'General-purpose ERP',
  };

  const hero = `<section class="page-hero">
  <div class="container">
    <span class="pcat" style="--c: ${p.color}">${p.cat}</span>
    <h1>${p.title} — ${p.h1}</h1>
    <p class="lede">${p.lede}</p>
  </div>
</section>`;

  const main = `    <section>
      <p>${p.p1}</p>
      <p>${p.p2}</p>
      <p>${p.p3}</p>
    </section>

    <section>
      <h2>What you get.</h2>
      <div class="feats">
${p.feats.map(([t, d]) => `        <div class="feat"><h3>${t}</h3><p>${d}</p></div>`).join('\n')}
      </div>
    </section>

    <section>
      <h2>Plays well with.</h2>
      <div class="rel">
${p.related.map(r => `        <a href="${r}.html"><span class="lbl">Catalogue</span><span class="ttl">${productNames[r]} — ${productDesc[r]}</span></a>`).join('\n')}
      </div>
    </section>

    <div class="cta-block">
      <div>
        <h3>See ${p.title} on your operation.</h3>
        <p>15-minute demo. A real engineer on the call. We'll show you exactly what it would look like for your team.</p>
      </div>
      <a class="btn-pill" href="../contact.html">Book a demo <span class="arr" aria-hidden="true">→</span></a>
    </div>`;

  return shell({
    title: `${p.title} — Virtus Operandi`,
    description: p.lede.replace(/<[^>]+>/g, '').replace(/"/g, '&quot;'),
    relCss: '../assets/site.css',
    metaLabel: `Catalogue · ${p.cat}`,
    navActive: 'products',
    back: '../',
    hero,
    main,
    extraStyles: productExtraStyles,
  });
}

const industryExtraStyles = `
  .icat { display: inline-block; font-family: var(--mono); font-size: 11px; padding: 4px 10px; border-radius: 999px; background: var(--paper-2); border: 1px solid var(--border); color: var(--c, var(--blue)); letter-spacing: 0.10em; text-transform: uppercase; font-weight: 600; margin-bottom: 14px; }
  .stack { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; margin: 24px 0 8px; }
  @media (max-width: 720px) { .stack { grid-template-columns: 1fr; } }
  .stack a { padding: 18px 20px; background: var(--paper-2); border: 1px solid var(--border); border-radius: 12px; display: flex; flex-direction: column; gap: 4px; color: var(--ink); transition: border-color .15s ease, transform .15s ease; }
  .stack a:hover { border-color: var(--blue); transform: translateY(-2px); }
  .stack a .lbl { font-family: var(--mono); font-size: 10.5px; letter-spacing: 0.10em; text-transform: uppercase; color: var(--blue); font-weight: 600; }
  .stack a .ttl { font-weight: 600; font-size: 16px; }
  .stack a .desc { font-size: 13px; color: var(--muted); }
  .metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin: 24px 0 8px; }
  @media (max-width: 720px) { .metrics { grid-template-columns: 1fr; } }
  .metric { padding: 22px 22px 18px; background: var(--ink); color: #fff; border-radius: 14px; }
  .metric .num { font-family: var(--display); font-weight: 700; font-size: 28px; letter-spacing: -0.8px; color: #fff; margin-bottom: 6px; line-height: 1.1; }
  .metric .desc { color: rgba(255,255,255,0.7); font-size: 13.5px; line-height: 1.5; }
  .cta-block { margin-top: 36px; padding: 32px 28px; background: var(--ink); color: #fff; border-radius: 18px; display: grid; grid-template-columns: 1.4fr 1fr; gap: 24px; align-items: center; }
  @media (max-width: 700px) { .cta-block { grid-template-columns: 1fr; } }
  .cta-block h3 { color: #fff; font-size: 24px; margin-bottom: 8px; letter-spacing: -0.8px; }
  .cta-block p { color: rgba(255,255,255,0.7); margin: 0; font-size: 15px; }
  .cta-block .btn-pill { background: #fff; color: var(--ink); box-shadow: none; justify-self: end; }
  @media (max-width: 700px) { .cta-block .btn-pill { justify-self: start; } }
  .cta-block .btn-pill:hover { background: var(--blue); color: #fff; }
`;

function renderIndustry(ind) {
  const productNames = {
    'virtus-lever': ['Virtus Lever', 'AI email productivity'],
    'virtus-fleet': ['Virtus Fleet', 'Transport ERP'],
    'virtus-ai-factory': ['Virtus AI Factory', 'MES/MOM AI co-pilot'],
    'virtus-agents': ['Virtus Agents', 'AI agent builder'],
    'virtus-ged': ['Virtus GED', 'Document management'],
    'virtus-erp': ['Virtus ERP', 'General-purpose ERP'],
  };

  const hero = `<section class="page-hero">
  <div class="container">
    <span class="icat" style="--c: ${ind.color}">${ind.cat}</span>
    <h1>${ind.title} — ${ind.h1}</h1>
    <p class="lede">${ind.lede}</p>
  </div>
</section>`;

  const main = `    <section>
      <p>${ind.p1}</p>
      <p>${ind.p2}</p>
      <p>${ind.p3}</p>
    </section>

    <section>
      <h2>Recommended stack.</h2>
      <div class="stack">
${ind.products.map(slug => {
  const [nm, desc] = productNames[slug];
  return `        <a href="../products/${slug}.html"><span class="lbl">Product</span><span class="ttl">${nm}</span><span class="desc">${desc}</span></a>`;
}).join('\n')}
      </div>
    </section>

    <section>
      <h2>What good looks like.</h2>
      <div class="metrics">
${ind.metrics.map(([num, desc]) => `        <div class="metric"><div class="num">${num}</div><div class="desc">${desc}</div></div>`).join('\n')}
      </div>
    </section>

    <div class="cta-block">
      <div>
        <h3>See it on your operation.</h3>
        <p>15-minute demo, tailored to the ${ind.title.toLowerCase()} stack. A real engineer on the call.</p>
      </div>
      <a class="btn-pill" href="../contact.html">Book a demo <span class="arr" aria-hidden="true">→</span></a>
    </div>`;

  return shell({
    title: `${ind.title} — Virtus Operandi`,
    description: ind.lede.replace(/<[^>]+>/g, '').replace(/"/g, '&quot;'),
    relCss: '../assets/site.css',
    metaLabel: `Industry · ${ind.title}`,
    navActive: 'industries',
    back: '../',
    hero,
    main,
    extraStyles: industryExtraStyles,
  });
}

function renderSingle(s) {
  const hero = `<section class="page-hero">
  <div class="container">
    <span class="eyebrow"><span class="live" aria-hidden="true"></span>${s.eyebrow}</span>
    <h1>${s.h1}</h1>
    <p class="lede">${s.lede}</p>
  </div>
</section>`;

  return shell({
    title: s.title,
    description: s.description,
    relCss: s.relCss,
    metaLabel: s.eyebrow,
    navActive: s.navActive,
    back: s.backDir,
    hero,
    main: s.body,
  });
}

// ─── Pricing page ─────────────────────────────────────────────
function renderPricing() {
  const pricingStyles = `
:root { --max-pricing: 1280px; }
.pricing-wrap { max-width: var(--max-pricing); margin: 0 auto; padding: 0 clamp(20px,4vw,40px); }
/* Hero */
.pricing-hero { padding: clamp(48px,8vw,88px) 0 clamp(32px,5vw,56px); background: radial-gradient(60% 50% at 85% 35%,rgba(0,102,255,.05),transparent 70%), radial-gradient(50% 60% at 15% 90%,rgba(0,102,255,.03),transparent 70%), var(--paper); border-bottom: 1px solid var(--border); text-align: center; }
.pricing-hero h1 { margin-bottom: 10px; }
.pricing-hero .lede { color: var(--muted); font-size: clamp(16px,1.3vw,19px); max-width: 52ch; margin: 0 auto 24px; }
/* Toggle + Currency */
.ctrl-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 20px; }
.tog, .cur { display: inline-flex; background: #EDEDF5; border-radius: 999px; padding: 4px; gap: 2px; }
.tog button, .cur button { padding: 8px 20px; border-radius: 999px; font-size: 14px; font-weight: 600; background: transparent; color: var(--muted); transition: background .2s, color .2s; }
.tog button.active { background: var(--blue); color: #fff; }
.cur button { font-family: var(--mono); font-size: 13px; }
.cur button.active { background: var(--ink); color: #fff; }
.tog button:focus-visible, .cur button:focus-visible { outline: 2px solid var(--blue); outline-offset: 2px; }
.save-badge { font-family: var(--mono); font-size: 11px; color: #1a8a4a; margin-left: 4px; }
/* Cards */
.plans-section { padding: clamp(40px,6vw,72px) 0; background: var(--page-bg); }
.plans-grid { display: grid; grid-template-columns: repeat(5,1fr); gap: 16px; }
@media (max-width: 1100px) { .plans-grid { grid-template-columns: repeat(3,1fr); } }
@media (max-width: 700px)  { .plans-grid { grid-template-columns: 1fr; } }
.plan-card { background: var(--paper); border: 1.5px solid var(--border); border-radius: 18px; padding: 28px 22px 24px; display: flex; flex-direction: column; gap: 6px; position: relative; transition: box-shadow .2s, transform .2s; }
.plan-card:hover { box-shadow: 0 12px 32px -8px rgba(0,0,0,.10); transform: translateY(-2px); }
.plan-card.featured { border-color: var(--blue); box-shadow: 0 0 0 1px var(--blue); }
.plan-badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); padding: 3px 14px; border-radius: 999px; font-family: var(--mono); font-size: 11px; font-weight: 600; letter-spacing: .08em; white-space: nowrap; }
.plan-badge.blue { background: var(--blue); color: #fff; }
.plan-badge.red  { background: #CC2200; color: #fff; }
.plan-name { font-family: var(--display); font-weight: 700; font-size: 17px; letter-spacing: -.3px; }
.plan-price { font-family: var(--mono); font-size: 26px; font-weight: 500; color: var(--blue-deep); margin: 8px 0 4px; line-height: 1.1; }
.plan-sub   { font-size: 13px; color: var(--muted); margin-bottom: 12px; }
.plan-cta { display: inline-flex; align-items: center; justify-content: center; padding: 11px 18px; border-radius: 999px; font-weight: 600; font-size: 14.5px; text-align: center; transition: background .2s, transform .2s; margin-top: auto; }
.plan-cta.primary { background: var(--blue); color: #fff; }
.plan-cta.primary:hover { background: var(--blue-hover); transform: translateY(-1px); }
.plan-cta.outline { border: 1.5px solid var(--border); color: var(--ink); }
.plan-cta.outline:hover { border-color: var(--ink); background: var(--ink); color: #fff; }
.plan-cta:focus-visible { outline: 2px solid var(--blue); outline-offset: 2px; }
.plan-divider { border: none; border-top: 1px solid var(--border); margin: 12px 0; }
.plan-features { list-style: none; padding: 0; margin: 0 0 16px; display: flex; flex-direction: column; gap: 8px; }
.plan-features li { font-size: 13.5px; color: var(--muted); display: flex; align-items: flex-start; gap: 8px; line-height: 1.4; }
.plan-features li::before { content: "✓"; color: #1a8a4a; font-weight: 700; font-size: 13px; flex-shrink: 0; margin-top: 1px; }
/* Table */
.compare-section { padding: clamp(40px,6vw,72px) 0; }
.compare-section h2 { margin-bottom: 8px; }
.compare-section .section-sub { color: var(--muted); font-size: 15px; margin-bottom: 28px; }
.compare-wrap { overflow-x: auto; border-radius: 16px; box-shadow: 0 2px 24px -4px rgba(0,32,96,.10); border: 1px solid var(--border); }
table.ctable { width: 100%; border-collapse: collapse; font-size: 15px; }
.ctable thead tr { background: var(--blue-deep); }
.ctable th { color: #fff; font-family: var(--display); font-weight: 600; font-size: 13px; letter-spacing: -.1px; padding: 18px 20px; text-align: left; white-space: nowrap; }
.ctable th:first-child { border-radius: 15px 0 0 0; }
.ctable th:last-child  { border-radius: 0 15px 0 0; }
.ctable th:not(:first-child) { text-align: center; }
.ctable td { padding: 15px 20px; border-bottom: 1px solid var(--border); vertical-align: middle; color: var(--ink); }
.ctable tbody tr:last-child td { border-bottom: none; }
.ctable tbody tr:nth-child(odd) td { background: var(--paper); }
.ctable tbody tr:nth-child(even) td { background: var(--page-bg); }
.ctable tbody tr:hover td { background: #EEF4FF; transition: background .15s; }
.ctable td:first-child { font-weight: 600; color: var(--ink); min-width: 160px; }
.ctable td:not(:first-child) { text-align: center; color: var(--muted); }
.ctable .mono { font-family: var(--mono); font-size: 13.5px; color: var(--blue-deep); font-weight: 500; }
.ctable .check { color: #1a8a4a; font-size: 17px; }
.ctable .dash  { color: #ccc; }
/* FAQ */
.faq-section { padding: clamp(40px,6vw,72px) 0; background: var(--page-bg); }
.faq-section h2 { margin-bottom: 8px; }
.faq-section .section-sub { color: var(--muted); font-size: 15px; margin-bottom: 32px; }
details.faq { background: var(--paper); border: 1px solid var(--border); border-radius: 14px; margin-bottom: 10px; overflow: hidden; transition: box-shadow .2s; }
details.faq[open] { box-shadow: 0 4px 20px -4px rgba(0,32,96,.10); border-color: rgba(0,102,255,.25); }
summary.faq-q { padding: 20px 24px; font-family: var(--display); font-weight: 600; font-size: 16.5px; color: var(--ink); cursor: pointer; list-style: none; display: flex; justify-content: space-between; align-items: center; gap: 16px; transition: color .15s; }
summary.faq-q > span:first-child { flex: 1; }
summary.faq-q:hover { color: var(--blue); }
summary.faq-q::-webkit-details-marker { display: none; }
.faq-icon { width: 28px; height: 28px; border-radius: 50%; border: 1.5px solid var(--border); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 16px; font-weight: 300; color: var(--blue); transition: background .2s, border-color .2s, transform .3s; }
details.faq[open] .faq-icon { background: var(--blue); border-color: var(--blue); color: #fff; transform: rotate(45deg); }
summary.faq-q:focus-visible { outline: 2px solid var(--blue); outline-offset: -2px; border-radius: 14px; }
.faq-a { padding: 0 24px 20px; color: var(--muted); font-size: 15px; line-height: 1.7; }
/* CTA band */
.cta-band { background: var(--blue-deep); color: #fff; padding: clamp(48px,7vw,80px) 0; text-align: center; }
.cta-band h2 { color: #fff; font-size: clamp(26px,3vw,38px); margin-bottom: 10px; }
.cta-band p { color: rgba(255,255,255,.72); font-size: 17px; margin-bottom: 28px; }
.cta-band-btns { display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; }
.cta-band .btn-w { display: inline-flex; align-items: center; padding: 14px 30px; border-radius: 999px; font-weight: 600; font-size: 15.5px; transition: background .2s, transform .2s; }
.cta-band .btn-w.solid { background: #fff; color: var(--blue-deep); }
.cta-band .btn-w.solid:hover { background: #e8eeff; transform: translateY(-1px); }
.cta-band .btn-w.ghost { border: 1.5px solid rgba(255,255,255,.45); color: #fff; }
.cta-band .btn-w.ghost:hover { border-color: #fff; background: rgba(255,255,255,.08); }
.cta-band .btn-w:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
`;

  const body = `<a class="skip" href="#main">Skip to content</a>

${metaStrip('Pricing · v0.3 preview')}

${nav('pricing', '')}

<!-- ── HERO ───────────────────────────────────────────────── -->
<section class="pricing-hero" id="main">
  <div class="pricing-wrap">
    <h1>Simple, honest pricing.</h1>
    <p class="lede">One platform, six products. Pay for what your team actually uses.</p>
    <div class="ctrl-row">
      <div class="tog" role="group" aria-label="Billing period">
        <button id="btn-mensuel" class="active" onclick="setBilling('mensuel')">Mensuel</button>
        <button id="btn-annuel" onclick="setBilling('annuel')">Annuel <span class="save-badge">−20%</span></button>
      </div>
      <div class="cur" role="group" aria-label="Currency">
        <button id="btn-mad" class="active" onclick="setCurrency('mad')">MAD</button>
        <button id="btn-usd" onclick="setCurrency('usd')">USD</button>
        <button id="btn-eur" onclick="setCurrency('eur')">EUR</button>
      </div>
    </div>
  </div>
</section>

<!-- ── PLAN CARDS ─────────────────────────────────────────── -->
<section class="plans-section">
  <div class="pricing-wrap">
    <div class="plans-grid">

      <!-- Free -->
      <div class="plan-card">
        <div class="plan-name">Free</div>
        <div class="plan-price" data-mad="0 MAD" data-usd="$0" data-eur="0 €">0 MAD</div>
        <div class="plan-sub">Get started</div>
        <hr class="plan-divider">
        <ul class="plan-features">
          <li>1 user included</li>
          <li>1 catalog product</li>
          <li>500 MB document storage</li>
          <li>Community support</li>
        </ul>
        <a class="plan-cta outline" href="#signup">Get started</a>
      </div>

      <!-- Founding -->
      <div class="plan-card">
        <span class="plan-badge red">Limited</span>
        <div class="plan-name">Founding</div>
        <div class="plan-price" data-mad="59 MAD / mois" data-usd="$8 / month" data-eur="7 € / month">59 MAD / mo</div>
        <div class="plan-sub">Early access · price locked</div>
        <hr class="plan-divider">
        <ul class="plan-features">
          <li>3 users included</li>
          <li>2 catalog products</li>
          <li>5 GB document storage</li>
          <li>Email support</li>
        </ul>
        <a class="plan-cta outline" href="#signup?early-access=true">Join waitlist</a>
      </div>

      <!-- Pro -->
      <div class="plan-card featured">
        <span class="plan-badge blue">Most popular</span>
        <div class="plan-name">Pro</div>
        <div id="pro-price" class="plan-price"
          data-mad-mensuel="99 MAD / month" data-mad-annuel="79 MAD / month"
          data-usd-mensuel="$13 / month"    data-usd-annuel="$10 / month"
          data-eur-mensuel="12 € / month"   data-eur-annuel="9 € / month">99 MAD / mo</div>
        <div class="plan-sub">Best for growing teams</div>
        <hr class="plan-divider">
        <ul class="plan-features">
          <li>10 users included</li>
          <li>3 catalog products</li>
          <li>25 GB document storage</li>
          <li>Standard API access</li>
          <li>Email &amp; chat support</li>
        </ul>
        <a id="pro-cta" class="plan-cta primary" href="#signup?plan=pro&billing=mensuel">Get started</a>
      </div>

      <!-- Power -->
      <div class="plan-card">
        <div class="plan-name">Power</div>
        <div id="pow-price" class="plan-price"
          data-mad-mensuel="149 MAD / month" data-mad-annuel="129 MAD / month"
          data-usd-mensuel="$21 / month"     data-usd-annuel="$17 / month"
          data-eur-mensuel="19 € / month"    data-eur-annuel="15 € / month">149 MAD / mo</div>
        <div class="plan-sub">For advanced teams</div>
        <hr class="plan-divider">
        <ul class="plan-features">
          <li>Unlimited users</li>
          <li>All 6 catalog products</li>
          <li>100 GB document storage</li>
          <li>Advanced API access</li>
          <li>Priority support</li>
        </ul>
        <a id="pow-cta" class="plan-cta outline" href="#signup?plan=power&billing=mensuel">Get started</a>
      </div>

      <!-- Team / Enterprise -->
      <div class="plan-card">
        <div class="plan-name">Team / Enterprise</div>
        <div class="plan-price" data-mad="Custom" data-usd="Custom" data-eur="Custom">Custom</div>
        <div class="plan-sub">Volume &amp; custom deployment</div>
        <hr class="plan-divider">
        <ul class="plan-features">
          <li>Unlimited users</li>
          <li>All 6 products + custom</li>
          <li>Unlimited storage</li>
          <li>Custom integrations</li>
          <li>Dedicated support (SLA)</li>
          <li>On-prem or cloud</li>
        </ul>
        <a class="plan-cta outline" href="#contact">Contact us</a>
      </div>

    </div>
  </div>
</section>

<!-- ── COMPARISON TABLE ───────────────────────────────────── -->
<section class="compare-section">
  <div class="pricing-wrap">
    <h2>Compare plans.</h2>
    <p class="section-sub">All prices are ex-tax. Billed monthly or annually.</p>
    <div class="compare-wrap">
      <table class="ctable">
        <thead>
          <tr>
            <th>Feature</th>
            <th>Free</th>
            <th>Founding</th>
            <th>Pro</th>
            <th>Power</th>
            <th>Enterprise</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Price</td>
            <td class="mono" id="table-price-free" data-mad="0 MAD" data-usd="$0" data-eur="0 €">0 MAD</td>
            <td class="mono" id="table-price-founding" data-mad="59 MAD / month" data-usd="$8 / month" data-eur="7 € / month">59 MAD / mo</td>
            <td class="mono" id="table-price-pro"
                data-mad-mensuel="99 MAD / month" data-mad-annuel="79 MAD / month"
                data-usd-mensuel="$13 / month" data-usd-annuel="$10 / month"
                data-eur-mensuel="12 € / month" data-eur-annuel="9 € / month">99 MAD / mo</td>
            <td class="mono" id="table-price-power"
                data-mad-mensuel="149 MAD / month" data-mad-annuel="129 MAD / month"
                data-usd-mensuel="$21 / month" data-usd-annuel="$17 / month"
                data-eur-mensuel="19 € / month" data-eur-annuel="15 € / month">149 MAD / mo</td>
            <td class="mono" id="table-price-team" data-mad="Custom" data-usd="Custom" data-eur="Custom">Custom</td>
          </tr>
          <tr>
            <td>Included users</td>
            <td>1</td><td>3</td><td>10</td><td>Unlimited</td><td>Unlimited</td>
          </tr>
          <tr>
            <td>Catalog products</td>
            <td>1</td><td>2</td><td>3</td><td>6</td><td>6 + custom</td>
          </tr>
          <tr>
            <td>API integrations</td>
            <td><span class="dash">—</span></td><td>Basic</td><td>Standard</td><td>Advanced</td><td>Custom</td>
          </tr>
          <tr>
            <td>Support</td>
            <td>Community</td><td>Email</td><td>Email &amp; chat</td><td>Priority</td><td>Dedicated (SLA)</td>
          </tr>
          <tr>
            <td>Document storage</td>
            <td>500 MB</td><td>5 GB</td><td>25 GB</td><td>100 GB</td><td>Unlimited</td>
          </tr>
          <tr>
            <td>Deployment</td>
            <td>Cloud</td><td>Cloud</td><td>Cloud</td><td>Cloud</td><td>Cloud or on-prem</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</section>

<!-- ── FAQ ────────────────────────────────────────────────── -->
<section class="faq-section">
  <div class="pricing-wrap">
    <h2>Frequently asked questions.</h2>
    <p class="section-sub">Everything you need to know before you start.</p>

    <details class="faq">
      <summary class="faq-q"><span>Can I switch plans at any time?</span><span class="faq-icon">+</span></summary>
      <p class="faq-a">Yes. Upgrades take effect immediately on a pro-rata basis. Downgrades apply at the start of the next billing period.</p>
    </details>

    <details class="faq">
      <summary class="faq-q"><span>What is the Founding plan?</span><span class="faq-icon">+</span></summary>
      <p class="faq-a">Early access at a price-locked rate for the first users. The price will never increase as long as the subscription stays active. Limited seats.</p>
    </details>

    <details class="faq">
      <summary class="faq-q"><span>How does annual billing work?</span><span class="faq-icon">+</span></summary>
      <p class="faq-a">Pay 12 months upfront and save ~20% compared to the monthly rate. The discount applies to Pro and Power plans only.</p>
    </details>

    <details class="faq">
      <summary class="faq-q"><span>Are prices inclusive or exclusive of tax?</span><span class="faq-icon">+</span></summary>
      <p class="faq-a">All displayed prices are ex-tax. Applicable VAT is added at checkout based on your country of residence.</p>
    </details>

    <details class="faq">
      <summary class="faq-q"><span>What does Team / Enterprise include?</span><span class="faq-icon">+</span></summary>
      <p class="faq-a">On-prem or dedicated cloud deployment, guaranteed SLA, guided onboarding, custom integrations, and a dedicated account manager. Contact us for a quote within 24 h.</p>
    </details>

    <details class="faq">
      <summary class="faq-q"><span>Is there a free trial?</span><span class="faq-icon">+</span></summary>
      <p class="faq-a">The Free plan is permanent with no credit card required. For Pro and Power, a 14-day trial is available — no payment needed until the trial ends.</p>
    </details>

  </div>
</section>

<!-- ── CTA BAND ───────────────────────────────────────────── -->
<section class="cta-band">
  <div class="pricing-wrap">
    <h2>Ready to get started?</h2>
    <p>Free to start. No credit card required.</p>
    <div class="cta-band-btns">
      <a class="btn-w solid" href="#signup">Start for free</a>
      <a class="btn-w ghost" href="#contact">Talk to sales</a>
    </div>
  </div>
</section>

${footer('')}

<script>
  // Nav behaviour
  const nav = document.getElementById('nav');
  const ham = document.getElementById('ham');
  const mob = document.getElementById('mobile-menu');
  addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 8), { passive: true });
  ham.addEventListener('click', () => {
    const open = nav.classList.toggle('menu-open');
    ham.setAttribute('aria-expanded', open ? 'true' : 'false');
    mob.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // State
  let billing = 'mensuel', currency = 'mad';

  function setBilling(b) {
    billing = b;
    document.getElementById('btn-mensuel').classList.toggle('active', b === 'mensuel');
    document.getElementById('btn-annuel').classList.toggle('active', b === 'annuel');
    // Update Pro & Power prices + CTA links
    const proEl = document.getElementById('pro-price');
    const powEl = document.getElementById('pow-price');
    proEl.textContent = proEl.dataset[currency + (b === 'annuel' ? 'Annuel' : 'Mensuel')];
    powEl.textContent = powEl.dataset[currency + (b === 'annuel' ? 'Annuel' : 'Mensuel')];
    document.getElementById('pro-cta').href = '#signup?plan=pro&billing=' + b;
    document.getElementById('pow-cta').href = '#signup?plan=power&billing=' + b;
  }

  function setCurrency(c) {
    currency = c;
    ['mad','usd','eur'].forEach(k => document.getElementById('btn-' + k).classList.toggle('active', k === c));
    // Fixed-price cards (no billing toggle)
    document.querySelectorAll('[data-mad]:not([data-mad-mensuel])').forEach(el => {
      el.textContent = el.dataset[c];
    });
    // Variable-price cards
    const suffix = billing === 'annuel' ? 'Annuel' : 'Mensuel';
    const proEl = document.getElementById('pro-price');
    const powEl = document.getElementById('pow-price');
    proEl.textContent = proEl.dataset[c + suffix];
    powEl.textContent = powEl.dataset[c + suffix];
  }
<\/script>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Pricing — Virtus Operandi</title>
<meta name="description" content="Virtus Operandi codifies the right way of doing things into software — built by operators for operators, across manufacturing, transport, and the back office." />
${FONTS}
<link rel="stylesheet" href="assets/site.css" />
<style>${pricingStyles}</style>
</head>
<body>
${body}
</body>
</html>
`;
}

// ─── Write all 16 files ───────────────────────────────────────
function write(rel, contents) {
  const abs = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, contents);
  console.log('+', rel);
}

for (const p of PRODUCTS) write(`products/${p.slug}.html`, renderProduct(p));
for (const i of INDUSTRIES) write(`industries/${i.slug}.html`, renderIndustry(i));
for (const s of SINGLES) write(s.out, renderSingle(s));
write('pricing.html', renderPricing());

console.log(`\nDone — ${PRODUCTS.length + INDUSTRIES.length + SINGLES.length + 1} pages.`);
