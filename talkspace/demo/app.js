// Layout comes from the Figma frames: card (1059:28938) and reviews page "option B" (1092:37051).
// Reviews and summaries are prototype-only fiction.
//
// The member told intake they came in with anxiety, so every card summarizes reviews from
// clients who also came in with anxiety, whatever the provider's listed specialties.
//
// `intakeReviews` are from clients with the same concern: they feed the "Summarized from
// X of Y" line and render as grey cards. `otherReviews` render as outlined cards and carry
// a topic (or null) for the topic filter. X and Y are always derived, never typed.
//
// The card link shows no review count. Clients helped shows only as a 100+ milestone.
//
// Three levels decide what fills the green block (it is always present, always the same size):
//   rich  3+ reviews from clients with the member's concern → ✦ AI summary of those reviews
//   thin  some reviews, but too few to summarize honestly   → ♡ provider's own words + real reviews
//   cold  no reviews yet (new provider)                     → ♡ provider's own words; links to "Meet <name>"
//
// The "Meet" page only shows what the provider has (never "no reviews yet"), and every section
// adds something the card didn't, so tapping through is never a step down.

const MEMBER_INTAKE = "anxiety";

// Below this, a "summary" would just be a paraphrase of one or two people
const MIN_SUMMARY_REVIEWS = 3;

// Clients helped on Talkspace appears only as a milestone, rounded down ("200+").
// Established providers get this proof; new providers get to speak for themselves instead.
const MIN_CLIENTS_SHOWN = 100;
const clientsLabel = (n) => (n >= MIN_CLIENTS_SHOWN ? `${Math.floor(n / 100) * 100}+` : null);

const TOPIC_LABELS = {
  anxiety: "Anxiety",
  depression: "Depression",
  substance: "Substance use",
  adhd: "ADHD",
};

