# Team Training Scoreboard

- `/training/scoreboard`: ten school teams, Average Rating and per-contest ratings. Contest headings link to details.
- `/training/scoreboard/:contestId`: source or corrected ranks, ratings, problem results, solved totals, total time and Dirt.
- `/training/standing`: individual selection standings, unchanged.

## Shared Team Roster

`src/data/training-teams.json` is the shared source for the training-page roster and both scoreboard levels. Keep stable team IDs when editing names or members. Results join by team ID, not display order. The detailed page always shows the canonical team name and members, never temporary contest aliases or lineups.

The SWERC 2024 contest detail includes nine visiting Zhejiang University teams, labelled `ZJU`, in addition to the ten school teams, for 19 teams in total. The training roster on `/training` and the overall Rating scoreboard on `/training/scoreboard` contain only the six official and four candidate school teams. ZJU results remain in the contest data and detail page but do not appear in the overall Rating ranking. ZJU teams have no entries in earlier contests; do not insert zero scores for those missing results.

## Import Results

The first QOJ snapshot is imported with:

```powershell
python scripts/import-team-scoreboard.py resources/training-scoreboards/qoj4114-20260913.html --title "XIX Open Cup named after E.V. Pankratiev, Grand Prix of Korea" --short-title "XIX Gp of Korea" --date 2026-09-13 --id xix-gp-of-korea --exclude-team beyond-the-equation
```

The September 20 QOJ snapshot omits `Easons_MD_istheRealBOSS` and has no first-place solved count, so import it with the reviewed supplement:

```powershell
python scripts/import-team-scoreboard.py resources/training-scoreboards/qoj4129-20260920.html --title "The 2026 Peking University Team Selection Day 1" --short-title "PKU Selection D1" --date 2026-09-20 --id pku-team-selection-day-1 --supplement resources/training-scoreboards/qoj4129-supplement.json --exclude-team beyond-the-equation
```

The supplement records the first-place total of 9 solves and Easons' 13 problem cells from `qoj4129-first-place.png` and `qoj4129-easons-result.png`. It inserts Easons at rank 35, moves the source's ranks 35 and later down one, and changes the rating population from 46 to 47. The importer checks the supplemental penalty against solve times and wrong submissions, derives Dirt, and updates problem attempt totals. Do not change only the generated contest JSON; regenerate it from the snapshot and supplement.

`--exclude-team beyond-the-equation` retains that team's source rank and problem record but marks its Rating as non-counting. The overview and contest detail display a dash for those results, and Average Rating ignores them. Its CCPC Online result remains valid.

The September 26 Day 4 result is imported with:

```powershell
python scripts/import-team-scoreboard.py resources/training-scoreboards/qoj4535-20260926.html --title "2016 ICPC Hong Kong" --short-title "2016 ICPC Hong Kong" --date 2026-09-26 --id 2016-icpc-hong-kong
```

The September 27 PKU Selection Day 2 result is imported with:

```powershell
python scripts/import-team-scoreboard.py resources/training-scoreboards/qoj4537-20260927.html --title "The 2026 Peking University Team Selection Day 2" --short-title "PKU Selection D2" --date 2026-09-27 --id pku-team-selection-day-2
```

The October 5 SWERC 2024 training result is imported with:

```powershell
python scripts/import-team-scoreboard.py resources/training-scoreboards/qoj4568-20261005.html --title "SWERC 2024" --short-title "SWERC 2024" --date 2026-10-05 --id swerc-2024 --supplement resources/training-scoreboards/qoj4568-supplement.json
```

The original export contains all 19 tracked teams and 13 problems. It reports a full population of 199 but leaves Rating blank because it did not capture the leader's solved count in its metadata. The same snapshot explicitly shows original rank 1, `Thoughts_everyone`, solving 12 problems. The supplement records this evidence (`x = 12`, `n = 199`) so the importer can reproduce all ratings without changing the snapshot or renumbering the ranks. It adds no extra rows and keeps the original problem totals, penalties and Dirt values. Friendly ZJU names are mapped through the export's explicit `QOJ 账号：...` title metadata to the stable roster usernames. The user identified the contest as SWERC 2024; October 5 is the training date.

The September 19 CCPC Online standings come from Pintia's public read-only XCPC ranking for competition `2099750481526394880`. Run `python scripts/import-pintia-scoreboard.py` to regenerate from the compact snapshot. Use `--refresh` only to intentionally fetch and replace that snapshot. The snapshot and generated contest data retain no Pintia team names or member lists. Fixed Pintia team IDs map to the canonical roster IDs.

The Pintia rating formula uses `n = 2169` non-excluded teams and `x = 13` solved problems by the top team. Pintia's `solvingTime` is already the displayed total time including wrong-submission penalties; do not add `penaltyTime` again. Dirt is the floor of 100 times wrong submissions on accepted problems divided by all submissions on those accepted problems. Attempts on unsolved problems are excluded; this reproduces the first QOJ contest's ten published Dirt values.

The `human-verification` result has a CCPC rating of 87.5, above its previous 33.4, so it is included. The importer omits this result if a refreshed source produces a lower rating.

Imported JSON files go to `src/data/team-contests/`, which Vite discovers automatically. The overview filters to the ten school teams and sorts by exact Average Rating descending. After a team has more than five valid results, its lowest rating is removed before averaging. Pending contests and absent entries show a dash and do not count; a published zero does count. A team without results sorts last. Equal averages retain roster order.

`src/data/trainingScoreboard.ts` reserves September 13, 19, 20, 26, 27 and October 5, 6, 7. A result on one of those dates automatically replaces its placeholder; other contests are appended in date order.

## Verification

```powershell
python scripts/test-team-scoreboard.py
python scripts/test-pintia-scoreboard.py
node --test scripts/test-team-ratings.mjs
npm run lint
npm exec -- tsc -p tsconfig.app.json --noEmit
npm run build
```

After importing another contest, inspect both scoreboard levels in the local preview. Source snapshots are historical results, not live remote requests.
