import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ColorValue } from 'react-native';
import type {
  Double,
  Float,
  Int32,
} from 'react-native/Libraries/Types/CodegenTypes';
import type { ViewProps } from './utils';

import type { UnsafeMixed } from './codegenUtils';
import { NumberProp } from '../lib/extract/types';

type NativeBackgroundProp = Readonly<{
  type?: string;
  color?: Float;
  borderless?: boolean;
  rippleRadius?: Float;
}>;

type HitSlop = Readonly<{
  left?: Float;
  top?: Float;
  right?: Float;
  bottom?: Float;
}>;

interface NativeProps extends ViewProps {
  bbWidth?: UnsafeMixed<NumberProp>;
  bbHeight?: UnsafeMixed<NumberProp>;
  minX?: Float;
  minY?: Float;
  vbWidth?: Float;
  vbHeight?: Float;
  align?: string;
  meetOrSlice?: Int32;
  tintColor?: ColorValue;
  color?: ColorValue;
  pointerEvents?: string;

  // props needed for Android SvgView
  hasTVPreferredFocus?: boolean;
  borderBottomColor?: ColorValue;
  nextFocusDown?: Int32;
  borderRightColor?: ColorValue;
  nextFocusRight?: Int32;
  borderLeftColor?: ColorValue;
  borderColor?: ColorValue;
  removeClippedSubviews?: boolean;
  nextFocusForward?: Int32;
  nextFocusUp?: Int32;
  accessible?: boolean;
  borderStartColor?: ColorValue;
  borderEndColor?: ColorValue;
  focusable?: boolean;
  nativeBackgroundAndroid?: NativeBackgroundProp; // maybe there should a value accepted by codegen for this?
  nativeForegroundAndroid?: NativeBackgroundProp; // maybe there should a value accepted by codegen for this?
  backfaceVisibility?: string;
  borderStyle?: string;
  needsOffscreenAlphaCompositing?: boolean;
  hitSlop?: UnsafeMixed<HitSlop | null | number | undefined>;
  borderTopColor?: ColorValue;
  nextFocusLeft?: Int32;
  // TODO: those props are present in the `ReactPropGroup` but are not supported
  // (https://github.com/facebook/react-native/blob/35556dba600fbb28e0f41340a74b6c4a59bc6018/ReactAndroid/src/main/java/com/facebook/react/uimanager/BaseViewManager.java#L613)
  // and static view config validator says that they are missing.
  // We pass them as doubles although they should be floats, and cast them to floats again on the native side.
  borderRadius?: UnsafeMixed<Double | string | undefined>;
  borderTopLeftRadius?: UnsafeMixed<Double | string | undefined>;
  borderTopRightRadius?: UnsafeMixed<Double | string | undefined>;
  borderBottomRightRadius?: UnsafeMixed<Double | string | undefined>;
  borderBottomLeftRadius?: UnsafeMixed<Double | string | undefined>;
  borderTopStartRadius?: UnsafeMixed<Double | string | undefined>;
  borderTopEndRadius?: UnsafeMixed<Double | string | undefined>;
  borderBottomStartRadius?: UnsafeMixed<Double | string | undefined>;
  borderBottomEndRadius?: UnsafeMixed<Double | string | undefined>;
  borderEndEndRadius?: UnsafeMixed<Double | string | undefined>;
  borderEndStartRadius?: UnsafeMixed<Double | string | undefined>;
  borderStartEndRadius?: UnsafeMixed<Double | string | undefined>;
  borderStartStartRadius?: UnsafeMixed<Double | string | undefined>;
  borderBlockColor?: ColorValue;
  borderBlockEndColor?: ColorValue;
  borderBlockStartColor?: ColorValue;
}

export default codegenNativeComponent<NativeProps>('RNSVGSvgViewAndroid', {
  excludedPlatforms: ['iOS'],
});
