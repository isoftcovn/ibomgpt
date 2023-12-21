fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

### fetchAppStoreConnectToken

```sh
[bundle exec] fastlane fetchAppStoreConnectToken
```

Fetch AppStoreConnect Token

### certificates

```sh
[bundle exec] fastlane certificates
```

Fetch certificates and provisioning profiles

### genCertificates

```sh
[bundle exec] fastlane genCertificates
```



### firebaseDistributionAndroid

```sh
[bundle exec] fastlane firebaseDistributionAndroid
```

Upload APK to Firebase Distribution

### firebaseDistributionIOS

```sh
[bundle exec] fastlane firebaseDistributionIOS
```

Upload IPA to Firebase Distribution

### get_changelog

```sh
[bundle exec] fastlane get_changelog
```



----


## iOS

### ios registerDevices

```sh
[bundle exec] fastlane ios registerDevices
```

Register devices for Adhoc

### ios refresh_dsyms_firebase

```sh
[bundle exec] fastlane ios refresh_dsyms_firebase
```

fetch and upload dSYM files to Firebase Crashlytics

### ios upload_dsyms_firebase

```sh
[bundle exec] fastlane ios upload_dsyms_firebase
```

upload dSYM files to Firebase Crashlytics

### ios shipTF

```sh
[bundle exec] fastlane ios shipTF
```

Ship to Testflight.

### ios uploadTF

```sh
[bundle exec] fastlane ios uploadTF
```

Pilot.

### ios shipAdHoc

```sh
[bundle exec] fastlane ios shipAdHoc
```

Ship to Firebase Distribution

----


## Android

### android ship

```sh
[bundle exec] fastlane android ship
```

Ship to Firebase Distribution.

### android beta

```sh
[bundle exec] fastlane android beta
```

Ship to Playstore Beta.

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
