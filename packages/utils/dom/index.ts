const $ = document.querySelectorAll.bind(document);

function addClass(el: any, className: string | string[]) {
  if (!el) return;
  if (typeof className === "string") {
    className = [className];
  }
  const classList = el.classList;
  className.forEach((name) => {
    classList.add(name);
  });
}

function removeClass(el: any, className: string | string[]) {
  if (!el) return;
  if (typeof className === "string") {
    className = [className];
  }
  const classList = el.classList;
  className.forEach((name) => {
    classList.remove(name);
  });
}
// 获取或设置 Element 属性
function useElementAttribute(el: Element) {
  return {
    get: (key: string) => {
      return el.getAttribute(key);
    },
    set(key: string, value: any) {
      el.setAttribute(key, value);
    },
    remove(key: string) {
      el.removeAttribute(key);
    },
  };
}

export { $, addClass, removeClass, useElementAttribute };
