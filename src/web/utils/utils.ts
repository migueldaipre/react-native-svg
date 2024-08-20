import type { NumberProp, TransformProps } from '../../lib/extract/types';
import {
  transformsArrayToProps,
  TransformsStyleArray,
} from '../../lib/extract/extractTransform';
import type { BaseProps, CreateComponentProps } from '../../types';
import { resolve } from '../../lib/resolve';
import { resolveAssetUri } from '../../lib/resolveAssetUri';

export function parseTransformProp(
  transform: TransformProps['transform'],
  props?: BaseProps
) {
  const transformArray: string[] = [];

  props && transformArray.push(...stringifyTransformProps(props));

  if (Array.isArray(transform)) {
    if (typeof transform[0] === 'number') {
      transformArray.push(`matrix(${transform.join(' ')})`);
    } else {
      const stringifiedProps = transformsArrayToProps(
        transform as TransformsStyleArray
      );
      transformArray.push(...stringifyTransformProps(stringifiedProps));
    }
  } else if (typeof transform === 'string') {
    transformArray.push(transform);
  }

  return transformArray.length ? transformArray.join(' ') : undefined;
}

export function hasTouchableProperty(props: BaseProps): boolean {
  return !!(
    props.onPress ||
    props.onPressIn ||
    props.onPressOut ||
    props.onLongPress
  );
}

export function hasResponderEvents(props: BaseProps): boolean {
  return !!(
    props.onResponderGrant ||
    props.onResponderMove ||
    props.onResponderRelease ||
    props.onResponderTerminate ||
    props.onResponderTerminationRequest ||
    props.onMoveShouldSetResponder ||
    props.onMoveShouldSetResponderCapture ||
    props.onResponderEnd ||
    props.onResponderReject ||
    props.onResponderStart ||
    props.onScrollShouldSetResponder ||
    props.onScrollShouldSetResponderCapture ||
    props.onSelectionChangeShouldSetResponder ||
    props.onSelectionChangeShouldSetResponderCapture ||
    props.onStartShouldSetResponder ||
    props.onStartShouldSetResponderCapture
  );
}

export function stringifyTransformProps(transformProps: TransformProps) {
  const transformArray = [];
  if (transformProps.translate != null) {
    transformArray.push(`translate(${transformProps.translate})`);
  }
  if (transformProps.translateX != null || transformProps.translateY != null) {
    transformArray.push(
      `translate(${transformProps.translateX || 0}, ${
        transformProps.translateY || 0
      })`
    );
  }
  if (transformProps.scale != null) {
    transformArray.push(`scale(${transformProps.scale})`);
  }
  if (transformProps.scaleX != null || transformProps.scaleY != null) {
    transformArray.push(
      `scale(${transformProps.scaleX || 1}, ${transformProps.scaleY || 1})`
    );
  }
  // rotation maps to rotate, not to collide with the text rotate attribute (which acts per glyph rather than block)
  if (transformProps.rotation != null) {
    transformArray.push(`rotate(${transformProps.rotation})`);
  }
  if (transformProps.skewX != null) {
    transformArray.push(`skewX(${transformProps.skewX})`);
  }
  if (transformProps.skewY != null) {
    transformArray.push(`skewY(${transformProps.skewY})`);
  }
  return transformArray;
}

export const camelCaseToDashed = (camelCase: string) => {
  return camelCase.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
};

export const getBoundingClientRect = (node: SVGElement) => {
  if (node) {
    const isElement = node.nodeType === 1; /* Node.ELEMENT_NODE */
    if (isElement && typeof node.getBoundingClientRect === 'function') {
      return node.getBoundingClientRect();
    }
  }
  throw new Error('Can not get boundingClientRect of ' + node || 'undefined');
};

export const remeasure = (element: HTMLElement | null) => {
  if (!element) return;
  const rect = element.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
  };
};

/**
 * `react-native-svg` supports additional props that aren't defined in the spec.
 * This function replaces them in a spec conforming manner.
 */
interface PrepareComponentProps extends CreateComponentProps {
  'transform-origin'?: string;
  ref?: unknown;
}

export const prepare = (props: CreateComponentProps) => {
  const {
    transform,
    origin,
    originX,
    originY,
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
    style,
    forwardedRef,
    gradientTransform,
    patternTransform,
    ...rest
  } = props;

  const clean: PrepareComponentProps = rest;

  if (origin != null) {
    clean['transform-origin'] = origin.toString().replace(',', ' ');
  } else if (originX != null || originY != null) {
    clean['transform-origin'] = `${originX || 0} ${originY || 0}`;
  }

  const parsedTransform = parseTransformProp(transform, props);
  if (parsedTransform) {
    clean.transform = parsedTransform;
  }
  const parsedGradientTransform = parseTransformProp(gradientTransform);
  if (parsedGradientTransform) {
    clean.gradientTransform = parsedGradientTransform;
  }
  const parsedPatternTransform = parseTransformProp(patternTransform);
  if (parsedPatternTransform) {
    clean.patternTransform = parsedPatternTransform;
  }

  clean.ref = (el: SVGElement | null) => {
    if (el) {
      const elementRef =
        props.forwardedRef as React.MutableRefObject<SVGElement | null>;
      elementRef.current = el;
      if (typeof forwardedRef === 'function') {
        forwardedRef(el);
      } else if (forwardedRef) {
        (
          forwardedRef as unknown as React.MutableRefObject<SVGElement>
        ).current = el;
      }
    }
  };

  const styles: {
    fontStyle?: string;
    fontFamily?: string;
    fontSize?: NumberProp;
    fontWeight?: NumberProp;
  } = {};

  if (fontFamily != null) {
    styles.fontFamily = fontFamily;
  }
  if (fontSize != null) {
    styles.fontSize = fontSize;
  }
  if (fontWeight != null) {
    styles.fontWeight = fontWeight;
  }
  if (fontStyle != null) {
    styles.fontStyle = fontStyle;
  }
  if (props.href !== null) {
    clean.href = resolveAssetUri(props.href)?.uri;
  }
  clean.style = resolve(style, styles);
  return clean;
};