const PROVIDERS = [
  {
    id: "lisa",
    name: "Lisa Marie",
    recommended: true,
    specialties: ["Anxiety", "Depression", "Substance use"],
    summary:
      "They describe leaving with something concrete to try before the next session, and say she reframes anxious thinking without dismissing it.",
    highlights: { field: "Psychology", years: "10 years", clients: 130, gender: "female" },
    intakeReviews: [
      ["Lisa is very good at what she does. I always leave our sessions feeling a little lighter and with something concrete to try before we meet again.", "Sep 18, 2026"],
      ["Fantastic, highly recommend.", "Sep 9, 2026"],
      ["Lisa is one of the most committed and talented therapists I have worked with in years of counseling. She listens closely, provides practical tools, and offers a quality of care and ongoing support that genuinely stands out. I always feel understood and never judged, and I leave each session with a clear next step and a healthier perspective on what I am going through.", "Aug 27, 2026"],
      ["I came in with constant panic about work. Lisa never told me my worries were silly, she just helped me look at them from a different angle. The breathing exercise she gave me in our first session still helps.", "Aug 14, 2026"],
      ["Lisa was very understanding and listened well. She came with good suggestions for how to deal with the work stress I was dealing with.", "Jul 30, 2026"],
      ["She gives me small homework between sessions, like writing down an anxious thought and what actually ended up happening. Sounds simple, but it changed how I see my own predictions.", "Jul 11, 2026"],
      ["I've had therapists who just nod. When my thinking starts spiraling, Lisa gently pushes back and asks what the evidence is. I needed that.", "Jun 22, 2026"],
      ["She helped me sort out which worries I can actually do something about and which ones I just have to let sit. I'm sleeping better than I have in a year.", "Jun 3, 2026"],
      ["Very calm presence. I was nervous about starting therapy at all and she made the first session feel easy.", "May 15, 2026"],
    ],
    otherReviews: [
      ["After my divorce I stopped doing pretty much everything. Lisa helped me build back one small routine at a time, starting with just getting outside every morning.", "Sep 4, 2026", "depression"],
      ["Six months sober now. Lisa never lectured me, and she helped me figure out what I was actually drinking to avoid.", "Aug 8, 2026", "substance"],
      ["Great listener. She remembers details from weeks ago, which made me feel like she was really paying attention.", "Jul 2, 2026", null],
      ["She was honest with me when I needed it and gentle when I couldn't take more. My mood has been more stable for months now.", "Jun 10, 2026", "depression"],
      ["Helped me get through a really heavy few months.", "May 2, 2026", "depression"],
      ["Lisa helped me notice the patterns behind my cravings instead of just white-knuckling through them. That made all the difference.", "Apr 19, 2026", "substance"],
    ],
  },
  {
    id: "john",
    name: "John Doe",
    specialties: ["ADHD", "Depression", "Substance use"],
    summary:
      "They describe him helping untangle anxiety from day-to-day overwhelm, and say his structured approach makes worry feel manageable.",
    highlights: { field: "Social work", years: "6 years", clients: 60, gender: "male" },
    intakeReviews: [
      ["My anxiety and my ADHD feed each other. John helped me see when I was anxious because I was actually behind, and when it was just noise.", "Sep 20, 2026"],
      ["He breaks things down into steps so small they stop feeling scary. My Sunday-night dread is mostly gone.", "Aug 18, 2026"],
      ["Very structured, which I needed. Every session has a plan, and the anxiety feels a lot less shapeless now.", "Jul 7, 2026"],
    ],
    otherReviews: [
      ["I was diagnosed with ADHD at 34 and had no idea where to start. John helped me set up a morning routine that I've actually kept for two months now.", "Sep 25, 2026", "adhd"],
      ["He never made me feel lazy for missing deadlines. Instead of making yet another to-do list, we figured out why I was getting stuck in the first place.", "Sep 6, 2026", "adhd"],
      ["Really practical. Timers, body doubling, breaking tasks into tiny steps. Not everything worked for me but a lot of it did.", "Aug 12, 2026", "adhd"],
      ["John gets ADHD. Sessions stay focused, but he's fine when I go off on a tangent and he always brings me back.", "Jul 19, 2026", "adhd"],
      ["I used to think I was just bad at being an adult. Now I understand my brain works differently and I have tools that fit it.", "Jun 24, 2026", "adhd"],
      ["Good listener and very organized. Helped with the low mood that came with all the overwhelm too.", "May 30, 2026", "depression"],
      ["He helped me cut back on drinking without making it the only thing we talked about.", "May 4, 2026", "substance"],
    ],
  },
  {
    id: "jane",
    name: "Jane Lee",
    specialties: ["Depression", "Anxiety", "Substance use", "ADD/ADHD"],
    summary:
      "They describe her as steady and patient when anxiety peaks, and say she helps them notice small progress they would have missed.",
    highlights: { field: "Counseling", years: "14 years", clients: 240, gender: "female" },
    intakeReviews: [
      ["When my panic attacks were at their worst, Jane was the calmest person in my life. She taught me how to ride them out instead of fighting them.", "Sep 22, 2026"],
      ["She points out progress I would never have noticed on my own, like the fact that I went to a party and stayed for an hour.", "Aug 29, 2026"],
      ["Patient and never rushed. I take a while to open up and she let me go at my own pace.", "Aug 1, 2026"],
      ["Jane helped me understand my health anxiety without making me feel ridiculous about it. I've stopped googling every symptom.", "Jun 26, 2026"],
      ["Kind, warm, and honest. I feel more like myself again.", "May 16, 2026"],
    ],
    otherReviews: [
      ["Jane was patient with me through a really dark winter. She never rushed me, and she kept pointing out the small wins I was dismissing.", "Sep 10, 2026", "depression"],
      ["Some weeks I could barely talk. She was steady every single time and never made me feel like I was wasting the session.", "Aug 3, 2026", "depression"],
      ["She helped me get back to the things I used to enjoy, one small step at a time. I went for my first run in a year last month.", "Jul 1, 2026", "depression"],
    ],
  },
  {
    // Thin: two reviews, only one from a client who came in with anxiety
    id: "priya",
    name: "Priya Shah",
    specialties: ["Depression", "Anxiety", "Grief"],
    ownWords:
      "Anxiety can feel like a to-do list that never ends. Together we'll slow it down, name what's underneath, and try one practical tool between sessions.",
    highlights: { field: "Social work", years: "4 years", clients: 25, gender: "female" },
    intakeReviews: [
      ["Priya helped me get a handle on the constant worry after my dad passed. She's gentle, but she also gives you real things to try.", "Aug 30, 2026"],
    ],
    otherReviews: [
      ["Really kind and easy to talk to. I felt heard from the very first session.", "Jul 12, 2026", null],
    ],
  },
  {
    // Cold: new to Talkspace, no reviews yet
    id: "sam",
    name: "Sam Rivera",
    specialties: ["Anxiety", "Trauma", "Relationships"],
    ownWords:
      "We'll start by noticing when anxiety shows up for you and what it might be protecting. Then we'll practice one small, concrete skill at a time, at a pace that feels manageable.",
    highlights: { field: "Counseling", years: "8 years", clients: 0, gender: "male" },
    // "Meet Sam" page content: the long answer, a second prompt, and Talkspace-verified training
    approach:
      "We'll start by noticing when anxiety shows up for you and what it might be protecting. Then we'll practice one small, concrete skill at a time, at a pace that feels manageable. I lean on CBT, so expect some light practice between sessions, like writing down an anxious thought and checking it against what actually happened. My goal is for you to leave every session with one thing to try.",
    firstSession:
      "Our first session is mostly about getting to know you. I'll ask what brought you here, what you've already tried, and what you'd like to feel different. There's no pressure to share everything at once. We'll finish by agreeing on one small goal for the next couple of weeks.",
    training: [
      "Licensed Professional Counselor (LPC)",
      "Cognitive behavioral therapy (CBT)",
      "Exposure therapy for anxiety",
      "Trauma-focused CBT",
    ],
    intakeReviews: [],
    otherReviews: [],
  },
];

