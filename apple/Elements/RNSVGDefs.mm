/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
#import "RNSVGDefs.h"

#ifdef RN_FABRIC_ENABLED
#import <react/renderer/components/rnsvg/ComponentDescriptors.h>
#import "RCTFabricComponentsPlugins.h"
#import "RCTConversions.h"
#import <react/renderer/components/view/conversions.h>
#import "RNSVGFabricConversions.h"
#endif

@implementation RNSVGDefs

#ifdef RN_FABRIC_ENABLED
using namespace facebook::react;

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSVGDefsProps>();
    _props = defaultProps;
  }
  return self;
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    mountChildComponentView(childComponentView, index, self);
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    unmountChildComponentView(childComponentView, index, self);
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSVGDefsComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    [super updateProps:props oldProps:oldProps];
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];

    [self fabricDealloc];
}
#endif

- (void)renderTo:(CGContextRef)context
{
    // Defs do not render
}

- (void)parseReference
{
    self.dirty = false;
    [self traverseSubviews:^(RNSVGNode *node) {
        if ([node isKindOfClass:[RNSVGNode class]]) {
            [node parseReference];
        }
        return YES;
    }];
}

- (RNSVGPlatformView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
    return nil;
}

@end

Class<RCTComponentViewProtocol> RNSVGDefsCls(void)
{
  return RNSVGDefs.class;
}
