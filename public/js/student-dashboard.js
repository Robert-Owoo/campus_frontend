document.addEventListener('DOMContentLoaded', async () => {
    const studentName = document.getElementById('studentName');
    const applicationsTableBody = document.getElementById('applicationsTableBody');
    const assignmentDetails = document.getElementById('assignmentDetails');

    // Set student name
    const user = getUser();
    if (user) {
        studentName.textContent = user.name;
    }

    // Load applications
    try {
        const response = await apiRequest('/applications/me');
        const applications = response.data;

        applicationsTableBody.innerHTML = applications.map(app => `
            <tr>
                <td>${app.hostel.name}</td>
                <td>${app.preferredRoomType}</td>
                <td>${app.status}</td>
                <td>${new Date(app.createdAt).toLocaleDateString()}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading applications:', error);
    }

    // Load assignment
    try {
        const response = await apiRequest('/assignments/me');
        const assignments = response.data;

        if (assignments.length > 0) {
            const assignment = assignments[0];
            assignmentDetails.innerHTML = `
                <h4>Room Details</h4>
                <p><strong>Hostel:</strong> ${assignment.room.hostel.name}</p>
                <p><strong>Room Number:</strong> ${assignment.room.roomNumber}</p>
                <p><strong>Type:</strong> ${assignment.room.type}</p>
                <p><strong>Period:</strong> ${new Date(assignment.startDate).toLocaleDateString()} to ${new Date(assignment.endDate).toLocaleDateString()}</p>
                <p><strong>Status:</strong> ${assignment.status}</p>
            `;
        } else {
            assignmentDetails.innerHTML = '<p>No room assignment found.</p>';
        }
    } catch (error) {
        console.error('Error loading assignment:', error);
    }
}); 