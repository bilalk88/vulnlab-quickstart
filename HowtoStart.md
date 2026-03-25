# How to Start the Pentest Command Center

This guide explains how to quickly start up both the Lab API (backend) and the WebApp (frontend) simultaneously with a single command.

---

## 🚀 Option 1: The Quick Start Batch Script (Easiest for Windows)

This is the fastest method to get everything up and running.

1. Open your Windows File Explorer and navigate to `P2_Sec_Application`.
2. Locate the **`start.bat`** file.
3. **Double-click** it.
   - Alternatively, you can open a terminal in the main folder and type `.\start.bat`

**What happens?**
Two new Command Prompt windows will automatically open. One will run the Lab API (Node.js) and the other will run the WebApp (Next.js).

**To Stop the Application:**
Simply close both of the new Command Prompt windows that were opened.

---

## 📦 Option 2: Using NPM (Single Terminal View)

If you prefer using `npm` and want to see all your logs running in a single, combined terminal, follow these steps.

1. Open a terminal in the main **`P2_Sec_Application`** folder.
2. Install the required root package (you only need to do this once):
   ```bash
   npm install
   ```
   *(This installs a package called `concurrently` that helps run both servers together).*

3. Start both applications by running:
   ```bash
   npm start
   ```

**What happens?**
Both the API and WebApp will boot up within the same terminal window. You’ll be able to tell the logs apart by the prefixes (normally `[start:api]` and `[start:web]`).

**To Stop the Application:**
Press `Ctrl + C` in your terminal to easily terminate both processes at once.

---

## 🌐 Application URLs

Once the applications are successfully started, you can access them at:

- **Frontend Web Application:** [http://localhost:3000](http://localhost:3000)
- **Labs API Backend:** Starts automatically on the configured backend port (Check your terminal logs or `.env` file for exact API port details).
