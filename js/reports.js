document.addEventListener("DOMContentLoaded", function () {

    const profile = JSON.parse(
        localStorage.getItem("eduPredictProfile") || "null"
    );

    const $ = (id) => document.getElementById(id);

    function showEmpty(message) {
        return `<p class="empty-message">${message}</p>`;
    }

    function safeText(value) {
        const element = document.createElement("span");
        element.textContent = String(value ?? "");
        return element.innerHTML;
    }

    function getSubjects() {
        if (!profile || !profile.subjects ||
            typeof profile.subjects !== "object") {
            return [];
        }

        return Object.entries(profile.subjects)
            .filter(([name, value]) =>
                name.trim() !== "" &&
                Number.isFinite(Number(value))
            )
            .map(([name, value]) => ({
                name,
                completion: Math.min(100, Math.max(0, Number(value)))
            }));
    }

    function formatValue(value, suffix = "") {
        if (value === undefined || value === null || value === "") {
            return "Not available";
        }

        let str = String(value).trim().replace(/\+/g, "");

        if (suffix === "%") {
            return str.endsWith("%") ? safeText(str) : safeText(str) + "%";
        }

        return safeText(str) + suffix;
    }

    function renderProfile() {

        if (!profile) {
            $("studentName").textContent = "Student";
            $("profileAvatar").textContent = "S";

            $("totalSubjects").textContent = "—";
            $("averageCompletion").textContent = "—";
            $("attendanceValue").textContent = "—";
            $("studyHours").textContent = "—";

            $("subjectReport").innerHTML =
                showEmpty("No saved academic profile found. Please complete Academic Setup.");

            $("academicOverview").innerHTML =
                showEmpty("Academic information is not available.");

            $("learningReport").innerHTML =
                showEmpty("Complete Academic Setup to view learning progress.");

            $("goalsReport").innerHTML =
                showEmpty("No saved academic goals available.");

            $("consistencyReport").innerHTML =
                showEmpty("Study consistency information is not available.");

            return;
        }

        const studentName = profile.name || "Student";

        $("studentName").textContent = studentName;
        $("profileAvatar").textContent =
            studentName.charAt(0).toUpperCase();

        renderSummary();
        renderSubjects();
        renderOverview();
        renderLearning();
        renderGoals();
        renderConsistency();
    }

    function renderSummary() {

        const subjects = getSubjects();

        const average = subjects.length
            ? Math.round(
                subjects.reduce((sum, subject) =>
                    sum + subject.completion, 0
                ) / subjects.length
            )
            : null;

        $("totalSubjects").textContent = subjects.length;

        $("averageCompletion").textContent =
            average === null ? "—" : average + "%";

        $("attendanceValue").textContent =
            formatValue(profile.attendance, "%");

        $("studyHours").textContent =
            formatValue(profile.studyHours);
    }

    function renderSubjects() {

        const subjects = getSubjects();

        if (!subjects.length) {
            $("subjectReport").innerHTML =
                showEmpty("No subjects selected in Academic Setup.");
            return;
        }

        $("subjectReport").innerHTML = subjects.map(subject => {

            let status = "Not Started";

            if (subject.completion === 100) {
                status = "Completed";
            } else if (subject.completion > 0) {
                status = "In Progress";
            }

            return `
                <div class="subject-row">

                    <div class="subject-info">
                        <strong>${safeText(subject.name)}</strong>
                        <span>${subject.completion}%</span>
                    </div>

                    <div class="progress-track">
                        <div class="progress-fill"
                             style="width:${subject.completion}%">
                        </div>
                    </div>

                    <small class="subject-status">${status}</small>

                </div>
            `;
        }).join("");
    }

    function renderOverview() {

        const fields = [
            ["Education", profile.education],
            ["Study Area", profile.studyArea],
            ["Academic Year", profile.year],
            ["Attendance", profile.attendance, "%"],
            ["Preparation Level", profile.preparationLevel],
            ["Study Hours", profile.studyHours],
            ["Study Consistency", profile.consistency]
        ];

        $("academicOverview").innerHTML = fields.map(field => {

            return `
                <div class="overview-row">
                    <span>${safeText(field[0])}</span>
                    <strong>${formatValue(field[1], field[2] || "")}</strong>
                </div>
            `;

        }).join("");
    }

    function renderLearning() {

        const subjects = getSubjects();

        if (!subjects.length) {
            $("learningReport").innerHTML =
                showEmpty("No subject progress available.");
            return;
        }

        const completed = subjects.filter(
            subject => subject.completion === 100
        ).length;

        const inProgress = subjects.filter(
            subject =>
                subject.completion > 0 &&
                subject.completion < 100
        ).length;

        const notStarted = subjects.filter(
            subject => subject.completion === 0
        ).length;

        const items = [
            ["Completed Subjects", completed],
            ["Subjects In Progress", inProgress],
            ["Not Started", notStarted]
        ];

        $("learningReport").innerHTML = items.map(item => `
            <div class="report-line">
                <span>${item[0]}</span>
                <strong>${item[1]}</strong>
            </div>
        `).join("");
    }

    function renderGoals() {

        const goals = Array.isArray(profile.goals)
            ? profile.goals
            : [];

        if (!goals.length) {
            $("goalsReport").innerHTML =
                showEmpty("No academic goals added in Academic Setup.");
            return;
        }

        $("goalsReport").innerHTML = goals.map(goal => `
            <div class="goal-item">
                🎯 ${safeText(goal)}
            </div>
        `).join("");
    }

    function renderConsistency() {

        if (!profile.consistency) {
            $("consistencyReport").innerHTML =
                showEmpty("Study consistency information is not available.");
            return;
        }

        const raw = String(profile.consistency).trim();
        const numVal = Number(raw.replace("%", ""));

        if (Number.isFinite(numVal)) {
            $("consistencyReport").innerHTML = `
                <div class="consistency-value">
                    ${numVal}%
                </div>

                <div class="progress-track">
                    <div class="progress-fill"
                         style="width:${Math.min(100, Math.max(0, numVal))}%">
                    </div>
                </div>
            `;
        } else {
            $("consistencyReport").innerHTML = `
                <div class="consistency-value" style="font-size: 18px;">
                    ${safeText(raw)}
                </div>
            `;
        }
    }

    const downloadBtn = $("downloadReport");
    if (downloadBtn) {
        downloadBtn.addEventListener("click", function () {
            window.print();
        });
    }

    renderProfile();

});