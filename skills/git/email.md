# Email Workflows

Patch-based email workflows for contributing to projects.

## git format-patch

Prepare patches for email submission.

```bash
# Create patch for last commit
git format-patch -1

# Create patches for last N commits
git format-patch -3

# Create patches for range
git format-patch main..feature

# With cover letter
git format-patch --cover-letter -3

# Output to directory
git format-patch -o patches/ main..feature

# Numbered subject prefix
git format-patch --subject-prefix="PATCH v2" main..feature

# With thread (In-Reply-To)
git format-patch --thread --cover-letter main..feature

# Signed-off-by
git format-patch -s -1  # Adds Signed-off-by line

# Use RFC prefix
git format-patch --rfc main..feature
```

### Patch file format

```
From: John Doe <john@example.com>
Date: Mon, 15 Jan 2024 10:00:00 +0000
Subject: [PATCH] Add feature X

This patch adds feature X which does Y.

Signed-off-by: John Doe <john@example.com>
---
 file.txt | 10 ++++++++++
 1 file changed, 10 insertions(+)

diff --git a/file.txt b/file.txt
index abc123..def456 100644
--- a/file.txt
+++ b/file.txt
@@ -1,3 +1,13 @@
+new content
```

## git am

Apply patches from a mailbox (patch files).

```bash
# Apply a single patch
git am 0001-Add-feature.patch

# Apply multiple patches
git am patches/*.patch

# Apply with 3-way merge on conflict
git am --3way patches/*.patch

# Apply from mailbox
git am < mailbox.mbox

# Apply with sign-off
git am -s 0001-Add-feature.patch

# Continue after resolving conflict
git am --continue

# Skip current patch
git am --skip

# Abort patch application
git am --abort

# Show patches being applied
git am --show-current-patch
```

### Conflict resolution with git am

```bash
git am patches/*.patch
# Applying: Add feature X
# error: patch failed: file.txt:1
# error: file.txt: patch does not apply

# Resolve conflict:
# 1. Edit file to resolve
# 2. git add file.txt
# 3. git am --continue

# Or abort
git am --abort
```

## git send-email

Send patches via email.

```bash
# Send patches to mailing list
git send-email --to=maintainer@example.com patches/*.patch

# With cover letter
git send-email --to=maintainer@example.com --compose patches/*.patch

# Specify from address
git send-email --from="John Doe <john@example.com>" --to=list@example.com patches/

# Send with CC
git send-email --to=list@example.com --cc=reviewer@example.com patches/*.patch

# Send with confirmation
git send-email --to=list@example.com --confirm=always patches/*.patch

# Dry run (show what would be sent)
git send-email --dry-run --to=list@example.com patches/*.patch

# SMTP configuration
git send-email --smtp-server=smtp.example.com \
    --smtp-user=john@example.com \
    --smtp-server-port=587 \
    --smtp-encryption=tls \
    patches/*.patch
```

### Configuring send-email

```bash
# Global configuration
git config --global sendemail.smtpServer smtp.example.com
git config --global sendemail.smtpServerPort 587
git config --global sendemail.smtpEncryption tls
git config --global sendemail.smtpUser john@example.com
git config --global sendemail.from john@example.com

# Per-project configuration
git config sendemail.to maintainer@example.com
git config sendemail.ccoverletter true
```

### Thread format

```bash
# Thread patches (cover letter as parent)
git send-email --thread --to=list@example.com --cover-letter patches/*.patch

# Reply to existing thread
git send-email --in-reply-to="<message-id@example.com>" --to=list@example.com patches/*.patch
```

## git imap-send

Send a collection of patches to an IMAP folder.

```bash
# Send patches to IMAP folder
git imap-send patches/*.patch

# Configure IMAP
git config --global imap.folder "Sent"
git config --global imap.host "imap.example.com"
git config --global imap.user "john@example.com"
git config --global imap.pass "password"
git config --global imap.sslverify true
```

## git request-pull

Generate a summary of changes for a pull request.

```bash
# Create pull request summary
git request-pull origin/main https://github.com/user/repo feature

# With specific start and end
git request-pull v1.0 https://github.com/user/repo v2.0

# Output
# The following changes since commit abc123:
#
#  John Doe (3):
#        Add feature X
#        Fix bug Y
#        Update docs
#
#  file1.txt | 20 ++++++++++++++++++++
#  file2.txt |  5 +++++
#
# diff --git a/file1.txt b/file1.txt
# ...
```

## Patch workflow

### Contributing via email

```bash
# 1. Clone the project
git clone https://github.com/project/repo.git
cd repo

# 2. Create feature branch
git switch -c feature/new-api

# 3. Make changes and commit
git add .
git commit -m "Add new API"

# 4. Create patches
git format-patch --cover-letter -o patches/ main

# 5. Review patches
cat patches/0000-cover-letter.patch

# 6. Send patches
git send-email --to=maintainer@example.com patches/*.patch

# 7. After feedback, update and resend
git format-patch --subject-prefix="PATCH v2" -o patches-v2/ main
git send-email --to=maintainer@example.com patches-v2/*.patch
```

### Applying patches from email

```bash
# Save email as .patch file
# Apply with git am
git am 0001-Add-feature.patch

# Or pipe directly
git am < email.patch

# If patch was created with diff (not format-patch), use git apply
git apply < patch.diff
```

## Best practices

1. Use `git format-patch` to create proper patches with metadata
2. Always include a cover letter for multi-patch series
3. Use `--subject-prefix="PATCH v2"` for revised patches
4. Add `Signed-off-by` with `-s` for DCO compliance
5. Test patches with `git am --3way` before sending
6. Configure SMTP settings globally for convenience
7. Use `--thread` to keep patch series as email threads
8. Use `git request-pull` for pull request via email
9. Keep patches focused — one logical change per patch
10. Write clear commit messages following project conventions
