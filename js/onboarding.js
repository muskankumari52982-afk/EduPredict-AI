document.addEventListener("DOMContentLoaded", function () {

    const slides = document.getElementById("slides");

    const nextButtons =
        document.querySelectorAll(".next-btn");

    const previousBtn =
        document.getElementById("previousBtn");

    const dots =
        document.querySelectorAll(".dot");

    const progressBar =
        document.getElementById("progressBar");

    const stepText =
        document.getElementById("stepText");

    const goalCards =
        document.querySelectorAll(".goal-card");

    const finishBtn =
        document.getElementById("finishBtn");


    let currentSlide = 0;

    const totalSlides = 4;


    /* =====================================
       UPDATE SLIDER
    ===================================== */

    function updateSlider() {

        slides.style.transform =
            `translateX(-${currentSlide * 100}vw)`;


        /* STEP TEXT */

        stepText.textContent =
            `Step ${String(currentSlide + 1).padStart(2, "0")} of 04`;


        /* PROGRESS */

        const progress =
            ((currentSlide + 1) / totalSlides) * 100;

        progressBar.style.width =
            `${progress}%`;


        /* DOTS */

        dots.forEach(function (dot, index) {

            dot.classList.remove("active");

            if (index === currentSlide) {

                dot.classList.add("active");

            }

        });


        /* PREVIOUS BUTTON */

        previousBtn.disabled =
            currentSlide === 0;

    }


    /* =====================================
       NEXT BUTTONS
    ===================================== */

    nextButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            if (currentSlide < totalSlides - 1) {

                currentSlide++;

                updateSlider();

            }

        });

    });


    /* =====================================
       PREVIOUS BUTTON
    ===================================== */

    previousBtn.addEventListener("click", function () {

        if (currentSlide > 0) {

            currentSlide--;

            updateSlider();

        }

    });


    /* =====================================
       DOT NAVIGATION
    ===================================== */

    dots.forEach(function (dot, index) {

        dot.addEventListener("click", function () {

            currentSlide = index;

            updateSlider();

        });

    });


    /* =====================================
       GOAL SELECTION
    ===================================== */

    goalCards.forEach(function (card) {

        card.addEventListener("click", function () {

            goalCards.forEach(function (item) {

                item.classList.remove("selected");

            });


            card.classList.add("selected");


            localStorage.setItem(
                "userGoal",
                card.dataset.goal
            );

        });

    });


    /* =====================================
       SAVE USER DATA
    ===================================== */

    if (finishBtn) {

        finishBtn.addEventListener(
            "click",
            function () {

                /* -----------------------------
                   GET USER INFORMATION
                ----------------------------- */

                const name =
                    document.getElementById(
                        "studentName"
                    ).value.trim();


                const education =
                    document.getElementById(
                        "education"
                    ).value;


                const studyArea =
                    document.getElementById(
                        "studyArea"
                    ).value;


                const year =
                    document.getElementById(
                        "year"
                    ).value;


                /* -----------------------------
                   SAVE BASIC PROFILE
                ----------------------------- */

                localStorage.setItem(
                    "studentName",
                    name
                );


                localStorage.setItem(
                    "education",
                    education
                );


                localStorage.setItem(
                    "studyArea",
                    studyArea
                );


                localStorage.setItem(
                    "currentYear",
                    year
                );


                /* -----------------------------
                   SAVE GOAL
                ----------------------------- */

                const selectedGoal =
                    document.querySelector(
                        ".goal-card.selected"
                    );


                if (selectedGoal) {

                    localStorage.setItem(
                        "userGoal",
                        selectedGoal.dataset.goal
                    );

                }


                /* -----------------------------
                   MARK ONBOARDING COMPLETE
                ----------------------------- */

                localStorage.setItem(
                    "onboardingCompleted",
                    "true"
                );


                /* -----------------------------
                   GO TO ACADEMIC SETUP
                ----------------------------- */

                window.location.href =
                    "academic-setup.html";

            }
        );

    }


    /* =====================================
       INITIAL LOAD
    ===================================== */

    updateSlider();


    console.log(
        "EduPredict AI Onboarding loaded successfully."
    );

});