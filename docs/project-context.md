## Elevator Pitch

When looking for a new place to live, browsing houses on typical sites like Rightmove and Zoopla, it is hard to know which option is the best location. What if, you could put in all the places you regularly go into a free web tool, like the office, the gym, and preferred child-care. You could also add the relative importance or travel frequency for each, as well as preferred mode of transport to get there (walk, drive, bus, etc). It works out for you and shows you all the travel times for a list of your favourited houses/flats, and helps you understand the logistically best option for you.

## Tech Stack

- Svelte
- Postgres (without additional dependancies via pgserver python package, or if it won’t work well with Vercel, Neon via Vercel)
- FastAPI for the backend, SQLModel for the ORM (all Python)
- Vercel for free cloud hosting of the web app, both FE and BE (hobby tier)
- Google Maps Platform API for mapping and location and transit times
- Github, Codex, VS Code for coding

## Example User Journey (for MVP)

1. Create a new project (name, pick rough area for search like county)
2. Add your “Candidates” (houses/flats) or import from Rightmove
3. Add your “Anchors” locations via a welcome config journey (bottom right “skip to project”)
4. Calculate and show the ranking (score per candidate), list view, called “Results”
5. Add 2 from the list and open them in “Compare” view (table/heatmap)

## MVP Features I’d build first (and only first)

1. **Save candidate properties**
   - Add property manually (address AND/OR link to Rightmove/Zoopla)
   - Optional import via pasted URL (even if you just parse the address crudely at first)

2. **Add “anchor locations” (places that matter)**
   - Each one has:
     - Name (Office, Gym, Nursery, Parents, etc.)
     - Address
     - Travel mode (drive / transit / walk)
     - Frequency (times per week)
     - Importance (weight 1–5)
   - This is the core product.

3. **Calculate a single “Life Fit Score”**
   - For each property:
     - Estimated time to each anchor
     - Weighted weekly travel time
     - Total weekly travel burden (e.g. 7h 40m/week)
     - Simple rank (best to worst)
   - This is the “aha”.

4. **Compare properties side-by-side**
   - Table view: (HEATMAP WITH COLOURS!)
   - Property
   - Weekly weighted travel time
   - Office commute
   - Nursery run
   - Gym trip
   - etc.
   - Let users sort by any column

5. **Basic map view**
   - Pins for properties + anchor locations
   - Doesn’t need route drawing initially (nice-to-have)

## Extra feature ideas for later

1. Add time of day customisation/attribute to each anchor location
2. Cool mapping, showing geometric shapes for a given travel time radius (rather than circular / as-the-crow-flies)
3. Import an entire Rightmove search/saved list
4. AI recommendations or edits
5. Not just weightings like frequency or importance, but the ability to add hard rules (redlines) into the scoring equation or feasibility of a house. e.g. It scores 0 if “must not exceed X mins drive to nursery” is broken.
6. Little assumptions panel, set things like default assumed transit mode
7. Top 3 (anchor locations to show travel times for in the results view for quick reference/analysis)

## NFRs / Scoping (apply to limit MVP size/complexity)

- UK Only
- Rightmove Only (for imports)
- Google Maps map views only, nothing custom
- Vercel free tier (hobby)
- Performance can be compromised for cheapness/simplicity
