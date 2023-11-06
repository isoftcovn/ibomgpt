fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew install fastlane`

# Available Actions
### certificates
```
fastlane certificates
```
Fetch certificates and provisioning profiles
### genCertificates
```
fastlane genCertificates
```

### firebaseDistributionAndroid
```
fastlane firebaseDistributionAndroid
```
Upload APK to Firebase Distribution
### firebaseDistributionIOS
```
fastlane firebaseDistributionIOS
```
Upload IPA to Firebase Distribution
### get_changelog
```
fastlane get_changelog
```


----

## iOS
### ios registerDevices
```
fastlane ios registerDevices
```
Register devices for Adhoc
### ios refresh_dsyms_firebase
```
fastlane ios refresh_dsyms_firebase
```
fetch and upload dSYM files to Firebase Crashlytics
### ios upload_dsyms_firebase
```
fastlane ios upload_dsyms_firebase
```
upload dSYM files to Firebase Crashlytics
### ios shipTF
```
fastlane ios shipTF
```
Ship to Testflight.
### ios uploadTF
```
fastlane ios uploadTF
```
Pilot.
### ios shipAdHoc
```
fastlane ios shipAdHoc
```
Ship to Firebase Distribution

----

## Android
### android ship
```
fastlane android ship
```
Ship to Firebase Distribution.
### android beta
```
fastlane android beta
```
Ship to Playstore Beta.

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
