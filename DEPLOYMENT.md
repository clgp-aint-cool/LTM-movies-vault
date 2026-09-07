# VM Deployment & CI/CD Setup Guide

This guide explains how to configure your remote Virtual Machine (VM) and GitHub repository to enable automatic deployment of **LTM Movies Vault** via GitHub Actions.

---

## 1. Prerequisites on the Remote VM

Connect to your VM via SSH:
```bash
ssh <username>@<YOUR_VM_PUBLIC_IP>
```

### 1.1. Install Docker & Docker Compose
If Docker is not already installed on your VM (Ubuntu/Debian example):

```bash
# Update package list and install prerequisites
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg

# Add Docker's official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Set up the repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine, CLI, and Docker Compose Plugin
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### 1.2. Allow Non-Root User to Run Docker
Ensure the user running the deployment can execute Docker commands without `sudo`:

```bash
sudo usermod -aG docker $USER
# Apply group membership immediately without logging out
newgrp docker

# Verify docker runs without sudo
docker ps
```

### 1.3. Open Firewall Ports
Ensure your firewall (and cloud security group e.g. AWS, GCP, Azure, DigitalOcean, Hetzner, etc.) permits traffic on ports 22 (SSH) and 80 (HTTP):

```bash
# Ubuntu UFW (if enabled)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```

---

## 2. Password Authentication Setup on VM

Ensure your SSH server on the VM allows password authentication:
1. Check `/etc/ssh/sshd_config` (or `/etc/ssh/sshd_config.d/*.conf`):
   ```bash
   sudo grep -i "PasswordAuthentication" /etc/ssh/sshd_config
   ```
2. If it is set to `no`, edit the file:
   ```bash
   sudo sed -i 's/PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config
   sudo systemctl restart ssh || sudo systemctl restart sshd
   ```

---

## 3. GitHub Repository Secrets Configuration

In your GitHub repository:
1. Go to **Settings** > **Secrets and variables** > **Actions**.
2. Click **New repository secret** and configure:

| Secret Name | Description | Example |
|---|---|---|
| `VM_HOST` | The public IP address of your VM | `203.0.113.50` |
| `VM_USER` | The SSH login user on your VM | `ubuntu` or `root` |
| `VM_PASSWORD` | The login password for `VM_USER` on the VM | `YourStrongPassword123` |
| `VM_PORT` | *(Optional)* Custom SSH port if not standard 22 | `22` |

---

## 4. GitHub Actions Workflow Permissions

The workflow packages and publishes the container image to **GitHub Container Registry (GHCR)**.
To ensure GitHub Actions has permission to publish packages:
1. In your GitHub repository, navigate to **Settings** > **Actions** > **General**.
2. Scroll to **Workflow permissions**.
3. Select **Read and write permissions**.
4. Click **Save**.

---

## 5. Deployment Flow & Verification

Once you push code to the `main` branch (or run the workflow manually under **Actions** > **Build & Deploy to VM** > **Run workflow**):

1. **Build & Push**: GitHub Actions builds the multi-stage Next.js Docker image and pushes it to `ghcr.io/<username>/ltm-movies-vault:latest`.
2. **Deploy**:
   - The runner connects to your VM via SSH.
   - It transfers `docker-compose.yml` to `~/ltm-movies-vault`.
   - It logs into GHCR and pulls the newest image.
   - It spins up the container in detached mode (`docker compose up -d`).
   - It removes old, unused Docker image layers (`docker image prune -f`).
3. **Verify**:
   - Open your browser and navigate to:
     ```
     http://<YOUR_VM_PUBLIC_IP>
     ```
   - Check container status on the VM:
     ```bash
     cd ~/ltm-movies-vault
     docker compose ps
     docker compose logs -f app
     ```

---

## 6. (Optional) Custom Domain & HTTPS / SSL Setup

If you wish to point a domain (e.g. `movies.yourdomain.com`) with automated free Let's Encrypt SSL certificates, you can install **Caddy** or **Nginx + Certbot** on your VM:

### Simple reverse proxy with Caddy:
```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install caddy
```

In `/etc/caddy/Caddyfile`:
```caddyfile
movies.yourdomain.com {
    reverse_proxy 127.0.0.1:80
}
```
Reload Caddy:
```bash
sudo systemctl reload caddy
```
Caddy will automatically provision and renew HTTPS certificates!
