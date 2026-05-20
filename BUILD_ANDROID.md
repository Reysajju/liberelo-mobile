# Install Liberelo on Android (APK)

You do **not** need Expo Go, Wi‑Fi dev server, or hosting for the app UI.  
An APK installs like any normal Android app. Only the **upload API** (`api.liberelo.com`) must be live when authors submit manuscripts.

---

## Option A — Cloud build (recommended, ~15 minutes)

Free [Expo](https://expo.dev) account. Build runs on Expo servers; you download the APK.

1. Open PowerShell in this folder:

```powershell
cd c:\Users\sajja\Downloads\liberelo
npx eas-cli@latest login
```

2. Link the project (first time only):

```powershell
npx eas-cli@latest init
```

Choose **Create a new project** when asked.

3. Build the APK:

```powershell
npm run build:apk
```

4. When the build finishes, open the link in the terminal (or [expo.dev](https://expo.dev) → your project → Builds) and **Download APK**.

5. On your phone:
   - Copy the `.apk` file (USB, WhatsApp, Google Drive, etc.)
   - Open it → allow **Install unknown apps** if prompted
   - Install **Liberelo**

---

## Option B — GitHub Actions (no Expo login)

1. Create a GitHub repo and push this project.
2. On GitHub: **Actions** → **Build Android APK** → **Run workflow**.
3. When done, open the run → **Artifacts** → download `liberelo-android-apk`.
4. Install `app-release.apk` on your phone.

---

## Option C — Build on your laptop (needs Android Studio once)

1. Install [Android Studio](https://developer.android.com/studio).
2. In SDK Manager, install **Android SDK Platform 35** and **Build-Tools**.
3. Set user environment variable: `ANDROID_HOME` = `%LOCALAPPDATA%\Android\Sdk`
4. Install [JDK 17](https://adoptium.net/) if Android Studio did not.
5. Run:

```powershell
npm run build:apk:local
```

Output: `liberelo-release.apk` in the project folder.

---

## Why Expo Go failed (recap)

| Expo Go | Standalone APK |
|--------|----------------|
| Phone must reach your PC on port 8081 | App runs offline |
| VMware wrong IP broke downloads | No Metro / QR needed |
| Same Wi‑Fi + firewall headaches | Install once from file |

---

## Play Store later

For production, use `eas build -p android --profile production` and upload the AAB to Google Play Console.
