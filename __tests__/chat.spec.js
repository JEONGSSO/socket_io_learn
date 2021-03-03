var App = App || {};
describe("chat render Test", () => {
  it("modal Toggle", async () => {
    App.modalToggle();
    const maskWrap = document.querySelector(".shadow");

    expect(maskWrap.classList.contains("show")).toBe(true);
  });
});
