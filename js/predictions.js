document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // STUDENT NAME
    // =========================

    const savedName = localStorage.getItem("studentName");

    const studentName = document.getElementById("studentName");
    const profileAvatar = document.getElementById("profileAvatar");

    if (savedName && savedName.trim() !== "") {

        studentName.textContent = savedName;

        profileAvatar.textContent =
            savedName.trim().charAt(0).toUpperCase();
    }


    // =========================
    // INPUTS
    // =========================

    const attendance = document.getElementById("attendance");
    const previousMarks = document.getElementById("previousMarks");
    const studyHours = document.getElementById("studyHours");
    const assignmentScore = document.getElementById("assignmentScore");
    const studyConsistency = document.getElementById("studyConsistency");
    const internalMarks = document.getElementById("internalMarks");

    const predictBtn = document.getElementById("predictBtn");


    // =========================
    // RESULT ELEMENTS
    // =========================

    const predictedScore =
        document.getElementById("predictedScore");

    const riskLevel =
        document.getElementById("riskLevel");

    const confidence =
        document.getElementById("confidence");

    const predictionMessage =
        document.getElementById("predictionMessage");

    const aiInsight =
        document.getElementById("aiInsight");


    // =========================
    // FACTOR ELEMENTS
    // =========================

    const attendanceValue =
        document.getElementById("attendanceValue");

    const marksValue =
        document.getElementById("marksValue");

    const consistencyValue =
        document.getElementById("consistencyValue");

    const assignmentValue =
        document.getElementById("assignmentValue");


    const attendanceBar =
        document.getElementById("attendanceBar");

    const marksBar =
        document.getElementById("marksBar");

    const consistencyBar =
        document.getElementById("consistencyBar");

    const assignmentBar =
        document.getElementById("assignmentBar");


    // =========================
    // PREDICTION FUNCTION
    // =========================

    function calculatePrediction() {

        const attendanceValueInput =
            Number(attendance.value);

        const previousMarksValue =
            Number(previousMarks.value);

        const studyHoursValue =
            Number(studyHours.value);

        const assignmentValueInput =
            Number(assignmentScore.value);

        const consistencyValueInput =
            Number(studyConsistency.value);

        const internalMarksValue =
            Number(internalMarks.value);


        // Validate inputs

        if (
            attendanceValueInput < 0 ||
            attendanceValueInput > 100 ||

            previousMarksValue < 0 ||
            previousMarksValue > 100 ||

            studyHoursValue < 0 ||
            studyHoursValue > 24 ||

            assignmentValueInput < 0 ||
            assignmentValueInput > 100 ||

            consistencyValueInput < 0 ||
            consistencyValueInput > 100 ||

            internalMarksValue < 0 ||
            internalMarksValue > 100
        ) {

            alert(
                "Please enter valid academic values."
            );

            return;
        }


        // =========================
        // DEMO PREDICTION LOGIC
        // =========================

        /*
           Current version:
           Frontend demonstration logic.

           Later this will be replaced by
           the actual trained ML model/API.
        */

        let studyScore =
            Math.min(studyHoursValue * 5, 100);


        let prediction =

            (attendanceValueInput * 0.15) +

            (previousMarksValue * 0.25) +

            (studyScore * 0.15) +

            (assignmentValueInput * 0.15) +

            (consistencyValueInput * 0.15) +

            (internalMarksValue * 0.15);


        prediction =
            Math.round(prediction);


        // Keep prediction between 0 and 100

        prediction =
            Math.max(0, Math.min(100, prediction));


        // =========================
        // RISK LEVEL
        // =========================

        let risk = "";
        let message = "";
        let insight = "";
        let confidenceValue = 0;


        if (prediction >= 80) {

            risk = "Low";

            confidenceValue = 91;

            message =
                "Your current academic pattern indicates strong performance potential.";

            insight =
                "Your academic indicators are strong. Maintaining your attendance, consistency and study routine can help you sustain this performance.";

        }

        else if (prediction >= 65) {

            risk = "Moderate";

            confidenceValue = 86;

            message =
                "Your performance is stable, but there is room for improvement.";

            insight =
                "Improving your study consistency and assignment performance could increase your expected academic score.";

        }

        else {

            risk = "High";

            confidenceValue = 80;

            message =
                "Your current academic indicators suggest that additional study effort may be required.";

            insight =
                "Focus on improving attendance, study consistency and daily study hours to reduce academic risk.";

        }


        // =========================
        // UPDATE RESULT
        // =========================

        predictedScore.textContent =
            prediction;

        riskLevel.textContent =
            risk;

        confidence.textContent =
            confidenceValue + "%";

        predictionMessage.textContent =
            message;

        aiInsight.textContent =
            insight;


        // =========================
        // RISK COLOR
        // =========================

        riskLevel.classList.remove(
            "low-risk"
        );

        riskLevel.style.color = "";


        if (risk === "Low") {

            riskLevel.classList.add(
                "low-risk"
            );

        }

        else if (risk === "Moderate") {

            riskLevel.style.color =
                "#d97706";

        }

        else {

            riskLevel.style.color =
                "#dc2626";

        }


        // =========================
        // UPDATE FACTORS
        // =========================

        attendanceValue.textContent =
            attendanceValueInput + "%";

        marksValue.textContent =
            previousMarksValue + "%";

        consistencyValue.textContent =
            consistencyValueInput + "%";

        assignmentValue.textContent =
            assignmentValueInput + "%";


        attendanceBar.style.width =
            attendanceValueInput + "%";

        marksBar.style.width =
            previousMarksValue + "%";

        consistencyBar.style.width =
            consistencyValueInput + "%";

        assignmentBar.style.width =
            assignmentValueInput + "%";


        // =========================
        // SAVE DATA
        // =========================

        localStorage.setItem(
            "predictedScore",
            prediction
        );

        localStorage.setItem(
            "riskLevel",
            risk
        );

        localStorage.setItem(
            "predictionConfidence",
            confidenceValue
        );

        localStorage.setItem(
            "attendance",
            attendanceValueInput
        );

        localStorage.setItem(
            "previousMarks",
            previousMarksValue
        );

        localStorage.setItem(
            "studyHours",
            studyHoursValue
        );

        localStorage.setItem(
            "assignmentScore",
            assignmentValueInput
        );

        localStorage.setItem(
            "studyConsistency",
            consistencyValueInput
        );

        localStorage.setItem(
            "internalMarks",
            internalMarksValue
        );

    }


    // =========================
    // BUTTON EVENT
    // =========================

    predictBtn.addEventListener(
        "click",
        calculatePrediction
    );


    // =========================
    // LIVE FACTOR UPDATE
    // =========================

    attendance.addEventListener(
        "input",
        function () {

            let value =
                Math.max(
                    0,
                    Math.min(100, Number(this.value))
                );

            attendanceValue.textContent =
                value + "%";

            attendanceBar.style.width =
                value + "%";
        }
    );


    previousMarks.addEventListener(
        "input",
        function () {

            let value =
                Math.max(
                    0,
                    Math.min(100, Number(this.value))
                );

            marksValue.textContent =
                value + "%";

            marksBar.style.width =
                value + "%";
        }
    );


    studyConsistency.addEventListener(
        "input",
        function () {

            let value =
                Math.max(
                    0,
                    Math.min(100, Number(this.value))
                );

            consistencyValue.textContent =
                value + "%";

            consistencyBar.style.width =
                value + "%";
        }
    );


    assignmentScore.addEventListener(
        "input",
        function () {

            let value =
                Math.max(
                    0,
                    Math.min(100, Number(this.value))
                );

            assignmentValue.textContent =
                value + "%";

            assignmentBar.style.width =
                value + "%";
        }
    );


    // =========================
    // LOAD PREVIOUS PREDICTION
    // =========================

    const savedPrediction =
        localStorage.getItem("predictedScore");

    const savedRisk =
        localStorage.getItem("riskLevel");

    const savedConfidence =
        localStorage.getItem(
            "predictionConfidence"
        );


    if (savedPrediction) {

        predictedScore.textContent =
            savedPrediction;
    }

    if (savedRisk) {

        riskLevel.textContent =
            savedRisk;
    }

    if (savedConfidence) {

        confidence.textContent =
            savedConfidence + "%";
    }


    console.log(
        "EduPredict AI - Predictions loaded successfully."
    );

});