const GENDER_ICON = { female: "assets/venus.svg", male: "assets/mars.svg" };

const firstName = (p) => p.name.split(" ")[0];

const initials = (p) => p.name.split(" ").map((w) => w[0]).join("");

const totalReviews = (p) => p.intakeReviews.length + p.otherReviews.length;

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const levelOf = (p) =>
  p.intakeReviews.length >= MIN_SUMMARY_REVIEWS ? "rich" : totalReviews(p) > 0 ? "thin" : "cold";

const eyebrowHTML = () =>
  `<p class="summary__eyebrow">✦ From clients who came in with <strong>${esc(MEMBER_INTAKE)}</strong></p>`;

// Thin + cold: the provider answers a prompt about the member's concern, in first person.
// The heart (not ✦) marks it as the provider speaking, not an AI summary of reviews.
const ownWordsHTML = (p, text = p.ownWords) => `
  <p class="summary__eyebrow summary__eyebrow--icon">
    <img src="assets/heart.svg" alt="" width="16" height="16" />
    <span>How ${esc(firstName(p))} works with <strong>${esc(MEMBER_INTAKE)}</strong></span>
  </p>
  <p class="summary__body">“${esc(text)}”</p>`;

const CARD_LINKS = {
  rich: () => "Read reviews from clients like you",
  thin: () => "Read what clients say",
  cold: (p) => `Read what ${firstName(p)} says`,
};

// ---------- Render: provider card ----------

