import { describe, expect, it } from 'vitest';
import VueDatePicker from '@/components/VueDatePicker.vue';
import { mount } from '@vue/test-utils';

const mountDatepicker = (props: any = { modelValue: '' }) =>
  mount(VueDatePicker, { props });

describe('VueDatePicker', () => {
  it('Should display correct input value for a single date', () => {
    const wrapper = mountDatepicker({
      modelValue: '2028-02-15',
    });

    const input = wrapper.find('.sib-datepicker__input');

    expect((input.element as HTMLInputElement).value).toEqual('15. Feb 2028');
  });

  it('Should display correct input value for a single month date', () => {
    const wrapper = mountDatepicker({
      modelValue: '2028-02',
      monthPicker: true,
    });

    const input = wrapper.find('.sib-datepicker__input');

    expect((input.element as HTMLInputElement).value).toEqual('Feb 2028');
  });

  it('Should display correct input value for a single year date', () => {
    const wrapper = mountDatepicker({
      modelValue: '2028',
      yearPicker: true,
    });

    const input = wrapper.find('.sib-datepicker__input');

    expect((input.element as HTMLInputElement).value).toEqual('2028');
  });

  it('Should display correct input value for a date range', () => {
    const wrapper = mountDatepicker({
      modelValue: ['2028-02-15', '2028-02-20'],
      range: true,
    });

    const input = wrapper.find('.sib-datepicker__input');

    expect((input.element as HTMLInputElement).value).toEqual(
      '15. Feb 2028 - 20. Feb 2028',
    );
  });

  it('Should display empty input value for invalid date', () => {
    const wrapper = mountDatepicker({
      modelValue: 'invalid date',
    });

    const input = wrapper.find('.sib-datepicker__input');

    expect((input.element as HTMLInputElement).value).toEqual('');
  });

  it('Should display correct size class for a datepicker', () => {
    const wrapper = mountDatepicker({
      modelValue: '2028-02-15',
      size: 'small',
    });

    const datepicker = wrapper.find('.sib-datepicker--small');

    expect(datepicker.exists()).toBe(true);
  });

  it('Should not display clear icon when clearable is false', () => {
    const wrapper = mountDatepicker({
      modelValue: '2028-02-15',
      clearable: false,
    });

    const clear = wrapper.find('.sib-datepicker__selection__clear-icon');

    expect(clear.exists()).toBe(false);
  });

  it('Should not display clear icon when datepicker is disabled', () => {
    const wrapper = mountDatepicker({
      modelValue: '2028-02-15',
      disabled: true,
    });

    const clear = wrapper.find('.sib-datepicker__selection__clear-icon');

    expect(clear.exists()).toBe(false);
  });

  it('Datepicker should have correct class when disabled', () => {
    const wrapper = mountDatepicker({
      modelValue: '2028-02-15',
      disabled: true,
    });

    const datepicker = wrapper.find('.sib-datepicker--disabled');

    expect(datepicker.exists()).toBe(true);
  });

  it('Datepicker should have correct class when there is an error', () => {
    const wrapper = mountDatepicker({
      modelValue: '2028-02-15',
      error: true,
    });

    const datepicker = wrapper.find('.sib-datepicker--error');

    expect(datepicker.exists()).toBe(true);
  });

  it('Should show calendar when datepicker is clicked', async () => {
    const wrapper = mountDatepicker({
      modelValue: '2028-02-15',
    });

    const datepicker = wrapper.find('.sib-datepicker');
    await datepicker.trigger('click');

    const calendar = wrapper.find('.sib-datepicker__calendar-wrapper');

    expect((calendar.element as HTMLDivElement).style.display).toEqual('');
  });

  it('Should close calendar when is clicked outside', async () => {
    const wrapper = mountDatepicker({
      modelValue: ['2028-02-15'],
    });

    const datepicker = wrapper.find('.sib-datepicker');
    await datepicker.trigger('click');

    const event = new MouseEvent('click', { bubbles: true });
    document.body.dispatchEvent(event);

    await wrapper.vm.$nextTick();

    const calendar = wrapper.find('.sib-datepicker__calendar-wrapper');

    expect((calendar.element as HTMLDivElement).style.display).toEqual('none');
  });

  it('Click on clear icon should emit correct value', async () => {
    const wrapper = mountDatepicker({
      modelValue: '2028-02-15',
    });

    const clear = wrapper.find('.sib-datepicker__selection__clear-icon');
    await clear.trigger('click');

    expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual('');
  });

  it('Click on calendar day should emit correct value', async () => {
    const wrapper = mountDatepicker({
      modelValue: ['2028-02-15'],
      range: true,
    });

    const datepicker = wrapper.find('.sib-datepicker');
    await datepicker.trigger('click');

    const day = wrapper.find('[data-test-id="2028-02-25"]');
    await day.trigger('click');

    expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual([
      '2028-02-15',
      '2028-02-25',
    ]);
  });

  it('Click on calendar month should emit correct value', async () => {
    Element.prototype.scrollIntoView = () => {};
    const wrapper = mountDatepicker({
      modelValue: ['2028-02'],
      range: true,
      monthPicker: true,
    });

    const datepicker = wrapper.find('.sib-datepicker');
    await datepicker.trigger('click');

    const dateItems = wrapper.find('.sib-calendar__header__date__item');

    await dateItems.trigger('click');
    const year = wrapper.find('[data-test-id="2035"]');
    await year.trigger('click');

    const month = wrapper.find('[data-test-id="2035-04"]');
    await month.trigger('click');

    expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual([
      '2028-02',
      '2035-04',
    ]);
  });

  it('Click on calendar year should emit correct value', async () => {
    Element.prototype.scrollIntoView = () => {};
    const wrapper = mountDatepicker({
      modelValue: ['2028'],
      range: true,
      yearPicker: true,
    });

    const datepicker = wrapper.find('.sib-datepicker');
    await datepicker.trigger('click');

    const year = wrapper.find('[data-test-id="2035"]');
    await year.trigger('click');

    expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual([
      '2028',
      '2035',
    ]);
  });
});
