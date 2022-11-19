import { Ref } from "vue";

export interface InjectSteps {
  steps: Ref<any[]>;
  props: any;
}

export const stepProps = {
  status: {
    validator(value) {
      // The value must match one of these strings
      return ["default", "success", "warning", "danger"].includes(value);
    },
    default: "default",
  },
};
