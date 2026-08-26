declare module 'lucide-react-native/icons/*' {
  import type { ComponentType } from 'react';
  import type { SvgProps } from 'react-native-svg';

  const Icon: ComponentType<
    SvgProps & {
      size?: number | string;
      color?: string;
      strokeWidth?: number | string;
    }
  >;
  export default Icon;
}
