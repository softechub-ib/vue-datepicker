import {
  CalendarStylesGenerator,
  ExtractDateComponent,
  FormatDate,
  InputStylesGenerator,
} from '@/types/index';
import dayjs from '@/dayjs-with-locales';

const colors = {
  dark: 'hsla(0, 0%, 0%, 0.9)',
  middleDark: 'hsla(0, 0%, 12%, 1)',
  lightDark: 'hsla(0, 0%, 0%, 0.5)',
  darkGray: 'hsl(0, 0%, 24%)',
  middleGray1: 'hsl(0, 0%, 66%)',
  middleGray2: 'hsl(0, 0%, 80%)',
  lightGray: 'hsl(0, 0%, 94%)',
  light: 'hsl(0, 0%, 100%)',
  selected: 'hsl(213, 100%, 50%)',
  border: 'hsla(0, 0%, 0%, 0.1)',
  borderDark: 'hsla(0, 0%, 30%, 1)',
  hoverBorder: 'hsla(0, 0%, 0%, 0.3)',
  hoverBorderDark: 'hsla(0, 0%, 85%, 1)',
  error: {
    borderColor: 'hsl(0, 74%, 42%)',
    backgroundColor: 'hsl(0, 86%, 97%)',
  },
  errorDark: {
    borderColor: 'hsl(0, 65%, 42%)',
    backgroundColor: 'hsla(0, 90%, 75%, 0.6)',
  },
};

export const defaultInputStyles: InputStylesGenerator = (dark) => ({
  container: {
    border: `1px solid ${dark ? colors.borderDark : colors.border}`,
    hoverBorder: `1px solid ${dark ? colors.hoverBorderDark : colors.hoverBorder}`,
    borderRadius: '4px',
    backgroundColor: dark ? colors.middleDark : colors.light,
    small: {
      paddingX: '8px',
      paddingY: '6px',
      calendarIcon: {
        size: '14px',
      },
      clearIcon: {
        size: '16px',
      },
    },
    medium: {
      paddingX: '12px',
      paddingY: '10px',
      calendarIcon: {
        size: '16px',
      },
      clearIcon: {
        size: '20px',
      },
    },
    large: {
      paddingX: '14px',
      paddingY: '12px',
      calendarIcon: {
        size: '18px',
      },
      clearIcon: {
        size: '22px',
      },
    },
    disabled: {
      opacity: '0.5',
    },
    error: {
      borderColor: dark
        ? colors.errorDark.borderColor
        : colors.error.borderColor,
      backgroundColor: dark
        ? colors.errorDark.backgroundColor
        : colors.error.backgroundColor,
    },
  },
  selection: {
    calendarIcon: {
      color: dark ? colors.light : colors.lightDark,
      marginRight: '8px',
    },
    clearIcon: {
      color: dark ? colors.light : colors.lightDark,
      marginLeft: '4px',
    },
  },
  input: {
    fontSize: '14px',
    lineHeight: '16px',
    color: dark ? colors.light : colors.dark,
  },
  calendarWrapper: {
    zIndex: '10',
  },
});

export const defaultCalendarStyles: CalendarStylesGenerator = (dark) => ({
  container: {
    width: '272px',
    paddingX: '12px',
    paddingY: '12px',
    border: `1px solid ${dark ? colors.borderDark : colors.border}`,
    borderRadius: '4px',
    backgroundColor: dark ? colors.middleDark : colors.light,
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  },
  navButton: {
    padding: '4px',
    color: dark ? colors.light : colors.lightDark,
    border: 'none',
    borderRadius: '4px',
    backgroundColor: 'transparent',
    hoverBackgroundColor: dark ? colors.darkGray : colors.lightGray,
    iconSize: '16px',
    restricted: {
      opacity: '0.5',
    },
  },
  navDateItem: {
    fontSize: '12px',
    fontWeight: '600',
    lineHeight: '16px',
    color: dark ? colors.light : colors.dark,
    paddingX: '4px',
    paddingY: '8px',
    borderRadius: '4px',
    hoverBackgroundColor: dark ? colors.darkGray : colors.lightGray,
  },
  table: {
    fontSize: '12px',
    gap: '4px',
    marginTop: '12px',
  },
  tableHead: {
    fontWeight: '700',
  },
  tableHeadItem: {
    color: dark ? colors.middleGray2 : colors.lightDark,
  },
  tableBody: {
    fontWeight: '500',
  },
  tableBodyRow: {
    days: {
      marginTop: '2px',
    },
    monthsYears: {
      marginBottom: '24px',
    },
  },
  tableBodyItem: {
    borderRadius: '4px',
    color: dark ? colors.light : colors.dark,
    hoverBackgroundColor: dark ? colors.darkGray : colors.lightGray,
    offset: {
      color: dark ? colors.middleGray1 : colors.lightDark,
      hoverColor: dark ? colors.light : colors.dark,
      opacity: '0.5',
    },
    current: {
      border: `1px solid ${colors.selected}`,
    },
    restricted: {
      color: dark ? colors.middleGray1 : colors.lightDark,
      opacity: '0.5',
    },
    selected: {
      color: colors.light,
      backgroundColor: colors.selected,
    },
  },
});

export const extractDateComponent: ExtractDateComponent = function (
  date,
  component,
) {
  return (
    component === 'year' ? date.split('-')[0] : date.split('-')[1]
  ) as any;
};

export const formatDate: FormatDate = function (date, format, monthAdjustment) {
  let dateValue = dayjs(date);

  if (!dateValue.isValid()) {
    return '';
  }

  switch (monthAdjustment) {
    case 'subtract':
      dateValue = dateValue.subtract(1, 'month');
      break;
    case 'add':
      dateValue = dateValue.add(1, 'month');
      break;
    default:
      break;
  }

  return dateValue.format(format) as any;
};
