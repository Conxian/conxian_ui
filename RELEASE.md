# Release Runbook

## Versioning and tag format

- Follow Semantic Versioning: `MAJOR.MINOR.PATCH`.
- Create release tags as `vMAJOR.MINOR.PATCH`.

## Changelog requirement

- Add or update `CHANGELOG.md` before tagging.
- Each release should include a dated section for the version being released.

## Release steps

1. Ensure `main` is up to date.
2. Confirm the release notes or changelog entry exists for the target version.
3. Create an annotated tag:
   - `git tag -a vX.Y.Z -m "Release vX.Y.Z"`
4. Push the tag:
   - `git push origin vX.Y.Z`
5. Publish the GitHub Release using the matching version and notes.

## Verification checklist

- [ ] Tag `vX.Y.Z` exists on GitHub.
- [ ] Required CI checks passed for the release commit.
- [ ] A GitHub release was published for `vX.Y.Z`.
- [ ] Release notes accurately describe user-facing, deployment, and security-relevant changes.

## Control checks before tagging

- [ ] Security-sensitive configuration changes have been reviewed.
- [ ] Render deployment assumptions still match `render.yaml`.
- [ ] No secrets or environment-specific credentials are committed.
- [ ] Public interface changes are consistent with the current Conxian portfolio narrative.
