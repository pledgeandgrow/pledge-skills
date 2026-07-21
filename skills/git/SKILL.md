# Git

> Git is a free and open source distributed version control system designed to handle everything from small to very large projects with speed and efficiency.

**Version**: Git 2.49  
**Documentation**: [git-scm.com/docs](https://git-scm.com/docs)  
**Book**: [Pro Git](https://git-scm.com/book/en/v2)  

## Quick Reference

| Topic | File |
|-------|------|
| Introduction (what is Git, VCS types, installing, first-time setup) | `introduction.md` |
| Repositories (init, clone, recording changes, history, undoing, remotes, tagging, aliases) | `repositories.md` |
| Branching and Merging (branch, switch, merge, conflicts, stash, tag, worktree, rebase, workflows) | `branching-and-merging.md` |
| Sharing and Updating (fetch, pull, push, remote, submodule, refspecs) | `sharing-and-updating.md` |
| Inspection and Comparison (show, log, diff, difftool, range-diff, shortlog, describe, revision selection) | `inspection-and-comparison.md` |
| Patching (apply, cherry-pick, rebase, revert, format-patch, patch workflows) | `patching.md` |
| Debugging (bisect, blame, grep, finding bugs) | `debugging.md` |
| Administration (clean, gc, fsck, reflog, filter-branch, instaweb, archive, bundle, maintenance) | `administration.md` |
| Server Admin (protocols, SSH setup, git daemon, Smart HTTP, GitWeb, hosting, security) | `server-admin.md` |
| Email (format-patch, am, send-email, imap-send, request-pull, patch workflows) | `email.md` |
| External Systems (svn, fast-import, p4, migrating to Git) | `external-systems.md` |
| Configuration (git config, levels, settings, aliases, credentials, signing, includeIf, performance) | `configuration.md` |
| Git Tools (revision selection, interactive staging, stashing, cleaning, signing, searching, rewriting history, reset, advanced merging, rerere, submodules, bundling, replace, credentials) | `git-tools.md` |
| Git Internals (plumbing, objects, refs, packfiles, refspec, transfer protocols, plumbing commands, environment variables) | `git-internals.md` |
| Guides (gitignore, gitattributes, hooks, gitmodules, workflows) | `guides.md` |
| Distributed Git (workflows, contributing, maintaining, commit guidelines) | `distributed-git.md` |
| GitHub (account setup, SSH, contributing, maintaining, organizations, GitHub CLI, Actions, API) | `github.md` |
| Embedding Git (libgit2, JGit, go-git, pygit2, rugged, nodegit, LibGit2Sharp, scripting) | `embedding-git.md` |
| Sparse Checkout, Scalar, Partial Clone (sparse-checkout, backfill, maintenance, pack-refs, prune, diagnose, fast-export) | `sparse-checkout.md` |
| File Formats and Protocols (repository layout, index, pack, bundle, commit-graph, chunk, signature, wire protocols v0/v1/v2, namespaces, remote-helpers, mailmap, diffcore) | `file-formats-and-protocols.md` |
| Additional Commands (annotate, merge-tree, show-branch, whatchanged, cherry, ls-remote, name-rev, commit-graph, pack-objects, interpret-trailers, stripspace, credential, GUI tools, CVS commands) | `additional-commands.md` |
| Tutorials and Migration (gittutorial, gittutorial-2, gitcore-tutorial, CVS migration, CVS-to-Git command mapping, diffcore) | `tutorials-and-migration.md` |

## Core Concepts

- **Distributed**: Every clone is a full repository — no central server required
- **Snapshots, Not Deltas**: Git stores full snapshots of the project at each commit, not file-based changes
- **Three States**: Modified (working directory), Staged (index), Committed (HEAD)
- **Content-Addressable**: All objects stored by SHA-1 hash of content — integrity guaranteed
- **Nearly Every Operation Is Local**: No network needed for most operations
- **Branches Are Cheap**: A branch is just a lightweight pointer to a commit
- **Data Integrity**: Checksumming (SHA-1) ensures data can't be corrupted without detection
- **Staging Area**: The index allows granular control over what goes into each commit
- **Distributed Workflows**: Centralized, integration manager, dictator/lieutenants models
- **Porcelain and Plumbing**: High-level user commands and low-level scripting commands

## Official Documentation Sources

- [Git Reference](https://git-scm.com/docs) — Command reference
- [Pro Git Book](https://git-scm.com/book/en/v2) — Full book
- [Git User Manual](https://git-scm.com/docs/user-manual) — User manual
- [Git FAQ](https://git-scm.com/docs/gitfaq) — Frequently asked questions
- [Git Glossary](https://git-scm.com/docs/gitglossary) — Terms and definitions
- [Everyday Git](https://git-scm.com/docs/giteveryday) — Everyday commands
- [Git Hooks](https://git-scm.com/docs/githooks) — Hook reference
- [gitignore](https://git-scm.com/docs/gitignore) — Ignore patterns
- [gitattributes](https://git-scm.com/docs/gitattributes) — Attribute patterns
- [Git Workflows](https://git-scm.com/docs/gitworkflows) — Workflow patterns
- [Git Tutorial](https://git-scm.com/docs/gittutorial) — Tutorial
- [Git Revisions](https://git-scm.com/docs/gitrevisions) — Revision spec syntax
- [Git Submodules](https://git-scm.com/docs/gitsubmodules) — Submodule guide
- [Git CLI Conventions](https://git-scm.com/docs/gitcli) — CLI conventions
- [Git Core Tutorial](https://git-scm.com/docs/gitcore-tutorial) — Developer tutorial
- [Git Tutorial Part 2](https://git-scm.com/docs/gittutorial-2) — Internals tutorial
- [Git CVS Migration](https://git-scm.com/docs/gitcvs-migration) — CVS to Git guide
- [Git Diff Core](https://git-scm.com/docs/gitdiffcore) — Diff internals
- [Git Namespaces](https://git-scm.com/docs/gitnamespaces) — Ref namespaces
- [Git Remote Helpers](https://git-scm.com/docs/gitremote-helpers) — Remote helper protocol
- [Git Repository Layout](https://git-scm.com/docs/gitrepository-layout) — .git directory structure
- [Git Mailmap](https://git-scm.com/docs/gitmailmap) — Author name mapping
- [Git Bundle Format](https://git-scm.com/docs/gitformat-bundle) — Bundle file format
- [Git Pack Format](https://git-scm.com/docs/gitformat-pack) — Pack file format
- [Git Index Format](https://git-scm.com/docs/gitformat-index) — Index file format
- [Git Commit-Graph Format](https://git-scm.com/docs/gitformat-commit-graph) — Commit-graph format
- [Git Protocol v2](https://git-scm.com/docs/gitprotocol-v2) — Wire protocol v2
- [Git Protocol HTTP](https://git-scm.com/docs/gitprotocol-http) — HTTP protocol
- [Git Credentials](https://git-scm.com/docs/gitcredentials) — Credential management
- [Git Sparse Checkout](https://git-scm.com/docs/git-sparse-checkout) — Sparse checkout
- [Scalar](https://git-scm.com/docs/scalar) — Large repo management
