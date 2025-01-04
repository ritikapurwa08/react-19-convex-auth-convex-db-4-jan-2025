import add_heart_icon from "./add-heart-icon.svg";
import red_heart_icon from "./red-heart-icon.svg";
import cart_icon from "./shopping-cart.svg";
import ruppesicon from "./ruppes-currency.svg";
import dollarCurrencyIcon from "./dollar-currency.svg";
import appleImage from "./apple_profile.svg";
import bananaImage from "./banana_profile.svg";
import pineAppleImage from "./pine_apple.svg";

export {
  add_heart_icon,
  red_heart_icon,
  cart_icon,
  ruppesicon,
  dollarCurrencyIcon,
  appleImage,
  bananaImage,
  pineAppleImage,
};

export interface SelectOption {
  label: string;
  value: string;
  image: string; // Path to the local image
}

export const fruitOptions: SelectOption[] = [
  { label: "Apple", value: "apple", image: appleImage },
  { label: "Banana", value: "banana", image: bananaImage },
  { label: "Pineapple", value: "pineapple", image: pineAppleImage },
];
