# AI Agent Instructions for simple-game

Purpose: Provide concise, actionable rules so an AI coding agent can work safely
and productively in this workspace. If a required detail is missing, ask the repo
owner before making non-trivial changes.

## What to assume
- The repository currently contains no detectable build metadata. Always run a
  quick detection step (look for `package.json`, `pyproject.toml`, `requirements.txt`,
  `Cargo.toml`, `Makefile`, Unity/Unreal project files) and report findings before
  running installs or tests.

## Code Style
- Follow existing project files when present. If none exist, prefer minimal,
  idiomatic style for the language detected (Prettier/ESLint defaults for JS,
  Black/flake8 for Python). Ask the user before adding a formatter or linter.

## Architecture and Scope
- This is a small game project. Keep changes local and minimal: prefer adding
  files under `src/`, `game/`, or the repository root rather than large refactors.
  For any architectural change, open a short proposal and ask for approval.

## Build and Test (detection + commands)
- Detection steps an agent should run before attempting installs/tests:
  1. If `package.json` exists: run `npm ci` then `npm test` or `npm run build`.
  2. If `requirements.txt` or `pyproject.toml` exists: use a venv and run
     `pip install -r requirements.txt` then `pytest`.
  3. If `Makefile` exists: prefer `make test` or `make build` targets.
  4. If no build metadata is found: do not run install commands; ask the user.

## Project Conventions
- Keep commits small and focused. When creating new examples or templates,
  include a README snippet explaining how to run them. Prefer explicit
  relative imports and clear entry points (e.g., `src/main.*`, `index.js`).

## Integration Points
- If adding or modifying network or external integrations, list env vars and
  secrets required and do not commit secrets. When in doubt, prompt the user
  for credentials and for where to store them (e.g., `.env`, Secrets manager).

## Security
- Never commit secrets or private keys. If your changes require credentials,
  provide instructions and placeholders but do not populate real values.

## When to ask for help
- If language, build system, or project purpose is ambiguous, stop and ask the
  user one targeted question rather than making broad assumptions.

---
If any of the above sections are unclear or you want the file tailored to a
specific language or engine (Unity, Godot, Phaser, etc.), tell me which and
I'll update this file accordingly.