function cardHTML(p) {
  // As in Figma, the provider's first (top) specialty carries the star
  const tags = p.specialties
    .map((s, i) =>
      i === 0
        ? `<li class="tag tag--top body-xs"><img src="assets/star.svg" alt="" />${esc(s)}</li>`
        : `<li class="tag body-xs">${esc(s)}</li>`
    )
    .join("");

  const h = p.highlights;
  const level = levelOf(p);
  return `
    <article class="card" data-id="${p.id}" aria-label="${esc(p.name)}">
      <div class="card__top">
        ${p.recommended ? `<p class="card__match body-sm">Your recommended match</p>` : ""}
        <div class="card__identity">
          <span class="avatar" aria-hidden="true">${esc(initials(p))}</span>
          <h2 class="provider-name">${esc(p.name)}</h2>
        </div>
        <p class="card__label heading-xs">Specialties</p>
        <ul class="tags" aria-label="Specialties">${tags}</ul>
      </div>

      <div class="summary-wrap">
        <div class="summary body-sm">
          ${level === "rich" ? `${eyebrowHTML()}<p class="summary__body">${esc(p.summary)}</p>` : ownWordsHTML(p)}
          <a class="summary__link" href="#/provider/${p.id}">${esc(CARD_LINKS[level](p))} &gt;</a>
        </div>
      </div>

      <ul class="highlights body-xs" aria-label="About ${esc(firstName(p))}">
        <li><img src="assets/graduation-cap.svg" alt="" /><span>${esc(h.field)}</span></li>
        <li><img src="assets/loveseat.svg" alt="" /><span>${esc(h.years)}</span></li>
        ${clientsLabel(h.clients) ? `<li><img src="assets/people-group.svg" alt="" /><span>${clientsLabel(h.clients)}</span></li>` : ""}
        <li><img src="${GENDER_ICON[h.gender]}" alt="" /><span class="strong">${esc(h.gender)}</span></li>
      </ul>

      <div class="card__footer">
        <button class="btn-tile" type="button">View available times</button>
      </div>
    </article>`;
}

// ---------- Render: reviews page ----------

// First entry is listed first in the dropdown; the default is set in showReviews
const SORTS = { recent: "Most recent", relevant: "Most relevant" };

// One flat shape for both groups; `intake` decides grey vs outlined
const allReviews = (p) => [
  ...p.intakeReviews.map(([text, date]) => ({ text, date, topic: MEMBER_INTAKE, intake: true })),
  ...p.otherReviews.map(([text, date, topic]) => ({ text, date, topic, intake: false })),
];

const byNewest = (a, b) => new Date(b.date) - new Date(a.date);

// Only offer topics that actually have reviews, in a stable order
const topicsFor = (p) => {
  const present = new Set(allReviews(p).map((r) => r.topic));
  return Object.keys(TOPIC_LABELS).filter((t) => present.has(t));
};

const reviewItemsHTML = (reviews) =>
  reviews
    .map(
      (r) => `
      <li class="review review--${r.intake ? "intake" : "other"}">
        ${r.intake ? `<span class="tag review__context body-xs">Came in with ${esc(MEMBER_INTAKE)}</span>` : ""}
        <p class="review__text body-sm">${esc(r.text)}</p>
        <div class="review__meta heading-xs">
          <span class="review__author"><img src="assets/check-circle.svg" alt="" width="16" height="16" />Verified client</span>
          <span>${esc(r.date)}</span>
        </div>
      </li>`
    )
    .join("");

function filtersHTML(p, state) {
  const chip = (topic, label) =>
    `<button class="chip" type="button" data-topic="${topic}" aria-pressed="${state.topic === topic}">${esc(label)}</button>`;

  const options = Object.entries(SORTS)
    .map(([value, label]) => `<option value="${value}"${state.sort === value ? " selected" : ""}>${label}</option>`)
    .join("");

  return `
    <div class="filters">
      <div class="filters__row">
        <label class="sort">
          <span class="visually-hidden">Sort reviews</span>
          <select class="sort__select body-sm" data-control="sort">${options}</select>
        </label>
        <span class="filters__divider" aria-hidden="true"></span>
        <div class="filters__chips" role="group" aria-label="Filter by topic">
          ${chip("all", "All")}
          ${topicsFor(p).map((t) => chip(t, TOPIC_LABELS[t])).join("")}
        </div>
      </div>
    </div>`;
}

