// import type { OnPageTransitionEndAsync } from "vike/types";

export const onPageTransitionEnd = async () => {
  console.log("Page transition end");
  document.querySelector("body")?.classList.remove("page-is-transitioning");
};
