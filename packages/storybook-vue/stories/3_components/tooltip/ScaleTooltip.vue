<template>
  <div style="padding: 30px 30px 30px 70px">
    <scale-tooltip
      :content="content"
      :placement="placement"
      :disabled="disabled"
      :distance="distance"
      :open="open"
      :skidding="skidding"
      :trigger="trigger"
      :flip="flip"
      :prevent-overflow="preventOverflow"
    >
      <slot name="content"></slot>
      <scale-button>Hover me</scale-button>
    </scale-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    content: { type: String },
    placement: { type: String },
    disabled: { type: Boolean },
    distance: { type: Number },
    open: { type: Boolean },
    skidding: { type: Boolean },
    trigger: { type: String },
    flip: { type: Boolean },
    preventOverflow: { type: Boolean },
  },
};
</script>
