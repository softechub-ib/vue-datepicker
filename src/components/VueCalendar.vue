<script setup lang="ts">
import {
  CalendarDay,
  CalendarMonth,
  CalendarStylesProp,
  CalendarValue,
  DateString,
  DeepRequired,
  Month,
  Show,
  Year,
} from '@/types';
import { computed, nextTick, ref, watch } from 'vue';
import { extractDateComponent, formatDate } from '@/helpers';
import dayjs from '@/dayjs-with-locales';

type VueCalendarProps = {
  opened: boolean;
  value: string | string[];
  range: boolean;
  monthPicker: boolean;
  yearPicker: boolean;
  startWeekOnMonday: boolean;
  min: DateString | undefined;
  max: DateString | undefined;
  styles: DeepRequired<CalendarStylesProp>;
};

const props = defineProps<VueCalendarProps>();

const emit = defineEmits<{
  (e: 'change', value: DateString | CalendarValue | Year): void;
}>();

const currentDate = formatDate(new Date().toDateString(), 'YYYY-MM-DD');
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
const tableCell = ref<HTMLTableCellElement>();
const show = ref<Show>(getInitialShow());
const year = ref(getInitialYear());
const month = ref(getInitialMonth());
const hoveredDate = ref<DateString | CalendarValue | Year>();

const minYear = computed(
  () => props.min && extractDateComponent(props.min, 'year'),
);

const minMonth = computed(
  () => props.min && extractDateComponent(props.min, 'month'),
);

const maxYear = computed(
  () => props.max && extractDateComponent(props.max, 'year'),
);

const maxMonth = computed(
  () => props.max && extractDateComponent(props.max, 'month'),
);

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

function getInitialShow() {
  return props.yearPicker ? 'years' : props.monthPicker ? 'months' : 'days';
}

function getInitialYear() {
  return props.range && (props.value[1] || props.value[0])
    ? extractDateComponent(props.value[1] || props.value[0], 'year')
    : props.value && typeof props.value === 'string'
      ? extractDateComponent(props.value, 'year')
      : formatDate(new Date().toDateString(), 'YYYY');
}

function getInitialMonth() {
  return props.range && (props.value[1] || props.value[0])
    ? extractDateComponent(props.value[1] || props.value[0], 'month')
    : props.value && typeof props.value === 'string'
      ? extractDateComponent(props.value, 'month')
      : formatDate(new Date().toDateString(), 'MM');
}

function dateDifference(date: string, comparedDate: string) {
  return dayjs(date).diff(comparedDate);
}

function isNavButtonRestricted(adjustment: 'subtract' | 'add') {
  return props.monthPicker
    ? isYearRestricted(formatDate(year.value, 'YYYY', adjustment, 'year'))
    : isMonthRestricted(formatDate(calendarValue.value, 'YYYY-MM', adjustment));
}

function isYearRestricted(date: Year) {
  return (
    (minYear.value && +minYear.value > +date) ||
    (maxYear.value && +date > +maxYear.value)
  );
}

function isYearSelected(date: Year) {
  if (props.yearPicker) {
    return props.range
      ? [props.value[0], props.value[1]].includes(date)
      : date === props.value;
  }

  return date === year.value;
}

function isMonthRestricted(date: CalendarValue) {
  return (
    (minYear.value &&
      minMonth &&
      dateDifference(date, `${minYear.value}-${minMonth.value}`) < 0) ||
    (maxYear.value &&
      maxMonth &&
      dateDifference(`${maxYear.value}-${maxMonth.value}`, date) < 0)
  );
}

function isMonthSelected(date: Month) {
  if (props.monthPicker) {
    return props.range
      ? [props.value[0], props.value[1]].includes(`${year.value}-${date}`)
      : `${year.value}-${date}` === props.value;
  }

  return date === month.value;
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
  if (props.monthPicker) {
    show.value === 'years' ? (show.value = 'months') : (show.value = 'years');

    return;
  }

  ['years', 'months'].includes(value) && show.value === value
    ? (show.value = 'days')
    : (show.value = value);
}

function setYear(date: Year) {
  year.value = date;
}

function setMonth(date: Month) {
  month.value = date;
}

function setCalendarValue(adjustment: 'subtract' | 'add') {
  const newValue = props.monthPicker
    ? formatDate(year.value, 'YYYY', adjustment, 'year')
    : formatDate(calendarValue.value, 'YYYY-MM', adjustment);

  setYear(extractDateComponent(newValue, 'year'));

  if (props.monthPicker) return;

  setMonth(extractDateComponent(newValue, 'month'));
}

function setTableCell(date: Year, element: HTMLTableCellElement) {
  if (
    (!props.yearPicker && date === year.value) ||
    (props.range && (date === props.value[1] || date === props.value[0])) ||
    (!props.range && date === props.value) ||
    date === formatDate(currentDate, 'YYYY')
  ) {
    tableCell.value = element;
  }
}

