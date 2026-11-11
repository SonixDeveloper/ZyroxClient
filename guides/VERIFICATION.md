# Packaging verification — 2026-11-11

Built on Fedora 45 KDE Plasma, x86_64. The game adapter remains the existing verified Fabric 1.21.4 JAR; this milestone changes launcher authentication and packaging.

## Linux

- `cargo clippy --all-targets --locked -- -D warnings`: passed.
- `cargo test --release --locked`: **10 passed**, including Ely.by response parsing, rejection of missing/invalid profile data, provider-specific user types and Java-agent argument handling with spaces.
- Native release build: passed.
- AppImage: created with appimagetool; its runtime version and extracted executable's CLI were executed successfully. The packaged GUI opened in isolated Xvfb with Mesa software OpenGL. [Actual AppImage screenshot](screenshots/appimage-launcher.png).
- Flatpak: exported, bundled, installed with `flatpak --user install`, and launched inside `org.freedesktop.Platform//26.08`. Its CLI and GUI opened. [Actual account forms in Flatpak](screenshots/flatpak-accounts.png).
- Verified the account UI rejects an empty Ely.by form without requesting authentication and directs an unconfigured Microsoft sign-in to the public client-ID setting.
- The Flatpak's permissions are network, IPC, X11/Wayland, PulseAudio and DRI; no host-filesystem access was added.

## Authentication

- Authlib-injector 1.2.8 was checked against the upstream SHA-256 `9c7f4343e6c82034958ffb48c14a2cb0c85928be7283103ce17da00c6d5a7b10`, SHA-1 and exact size.
- Executing the pinned agent under Java 21 with `=https://ely.by` successfully resolved `https://account.ely.by/api/authlib-injector` and completed JVM startup.
- Microsoft and Ely.by sessions use separate provider values. Ely.by sessions are validated with its service before desktop launch; only that provider adds the authlib agent.
- **No real account credentials or approved Microsoft project client ID were provided. Successful Microsoft/Ely.by login and authenticated multiplayer have not been end-to-end tested.** A boot test of the agent is not a successful user login.

## Android

- AGP 8.9.2 / Gradle 8.12.1: `assembleRelease lintRelease` passed.
- Release lint: **No issues found**.
- `apksigner verify --verbose`: passed, APK Signature Scheme v2, one signer.
- The APK uses a locally generated release signing key, not the Android debug signing key. Signing material stays under ignored `.tools/signing/` with restrictive permissions.
- `aapt dump badging`: package `dev.zyrox.android.companion`, label **Zyrox Companion**, min API **26**, target/compile API **35**, version `0.2.0-preview`.
- Archive inspection confirms a valid DEX 038 payload, compiled manifest/resources, and no bundled native game runtime.
- **Not installed or exercised on an Android device/emulator.** Build, lint and signature checks do not establish successful live login or UI behavior on physical devices.
- The APK manages accounts, version metadata, verified vanilla client-JAR downloads and portable profile exports. It does **not run Minecraft Java**.

## Windows

- Cross-compilation to `x86_64-pc-windows-gnu` completed successfully with a matching upstream Rust 1.99.1 compiler and LLVM-MinGW.
- The artifact is a genuine **PE32+ x86_64 GUI executable**, verified with `file` and PE header inspection.
- Import inspection found only Windows/system Universal CRT libraries. The executable does not require distributing LLVM, `libunwind.dll` or `libwinpthread-1.dll` alongside it.
- The executable opened its real launcher GUI under **Wine** in isolated Xvfb with software OpenGL. That check revealed a system-light-theme override, which was corrected by explicitly selecting the application's dark theme before configuring its custom palette. The final packages were rebuilt with this correction and the Windows GUI was checked again; the text and controls now retain their intended contrast.
- [Windows executable under Wine](screenshots/windows-wine-launcher.png).
- No physical Windows device was available. Windows Minecraft launches and real-account sign-in have not been end-to-end tested.
- The EXE is portable and **not Authenticode-signed**. The ZIP includes the executable, license and instructions.

## Reproduction and limits

Commands and installation instructions are in [INSTALLATION.md](INSTALLATION.md). Account configuration is in [ACCOUNTS.md](ACCOUNTS.md). `dist/packages/SHA256SUMS` records the final distributable files.

None of these packages is published to Flathub, Google Play or a Windows store. No updater service, Microsoft application approval or complete Minecraft Java Android runtime has been supplied by packaging alone.
