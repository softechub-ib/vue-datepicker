import dayjs from '@/dayjs-with-locales';

export type DeepRequired<T> = T extends object
  ? { [K in keyof T]-?: DeepRequired<T[K]> }
  : T;

type Unit = '%' | 'px' | 'em' | 'rem';

export type InputStylesProp = {
  container?: {
    border?: string;
    hoverBorder?: string;
    borderRadius?: `${number}${Unit}`;
    backgroundColor?: string;
    small?: {
      paddingX?: `${number}${Unit}`;
      paddingY?: `${number}${Unit}`;
      calendarIcon?: {
        size?: `${number}${Unit}`;
      };
      clearIcon?: {
        size?: `${number}${Unit}`;
      };
    };
    medium?: {
      paddingX?: `${number}${Unit}`;
      paddingY?: `${number}${Unit}`;
      calendarIcon?: {
        size?: `${number}${Unit}`;
      };
      clearIcon?: {
        size?: `${number}${Unit}`;
      };
    };
    large?: {
      paddingX?: `${number}${Unit}`;
      paddingY?: `${number}${Unit}`;
      calendarIcon?: {
        size?: `${number}${Unit}`;
      };
      clearIcon?: {
        size?: `${number}${Unit}`;
      };
    };
    disabled?: {
      opacity?: `${number}`;
    };
    error?: {
      borderColor?: string;
      backgroundColor?: string;
    };
  };
  selection?: {
    calendarIcon?: {
      color?: string;
      marginRight?: `${number}${Unit}`;
    };
    clearIcon?: {
      color?: string;
      marginLeft?: `${number}${Unit}`;
    };
  };
  input?: {
    fontSize?: `${number}${Unit}`;
    lineHeight?: `${number}${Unit}`;
    color?: string;
  };
  calendarWrapper?: {
    zIndex?: `${number}`;
  };
};

export type InputStylesGenerator = (
  dark: boolean,
) => DeepRequired<InputStylesProp>;

export type CalendarStylesProp = {
  container?: {
    width?: `${number}px`;
    paddingX?: `${number}${Unit}`;
    paddingY?: `${number}${Unit}`;
    border?: string;
    borderRadius?: `${number}${Unit}`;
    backgroundColor?: string;
    boxShadow?: string;
  };
  header?: {
    marginBottom?: `${number}${Unit}`;
  };
  headerButton?: {
    padding?: `${number}${Unit}`;
    color?: string;
    border?: string;
    borderRadius?: `${number}${Unit}`;
    backgroundColor?: string;
    hoverBackgroundColor?: string;
    iconSize?: `${number}${Unit}`;
    restricted?: {
      opacity?: `${number}`;
    };
  };
  headerDateItem?: {
    fontSize?: `${number}${Unit}`;
    fontWeight?: `${number}`;
    lineHeight?: `${number}${Unit}`;
    color?: string;
    paddingX?: string;
    paddingY?: string;
    borderRadius?: `${number}${Unit}`;
    hoverBackgroundColor?: string;
  };
  table?: {
    fontSize?: `${number}${Unit}`;
    gap?: `${number}${Unit}`;
  };
  tableHead?: {
    fontWeight?: `${number}`;
  };
  tableHeadItem?: {
    color?: string;
  };
  tableBody?: {
    fontWeight?: `${number}`;
  };
  tableBodyRow?: {
    days?: {
      marginTop?: `${number}${Unit}`;
    };
    monthsYears?: {
      marginBottom?: `${number}${Unit}`;
    };
  };
  tableBodyItem?: {
    borderRadius?: `${number}${Unit}`;
    color?: string;
    hoverBackgroundColor?: string;
    offset?: {
      color?: string;
      hoverColor?: string;
      opacity?: `${number}`;
    };
    current?: {
      border?: string;
    };
    restricted?: {
      color?: string;
      opacity?: `${number}`;
    };
    selected?: {
      color?: string;
      backgroundColor?: string;
    };
  };
};

export type CalendarStylesGenerator = (
  dark: boolean,
) => DeepRequired<CalendarStylesProp>;

export type DateValue = string | number | Date | null | undefined;

type Day = `${number}${number}`;

