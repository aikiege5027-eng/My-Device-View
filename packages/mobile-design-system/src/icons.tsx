import React from 'react';
import Svg, { G, Path, type SvgProps } from 'react-native-svg';

export function BackIcon(props: SvgProps) {
  return (
    <Svg
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 8.06829 13.3789"
      {...props}
    >
      <Path
        d="M6.68943 0L8.06829 1.37886L2.75772 6.68943L8.06829 12L6.68943 13.3789L0 6.68943L6.68943 0Z"
        fill="currentColor"
      />
    </Svg>
  );
}

export function CaretDownSmallIcon(props: SvgProps) {
  return (
    <Svg fill="none" preserveAspectRatio="none" viewBox="0 0 16 16" {...props}>
      <G>
        <Path d="M11 6H5L8 10.5L11 6Z" fill="currentColor" />
      </G>
    </Svg>
  );
}

export function ChevronDownIcon(props: SvgProps) {
  return (
    <Svg fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" {...props}>
      <G>
        <Path
          clipRule="evenodd"
          d="M17.946 7.95118L19.1726 9.21622L12.7495 15.8406C12.1602 16.4483 11.185 16.4483 10.5957 15.8406L4.17262 9.21622L5.39923 7.95118L11.6726 14.4211L17.946 7.95118Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </G>
    </Svg>
  );
}

export function CheckCircleFilledIcon(props: SvgProps) {
  return (
    <Svg fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" {...props}>
      <Path
        clipRule="evenodd"
        d="M12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.20101 17.799 1.5 12 1.5C6.20101 1.5 1.5 6.20101 1.5 12C1.5 17.799 6.20101 22.5 12 22.5ZM17.0304 9.53039L11.0304 15.5304C10.7375 15.8233 10.2626 15.8233 9.96973 15.5304L6.96973 12.5304L8.03039 11.4697L10.5001 13.9394L15.9697 8.46973L17.0304 9.53039Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </Svg>
  );
}

export function MinusCircleFilledIcon(props: SvgProps) {
  return (
    <Svg fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" {...props}>
      <Path
        clipRule="evenodd"
        d="M12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.20101 17.799 1.5 12 1.5C6.20101 1.5 1.5 6.20101 1.5 12C1.5 17.799 6.20101 22.5 12 22.5ZM17.25 12.75H6.75V11.25H17.25V12.75Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </Svg>
  );
}

export function CheckboxCheckIcon(props: SvgProps) {
  return (
    <Svg
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 18.5758 12.7634"
      {...props}
    >
      <Path
        clipRule="evenodd"
        d="M18.5758 1.32583L7.15167 12.4888C6.78555 12.8549 6.19196 12.8549 5.82584 12.4888L0 6.40169L1.32583 5.07587L6.48875 10.5001L17.25 0L18.5758 1.32583Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </Svg>
  );
}

export function CheckboxCardCheckIcon({ checkColor, ...props }: SvgProps & { checkColor: string }) {
  return (
    <Svg fill="none" preserveAspectRatio="none" viewBox="0 0 28 28" {...props}>
      <G>
        <Path d="M0 0H28L0 28V0Z" fill="currentColor" />
        <G>
          <Path
            d="M7.96248 11.0146L13.4073 5.56978L14.2116 6.37412L7.96248 12.6233L4.06054 8.72134L4.86488 7.917L7.96248 11.0146Z"
            fill={checkColor}
          />
        </G>
      </G>
    </Svg>
  );
}

export function CloseMIcon(props: SvgProps) {
  return (
    <Svg fill="none" preserveAspectRatio="none" viewBox="0 0 22 22" {...props}>
      <G>
        <Path
          clipRule="evenodd"
          d="M11 11.8933L15.6067 16.5L16.5 15.6067L11.8933 11L16.5 6.39331L15.6067 5.5L11 10.1067L6.39331 5.5L5.5 6.39331L10.1067 11L5.5 15.6067L6.39331 16.5L11 11.8933Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </G>
    </Svg>
  );
}
