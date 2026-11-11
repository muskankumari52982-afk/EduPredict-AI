document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       EDU PREDICT AI
       ACADEMIC PROFILE SETUP
       REAL PROFILE DATA HANDLER
       ========================================================= */


    /* =========================================================
       1. STATE
       ========================================================= */

    let selectedSubjects = {};

    let selectedYear = "";

    let preparationLevel = "";

    let attendance = "";

    let consistency = "";

    let goals = [];

    let studyHours = "";


    /* =========================================================
       2. HELPERS
       ========================================================= */

    function getText(element) {

        return (
            element?.textContent?.trim() ||
            ""
        );

    }


    function normalizeText(value) {

        return String(value || "")
            .trim()
            .toLowerCase();

    }


    function getSelectedValue(input) {

        if (!input) {
            return "";
        }

        return (
            input.value ||
            input.dataset.value ||
            input.dataset.subject ||
            getText(input.parentElement)
        ).trim();

    }


    /* =========================================================
       3. SAVE FINAL PROFILE
       =========================================================

       IMPORTANT:

       Profile is considered complete ONLY when
       "Generate My Dashboard" is clicked.
       ========================================================= */

    function saveProfile() {

        const studentName =
            localStorage.getItem(
                "studentName"
            ) || "Student";


        const profile = {

            name: studentName,

            education:
                localStorage.getItem(
                    "education"
                ) || "",

            studyArea:
                localStorage.getItem(
                    "studyArea"
                ) || "",

            year: selectedYear,

            subjects: {
                ...selectedSubjects
            },

            preparationLevel:
                preparationLevel,

            attendance:
                attendance,

            consistency:
                consistency,

            goals: [
                ...goals
            ],

            studyHours:
                studyHours,

            setupCompleted: true,

            updatedAt:
                new Date().toISOString()

        };


        try {

            localStorage.setItem(
                "eduPredictProfile",
                JSON.stringify(profile)
            );

            console.log(
                "======================================"
            );

            console.log(
                "EduPredict profile saved successfully"
            );

            console.log(
                profile
            );

            console.log(
                "======================================"
            );

        } catch (error) {

            console.error(
                "Could not save EduPredict profile:",
                error
            );

        }

    }


    /* =========================================================
       4. YEAR SELECTION
       ========================================================= */

    function setupYearSelection() {

        const yearCards =
            document.querySelectorAll(
                "[data-value]"
            );


        yearCards.forEach(
            function (card) {

                const value =
                    String(
                        card.dataset.value || ""
                    );


                const normalized =
                    normalizeText(value);


                const isYear =
                    normalized.includes(
                        "first year"
                    ) ||
                    normalized.includes(
                        "second year"
                    ) ||
                    normalized.includes(
                        "third year"
                    ) ||
                    normalized.includes(
                        "final year"
                    );


                if (!isYear) {
                    return;
                }


                card.addEventListener(
                    "click",
                    function () {

                        selectedYear =
                            value;


                        const parent =
                            card.parentElement;


                        if (parent) {

                            parent
                                .querySelectorAll(
                                    ".selected"
                                )
                                .forEach(
                                    function (item) {

                                        item.classList.remove(
                                            "selected"
                                        );

                                    }
                                );

                        }


                        card.classList.add(
                            "selected"
                        );


                        console.log(
                            "Selected year:",
                            selectedYear
                        );

                    }
                );

            }
        );

    }


    /* =========================================================
       5. SUBJECT SELECTION
       =========================================================

       Works with:

       <input type="checkbox"
              name="subjects"
              value="DSA">

       AND dynamically added custom subjects.
       ========================================================= */

    function setupSubjectSelection() {

        const subjectInputs =
            document.querySelectorAll(
                'input[name="subjects"]'
            );


        subjectInputs.forEach(
            function (input) {

                input.addEventListener(
                    "change",
                    function () {

                        const subject =
                            getSelectedValue(
                                input
                            );


                        if (!subject) {
                            return;
                        }


                        /* =========================
                           SUBJECT SELECTED
                           ========================= */

                        if (input.checked) {

                            /*
                               IMPORTANT:

                               Use hasOwnProperty instead
                               of checking the value directly.

                               This allows 0% to work.
                            */

                            if (
                                !Object.prototype.hasOwnProperty.call(
                                    selectedSubjects,
                                    subject
                                )
                            ) {

                                selectedSubjects[
                                    subject
                                ] = 0;

                            }

                        }


                        /* =========================
                           SUBJECT DESELECTED
                           ========================= */

                        else {

                            delete selectedSubjects[
                                subject
                            ];

                        }


                        createCompletionOptions();


                        console.log(
                            "Selected subjects:",
                            selectedSubjects
                        );

                    }
                );

            }
        );

    }


    /* =========================================================
       6. DYNAMIC SUBJECT LISTENER
       =========================================================

       Custom subjects are added after page load.

       This event delegation ensures that their
       checkbox also works.
       ========================================================= */

    const subjectGrid =
        document.querySelector(
            "#subjectGrid"
        );


    if (subjectGrid) {

        subjectGrid.addEventListener(
            "change",
            function (event) {

                const input =
                    event.target;


                if (
                    !input.matches(
                        'input[name="subjects"]'
                    )
                ) {

                    return;

                }


                const subject =
                    getSelectedValue(
                        input
                    );


                if (!subject) {
                    return;
                }


                if (input.checked) {

                    if (
                        !Object.prototype.hasOwnProperty.call(
                            selectedSubjects,
                            subject
                        )
                    ) {

                        selectedSubjects[
                            subject
                        ] = 0;

                    }

                } else {

                    delete selectedSubjects[
                        subject
                    ];

                }


                createCompletionOptions();


                console.log(
                    "Updated subjects:",
                    selectedSubjects
                );

            }
        );

    }


    /* =========================================================
       7. SUBJECT COMPLETION
       ========================================================= */

    function createCompletionOptions() {

        const container =
            document.querySelector(
                "#completionContainer"
            ) ||
            document.querySelector(
                ".completion-container"
            ) ||
            document.querySelector(
                ".subject-completion"
            );


        if (!container) {
            return;
        }


        container.innerHTML = "";


        const subjects =
            Object.keys(
                selectedSubjects
            );


        /* =========================
           NO SUBJECT
           ========================= */

        if (
            subjects.length === 0
        ) {

            container.innerHTML = `
                <div class="empty-completion">
                    ✨ Select subjects above to create
                    your personalized completion profile.
                </div>
            `;

            return;

        }


        /* =========================
           CREATE COMPLETION CARD
           ========================= */

        subjects.forEach(
            function (subject) {

                const current =
                    Number(
                        selectedSubjects[
                            subject
                        ] ?? 0
                    );


                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "completion-item";


                item.innerHTML = `

                    <div class="completion-header">

                        <strong>
                            ${escapeHTML(subject)}
                        </strong>

                        <span class="completion-value">
                            ${current}%
                        </span>

                    </div>


                    <div class="completion-options">

                        <button
                            type="button"
                            data-percent="0">

                            0%

                        </button>


                        <button
                            type="button"
                            data-percent="25">

                            25%

                        </button>


                        <button
                            type="button"
                            data-percent="50">

                            50%

                        </button>


                        <button
                            type="button"
                            data-percent="75">

                            75%

                        </button>


                        <button
                            type="button"
                            data-percent="100">

                            100%

                        </button>

                    </div>

                `;


                const buttons =
                    item.querySelectorAll(
                        ".completion-options button"
                    );


                const valueLabel =
                    item.querySelector(
                        ".completion-value"
                    );


                buttons.forEach(
                    function (button) {

                        const percent =
                            Number(
                                button.dataset.percent
                            );


                        if (
                            percent ===
                            current
                        ) {

                            button.classList.add(
                                "selected"
                            );

                        }


                        button.addEventListener(
                            "click",
                            function () {

                                selectedSubjects[
                                    subject
                                ] = percent;


                                buttons.forEach(
                                    function (btn) {

                                        btn.classList.remove(
                                            "selected"
                                        );

                                    }
                                );


                                button.classList.add(
                                    "selected"
                                );


                                if (
                                    valueLabel
                                ) {

                                    valueLabel.textContent =
                                        `${percent}%`;

                                }


                                console.log(
                                    `${subject} completion:`,
                                    percent
                                );

                            }
                        );

                    }
                );


                container.appendChild(
                    item
                );

            }
        );

    }


    /* =========================================================
       8. PREPARATION LEVEL
       ========================================================= */

    function setupPreparationSelection() {

        const preparationCards =
            document.querySelectorAll(
                "[data-value]"
            );


        const preparationValues = [
            "Beginner",
            "Basic",
            "Intermediate",
            "Advanced"
        ];


        preparationCards.forEach(
            function (card) {

                const value =
                    String(
                        card.dataset.value || ""
                    ).trim();


                if (
                    !preparationValues.includes(
                        value
                    )
                ) {

                    return;

                }


                card.addEventListener(
                    "click",
                    function () {

                        preparationLevel =
                            value;


                        const parent =
                            card.parentElement;


                        if (parent) {

                            parent
                                .querySelectorAll(
                                    ".selected"
                                )
                                .forEach(
                                    function (item) {

                                        item.classList.remove(
                                            "selected"
                                        );

                                    }
                                );

                        }


                        card.classList.add(
                            "selected"
                        );


                        console.log(
                            "Preparation level:",
                            preparationLevel
                        );

                    }
                );

            }
        );

    }


    /* =========================================================
       9. ATTENDANCE
       ========================================================= */

    function setupAttendance() {

        const attendanceInputs =
            document.querySelectorAll(
                'input[name="attendance"]'
            );


        attendanceInputs.forEach(
            function (input) {

                input.addEventListener(
                    "change",
                    function () {

                        if (
                            !input.checked
                        ) {

                            return;

                        }


                        attendance =
                            getSelectedValue(
                                input
                            );


                        console.log(
                            "Attendance:",
                            attendance
                        );

                    }
                );

            }
        );

    }


    /* =========================================================
       10. CONSISTENCY
       =========================================================

       We intentionally do NOT use every radio button.

       Only inputs with name="consistency" are treated
       as consistency data.
       ========================================================= */

    function setupConsistency() {

        const consistencyInputs =
            document.querySelectorAll(
                'input[name="consistency"]'
            );


        consistencyInputs.forEach(
            function (input) {

                input.addEventListener(
                    "change",
                    function () {

                        if (
                            !input.checked
                        ) {

                            return;

                        }


                        consistency =
                            getSelectedValue(
                                input
                            );


                        console.log(
                            "Consistency:",
                            consistency
                        );

                    }
                );

            }
        );

    }


    /* =========================================================
       11. STUDY HOURS
       ========================================================= */

    function setupStudyHours() {

        const studyInputs =
            document.querySelectorAll(
                'input[name="studyHours"], input[type="range"]'
            );


        studyInputs.forEach(
            function (input) {

                function updateStudyHours() {

                    studyHours =
                        input.value;


                    const possibleDisplay =
                        document.querySelector(
                            "#studyHoursValue"
                        );


                    if (
                        possibleDisplay
                    ) {

                        possibleDisplay.textContent =
                            `${studyHours} hrs`;

                    }


                    console.log(
                        "Study hours:",
                        studyHours
                    );

                }


                input.addEventListener(
                    "input",
                    updateStudyHours
                );


                input.addEventListener(
                    "change",
                    updateStudyHours
                );

            }
        );

    }


    /* =========================================================
       12. GOALS
       ========================================================= */

    function setupGoals() {

        const goalInputs =
            document.querySelectorAll(
                'input[name="goals"]'
            );


        goalInputs.forEach(
            function (input) {

                input.addEventListener(
                    "change",
                    function () {

                        const goal =
                            getSelectedValue(
                                input
                            );


                        if (!goal) {
                            return;
                        }


                        if (
                            input.checked
                        ) {

                            if (
                                !goals.includes(
                                    goal
                                )
                            ) {

                                goals.push(
                                    goal
                                );

                            }

                        } else {

                            goals =
                                goals.filter(
                                    function (
                                        item
                                    ) {

                                        return (
                                            item !==
                                            goal
                                        );

                                    }
                                );

                        }


                        console.log(
                            "Goals:",
                            goals
                        );

                    }
                );

            }
        );

    }


    /* =========================================================
       13. FALLBACK GOAL CARD SUPPORT
       =========================================================

       If goals are cards instead of checkboxes,
       this handles them too.
       ========================================================= */

    function setupGoalCards() {

        const cards =
            document.querySelectorAll(
                ".goal-card"
            );


        cards.forEach(
            function (card) {

                card.addEventListener(
                    "click",
                    function (event) {

                        /*
                           If the card already contains
                           a checkbox, let checkbox logic
                           handle it.
                        */

                        const checkbox =
                            card.querySelector(
                                'input[type="checkbox"]'
                            );


                        if (checkbox) {

                            return;

                        }


                        const goal =
                            card.dataset.goal ||
                            card.dataset.value ||
                            getText(card);


                        if (!goal) {
                            return;
                        }


                        if (
                            goals.includes(
                                goal
                            )
                        ) {

                            goals =
                                goals.filter(
                                    function (
                                        item
                                    ) {

                                        return (
                                            item !==
                                            goal
                                        );

                                    }
                                );


                            card.classList.remove(
                                "selected"
                            );

                        } else {

                            goals.push(
                                goal
                            );


                            card.classList.add(
                                "selected"
                            );

                        }


                        console.log(
                            "Goals:",
                            goals
                        );

                    }
                );

            }
        );

    }


    /* =========================================================
       14. ESCAPE HTML
       =========================================================

       Protects dynamically added subject names.
       ========================================================= */

    function escapeHTML(value) {

        return String(value)
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }


    /* =========================================================
       15. VALIDATE PROFILE
       ========================================================= */

    function validateBeforeDashboard() {

        /*
           User is allowed to stop early.

           Therefore we do NOT force every field.

           Dashboard can be generated even if some
           information is missing.
        */

        return true;

    }


    /* =========================================================
       16. GENERATE DASHBOARD
       ========================================================= */

    function setupDashboardButton() {

        const buttons =
            document.querySelectorAll(
                "button, a"
            );


        buttons.forEach(
            function (button) {

                const text =
                    normalizeText(
                        getText(button)
                    );


                const isDashboardButton =
                    text.includes(
                        "generate my dashboard"
                    ) ||
                    text.includes(
                        "generate dashboard"
                    ) ||
                    text ===
                        "dashboard";


                if (
                    !isDashboardButton
                ) {

                    return;

                }


                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();


                        if (
                            !validateBeforeDashboard()
                        ) {

                            return;

                        }


                        /*
                           IMPORTANT:

                           Save the COMPLETE profile
                           only now.
                        */

                        saveProfile();


                        console.log(
                            "Final profile before dashboard:",
                            {
                                name:
                                    localStorage.getItem(
                                        "studentName"
                                    ) ||
                                    "Student",

                                year:
                                    selectedYear,

                                subjects:
                                    selectedSubjects,

                                preparationLevel:
                                    preparationLevel,

                                attendance:
                                    attendance,

                                consistency:
                                    consistency,

                                goals:
                                    goals,

                                studyHours:
                                    studyHours
                            }
                        );


                        /*
                           Move to dashboard.
                        */

                        window.location.href =
                            "dashboard.html";

                    }
                );

            }
        );

    }


    /* =========================================================
       17. PREVENT ACCIDENTAL FORM SUBMISSION
       ========================================================= */

    document
        .querySelectorAll("form")
        .forEach(
            function (form) {

                form.addEventListener(
                    "submit",
                    function (event) {

                        event.preventDefault();

                    }
                );

            }
        );


    /* =========================================================
       18. INITIALISE
       ========================================================= */

    setupYearSelection();

    setupSubjectSelection();

    setupPreparationSelection();

    setupAttendance();

    setupConsistency();

    setupStudyHours();

    setupGoals();

    setupGoalCards();

    setupDashboardButton();

    createCompletionOptions();


    /* =========================================================
       19. DEBUG
       ========================================================= */

    console.log(
        "======================================"
    );

    console.log(
        "EduPredict AI Academic Setup Loaded"
    );

    console.log(
        "Selected subjects:",
        selectedSubjects
    );

    console.log(
        "Year:",
        selectedYear
    );

    console.log(
        "Preparation:",
        preparationLevel
    );

    console.log(
        "Attendance:",
        attendance
    );

    console.log(
        "Consistency:",
        consistency
    );

    console.log(
        "Study hours:",
        studyHours
    );

    console.log(
        "Goals:",
        goals
    );

    console.log(
        "======================================"
    );

});