# Changelog

## 1.0.0 - 2026-11-01

- First release: `move`, `spawn`, `canMove`, `hasMoves`, plus `scoreMove` and `hasWon`.

## 1.0.1 - 2026-11-04

- Fixed: `spawn` crashed with a `TypeError` when `rng` returned exactly `1`. It now picks the last empty cell instead.
- Renamed `ChangeLog.md` to `CHANGELOG.md` and added it to the published files.