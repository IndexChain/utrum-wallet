import 'select2';

const $ = require('jquery');

export default {
  name: 'select2',
  props: ['options', 'value'],
  mounted: function () {
    const vm = this;
    $(this.$el)
      // init select2
      .select2({ data: this.options })
      .val(this.value)
      .trigger('change')
      // emit event on change.
      .on('change', function () {
        vm.$emit('input', this.value);
      });
    this.$root.$on('select2:open', () => {
      $(this.$el).select2('open');
    });
  },
  watch: {
    value: function (value) {
      // update value
      $(this.$el).val(value);
    },
    options: function (options) {
      // update options
      $(this.$el).empty().select2({ data: options });
    },
  },
  destroyed: function () {
    $(this.$el).off().select2('destroy');
  },
};
