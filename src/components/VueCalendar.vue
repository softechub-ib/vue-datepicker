<script setup lang="ts">
import {
  CalendarDay,
  CalendarMonth,
  CalendarStylesProp,
  CalendarValue,
  DateString,
  Month,
  Show,
  Year,
} from '@/types/index';
import { computed, nextTick, ref } from 'vue';
import { extractDateComponent, formatDate } from '@/helpers/index';
import dayjs from '@/dayjs-with-locales';

type VueCalendarProps = {
  value: string | string[];
  range: boolean;
  startWeekOnMonday: boolean;
  min: DateString | undefined;
  max: DateString | undefined;
  styles: CalendarStylesProp;
};

const props = defineProps<VueCalendarProps>();

const emit = defineEmits<{
  (e: 'change', value: DateString): void;
}>();

const currentDate = formatDate(new Date().toDateString(), 'YYYY-MM-DD');
const minYear = props.min && extractDateComponent(props.min, 'year');
const minMonth = props.min && extractDateComponent(props.min, 'month');
const maxYear = props.max && extractDateComponent(props.max, 'year');
const maxMonth = props.max && extractDateComponent(props.max, 'month');
const calendarMonths: CalendarMonth[][] = [
  [
    { text: formatDate(dayjs().month(0), 'MMM'), value: '01' },
    { text: formatDate(dayjs().month(1), 'MMM'), value: '02' },
    { text: formatDate(dayjs().month(2), 'MMM'), value: '03' },
  ],
  [
    { text: formatDate(dayjs().month(3), 'MMM'), value: '04' },
    { text: formatDate(dayjs().month(4), 'MMM'), value: '05' },
    { text: formatDate(dayjs().month(5), 'MMM'), value: '06' },
  ],
  [
    { text: formatDate(dayjs().month(6), 'MMM'), value: '07' },
    { text: formatDate(dayjs().month(7), 'MMM'), value: '08' },
    { text: formatDate(dayjs().month(8), 'MMM'), value: '09' },
  ],
  [
    { text: formatDate(dayjs().month(9), 'MMM'), value: '10' },
    { text: formatDate(dayjs().month(10), 'MMM'), value: '11' },
    { text: formatDate(dayjs().month(11), 'MMM'), value: '12' },
  ],
];

const table = ref<HTMLTableElement>();
const tableCell = ref<HTMLTableCellElement[]>([]);
const show = ref<Show>('days');
const year = ref(
  props.range && (props.value[1] || props.value[0])
    ? extractDateComponent(props.value[1] || props.value[0], 'year')
    : typeof props.value === 'string'
      ? extractDateComponent(props.value, 'year')
      : formatDate(new Date().toDateString(), 'YYYY'),
);
const month = ref(
  props.range && (props.value[1] || props.value[0])
    ? extractDateComponent(props.value[1] || props.value[0], 'month')
    : typeof props.value === 'string'
      ? extractDateComponent(props.value, 'month')
      : formatDate(new Date().toDateString(), 'MM'),
);
const hoveredDate = ref<DateString>();

const calendarValue = computed<CalendarValue>(
  () => `${year.value}-${month.value}`,
);

const calendarDays = computed(() => {
  const calendarDate = dayjs(calendarValue.value);
  const previousMonth = formatDate(calendarValue.value, 'YYYY-MM', 'subtract');
  const nextMonth = formatDate(calendarValue.value, 'YYYY-MM', 'add');
  const endOfPreviousMonth = calendarDate.date(0);
  const dayOfWeek = endOfPreviousMonth.day();
  const daysInMonth = calendarDate.daysInMonth();
  const firstDayOffset = props.startWeekOnMonday
    ? dayOfWeek === 0
      ? 6
      : dayOfWeek
    : dayOfWeek !== 6
      ? dayOfWeek + 1
      : 0;
  const flatArray: CalendarDay[] = [
    // previous month days
    ...Array.from(
      { length: firstDayOffset },
      (_, i) => +endOfPreviousMonth.format('D') - firstDayOffset + i + 1,
    ).map((day) => ({
      date: formatDate(`${previousMonth}-${day}`, 'YYYY-MM-DD'),
      day,
      offset: true,
    })),
    // current month days
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => ({
      date: formatDate(`${calendarValue.value}-${day}`, 'YYYY-MM-DD'),
      day,
      offset: false,
    })),
    // next month days
    ...Array.from(
      { length: (7 - ((firstDayOffset + daysInMonth) % 7)) % 7 },
      (_, i) => i + 1,
    ).map((day) => ({
      date: formatDate(`${nextMonth}-${day}`, 'YYYY-MM-DD'),
      day,
      offset: true,
    })),
  ];

  // return 2D array
  return flatArray.reduce((acc: CalendarDay[][], cur, idx) => {
    if (idx % 7 === 0) acc.push([]);
    acc[acc.length - 1].push(cur);

    return acc;
  }, []);
});

