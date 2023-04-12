export const listProps = {
  data: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    required: true
  },
  gutter: {
    type: Number,
    default: 8
  }
}
export const listEmits = ['update:loading']
