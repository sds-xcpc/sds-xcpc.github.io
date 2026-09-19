# Team Training Scoreboard

- `/training/scoreboard`: team identities, Average Rating and per-contest ratings. Contest headings use short titles and link to the detailed standings.
- `/training/scoreboard/:contestId`: original ranks, ratings, problem cells, solved totals, total time and Dirt. Pintia Dirt is derived from its per-problem submission counts.
- The individual selection scoreboard at `/training/standing` is unchanged.

## Shared Team Roster

`src/data/training-teams.json` is the shared source for the training-page roster and both scoreboard levels. Each team has a stable `id`, Chinese/English names, members, status and QOJ username. Keep the `id` unchanged when editing names or members. Results join by team id, not by display order. Official/candidate status is explicit rather than inferred from rank.

## Import Another Contest

Save the offline HTML snapshot under `resources/training-scoreboards/`, then run:

```powershell
python scripts/import-team-scoreboard.py resources/training-scoreboards/qoj4114-20260913.html --title "XIX Open Cup named after E.V. Pankratiev, Grand Prix of Korea" --short-title "XIX Gp of Korea" --date 2026-09-13 --id xix-gp-of-korea
```

Use the new contest's full title, optional short title, actual training date and unique lowercase URL slug. The importer parses the HTML table without executing scripts. It matches QOJ usernames to the shared roster, preserves source ratings and per-problem text, and checks ratings against the source formula and solved totals against accepted cells. Unknown or duplicate teams fail the import. Member-name discrepancies are reported; the website displays the canonical roster while retaining `sourceMembers` in the imported data.

The September 19 CCPC Online standings come from Pintia's public read-only XCPC ranking for competition `2099750481526394880`. To regenerate from the committed compressed snapshot, run `python scripts/import-pintia-scoreboard.py`. Use `--refresh` only when intentionally replacing the source snapshot with a new public response. The importer maps Pintia team IDs to the stable roster IDs, validates school and source team names, and includes only the 2,169 non-excluded teams in `n`; `x` is the public board's top solved count of 13. It computes the same rating formula as the first contest, preserving original rank, submissions, time and team aliases. Pintia's `solvingTime` is already the displayed total time **including** wrong-submission penalties; do not add `penaltyTime` again. Dirt is the floor of 100 times wrong submissions on accepted problems divided by all submissions on those accepted problems; attempts on unsolved problems are excluded. This reproduces all ten published Dirt values in the first QOJ contest. The official roster remains primary, and a different source team name/member list appears as additional detail. `sourceMembers` is not a roster edit.

The team `human-verification` appeared as `正在验证该队是否是真人。` with a different published lineup. Its CCPC rating of 87.5 exceeds its previous 33.4, so it is included. The importer omits this result if a refreshed source produces a lower rating, as requested. The combined Average Rating uses the exact arithmetic mean of published one-decimal contest ratings; display allows two decimal places.

Imported JSON files go to `src/data/team-contests/`. Vite discovers all files in that directory automatically: no route or contest registry edits are needed. Both levels use the same contest data. The overview sorts by Average Rating descending, using the arithmetic mean of each team's published ratings. Pending contests and absent entries show a dash and do not count in the average; a published zero does count. A team without any results sorts last. Equal averages retain roster order.

`src/data/trainingScoreboard.ts` reserves September 13, 19, 20, 26, 27 and October 5, 6, 7. Importing results with a matching date automatically replaces that date's placeholder. Contests on additional dates are added automatically in date order.

Standings fill the page without an internal scrolling frame. Wide screens show all table columns; narrower screens show unframed team bands with every date or problem visible in a wrapping grid.

The first snapshot records TeamAccept's first member as 刘珅; the confirmed roster says 刘翀. The displayed name follows the confirmed roster.

## Verification

```powershell
python scripts/test-team-scoreboard.py
python scripts/test-pintia-scoreboard.py
node --test scripts/test-team-ratings.mjs
npm run lint
npm exec -- tsc -p tsconfig.app.json --noEmit
npm run build
```

After importing another snapshot, inspect its total team/problem counts and check both levels in the local preview. Snapshots are historical results, not live remote QOJ requests.
