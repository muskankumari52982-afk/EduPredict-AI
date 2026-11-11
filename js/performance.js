document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    let profile = {};

    try {

        const savedProfile =
            localStorage.getItem("eduPredictProfile");

        if (savedProfile) {
            profile = JSON.parse(savedProfile);
        }

    } catch (error) {

        console.error("Profile loading error:", error);

    }

    function getElement(id) {
        return document.getElementById(id);
    }

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }

    function getNumber(value) {

        if (typeof value === "number") {
            return Number.isFinite(value) ? value : null;
        }

        if (typeof value === "string") {

            const match = value.match(/\d+(\.\d+)?/);

            if (match) {
                return Number(match[0]);
            }

        }

        return null;

    }

    function cleanAttendance(value) {
        if (!value) return "";
        let str = String(value).trim().replace(/\+/g, "");
        return str.endsWith("%") ? str : str + "%";
    }

    function showElement(element) {

        if (element) {
            element.style.display = "";
        }

    }

    function hideElement(element) {

        if (element) {
            element.style.display = "none";
        }

    }

    const studentName =
        profile.name ||
        localStorage.getItem("studentName") ||
        "Student";

    const profileName = getElement("profileName");

    const profileAvatar = getElement("profileAvatar");

    if (profileName) {
        profileName.textContent = studentName;
    }

    if (profileAvatar) {

        profileAvatar.textContent =
            studentName.trim().charAt(0).toUpperCase() || "S";

    }

    const savedSubjects = profile.subjects || {};

    const subjectEntries = Object.entries(savedSubjects)
        .map(function ([name, value]) {

            const completion = getNumber(value);

            return {
                name: name,
                completion: completion
            };

        })
        .filter(function (subject) {

            return (
                subject.name.trim() !== "" &&
                subject.completion !== null &&
                subject.completion >= 0 &&
                subject.completion <= 100
            );

        });

    let subjectAverage = null;

    if (subjectEntries.length > 0) {

        const total = subjectEntries.reduce(
            function (sum, subject) {

                return sum + subject.completion;

            },
            0
        );

        subjectAverage =
            Math.round(total / subjectEntries.length);

    }

    const statsGrid = getElement("statsGrid");

    function createStatCard(icon, label, value, description) {

        return `
            <div class="stat-card">

                <div class="stat-top">

                    <div class="stat-icon blue">
                        ${icon}
                    </div>

                </div>

                <span class="stat-label">
                    ${escapeHTML(label)}
                </span>

                <h2>
                    ${escapeHTML(value)}
                </h2>

                <p>
                    ${escapeHTML(description)}
                </p>

            </div>
        `;

    }

    if (statsGrid) {

        let cards = "";

        if (subjectAverage !== null) {

            cards += createStatCard(
                "📊",
                "Average Subject Completion",
                subjectAverage + "%",
                "Calculated from your selected subjects"
            );

        }

        cards += createStatCard(
            "📚",
            "Selected Subjects",
            subjectEntries.length,
            "Subjects added in Academic Setup"
        );

        if (profile.attendance) {

            cards += createStatCard(
                "📅",
                "Attendance Selection",
                cleanAttendance(profile.attendance),
                "Your selected attendance information"
            );

        }

        if (profile.consistency) {

            cards += createStatCard(
                "🎯",
                "Study Consistency",
                profile.consistency,
                "Your selected consistency level"
            );

        }

        statsGrid.innerHTML = cards;

    }

    const subjectTable = getElement("subjectTable");

    const subjectCount = getElement("subjectCount");

    if (subjectCount) {

        subjectCount.textContent =
            subjectEntries.length + " subjects";

    }

    if (subjectTable) {

        if (subjectEntries.length === 0) {

            subjectTable.innerHTML = `
                <div class="empty-subjects">
                    <h3>No subjects available</h3>
                    <p>
                        Select subjects in Academic Setup
                        to see your performance here.
                    </p>
                </div>
            `;

        } else {

            const sortedSubjects =
                [...subjectEntries].sort(
                    function (a, b) {
                        return b.completion - a.completion;
                    }
                );

            subjectTable.innerHTML = `

                <div class="table-head">
                    <span>Subject</span>
                    <span>Completion</span>
                    <span>Progress</span>
                    <span>Status</span>
                </div>

                ${sortedSubjects.map(function (subject) {

                    let status = "In Progress";

                    if (subject.completion === 100) {
                        status = "Completed";
                    } else if (subject.completion === 0) {
                        status = "Not Started";
                    }

                    return `

                        <div class="subject-row">

                            <div class="subject-name">
                                ${escapeHTML(subject.name)}
                            </div>

                            <strong>
                                ${subject.completion}%
                            </strong>

                            <div class="mini-progress">

                                <div
                                    class="mini-bar purple-gradient"
                                    style="width:${subject.completion}%">
                                </div>

                            </div>

                            <span class="good">
                                ${status}
                            </span>

                        </div>

                    `;

                }).join("")}

            `;

        }

    }

    const profileOverview =
        getElement("profileOverview");

    if (profileOverview) {

        const details = [];

        if (profile.education) {

            details.push({
                label: "Education",
                value: profile.education
            });

        }

        if (profile.studyArea) {

            details.push({
                label: "Study Area",
                value: profile.studyArea
            });

        }

        if (profile.year) {

            details.push({
                label: "Academic Year",
                value: profile.year
            });

        }

        if (profile.preparationLevel) {

            details.push({
                label: "Preparation",
                value: profile.preparationLevel
            });

        }

        if (profile.attendance) {

            details.push({
                label: "Attendance",
                value: cleanAttendance(profile.attendance)
            });

        }

        if (profile.consistency) {

            details.push({
                label: "Consistency",
                value: profile.consistency
            });

        }

        if (profile.studyHours) {

            details.push({
                label: "Weekly Study Hours",
                value: profile.studyHours
            });

        }

        if (details.length === 0) {

            profileOverview.innerHTML = `
                <p>
                    No additional academic information provided.
                </p>
            `;

        } else {

            profileOverview.innerHTML =
                details.map(function (item) {

                    return `

                        <div>
                            <span>${escapeHTML(item.label)}</span>
                            <strong>${escapeHTML(item.value)}</strong>
                        </div>

                    `;

                }).join("");

        }

    }

    const yearCard = getElement("yearCard");

    if (profile.year) {

        getElement("yearValue").textContent =
            profile.year;

    } else {

        hideElement(yearCard);

    }

    const preparationCard =
        getElement("preparationCard");

    if (profile.preparationLevel) {

        getElement("preparationValue").textContent =
            profile.preparationLevel;

    } else {

        hideElement(preparationCard);

    }

    const goalsCard = getElement("goalsCard");

    const goals = Array.isArray(profile.goals)
        ? profile.goals
        : [];

    if (goals.length > 0) {

        getElement("goalsValue").textContent =
            goals.length;

        const goalDescription =
            goals.map(function (goal) {
                return escapeHTML(goal);
            }).join(", ");

        const description =
            goalsCard.querySelector("p");

        if (description) {
            description.textContent = goalDescription;
        }

    } else {

        hideElement(goalsCard);

    }

    const insightContent =
        getElement("insightContent");

    if (insightContent) {

        const weakSubjects =
            subjectEntries.filter(function (subject) {

                return subject.completion < 50;

            });

        const incompleteSubjects =
            subjectEntries.filter(function (subject) {

                return subject.completion < 100;

            });

        let message = "";

        if (subjectEntries.length === 0) {

            message = `
                <p>
                    Add your subjects in Academic Setup
                    to receive subject-based insights.
                </p>
            `;

        } else if (weakSubjects.length > 0) {

            message = `
                <p>
                    These subjects have less than 50%
                    completion:
                </p>

                <ul>
                    ${weakSubjects.map(function (subject) {

                        return `
                            <li>
                                <strong>
                                    ${escapeHTML(subject.name)}
                                </strong>
                                — ${subject.completion}% completed
                            </li>
                        `;

                    }).join("")}
                </ul>
            `;

        } else if (incompleteSubjects.length > 0) {

            message = `
                <p>
                    Your selected subjects are above
                    50% completion. Continue working on
                    the subjects that are not yet completed.
                </p>
            `;

        } else {

            message = `
                <p>
                    All your selected subjects are marked
                    as 100% completed.
                </p>
            `;

        }

        insightContent.innerHTML = message;

    }

    const searchInput =
        document.querySelector(".search-box input");

    if (searchInput) {

        searchInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key !== "Enter") {
                    return;
                }

                const query =
                    searchInput.value.trim().toLowerCase();

                if (!query) {
                    return;
                }

                const matchingSubject =
                    subjectEntries.find(function (subject) {

                        return subject.name.toLowerCase().includes(query);

                    });

                if (matchingSubject) {

                    const rows =
                        subjectTable.querySelectorAll(".subject-row");

                    rows.forEach(function (row) {

                        const name =
                            row.querySelector(".subject-name");

                        if (
                            name &&
                            name.textContent.toLowerCase().includes(query)
                        ) {

                            row.scrollIntoView({
                                behavior: "smooth",
                                block: "center"
                            });

                        }

                    });

                } else {

                    alert("No matching subject found in your profile.");

                }

            }
        );

    }

    document.querySelectorAll(".nav-item").forEach(
        function (item) {

            item.addEventListener("click", function (event) {

                const destination =
                    item.getAttribute("href");

                if (destination) {

                    event.preventDefault();

                    window.location.href = destination;

                }

            });

        }
    );

    console.log("EduPredict AI Performance Loaded");

});