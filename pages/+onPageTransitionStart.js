// import type { OnPageTransitionStartAsync } from "vike/types";

export const onPageTransitionStart = async () => {
  console.log("Page transition start");
  document.querySelector("body")?.classList.add("page-is-transitioning");
};
