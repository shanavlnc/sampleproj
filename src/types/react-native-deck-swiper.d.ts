import { Component } from 'react';
import { ViewStyle, TextStyle } from 'react-native';

declare module 'react-native-deck-swiper' {
  export interface SwiperState {
    firstCardIndex: number;
    secondCardIndex: number;
    lastSwipedIndex: number;
  }

  export interface SwiperProps<T> {
    cards: T[];
    renderCard: (card: T) => React.ReactNode;
    onSwipedLeft?: (cardIndex: number) => void;
    onSwipedRight?: (cardIndex: number) => void;
    backgroundColor?: string;
    stackSize?: number;
    verticalSwipe?: boolean;
    overlayLabels?: {
      left?: {
        title?: string;
        style?: {
          label?: TextStyle;
          wrapper?: ViewStyle;
        };
      };
      right?: {
        title?: string;
        style?: {
          label?: TextStyle;
          wrapper?: ViewStyle;
        };
      };
    };
  }

  export default class Swiper<T> extends Component<SwiperProps<T>, SwiperState> {
    swipeLeft: () => void;
    swipeRight: () => void;
    forceUpdate: () => void;
    jumpToCardIndex: (index: number) => void;
  }
}