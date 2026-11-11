# Desktop packages and Android companion

The packages in `dist/packages/` are built from this workspace. Creating them does not publish an update service or upload anything to a store.

| File | Purpose |
| --- | --- |
| `ZyroxClient-0.2.0-x86_64.AppImage` | Linux x86_64 native Rust launcher |
| `ZyroxClient-0.2.0-x86_64.flatpak` | Same launcher, isolated in a Flatpak sandbox |
| `ZyroxClient-0.2.0-windows-x86_64.exe` | Portable Windows x86_64 native executable |
| `ZyroxClient-0.2.0-windows-x86_64.zip` | Windows executable with license and instructions |
| `ZyroxClient-0.2.0-android-companion.apk` | Android companion preview, locally release-signed; does **not run Minecraft Java** |
| `SHA256SUMS` | Checksums of the packaged artifacts |

See [the package verification report](VERIFICATION.md) for which builds and checks actually passed. A filename in this table is not a claim that every platform has been tested on physical hardware.

## Linux AppImage

```sh
chmod +x dist/packages/ZyroxClient-0.2.0-x86_64.AppImage
./dist/packages/ZyroxClient-0.2.0-x86_64.AppImage
```

If FUSE is unavailable:

```sh
APPIMAGE_EXTRACT_AND_RUN=1 ./dist/packages/ZyroxClient-0.2.0-x86_64.AppImage
```

This local build uses Fedora 45 libraries and requires **glibc 2.43 or newer**, desktop OpenGL drivers, and the X11/Wayland libraries. It is not verified on older distributions. AppImage does not make a binary compiled against a recent glibc compatible with every Linux distribution. Java can remain set to `auto`; the launcher downloads a compatible verified runtime for each game profile.

## Flatpak

```sh
flatpak install --user ./dist/packages/ZyroxClient-0.2.0-x86_64.flatpak
flatpak run dev.zyrox.client
```

The bundle records Flathub as its runtime source and uses `org.freedesktop.Platform//26.08`. The runtime is a separate dependency, as documented by [Flatpak](https://docs.flatpak.org/en/latest/single-file-bundles.html).

The package has network, IPC, X11/Wayland, PulseAudio and GPU access. It has **no unrestricted host filesystem permission**. Keep downloaded installers and game files in the application's private data directories. A manually entered path outside the sandbox will not automatically become accessible.

Default storage on Linux:

- Configuration: `~/.var/app/dev.zyrox.client/config/zyroxclient/settings.json`
- Game data: `~/.var/app/dev.zyrox.client/data/zyroxclient/minecraft/`

The Flatpak was installed locally to verify it and is available in KDE's application menu. No app-store publication or automatic client update feed is configured.

## Windows

Run `ZyroxClient-0.2.0-windows-x86_64.exe`, or extract the ZIP and run `ZyroxClient.exe`. This is a portable executable, not an MSI installer. The release is **not Authenticode-signed**. GPU drivers supporting desktop OpenGL are required. Java set to `auto` downloads the appropriate Windows runtime.

Cross-compilation and Wine checks are different from testing Minecraft on a physical Windows machine. The report records these separately.

## Android

The APK is a native Java Android application for **Android 8.0 / API 26 or newer**, targeting API 35. It uses no native CPU-specific libraries, so the companion code is architecture-independent.

Implemented in its source:

- Microsoft device sign-in, Xbox/XSTS/Minecraft token exchange and Java entitlement/profile checks.
- Ely.by email/password and optional two-factor code login against the official API.
- Official Mojang release/snapshot/historical version catalog with a local cache and search.
- Download and SHA-1 verification of the selected vanilla client JAR, with Android's document picker for export.
- Named local profiles and JSON export of version, loader preference and RAM.
- YouTube and Discord links.

The Android application is labelled **Zyrox Companion** throughout. It does not include an Android JVM, LWJGL/OpenGL bridge, touch controller, or a running Minecraft Java client. A full Android game launcher remains a separate port. The desktop Rust executable cannot simply be renamed to an APK.

Install the APK using Android's normal package installer, or with an already-connected device:

```sh
adb install -r dist/packages/ZyroxClient-0.2.0-android-companion.apk
```

The distributed APK has a local release signature, not the Android debug key. Future updates must use the **same signing key**. Keep a private backup of `.tools/signing/`; it is ignored by version control. Never distribute its keystore or password file. No Play Store upload has been performed.

Companion profile JSON uses `version`, `loader` and `memory_mb`, which match the desktop settings fields, plus descriptive schema/source fields. There is no automatic cross-device synchronization or desktop profile-import screen in this milestone.

## Rebuild

Build the Fabric payload before the desktop launcher:

```sh
./scripts/zyrox-dev.sh build
cargo build --release --locked
python3 scripts/bootstrap_packaging.py
python3 scripts/package_desktop.py appimage
python3 scripts/package_desktop.py flatpak
python3 scripts/build_windows.py
python3 scripts/package_desktop.py windows
```

The packaging bootstrap installs pinned, checksum-verified tools under `.tools/`, including a matching upstream Rust compiler and Windows standard library, LLVM-MinGW and appimagetool. It does not modify system Rust or require root. If an upstream download's checksum changes, stop and review the update rather than bypassing verification.

Flatpak packaging requires `flatpak`, `org.freedesktop.Sdk//26.08` and `org.freedesktop.Platform//26.08` installed. These were already available in this workspace's Fedora environment. It packages the compiled launcher directly using `flatpak build-init`, `build-finish`, `build-export` and `build-bundle`.

Android uses a separate Gradle project so Android's plugin does not affect Fabric/Loom:

```sh
python3 scripts/bootstrap_android.py
python3 scripts/build_android.py
```

The SDK bootstrap downloads official, checksum-verified Google SDK archives locally. Android Gradle Plugin 8.9.2 uses API/build-tools 35 and Gradle Wrapper 8.12.1. Google's SDK terms are included with the SDK packages. Subsequent release builds reuse the local signing key.

Finally regenerate checksums after adding or replacing any APK:

```sh
python3 -c 'from scripts.package_desktop import checksums; checksums()'
```
