import * as React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

declare module 'react-native-deck-swiper' {
  export interface SwiperProps<T> {
    cards: T[];
    renderCard: (card: T) => React.ReactNode;
    onSwipedLeft?: (cardIndex: number) => void;
    onSwipedRight?: (cardIndex: number) => void;
    onSwipedAll?: () => void;
    cardIndex?: number;
    backgroundColor?: string;
    stackSize?: number;
    verticalSwipe?: boolean;
    overlayLabels?: {
      left?: {
        title?: string;
        style?: {
          label?: StyleProp<ViewStyle>;
          wrapper?: StyleProp<ViewStyle>;
        };
        titleStyle?: StyleProp<TextStyle>;
      };
      right?: {
        title?: string;
        style?: {
          label?: StyleProp<ViewStyle>;
          wrapper?: StyleProp<ViewStyle>;
        };
        titleStyle?: StyleProp<TextStyle>;
      };
    };
    animateOverlayLabelsOpacity?: boolean;
    animateCardOpacity?: boolean;
  }

  export default class Swiper<T> extends React.Component<SwiperProps<T>> {
    swipeLeft: () => void;
    swipeRight: () => void;
    state: {
      firstCardIndex: number;
    };
  }
}