# Microsoft and Ely.by accounts

## Microsoft

Desktop Account → **Sign in with Microsoft** uses the [Microsoft device authorization flow](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-device-code). The user enters their password on Microsoft's website. The launcher receives a device authorization response, exchanges the resulting token through Xbox Live and XSTS, then requests a Minecraft session and checks Java entitlements and the Minecraft profile.

The application needs its **own public Microsoft application client ID**:

1. [Register an application](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app) for personal Microsoft accounts.
2. Configure the application as a public client and enable the device/public-client flow.
3. Ensure that the application is permitted to use Minecraft Services. Registration alone does not guarantee that Minecraft will accept its token exchange.
4. Paste the public application ID into Zyrox Settings → Microsoft sign-in, then save. Android has the same field in Settings.
5. Return to Account, request a code, open the Microsoft page and approve sign-in.

No Microsoft password or application client secret belongs in settings. The public application ID may be built into a desktop release with `ZYROX_MICROSOFT_CLIENT_ID` at compile time. Existing settings still take precedence. Do not borrow another launcher's client ID.

This workspace has no approved project application ID or user-provided account session. Real account login therefore **has not been end-to-end verified**. An API approval or entitlement rejection is displayed as an error; it is not converted into a successful session. The official demo remains available separately.

## Ely.by

Ely.by is a separate account provider for its compatible community servers. It is not a Microsoft Java ownership token and does not grant access to Microsoft-authenticated servers or Realms.

The implementation follows Ely.by's documented [launcher authentication API](https://docs.ely.by/en/minecraft-auth.html):

- Users create/manage their account at [account.ely.by/login](https://account.ely.by/login).
- The launcher sends email/username and password directly to `https://authserver.ely.by/auth/authenticate` over HTTPS.
- An optional current six-digit TOTP code is sent using Ely.by's documented password/code encoding.
- The selected profile and token are required; profile UUIDs are validated. A typed nickname alone is not treated as authenticated.
- Ely.by passwords and two-factor fields clear on submission and are not saved to settings. Session tokens remain in process memory only. Native launcher password buffers use `Zeroizing`; transient HTTP/JSON copies are not a claim of complete memory zeroization.
- Before a desktop launch, `/auth/validate` checks the token with Ely.by.
- Only Ely.by launches load [authlib-injector](https://docs.ely.by/en/authlib-injector.html), pinned to 1.2.8 and checked with SHA-1, SHA-256 and size. Its `-javaagent` option points to Ely.by. Microsoft launches do not load that agent.

Passwords are entered in an explicitly labelled **Ely.by** form, never an imitation Microsoft web login. Error messages do not include authentication response bodies. Game-log copies displayed in the launcher redact the active access token.

Ely.by also documents an [OAuth web flow](https://docs.ely.by/en/oauth.html). That flow requires a registered application and a client secret during token exchange; no secret has been embedded in these public binaries. This milestone implements their documented direct launcher API rather than claiming that opening the login webpage alone authenticates Minecraft.

The authlib agent has been boot-tested against Ely.by's live metadata endpoint. A successful real Ely.by login and community-server connection still require testing with a consenting user's account. No user passwords or tokens were supplied during this build.

## Session lifetime

Closing the launcher clears its in-memory account state. Closing a running launcher does not kill the Minecraft process; Minecraft retains the session already passed to it. Sign-out clears the selected launcher account. It does not claim to revoke all provider sessions on other devices.
