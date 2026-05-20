const imageFolder = "Pictures/MainPageSliderPictures/";

const slideImages = [
  "BabasKitchen Statement.png",
  "01.png",
  "02.png",
  "03.png",
  "04.png",
  "05.png",
  "06.png",
  "07.jpg",
  "08.jpg",
  "09.jpg",
  "10.png",
  "11.png",
  "12.png",
  "13.jpeg",
  "14.png",
  "15.jpeg",
  "16.png",
  "17.jpeg",
  "18.png",
  "19.png",
  "20.png",
  "21.png",
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
