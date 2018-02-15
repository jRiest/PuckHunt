#import <CoreLocation/CoreLocation.h>

#import <React/RCTBridge.h>
#import <React/RCTConvert.h>
#import <React/RCTEventDispatcher.h>

#import "PHLocationmanager.h"

@interface PHLocationManager() <CLLocationManagerDelegate>

@property (strong, nonatomic) CLLocationManager *locationManager;

@end

@implementation PHLocationManager

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

#pragma mark Initialization

- (instancetype)init
{
  if (self = [super init]) {
    self.locationManager = [[CLLocationManager alloc] init];
    
    self.locationManager.delegate = self;
    
    self.locationManager.distanceFilter = kCLDistanceFilterNone;
    self.locationManager.desiredAccuracy = kCLLocationAccuracyBest;
    
    self.locationManager.pausesLocationUpdatesAutomatically = NO;
  }
  
  return self;
}


RCT_EXPORT_METHOD(requestWhenInUseAuthorization)
{
  NSLog(@"PHLocationManager: requestWhenInUseAuthorization");
  [self.locationManager requestWhenInUseAuthorization];
}

RCT_EXPORT_METHOD(startUpdatingLocation)
{
  [self.locationManager startUpdatingLocation];
}

RCT_EXPORT_METHOD(startUpdatingHeading)
{
  [self.locationManager startUpdatingHeading];
}

RCT_EXPORT_METHOD(startRangingBeaconsInRegion:(NSDictionary *) dict)
{
  [self.locationManager startRangingBeaconsInRegion:[self convertDictToBeaconRegion:dict]];
}

RCT_EXPORT_METHOD(stopRangingBeaconsInRegion:(NSDictionary *) dict)
{
  [self.locationManager stopRangingBeaconsInRegion:[self convertDictToBeaconRegion:dict]];
}

#pragma mark Helper methods

-(CLBeaconRegion *) createBeaconRegion: (NSString *) identifier
                                  uuid: (NSString *) uuid
                                 major: (NSInteger) major
                                 minor:(NSInteger) minor
{
  NSUUID *beaconUUID = [[NSUUID alloc] initWithUUIDString:uuid];
  
  unsigned short mj = (unsigned short) major;
  unsigned short mi = (unsigned short) minor;
  
  CLBeaconRegion *beaconRegion = [[CLBeaconRegion alloc] initWithProximityUUID:beaconUUID major:mj
                                                                         minor:mi
                                                                    identifier:identifier];
  
  beaconRegion.notifyEntryStateOnDisplay = YES;
  
  return beaconRegion;
}

-(CLBeaconRegion *) createBeaconRegion: (NSString *) identifier
                                  uuid: (NSString *) uuid
                                 major: (NSInteger) major
{
  NSUUID *beaconUUID = [[NSUUID alloc] initWithUUIDString:uuid];
  
  unsigned short mj = (unsigned short) major;
  
  CLBeaconRegion *beaconRegion = [[CLBeaconRegion alloc] initWithProximityUUID:beaconUUID
                                                                         major:mj
                                                                    identifier:identifier];
  
  beaconRegion.notifyEntryStateOnDisplay = YES;
  
  return beaconRegion;
}

-(CLBeaconRegion *) createBeaconRegion: (NSString *) identifier
                                  uuid: (NSString *) uuid
{
  NSUUID *beaconUUID = [[NSUUID alloc] initWithUUIDString:uuid];
  
  CLBeaconRegion *beaconRegion = [[CLBeaconRegion alloc] initWithProximityUUID:beaconUUID
                                                                    identifier:identifier];
  
  beaconRegion.notifyEntryStateOnDisplay = YES;
  
  return beaconRegion;
}

-(CLBeaconRegion *) convertDictToBeaconRegion: (NSDictionary *) dict
{
  if (dict[@"minor"] == nil) {
    if (dict[@"major"] == nil) {
      return [self createBeaconRegion:[RCTConvert NSString:dict[@"identifier"]]
                                 uuid:[RCTConvert NSString:dict[@"uuid"]]];
    } else {
      return [self createBeaconRegion:[RCTConvert NSString:dict[@"identifier"]]
                                 uuid:[RCTConvert NSString:dict[@"uuid"]]
                                major:[RCTConvert NSInteger:dict[@"major"]]];
    }
  } else {
    return [self createBeaconRegion:[RCTConvert NSString:dict[@"identifier"]]
                               uuid:[RCTConvert NSString:dict[@"uuid"]]
                              major:[RCTConvert NSInteger:dict[@"major"]]
                              minor:[RCTConvert NSInteger:dict[@"minor"]]];
  }
}

-(NSString *)stringForProximity:(CLProximity)proximity {
  switch (proximity) {
    case CLProximityUnknown:    return @"unknown";
    case CLProximityFar:        return @"far";
    case CLProximityNear:       return @"near";
    case CLProximityImmediate:  return @"immediate";
    default:                    return @"";
  }
}

# pragma mark Delegate methods

- (void)locationManager:(CLLocationManager *)manager didUpdateHeading:(CLHeading *)newHeading {
  if (newHeading.headingAccuracy < 0)
    return;
  
  // Use the true heading if it is valid.
  CLLocationDirection heading = ((newHeading.trueHeading > 0) ?
                                 newHeading.trueHeading : newHeading.magneticHeading);
  
  NSDictionary *headingEvent = @{
                                 @"heading": @(heading)
                                 };
  
  [self.bridge.eventDispatcher sendDeviceEventWithName:@"headingUpdated" body:headingEvent];
}

- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray *)locations {
  CLLocation *location = [locations lastObject];
  NSDictionary *locationEvent = @{
                                  @"coords": @{
                                      @"latitude": @(location.coordinate.latitude),
                                      @"longitude": @(location.coordinate.longitude),
                                      @"altitude": @(location.altitude),
                                      @"accuracy": @(location.horizontalAccuracy),
                                      @"altitudeAccuracy": @(location.verticalAccuracy),
                                      @"course": @(location.course),
                                      @"speed": @(location.speed),
                                      },
                                  @"timestamp": @([location.timestamp timeIntervalSince1970] * 1000) // in ms
                                  };
  
  [self.bridge.eventDispatcher sendDeviceEventWithName:@"locationUpdated" body:locationEvent];
}

-(void) locationManager:(CLLocationManager *)manager didRangeBeacons:
(NSArray *)beacons inRegion:(CLBeaconRegion *)region
{
  if (beacons.count == 0) {
    return;
  }
  NSMutableArray *beaconArray = [[NSMutableArray alloc] init];
  
  for (CLBeacon *beacon in beacons) {
    [beaconArray addObject:@{
                             @"uuid": [beacon.proximityUUID UUIDString],
                             @"major": beacon.major,
                             @"minor": beacon.minor,
                             
                             @"rssi": [NSNumber numberWithLong:beacon.rssi],
                             @"proximity": [self stringForProximity: beacon.proximity],
                             @"accuracy": [NSNumber numberWithDouble: beacon.accuracy]
                             }];
  }
  
  NSDictionary *event = @{
                          @"region": @{
                              @"identifier": region.identifier,
                              @"uuid": [region.proximityUUID UUIDString],
                              },
                          @"beacons": beaconArray
                          };
  
  [self.bridge.eventDispatcher sendDeviceEventWithName:@"beaconsDidRange" body:event];
}

@end
