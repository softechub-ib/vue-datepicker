import { describe, expect, it } from 'vitest';
import VueDatePicker from '@/components/VueDatePicker.vue';
import { mount } from '@vue/test-utils';

const mountDatepicker = (props: any = { modelValue: '' }) =>
  mount(VueDatePicker, { props });

describe('VueCalendar', () => {
  it('Should display correct date items for a single date', () => {
    const wrapper = mountDatepicker({
      modelValue: '2028-02-15',
    });

    const headerDate = wrapper.find('.sib-calendar__header__date');

    expect(headerDate.html()).toContain('February');
    expect(headerDate.html()).toContain('2028');
  });

  it('Should display correct date items for a date range', () => {
    const wrapper = mountDatepicker({
      modelValue: ['2028-02-15', '2030-03-20'],
      range: true,
    });

    const headerDate = wrapper.find('.sib-calendar__header__date');

    expect(headerDate.html()).toContain('March');
    expect(headerDate.html()).toContain('2030');
  });

  it('Should display correct weekday items when startWeekOnMonday is set', () => {
    const wrapper = mountDatepicker({
      modelValue: '2028-02-15',
      startWeekOnMonday: true,
    });

    const tableHeadItem = wrapper.findAll('.sib-calendar__table__head__item');

    expect(tableHeadItem[0].text()).toEqual('Mo');
    expect(tableHeadItem[6].text()).toEqual('Su');
  });

  it('Should display correct calendar table', () => {
    const wrapper = mountDatepicker({
      modelValue: '2028-02',
      monthPicker: true,
    });

    const table = wrapper.find('[aria-labelledby="Months calendar"]');

    expect((table.element as HTMLTableElement).style.display).toBe('');
  });

  it('Should display correct calendar days', () => {
    const wrapper = mountDatepicker({
      modelValue: '2028-02-15',
    });

    const firstDay = wrapper.find('[data-test-id="2028-01-30"]');
    const lastDay = wrapper.find('[data-test-id="2028-03-04"]');

    expect(firstDay.exists()).toBe(true);
    expect(lastDay.exists()).toBe(true);
  });

  it('Should display correct calendar months', () => {
    const wrapper = mountDatepicker({
      modelValue: '2028-02-15',
      monthPicker: true,
    });

    const months = wrapper.findAll('.sib-calendar__table__body__item--months');

    expect(months[0].html()).toContain('Jan');
    expect(months[11].html()).toContain('Dec');
  });

  it('Should display correct calendar years', () => {
    const wrapper = mountDatepicker({
      modelValue: '2028-02-15',
      yearPicker: true,
    });

    const months = wrapper.findAll('.sib-calendar__table__body__item--years');

    expect(months[0].html()).toContain('1928');
    expect(months[200].html()).toContain('2128');
  });

  it('Should select correct calendar day for a single date', () => {
    const wrapper = mountDatepicker({
      modelValue: '2028-02-15',
    });

    const selectedDay = wrapper.find(
      '.sib-calendar__table__body__item--selected',
    );

    expect(selectedDay.html()).toContain('data-test-id="2028-02-15"');
  });

  it('Should select correct calendar days for a date range', () => {
    const wrapper = mountDatepicker({
      modelValue: ['2028-02-15', '2028-02-20'],
      range: true,
    });

    const selectedDays = wrapper.findAll(
      '.sib-calendar__table__body__item--selected',
    );

    expect(selectedDays[0].html()).toContain('data-test-id="2028-02-15"');
    expect(selectedDays[1].html()).toContain('data-test-id="2028-02-20"');
  });

  it('Should select correct calendar months for a date range', () => {
    const wrapper = mountDatepicker({
      modelValue: ['2028-02', '2028-06'],
      range: true,
      monthPicker: true,
    });

    const selectedMonths = wrapper.findAll(
      '.sib-calendar__table__body__item--selected',
    );

    expect(selectedMonths[0].html()).toContain('data-test-id="2028-02"');
    expect(selectedMonths[1].html()).toContain('data-test-id="2028-06"');
  });

  it('Should select correct calendar years for a date range', () => {
    const wrapper = mountDatepicker({
      modelValue: ['2028', '2032'],
      range: true,
      yearPicker: true,
    });

    const selectedYears = wrapper.findAll(
      '.sib-calendar__table__body__item--selected',
    );

    expect(selectedYears[0].html()).toContain('data-test-id="2028"');
    expect(selectedYears[1].html()).toContain('data-test-id="2032"');
  });

  it('Should switch to correct month once header button is clicked', async () => {
    const wrapper = mountDatepicker({
      modelValue: '2028-02-15',
    });

    const datepicker = wrapper.find('.sib-datepicker');
    await datepicker.trigger('click');

    const buttons = wrapper.findAll('.sib-calendar__header__button');
    await buttons[1].trigger('click');
    await buttons[1].trigger('click');
    await buttons[0].trigger('click');

    const headerDate = wrapper.find('.sib-calendar__header__date');
    const firstDayOfMonth = wrapper.find('[data-test-id="2028-03-01"]');

    expect(headerDate.html()).toContain('March');
    expect(firstDayOfMonth.exists()).toBe(true);
  });

  it('Should switch to correct calendar date once selected through date items', async () => {
    Element.prototype.scrollIntoView = () => {};
    const wrapper = mountDatepicker({
      modelValue: '2028-02-15',
    });

    const datepicker = wrapper.find('.sib-datepicker');
    await datepicker.trigger('click');

    const dateItems = wrapper.findAll('.sib-calendar__header__date__item');

    await dateItems[1].trigger('click');
    const selectYear = wrapper.find('[data-test-id="2032"]');
    await selectYear.trigger('click');

    await dateItems[0].trigger('click');
    const selectMonth = wrapper.find('[data-test-id="2032-06"]');
    await selectMonth.trigger('click');

    const headerDate = wrapper.find('.sib-calendar__header__date');
    const firstDayOfMonth = wrapper.find('[data-test-id="2032-06-01"]');

    expect(headerDate.html()).toContain('June');
    expect(headerDate.html()).toContain('2032');
    expect(firstDayOfMonth.exists()).toBe(true);
  });

  it('Should restrict correct header button when min is set', () => {
    const wrapper = mountDatepicker({
      modelValue: '2028-02-15',
      min: '2028-02-01',
    });

    const buttons = wrapper.findAll('.sib-calendar__header__button');

    expect(buttons[0].classes('sib-calendar__header__button--restricted')).toBe(
      true,
    );
  });

  it('Should restrict correct header button when max is set', () => {
    const wrapper = mountDatepicker({
      modelValue: '2028-02-15',
      max: '2028-02-29',
    });

    const buttons = wrapper.findAll('.sib-calendar__header__button');

    expect(buttons[1].classes('sib-calendar__header__button--restricted')).toBe(
      true,
    );
  });

  it('Should restrict correct days when min is set', () => {
    const wrapper = mountDatepicker({
      modelValue: '2028-02-15',
      min: '2028-02-05',
    });

    const days = wrapper.findAll('.sib-calendar__table__body__item--days');

    expect(days[5].classes('sib-calendar__table__body__item--restricted')).toBe(
      true,
    );
    expect(days[6].classes('sib-calendar__table__body__item--restricted')).toBe(
      false,
    );
  });

  it('Should restrict correct days when max is set', () => {
    const wrapper = mountDatepicker({
      modelValue: '2028-02-15',
      max: '2028-02-25',
    });

    const days = wrapper.findAll('.sib-calendar__table__body__item--days');

    expect(
      days[26].classes('sib-calendar__table__body__item--restricted'),
    ).toBe(false);
    expect(
      days[27].classes('sib-calendar__table__body__item--restricted'),
    ).toBe(true);
  });

  it('Should restrict correct months when min is set', () => {
    const wrapper = mountDatepicker({
      modelValue: '2028-02-15',
      monthPicker: true,
      min: '2028-02-01',
    });

    const months = wrapper.findAll('.sib-calendar__table__body__item--months');

    expect(
      months[0].classes('sib-calendar__table__body__item--restricted'),
    ).toBe(true);
    expect(
      months[1].classes('sib-calendar__table__body__item--restricted'),
    ).toBe(false);
  });

  it('Should restrict correct months when max is set', () => {
    const wrapper = mountDatepicker({
      modelValue: '2028-02-15',
      monthPicker: true,
      max: '2028-02-29',
    });

    const months = wrapper.findAll('.sib-calendar__table__body__item--months');

    expect(
      months[1].classes('sib-calendar__table__body__item--restricted'),
    ).toBe(false);
    expect(
      months[2].classes('sib-calendar__table__body__item--restricted'),
    ).toBe(true);
  });

  it('Should restrict correct years when min is set', () => {
    const wrapper = mountDatepicker({
      modelValue: '2028-02-15',
      yearPicker: true,
      min: '2028-01-01',
    });

    const years = wrapper.findAll('.sib-calendar__table__body__item--years');

    expect(
      years[99].classes('sib-calendar__table__body__item--restricted'),
    ).toBe(true);
    expect(
      years[100].classes('sib-calendar__table__body__item--restricted'),
    ).toBe(false);
  });

  it('Should restrict correct years when max is set', () => {
    const wrapper = mountDatepicker({
      modelValue: '2028-02-15',
      yearPicker: true,
      max: '2028-12-31',
    });

    const years = wrapper.findAll('.sib-calendar__table__body__item--years');

    expect(
      years[100].classes('sib-calendar__table__body__item--restricted'),
    ).toBe(false);
    expect(
      years[101].classes('sib-calendar__table__body__item--restricted'),
    ).toBe(true);
  });
});