const calendarYears = computed(() => {
  const flatArray: Year[] = [];

  for (let i = +year.value - 100; i <= +year.value + 100; i++) {
    flatArray.push((i + '') as Year);
  }

  // return 2D array
  return flatArray.reduce((acc: Year[][], cur, idx) => {
    if (idx % 3 === 0) acc.push([]);
    acc[acc.length - 1].push(cur);

    return acc;
  }, []);
});

function formatWeekday(day: number) {
  return dayjs().day(day).format('dd');
}

function getFormattedWeekday(value: number) {
  return props.startWeekOnMonday
    ? formatWeekday(value)
    : formatWeekday(value - 1);
}

function dateDifference(date: string, comparedDate: string) {
  return dayjs(date).diff(comparedDate);
}

function isYearRestricted(year: Year) {
  return (minYear && +minYear > +year) || (maxYear && +year > +maxYear);
}

function isMonthRestricted(date: CalendarValue) {
  return (
    (minYear &&
      minMonth &&
      dateDifference(date, `${minYear}-${minMonth}`) < 0) ||
    (maxYear && maxMonth && dateDifference(`${maxYear}-${maxMonth}`, date) < 0)
  );
}

function isDayRestricted(date: DateString) {
  return (
    (props.min && dateDifference(date, props.min) < 0) ||
    (props.max && dateDifference(props.max, date) < 0)
  );
}

function isDaySelected(date: DateString) {
  return props.range
    ? [props.value[0], props.value[1]].includes(date)
    : date === props.value;
}

function setShow(value: Show) {
  ['years', 'months'].includes(value) && show.value === value
    ? (show.value = 'days')
    : (show.value = value);
}

function setYear(value: Year) {
  year.value = value;
}

function setMonth(value: Month) {
  month.value = value;
}

function setCalendarValue(monthAdjustment: 'subtract' | 'add') {
  const newValue = formatDate(calendarValue.value, 'YYYY-MM', monthAdjustment);

  setYear(extractDateComponent(newValue, 'year'));
  setMonth(extractDateComponent(newValue, 'month'));
}

function scrollToYear() {
  if (!table.value) return;

  const tRow = tableCell.value[0].parentElement as HTMLTableRowElement;
  const tRowHeight = parseFloat(window.getComputedStyle(tRow).height);

  tRow.style.scrollMarginTop =
    -(
      (parseFloat(window.getComputedStyle(table.value).maxHeight) -
        (tRowHeight * 3 +
          parseFloat(window.getComputedStyle(tRow).marginBlockEnd) * 2)) /
        2 +
      tRowHeight / 2
    ) +
    0.5 +
    'px';

  tRow.scrollIntoView({ block: 'center' });
}

function getHoveredItems(date: DateString) {
  if (!props.range || !props.value[0]) return;

  if (props.value[1]) {
    return (
      dateDifference(date, props.value[0]) > 0 &&
      dateDifference(date, props.value[1]) < 0
    );
  }

  return (
    hoveredDate.value &&
    ((dateDifference(date, props.value[0]) > 0 &&
      dateDifference(date, hoveredDate.value) <= 0) ||
      (dateDifference(props.value[0], date) > 0 &&
        dateDifference(hoveredDate.value, date) <= 0))
  );
}

async function clickYearHeader() {
  setShow('years');
  await nextTick();
  scrollToYear();
}

function clickYear(year: Year) {
  setYear(year);
  setShow('days');
}

function clickMonth(month: Month) {
  setMonth(month);
  setShow('days');
}

function clickDay(date: DateString) {
  emit('change', date);
}
</script>