function scrollToYear() {
  if (!table.value) return;

  const tRow = tableCell.value?.parentElement as HTMLTableRowElement;
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

function getHoveredItems(date: DateString | CalendarValue | Year) {
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

function clickYear(date: Year) {
  if (props.yearPicker) {
    emit('change', date);

    return;
  }

  setYear(date);

  if (props.monthPicker) {
    setShow('months');

    return;
  }

  setShow('days');
}

function clickMonth(date: Month) {
  if (props.monthPicker) {
    emit('change', `${year.value}-${date}`);

    return;
  }

  setMonth(date);
  setShow('days');
}

function clickDay(date: DateString) {
  emit('change', date);
}

watch(
  () => props.opened,
  async (newOpened) => {
    show.value = getInitialShow();
    year.value = getInitialYear();
    month.value = getInitialMonth();

    if (!props.yearPicker || !newOpened) return;

    await nextTick();
    scrollToYear();
  },
);
</script>

<template>
  <div class="sib-calendar">
    <div v-if="!props.yearPicker" class="sib-calendar__header">
      <button
        class="sib-calendar__header__button"
        :class="{
          'sib-calendar__header__button--restricted':
            isNavButtonRestricted('subtract'),
          'sib-calendar__header__button--invisible':
            (!props.monthPicker && show === 'months') || show === 'years',
        }"
        :disabled="isNavButtonRestricted('subtract')"
        :aria-label="props.monthPicker ? 'Previous year' : 'Previous month'"
        type="button"
        @click="setCalendarValue('subtract')"
      >
        <slot name="leftHeaderButtonIcon">
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
          v-if="!props.monthPicker"
          class="sib-calendar__header__date__item"
          :aria-label="`${formatDate(calendarValue, 'MMMM')}-Open/close months overlay`"
          type="button"
          @click="setShow('months')"
        >
          {{ formatDate(calendarValue, 'MMMM') }}
        </button>
        <button
          class="sib-calendar__header__date__item"
          :aria-label="`${formatDate(year, 'YYYY')}-Open/close years overlay`"
          type="button"
          @click="clickYearHeader"
        >
          {{ formatDate(year, 'YYYY') }}
        </button>
      </div>
      <button
        class="sib-calendar__header__button"
        :class="{
          'sib-calendar__header__button--restricted':
            isNavButtonRestricted('add'),
          'sib-calendar__header__button--invisible':
            (!props.monthPicker && show === 'months') || show === 'years',
        }"
        :disabled="isNavButtonRestricted('add')"
        :aria-label="props.monthPicker ? 'Next year' : 'Next month'"
        type="button"
        @click="setCalendarValue('add')"
      >
        <slot name="rightHeaderButtonIcon">
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
        @mouseleave="
          !props.monthPicker && !props.yearPicker && (hoveredDate = undefined)
        "
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
              :data-test-id="item.date"
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
      <tbody
        class="sib-calendar__table__body"
        role="rowgroup"
        @mouseleave="props.monthPicker && (hoveredDate = undefined)"
      >
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
              'sib-calendar__table__body__item--current':
                props.monthPicker &&
                `${year}-${item.value}` === formatDate(currentDate, 'YYYY-MM'),
              'sib-calendar__table__body__item--restricted': isMonthRestricted(
                `${year}-${item.value}`,
              ),
              'sib-calendar__table__body__item--selected': isMonthSelected(
                item.value,
              ),
              'sib-calendar__table__body__item--hovered':
                props.monthPicker && getHoveredItems(`${year}-${item.value}`),
            }"
            role="gridcell"
            @mouseenter="
              props.monthPicker && (hoveredDate = `${year}-${item.value}`)
            "
          >
            <button
              :disabled="isMonthRestricted(`${year}-${item.value}`)"
              :data-test-id="`${year}-${item.value}`"
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
      <tbody
        class="sib-calendar__table__body"
        role="rowgroup"
        @mouseleave="props.yearPicker && (hoveredDate = undefined)"
      >
        <tr
          v-for="(row, index) in calendarYears"
          :key="`row-${index}`"
          class="sib-calendar__table__body__row sib-calendar__table__body__row--years"
          role="row"
        >
          <td
            v-for="item in row"
            :ref="
              (element) => setTableCell(item, element as HTMLTableCellElement)
            "
            :key="item"
            class="sib-calendar__table__body__item sib-calendar__table__body__item--years"
            :class="{
              'sib-calendar__table__body__item--current':
                props.yearPicker && item === formatDate(currentDate, 'YYYY'),
              'sib-calendar__table__body__item--restricted':
                isYearRestricted(item),
              'sib-calendar__table__body__item--selected': isYearSelected(item),
              'sib-calendar__table__body__item--hovered':
                props.yearPicker && getHoveredItems(item),
            }"
            role="gridcell"
            @mouseenter="props.yearPicker && (hoveredDate = item)"
          >
            <button
              :disabled="isYearRestricted(item)"
              :data-test-id="item"
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
    margin-block-end: v-bind('styles.header.marginBottom');

    &__button {
      display: flex;
      padding: v-bind('styles.headerButton.padding');
      color: v-bind('styles.headerButton.color');
      border: v-bind('styles.headerButton.border');
      border-radius: v-bind('styles.headerButton.borderRadius');
      background-color: v-bind('styles.headerButton.backgroundColor');
      cursor: pointer;

      &:hover {
        background-color: v-bind('styles.headerButton.hoverBackgroundColor');
      }

      &--restricted {
        opacity: v-bind('styles.headerButton.restricted.opacity');
        pointer-events: none;
      }

      &--invisible {
        visibility: hidden;
        pointer-events: none;
      }

      svg {
        width: v-bind('styles.headerButton.iconSize');
        height: v-bind('styles.headerButton.iconSize');
      }
    }

    &__date {
      display: flex;

      &__item {
        font: inherit;
        font-size: v-bind('styles.headerDateItem.fontSize');
        font-weight: v-bind('styles.headerDateItem.fontWeight');
        line-height: v-bind('styles.headerDateItem.lineHeight');
        color: v-bind('styles.headerDateItem.color');
        padding: v-bind('styles.headerDateItem.paddingX')
          v-bind('styles.headerDateItem.paddingY');
        border-radius: v-bind('styles.headerDateItem.borderRadius');
        border: none;
        background-color: transparent;
        cursor: pointer;

        &:hover {
          background-color: v-bind(
            'styles.headerDateItem.hoverBackgroundColor'
          );
        }
      }
    }
  }

  &__table {
    display: block;
    padding: 0 v-bind('styles.container.paddingX');
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
