# Forest cover v2 — 16 families, multi-crown groupings, four routes

Folds into the **3.5.0** release entry.

The Facebook forest cover was rebuilt end to end, and the layout gate it depends on
was rebuilt with it.

**Families 22 → 16.** Five buckets were permanently capped at a single language
(Japonic, Koreanic, Hellenic, Kartvelian, Isolate) and two at two — a tree that can
never fill in reads as broken beside Romance's four. They merge into **East Asian**,
**Asia-Pacific**, **Other Indo-European** and **Isolates**, and **Constructed** now
subdivides into Auxiliary / Logical / Minimalist.

**Multi-crown trees** make that merge non-destructive: one trunk, a crown per
constituent family, the grouping named at the base and the real family named under
each crown. Japonic and Koreanic are still on the cover, with their own acorns.

**Saplings carry ghosted `planned` acorns**, so a family that hasn't shipped yet names
what is coming to it instead of showing a bare stick — while keeping the honest
silhouette at feed thumbnail size, where built and unbuilt are told apart by shape
rather than by acorn colour.

**Four routes** now converge on a worn clearing at the Master Tree, whose trunk is
restored to full height. Roots are part of the trunk outline rather than strokes laid
beside it, and the path no longer shows a squared-off end.

**New: `npm run art:check`** — `docs/marketing/sources/check_collisions.mjs`, a
from-scratch replacement for the collision checker the cover guide referenced but which
was not in the repo. It models trunks, root flares, nameplates, the paths and the
Master Tree — not just canopies — and it models every sapling **full-grown**, because a
sapling graduates in place. It also checks that fauna is not buried by paint order, not
floating above the ridge, not rooted in a path, and spread across the scene rather than
clumped. `release:preflight` runs it.

**Fixed:** `parseCover` in `release-checks.js` only scanned a family's top-level
`leafs:[]`, so every acorn on a multi-crown tree was invisible to the release gate; and
the "acorn on a sapling" rule fired on planned acorns, which now belong there.