function resultsHTML(p, state) {
  const shown = allReviews(p)
    .filter((r) => state.topic === "all" || r.topic === state.topic)
    .sort(byNewest);

  if (!shown.length) {
    return `<p class="reviews__empty body-sm">No reviews mention ${esc(TOPIC_LABELS[state.topic])} yet.</p>`;
  }

  // Most recent: one list by date; grey fill + "Came in with" tag mark clients like you
  if (state.sort === "recent") {
    return `<ul class="review-list" aria-label="Reviews, newest first">${reviewItemsHTML(shown)}</ul>`;
  }

  // Most relevant: clients like you first, then everyone else under a label
  const intake = shown.filter((r) => r.intake);
  const other = shown.filter((r) => !r.intake);
  return `
    ${intake.length ? `<ul class="review-list" aria-label="Reviews from clients who came in with ${esc(MEMBER_INTAKE)}">${reviewItemsHTML(intake)}</ul>` : ""}
    ${other.length ? `
      <section class="review-group" aria-labelledby="other-reviews-label">
        ${intake.length ? `<h2 class="review-group__label" id="other-reviews-label">Other reviews</h2>` : ""}
        <ul class="review-list" aria-label="Other reviews">${reviewItemsHTML(other)}</ul>
      </section>` : ""}`;
}

// ---------- Render: "Meet" page (cold providers) ----------

function meetHTML(p) {
  const name = esc(firstName(p));
  const training = p.training
    .map((t) => `<li><img src="assets/check-circle.svg" alt="" width="16" height="16" /><span>${esc(t)}</span></li>`)
    .join("");

  return `
    <div class="summary-wrap"><div class="summary body-sm">${ownWordsHTML(p, p.approach)}</div></div>

    <section class="profile-section" aria-labelledby="first-session-title">
      <h2 class="profile-section__title" id="first-session-title">What your first session looks like</h2>
      <p class="profile-section__body body-sm">“${esc(p.firstSession)}”</p>
      <p class="profile-section__note heading-xs">In ${name}'s words</p>
    </section>

    <section class="profile-section" aria-labelledby="training-title">
      <h2 class="profile-section__title" id="training-title">Training and approach</h2>
      <ul class="verified-list body-sm">${training}</ul>
      <p class="profile-section__note heading-xs">Verified by Talkspace</p>
    </section>`;
}

function reviewsHTML(p, state) {
  const level = levelOf(p);

  if (level === "cold") return meetHTML(p);

  // Thin: too few reviews to summarize or filter, so show them as they are
  if (level === "thin") {
    return `
      <div class="summary-wrap"><div class="summary body-sm">${ownWordsHTML(p)}</div></div>
      <ul class="review-list" aria-label="Client reviews">${reviewItemsHTML(allReviews(p).sort(byNewest))}</ul>`;
  }

  return `
    <div class="summary-wrap">
      <div class="summary body-sm">
        ${eyebrowHTML()}
        <div class="summary__group">
          <p class="summary__body">${esc(p.summary)}</p>
          <p class="summary__source">Summarized from ${p.intakeReviews.length} of ${totalReviews(p)} reviews</p>
        </div>
      </div>
    </div>
    ${filtersHTML(p, state)}
    <p class="visually-hidden" role="status" id="review-status"></p>
    <div class="review-results" id="review-results">${resultsHTML(p, state)}</div>`;
}

// ---------- Reviews page state ----------

let current = null; // { provider, state: { sort, topic } }

const reviewsContent = document.getElementById("reviews-content");

