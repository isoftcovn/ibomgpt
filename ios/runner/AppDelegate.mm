#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTLinkingManager.h>
#import <Firebase.h>
#import "RNFBMessagingModule.h"
// #import <UserNotifications/UserNotifications.h>
#import "RNSplashScreen.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"runner";
  if ([FIRApp defaultApp] == nil) {
    [FIRApp configure];
  }

  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;

  NSDictionary *appProperties = [RNFBMessagingModule addCustomPropsToUserProps:nil withLaunchOptions:launchOptions];
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = appProperties;

  for (NSString *familyName in [UIFont familyNames]){
    NSLog(@"Family name: %@", familyName);
    for (NSString *fontName in [UIFont fontNamesForFamilyName:familyName]) {
      NSLog(@"--Font name: %@", fontName);
    }
  }
    
  [super application:application didFinishLaunchingWithOptions:launchOptions];
  [RNSplashScreen show];
  return true;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

//Notification
//Called when a notification is delivered to a foreground app.
// -(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
// {
//   if (@available(iOS 14.0, *)) {
//     completionHandler(UNNotificationPresentationOptionSound | UNNotificationPresentationOptionBanner | UNNotificationPresentationOptionBadge | UNNotificationPresentationOptionList);
//   } else {
//     // Fallback on earlier versions
//     completionHandler(UNNotificationPresentationOptionSound  | UNNotificationPresentationOptionBadge | UNNotificationPresentationOptionAlert);
//   }
// }
//Notification

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options
{
  return [RCTLinkingManager application:app openURL:url options:options];
}

@end
