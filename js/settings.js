document.addEventListener("DOMContentLoaded", () => {
    // Get existing data safely
    let currentData = {};
    try {
        if (typeof EduData !== "undefined" && EduData.getStudentData) {
            currentData = EduData.getStudentData();
        } else {
            const raw = localStorage.getItem("eduPredictData");
            currentData = raw ? JSON.parse(raw) : {};
        }
    } catch (e) {
        currentData = {};
    }

    const profile = currentData.profile || {};
    const overview = currentData.overview || {};

    // DOM Elements
    const studentNameInput = document.getElementById("studentNameInput");
    const educationLevelSelect = document.getElementById("educationLevelSelect");
    const studyAreaInput = document.getElementById("studyAreaInput");
    const profileNameDisplay = document.getElementById("profileNameDisplay");
    const avatarBadge = document.getElementById("avatarBadge");

    const targetStudyHoursInput = document.getElementById("targetStudyHoursInput");
    const saveSettingsBtn = document.getElementById("saveSettingsBtn");
    const saveStatus = document.getElementById("saveStatus");
    const resetDataBtn = document.getElementById("resetDataBtn");

    // Load initial values into inputs if available
    if (profile.name && studentNameInput) studentNameInput.value = profile.name;
    if (profile.educationLevel && educationLevelSelect) educationLevelSelect.value = profile.educationLevel;
    if (profile.studyArea && studyAreaInput) studyAreaInput.value = profile.studyArea;
    if (overview.weeklyStudyHours && targetStudyHoursInput) targetStudyHoursInput.value = overview.weeklyStudyHours;

    if (profile.name && profileNameDisplay) profileNameDisplay.textContent = profile.name;
    if (profile.name && avatarBadge) avatarBadge.textContent = profile.name.charAt(0).toUpperCase();

    // Save Button Event
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener("click", () => {
            const updatedName = studentNameInput ? studentNameInput.value.trim() : "Muskan Kumari";
            const updatedEdu = educationLevelSelect ? educationLevelSelect.value : "Undergraduate";
            const updatedArea = studyAreaInput ? studyAreaInput.value.trim() : "AI / Data Science";
            const updatedHours = targetStudyHoursInput ? parseInt(targetStudyHoursInput.value) || 25 : 25;

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

            // Save back to storage
            if (typeof EduData !== "undefined" && EduData.saveStudentData) {
                EduData.saveStudentData(currentData);
            } else {
                localStorage.setItem("eduPredictData", JSON.stringify(currentData));
            }

            // Update UI Header
            if (profileNameDisplay) profileNameDisplay.textContent = updatedName;
            if (avatarBadge) avatarBadge.textContent = updatedName.charAt(0).toUpperCase();

            // Status message
            if (saveStatus) {
                saveStatus.textContent = "✓ Settings saved successfully!";
                setTimeout(() => { saveStatus.textContent = ""; }, 3000);
            }
        });
    }

    // Reset Data Event
    if (resetDataBtn) {
        resetDataBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to reset stored student data?")) {
                localStorage.removeItem("eduPredictData");
                alert("Data cleared. Refreshing page...");
                location.reload();
            }
        });
    }
});