# Install ZyroxClient 0.2.0

Download files from the [public GitHub Release](https://github.com/SonixDeveloper/ZyroxClient/releases/tag/v0.2.0). You do not need a GitHub account. The examples below assume your terminal is open in the folder where you downloaded the file.

## Linux AppImage

```sh
chmod +x ZyroxClient-0.2.0-x86_64.AppImage
./ZyroxClient-0.2.0-x86_64.AppImage
```

If FUSE is unavailable:

```sh
APPIMAGE_EXTRACT_AND_RUN=1 ./ZyroxClient-0.2.0-x86_64.AppImage
```

This local build requires **glibc 2.43 or newer**, desktop OpenGL drivers, and the X11/Wayland libraries. It was built and opened on Fedora 45. It is not verified on older distributions. Java can remain set to `auto`; the launcher downloads a compatible, checksum-verified runtime for each game profile.

## Linux Flatpak

```sh
flatpak install --user ./ZyroxClient-0.2.0-x86_64.flatpak
flatpak run dev.zyrox.client
```

The bundle uses `org.freedesktop.Platform//26.08`, downloaded separately from Flathub. See [Flatpak's bundle documentation](https://docs.flatpak.org/en/latest/single-file-bundles.html).

The application has network, IPC, X11/Wayland, PulseAudio and GPU access, without unrestricted host-filesystem permission. Keep manually downloaded loader installers in the app's private data folder. A path outside the sandbox will not automatically become accessible.

- Configuration: `~/.var/app/dev.zyrox.client/config/zyroxclient/settings.json`
- Game data: `~/.var/app/dev.zyrox.client/data/zyroxclient/minecraft/`

## Windows

Download `ZyroxClient-0.2.0-windows-x86_64.exe` and open it. Alternatively, extract the ZIP and run `ZyroxClient.exe`. This is a portable launcher, not an MSI installer.

The preview is **not Authenticode-signed**. Desktop OpenGL drivers are required. Set Java to `auto` to download a compatible Windows runtime. The GUI was checked under Wine; Minecraft gameplay on physical Windows hardware has not been verified.

## Fabric mod only

The separate `zyrox-client-fabric-1.21.4-0.2.0.jar` requires **exactly Minecraft 1.21.4**, Fabric Loader and Fabric API. Place it in that profile's `mods` directory. This JAR is not compatible with every version listed by the launcher.

The desktop launcher's 1.21.4 + Fabric profile installs the native adapter and its required Fabric API automatically. Enter a world and press **Right Shift** to open Zyrox modules and the HUD editor.

## Android companion

The APK is labelled **Zyrox Companion**, for Android 8.0 / API 26 or newer. It manages accounts, official version metadata, verified vanilla client-JAR downloads and profile exports.

**It does not run Minecraft Java.** It does not include the Android JVM, graphics bridge or game controls needed for a complete Android port.

Install the APK through Android's normal package installer. If you already use ADB with your device:

```sh
adb install -r ZyroxClient-0.2.0-android-companion.apk
```

The APK is locally release-signed. Its compilation, lint and signature verification passed; it has not been exercised on an Android device/emulator. No Play Store upload has been performed.

## Accounts

Microsoft login currently requires your own approved public application client ID in Settings. Ely.by uses its separate account system for compatible community servers. The official Minecraft demo remains available independently. Neither provider has been end-to-end verified with a real account during this build.

See [Microsoft and Ely.by setup](ACCOUNTS.md) and the [verification report](VERIFICATION.md).

## Check download integrity

Download `SHA256SUMS` beside the files you downloaded, then compare their SHA-256 hashes. On Linux:

```sh
sha256sum -c SHA256SUMS --ignore-missing
```

This GitHub repository contains the download website source and packaged releases. It does not contain the complete desktop/Android client development workspace. No automatic client updater, cosmetic synchronization service or full Android game runtime is supplied by this release.