<template>
  <div class="sib-calendar">
    <div class="sib-calendar__header">
      <button
        class="sib-calendar__header__nav-button"
        :class="{
          'sib-calendar__header__nav-button--restricted': isMonthRestricted(
            formatDate(calendarValue, 'YYYY-MM', 'subtract'),
          ),
        }"
        :disabled="
          isMonthRestricted(formatDate(calendarValue, 'YYYY-MM', 'subtract'))
        "
        aria-label="Previous month"
        type="button"
        @click="setCalendarValue('subtract')"
      >
        <slot name="leftNavButtonIcon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="m15 18-6-6 6-6"
            ></path>
          </svg>
        </slot>
      </button>
      <div class="sib-calendar__header__date">
        <button
          class="sib-calendar__header__date__item"
          :aria-label="`${formatDate(calendarValue, 'MMMM')}-Open months overlay`"
          type="button"
          @click="setShow('months')"
        >
          {{ formatDate(calendarValue, 'MMMM') }}
        </button>
        <button
          class="sib-calendar__header__date__item"
          :aria-label="`${formatDate(calendarValue, 'YYYY')}-Open years overlay`"
          type="button"
          @click="clickYearHeader"
        >
          {{ formatDate(calendarValue, 'YYYY') }}
        </button>
      </div>
      <button
        class="sib-calendar__header__nav-button"
        :class="{
          'sib-calendar__header__nav-button--restricted': isMonthRestricted(
            formatDate(calendarValue, 'YYYY-MM', 'add'),
          ),
        }"
        :disabled="
          isMonthRestricted(formatDate(calendarValue, 'YYYY-MM', 'add'))
        "
        aria-label="Next month"
        type="button"
        @click="setCalendarValue('add')"
      >
        <slot name="rightNavButtonIcon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="m9 18 6-6-6-6"
            ></path>
          </svg>
        </slot>
      </button>
    </div>
    <table
      v-show="show === 'days'"
      class="sib-calendar__table"
      role="grid"
      aria-labelledby="Days calendar"
    >
      <thead class="sib-calendar__table__head" role="rowgroup">
        <tr class="sib-calendar__table__head__row" role="row">
          <th
            v-for="val in 7"
            :key="val"
            class="sib-calendar__table__head__item"
            :aria-label="getFormattedWeekday(val)"
            role="columnheader"
          >
            {{ getFormattedWeekday(val) }}
          </th>
        </tr>
      </thead>
      <tbody
        class="sib-calendar__table__body"
        role="rowgroup"
        @mouseleave="hoveredDate = undefined"
      >
        <tr
          v-for="(row, index) in calendarDays"
          :key="`row-${index}`"
          class="sib-calendar__table__body__row sib-calendar__table__body__row--days"
          role="row"
        >
          <td
            v-for="item in row"
            :key="item.date"
            class="sib-calendar__table__body__item sib-calendar__table__body__item--days"
            :class="{
              'sib-calendar__table__body__item--offset': item.offset,
              'sib-calendar__table__body__item--current':
                item.date === currentDate,
              'sib-calendar__table__body__item--restricted': isDayRestricted(
                item.date,
              ),
              'sib-calendar__table__body__item--selected': isDaySelected(
                item.date,
              ),
              'sib-calendar__table__body__item--hovered': getHoveredItems(
                item.date,
              ),
            }"
            role="gridcell"
            @mouseenter="hoveredDate = item.date"
          >
            <button
              :disabled="isDayRestricted(item.date)"
              type="button"
              @click="clickDay(item.date)"
            >
              {{ item.day }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <table
      v-show="show === 'months'"
      class="sib-calendar__table"
      role="grid"
      aria-labelledby="Months calendar"
    >
      <tbody class="sib-calendar__table__body" role="rowgroup">
        <tr
          v-for="(row, index) in calendarMonths"
          :key="`row-${index}`"
          class="sib-calendar__table__body__row sib-calendar__table__body__row--months"
          role="row"
        >
          <td
            v-for="item in row"
            :key="item.value"
            class="sib-calendar__table__body__item sib-calendar__table__body__item--months"
            :class="{
              'sib-calendar__table__body__item--restricted': isMonthRestricted(
                `${year}-${item.value}`,
              ),
              'sib-calendar__table__body__item--selected': item.value === month,
            }"
            role="gridcell"
          >
            <button
              :disabled="isMonthRestricted(`${year}-${item.value}`)"
              type="button"
              @click="clickMonth(item.value)"
            >
              {{ item.text }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <table
      v-show="show === 'years'"
      ref="table"
      class="sib-calendar__table sib-calendar__table--years"
      role="grid"
      aria-labelledby="Years calendar"
    >
      <tbody class="sib-calendar__table__body" role="rowgroup">
        <tr
          v-for="(row, index) in calendarYears"
          :key="`row-${index}`"
          class="sib-calendar__table__body__row sib-calendar__table__body__row--years"
          role="row"
        >
          <td
            v-for="item in row"
            :ref="item === year ? 'tableCell' : undefined"
            :key="item"
            class="sib-calendar__table__body__item sib-calendar__table__body__item--years"
            :class="{
              'sib-calendar__table__body__item--restricted':
                isYearRestricted(item),
              'sib-calendar__table__body__item--selected': item === year,
            }"
            role="gridcell"
          >
            <button
              :disabled="isYearRestricted(item)"
              type="button"
              @click="clickYear(item)"
            >
              {{ item }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
@function getTableInnerWidth() {
  @return calc(
    v-bind('styles.container.width') - v-bind('styles.container.paddingX') * 2
  );
}

@function getTableItemSize() {
  @return calc((getTableInnerWidth() - v-bind('styles.table.gap') * 6) / 7);
}

.sib-calendar {
  width: v-bind('styles.container.width');
  padding: v-bind('styles.container.paddingY') 0;
  border: v-bind('styles.container.border');
  border-radius: v-bind('styles.container.borderRadius');
  background-color: v-bind('styles.container.backgroundColor');
  box-shadow: v-bind('styles.container.boxShadow');
  user-select: none;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 v-bind('styles.container.paddingX');

    &__nav-button {
      display: flex;
      padding: v-bind('styles.navButton.padding');
      color: v-bind('styles.navButton.color');
      border: v-bind('styles.navButton.border');
      border-radius: v-bind('styles.navButton.borderRadius');
      background-color: v-bind('styles.navButton.backgroundColor');
      cursor: pointer;

      &:hover {
        background-color: v-bind('styles.navButton.hoverBackgroundColor');
      }

      &--restricted {
        opacity: v-bind('styles.navButton.restricted.opacity');
        pointer-events: none;
      }

      svg {
        width: v-bind('styles.navButton.iconSize');
        height: v-bind('styles.navButton.iconSize');
      }
    }

    &__date {
      display: flex;

      &__item {
        font: inherit;
        font-size: v-bind('styles.navDateItem.fontSize');
        font-weight: v-bind('styles.navDateItem.fontWeight');
        line-height: v-bind('styles.navDateItem.lineHeight');
        color: v-bind('styles.navDateItem.color');
        padding: v-bind('styles.navDateItem.paddingX')
          v-bind('styles.navDateItem.paddingY');
        border-radius: v-bind('styles.navDateItem.borderRadius');
        border: none;
        background-color: transparent;
        cursor: pointer;

        &:hover {
          background-color: v-bind('styles.navDateItem.hoverBackgroundColor');
        }
      }
    }
  }

  &__table {
    display: block;
    padding: 0 v-bind('styles.container.paddingX');
    margin-block-start: v-bind('styles.table.marginTop');
    border-collapse: collapse;

    &--years {
      overflow-y: auto;
      overflow-x: hidden;
      max-height: calc(
        getTableItemSize() * 4 + 3 *
          v-bind('styles.tableBodyRow.monthsYears.marginBottom')
      );
    }

    &__head {
      font-size: v-bind('styles.table.fontSize');
      font-weight: v-bind('styles.tableHead.fontWeight');

      &__row {
        display: flex;
        gap: v-bind('styles.table.gap');
      }

      &__item {
        display: flex;
        justify-content: center;
        align-items: center;
        width: getTableItemSize();
        height: getTableItemSize();
        padding: 0;
        color: v-bind('styles.tableHeadItem.color');
      }
    }

    &__body {
      font-size: v-bind('styles.table.fontSize');
      font-weight: v-bind('styles.tableBody.fontWeight');

      &__row {
        display: flex;
        gap: v-bind('styles.table.gap');

        &--days {
          margin-block-start: v-bind('styles.tableBodyRow.days.marginTop');
        }

        &--months,
        &--years {
          margin-block-end: v-bind(
            'styles.tableBodyRow.monthsYears.marginBottom'
          );

          &:last-of-type {
            margin-block-end: 0;
          }
        }
      }

      &__item {
        border-radius: v-bind('styles.tableBodyItem.borderRadius');
        padding: 0;
        color: v-bind('styles.tableBodyItem.color');

        button {
          font: inherit;
          text-align: center;
          color: inherit;
          width: 100%;
          height: 100%;
          padding: 0;
          border: none;
          background-color: transparent;
          cursor: pointer;
        }

        &:hover,
        &--hovered {
          background-color: v-bind('styles.tableBodyItem.hoverBackgroundColor');
        }

        &--days {
          width: getTableItemSize();
          height: getTableItemSize();
        }

        &--months,
        &--years {
          width: calc(
            (getTableInnerWidth() - v-bind('styles.table.gap') * 2) / 3
          );
          height: getTableItemSize();
        }

        &--offset {
          color: v-bind('styles.tableBodyItem.offset.color');
          opacity: v-bind('styles.tableBodyItem.offset.opacity');

          &:hover {
            color: v-bind('styles.tableBodyItem.offset.hoverColor');
          }
        }

        &--current {
          button {
            border: v-bind('styles.tableBodyItem.current.border');
            border-radius: v-bind('styles.tableBodyItem.borderRadius');
          }
        }

        &--restricted {
          color: v-bind('styles.tableBodyItem.restricted.color');
          opacity: v-bind('styles.tableBodyItem.restricted.opacity');
          pointer-events: none;
        }

        &--selected {
          color: v-bind('styles.tableBodyItem.selected.color');
          background-color: v-bind(
            'styles.tableBodyItem.selected.backgroundColor'
          );

          &:hover {
            color: v-bind('styles.tableBodyItem.selected.color');
            background-color: v-bind(
              'styles.tableBodyItem.selected.backgroundColor'
            );
          }
        }
      }
    }
  }
}
</style>
