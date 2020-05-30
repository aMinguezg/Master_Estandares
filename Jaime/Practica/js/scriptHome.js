$(document).ready(function () {


   $(".fotoMosaico").click(function () {
      window.location = "ficha.html"
   })

   const imgs = document.querySelectorAll('[data-src]');

   const intersectionObserverOptions = {
      rootMargin: '0px 0px 50px 0px',
      threshold: 0
   };

   var observer = new IntersectionObserver(function (entries, self) {
      entries.forEach(entry => {
         if (entry.isIntersecting) {

            entry.target.src = entry.target.dataset.src
            entry.target.classList.remove("lazy");

            self.unobserve(entry.target);
         }
      });
   }, intersectionObserverOptions);

   imgs.forEach(img => {
      observer.observe(img);
   });

});