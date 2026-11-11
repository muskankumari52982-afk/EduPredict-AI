document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // LOAD STUDENT PROFILE
    // =====================================

    const savedProfile = localStorage.getItem("eduPredictProfile");

    const profileName = document.getElementById("profileName");
    const profileAvatar = document.getElementById("profileAvatar");
    const systemStatus = document.getElementById("systemStatus");

    if (!savedProfile) {
        showEmptyProfile();
        return;
    }

    let profile;

    try {
        profile = JSON.parse(savedProfile);
    } catch (error) {
        showEmptyProfile();
        return;
    }

    if (!profile || !profile.subjects) {
        showEmptyProfile();
        return;
    }

    const studentName =
        profile.name ||
        localStorage.getItem("studentName") ||
        "Student";

    if (profileName) {
        profileName.textContent = studentName;
    }

    if (profileAvatar) {
        profileAvatar.textContent =
            studentName.charAt(0).toUpperCase();
    }

    if (systemStatus) {
        systemStatus.textContent = "Academic profile loaded";
    }

    // Only selected subjects from Academic Setup
    const subjects = Object.entries(profile.subjects)
        .filter(function ([name, completion]) {
            return name &&
                completion !== null &&
                completion !== undefined &&
                completion !== "";
        })
        .map(function ([name, completion]) {
            return {
                name: name,
                completion: Number(completion)
            };
        })
        .filter(function (subject) {
            return Number.isFinite(subject.completion);
        })
        .map(function (subject) {
            subject.completion = Math.min(
                100,
                Math.max(0, subject.completion)
            );

            return subject;
        });

    localStorage.setItem("lastVisitedPage", "learning");

    renderOverview(subjects, profile);
    renderSubjects(subjects);
    renderFocusAreas(subjects);
    renderGoals(profile.goals);

    setupStudyPlanner(subjects, profile);


    // =====================================
    // OVERVIEW CARDS
    // =====================================

    function renderOverview(subjects, profile) {

        const overviewGrid =
            document.getElementById("overviewGrid");

        if (!overviewGrid) return;

        overviewGrid.innerHTML = "";

        if (subjects.length > 0) {

            const total = subjects.reduce(function (sum, subject) {
                return sum + subject.completion;
            }, 0);

            const average = Math.round(total / subjects.length);

            addOverviewCard(
                "🎯",
                "Average Subject Completion",
                average + "%",
                "Based on your selected subjects",
                "purple"
            );

            addOverviewCard(
                "📚",
                "Selected Subjects",
                subjects.length,
                "Subjects added in Academic Setup",
                "blue"
            );
        }

        if (
            profile.studyHours !== undefined &&
            profile.studyHours !== null &&
            profile.studyHours !== ""
        ) {
            addOverviewCard(
                "📖",
                "Study Hours",
                profile.studyHours,
                "Your selected weekly study target",
                "blue"
            );
        }

        if (profile.consistency) {
            addOverviewCard(
                "🔥",
                "Study Consistency",
                profile.consistency,
                "Your selected consistency level",
                "green"
            );
        }
    }


    function addOverviewCard(icon, label, value, description, color) {

        const overviewGrid =
            document.getElementById("overviewGrid");

        const card = document.createElement("div");
        card.className = "overview-card " + color;

        const iconBox = document.createElement("div");
        iconBox.className = "card-icon";
        iconBox.textContent = icon;

        const content = document.createElement("div");

        const title = document.createElement("span");
        title.textContent = label;

        const strong = document.createElement("strong");
        strong.textContent = value;

        const small = document.createElement("small");
        small.textContent = description;

        content.append(title, strong, small);
        card.append(iconBox, content);

        overviewGrid.appendChild(card);
    }


    // =====================================
    // SELECTED SUBJECTS
    // =====================================

    function renderSubjects(subjects) {

        const planList = document.getElementById("planList");

        if (!planList) return;

        planList.innerHTML = "";

        if (subjects.length === 0) {
            planList.textContent =
                "No subjects selected. Please complete Academic Setup.";
            return;
        }

        subjects.forEach(function (subject) {

            const item = document.createElement("div");
            item.className = "plan-item";

            const icon = document.createElement("div");
            icon.className = "subject-icon";
            icon.textContent = getInitials(subject.name);

            const info = document.createElement("div");
            info.className = "plan-info";

            const heading = document.createElement("h3");
            heading.textContent = subject.name;

            const description = document.createElement("p");
            description.textContent = "Subject completion";

            const track = document.createElement("div");
            track.className = "progress-track";

            const fill = document.createElement("div");
            fill.className = "progress-fill";

            fill.style.width = subject.completion + "%";

            track.appendChild(fill);
            info.append(heading, description, track);

            const score = document.createElement("div");
            score.className = "plan-score";

            const scoreValue = document.createElement("strong");
            scoreValue.textContent = subject.completion + "%";

            const status = document.createElement("span");
            status.textContent = getStatus(subject.completion);

            score.append(scoreValue, status);

            item.append(icon, info, score);
            planList.appendChild(item);
        });
    }


    // =====================================
    // FOCUS AREAS
    // =====================================

    function renderFocusAreas(subjects) {

        const focusContainer =
            document.getElementById("focusSubjects");

        if (!focusContainer) return;

        focusContainer.innerHTML = "";

        const focusSubjects = subjects
            .filter(function (subject) {
                return subject.completion < 100;
            })
            .sort(function (a, b) {
                return a.completion - b.completion;
            });

        if (focusSubjects.length === 0) {
            focusContainer.textContent =
                subjects.length > 0
                    ? "All selected subjects are completed."
                    : "No subjects available.";

            return;
        }

        focusSubjects.forEach(function (subject, index) {

            const row = document.createElement("div");
            row.className = "focus-subject";

            const left = document.createElement("div");
            left.className = "focus-left";

            const rank = document.createElement("span");
            rank.className = "rank";
            rank.textContent =
                String(index + 1).padStart(2, "0");

            const details = document.createElement("div");

            const name = document.createElement("strong");
            name.textContent = subject.name;

            const completion = document.createElement("small");
            completion.textContent =
                "Completion: " + subject.completion + "%";

            details.append(name, completion);
            left.append(rank, details);

            const tag = document.createElement("span");
            tag.className = "focus-tag";

            if (subject.completion <= 25) {
                tag.classList.add("high");
                tag.textContent = "Needs Attention";
            } else if (subject.completion < 75) {
                tag.classList.add("medium");
                tag.textContent = "In Progress";
            } else {
                tag.classList.add("low");
                tag.textContent = "Almost Done";
            }

            row.append(left, tag);
            focusContainer.appendChild(row);
        });
    }


    // =====================================
    // ACADEMIC GOALS
    // =====================================

    function renderGoals(goals) {

        const goalsContainer =
            document.getElementById("academicGoals");

        if (!goalsContainer) return;

        goalsContainer.innerHTML = "";

        if (!Array.isArray(goals) || goals.length === 0) {
            goalsContainer.textContent =
                "No academic goals added in Academic Setup.";

            return;
        }

        const list = document.createElement("ul");

        goals.forEach(function (goal) {

            const item = document.createElement("li");
            item.textContent = goal;

            list.appendChild(item);
        });

        goalsContainer.appendChild(list);
    }


    // =====================================
    // SMART STUDY PLANNER
    // =====================================

    function setupStudyPlanner(subjects, profile) {

        const schedulePanel =
            document.querySelector(".schedule-panel");

        const scheduleList =
            document.getElementById("scheduleList");

        const contentGrid =
            document.querySelector(".content-grid");

        if (!schedulePanel || !scheduleList || !contentGrid) {
            return;
        }

        // Remove any previous generated weekly plan
        const oldWeeklyPlan =
            document.getElementById("weeklyStudyPlan");

        if (oldWeeklyPlan) {
            oldWeeklyPlan.remove();
        }

        // Add planner buttons
        const actions = document.createElement("div");
        actions.className = "planner-actions";
        actions.style.marginBottom = "18px";

        const generateButton = document.createElement("button");
        generateButton.className = "primary-btn";
        generateButton.textContent = "Generate Study Plan";
        generateButton.type = "button";

        const regenerateButton = document.createElement("button");
        regenerateButton.className = "secondary-btn";
        regenerateButton.textContent = "Regenerate";
        regenerateButton.type = "button";

        actions.append(generateButton, regenerateButton);

        const panelHeader =
            schedulePanel.querySelector(".panel-header");

        if (panelHeader) {
            panelHeader.after(actions);
        } else {
            schedulePanel.prepend(actions);
        }

        // Weekly plan container
        const weeklyPanel = document.createElement("div");
        weeklyPanel.id = "weeklyStudyPlan";
        weeklyPanel.className = "panel weekly-plan";

        const weeklyHeader = document.createElement("div");
        weeklyHeader.className = "panel-header";

        const weeklyTitle = document.createElement("div");

        const weeklyLabel = document.createElement("span");
        weeklyLabel.className = "section-label";
        weeklyLabel.textContent = "MONDAY - SUNDAY";

        const weeklyHeading = document.createElement("h2");
        weeklyHeading.textContent = "Weekly Study Plan";

        const weeklyDescription = document.createElement("p");
        weeklyDescription.textContent =
            "Your subject-wise study plan for the week.";

        weeklyTitle.append(
            weeklyLabel,
            weeklyHeading,
            weeklyDescription
        );

        weeklyHeader.appendChild(weeklyTitle);

        const weeklyGrid = document.createElement("div");
        weeklyGrid.id = "weeklyPlanGrid";
        weeklyGrid.className = "weekly-plan-grid";

        weeklyPanel.append(weeklyHeader, weeklyGrid);

        contentGrid.after(weeklyPanel);

        const plannerNote = document.createElement("p");
        plannerNote.className = "planner-note";
        plannerNote.textContent =
            "Study time is distributed according to your selected subjects and their completion levels.";

        scheduleList.before(plannerNote);

        // Generate plan on button click
        generateButton.addEventListener("click", generatePlans);
        regenerateButton.addEventListener("click", generatePlans);

        // Generate automatically when saved data is available
        if (subjects.length > 0 && getDailyStudyMinutes(profile) > 0) {
            generatePlans();
        } else {
            showPlannerMessage(
                "Please select your subjects and valid study hours in Academic Setup."
            );
        }


        // =====================================
        // GENERATE DAILY + WEEKLY PLANS
        // =====================================

        function generatePlans() {

            scheduleList.innerHTML = "";
            weeklyGrid.innerHTML = "";

            if (subjects.length === 0) {
                showPlannerMessage(
                    "No selected subjects available. Please complete Academic Setup."
                );
                return;
            }

            const dailyMinutes =
                getDailyStudyMinutes(profile);

            if (!dailyMinutes || dailyMinutes <= 0) {
                showPlannerMessage(
                    "Please set your study hours in Academic Setup before generating a timetable."
                );
                return;
            }

            const dailySessions =
                distributeStudyTime(subjects, dailyMinutes);

            renderDailySchedule(dailySessions);

            renderWeeklySchedule(
                subjects,
                dailyMinutes
            );

            const displayHours = (dailyMinutes / 60).toFixed(1);

            plannerNote.textContent =
                "Plan generated using your " +
                subjects.length +
                " selected subjects (~" + displayHours + " hours/day).";
        }


        // =====================================
        // DAILY SCHEDULE
        // =====================================

        function renderDailySchedule(sessions) {

            scheduleList.innerHTML = "";

            if (sessions.length === 0) {
                scheduleList.textContent =
                    "No study sessions available.";
                return;
            }

            sessions.forEach(function (session, index) {

                const item = document.createElement("div");
                item.className = "schedule-item";

                const time = document.createElement("div");
                time.className = "time";
                time.textContent = "Session " + (index + 1);

                const line = document.createElement("div");
                line.className = "schedule-line";

                const content = document.createElement("div");
                content.className = "schedule-content";

                const details = document.createElement("div");

                const heading = document.createElement("h3");
                heading.textContent = session.name;

                const description = document.createElement("p");
                description.textContent =
                    session.minutes + " minutes · " +
                    session.completion + "% completed";

                details.append(heading, description);

                const checkButton =
                    document.createElement("button");

                checkButton.type = "button";
                checkButton.className = "check-btn";
                checkButton.textContent = "○";

                const taskKey =
                    getDailyTaskKey(session.name);

                const isChecked =
                    localStorage.getItem(taskKey) === "true";

                if (isChecked) {
                    checkButton.classList.add("checked");
                    checkButton.textContent = "✓";
                    item.classList.add("completed");
                }

                checkButton.addEventListener("click", function () {

                    const checked =
                        checkButton.classList.toggle("checked");

                    checkButton.textContent =
                        checked ? "✓" : "○";

                    item.classList.toggle("completed", checked);

                    localStorage.setItem(
                        taskKey,
                        checked ? "true" : "false"
                    );
                });

                content.append(details, checkButton);
                item.append(time, line, content);

                scheduleList.appendChild(item);
            });
        }


        // =====================================
        // WEEKLY STUDY PLAN
        // =====================================

        function renderWeeklySchedule(subjects, dailyMinutes) {

            const days = [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
            ];

            weeklyGrid.innerHTML = "";

            days.forEach(function (day, dayIndex) {

                const dayCard = document.createElement("div");
                dayCard.className = "weekly-day";

                const heading = document.createElement("h3");
                heading.textContent = day;

                const sessionsContainer =
                    document.createElement("div");

                const orderedSubjects = [...subjects].sort(
                    function (a, b) {
                        return getPriority(b) - getPriority(a);
                    }
                );

                // Rotate subject order across the week
                const rotation =
                    dayIndex % orderedSubjects.length;

                const rotatedSubjects =
                    orderedSubjects.slice(rotation).concat(
                        orderedSubjects.slice(0, rotation)
                    );

                const dailySessions =
                    distributeStudyTime(
                        rotatedSubjects,
                        dailyMinutes
                    );

                dailySessions.forEach(function (session) {

                    const sessionRow =
                        document.createElement("div");

                    sessionRow.className = "weekly-session";

                    const details = document.createElement("div");

                    const name = document.createElement("strong");
                    name.textContent = session.name;

                    const completion =
                        document.createElement("small");

                    completion.textContent =
                        session.completion + "% completed";

                    details.append(name, completion);

                    const duration =
                        document.createElement("span");

                    duration.className =
                        "weekly-session-duration";

                    duration.textContent =
                        session.minutes + " min";

                    sessionRow.append(details, duration);
                    sessionsContainer.appendChild(sessionRow);
                });

                const displayHours = (dailyMinutes / 60).toFixed(1);

                const note = document.createElement("p");
                note.className = "planner-note";
                note.textContent =
                    dailyMinutes + " min (" + displayHours + " hrs) planned";

                dayCard.append(
                    heading,
                    sessionsContainer,
                    note
                );

                weeklyGrid.appendChild(dayCard);
            });
        }


        // =====================================
        // STUDY TIME DISTRIBUTION
        // =====================================

        function distributeStudyTime(subjectList, totalMinutes) {

            if (!subjectList.length || totalMinutes <= 0) {
                return [];
            }

            const weights = subjectList.map(function (subject) {
                return getPriority(subject);
            });

            const totalWeight = weights.reduce(
                function (sum, weight) {
                    return sum + weight;
                },
                0
            );

            let remainingMinutes = totalMinutes;

            return subjectList.map(function (subject, index) {

                let minutes;

                if (index === subjectList.length - 1) {
                    minutes = remainingMinutes;
                } else {
                    minutes = Math.round(
                        totalMinutes *
                        weights[index] /
                        totalWeight
                    );

                    remainingMinutes -= minutes;
                }

                return {
                    name: subject.name,
                    completion: subject.completion,
                    minutes: minutes
                };
            });
        }


        // Lower completion means higher priority
        function getPriority(subject) {

            return Math.max(
                1,
                100 - subject.completion
            );
        }


        // =====================================
        // DAILY STUDY HOURS (WITH MAX 8-10 HR CAP)
        // =====================================

        function getDailyStudyMinutes(profile) {

            const value = profile.studyHours;

            if (
                value === undefined ||
                value === null ||
                value === ""
            ) {
                return 210; // Default: ~3.5 hours/day
            }

            const text = String(value);

            const numbers = text.match(/\d+(\.\d+)?/g);

            if (!numbers || numbers.length === 0) {
                return 210;
            }

            let parsedHours;

            if (numbers.length >= 2 && text.includes("-")) {
                parsedHours = (
                    Number(numbers[0]) +
                    Number(numbers[1])
                ) / 2;
            } else {
                parsedHours = Number(numbers[0]);
            }

            if (!Number.isFinite(parsedHours) || parsedHours <= 0) {
                return 210;
            }

            // SMART CONVERSION:
            // If parsedHours > 12, it represents Weekly Hours (e.g. 25 hrs/week)
            // Divide weekly hours across 7 days to get daily hours
            let dailyHours = parsedHours;
            if (parsedHours > 12) {
                dailyHours = parsedHours / 7;
            }

            // STRICT DAILY CAP: Max 8 hours per day (480 minutes)
            dailyHours = Math.min(dailyHours, 8);

            return Math.round(dailyHours * 60);
        }


        // =====================================
        // TASK STORAGE
        // =====================================

        function getDailyTaskKey(subjectName) {

            const today = new Date();

            const dateKey =
                today.getFullYear() + "-" +
                String(today.getMonth() + 1).padStart(2, "0") + "-" +
                String(today.getDate()).padStart(2, "0");

            return (
                "eduPredictDailyTask_" +
                dateKey + "_" +
                subjectName
            );
        }


        // =====================================
        // PLANNER MESSAGES
        // =====================================

        function showPlannerMessage(message) {

            scheduleList.innerHTML = "";

            const dailyMessage = document.createElement("p");
            dailyMessage.textContent = message;

            scheduleList.appendChild(dailyMessage);

            weeklyGrid.innerHTML = "";

            const weeklyMessage = document.createElement("p");
            weeklyMessage.className = "weekly-empty";
            weeklyMessage.textContent = message;

            weeklyGrid.appendChild(weeklyMessage);

            plannerNote.textContent =
                "Complete your Academic Setup to generate a personalized study plan.";
        }
    }


    // =====================================
    // COMMON HELPERS
    // =====================================

    function getInitials(subjectName) {

        const words = subjectName.trim().split(/\s+/);

        if (words.length === 1) {
            return words[0].substring(0, 2).toUpperCase();
        }

        return (
            words[0].charAt(0) +
            words[1].charAt(0)
        ).toUpperCase();
    }


    function getStatus(completion) {

        if (completion === 100) return "Completed";
        if (completion === 0) return "Not Started";

        return "In Progress";
    }


    function showEmptyProfile() {

        const planList =
            document.getElementById("planList");

        const overviewGrid =
            document.getElementById("overviewGrid");

        const focusSubjects =
            document.getElementById("focusSubjects");

        const goals =
            document.getElementById("academicGoals");

        const systemStatus =
            document.getElementById("systemStatus");

        const scheduleList =
            document.getElementById("scheduleList");

        if (planList) {
            planList.textContent =
                "Please complete Academic Setup to view your learning plan.";
        }

        if (overviewGrid) {
            overviewGrid.innerHTML = "";
        }

        if (focusSubjects) {
            focusSubjects.textContent =
                "No academic data available.";
        }

        if (goals) {
            goals.textContent =
                "No academic goals available.";
        }

        if (scheduleList) {
            scheduleList.textContent =
                "Complete Academic Setup to generate your study schedule.";
        }

        if (systemStatus) {
            systemStatus.textContent =
                "Academic profile not found";
        }
    }


    console.log(
        "EduPredict AI Learning Planner loaded successfully."
    );

});