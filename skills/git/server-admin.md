# Server Administration

Git server setup, protocols, daemon, and hosting.

## The Protocols

Git can use four major network protocols:

### Local protocol

```bash
# Clone from local path
git clone /path/to/repo.git
git clone file:///path/to/repo.git

# file:// forces Git to use network transport (slower but checks for corruption)
```

### HTTP/HTTPS protocol

```bash
# Smart HTTP (recommended)
git clone https://example.com/git/project.git

# Dumb HTTP (static file server)
git clone http://example.com/git/project.git

# Smart HTTP is faster — supports efficient pack negotiation
```

### SSH protocol

```bash
# SSH is most common for private repos
git clone ssh://user@server/project.git
git clone user@server:project.git

# Advantages: secure, efficient, widely available
# Disadvantages: requires SSH access, no anonymous access
```

### Git protocol

```bash
# Fast but unauthenticated (read-only typically)
git clone git://server/project.git

# Port 9418, no encryption
# Use for public read-only mirrors
```

## Getting Git on a Server

### Setting up a bare repository

```bash
# Create bare repository on server
ssh user@server
mkdir -p /opt/git/project.git
cd /opt/git/project.git
git init --bare

# Or from local
scp -r my-project.git user@server:/opt/git/
```

### SSH access setup

```bash
# On server — create git user
sudo useradd -m git
sudo passwd git

# Set up SSH keys for clients
# On client:
ssh-keygen -t ed25519 -C "user@example.com"
ssh-copy-id git@server

# Add public key to server
ssh git@server
mkdir -p ~/.ssh
echo "ssh-ed25519 AAAA..." >> ~/.ssh/authorized_keys
```

### Generating SSH keys

```bash
# Generate SSH key pair
ssh-keygen -t ed25519 -C "your_email@example.com"

# RSA (older, use 4096 bits)
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# Save to specific location
ssh-keygen -t ed25519 -f ~/.ssh/git_key -C "Git access"

# View public key
cat ~/.ssh/id_ed25519.pub

# Start SSH agent
eval "$(ssh-agent -s)"

# Add key to agent
ssh-add ~/.ssh/id_ed25519
```

### SSH config for multiple accounts

```
# ~/.ssh/config
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519

Host github-work
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_work
```

## git daemon

A simple server for Git repositories (read-only by default).

```bash
# Start git daemon
git daemon --base-path=/opt/git --export-all

# With specific port
git daemon --base-path=/opt/git --port=9418

# Allow write access
git daemon --base-path=/opt/git --export-all --enable=receive-pack

# Listen on specific interface
git daemon --base-path=/opt/git --listen=0.0.0.0

# With logging
git daemon --base-path=/opt/git --export-all --syslog

# As a service (systemd)
# /etc/systemd/system/git-daemon.service
[Unit]
Description=Git Daemon
After=network.target

[Service]
ExecStart=/usr/bin/git daemon --base-path=/opt/git --export-all --reuseaddr
Restart=always
User=git

[Install]
WantedBy=multi-user.target
```

### Per-repository daemon access

```bash
# In each repo, create git-daemon-export-ok
touch /opt/git/project.git/git-daemon-export-ok

# Or use --export-all flag to export all repos
```

## Smart HTTP

### Apache configuration

```apache
# /etc/apache2/sites-available/git.conf
SetEnv GIT_PROJECT_ROOT /opt/git
SetEnv GIT_HTTP_EXPORT_ALL
ScriptAlias /git/ /usr/lib/git-core/git-http-backend/

<Directory "/usr/lib/git-core">
    Options +ExecCGI -MultiViews +SymLinksIfOwnerMatch
    Require all granted
</Directory>

# Authentication
<Location /git>
    AuthType Basic
    AuthName "Git Access"
    AuthUserFile /opt/git/.htpasswd
    Require valid-user
</Location>
```

### Nginx + FastCGI

```nginx
# nginx.conf
location ~ /git(/.*) {
    fastcgi_pass unix:/var/run/fcgiwrap.socket;
    include fastcgi_params;
    fastcgi_param SCRIPT_FILENAME /usr/lib/git-core/git-http-backend;
    fastcgi_param GIT_HTTP_EXPORT_ALL "";
    fastcgi_param GIT_PROJECT_ROOT /opt/git;
    fastcgi_param PATH_INFO $1;
}
```

## git update-server-info

Update server info for dumb HTTP transport.

```bash
# Run after pushing to a dumb HTTP server
git update-server-info

# Usually run as a post-update hook
# In .git/hooks/post-update:
exec git update-server-info
```

## GitWeb

### Setting up GitWeb

```bash
# Install GitWeb
sudo apt install gitweb  # Debian/Ubuntu

# Configure
sudo vim /etc/gitweb.conf
# $projectroot = '/opt/git';

# Access via Apache
# http://server/cgi-bin/gitweb.cgi
```

### Using instaweb

```bash
# Quick local GitWeb
git instaweb --httpd=webrick
# Opens browser with GitWeb interface

# Stop
git instaweb --stop
```

## Third-party hosting

### GitHub

```bash
# Clone from GitHub
git clone git@github.com:user/repo.git
git clone https://github.com/user/repo.git

# Add as remote
git remote add origin git@github.com:user/repo.git
```

### GitLab

```bash
# Clone from GitLab
git clone git@gitlab.com:user/repo.git
git clone https://gitlab.com/user/repo.git
```

### Self-hosted (Gitea, Forgejo, Gogs)

```bash
# These provide web UI + SSH + HTTP access
# Clone via SSH or HTTP
git clone git@gitea.example.com:user/repo.git
git clone https://gitea.example.com/user/repo.git
```

## Server security

### Securing SSH access

```bash
# Use SSH keys, disable password auth
# /etc/ssh/sshd_config:
PasswordAuthentication no
PubkeyAuthentication yes

# Restrict git user to git commands only
# Use git-shell as login shell:
sudo chsh -s /usr/bin/git-shell git

# git-shell only allows git commands
```

### Using git-shell

```bash
# Set git-shell as git user's shell
sudo chsh -s $(which git-shell) git

# Customize git-shell commands
# /home/git/git-shell-commands/no-create-repos
#!/bin/sh
echo "Repository creation is not allowed"
exit 1
```

## Best practices

1. Use SSH for private repositories (secure, efficient)
2. Use Smart HTTP for public repos with anonymous read access
3. Use `git init --bare` for server-side repositories
4. Set up SSH keys for passwordless access
5. Use `git-shell` to restrict git user to git commands only
6. Run `git daemon` only for public read-only access
7. Use HTTPS with authentication for corporate firewalls
8. Consider managed hosting (GitHub, GitLab) for team collaboration
9. Set up regular backups of bare repositories
10. Use `git update-server-info` for dumb HTTP servers