export type Year = `${number}${number}${number}${number}`;

export type Month = `${number}${number}`;

export type DateString = `${Year}-${Month}-${Day}`;

export type CalendarValue = `${Year}-${Month}`;

export type CalendarDay = { date: DateString; day: number; offset: boolean };

export type CalendarMonth = { text: string; value: Month };

export type ExtractDateComponent = <T extends 'year' | 'month'>(
  date: string,
  component: T,
) => T extends 'year' ? Year : Month;

export type FormatDate = <T extends string>(
  date: string | number | Date | dayjs.Dayjs,
  format: T,
  adjustment?: 'subtract' | 'add',
  timeUnit?: 'month' | 'year',
) => T extends 'YYYY-MM-DD'
  ? DateString
  : T extends 'YYYY-MM'
    ? CalendarValue
    : T extends 'YYYY'
      ? Year
      : T extends 'MM'
        ? Month
        : string;

export type Size = 'small' | 'medium' | 'large';

export type Show = 'days' | 'months' | 'years';

export type DayjsLocale =
  | 'af'
  | 'ar-dz'
  | 'am'
  | 'ar-iq'
  | 'ar-kw'
  | 'ar-ly'
  | 'ar-ma'
  | 'ar-sa'
  | 'ar-tn'
  | 'ar'
  | 'az'
  | 'be'
  | 'bg'
  | 'bm'
  | 'bi'
  | 'bn-bd'
  | 'bn'
  | 'bo'
  | 'br'
  | 'bs'
  | 'ca'
  | 'cs'
  | 'cv'
  | 'cy'
  | 'da'
  | 'de-at'
  | 'de-ch'
  | 'de'
  | 'dv'
  | 'el'
  | 'en-au'
  | 'en-ca'
  | 'en-gb'
  | 'en-ie'
  | 'en-il'
  | 'en-in'
  | 'en-nz'
  | 'en-sg'
  | 'en-tt'
  | 'eo'
  | 'en'
  | 'es-do'
  | 'es-mx'
  | 'es'
  | 'et'
  | 'eu'
  | 'fa'
  | 'fi'
  | 'fo'
  | 'fr-ca'
  | 'fr-ch'
  | 'fr'
  | 'fy'
  | 'ga'
  | 'gd'
  | 'gl'
  | 'gom-latn'
  | 'gu'
  | 'he'
  | 'hi'
  | 'hr'
  | 'ht'
  | 'hu'
  | 'hy-am'
  | 'id'
  | 'it-ch'
  | 'is'
  | 'ja'
  | 'it'
  | 'ka'
  | 'jv'
  | 'kk'
  | 'km'
  | 'ko'
  | 'kn'
  | 'ku'
  | 'ky'
  | 'lb'
  | 'lo'
  | 'lv'
  | 'lt'
  | 'me'
  | 'mi'
  | 'mk'
  | 'ml'
  | 'mn'
  | 'mr'
  | 'ms-my'
  | 'ms'
  | 'mt'
  | 'my'
  | 'nb'
  | 'ne'
  | 'nl-be'
  | 'nn'
  | 'nl'
  | 'pa-in'
  | 'oc-lnc'
  | 'pt-br'
  | 'pl'
  | 'pt'
  | 'rn'
  | 'ro'
  | 'ru'
  | 'es-us'
  | 'es-pr'
  | 'sd'
  | 'si'
  | 'sk'
  | 'sl'
  | 'sq'
  | 'sr-cyrl'
  | 'sr'
  | 'ss'
  | 'sv-fi'
  | 'sv'
  | 'sw'
  | 'te'
  | 'ta'
  | 'tet'
  | 'tg'
  | 'tk'
  | 'tl-ph'
  | 'tlh'
  | 'th'
  | 'tr'
  | 'tzl'
  | 'tzm-latn'
  | 'tzm'
  | 'ug-cn'
  | 'uk'
  | 'ur'
  | 'uz-latn'
  | 'uz'
  | 'vi'
  | 'x-pseudo'
  | 'yo'
  | 'zh-cn'
  | 'zh-hk'
  | 'zh-tw'
  | 'zh'
  | 'rw'
  | 'se';
