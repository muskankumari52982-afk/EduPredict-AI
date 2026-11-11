document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // =========================================================
    // 1. LOAD STUDENT PROFILE
    // =========================================================

    const savedProfile = localStorage.getItem("eduPredictProfile");

    let profile = {};

    try {
        profile = savedProfile ? JSON.parse(savedProfile) : {};
    } catch (error) {
        console.error("Error reading student profile:", error);
        profile = {};
    }

    const studentName =
        profile.name ||
        localStorage.getItem("studentName") ||
        "Student";

    const subjects = profile.subjects || {};

    // =========================================================
    // 2. HELPER FUNCTIONS
    // =========================================================

    function clamp(value, min = 0, max = 100) {
        return Math.min(Math.max(value, min), max);
    }

    function toNumber(value, fallback = 0) {
        if (typeof value === "number" && Number.isFinite(value)) {
            return value;
        }

        if (typeof value === "string") {
            const match = value.match(/-?\d+(\.\d+)?/);

            if (match) {
                const number = parseFloat(match[0]);

                if (Number.isFinite(number)) {
                    return number;
                }
            }
        }

        return fallback;
    }

    function escapeHTML(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function capitalize(text) {
        if (!text) return "";

        return String(text)
            .replace(/[_-]/g, " ")
            .replace(/\b\w/g, char => char.toUpperCase());
    }

    function getElement(id) {
        return document.getElementById(id);
    }

    function setText(id, value) {
        const element = getElement(id);

        if (element) {
            element.textContent = value;
        }
    }

    function setWidth(id, value) {
        const element = getElement(id);

        if (element) {
            element.style.width = `${clamp(value)}%`;
        }
    }

    // =========================================================
    // 3. NORMALIZE SUBJECT DATA
    // =========================================================

    const subjectEntries = Object.entries(subjects)
        .map(([name, value]) => {
            const completion = clamp(toNumber(value, 0));

            return {
                name,
                completion
            };
        })
        .filter(subject => subject.name.trim() !== "");

    // =========================================================
    // 4. ACADEMIC DATA
    // =========================================================

    const preparationLevel =
        String(profile.preparationLevel || "").toLowerCase();

    const attendanceValue =
        String(profile.attendance || "").toLowerCase();

    const consistencyValue =
        String(profile.consistency || "").toLowerCase();

    const studyHoursValue =
        profile.studyHours || "";

    // =========================================================
    // 5. ATTENDANCE SCORE
    // =========================================================

    function getAttendanceScore(value) {
        if (!value) return 70;

        if (
            value.includes("95") ||
            value.includes("excellent")
        ) {
            return 97;
        }

        if (
            value.includes("85") ||
            value.includes("90") ||
            value.includes("good")
        ) {
            return 90;
        }

        if (
            value.includes("75") ||
            value.includes("80")
        ) {
            return 80;
        }

        if (
            value.includes("60") ||
            value.includes("65") ||
            value.includes("70")
        ) {
            return 68;
        }

        if (
            value.includes("below") ||
            value.includes("low") ||
            value.includes("poor")
        ) {
            return 55;
        }

        const numeric = toNumber(value, 70);

        return clamp(numeric);
    }

    // =========================================================
    // 6. CONSISTENCY SCORE
    // =========================================================

    function getConsistencyScore(value) {
        if (!value) return 70;

        if (
            value.includes("excellent") ||
            value.includes("very high")
        ) {
            return 95;
        }

        if (
            value.includes("good") ||
            value.includes("high")
        ) {
            return 82;
        }

        if (
            value.includes("average") ||
            value.includes("medium")
        ) {
            return 70;
        }

        if (
            value.includes("low")
        ) {
            return 55;
        }

        if (
            value.includes("very low") ||
            value.includes("poor")
        ) {
            return 40;
        }

        return 70;
    }

    // =========================================================
    // 7. PREPARATION SCORE
    // =========================================================

    function getPreparationScore(value) {
        if (!value) return 65;

        if (
            value.includes("advanced") ||
            value.includes("excellent")
        ) {
            return 95;
        }

        if (
            value.includes("intermediate") ||
            value.includes("good")
        ) {
            return 80;
        }

        if (
            value.includes("basic") ||
            value.includes("average")
        ) {
            return 65;
        }

        if (
            value.includes("beginner") ||
            value.includes("poor")
        ) {
            return 45;
        }

        return 65;
    }

    // =========================================================
    // 8. STUDY HOURS SCORE
    // =========================================================

    function getStudyHoursScore(value) {
        const hours = toNumber(value, 0);

        if (hours >= 25) return 100;
        if (hours >= 20) return 95;
        if (hours >= 15) return 88;
        if (hours >= 10) return 78;
        if (hours >= 5) return 65;

        return 50;
    }

    function getStudyHoursNumber(value) {
        const hours = toNumber(value, 0);

        return hours;
    }

    // =========================================================
    // 9. CALCULATE SUBJECT PERFORMANCE
    // =========================================================

    let subjectAverage = 0;

    if (subjectEntries.length > 0) {
        const totalCompletion = subjectEntries.reduce(
            (sum, subject) => sum + subject.completion,
            0
        );

        subjectAverage =
            totalCompletion / subjectEntries.length;
    }

    // If no subjects selected, use a reasonable base score.
    if (subjectEntries.length === 0) {
        subjectAverage = 50;
    }

    // =========================================================
    // 10. OTHER SCORES
    // =========================================================

    const attendanceScore =
        getAttendanceScore(attendanceValue);

    const consistencyScore =
        getConsistencyScore(consistencyValue);

    const preparationScore =
        getPreparationScore(preparationLevel);

    const studyHoursScore =
        getStudyHoursScore(studyHoursValue);

    const studyHours =
        getStudyHoursNumber(studyHoursValue);

    // =========================================================
    // 11. OVERALL PERFORMANCE
    // =========================================================

    /*
        Current score is based on:
        Subject completion     = 50%
        Attendance             = 15%
        Consistency            = 15%
        Preparation            = 10%
        Study hours            = 10%
    */

    const currentScore =
        (subjectAverage * 0.50) +
        (attendanceScore * 0.15) +
        (consistencyScore * 0.15) +
        (preparationScore * 0.10) +
        (studyHoursScore * 0.10);

    const overallPerformance =
        Math.round(clamp(currentScore));

    // =========================================================
    // 12. PREDICTED SCORE
    // =========================================================

    /*
        This is currently a heuristic prediction.
        It is NOT a trained ML model probability.
    */

    let predictedScore = currentScore;

    // Good consistency gives positive future improvement.
    if (consistencyScore >= 82) {
        predictedScore += 5;
    } else if (consistencyScore >= 70) {
        predictedScore += 3;
    } else if (consistencyScore < 55) {
        predictedScore -= 2;
    }

    // Good attendance improves expected performance.
    if (attendanceScore >= 90) {
        predictedScore += 3;
    } else if (attendanceScore < 60) {
        predictedScore -= 2;
    }

    // More study hours can improve predicted performance.
    if (studyHours >= 20) {
        predictedScore += 4;
    } else if (studyHours >= 15) {
        predictedScore += 3;
    } else if (studyHours >= 10) {
        predictedScore += 2;
    }

    predictedScore = clamp(
        Math.round(predictedScore),
        0,
        100
    );

    // =========================================================
    // 13. PERFORMANCE TREND
    // =========================================================

    const performanceDifference =
        predictedScore - overallPerformance;

    let trendText = "Stable";

    if (performanceDifference >= 5) {
        trendText = `+${performanceDifference}%`;
    } else if (performanceDifference > 0) {
        trendText = `+${performanceDifference}%`;
    } else if (performanceDifference < 0) {
        trendText = `${performanceDifference}%`;
    }

    // =========================================================
    // 14. CONFIDENCE
    // =========================================================

    let confidence = 50;

    if (studentName && studentName !== "Student") {
        confidence += 5;
    }

    if (subjectEntries.length > 0) {
        confidence += 15;
    }

    if (profile.attendance) {
        confidence += 10;
    }

    if (profile.consistency) {
        confidence += 10;
    }

    if (profile.preparationLevel) {
        confidence += 5;
    }

    if (profile.studyHours) {
        confidence += 5;
    }

    confidence = clamp(
        Math.round(confidence),
        0,
        100
    );

    // =========================================================
    // 15. RISK LEVEL
    // =========================================================

    let riskLevel = "Low";

    if (predictedScore < 50) {
        riskLevel = "High";
    } else if (predictedScore < 70) {
        riskLevel = "Medium";
    }

    // =========================================================
    // 16. CONSISTENCY LABEL
    // =========================================================

    let consistencyLabel = "Average";

    if (consistencyScore >= 90) {
        consistencyLabel = "Excellent";
    } else if (consistencyScore >= 80) {
        consistencyLabel = "Good";
    } else if (consistencyScore >= 65) {
        consistencyLabel = "Average";
    } else if (consistencyScore >= 50) {
        consistencyLabel = "Low";
    } else {
        consistencyLabel = "Very Low";
    }

    // =========================================================
    // 17. UPDATE QUICK STATS
    // =========================================================

    setText(
        "overallPerformance",
        `${overallPerformance}%`
    );

    setText(
        "overallProgress",
        `${overallPerformance}%`
    );

    setText(
        "performanceTrend",
        trendText
    );

    setText(
        "aiPrediction",
        `${predictedScore}%`
    );

    setText(
        "predictionConfidence",
        `${confidence}% confidence`
    );

    setText(
        "learningConsistency",
        `${consistencyScore}%`
    );

    setText(
        "consistencyLabel",
        consistencyLabel
    );

    setText(
        "studyHours",
        `${studyHours} hrs`
    );

    setWidth(
        "aiPredictionProgress",
        predictedScore
    );

    setWidth(
        "consistencyProgress",
        consistencyScore
    );

    // =========================================================
    // 18. STUDY HOURS BARS
    // =========================================================

    const studyHourBars =
        getElement("studyHourBars");

    if (studyHourBars) {
        const maxHours = 25;

        const baseHours = Math.max(
            0,
            Math.min(studyHours, maxHours)
        );

        const weeklyPattern = [
            Math.max(0, baseHours - 4),
            Math.max(0, baseHours - 2),
            Math.max(0, baseHours - 1),
            baseHours,
            Math.min(maxHours, baseHours + 1),
            Math.min(maxHours, baseHours + 2),
            Math.min(maxHours, baseHours + 3)
        ];

        studyHourBars.innerHTML =
            weeklyPattern.map((hours, index) => {
                const height =
                    Math.max(
                        12,
                        (hours / maxHours) * 100
                    );

                return `
                    <div class="chart-column">
                        <div class="chart-bar"
                             style="height:${height}%"
                             title="${hours} study hours">
                        </div>

                        <span class="chart-value">
                            ${Math.round(hours)}h
                        </span>

                        <span class="chart-label">
                            D${index + 1}
                        </span>
                    </div>
                `;
            }).join("");
    }

    // =========================================================
    // 19. PERFORMANCE CHART
    // =========================================================

    const performanceChartBars =
        getElement("performanceChartBars");

    if (performanceChartBars) {
        const startScore =
            Math.max(
                0,
                overallPerformance - 10
            );

        const chartValues = [
            startScore,
            Math.min(100, startScore + 2),
            Math.min(100, startScore + 4),
            Math.min(100, startScore + 3),
            Math.min(100, startScore + 6),
            Math.min(100, startScore + 8),
            overallPerformance,
            predictedScore
        ];

        performanceChartBars.innerHTML =
            chartValues.map((value, index) => {
                const height =
                    Math.max(
                        8,
                        value
                    );

                return `
                    <div class="chart-column">
                        <div class="chart-bar"
                             style="height:${height}%"
                             title="${Math.round(value)}%">
                        </div>

                        <span class="chart-value">
                            ${Math.round(value)}%
                        </span>

                        <span class="chart-label">
                            W${index + 1}
                        </span>
                    </div>
                `;
            }).join("");
    }

    // =========================================================
    // 20. SUBJECT LIST
    // =========================================================

    const subjectList =
        getElement("subjectList");

    if (subjectList) {
        if (subjectEntries.length === 0) {
            subjectList.innerHTML = `
                <div class="empty-subjects">
                    <div class="empty-icon">📚</div>
                    <h3>No subjects selected</h3>
                    <p>
                        Complete your Academic Setup to see
                        subject-wise performance.
                    </p>
                </div>
            `;
        } else {
            const sortedSubjects =
                [...subjectEntries].sort(
                    (a, b) =>
                        b.completion - a.completion
                );

            subjectList.innerHTML =
                sortedSubjects.map(subject => {
                    const completion =
                        Math.round(subject.completion);

                    let status = "Needs Attention";

                    if (completion >= 80) {
                        status = "Strong";
                    } else if (completion >= 60) {
                        status = "On Track";
                    }

                    return `
                        <div class="subject-item">

                            <div class="subject-left">

                                <div class="subject-avatar">
                                    ${escapeHTML(
                                        subject.name
                                            .charAt(0)
                                            .toUpperCase()
                                    )}
                                </div>

                                <div>
                                    <strong>
                                        ${escapeHTML(
                                            subject.name
                                        )}
                                    </strong>

                                    <span>
                                        ${status}
                                    </span>
                                </div>

                            </div>

                            <div class="subject-progress">

                                <div class="subject-progress-bar">
                                    <span
                                        style="width:${completion}%">
                                    </span>
                                </div>

                                <strong>
                                    ${completion}%
                                </strong>

                            </div>

                        </div>
                    `;
                }).join("");
        }
    }

    // =========================================================
    // 21. AI INSIGHT MESSAGE
    // =========================================================

    let aiMessage = "";

    if (riskLevel === "High") {
        aiMessage =
            "Your current performance needs attention. Focus on weak subjects, improve study consistency, and increase your weekly study time.";
    } else if (riskLevel === "Medium") {
        aiMessage =
            "You are making progress, but there is room for improvement. Focus on your weaker subjects and maintain a consistent study routine.";
    } else {
        aiMessage =
            "Your academic profile looks healthy. Keep your current consistency and continue improving your weaker subjects.";
    }

    setText(
        "aiMessage",
        aiMessage
    );

    setText(
        "aiPredictedScore",
        `${predictedScore}%`
    );

    setText(
        "aiConfidence",
        `${confidence}%`
    );

    setText(
        "aiRiskLevel",
        riskLevel
    );

    // =========================================================
    // 22. AI RISK CLASS
    // =========================================================

    const aiRiskElement =
        getElement("aiRiskLevel");

    if (aiRiskElement) {
        aiRiskElement.classList.remove(
            "low",
            "medium",
            "high"
        );

        aiRiskElement.classList.add(
            riskLevel.toLowerCase()
        );
    }

    // =========================================================
    // 23. RECOMMENDATIONS
    // =========================================================

    const recommendationList =
        getElement("recommendationList");

    if (recommendationList) {
        const recommendations = [];

        // Weak subjects
        const weakSubjects =
            subjectEntries
                .filter(subject => subject.completion < 60)
                .sort(
                    (a, b) =>
                        a.completion - b.completion
                );

        weakSubjects
            .slice(0, 3)
            .forEach(subject => {
                recommendations.push({
                    icon: "📚",
                    title: `Focus on ${subject.name}`,
                    text:
                        `${Math.round(subject.completion)}% completed. Prioritize this subject in your next study sessions.`
                });
            });

        // Attendance
        if (attendanceScore < 75) {
            recommendations.push({
                icon: "🏫",
                title: "Improve attendance",
                text:
                    "Regular class attendance can strengthen your academic performance."
            });
        }

        // Consistency
        if (consistencyScore < 70) {
            recommendations.push({
                icon: "🔥",
                title: "Build study consistency",
                text:
                    "Try maintaining a fixed daily or weekly study routine."
            });
        }

        // Study hours
        if (studyHours < 10) {
            recommendations.push({
                icon: "⏱️",
                title: "Increase study time",
                text:
                    "Consider gradually increasing your weekly study hours."
            });
        }

        // Good profile
        if (recommendations.length === 0) {
            recommendations.push({
                icon: "🚀",
                title: "Keep your momentum",
                text:
                    "Your current academic indicators are strong. Continue your current routine and target advanced improvement."
            });
        }

        recommendationList.innerHTML =
            recommendations
                .slice(0, 5)
                .map(item => {
                    return `
                        <div class="recommendation-item">

                            <div class="recommendation-icon">
                                ${item.icon}
                            </div>

                            <div>
                                <strong>
                                    ${escapeHTML(item.title)}
                                </strong>

                                <p>
                                    ${escapeHTML(item.text)}
                                </p>
                            </div>

                        </div>
                    `;
                })
                .join("");
    }

    // =========================================================
    // 24. MODAL INSIGHT
    // =========================================================

    const modalInsightText =
        getElement("modalInsightText");

    const modalCurrent =
        getElement("modalCurrent");

    const modalPredicted =
        getElement("modalPredicted");

    const modalGrowth =
        getElement("modalGrowth");

    if (modalInsightText) {
        modalInsightText.textContent =
            aiMessage;
    }

    if (modalCurrent) {
        modalCurrent.textContent =
            `${overallPerformance}%`;
    }

    if (modalPredicted) {
        modalPredicted.textContent =
            `${predictedScore}%`;
    }

    if (modalGrowth) {
        const growth =
            predictedScore - overallPerformance;

        modalGrowth.textContent =
            growth >= 0
                ? `+${growth}%`
                : `${growth}%`;
    }

    // =========================================================
    // 25. INSIGHT MODAL
    // =========================================================

    const insightModal =
        getElement("insightModal");

    const openInsightButtons =
        document.querySelectorAll(
            "[data-open-insight], .open-insight, #viewInsights"
        );

    const closeInsightButtons =
        document.querySelectorAll(
            "[data-close-insight], .close-modal, .modal-close"
        );

    openInsightButtons.forEach(button => {
        button.addEventListener("click", () => {
            if (insightModal) {
                insightModal.classList.add("active");
            }
        });
    });

    closeInsightButtons.forEach(button => {
        button.addEventListener("click", () => {
            if (insightModal) {
                insightModal.classList.remove("active");
            }
        });
    });

    if (insightModal) {
        insightModal.addEventListener("click", event => {
            if (event.target === insightModal) {
                insightModal.classList.remove("active");
            }
        });
    }

    document.addEventListener("keydown", event => {
        if (
            event.key === "Escape" &&
            insightModal
        ) {
            insightModal.classList.remove("active");
        }
    });

    // =========================================================
    // 26. NAVIGATION
    // =========================================================

    const navigationItems =
        document.querySelectorAll("[data-page]");

    navigationItems.forEach(item => {
        item.addEventListener("click", event => {
            event.preventDefault();

            const page =
                item.getAttribute("data-page");

            if (!page) return;

            if (page === "dashboard") {
                window.location.href =
                    "dashboard.html";
            } else {
                window.location.href =
                    `${page}.html`;
            }
        });
    });

    // =========================================================
    // 27. ACTIVE NAVIGATION
    // =========================================================

    navigationItems.forEach(item => {
        const page =
            item.getAttribute("data-page");

        if (
            page === "dashboard" &&
            (
                window.location.pathname.includes(
                    "dashboard.html"
                ) ||
                window.location.pathname.endsWith("/")
            )
        ) {
            item.classList.add("active");
        }
    });

    // =========================================================
    // 28. PROFILE NAME
    // =========================================================

    const nameElements =
        document.querySelectorAll(
            "[data-student-name], .student-name, #studentName"
        );

    nameElements.forEach(element => {
        element.textContent = studentName;
    });

    // =========================================================
    // 29. EDUCATION / YEAR
    // =========================================================

    const educationElements =
        document.querySelectorAll(
            "[data-education]"
        );

    educationElements.forEach(element => {
        element.textContent =
            profile.education ||
            "Education";
    });

    const yearElements =
        document.querySelectorAll(
            "[data-year]"
        );

    yearElements.forEach(element => {
        element.textContent =
            profile.year ||
            "Year";
    });

    // =========================================================
    // 30. SAVE CALCULATED DASHBOARD DATA
    // =========================================================

    const dashboardData = {
        overallPerformance,
        predictedScore,
        confidence,
        riskLevel,
        consistencyScore,
        attendanceScore,
        preparationScore,
        studyHours,
        subjectAverage,
        updatedAt: new Date().toISOString()
    };

    localStorage.setItem(
        "eduPredictDashboard",
        JSON.stringify(dashboardData)
    );

    // =========================================================
    // 31. DEBUG INFORMATION
    // =========================================================

    console.log(
        "EduPredict AI Dashboard Loaded"
    );

    console.log({
        studentName,
        subjects: subjectEntries,
        overallPerformance,
        predictedScore,
        confidence,
        riskLevel,
        attendanceScore,
        consistencyScore,
        preparationScore,
        studyHours
    });
});