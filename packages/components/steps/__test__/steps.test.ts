import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { describe, expect, test } from "vitest";
import Steps from "../src/steps.vue";
import Step from "../src/step.vue";

const _mount = (template: string) =>
  mount(
    {
      components: {
        steps: Steps,
        step: Step,
      },
      template,
    },
    {
      attachTo: document.body,
      global: {
        provide: {
          WelSteps: {},
        },
      },
    }
  );

describe("Steps.vue", () => {
  test("render", () => {
    const wrapper = _mount(`
      <steps>
        <step />
        <step />
        <step />
      </steps>
    `);
    expect(wrapper.findAll(".wel-step").length).toBe(3);
    expect(wrapper.classes()).toContain("is-vertical");
    expect(wrapper.find(".wel-step").classes()).toContain("is-horizontal");
  });

  test("status", () => {
    const wrapper = _mount(`
      <steps>
        <step status="default" />
        <step status="success" />
        <step status="warning" />
        <step status="danger" />
      </steps>
    `);
    expect(
      wrapper.findAll(".wel-step")[0].find(".icon-line").classes()
    ).toContain("is-default");
    expect(
      wrapper.findAll(".wel-step")[1].find(".icon-line").classes()
    ).toContain("is-success");
    expect(
      wrapper.findAll(".wel-step")[2].find(".icon-line").classes()
    ).toContain("is-warning");
    expect(
      wrapper.findAll(".wel-step")[3].find(".icon-line").classes()
    ).toContain("is-danger");
  });

  test("line style", async () => {
    const wrapper = _mount(`
      <steps>
        <step />
        <step />
        <step />
      </steps>
    `);
    await nextTick();
    expect(
      wrapper.findAll(".wel-step")[0].find(".icon-line").classes()
    ).toContain("is-first");
    expect(
      wrapper.findAll(".wel-step")[2].find(".icon-line").classes()
    ).toContain("is-last");
  });
});
