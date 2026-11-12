document.addEventListener("DOMContentLoaded", () => {
    let profile = {};
    let currentData = {};

    try {
        const rawProfile = localStorage.getItem("eduPredictProfile");
        if (rawProfile) profile = JSON.parse(rawProfile);

        const rawData = localStorage.getItem("eduPredictData");
        if (rawData) currentData = JSON.parse(rawData);
    } catch (e) {
        profile = {};
        currentData = {};
    }

    const studentNameInput = document.getElementById("studentNameInput");
    const educationLevelSelect = document.getElementById("educationLevelSelect");
    const studyAreaInput = document.getElementById("studyAreaInput");
    const profileNameDisplay = document.getElementById("profileNameDisplay");
    const avatarBadge = document.getElementById("avatarBadge");
    const targetStudyHoursInput = document.getElementById("targetStudyHoursInput");
    const saveSettingsBtn = document.getElementById("saveSettingsBtn");
    const saveStatus = document.getElementById("saveStatus");
    const resetDataBtn = document.getElementById("resetDataBtn");

    const activeName =
        profile.name ||
        localStorage.getItem("studentName") ||
        (currentData.profile && currentData.profile.name) ||
        "Student";

    const activeEdu =
        profile.education ||
        profile.educationLevel ||
        (currentData.profile && currentData.profile.educationLevel) ||
        "";

    const activeArea =
        profile.studyArea ||
        (currentData.profile && currentData.profile.studyArea) ||
        "";

    const rawHours =
        profile.studyHours !== undefined
            ? profile.studyHours
            : currentData.overview && currentData.overview.weeklyStudyHours;

    const numericHours = rawHours
        ? String(rawHours).replace(/\D/g, "")
        : "";

    if (studentNameInput) studentNameInput.value = activeName !== "Student" ? activeName : "";
    if (studyAreaInput) studyAreaInput.value = activeArea;
    if (targetStudyHoursInput && numericHours) targetStudyHoursInput.value = numericHours;

    if (educationLevelSelect && activeEdu) {
        const normalizedEdu = activeEdu.toLowerCase();
        for (let i = 0; i < educationLevelSelect.options.length; i++) {
            const optVal = educationLevelSelect.options[i].value.toLowerCase();
            const optText = educationLevelSelect.options[i].text.toLowerCase();
            if (optVal.includes(normalizedEdu) || optText.includes(normalizedEdu) || normalizedEdu.includes(optVal)) {
                educationLevelSelect.selectedIndex = i;
                break;
            }
        }
    }

    if (profileNameDisplay) profileNameDisplay.textContent = activeName;
    if (avatarBadge) avatarBadge.textContent = activeName.charAt(0).toUpperCase();

    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener("click", () => {
            const updatedName = studentNameInput && studentNameInput.value.trim()
                ? studentNameInput.value.trim()
                : activeName;
            const updatedEdu = educationLevelSelect ? educationLevelSelect.value : activeEdu;
            const updatedArea = studyAreaInput ? studyAreaInput.value.trim() : activeArea;
            const updatedHours = targetStudyHoursInput ? parseInt(targetStudyHoursInput.value, 10) || 25 : 25;

            profile = {
                ...profile,
                name: updatedName,
                education: updatedEdu,
                educationLevel: updatedEdu,
                studyArea: updatedArea,
                studyHours: updatedHours
            };

            localStorage.setItem("eduPredictProfile", JSON.stringify(profile));
            localStorage.setItem("studentName", updatedName);

            currentData.profile = {
                ...currentData.profile,
                name: updatedName,
                educationLevel: updatedEdu,
                studyArea: updatedArea
            };

            currentData.overview = {
                ...currentData.overview,
                weeklyStudyHours: updatedHours
            };

            if (typeof EduData !== "undefined" && EduData.saveStudentData) {
                EduData.saveStudentData(currentData);
            } else {
                localStorage.setItem("eduPredictData", JSON.stringify(currentData));
            }

            if (profileNameDisplay) profileNameDisplay.textContent = updatedName;
            if (avatarBadge) avatarBadge.textContent = updatedName.charAt(0).toUpperCase();

            if (saveStatus) {
                saveStatus.textContent = "✓ Settings saved successfully!";
                setTimeout(() => { saveStatus.textContent = ""; }, 3000);
            }
        });
    }

    if (resetDataBtn) {
        resetDataBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to reset stored student data?")) {
                localStorage.removeItem("eduPredictData");
                localStorage.removeItem("eduPredictProfile");
                localStorage.removeItem("studentName");
                alert("Data cleared. Refreshing page...");
                location.reload();
            }
        });
    }
});