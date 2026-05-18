const imageFolder = "Pictures/MainPageSliderPictures/";

const slideImages = [
  "BabasKitchen Statement.png",
  "MainCOurse11.jpeg",
  "MainCourse12.png",
  "MainCourse13.png",
  "MainCourse14.png",
  "mainCourse7.jpeg",
  "mainCourse5.jpeg",
  "mainCourse.jpg",
  "mainCourse2.jpg",
  "mainCourse3.jpg",
  "MainCourse01.png",
  "MainCourse02.png",
  "MainCourse03.png",
  "MainCourse04.png",
  "MainCourse05.png",
  "MainCourse06.png",
  "MainCourse07.png",
  "MainCourse08.png",
  "MainCourse09.png",
  "MainCourse10.png",
  "MainCourse15.png",
];

const slidesContainer = document.querySelector(".slides");

// Create slides dynamically
slideImages.forEach((img, index) => {
  const slideDiv = document.createElement("div");
  slideDiv.classList.add("slide");
  if (index === 0) slideDiv.classList.add("active");

  slideDiv.innerHTML = `
    <img src="${imageFolder + img}">
  `;

  slidesContainer.appendChild(slideDiv);
});

// IMPORTANT — get slides AFTER creating them
let currentSlide = 0;
let slides = document.querySelectorAll(".slide");

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });
}

// Auto slide
setInterval(() => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}, 3000);

// ARROWS
document.querySelector(".left-arrow").addEventListener("click", () => {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
});

document.querySelector(".right-arrow").addEventListener("click", () => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
});