function updateResults() {
  document.getElementById("review-results").innerHTML = resultsHTML(current.provider, current.state);
  const count = document.querySelectorAll("#review-results .review").length;
  document.getElementById("review-status").textContent = `Showing ${count} reviews`;
  reviewsContent.querySelectorAll(".chip").forEach((c) =>
    c.setAttribute("aria-pressed", String(c.dataset.topic === current.state.topic))
  );
}

reviewsContent.addEventListener("change", (e) => {
  if (e.target.dataset.control !== "sort") return;
  current.state.sort = e.target.value;
  updateResults();
});

reviewsContent.addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  current.state.topic = chip.dataset.topic;
  updateResults();
});

// ---------- Routing: #/ (list) and #/provider/:id ----------

const listScreen = document.getElementById("screen-list");
const reviewsScreen = document.getElementById("screen-reviews");
const reviewsScroll = reviewsScreen.querySelector(".scroll");

// ?only=<id> renders just that provider's card with no device chrome (for case-study screenshots)
const params = new URLSearchParams(location.search);
const onlyId = params.get("only");
if (onlyId) document.body.classList.add("card-only");
// ?shot: transparent page background so headless screenshots can be auto-cropped
if (params.has("shot")) document.body.classList.add("shot");
// ?embed: phone frame with status bar, transparent page, for embedding in an iframe
if (params.has("embed")) document.body.classList.add("embed");
// ?nomatch: hide the "Your recommended match" line (so card screenshots line up)
if (params.has("nomatch")) document.body.classList.add("nomatch");
document.getElementById("provider-cards").innerHTML = PROVIDERS
  .filter((p) => !onlyId || p.id === onlyId)
  .map(cardHTML)
  .join("");
// ?focus=<id>: dim every card except this one (for annotated screenshots)
const focusId = params.get("focus");
if (focusId) document.querySelectorAll("#provider-cards .card").forEach((c) => { if (c.dataset.id !== focusId) c.classList.add("card--dim"); });

function showList() {
  listScreen.hidden = false;
  listScreen.classList.remove("screen--behind");
  reviewsScreen.classList.add("screen--pushed");
  reviewsScreen.addEventListener("transitionend", () => {
    if (reviewsScreen.classList.contains("screen--pushed")) reviewsScreen.hidden = true;
  }, { once: true });
}

function showReviews(provider) {
  // Cold providers have no reviews, so their page is a "Meet" page rather than a reviews page
  const prefix = levelOf(provider) === "cold" ? "Meet" : "Reviews for";
  document.getElementById("reviews-title").textContent = `${prefix} ${firstName(provider)}`;
  // Every visit starts on the default view
  current = { provider, state: { sort: params.get("sort") || "recent", topic: "all" } };
  reviewsContent.innerHTML = reviewsHTML(provider, current.state);
  reviewsScroll.scrollTop = 0;
  reviewsScreen.hidden = false;
  // Force a reflow so the push transition runs after un-hiding
  void reviewsScreen.offsetWidth;
  reviewsScreen.classList.remove("screen--pushed");
  listScreen.classList.add("screen--behind");
  // Move focus to the new page's title for screen readers, without a visible ring on the back button
  document.getElementById("reviews-title").focus({ preventScroll: true });
}

function route() {
  const match = location.hash.match(/^#\/provider\/(\w+)/);
  const provider = match && PROVIDERS.find((p) => p.id === match[1]);
  provider ? showReviews(provider) : showList();
}

reviewsScreen.querySelector("[data-action='back']").addEventListener("click", () => {
  // Embedded in a page, history.back() could leave the host page, so reset the hash directly
  if (!params.has("embed") && history.length > 1 && location.hash.startsWith("#/provider")) history.back();
  else location.hash = "#/";
});

window.addEventListener("hashchange", route);
route();

// ?scroll=<px>: start the visible screen scrolled down (for screenshots)
if (params.has("scroll")) {
  const visible = reviewsScreen.hidden ? listScreen : reviewsScreen;
  visible.querySelector(".scroll").scrollTop = Number(params.get("scroll"));
}
