//
//  IntentMoudle.m
//  doAPP
//
//  Created by Sai Chen on 2019/2/25.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "RNFilePicker.h"
#import <UIKit/UIKit.h>


@interface RNFilePicker ()<UIDocumentPickerDelegate>
  @property (nonatomic, copy) RCTPromiseResolveBlock fileResolve;
  @property (nonatomic,strong)UIDocumentPickerViewController *documentPickerVC;
@end
@implementation RNFilePicker
RCT_EXPORT_MODULE()
- (instancetype)init {
  if (self = [super init]) {
  }
  return self;
}

+ (BOOL)requiresMainQueueSetup {
  return NO;
}


- (void)dealloc {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}


RCT_EXPORT_METHOD(pickerFile:(NSArray *)documentTypes resolver:(RCTPromiseResolveBlock)callback rejecter:(RCTPromiseRejectBlock)reject){
  self.documentPickerVC = [[UIDocumentPickerViewController alloc]initWithDocumentTypes:documentTypes inMode:UIDocumentPickerModeImport];
  self.documentPickerVC.delegate = self;
  self.fileResolve = callback;
  dispatch_async(dispatch_get_main_queue(), ^{
    [[UIApplication sharedApplication].keyWindow.rootViewController presentViewController:self.documentPickerVC animated:YES completion:nil];
  });
  
}

-(void)documentPicker:(UIDocumentPickerViewController *)controller didPickDocumentAtURL:(NSURL *)url{
  
  NSDictionary *response = [self getFileOfPath:url.path];
  self.fileResolve(response);
}
- (void)documentPicker:(UIDocumentPickerViewController *)controller didPickDocumentsAtURLs:(NSArray <NSURL *>*)urls{
  NSDictionary *response = [self getFileOfPath:urls[0].path];
  self.fileResolve(response);
}

-(NSDictionary *)getFileOfPath:(NSString *)path{
  NSFileManager *manager = [NSFileManager defaultManager];
  NSData *data = [manager contentsAtPath:path];
  NSString *base64Data = [data base64EncodedStringWithOptions:NSDataBase64Encoding64CharacterLineLength];
  return @{
     @"fileName":path.lastPathComponent,
     @"type":path.pathExtension,
     @"data":base64Data,
  };
}

@end
