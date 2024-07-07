import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { DefaultValue } from 'recoil';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const guardRecoilDefaultValue = (
  candidate: any
): candidate is DefaultValue => {
  if (candidate instanceof DefaultValue) return true;
  return false;
};

const UNITS = [
  { value: 1e21, short: 'YT', full: 'Yottatimeshare' },
  { value: 1e18, short: 'ZT', full: 'Zettatimeshare' },
  { value: 1e15, short: 'ET', full: 'Exatimeshare' },
  { value: 1e12, short: 'PT', full: 'Petatimeshare' },
  { value: 1e9, short: 'GT', full: 'Gigatimeshare' },
  { value: 1e6, short: 'MT', full: 'Megatimeshare' },
  { value: 1e3, short: 'kT', full: 'Kilotimeshare' },
  { value: 1, short: 'T', full: 'Timeshare' },
];

export const formatMoney = (money: number): [string, string, string] => {
  for (const { value, short, full } of UNITS) {
    if (money >= value || value === 1) {
      const convertedValue = money / value;
      const formattedValue = Number.isInteger(convertedValue)
        ? convertedValue.toLocaleString('en-US')
        : convertedValue.toLocaleString('en-US', {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3
          });
      return [formattedValue, short, full];
    }
  }
  
  // This line should never be reached due to the last item in UNITS
  return [Number.isInteger(money) ? money.toString() : money.toFixed(3), 'T', 'timeshare'];
};
