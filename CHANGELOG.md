# Changelog

## 1.0.0 - 2026-11-01

- First release: `move`, `spawn`, `canMove`, `hasMoves`, plus `scoreMove` and `hasWon`.

## 1.0.1 - 2026-11-04

- Fixed: `spawn` crashed with a `TypeError` when `rng` returned exactly `1`. It now picks the last empty cell instead.
- Renamed `ChangeLog.md` to `CHANGELOG.md` and added it to the published files.

## 1.0.2 - 2026-11-05

- Changed: `spawn` now places a `2` or a `4` with equal probability (50% each). Before this version it placed a `2` 90% of the time.
